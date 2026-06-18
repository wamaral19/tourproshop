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
  return `/admin/apparel?token=${encodeURIComponent(token)}`;
}

export async function addApparelBrand(formData: FormData): Promise<void> {
  const { env } = await getCfEnv();
  const token = formData.get("token");
  assertToken(token, env.OUTREACH_ADMIN_TOKEN);

  const db = env.OUTREACH_DB;
  if (!db) throw new Error("OUTREACH_DB not bound");

  const contactName = String(formData.get("contact_name") ?? "").trim();
  const brand = String(formData.get("brand") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  if (!contactName) throw new Error("Contact name is required");

  const slug = slugify(contactName);
  if (!isValidSlug(slug)) {
    throw new Error(`Could not derive a valid slug from "${contactName}"`);
  }

  const existing = await db
    .prepare("SELECT slug FROM apparel_outreach_links WHERE slug = ?")
    .bind(slug)
    .first<{ slug: string }>();
  if (existing) {
    throw new Error(`Slug "${slug}" already exists`);
  }

  await db
    .prepare(
      `INSERT INTO apparel_outreach_links (slug, contact_name, brand, email, target_url)
       VALUES (?, ?, ?, ?, '/apparel')`,
    )
    .bind(slug, contactName, brand || null, email || null)
    .run();

  revalidatePath("/admin/apparel");
  redirect(dashboardPath(token as string));
}

export async function updateApparelEmailsSent(formData: FormData): Promise<void> {
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
    .prepare("UPDATE apparel_outreach_links SET emails_sent = ? WHERE slug = ?")
    .bind(n, slug)
    .run();

  revalidatePath("/admin/apparel");
  redirect(dashboardPath(token as string));
}
