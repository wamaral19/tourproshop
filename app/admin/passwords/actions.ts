"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCfEnv } from "@/lib/outreach";

/**
 * Adding and revoking preview passwords from the dashboard.
 *
 * The CSV and `scripts/seed-preview-passwords.mjs` are for the initial 129 in
 * one go. This is for the ones after that — you meet an agent, you want them in
 * before you've closed the laptop.
 *
 * Both paths write the same rows, so they stay interchangeable. Keep the CSV up
 * to date anyway if you rely on it as the record of who was invited: rows added
 * here are not in it.
 */

function assertToken(token: unknown, expected: string | undefined) {
  if (!expected) throw new Error("OUTREACH_ADMIN_TOKEN not configured");
  if (typeof token !== "string" || token !== expected) {
    throw new Error("Unauthorized");
  }
}

function dashboardPath(token: string): string {
  return `/admin/passwords?token=${encodeURIComponent(token)}`;
}

/** Must match `normalizePassword` in worker-gate.js exactly. */
function normalizePassword(password: string): string {
  return password.trim().toLowerCase();
}

async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(input),
  );
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

const EMAIL_RE = /^[^\s@,]+@[^\s@,]+\.[a-z]{2,}$/i;

export async function addPassword(formData: FormData): Promise<void> {
  const { env } = await getCfEnv();
  const token = formData.get("token");
  assertToken(token, env.OUTREACH_ADMIN_TOKEN);

  const db = env.OUTREACH_DB;
  if (!db) throw new Error("OUTREACH_DB not bound");

  const email = normalizePassword(String(formData.get("email") ?? ""));
  if (!email) throw new Error("Email is required");
  if (!EMAIL_RE.test(email)) throw new Error(`"${email}" isn't an email address`);

  // Leave the password blank and their address is the password, which is how
  // the other 129 work. Fill it in to hand someone a code instead — the row
  // still names them, but the code can't be read back out of the table.
  const custom = String(formData.get("password") ?? "").trim();
  const password = custom || email;
  const hash = await sha256Hex(normalizePassword(password));

  const clash = await db
    .prepare("SELECT email FROM preview_passwords WHERE password_hash = ?")
    .bind(hash)
    .first<{ email: string | null }>();
  if (clash) {
    throw new Error(
      `That password is already in use by ${clash.email ?? "another row"}`,
    );
  }

  const max = await db
    .prepare("SELECT COALESCE(MAX(password_index), 0) AS n FROM preview_passwords")
    .first<{ n: number }>();

  await db
    .prepare(
      `INSERT INTO preview_passwords (password_index, password_hash, email)
       VALUES (?, ?, ?)`,
    )
    .bind((max?.n ?? 0) + 1, hash, email)
    .run();

  revalidatePath("/admin/passwords");
  redirect(dashboardPath(token as string));
}

/**
 * Revoking stops the next sign-in, not the current session — those run out
 * their seven days on the cookie alone, by design: checking the database on
 * every request is what the signed cookie exists to avoid.
 */
export async function setRevoked(formData: FormData): Promise<void> {
  const { env } = await getCfEnv();
  const token = formData.get("token");
  assertToken(token, env.OUTREACH_ADMIN_TOKEN);

  const db = env.OUTREACH_DB;
  if (!db) throw new Error("OUTREACH_DB not bound");

  const index = Number.parseInt(String(formData.get("password_index") ?? ""), 10);
  if (!Number.isFinite(index)) throw new Error("Invalid password");

  const revoke = String(formData.get("revoke") ?? "") === "1";

  await db
    .prepare(
      `UPDATE preview_passwords
          SET revoked_at = ${revoke ? "unixepoch()" : "NULL"}
        WHERE password_index = ?`,
    )
    .bind(index)
    .run();

  revalidatePath("/admin/passwords");
  redirect(dashboardPath(token as string));
}
