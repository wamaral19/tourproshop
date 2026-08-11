import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getPlayerBySlug } from "@/lib/players";
import { YOUTH_AGE_RANGE, type ProductSize } from "@/lib/products";

/**
 * Captures interest for two cases, both posted to the Discord channel
 * configured via DISCORD_WEBHOOK_URL:
 *   - a player whose gear we don't yet carry (footer subscribe / player page)
 *   - an exclusive product that isn't live to buy yet (PDP "notify me")
 *
 * Set DISCORD_WEBHOOK_URL in .dev.vars for local dev and
 * `wrangler secret put DISCORD_WEBHOOK_URL` for production. Values are read off
 * the Cloudflare worker env via `getCloudflareContext`, not `process.env`,
 * because OpenNext's Cloudflare adapter routes secrets through the worker
 * bindings in both runtimes.
 *
 * Product signups are worth reacting to fast, so they ping. The mention is
 * configurable via DISCORD_INTEREST_MENTION (e.g. `@here`, or a role mention
 * like `<@&123456789>`); it defaults to `@here`. Set it to an empty string to
 * silence the ping. Webhook failures are logged but never fail the signup.
 */

export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEFAULT_MENTION = "@here";

async function readEnv(key: string): Promise<string | undefined> {
  try {
    const ctx = await getCloudflareContext({ async: true });
    const env = ctx.env as unknown as
      | Record<string, string | undefined>
      | undefined;
    if (env && typeof env[key] === "string") return env[key];
  } catch {
    // getCloudflareContext can throw outside the worker runtime — fall through.
  }
  return process.env[key];
}

type InterestSource =
  | { kind: "player"; slug: string; name: string }
  | { kind: "general" }
  | {
      kind: "waitlist";
      firstName?: string;
      /** Whether the signup wants a youth or adult shirt. */
      sizeClass?: "youth" | "adult";
      /** The letter size picked, when the signup chose one. */
      size?: string;
      /** Set when the signup came from a tagged link, e.g. `ig-jerseys`. */
      campaign?: string;
    }
  | {
      kind: "product";
      playerSlug: string;
      playerName: string;
      productSlug: string;
      productName: string;
      size?: string;
      colorway?: string;
      /** Set when the signup came from an ad lander popup, e.g. `ig-polo`. */
      campaign?: string;
    };

async function postToDiscord(args: { email: string; source: InterestSource }) {
  const url = await readEnv("DISCORD_WEBHOOK_URL");
  if (!url) {
    console.warn("[notify-interest] DISCORD_WEBHOOK_URL not set");
    return;
  }

  const { source } = args;
  const fromAd = source.kind === "product" && !!source.campaign;
  const title =
    source.kind === "product"
      ? fromAd
        ? "New ad-lander signup"
        : "New product interest"
      : source.kind === "player"
        ? "New waitlist signup"
        : source.kind === "waitlist"
          ? "New jersey waitlist signup"
          : "New subscriber";

  const fields: { name: string; value: string; inline?: boolean }[] = [];
  if (source.kind === "product") {
    if (source.campaign) {
      fields.push({
        name: "Landed from",
        value: `Instagram ad (\`${source.campaign}\`)`,
        inline: false,
      });
    }
    fields.push(
      { name: "Product", value: source.productName, inline: true },
      { name: "Player", value: source.playerName, inline: true },
    );
    if (source.colorway) {
      fields.push({ name: "Color", value: source.colorway, inline: true });
    }
    if (source.size) {
      fields.push({ name: "Size", value: source.size, inline: true });
    }
  } else if (source.kind === "player") {
    fields.push({
      name: "Source",
      value: `${source.name} (\`${source.slug}\`)`,
      inline: true,
    });
  } else if (source.kind === "waitlist") {
    fields.push({
      name: "Source",
      value: source.campaign
        ? `Jersey waitlist (\`${source.campaign}\`)`
        : "Jersey waitlist (/waitlist)",
      inline: true,
    });
    if (source.firstName) {
      fields.push({ name: "Name", value: source.firstName, inline: true });
    }
    if (source.sizeClass || source.size) {
      const group = source.sizeClass
        ? source.sizeClass === "youth"
          ? "Youth"
          : "Adult"
        : undefined;
      const ageRange =
        source.sizeClass === "youth" && source.size
          ? YOUTH_AGE_RANGE[source.size as ProductSize]
          : undefined;
      const value = [group, source.size].filter(Boolean).join(" ");
      fields.push({
        name: "Size",
        value: ageRange ? `${value} (${ageRange})` : value,
        inline: true,
      });
    }
  } else {
    fields.push({
      name: "Source",
      value: "General interest (footer subscribe)",
      inline: true,
    });
  }
  fields.push({ name: "Email", value: args.email, inline: true });

  // Only product interest pings — waitlist/general stay quiet.
  const mention =
    source.kind === "product"
      ? ((await readEnv("DISCORD_INTEREST_MENTION")) ?? DEFAULT_MENTION)
      : "";

  const payload: Record<string, unknown> = {
    embeds: [
      {
        title,
        color: 0x1f2a44,
        fields,
        timestamp: new Date().toISOString(),
      },
    ],
  };
  if (mention) {
    payload.content = mention;
    // Webhooks don't ping unless the mention type is explicitly allowed.
    payload.allowed_mentions = { parse: ["everyone", "roles", "users"] };
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
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

/**
 * Appends the signup as a row to a Google Sheet via an Apps Script web app.
 * Set SHEETS_WEBHOOK_URL to the deployed `/exec` URL (`.dev.vars` locally,
 * `wrangler secret put SHEETS_WEBHOOK_URL` in prod). The script decides the
 * column order from the keys below; failures are logged but never fail the
 * signup. When the secret is unset this is a no-op, so Discord keeps working.
 */
async function postToSheet(args: { email: string; source: InterestSource }) {
  const url = await readEnv("SHEETS_WEBHOOK_URL");
  if (!url) return;

  const { email, source } = args;
  const sizeClass = source.kind === "waitlist" ? source.sizeClass : undefined;
  const ageRange =
    sizeClass === "youth" &&
    source.kind === "waitlist" &&
    source.size
      ? YOUTH_AGE_RANGE[source.size as ProductSize]
      : undefined;

  // One flat row. Empty strings keep columns aligned across signup types.
  const row = {
    timestamp: new Date().toISOString(),
    type: source.kind,
    email,
    name: source.kind === "waitlist" ? (source.firstName ?? "") : "",
    player:
      source.kind === "product"
        ? source.playerName
        : source.kind === "player"
          ? source.name
          : "",
    product: source.kind === "product" ? source.productName : "",
    colorway: source.kind === "product" ? (source.colorway ?? "") : "",
    sizeClass: sizeClass ?? "",
    size:
      "size" in source && source.size
        ? ageRange
          ? `${source.size} (${ageRange})`
          : source.size
        : "",
    campaign:
      (source.kind === "product" || source.kind === "waitlist") &&
      source.campaign
        ? source.campaign
        : "",
    playerSlug:
      source.kind === "product"
        ? source.playerSlug
        : source.kind === "player"
          ? source.slug
          : "",
    productSlug: source.kind === "product" ? source.productSlug : "",
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(row),
      // Apps Script returns a redirect to the script output; follow it.
      redirect: "follow",
    });
    if (!res.ok) {
      console.error(
        `[notify-interest] sheet ${res.status}: ${await res.text()}`,
      );
    }
  } catch (err) {
    console.error("[notify-interest] sheet post failed", err);
  }
}

