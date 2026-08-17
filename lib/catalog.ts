import { isMediaDark } from "./dark-media";
import { isPlayerHidden } from "./players";
import {
  categoryLabels,
  isProductHidden,
  products as demoProducts,
  type Product,
  type ProductCategory,
} from "./products";

export type CatalogProduct = Product;
export type CatalogProductCategory = ProductCategory;

/**
 * Catalog boundary for the storefront.
 *
 * Today this file returns demo products from `lib/products.ts`. When the site
 * moves to Shopify, keep the exported functions the same and replace the
 * internals with Storefront API calls plus a mapper into `CatalogProduct`.
 */

/** Polos ship visible by default; other categories stay dark until we flip
 *  `visible: true` on the individual product. PDP routes still resolve by
 *  slug for direct links — see `getProductBySlug`. Products owned by a
 *  sitewide-hidden player, or listed in HIDDEN_PRODUCTS, are excluded
 *  regardless of the per-product flag. */
export function isProductVisible(product: Product): boolean {
  if (isPlayerHidden(product.playerSlug)) return false;
  if (isProductHidden(product.slug)) return false;
  return product.visible ?? product.category === "polos";
}

/** Drops any shot withheld from this build (lib/dark-media.ts) out of a
 *  product's gallery. Returns the product untouched when nothing is withheld,
 *  so the full build hands back exactly what lib/products.ts declares. */
function withPublishedImages(product: Product): Product {
  const images = product.images.filter((image) => !isMediaDark(image.src));
  return images.length === product.images.length
    ? product
    : { ...product, images };
}

/** A product whose lead shot is withheld comes down with it. The lead is what
 *  every card, rail, and carousel renders, so dropping only the file would
 *  promote whatever happened to be next in the gallery — usually an on-course
 *  photo of the player — onto the surfaces a lockdown exists to keep name-free.
 *  See docs/going-dark.md § "Withholding a single photo". */
function hasPublishedLead(product: Product): boolean {
  return !isMediaDark(product.images[0]?.src ?? "");
}

/** Every product in the catalog, regardless of per-product visibility. Still
 *  excludes products owned by sitewide-hidden players, products retired via
 *  HIDDEN_PRODUCTS, and products whose lead photography is withheld from this
 *  build, so direct URLs 404. Use this only for things that need to know about
 *  dark-but-live products (e.g. static path generation for PDP routes). */
export function getAllProductsIncludingHidden(): CatalogProduct[] {
  return demoProducts
    .filter(
      (p) =>
        !isPlayerHidden(p.playerSlug) &&
        !isProductHidden(p.slug) &&
        hasPublishedLead(p),
    )
    .map(withPublishedImages);
}

export function getAllProducts(): CatalogProduct[] {
  return getAllProductsIncludingHidden().filter(isProductVisible);
}

export function getFeaturedProducts(): CatalogProduct[] {
  return getAllProducts().filter((p) => p.featured);
}

export function getProductBySlug(slug: string) {
  return getAllProductsIncludingHidden().find((p) => p.slug === slug);
}

export function getProductsByPlayer(playerSlug: string) {
  return getAllProducts().filter((p) => p.playerSlug === playerSlug);
}

export function hasProductsForPlayer(playerSlug: string): boolean {
  return getAllProducts().some((p) => p.playerSlug === playerSlug);
}

/**
 * Resolves the right destination for a player tile click. Players we carry
 * gear for land on the filtered shop; everyone else gets their landing page.
 */
export function getPlayerShopHref(playerSlug: string): string {
  return hasProductsForPlayer(playerSlug)
    ? `/shop?player=${playerSlug}`
    : `/players/${playerSlug}`;
}

export function getBrands(): string[] {
  return Array.from(new Set(getAllProducts().map((p) => p.brand))).sort(
    (a, b) => a.localeCompare(b),
  );
}

export const categories = Object.keys(categoryLabels) as ProductCategory[];
export { categoryLabels };

