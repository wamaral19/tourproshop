/**
 * The access gate in front of the full site.
 *
 * This is the entry point for the `preview` environment only — the worker that
 * serves the full storefront while the public one stays locked down. The public
 * worker points `main` straight at `.open-next/worker.js` and is not gated by
 * anything here.
 *
 * Why an entry wrapper and not middleware: the same reason lockdown enforcement
 * lives in the pages. Next 16 runs Proxy on the Node.js runtime and refuses the
 * `runtime` option, and @opennextjs/cloudflare won't bundle Node middleware, so
 * there is no request chokepoint inside the app. There is one *outside* it — the
 * Worker's own fetch handler — and this file is it. Everything the Worker serves
 * passes through here, including static assets, because the preview environment
 * sets `run_worker_first: true`.
 *
 * How it works:
 *
 *   1. A visitor with no session gets the password page. They type one of the passwords
 *      from `preview_passwords` (which stores SHA-256 hashes, never the passwords).
 *   2. On a match the gate records the sign-in and sets a signed session cookie.
 *   3. Every later request verifies that cookie with an HMAC — no database read,
 *      so the gate costs nothing on the asset requests that make up most of the
 *      traffic. Page views are logged in the background.
 *
 * Fails closed. Missing bindings serve nothing at all, so a half-finished setup
 * can't quietly publish the full roster.
 */
import openNextWorker from "./.open-next/worker.js";

// Durable Object classes and any other named exports the adapter generates.
// `export *` deliberately does not carry the default export — that one is
// wrapped below.
export * from "./.open-next/worker.js";

const LOGIN_PATH = "/__preview-login";
const COOKIE_NAME = "tps_preview";

/**
 * How long a session lasts before the password has to be typed again.
 *
 * Every sign-in is a row in the log, so this is also what decides the
 * granularity of "who came back": at 7 days a weekly visitor shows one sign-in
 * per visit, while a much longer session would show one ever. Individual page
 * views are logged throughout regardless.
 */
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

const encoder = new TextEncoder();

/* -------------------------------------------------------------------------- */
/* Crypto                                                                      */
/* -------------------------------------------------------------------------- */

async function sha256Hex(input) {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(input));
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Passwords are matched case-insensitively and ignoring surrounding whitespace.
 *
 * They get typed by hand off a phone, and a capitalized first letter from an
 * autocorrecting keyboard shouldn't lock someone out. The seed script applies
 * exactly this normalization before hashing, and refuses a CSV whose passwords
 * collide under it.
 */
function normalizePassword(password) {
  return password.trim().toLowerCase();
}

let signingKeyPromise;
function getSigningKey(secret) {
  signingKeyPromise ??= crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return signingKeyPromise;
}

function toBase64Url(bytes) {
  return btoa(String.fromCharCode(...new Uint8Array(bytes)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function sign(payload, secret) {
  const key = await getSigningKey(secret);
  return toBase64Url(await crypto.subtle.sign("HMAC", key, encoder.encode(payload)));
}

/** Constant-time compare of two same-length ASCII strings. */
function safeEqual(a, b) {
  const x = encoder.encode(a);
  const y = encoder.encode(b);
  if (x.length !== y.length) return false;
  return crypto.subtle.timingSafeEqual(x, y);
}

/* -------------------------------------------------------------------------- */
/* Session cookie                                                              */
/* -------------------------------------------------------------------------- */

async function issueSession(passwordId, secret) {
  const expires = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = `v1.${passwordId}.${expires}`;
  return `${payload}.${await sign(payload, secret)}`;
}

/** @returns {Promise<{ passwordId: number } | null>} */
async function readSession(request, secret) {
  const cookies = request.headers.get("Cookie");
  if (!cookies) return null;
  const match = cookies.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]+)`));
  if (!match) return null;

  const parts = match[1].split(".");
  if (parts.length !== 4 || parts[0] !== "v1") return null;
  const [, id, expires, signature] = parts;

  if (!/^\d+$/.test(id) || !/^\d+$/.test(expires)) return null;
  if (Number(expires) <= Math.floor(Date.now() / 1000)) return null;

  const expected = await sign(`v1.${id}.${expires}`, secret);
  if (!safeEqual(signature, expected)) return null;

  return { passwordId: Number(id) };
}

function sessionCookie(value) {
  return (
    `${COOKIE_NAME}=${value}; Path=/; Max-Age=${SESSION_TTL_SECONDS}; ` +
    "HttpOnly; Secure; SameSite=Lax"
  );
}

/* -------------------------------------------------------------------------- */
/* Logging                                                                     */
/* -------------------------------------------------------------------------- */

function requestContext(request, url) {
  const cf = request.cf ?? {};
  return {
    path: url.pathname + url.search,
    ip: request.headers.get("CF-Connecting-IP"),
    country: cf.country ?? null,
    region: cf.region ?? null,
    city: cf.city ?? null,
    userAgent: request.headers.get("User-Agent"),
    referrer: request.headers.get("Referer"),
  };
}

function logStatement(db, passwordId, event, context) {
  return db
    .prepare(
      `INSERT INTO preview_access_log
         (password_id, event, path, ip, country, region, city, user_agent, referrer)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      passwordId,
      event,
      context.path,
      context.ip,
      context.country,
      context.region,
      context.city,
      context.userAgent,
      context.referrer,
    );
}

