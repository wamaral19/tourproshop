"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCfEnv, isValidSlug, slugify } from "@/lib/outreach";

function assertToken(token: unknown, expected: string | undefined) {
  if (!expected) throw new Error("OUTREACH_ADMIN_TOKEN not configured");
  if (typeof token !== "string" || token !== expected) {
    throw new Error("Unauthorized");
  }
}

function dashboardPath(token: string): string {
  return `/admin/sponsors?token=${encodeURIComponent(token)}`;
}

export async function addSponsor(formData: FormData): Promise<void> {
  const { env } = await getCfEnv();
  const token = formData.get("token");
  assertToken(token, env.OUTREACH_ADMIN_TOKEN);

  const db = env.OUTREACH_DB;
  if (!db) throw new Error("OUTREACH_DB not bound");

  const sponsorName = String(formData.get("sponsor_name") ?? "").trim();
  const company = String(formData.get("company") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  if (!sponsorName) throw new Error("Sponsor name is required");

  const slug = slugify(sponsorName);
  if (!isValidSlug(slug)) {
    throw new Error(`Could not derive a valid slug from "${sponsorName}"`);
  }

  const existing = await db
    .prepare("SELECT slug FROM sponsor_outreach_links WHERE slug = ?")
    .bind(slug)
    .first<{ slug: string }>();
  if (existing) {
    throw new Error(`Slug "${slug}" already exists`);
  }

  await db
    .prepare(
      `INSERT INTO sponsor_outreach_links (slug, sponsor_name, company, email, target_url)
       VALUES (?, ?, ?, ?, '/sponsors')`,
    )
    .bind(slug, sponsorName, company || null, email || null)
    .run();

  revalidatePath("/admin/sponsors");
  redirect(dashboardPath(token as string));
}

export async function updateSponsorEmailsSent(formData: FormData): Promise<void> {
  const { env } = await getCfEnv();
  const token = formData.get("token");
  assertToken(token, env.OUTREACH_ADMIN_TOKEN);

  const db = env.OUTREACH_DB;
  if (!db) throw new Error("OUTREACH_DB not bound");

  const slug = String(formData.get("slug") ?? "");
  if (!isValidSlug(slug)) throw new Error("Invalid slug");

  const raw = String(formData.get("emails_sent") ?? "0");
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n) || n < 0) throw new Error("emails_sent must be >= 0");

  await db
    .prepare("UPDATE sponsor_outreach_links SET emails_sent = ? WHERE slug = ?")
    .bind(n, slug)
    .run();

  revalidatePath("/admin/sponsors");
  redirect(dashboardPath(token as string));
}
