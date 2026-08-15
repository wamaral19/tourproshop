import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { LOCKDOWN, isLockdownAllowedPath } from "@/lib/site-mode";

/**
 * Lockdown enforcement (Next 16 renamed `middleware` to `proxy`).
 *
 * When `LOCKDOWN` is off this is a pass-through and costs nothing. When it is
 * on, every route outside the allowlist in `lib/site-mode.ts` bounces to `/`,
 * which renders the coming-soon notice.
 *
 * This is the belt to the page-level guards' braces: the guards control what
 * `/` and `/waitlist` render, and this catches everything else — including
 * dynamic routes like `/players/[slug]` and `/products/[slug]` that would
 * otherwise resolve by direct URL.
 *
 * The redirect is a 307, not a 308: lockdown is temporary and we do not want
 * browsers or intermediaries caching it past the flag flip.
 */
export function proxy(request: NextRequest) {
  if (!LOCKDOWN) return NextResponse.next();

  const { pathname } = request.nextUrl;
  if (isLockdownAllowedPath(pathname)) return NextResponse.next();

  // Clone keeps the query string, so a paid click that lands on a dark URL
  // still carries its ?ad= campaign tag through to the waitlist form.
  const url = request.nextUrl.clone();
  url.pathname = "/";
  return NextResponse.redirect(url, 307);
}

export const config = {
  /**
   * Everything except Next's internals and static files. Files are matched by
   * extension rather than by path so behavior is identical in `next dev` and on
   * Cloudflare, where the assets layer serves `/public` before the Worker ever
   * runs. That does mean raw asset URLs under `/product images/...` stay
   * reachable during a lockdown — see the "Assets" section of
   * docs/going-dark.md for how to close that.
   */
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|txt|xml|woff|woff2|html)$).*)",
  ],
};