/**
 * Whether this request is a page the visitor is looking at, rather than one of
 * the dozens of assets that page pulls in. Only these are logged as views —
 * otherwise a single page load would bury the log under its own stylesheets.
 *
 * Decided on the shape of the path rather than the `Accept` header: the header
 * is whatever the client chose to send, and anything that isn't a browser
 * (curl, a link checker) would silently stop being counted.
 */
function isPageView(request, url) {
  if (request.method !== "GET") return false;

  const path = url.pathname;
  if (path === LOGIN_PATH) return false;
  if (path.startsWith("/_next/")) return false;
  if (path.startsWith("/media/")) return false;
  if (path.startsWith("/api/")) return false;

  // A file extension means an asset: /logo.svg, /favicon.ico, /icon.png.
  if (/\.[a-z0-9]{1,5}$/i.test(path)) return false;

  // Next prefetches links the visitor hasn't clicked. Those aren't views.
  if (request.headers.get("Next-Router-Prefetch") === "1") return false;

  return true;
}

/* -------------------------------------------------------------------------- */
/* The password page                                                               */
/* -------------------------------------------------------------------------- */

function escapeHtml(s) {
  return s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  );
}

/**
 * Served inline rather than as a Next route, and with no external assets: the
 * app's own CSS and fonts live behind this gate, so a login page that reached
 * for them would have to punch a hole in it.
 */
function passwordPage({ error, next, status }) {
  const body = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Tour Pro Shop — Private preview</title>
<style>
  :root {
    --cream: oklch(96% 0.012 85);
    --ink: oklch(14% 0.005 85);
    --ink-soft: oklch(46% 0.008 85);
    --green: oklch(38% 0.1 145);
    --green-deep: oklch(33% 0.09 145);
    --flag: oklch(42% 0.17 25);
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: 2rem 1.25rem;
    background: var(--cream);
    color: var(--ink);
    font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  main { width: 100%; max-width: 25rem; text-align: center; }
  .mark {
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--green-deep);
  }
  h1 {
    margin: 1.75rem 0 0.5rem;
    font-size: 1.5rem;
    font-weight: 600;
    letter-spacing: -0.01em;
  }
  p.lede {
    margin: 0 0 2rem;
    color: var(--ink-soft);
    font-size: 0.9375rem;
    line-height: 1.6;
  }
  form { display: flex; flex-direction: column; gap: 0.75rem; }
  label {
    text-align: left;
    font-size: 0.6875rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--ink-soft);
  }
  input {
    width: 100%;
    padding: 0.8125rem 0.9375rem;
    font: inherit;
    font-size: 1rem;
    letter-spacing: 0.04em;
    color: var(--ink);
    background: #fff;
    border: 1px solid color-mix(in oklch, var(--ink) 18%, transparent);
    border-radius: 0.375rem;
  }
  input:focus {
    outline: 2px solid var(--green);
    outline-offset: 1px;
    border-color: transparent;
  }
  button {
    padding: 0.8125rem 1rem;
    font: inherit;
    font-size: 0.9375rem;
    font-weight: 600;
    color: var(--cream);
    background: var(--green);
    border: 0;
    border-radius: 0.375rem;
    cursor: pointer;
  }
  button:hover { background: var(--green-deep); }
  .error {
    margin: 0;
    text-align: left;
    font-size: 0.875rem;
    color: var(--flag);
  }
  footer {
    margin-top: 2.5rem;
    font-size: 0.8125rem;
    color: var(--ink-soft);
  }
  footer a { color: inherit; }
