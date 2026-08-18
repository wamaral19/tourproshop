import type { Metadata } from "next";
import { getCfEnv } from "@/lib/outreach";
import { addPassword, setRevoked } from "./actions";

/**
 * Which passwords have been used to get into the private preview, and when.
 *
 * Stands on its own rather than joining the outreach dashboards — those three
 * track a sales pipeline and cross-link to each other; this one answers a
 * different question and deliberately doesn't.
 *
 * Readable from the *public* worker as well as the preview one: /admin/* is on
 * the lockdown allowlist, and both workers share the same D1 database, so this
 * page works at tourpro.shop/admin/passwords without needing a password of your
 * own.
 *
 * Each agent's own email address is their password, so the log names whoever
 * looked without any cross-referencing. Rows keep their CSV row number too, as
 * a stable handle for revoking one.
 */

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Passwords",
  robots: { index: false, follow: false },
};

/** Where the gated build is served. Shown so the link is to hand. */
const PREVIEW_URL = "https://preview.tourpro.shop";

type PasswordRow = {
  password_index: number;
  email: string | null;
  uses: number;
  last_used_at: number | null;
  revoked_at: number | null;
  views: number;
};

type EventRow = {
  ts: number;
  event: string;
  password_index: number | null;
  email: string | null;
  path: string | null;
  country: string | null;
  city: string | null;
  ip: string | null;
  user_agent: string | null;
};

/**
 * The domain, which for this list is the agency — @gseworldwide.com, @the.team.
 * Free-mail domains say nothing about who someone works for, so they're left
 * blank rather than filling the column with "gmail.com".
 */
const FREE_MAIL = new Set([
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "icloud.com",
  "aol.com",
  "msn.com",
  "me.com",
]);

function agencyOf(email: string | null): string {
  if (!email) return "";
  const domain = email.split("@")[1]?.toLowerCase() ?? "";
  return FREE_MAIL.has(domain) ? "" : domain;
}

function fmtTs(ts: number | null): string {
  if (!ts) return "—";
  return new Date(ts * 1000).toISOString().replace("T", " ").slice(0, 16) + " UTC";
}

