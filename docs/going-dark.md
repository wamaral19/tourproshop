# Going dark

Two levers, for two different situations — and a way to keep showing the full
site to people you choose while it's down.

| Situation | Lever | Blast radius |
|---|---|---|
| One player needs to come off the site | `HIDDEN_PLAYERS` in `lib/players.ts` | That player, everywhere |
| Every player needs to come off the site | `SITE_MODE` at build time | The whole storefront |
| One photo can't be on the public site | [`DARK_HIDDEN_MEDIA`](#withholding-a-single-photo) in `lib/dark-media.ts` | That file, dark build only |
| Someone still needs to see the full site | [the private preview](#3-the-full-site-behind-a-password) | Nothing public changes |

Nothing here deletes anything, and nothing here is undone by editing content
back in.

---

## 1. Taking one player dark

Add their slug to `HIDDEN_PLAYERS` in [`lib/players.ts`](../lib/players.ts):

```ts
export const HIDDEN_PLAYERS: ReadonlySet<string> = new Set([
  "sungjae-im",
  "wyndham-clark",
  "their-slug-here",   // ← add
]);
```

Slugs live in [`data/owgr.json`](../data/owgr.json) and are the player's name
lowercased and hyphenated, accents stripped: `Ludvig Åberg` → `ludvig-aberg`.

That single edit removes them from:

- the roster and the browse grid (`getRoster` filters on it)
- `/players`, `/players?tier=exclusive`, and their player page (404)
- the shop, filtered shop links, related rails, and their PDPs (404)
- the home exclusives rail and the home category tiles
- the `/waitlist` carousel
- the sponsor-callout hero on `/agents`, `/apparel`, and `/sponsors`
- the sponsor-placement figures on `/agents` and `/for-players`
- tagged items on `/graveyard-signals`
- their private pitch page under `/p/*`, if they have one (404)

The marketing pages manage this by resolving their imagery through
[`lib/marketing-assets.ts`](../lib/marketing-assets.ts) instead of hardcoding a
path. Each image is attributed to a player and sits in a fallback chain, so a
dark player drops out and the next live example slides into their slot. Nothing
on those pages needs editing by hand.

### Then run the audit

```
npm run audit:dark
```

What the chains cannot reach is prose, one-off pages, and files on disk whose
*names* carry a player's name. The audit is the net for those. It prints three
sections:

- **NEEDS AN EDIT** — code or copy naming a dark player, in a file that has no
  idea they're dark. Exits `1`. These are real edits: usually a sentence to
  rewrite. `app/why/page.tsx` is the known one — it tells a story about a
  specific player by name.
- **Handled automatically** — files that name the player on purpose and drop
  them at render time. Informational.
- **Files on disk** — assets under `public/` whose paths spell the player's
  name. See [Assets](#assets) below.

### Restoring

Remove the slug. If the player was pulled back in stages, restoring is a ladder:
taking them out of `HIDDEN_PLAYERS` returns them to whatever state the rest of
their data describes. For a full relist also check `relationship: "exclusive"`
in `data/owgr.json` and `visible: true` on their products in `lib/products.ts`.

---

## 2. Full lockdown

Locked down is the **default**, and there is nothing to flip: `npm run build`
with nothing set produces the dark site, and that is what
`.github/workflows/deploy.yml` ships to `tourproshop` on every push to `main`.

```bash
npm run build                 # locked
SITE_MODE=full npm run build  # the storefront, for the private preview
```

A build that forgets to say what it is comes out dark, not naked. The flags land
in `lib/site-mode.generated.ts` (written by `scripts/generate-site-mode.mjs`) as
plain constants, so `LOCKDOWN` is still a literal by the time Next compiles it
and the bundler can drop the branches it guards.

To take the site down when it isn't already: nothing to do. To bring it back,
see [Lifting it](#lifting-it).

### What happens

`/` and `/waitlist` render the coming-soon notice: the "these pages are coming
soon" copy, the rights-holder contact line, and the waitlist form. No player
name, product, or link into a blocked route appears in the HTML.

Everything else 307-redirects to `/`. The allowlist in `lib/site-mode.ts` is:

| Route | Why it stays |
|---|---|
| `/` | The notice |
| `/waitlist` | Same notice, own URL — live ad campaigns point here, and redirecting would break Meta's landing-page matching. The `?ad=` tag survives. |
| `/waitlist-confirmed` | So the signup form completes |
| `/contact` | No player content; gives people a way to reach us |
| `/api/*` | Keeps the signup endpoint alive |
| `/admin/*` | Token-gated (`OUTREACH_ADMIN_TOKEN`) |
| `/r/*`, `/s/*`, `/a/*` | Outreach click trackers; their destinations get caught on the next hop |

The header drops Shop, Players and TPS Exclusives, and the footer loses its
columns of links into the shop and the roster — that is what takes them out of
the directory. `enforceLockdown()` in [`lib/lockdown.ts`](../lib/lockdown.ts),
called at the top of each blocked page, is what stops anyone reaching them by
URL.

The redirect is a **307**, not a 308 — lockdown is temporary and a permanent
redirect would get cached past the flag flip.

### Why this isn't middleware

It was, and that was better: one edge-side allowlist in `proxy.ts`, so a page
added later was dark by default. It does not work on this stack. Next 16 runs
Proxy on the Node.js runtime and **refuses the `runtime` config option**, so it
can't be moved back to Edge — and `@opennextjs/cloudflare` exits with "Node.js
middleware is not currently supported" at bundle time. The deploy fails after a
clean `next build`, which is a confusing place to discover it.

So enforcement lives in the pages. To keep the property that made the allowlist
worth having, `scripts/check-lockdown-coverage.mjs` runs as part of `npm run
build` and fails it if any `app/**/page.tsx` is neither on the allowlist nor
calling `enforceLockdown()`. Adding a page during a lockdown stops the build
rather than quietly serving.

**Adding a page while locked down**: put its route in `ALLOWED_EXACT` if it
should stay up, or call `enforceLockdown()` as the first statement of its
component if it shouldn't.

### Lifting it

Build with `SITE_MODE=full`. Nothing else changes; no content was deleted.

---

## 3. The full site, behind a password

The lockdown is what the public sees. The full storefront still runs, on a
second worker, behind a password — so you can show it to someone without
lifting the lockdown for everyone.

Both come from the same commit. There is no branch to keep in sync: the flags
arrive from the build environment, and locked is what you get if nothing says
otherwise.

| | Public | Private preview |
|---|---|---|
| Address | `tourpro.shop` | `preview.tourpro.shop` |
| Worker | `tourproshop` | `tourproshop-preview` |
| Built with | *(nothing — locked is the default)* | `SITE_MODE=full SITE_PREVIEW=true` |
| Entry point | `.open-next/worker.js` | `worker-gate.js` |
| Storefront | down | up |
| Player names | hidden | shown |
| Meta Pixel | on | **off** |
| Deploy | `npm run deploy` | `npm run deploy:full` |

Both jobs run from `.github/workflows/deploy.yml` on every push to `main`, so
the preview never drifts from what's live.

### How the gate works

`worker-gate.js` wraps the OpenNext worker. Every request goes through it —
including static assets, because the preview environment sets
`run_worker_first: true`. That last part matters: assets are normally served
straight off Cloudflare's edge before any Worker runs, and the asset paths spell
out player names.

1. No session → the password page (a 401, rendered inline by the Worker with no
   external assets, since the app's own CSS is behind the gate).
2. A password that matches an unrevoked row in `preview_passwords` → the sign-in
   is logged and a signed session cookie is set, good for 7 days.
3. Every later request checks that cookie with an HMAC. No database read, so the
   gate costs nothing on the asset requests that are most of the traffic.

It **fails closed**: with no `PREVIEW_SESSION_SECRET` bound it serves a 503 and
nothing else, so a half-finished setup can't quietly publish the roster.

Passwords are matched case-insensitively and trimmed — they get typed by hand
off a phone, and an autocapitalized first letter shouldn't lock someone out.

### The password is their own email address

Each agent enters the address the invitation was sent to. Nothing to distribute,
nothing for them to lose, and the log names whoever looked without any
cross-referencing.

Be clear-eyed about what that gate is: **these passwords are guessable.**
`aburge@excelsm.com` follows a pattern anyone can work out, and the list of who
represents whom isn't secret. Someone who guesses the scheme is in. What the
gate reliably does is keep the site off search engines and out of casual reach,
and tell you exactly who looked — it is not a wall against someone determined.

If that stops being good enough, the table already supports the alternative. The
seed script takes `email,password` rows, so you can issue a random code to
someone and their row keeps naming them without the code being readable back
out. Nothing else has to change.

The rate limiter (8 attempts a minute per IP, `PREVIEW_LOGIN_LIMITER` in
`wrangler.jsonc`) is what stops someone working through a list of addresses.

### Setting it up

```bash
# 1. The tables (once)
npx wrangler d1 execute tourproshop-outreach --remote --file=migrations/0006_preview_passwords.sql

# 2. The session signing key (once)
openssl rand -hex 32 | npx wrangler secret put PREVIEW_SESSION_SECRET --env preview

# 3. The invite list — one email per line, hashed on the way in
node scripts/seed-preview-passwords.mjs preview-passwords.csv
npx wrangler d1 execute tourproshop-outreach --remote --file=preview-passwords.generated.sql

# 4. Ship it
npm run deploy:full
```

Step 2 needs the worker to exist, so run `npm run deploy:full` first if it
doesn't yet — it will serve a 503 until the secret is set, which is the point.

Adding someone later is the same two commands — append them to the CSV and
re-run. Row order is the key the upsert matches on, so **don't reorder the
file**; append to the end.

`.gitignore` covers `preview-passwords*.csv` and `*.sql`, globbed rather than
named exactly because file sync leaves `… 2.csv` copies around.

### Seeing who used what

**`/admin/passwords?token=…`** — everyone invited, who has signed in, what they
looked at, and every failed attempt. Sorted so whoever looked most recently is
at the top, with the agency pulled off the email domain.

Deliberately readable from the *public* site too, since both workers share the
same database: `tourpro.shop/admin/passwords` works without a password of your
own.

To revoke someone:

```bash
npx wrangler d1 execute tourproshop-outreach --remote \
  --command "UPDATE preview_passwords SET revoked_at = unixepoch() WHERE email = 'them@agency.com'"
```

Takes effect on their next sign-in — an existing session runs out its 7 days.

### Testing it locally

```bash
npm run dev:full          # the full site, no gate — for building things
npm run preview:full      # the real worker with the gate, on workerd
```

`preview:full` reads `.dev.vars.preview` (gitignored). It needs
`PREVIEW_SESSION_SECRET`, and `OUTREACH_ADMIN_TOKEN` if you want the dashboard.
Apply the migration and the seed to the local database with `--local` instead of
`--remote` and you can sign in as any address on the list.

Wrangler only reads `.dev.vars.preview` at startup — restart it after editing.

---

## Withholding a single photo

The narrowest lever, and the only one that applies to just one build: a file
that shouldn't be on the public, locked-down site while the password-gated full
site keeps showing it.

Add its `src` — copied exactly as it appears in `lib/products.ts` or
`lib/marketing-assets.ts`, spaces and all — to `DARK_HIDDEN_MEDIA` in
[`lib/dark-media.ts`](../lib/dark-media.ts):

```ts
export const DARK_HIDDEN_MEDIA: readonly string[] = [
  "/product images/Sam Burns Polo/Sam Burns Polo Flatlay GPT.png",
];
```

That one line does all of this, on the locked build only:

- the shot drops out of every product gallery
- marketing figures and the sponsor-callout heroes skip it, and the next live
  shot in the chain slides into its place
- `npm run build` publishes no neutral `/media/<hash>` copy of it
- `npm run deploy` deletes it from the assets it uploads, so the original URL
  404s instead of staying quietly fetchable — the one place we close the
  [asset gap](#assets) by default

**A product whose *lead* shot is withheld comes down from the dark build
entirely.** That is deliberate. The lead is what every card, rail, and carousel
renders, so dropping only the file would promote whatever happened to be next in
that product's gallery — on our catalog, usually an on-course photo of the
player — onto exactly the surfaces a lockdown exists to keep name-free. Pulling
the lead shot means pulling the garment. The full build still has both.

Restoring is one deletion: take the path back out. Nothing was moved or deleted
on disk, and the full build never stopped serving it.

---

## Assets

One gap is worth knowing about before you rely on either lever.

Files under `public/` are served by Cloudflare's static asset layer and are not
gated by anything, so during a lockdown those URLs stay fetchable by anyone who
already knows them. Nothing links to them once the pages are down and they won't
be indexed, but they are not blocked.

Note this is *not* how the photography reaches the live pages. With
`HIDE_PLAYER_NAMES` on, `npm run build` republishes every referenced photo under
an opaque `/media/<hash>` URL and the markup points there, so no page source
spells out a player's name. The original paths simply remain reachable
alongside.

`npm run audit:dark` lists exactly which files those are for a dark player.

For a single file there is now a third option, and it's the cheap one: list it
in [`DARK_HIDDEN_MEDIA`](#withholding-a-single-photo). `npm run deploy` deletes
those paths out of `.open-next/assets` before uploading, so they 404 on the
public worker while the password-gated one still serves them. For a whole
player's directory, pick one of these instead:

**Option A — move the assets.** Take the player's directories out of `public/`
(keep them in `_legacy/`, or anywhere outside the build). The build no longer
publishes them. Simple, and it's the right answer for a single player.

**Option B — route them through the Worker.** Add to `wrangler.jsonc`:

```jsonc
"assets": {
  "directory": ".open-next/assets",
  "binding": "ASSETS",
  "run_worker_first": ["/product images/*", "/player images/*"]
}
```

This makes the Worker handle those paths so `proxy.ts` can block them. **Verify
this on a preview deploy before trusting it in production** — if the Worker
doesn't fall through to the `ASSETS` binding for those paths, product imagery
404s sitewide. Worth doing for a real takedown, not worth carrying otherwise.

---

## Testing a change locally

```
SKIP_CF_DEV=1 npm run build && SKIP_CF_DEV=1 npx next start -p 3111
```

`SKIP_CF_DEV=1` skips the Cloudflare dev emulator, which the build doesn't need.
Then check the routes:

```
curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" http://localhost:3111/shop
```
