import type { Metadata } from "next";
import { getCfEnv } from "@/lib/outreach";
import { addSponsor, updateSponsorEmailsSent } from "./actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sponsor outreach dashboard",
  robots: { index: false, follow: false },
};

type SummaryRow = {
  slug: string;
  sponsor_name: string | null;
  company: string | null;
  email: string | null;
  emails_sent: number;
  clicks: number;
  last_click: number | null;
};

type ClickRow = {
  ts: number;
  slug: string;
  sponsor_name: string | null;
  country: string | null;
  city: string | null;
  user_agent: string | null;
  referrer: string | null;
  is_known: number;
};

function fmtTs(ts: number | null): string {
  if (!ts) return "—";
  return new Date(ts * 1000).toISOString().replace("T", " ").slice(0, 16) + " UTC";
}

function truncate(s: string | null, n: number): string {
  if (!s) return "";
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

export default async function SponsorOutreachDashboard({
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
        <h1 className="text-xl font-bold">Sponsor outreach dashboard</h1>
        <p className="mt-4 text-red-600">OUTREACH_ADMIN_TOKEN is not configured.</p>
      </main>
    );
  }

  if (!token || token !== expected) {
    return (
      <main className="mx-auto max-w-md p-8 font-mono text-sm">
        <h1 className="mb-6 text-xl font-bold">Sponsor outreach dashboard</h1>
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
          <button
            type="submit"
            className="rounded bg-black px-3 py-2 text-white"
          >
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
        <h1 className="text-xl font-bold">Sponsor outreach dashboard</h1>
        <p className="mt-4 text-red-600">OUTREACH_DB binding is missing.</p>
      </main>
    );
  }

  const summaryRes = await db
    .prepare(
      `SELECT l.slug, l.sponsor_name, l.company, l.email, l.emails_sent,
              COUNT(c.id) AS clicks,
              MAX(c.ts)   AS last_click
         FROM sponsor_outreach_links l
         LEFT JOIN sponsor_outreach_clicks c ON c.slug = l.slug
         GROUP BY l.slug
         ORDER BY clicks DESC, l.sponsor_name ASC`,
    )
    .all<SummaryRow>();
  const summary = summaryRes.results ?? [];

  const recentRes = await db
    .prepare(
      `SELECT c.ts, c.slug, l.sponsor_name, c.country, c.city,
              c.user_agent, c.referrer, c.is_known
         FROM sponsor_outreach_clicks c
         LEFT JOIN sponsor_outreach_links l ON l.slug = c.slug
         ORDER BY c.ts DESC
         LIMIT 50`,
    )
    .all<ClickRow>();
  const recent = recentRes.results ?? [];

  const totalClicks = summary.reduce((s, r) => s + r.clicks, 0);
  const totalEmails = summary.reduce((s, r) => s + (r.emails_sent ?? 0), 0);
  const sponsorsClicked = summary.filter((r) => r.clicks > 0).length;
  const totalSponsors = summary.length;
  const knownClicks = recent.filter((r) => r.is_known === 1).length;
  const unknownClicks = recent.filter((r) => r.is_known === 0).length;

  return (
    <main className="mx-auto max-w-[1400px] p-6 font-mono text-sm">
      <header className="mb-6 flex items-baseline justify-between">
        <h1 className="text-xl font-bold">Sponsor outreach dashboard</h1>
        <div className="flex items-center gap-4 text-xs">
          <a
            href={`/admin/outreach?token=${encodeURIComponent(token)}`}
            className="underline"
          >
            agents →
          </a>
          <a
            href={`/admin/apparel?token=${encodeURIComponent(token)}`}
            className="underline"
          >
            apparel →
          </a>
          <a
            href={`/admin/passwords?token=${encodeURIComponent(token)}`}
            className="underline"
          >
            passwords →
          </a>
          <a
            href={`/admin/sponsors?token=${encodeURIComponent(token)}`}
            className="underline"
          >
            refresh
          </a>
        </div>
      </header>

      <section className="mb-8 grid grid-cols-2 gap-2 md:grid-cols-5">
        <Stat label="Total clicks" value={totalClicks} />
        <Stat label="Emails sent" value={totalEmails} />
        <Stat
          label="Sponsors clicked"
          value={`${sponsorsClicked} / ${totalSponsors}`}
        />
        <Stat label="Known (last 50)" value={knownClicks} />
        <Stat label="Unknown (last 50)" value={unknownClicks} />
      </section>

      <section className="mb-8 rounded border border-neutral-300 bg-white p-4">
        <h2 className="mb-3 text-xs uppercase tracking-wider text-neutral-600">
          Add sponsor
        </h2>
        <form
          action={addSponsor}
          className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_1fr_auto]"
        >
          <input type="hidden" name="token" value={token} />
          <label className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-wider text-neutral-500">
              Sponsor contact name
            </span>
            <input
              name="sponsor_name"
              required
              placeholder="Jane Doe"
              className="rounded border border-neutral-400 bg-white px-2 py-1.5"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-wider text-neutral-500">
              Company
            </span>
            <input
              name="company"
              placeholder="Acme Spirits"
              className="rounded border border-neutral-400 bg-white px-2 py-1.5"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-wider text-neutral-500">
              Email
            </span>
            <input
              name="email"
              type="email"
              placeholder="jane@acme.com"
              className="rounded border border-neutral-400 bg-white px-2 py-1.5"
            />
          </label>
          <button
            type="submit"
            className="self-end rounded bg-black px-3 py-2 text-white"
          >
            Add
          </button>
        </form>
        <p className="mt-2 text-xs text-neutral-500">
          Slug is auto-derived from the contact name. Tracking link will be
          /s/&lt;slug&gt;.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="mb-3 text-xs uppercase tracking-wider text-neutral-600">
          Clicks by sponsor
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="border-b-2 border-neutral-800 text-left">
                <Th>Contact</Th>
                <Th>Company</Th>
                <Th>Slug</Th>
                <Th>Email</Th>
                <Th className="text-right">Emails sent</Th>
                <Th className="text-right">Clicks</Th>
                <Th>Last click</Th>
                <Th>Link</Th>
              </tr>
            </thead>
            <tbody>
              {summary.map((r) => (
                <tr
                  key={r.slug}
                  className={r.clicks > 0 ? "bg-yellow-50" : ""}
                >
                  <Td>{r.sponsor_name ?? "—"}</Td>
                  <Td>{r.company ?? "—"}</Td>
                  <Td className="text-neutral-500">{r.slug}</Td>
                  <Td className="text-neutral-500">{r.email ?? "—"}</Td>
                  <Td className="text-right">
                    <form
                      action={updateSponsorEmailsSent}
                      className="inline-flex items-center gap-1"
                    >
                      <input type="hidden" name="token" value={token} />
                      <input type="hidden" name="slug" value={r.slug} />
                      <input
                        type="number"
                        name="emails_sent"
                        min={0}
                        defaultValue={r.emails_sent ?? 0}
                        className="w-14 rounded border border-neutral-400 bg-white px-1.5 py-0.5 text-right"
                      />
                      <button
                        type="submit"
                        className="rounded bg-black px-2 py-0.5 text-white"
                      >
                        save
                      </button>
                    </form>
                  </Td>
                  <Td className="text-right font-bold">{r.clicks}</Td>
                  <Td>{fmtTs(r.last_click)}</Td>
                  <Td>
                    <a
                      className="underline"
                      href={`https://tourpro.shop/s/${r.slug}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      /s/{r.slug}
                    </a>
                  </Td>
                </tr>
              ))}
              <tr className="border-t-2 border-neutral-800 bg-neutral-100 font-bold">
                <Td>TOTAL</Td>
                <Td>{totalSponsors} sponsors</Td>
                <Td>—</Td>
                <Td>—</Td>
                <Td className="text-right">{totalEmails}</Td>
                <Td className="text-right">{totalClicks}</Td>
                <Td>—</Td>
                <Td>—</Td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-xs uppercase tracking-wider text-neutral-600">
          Recent clicks (last 50)
        </h2>
        {recent.length === 0 ? (
          <p className="text-neutral-500">No clicks yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="border-b-2 border-neutral-800 text-left">
                  <Th>When (UTC)</Th>
                  <Th>Contact</Th>
                  <Th>Slug</Th>
                  <Th>Country</Th>
                  <Th>City</Th>
                  <Th>Known?</Th>
                  <Th>Referrer</Th>
                  <Th>User-Agent</Th>
                </tr>
              </thead>
              <tbody>
                {recent.map((r, i) => (
                  <tr key={i} className="border-b border-neutral-200">
                    <Td>{fmtTs(r.ts)}</Td>
                    <Td>{r.sponsor_name ?? "—"}</Td>
                    <Td className="text-neutral-500">{r.slug}</Td>
                    <Td>{r.country ?? "—"}</Td>
                    <Td>{r.city ?? "—"}</Td>
                    <Td>{r.is_known ? "yes" : "NO"}</Td>
                    <Td className="text-neutral-500">
                      {truncate(r.referrer, 40)}
                    </Td>
                    <Td className="text-neutral-500">
                      {truncate(r.user_agent, 50)}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th className={`px-2 py-2 font-semibold ${className}`}>{children}</th>
  );
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
