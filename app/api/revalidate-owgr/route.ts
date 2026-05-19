import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { OWGR_CACHE_TAG } from "@/lib/owgr";

/**
 * Bust the OWGR cache on demand. Wire a Monday cron at this endpoint:
 *
 *   curl -X POST https://tourpro.shop/api/revalidate-owgr \
 *        -H "Authorization: Bearer $REVALIDATE_TOKEN"
 *
 * Set REVALIDATE_TOKEN in env. Without it, the route refuses.
 *
 * Vercel cron snippet (vercel.json):
 *   {
 *     "crons": [
 *       { "path": "/api/revalidate-owgr", "schedule": "0 13 * * 1" }
 *     ]
 *   }
 *   // 13:00 UTC every Monday = 9am ET
 */

export const dynamic = "force-dynamic";

function authorized(req: Request): boolean {
  const token = process.env.REVALIDATE_TOKEN;
  if (!token) return false;
  const header = req.headers.get("authorization") ?? "";
  return header === `Bearer ${token}`;
}

export async function POST(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  revalidateTag(OWGR_CACHE_TAG, "max");
  return NextResponse.json({ ok: true, revalidated: OWGR_CACHE_TAG });
}

// Also accept GET so Vercel cron can trigger it without a custom payload.
export async function GET(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  revalidateTag(OWGR_CACHE_TAG, "max");
  return NextResponse.json({ ok: true, revalidated: OWGR_CACHE_TAG });
}
