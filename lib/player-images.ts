import { PLAYER_IMAGE_MAP } from "./player-image-map.generated";

/**
 * Resolves a player slug to a public asset URL. The actual filename map is
 * generated at build time by scripts/generate-player-image-map.mjs so this
 * works on runtimes without a filesystem (e.g. Cloudflare Workers).
 */
export function getPlayerImageUrl(slug: string): string | null {
  return PLAYER_IMAGE_MAP[slug] ?? null;
}

// Per-player object-position overrides for the players page thumbnails.
// Default crop is `object-top` (50% horizontal, 0% vertical) — these shift the
// horizontal focus for subjects who'd otherwise be cropped awkwardly.
// Tailwind arbitrary values: underscores become spaces.
const PLAYER_OBJECT_POSITION_CLASS: Record<string, string> = {
  "ben-griffin": "object-[25%_top]",
  "keith-mitchell": "object-[right_top]",
  "bryson-dechambeau": "object-[65%_top]",
  "nicolai-hojgaard": "object-[35%_top]",
  "tommy-fleetwood": "object-[65%_top]",
};

export function getPlayerObjectPositionClass(slug: string): string {
  return PLAYER_OBJECT_POSITION_CLASS[slug] ?? "object-top";
}