/** Fan out a signup to every sink; one failing never blocks the others. */
async function notify(args: { email: string; source: InterestSource }) {
  await Promise.allSettled([postToDiscord(args), postToSheet(args)]);
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

  const {
    intent,
    email,
    firstName,
    sizeClass,
    playerSlug,
    productSlug,
    productName,
    size,
    colorway,
    campaign,
  } = (body ?? {}) as {
    intent?: unknown;
    email?: unknown;
    firstName?: unknown;
    sizeClass?: unknown;
    playerSlug?: unknown;
    productSlug?: unknown;
    productName?: unknown;
    size?: unknown;
    colorway?: unknown;
    campaign?: unknown;
  };

  if (typeof email !== "string" || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, error: "Invalid email" },
      { status: 400 },
    );
  }

  const hasPlayer = typeof playerSlug === "string" && playerSlug.length > 0;

  if (intent === "waitlist") {
    console.log(`[notify-interest] ${email} joined the jersey waitlist`);
    await notify({
      email,
      source: {
        kind: "waitlist",
        firstName:
          typeof firstName === "string" && firstName.trim().length > 0
            ? firstName.trim().slice(0, 80)
            : undefined,
        sizeClass:
          sizeClass === "youth" || sizeClass === "adult"
            ? sizeClass
            : undefined,
        size: typeof size === "string" && size.length > 0 ? size : undefined,
        campaign:
          typeof campaign === "string" && campaign.length > 0
            ? campaign.slice(0, 64)
            : undefined,
      },
    });
  } else if (
    typeof productSlug === "string" &&
    productSlug.length > 0 &&
    typeof productName === "string" &&
    productName.length > 0 &&
    hasPlayer
  ) {
    const player = getPlayerBySlug(playerSlug);
    const playerName = player?.name ?? playerSlug;
    console.log(
      `[notify-interest] ${email} wants ${productSlug} (${playerSlug})`,
    );
    await notify({
      email,
      source: {
        kind: "product",
        playerSlug,
        playerName,
        productSlug,
        productName,
        size: typeof size === "string" && size.length > 0 ? size : undefined,
        colorway:
          typeof colorway === "string" && colorway.length > 0
            ? colorway
            : undefined,
        campaign:
          typeof campaign === "string" && campaign.length > 0
            ? campaign.slice(0, 64)
            : undefined,
      },
    });
  } else if (hasPlayer) {
    const player = getPlayerBySlug(playerSlug);
    const playerName = player?.name ?? playerSlug;
    console.log(`[notify-interest] ${email} wants gear from ${playerSlug}`);
    await notify({
      email,
      source: { kind: "player", slug: playerSlug, name: playerName },
    });
  } else {
    console.log(`[notify-interest] ${email} general subscribe`);
    await notify({ email, source: { kind: "general" } });
  }

  return NextResponse.json({ ok: true });
}