</style>
</head>
<body>
  <main>
    <div class="mark">Tour Pro Shop</div>
    <h1>This preview is private</h1>
    <p class="lede">Enter the password you were sent to see the full site.</p>
    <form method="post" action="${LOGIN_PATH}">
      <input type="hidden" name="next" value="${escapeHtml(next)}">
      <label for="password">Password</label>
      <input id="password" name="password" type="text" autofocus required
             autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false">
      ${error ? `<p class="error">${escapeHtml(error)}</p>` : ""}
      <button type="submit">Enter</button>
    </form>
    <footer>Don't have one? <a href="mailto:wyatt@tourpro.shop">Get in touch</a>.</footer>
  </main>
</body>
</html>`;

  return new Response(body, {
    status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}

function plain(message, status) {
  return new Response(message, {
    status,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}

/** Same-origin paths only — never redirect off the site after sign-in. */
function safeNext(value) {
  if (typeof value !== "string") return "/";
  if (!value.startsWith("/") || value.startsWith("//")) return "/";
  return value;
}

/* -------------------------------------------------------------------------- */
/* Sign-in                                                                     */
/* -------------------------------------------------------------------------- */

async function handleLogin(request, env, ctx, url) {
  const context = requestContext(request, url);

  // Blunts guessing at the door: the passwords are only as strong as the number of
  // tries someone gets. Optional binding, so a config without it still works.
  if (env.PREVIEW_LOGIN_LIMITER) {
    const { success } = await env.PREVIEW_LOGIN_LIMITER.limit({
      key: context.ip ?? "unknown",
    });
    if (!success) {
      return plain("Too many attempts. Wait a minute and try again.", 429);
    }
  }

  let form;
  try {
    form = await request.formData();
  } catch {
    return passwordPage({ error: "Something went wrong. Try again.", next: "/", status: 400 });
  }

  const next = safeNext(form.get("next"));
  const submitted = normalizePassword(String(form.get("password") ?? ""));
  if (!submitted) {
    return passwordPage({ error: "Enter your password.", next, status: 400 });
  }

  const db = env.OUTREACH_DB;
  const row = await db
    .prepare(
      `SELECT id FROM preview_passwords
        WHERE password_hash = ? AND revoked_at IS NULL`,
    )
    .bind(await sha256Hex(submitted))
    .first();

  if (!row) {
    ctx.waitUntil(logStatement(db, null, "denied", context).run());
    return passwordPage({
      error: "That password wasn't recognized.",
      next,
      status: 401,
    });
  }

  ctx.waitUntil(
    db.batch([
      logStatement(db, row.id, "signin", context),
      db
        .prepare(
          `UPDATE preview_passwords
              SET uses = uses + 1, last_used_at = unixepoch()
            WHERE id = ?`,
        )
        .bind(row.id),
    ]),
  );

  return new Response(null, {
    status: 303,
    headers: {
      Location: next,
      "Set-Cookie": sessionCookie(await issueSession(row.id, env.PREVIEW_SESSION_SECRET)),
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}

/* -------------------------------------------------------------------------- */

const gate = {
  async fetch(request, env, ctx) {
    if (!env.PREVIEW_SESSION_SECRET || !env.OUTREACH_DB) {
      return plain(
        "This preview is not configured. Set the PREVIEW_SESSION_SECRET secret " +
          "on the tourproshop-preview worker and apply migration 0006.",
        503,
      );
    }

    const url = new URL(request.url);

    if (url.pathname === LOGIN_PATH) {
      if (request.method !== "POST") {
        return passwordPage({ error: null, next: "/", status: 405 });
      }
      return handleLogin(request, env, ctx, url);
    }

    const session = await readSession(request, env.PREVIEW_SESSION_SECRET);
    if (!session) {
      // 401 rather than 200: this is a refusal to serve, and it keeps anything
      // that isn't a browser from mistaking the password page for the site.
      return passwordPage({
        error: null,
        next: safeNext(url.pathname + url.search),
        status: 401,
      });
    }

    if (isPageView(request, url)) {
      ctx.waitUntil(
        logStatement(env.OUTREACH_DB, session.passwordId, "view", requestContext(request, url)).run(),
      );
    }

    const response = await openNextWorker.fetch(request, env, ctx);

    // Belt and braces with the 401 above: nothing here should ever be indexed.
    const gated = new Response(response.body, response);
    gated.headers.set("X-Robots-Tag", "noindex, nofollow");
    return gated;
  },
};

export default gate;
