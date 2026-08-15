/**
 * Sitewide lockdown switch.
 *
 * Flipping `LOCKDOWN` to `true` is the "take the storefront down now" lever:
 * every player-facing surface stops serving, the header/footer collapse to a
 * wordmark, and `/` renders the coming-soon notice with the waitlist form.
 *
 * This module is imported by `proxy.ts`, which runs on the edge. Keep it free
 * of imports so it stays cheap to bundle and can never drag app code into the
 * proxy bundle.
 *
 * See docs/going-dark.md for the full runbook.
 */
export const LOCKDOWN = false;

/** Where rights holders are told to reach us on the lockdown notice. */
export const LOCKDOWN_CONTACT_EMAIL = "wyatt@tourpro.shop";

/**
 * Routes that keep serving while locked down. Everything else redirects to `/`.
 *
 * This is an allowlist, not a blocklist, and that is the point: a page added to
 * the app later is dark by default during a lockdown instead of quietly leaking
 * player names because nobody remembered to add it to a list.
 *
 * - `/` and `/waitlist` render the lockdown notice (see the page-level guards).
 *   `/waitlist` stays reachable at its own URL because live ad campaigns point
 *   at it — redirecting it would break Meta's landing-page matching.
 * - `/waitlist-confirmed` is the post-signup destination, so the form still
 *   completes.
 * - `/contact` carries no player content and gives people a way to reach us.
 * - `/api/*` keeps the signup endpoint alive; `/admin/*` is token-gated;
 *   `/r/*`, `/s/*`, `/a/*` are outreach click trackers whose destinations get
 *   caught by this same check on the next hop.
 */
const ALLOWED_EXACT: readonly string[] = [
  "/",
  "/waitlist",
  "/waitlist-confirmed",
  "/contact",
];

const ALLOWED_PREFIXES: readonly string[] = [
  "/api/",
  "/admin/",
  "/r/",
  "/s/",
  "/a/",
];

export function isLockdownAllowedPath(pathname: string): boolean {
  const path =
    pathname.length > 1 && pathname.endsWith("/")
      ? pathname.slice(0, -1)
      : pathname;
  if (ALLOWED_EXACT.includes(path)) return true;
  return ALLOWED_PREFIXES.some((prefix) => path.startsWith(prefix));
}
