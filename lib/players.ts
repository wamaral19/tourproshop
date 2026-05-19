import owgrData from "@/data/owgr.json";

export type PlayerRelationship = "exclusive" | "linked";

export type VendorLink = {
  vendor: string;
  url: string;
  kind?: "apparel" | "equipment" | "headwear" | "footwear" | "other";
};

export type Player = {
  /**
   * Optional OWGR rank. Players we carry as Exclusives don't need to be in
   * the OWGR top 20 — leave undefined for non-ranked players.
   */
  owgrRank?: number;
  slug: string;
  name: string;
  /** Bio / demographics fields are optional — minimal entries only need the
   *  apparel sponsor link. */
  country?: string;
  countryCode?: string;
  age?: number;
  turnedPro?: number;
  signatureWin?: string;
  bio?: string;
  /**
   * Relationship to Tour Pro Shop:
   * - "exclusive": we carry official licensed gear (logos, kit, etc.)
   * - "linked":   we point to third-party sources for the player's looks
   */
  relationship: PlayerRelationship;
  /** True when the player has no clothing sponsor. Landing page renders a
   *  "Free Agent — request their sponsor gear" CTA in place of a vendor link. */
  freeAgent?: boolean;
  vendorLinks?: VendorLink[];
};

/**
 * Player slugs hidden from every storefront surface — roster, browse grid,
 * /players, shop, PDPs, related rails. Direct URLs 404. Use this to temporarily
 * pull a player without deleting their data; remove the slug to restore them.
 */
export const HIDDEN_PLAYERS: ReadonlySet<string> = new Set(["sungjae-im"]);

export function isPlayerHidden(slug: string): boolean {
  return HIDDEN_PLAYERS.has(slug);
}

/**
 * The active player roster, loaded from /data/owgr.json — your single source
 * of truth. Update that file weekly to refresh the rankings; downstream picks
 * it up automatically.
 */
export const PLAYERS_SNAPSHOT: Player[] = owgrData.players as Player[];

export const PLAYERS_SNAPSHOT_UPDATED_AT: string =
  (owgrData as { updatedAt?: string }).updatedAt ?? "";

export function getPlayerBySlug(
  slug: string,
  list: Player[] = PLAYERS_SNAPSHOT,
) {
  return list.find((p) => p.slug === slug);
}

export const EXCLUSIVE_PLAYERS = (list: Player[]) =>
  list.filter((p) => p.relationship === "exclusive");

export const LINKED_PLAYERS = (list: Player[]) =>
  list.filter((p) => p.relationship === "linked");

/**
 * Filter to players that have an OWGR rank, sorted ascending. Used to render
 * the "world ranking" view distinct from the Exclusives roster.
 */
export const RANKED_PLAYERS = (list: Player[]) =>
  list
    .filter((p) => typeof p.owgrRank === "number")
    .sort((a, b) => (a.owgrRank ?? 999) - (b.owgrRank ?? 999));

/**
 * Display first name for tiles/CTAs ("Shop {first}"). Defaults to the first
 * whitespace-delimited token of the full name, with overrides for players
 * whose given name spans multiple tokens (e.g. Korean compound first names).
 */
const COMPOUND_FIRST_NAMES: Record<string, string> = {
  "si-woo-kim": "Si Woo",
  "min-woo-lee": "Min Woo",
};

export function getDisplayFirstName(
  player: Pick<Player, "slug" | "name">,
): string {
  return COMPOUND_FIRST_NAMES[player.slug] ?? player.name.split(" ")[0];
}
