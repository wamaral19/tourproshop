import type { NextRequest } from "next/server";
import {
  COOKIE_MAX_AGE_SECONDS,
  COOKIE_NAME,
  DEFAULT_TARGET,
  getCfEnv,
  isValidSlug,
  lookupLink,
  recordClick,
} from "@/lib/outreach";

export const dynamic = "force-dynamic";

type CfRequest = NextRequest & {
  cf?: {
    country?: string;
    region?: string;
    city?: string;
  };
};

function safeRedirectTarget(raw: string | null | undefined): string {
  if (!raw) return DEFAULT_TARGET;
  if (raw.startsWith("/") && !raw.startsWith("//")) return raw;
  try {
    const u = new URL(raw);
    if (u.protocol === "https:" || u.protocol === "http:") return u.toString();
  } catch {
    /* fall through */
  }
  return DEFAULT_TARGET;
}

export async function GET(
  request: NextRequest,
  ctx: { params: Promise<{ slug: string }> },
) {
  const { slug: rawSlug } = await ctx.params;
  const slug = rawSlug.toLowerCase();
  const validSlug = isValidSlug(slug);

  const { env, ctx: cfCtx } = await getCfEnv();
  const db = env.OUTREACH_DB;

  let target = DEFAULT_TARGET;
  let isKnown = false;
  if (validSlug && db) {
    try {
      const link = await lookupLink(db, slug);
      if (link) {
        isKnown = true;
        target = safeRedirectTarget(link.target_url);
      }
    } catch (err) {
      console.error("[outreach] lookup failed", err);
    }
  }

  const headers = request.headers;
  const cf = (request as CfRequest).cf;
  const clickPromise = (async () => {
    if (!db || !validSlug) return;
    try {
      await recordClick(db, {
        slug,
        user_agent: headers.get("user-agent"),
        referrer: headers.get("referer"),
        ip:
          headers.get("cf-connecting-ip") ??
          headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
          null,
        country: cf?.country ?? headers.get("cf-ipcountry") ?? null,
        region: cf?.region ?? null,
        city: cf?.city ?? null,
        is_known: isKnown,
      });
    } catch (err) {
      console.error("[outreach] click insert failed", err);
    }
  })();
  if (cfCtx) cfCtx.waitUntil(clickPromise);
  else await clickPromise;

  const cookieValue = validSlug ? slug : "unknown";
  const cookie = [
    `${COOKIE_NAME}=${encodeURIComponent(cookieValue)}`,
    `Max-Age=${COOKIE_MAX_AGE_SECONDS}`,
    "Path=/",
    "SameSite=Lax",
    "Secure",
  ].join("; ");

  return new Response(null, {
    status: 302,
    headers: {
      Location: target,
      "Set-Cookie": cookie,
      "Cache-Control": "no-store",
    },
  });
}
