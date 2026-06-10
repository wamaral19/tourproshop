import { getCloudflareContext } from "@opennextjs/cloudflare";

export type OutreachLink = {
  slug: string;
  agent_name: string | null;
  agency: string | null;
  email: string | null;
  target_url: string;
};

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

type Env = {
  OUTREACH_DB?: D1Database;
  OUTREACH_ADMIN_TOKEN?: string;
};

export const DEFAULT_TARGET = "/agents";
export const COOKIE_NAME = "tps_ref";
export const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 90; // 90 days

const SLUG_RE = /^[a-z0-9][a-z0-9-]{0,63}$/;

export function isValidSlug(s: string): boolean {
  return SLUG_RE.test(s);
}

export async function getCfEnv(): Promise<{
  env: Env;
  ctx: { waitUntil: (p: Promise<unknown>) => void } | undefined;
}> {
  try {
    const ctx = await getCloudflareContext({ async: true });
    return { env: (ctx.env ?? {}) as Env, ctx: ctx.ctx };
  } catch {
    return { env: {}, ctx: undefined };
  }
}

export async function lookupLink(
  db: D1Database,
  slug: string,
): Promise<OutreachLink | null> {
  const row = await db
    .prepare(
      "SELECT slug, agent_name, agency, email, target_url FROM outreach_links WHERE slug = ?",
    )
    .bind(slug)
    .first<OutreachLink>();
  return row ?? null;
}

export type ClickRecord = {
  slug: string;
  user_agent: string | null;
  referrer: string | null;
  ip: string | null;
  country: string | null;
  region: string | null;
  city: string | null;
  is_known: boolean;
};

export async function recordClick(
  db: D1Database,
  click: ClickRecord,
): Promise<void> {
  await db
    .prepare(
      `INSERT INTO outreach_clicks
         (slug, user_agent, referrer, ip, country, region, city, is_known)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      click.slug,
      click.user_agent,
      click.referrer,
      click.ip,
      click.country,
      click.region,
      click.city,
      click.is_known ? 1 : 0,
    )
    .run();
}
