/**
 * Sitewide lockdown switch.
 *
 * Flipping `LOCKDOWN` to `true` takes down every surface that sells gear or
 * names a player and leaves the pitch running: the waitlist, the Partners
 * pages, and "Why we exist".
 *
 * This module is imported by `proxy.ts`, which runs on the edge. Keep it free
 * of imports so it stays cheap to bundle and can never drag app code into the
 * proxy bundle.
 *
 * See docs/going-dark.md for the full runbook.
 */
export const LOCKDOWN = true;

/**
 * Strips player names from copy, alt text, and product labels — garments are
 * identified by their apparel brand instead ("Peter Millar polo"). Separate
 * from `LOCKDOWN` because the two are likely to come apart: the Partners pages
 * are expected to stay name-free even after the storefront comes back.
 *
 * Lockdown implies it. Read `PLAYER_NAMES_HIDDEN`, never either flag directly.
 *
 * One thing it does not reach: prose. `/why` tells a story that names players,
 * and rewriting someone's own words is not something a flag should do. That
 * page is deliberately left as written — `npm run audit:dark` keeps flagging it.
 */
export const HIDE_PLAYER_NAMES = true;

export const PLAYER_NAMES_HIDDEN = LOCKDOWN || HIDE_PLAYER_NAMES;

/** Where rights holders are told to reach us on the lockdown notice. */
export const LOCKDOWN_CONTACT_EMAIL = "wyatt@tourpro.shop";

/**
 * Routes that keep serving while locked down. Everything else redirects to `/`.
 *
 * This is an allowlist, not a blocklist, and that is the point: a page added to
 * the app later is dark by default during a lockdown instead of quietly leaking
 * player names because nobody remembered to add it to a list.
 *
 * - `/` and `/waitlist` render the coming-soon notice (see the page-level
 *   guards). `/waitlist` stays reachable at its own URL because live ad
 *   campaigns point at it — redirecting it would break Meta's landing-page
 *   matching.
 * - `/waitlist-confirmed` is the post-signup destination, so the form still
 *   completes.
 * - The Partners pages and `/why` are the pitch. They sell the model, not a
 *   player, and with `PLAYER_NAMES_HIDDEN` on they name no one.
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
  "/why",
  "/for-players",
  "/agents",
  "/sponsors",
  "/apparel",
  "/ecosystem",
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

/**
 * The Partners pages, in nav order. Shared by the header and the lockdown
 * footer so the two can't drift, and kept here next to the allowlist so adding
 * a partner page is one edit in one file.
 */
export const PARTNER_LINKS: readonly { href: string; label: string }[] = [
  { href: "/for-players", label: "For Players" },
  { href: "/agents", label: "Agents" },
  { href: "/sponsors", label: "Corporate Sponsors" },
  { href: "/apparel", label: "Apparel Sponsors" },
  { href: "/ecosystem", label: "Ecosystem" },
];
