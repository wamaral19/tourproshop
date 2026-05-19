import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getPlayerBySlug } from "@/lib/players";

/**
 * Captures interest in a player whose gear we don't yet carry. Each submission
 * is posted to the Discord channel configured via DISCORD_WEBHOOK_URL — set it
 * in .dev.vars for local dev and `wrangler secret put DISCORD_WEBHOOK_URL` for
 * production. The value is read off the Cloudflare worker env via
 * `getCloudflareContext`, not `process.env`, because OpenNext's Cloudflare
 * adapter routes secrets through the worker bindings in both runtimes.
 * Webhook failures are logged but never fail the user's signup.
 */

export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function readWebhookUrl(): Promise<string | undefined> {
  try {
    const ctx = await getCloudflareContext({ async: true });
    const env = ctx.env as { DISCORD_WEBHOOK_URL?: string } | undefined;
    if (env?.DISCORD_WEBHOOK_URL) return env.DISCORD_WEBHOOK_URL;
  } catch {
    // getCloudflareContext can throw outside the worker runtime — fall through.
  }
  return process.env.DISCORD_WEBHOOK_URL;
}

async function postToDiscord(args: {
  email: string;
  source:
    | { kind: "player"; slug: string; name: string }
    | { kind: "general" };
}) {
  const url = await readWebhookUrl();
  if (!url) {
    console.warn("[notify-interest] DISCORD_WEBHOOK_URL not set");
    return;
  }
  const title =
    args.source.kind === "player" ? "New waitlist signup" : "New subscriber";
  const sourceValue =
    args.source.kind === "player"
      ? `${args.source.name} (\`${args.source.slug}\`)`
      : "General interest (footer subscribe)";
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        embeds: [
          {
            title,
            color: 0x1f2a44,
            fields: [
              { name: "Source", value: sourceValue, inline: true },
              { name: "Email", value: args.email, inline: true },
            ],
            timestamp: new Date().toISOString(),
          },
        ],
      }),
    });
    if (!res.ok) {
      console.error(
        `[notify-interest] discord ${res.status}: ${await res.text()}`,
      );
    }
  } catch (err) {
    console.error("[notify-interest] discord post failed", err);
  }
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON" },
      { status: 400 },
    );
  }

  const { email, playerSlug } = (body ?? {}) as {
    email?: unknown;
    playerSlug?: unknown;
  };

  if (typeof email !== "string" || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, error: "Invalid email" },
      { status: 400 },
    );
  }

  if (typeof playerSlug === "string" && playerSlug.length > 0) {
    const player = getPlayerBySlug(playerSlug);
    const playerName = player?.name ?? playerSlug;
    console.log(`[notify-interest] ${email} wants gear from ${playerSlug}`);
    await postToDiscord({
      email,
      source: { kind: "player", slug: playerSlug, name: playerName },
    });
  } else {
    console.log(`[notify-interest] ${email} general subscribe`);
    await postToDiscord({ email, source: { kind: "general" } });
  }

  return NextResponse.json({ ok: true });
}
