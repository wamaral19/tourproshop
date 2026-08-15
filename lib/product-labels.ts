import { getPlayerBySlug } from "./players";
import type { Product } from "./products";
import { PLAYER_NAMES_HIDDEN } from "./site-mode";

/**
 * Naming garments without naming players.
 *
 * Every product in the catalog is named "{Player} {Garment}" — "Sam Burns
 * Polo", "Min Woo Lee Track Jacket". With PLAYER_NAMES_HIDDEN on we still want
 * to say something concrete about the piece, so we swap the player out for the
 * apparel brand: "Peter Millar polo", "Lululemon track jacket". That keeps the
 * copy useful on the Partners pages — where the apparel brands are the audience
 * — while naming nobody.
 */

/** Last-resort garment word if a product name is nothing but the player. */
const GARMENT_FALLBACK: Record<string, string> = {
  polos: "polo",
  outerwear: "outerwear",
  headwear: "headwear",
};

function normalize(token: string): string {
  return token.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/**
 * The garment half of a product name: "Sam Burns Polo" → "Polo", "Min Woo Lee
 * Track Jacket" → "Track Jacket".
 *
 * Drops any word matching the player's roster name or their slug, rather than
 * slicing off a fixed number of words — that's what handles compound given
 * names ("Si Woo Kim Blade Polo" → "Blade Polo") and spelling drift between the
 * roster and the catalog ("J.J. Spaun" vs "JJ Spaun Polo").
 */
export function getGarmentName(product: Product): string {
  const player = getPlayerBySlug(product.playerSlug);
  const playerWords = new Set(
    [...(player?.name ?? "").split(/\s+/), ...product.playerSlug.split("-")]
      .map(normalize)
      .filter(Boolean),
  );
  const garment = product.name
    .split(/\s+/)
    .filter((word) => !playerWords.has(normalize(word)))
    .join(" ")
    .trim();
  return garment || GARMENT_FALLBACK[product.category] || "";
}

/**
 * What to call a garment in public copy. Falls back to the real product name
 * when names aren't hidden, so nothing changes with the flag off.
 */
export function getProductLabel(product: Product): string {
  if (!PLAYER_NAMES_HIDDEN) return product.name;
  return `${product.brand} ${getGarmentName(product).toLowerCase()}`.trim();
}

/**
 * Alt text for a product shot. The catalog's own alt strings describe whose
 * gear it is, so they can't be used while names are hidden.
 */
export function getProductAlt(product: Product, fallback?: string): string {
  if (!PLAYER_NAMES_HIDDEN) return fallback ?? product.name;
  return getProductLabel(product);
}
