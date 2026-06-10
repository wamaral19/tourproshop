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
  return `/admin/outreach?token=${encodeURIComponent(token)}`;
}

export async function addAgent(formData: FormData): Promise<void> {
  const { env } = await getCfEnv();
  const token = formData.get("token");
  assertToken(token, env.OUTREACH_ADMIN_TOKEN);

  const db = env.OUTREACH_DB;
  if (!db) throw new Error("OUTREACH_DB not bound");

  const agentName = String(formData.get("agent_name") ?? "").trim();
  const agency = String(formData.get("agency") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  if (!agentName) throw new Error("Agent name is required");

  const slug = slugify(agentName);
  if (!isValidSlug(slug)) {
    throw new Error(`Could not derive a valid slug from "${agentName}"`);
  }

  const existing = await db
    .prepare("SELECT slug FROM outreach_links WHERE slug = ?")
    .bind(slug)
    .first<{ slug: string }>();
  if (existing) {
    throw new Error(`Slug "${slug}" already exists`);
  }

  await db
    .prepare(
      `INSERT INTO outreach_links (slug, agent_name, agency, email, target_url)
       VALUES (?, ?, ?, ?, '/agents')`,
    )
    .bind(slug, agentName, agency || null, email || null)
    .run();

  revalidatePath("/admin/outreach");
  redirect(dashboardPath(token as string));
}

export async function updateEmailsSent(formData: FormData): Promise<void> {
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
    .prepare("UPDATE outreach_links SET emails_sent = ? WHERE slug = ?")
    .bind(n, slug)
    .run();

  revalidatePath("/admin/outreach");
  redirect(dashboardPath(token as string));
}
