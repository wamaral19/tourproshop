import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getCfEnv } from "@/lib/outreach";

export const dynamic = "force-dynamic";

type SummaryRow = {
  slug: string;
  agent_name: string | null;
  agency: string | null;
  email: string | null;
  clicks: number;
  last_click: number | null;
};

type ClickRow = {
  ts: number;
  slug: string;
  country: string | null;
  city: string | null;
  user_agent: string | null;
  referrer: string | null;
};

export async function GET(request: NextRequest) {
  const { env } = await getCfEnv();
  const expected = env.OUTREACH_ADMIN_TOKEN;
  if (!expected) {
    return NextResponse.json(
      { ok: false, error: "OUTREACH_ADMIN_TOKEN not configured" },
      { status: 500 },
    );
  }
  const auth = request.headers.get("authorization") ?? "";
  const presented = auth.replace(/^Bearer\s+/i, "");
  const tokenParam = request.nextUrl.searchParams.get("token");
  if (presented !== expected && tokenParam !== expected) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const db = env.OUTREACH_DB;
  if (!db) {
    return NextResponse.json(
      { ok: false, error: "OUTREACH_DB not bound" },
      { status: 500 },
    );
  }

  const slug = request.nextUrl.searchParams.get("slug");

  if (slug) {
    const clicks = await db
      .prepare(
        `SELECT ts, slug, country, city, user_agent, referrer
           FROM outreach_clicks
          WHERE slug = ?
          ORDER BY ts DESC
          LIMIT 200`,
      )
      .bind(slug)
      .all<ClickRow>();
    return NextResponse.json({ ok: true, slug, clicks: clicks.results ?? [] });
  }

  const summary = await db
    .prepare(
      `SELECT l.slug, l.agent_name, l.agency, l.email,
              COUNT(c.id) AS clicks,
              MAX(c.ts)   AS last_click
         FROM outreach_links l
         LEFT JOIN outreach_clicks c ON c.slug = l.slug
         GROUP BY l.slug
         ORDER BY clicks DESC, l.agent_name ASC`,
    )
    .all<SummaryRow>();

  const recent = await db
    .prepare(
      `SELECT ts, slug, country, city, user_agent, referrer
         FROM outreach_clicks
         ORDER BY ts DESC
         LIMIT 50`,
    )
    .all<ClickRow>();

  return NextResponse.json({
    ok: true,
    summary: summary.results ?? [],
    recent: recent.results ?? [],
  });
}
