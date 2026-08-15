import { NEUTRAL_MEDIA_MAP } from "./media-map.generated";
import { PLAYER_NAMES_HIDDEN } from "./site-mode";

/**
 * Swaps an asset path for its name-free published copy while PLAYER_NAMES_HIDDEN
 * is on.
 *
 * The photography lives under paths that spell out whose gear it is, and those
 * paths are visible in page source as `src` and preload hints. `npm run build`
 * republishes each referenced file under an opaque /media/<hash> URL; this is
 * what points the markup at it.
 *
 * Falls back to the original path if a file isn't in the map — a visible image
 * with a telling URL beats a broken one, and the generator reports anything it
 * couldn't publish.
 */
export function neutralSrc(src: string): string {
  if (!PLAYER_NAMES_HIDDEN) return src;
  return NEUTRAL_MEDIA_MAP[src] ?? src;
}