function truncate(s: string | null, n: number): string {
  if (!s) return "";
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

export default async function PasswordsDashboard({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const { env } = await getCfEnv();
  const expected = env.OUTREACH_ADMIN_TOKEN;
  const db = env.OUTREACH_DB;

  if (!expected) {
    return (
      <main className="mx-auto max-w-3xl p-8 font-mono text-sm">
        <h1 className="text-xl font-bold">Passwords</h1>
        <p className="mt-4 text-red-600">
          OUTREACH_ADMIN_TOKEN is not configured.
        </p>
      </main>
    );
  }

  if (!token || token !== expected) {
    return (
      <main className="mx-auto max-w-md p-8 font-mono text-sm">
        <h1 className="mb-6 text-xl font-bold">Passwords</h1>
        <form method="get" className="flex flex-col gap-3">
          <label htmlFor="token" className="text-xs uppercase tracking-wider">
            Admin token
          </label>
          <input
            id="token"
            name="token"
            type="password"
            autoFocus
            className="rounded border border-neutral-400 bg-white px-3 py-2"
          />
          <button type="submit" className="rounded bg-black px-3 py-2 text-white">
            Enter
          </button>
        </form>
        {token && token !== expected && (
          <p className="mt-4 text-red-600">Invalid token.</p>
        )}
      </main>
    );
  }

  if (!db) {
    return (
      <main className="mx-auto max-w-3xl p-8 font-mono text-sm">
        <h1 className="text-xl font-bold">Passwords</h1>
        <p className="mt-4 text-red-600">OUTREACH_DB binding is missing.</p>
      </main>
    );
  }

  const passwordsRes = await db
    .prepare(
      `SELECT p.password_index, p.email, p.uses, p.last_used_at, p.revoked_at,
              COUNT(CASE WHEN l.event = 'view' THEN 1 END) AS views
         FROM preview_passwords p
         LEFT JOIN preview_access_log l ON l.password_id = p.id
        GROUP BY p.id
        ORDER BY p.last_used_at IS NULL, p.last_used_at DESC, p.email ASC`,
    )
    .all<PasswordRow>();
  const passwords = passwordsRes.results ?? [];

  const recentRes = await db
    .prepare(
      `SELECT l.ts, l.event, p.password_index, p.email, l.path, l.country, l.city,
              l.ip, l.user_agent
         FROM preview_access_log l
         LEFT JOIN preview_passwords p ON p.id = l.password_id
        ORDER BY l.ts DESC
        LIMIT 200`,
    )
    .all<EventRow>();
  const recent = recentRes.results ?? [];

  const issued = passwords.length;
  const used = passwords.filter((c) => c.uses > 0).length;
  const signins = passwords.reduce((sum, c) => sum + c.uses, 0);
  const views = passwords.reduce((sum, c) => sum + c.views, 0);
  const denied = recent.filter((r) => r.event === "denied").length;

  return (
    <main className="mx-auto max-w-[1400px] p-6 font-mono text-sm">
      <header className="mb-6 flex items-baseline justify-between">
        <div>
          <h1 className="text-xl font-bold">Passwords</h1>
          <p className="mt-1 text-xs text-neutral-500">
            Private preview at{" "}
            <a href={PREVIEW_URL} className="underline">
              {PREVIEW_URL.replace("https://", "")}
            </a>
          </p>
        </div>
        <a
          href={`/admin/passwords?token=${encodeURIComponent(token)}`}
          className="text-xs underline"
        >
          refresh
        </a>
      </header>

      <section className="mb-8 grid grid-cols-2 gap-2 md:grid-cols-5">
        <Stat label="Invited" value={issued} />
        <Stat label="Have looked" value={`${used} / ${issued}`} />
        <Stat label="Sign-ins" value={signins} />
        <Stat label="Page views" value={views} />
        <Stat label="Failed (last 200)" value={denied} />
      </section>

      <section className="mb-8 rounded border border-neutral-300 bg-white p-4">
        <h2 className="mb-3 text-xs uppercase tracking-wider text-neutral-600">
          Invite someone
        </h2>
        <form
          action={addPassword}
          className="grid grid-cols-1 gap-3 md:grid-cols-[2fr_2fr_auto]"
        >
          <input type="hidden" name="token" value={token} />
          <label className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-wider text-neutral-500">
              Email
            </span>
            <input
              name="email"
              type="email"
              required
              placeholder="them@agency.com"
              className="rounded border border-neutral-400 bg-white px-2 py-1.5"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-wider text-neutral-500">
              Password — leave blank to use their email
            </span>
            <input
              name="password"
              placeholder="(their email address)"
              autoComplete="off"
              className="rounded border border-neutral-400 bg-white px-2 py-1.5"
            />
          </label>
          <button
            type="submit"
            className="self-end rounded bg-black px-4 py-1.5 text-white"
          >
            Invite
          </button>
        </form>
        <p className="mt-3 text-xs text-neutral-500">
          They sign in at{" "}
          <a href={PREVIEW_URL} className="underline">
            {PREVIEW_URL.replace("https://", "")}
          </a>{" "}
          with whatever you set here. Added this way, they are not in
          preview-passwords.csv — update it too if you keep that as the record.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-xs uppercase tracking-wider text-neutral-600">
          Everyone invited
        </h2>
        <div className="overflow-x-auto rounded border border-neutral-300 bg-white">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-neutral-300 bg-neutral-50">
              <tr>
                <Th>Who</Th>
                <Th>Agency</Th>
                <Th className="text-right">Sign-ins</Th>
                <Th className="text-right">Views</Th>
                <Th>Last used</Th>
                <Th>Status</Th>
                <Th></Th>
              </tr>
            </thead>
            <tbody>
              {passwords.map((c) => (
                <tr
                  key={c.password_index}
                  className="border-b border-neutral-200 last:border-0"
                >
                  <Td className="font-semibold">
                    {c.email ?? `#${c.password_index}`}
                  </Td>
                  <Td className="text-neutral-500">{agencyOf(c.email)}</Td>
                  <Td className="text-right">{c.uses}</Td>
                  <Td className="text-right">{c.views}</Td>
                  <Td className={c.last_used_at ? "" : "text-neutral-400"}>
                    {fmtTs(c.last_used_at)}
                  </Td>
                  <Td>
                    {c.revoked_at ? (
                      <span className="text-red-600">revoked</span>
                    ) : c.uses > 0 ? (
                      <span className="text-green-700">used</span>
                    ) : (
                      <span className="text-neutral-400">unused</span>
                    )}
                  </Td>
                  <Td>
                    <form action={setRevoked}>
                      <input type="hidden" name="token" value={token} />
                      <input
                        type="hidden"
                        name="password_index"
                        value={c.password_index}
                      />
                      <input
                        type="hidden"
                        name="revoke"
                        value={c.revoked_at ? "0" : "1"}
                      />
                      <button
                        type="submit"
                        className="text-neutral-500 underline hover:text-black"
                      >
                        {c.revoked_at ? "restore" : "revoke"}
                      </button>
                    </form>
                  </Td>
                </tr>
              ))}
              {passwords.length === 0 && (
                <tr>
                  <Td className="text-neutral-500">
                    No passwords seeded yet — run
                    scripts/seed-preview-passwords.mjs.
                  </Td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-xs uppercase tracking-wider text-neutral-600">
          Recent activity
        </h2>
        <div className="overflow-x-auto rounded border border-neutral-300 bg-white">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-neutral-300 bg-neutral-50">
              <tr>
                <Th>When</Th>
                <Th>Event</Th>
                <Th>Who</Th>
                <Th>Path</Th>
                <Th>Where</Th>
                <Th>IP</Th>
                <Th>User agent</Th>
              </tr>
            </thead>
            <tbody>
              {recent.map((r, i) => (
                <tr
                  key={i}
                  className="border-b border-neutral-200 last:border-0"
                >
                  <Td className="whitespace-nowrap">{fmtTs(r.ts)}</Td>
                  <Td>
                    <span
                      className={
                        r.event === "denied"
                          ? "text-red-600"
                          : r.event === "signin"
                            ? "font-semibold text-green-700"
                            : "text-neutral-500"
                      }
                    >
                      {r.event}
                    </span>
                  </Td>
                  <Td>
                    {r.email ?? (r.password_index ? `#${r.password_index}` : "—")}
                  </Td>
                  <Td>{truncate(r.path, 48)}</Td>
                  <Td className="whitespace-nowrap">
                    {[r.city, r.country].filter(Boolean).join(", ") || "—"}
                  </Td>
                  <Td className="whitespace-nowrap">{r.ip ?? "—"}</Td>
                  <Td className="text-neutral-500">
                    {truncate(r.user_agent, 60)}
                  </Td>
                </tr>
              ))}
              {recent.length === 0 && (
                <tr>
                  <Td className="text-neutral-500">Nothing yet.</Td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded border border-neutral-300 bg-white p-3">
      <div className="text-xs uppercase tracking-wider text-neutral-500">
        {label}
      </div>
      <div className="mt-1 text-2xl font-bold">{value}</div>
    </div>
  );
}

function Th({
  children,
  className = "",
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return <th className={`px-2 py-2 font-semibold ${className}`}>{children}</th>;
}

function Td({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={`px-2 py-1.5 ${className}`}>{children}</td>;
}
