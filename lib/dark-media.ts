import { LOCKDOWN } from "./site-mode";

/**
 * Photography withheld from the dark build.
 *
 * HIDDEN_PLAYERS and HIDDEN_PRODUCTS retire a name or a garment from both
 * builds. This is the narrower lever: a single file that shouldn't be on the
 * public, locked-down site, while the password-gated full build keeps showing
 * it. Nothing is deleted — take the path back out and the file returns.
 *
 * Paths are the `src` exactly as written in lib/products.ts and
 * lib/marketing-assets.ts, spaces and all.
 *
 * What one entry reaches, all of it automatic:
 *
 * - the shot drops out of every product gallery (lib/catalog.ts)
 * - a product whose *lead* shot is withheld comes down from the dark build
 *   entirely, rather than promoting whatever was next in its gallery
 * - marketing figures and the sponsor heroes skip it, and the next live shot
 *   in the chain slides into its place (lib/marketing-assets.ts)
 * - `npm run build` publishes no neutral /media/<hash> copy of it
 * - `npm run deploy` drops it from the assets it uploads, so the original URL
 *   404s instead of staying quietly fetchable
 *
 * See docs/going-dark.md § "Withholding a single photo".
 *
 * scripts/dark-media.mjs reads this array literally — keep it plain strings.
 */
export const DARK_HIDDEN_MEDIA: readonly string[] = [
  "/product images/Sam Burns Polo/Sam Burns Polo Flatlay GPT.png",
  "/product images/Justin Rose Quarter Zip/Justin Rose Logo Q Zip.png",
];

/** True when this file is withheld from the build being produced. */
export function isMediaDark(src: string): boolean {
  return LOCKDOWN && DARK_HIDDEN_MEDIA.includes(src);
}
