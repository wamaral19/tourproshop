import { getAllProducts, type CatalogProduct } from "./catalog";
import { isPlayerHidden } from "./players";
import { getProductLabel } from "./product-labels";
import type { ProductImage } from "./products";
import { PLAYER_NAMES_HIDDEN } from "./site-mode";

/**
 * Player-attributed imagery used on the marketing pages.
 *
 * The storefront surfaces (shop, roster, PDPs) already drop a player the moment
 * their slug lands in HIDDEN_PLAYERS, because they read from the catalog. The
 * marketing pages did not: they hardcoded `<Image src="/product images/...">`,
 * so taking a player dark meant hand-swapping the same photo across several
 * files and hoping none were missed.
 *
 * Everything here is attributed to a player slug and resolved through a
 * fallback chain, so a dark player falls out of these pages automatically and
 * the next live example slides into their place.
 *
 * See docs/going-dark.md.
 */

export type MarketingImage = {
  /** Whose gear this is. Drives the automatic drop when they go dark. */
  playerSlug: string;
  src: string;
  alt: string;
  /**
   * How the shot sits in its frame. A property of the asset, not the page:
   * cut-out flatlays on transparent backgrounds need `contain` over a light
   * panel, on-body photography needs `cover`. Carrying it here is what lets one
   * asset substitute for another without the page knowing which it got.
   */
  fit?: "contain" | "cover";
  /** Tailwind background for the frame behind a `contain` shot. */
  panel?: string;
  /** Extra classes for the image itself, e.g. `scale-110` to crop in. */
  imageClassName?: string;
  /**
   * Alt text to use while PLAYER_NAMES_HIDDEN is on. Written out rather than
   * derived, because alt text is copy: "a tour polo with its sponsor lineup
   * intact" is not something you get by find-and-replacing a name out of the
   * real sentence.
   */
  genericAlt: string;
  /**
   * The catalog product this shot is of, when it is of one. Set it and the
   * image also follows the product's own switches — HIDDEN_PRODUCTS and
   * `visible: false` — so retiring a single garment pulls its marketing
   * photography too, without taking the player down with it.
   */
  productSlug?: string;
};

/**
 * An image is live when its player is live and — if it names one — its product
 * is still in the visible catalog.
 */
function isLive(image: MarketingImage, liveSlugs: ReadonlySet<string>): boolean {
  if (isPlayerHidden(image.playerSlug)) return false;
  if (image.productSlug && !liveSlugs.has(image.productSlug)) return false;
  return true;
}

function liveProductSlugs(): ReadonlySet<string> {
  return new Set(getAllProducts().map((product) => product.slug));
}

/** The first image in the chain that is still live, or null. */
export function pickLiveImage(
  chain: readonly MarketingImage[],
): MarketingImage | null {
  const slugs = liveProductSlugs();
  return chain.find((image) => isLive(image, slugs)) ?? null;
}

/**
 * The live images in the chain, capped at `count` if given. Callers render
 * however many come back — the carousels that use these degrade to fewer slides
 * (and, at one slide, to a plain static frame) rather than breaking.
 */
export function pickLiveImages(
  chain: readonly MarketingImage[],
  count?: number,
): MarketingImage[] {
  const slugs = liveProductSlugs();
  const live = chain.filter((image) => isLive(image, slugs));
  return count === undefined ? live : live.slice(0, count);
}

/* ── Sponsor-callout hero ──────────────────────────────────────────────────
 * /agents, /apparel, and /sponsors all lead with the same thing: a flatlay
 * carrying sponsor hotspots, plus that player's sponsor list. Rather than name
 * a product slug in three places, resolve it from the live catalog — any
 * visible product with a hotspotted image works, and the preference list only
 * decides which one we'd rather show. */

/** Preferred heroes, best first. Anything not listed is still eligible. */
const SPONSOR_HERO_PREFERENCE: readonly string[] = [
  "sam-burns-polo",
  "jj-spaun-polo",
  "ben-griffin-polo",
  "jackson-koivun-polo",
  "si-woo-kim-polo",
];

/** The alt text to render for a marketing shot, honoring PLAYER_NAMES_HIDDEN. */
export function resolveAlt(image: MarketingImage): string {
  return PLAYER_NAMES_HIDDEN ? image.genericAlt : image.alt;
}

/**
 * The caption under a marketing shot: the apparel brand and garment while names
 * are hidden ("Peter Millar polo"), the real product name otherwise. Null when
 * the shot isn't of a catalog product.
 */
export function resolveCaption(image: MarketingImage): string | null {
  if (!image.productSlug) return null;
  const product = getAllProducts().find((p) => p.slug === image.productSlug);
  return product ? getProductLabel(product) : null;
}

export type SponsorHero = { product: CatalogProduct; image: ProductImage };

/**
 * Resolves the sponsor-callout hero from visible catalog products. Matching on
 * the presence of hotspots rather than on a filename means a re-shot or renamed
 * flatlay still resolves. Returns null only if no live product has one, in
 * which case the pages render their hero copy without the image.
 */
export function getSponsorHotspotHero(): SponsorHero | null {
  const live = getAllProducts();
  const ranked = [...live].sort((a, b) => {
    const ai = SPONSOR_HERO_PREFERENCE.indexOf(a.slug);
    const bi = SPONSOR_HERO_PREFERENCE.indexOf(b.slug);
    return (
      (ai === -1 ? Number.MAX_SAFE_INTEGER : ai) -
      (bi === -1 ? Number.MAX_SAFE_INTEGER : bi)
    );
  });

  for (const product of ranked) {
    const image = product.images.find((img) => (img.hotspots?.length ?? 0) > 0);
    if (image) return { product, image };
  }
  return null;
}

/**
 * Every live product that has a sponsor-hotspotted shot, in the same preference
 * order — one carousel slide each. This is what the Partners heroes render: the
 * pitch is "look how many sponsor marks are on tour gear", and several garments
 * make that case better than one.
 */
export function getSponsorHotspotHeroes(): SponsorHero[] {
  const seen = new Set<string>();
  const heroes: SponsorHero[] = [];
  const first = getSponsorHotspotHero();
  if (first) {
    heroes.push(first);
    seen.add(first.product.slug);
  }
  for (const product of getAllProducts()) {
    if (seen.has(product.slug)) continue;
    const image = product.images.find((img) => (img.hotspots?.length ?? 0) > 0);
    if (!image) continue;
    heroes.push({ product, image });
    seen.add(product.slug);
  }
  return heroes;
}

/* ── Home "shop by category" tiles ─────────────────────────────────────────── */

export const HOME_CATEGORY_IMAGES: Record<string, readonly MarketingImage[]> = {
  polos: [
    {
      playerSlug: "sam-burns",
      src: "/product images/Sam Burns Polo/Sam Burns Open Shirt.avif",
    productSlug: "sam-burns-polo",
      alt: "Sam Burns in his Peter Millar polo — on-course lifestyle shot",
      genericAlt: "A tour polo worn on course",
    },
    {
      playerSlug: "cameron-young",
      src: "/product images/Cam Young Polo/Cam Young Lifestyle 02.jpg",
    productSlug: "cameron-young-polo",
      alt: "Cameron Young in his Peter Millar polo — on-course lifestyle shot",
      genericAlt: "A tour polo worn on course",
    },
    {
      playerSlug: "si-woo-kim",
      src: "/product images/Si Woo Kim Blade Polo/Si Woo Polo Lifestyle 01.png",
    productSlug: "si-woo-kim-polo",
      alt: "Si Woo Kim in his blade-collar tournament polo",
      genericAlt: "A blade-collar tour polo worn on course",
    },
  ],
  outerwear: [
    {
      playerSlug: "min-woo-lee",
      src: "/product images/Min Woo Lee Track Jacket/Min Woo Lee Track Jacket 001.avif",
    productSlug: "min-woo-lee-track-jacket",
      alt: "Min Woo Lee in his Lululemon track jacket",
      genericAlt: "A tour track jacket worn on course",
    },
    {
      playerSlug: "justin-rose",
      src: "/product images/Justin Rose Quarter Zip/Justin Rose Q Zip Lifestyle.png",
    productSlug: "justin-rose-quarter-zip",
      alt: "Justin Rose in his Peter Millar quarter zip",
      genericAlt: "A tour quarter zip worn on course",
    },
  ],
  headwear: [
    {
      playerSlug: "keith-mitchell",
      src: "/product images/Keith Mitchell Visor/White/Keith Mitchell Visor 02.webp",
      productSlug: "keith-mitchell-visor",
      alt: "Keith Mitchell in his Imperial tour visor",
      genericAlt: "A tour visor worn on course",
    },
  ],
};

/* ── Marketing figure pairs ────────────────────────────────────────────────── */

/**
 * "The full sponsor lineup, intact" figure — used on /for-players. Two
 * side-by-side shots of tournament gear with the sponsor marks left on.
 */
export const SPONSOR_LINEUP_FIGURE: readonly MarketingImage[] = [
  {
    playerSlug: "jj-spaun",
    src: "/product images/JJ Spaun Polo/JJ Spaun Polo Logo GPT.png",
    productSlug: "jj-spaun-polo",
    alt: "A tournament polo with the player's full sponsor lineup intact",
    genericAlt: "A tournament polo with its full sponsor lineup intact",
    fit: "cover",
    panel: "bg-white",
    imageClassName: "scale-110",
  },
  {
    playerSlug: "sam-burns",
    src: "/product images/Sam Burns Polo/Sam Burns Polo Flatlay GPT.png",
    productSlug: "sam-burns-polo",
    alt: "Sam Burns's Peter Millar polo with his tour sponsor placements",
    genericAlt: "A tournament polo flatlay with its tour sponsor placements",
    fit: "contain",
    panel: "bg-surface-raised",
    imageClassName: "scale-110",
  },
  {
    playerSlug: "ben-griffin",
    src: "/product images/Ben Griffin Polo/Ben Griffin Polo Flatlay GPT.png",
    productSlug: "ben-griffin-polo",
    alt: "Ben Griffin's Holderness & Bourne polo with his tour sponsor placements",
    genericAlt: "A tournament polo flatlay with its tour sponsor placements",
    fit: "contain",
    panel: "bg-surface-raised",
  },
  {
    playerSlug: "jackson-koivun",
    src: "/product images/Jackson Koivun Polo/Jackson Koivun Flatlay GPT.webp",
    productSlug: "jackson-koivun-polo",
    alt: "Jackson Koivun's tournament polo with his sponsor placements",
    genericAlt: "A tournament polo flatlay with its sponsor placements",
    fit: "contain",
    panel: "bg-surface-raised",
  },
];

/**
 * "More sponsorship value" figure — used on /agents and /for-players.
 * Deliberately a different category mix from SPONSOR_LINEUP_FIGURE so the two
 * figures don't show the same two photos.
 */
export const SPONSOR_PLACEMENT_FIGURE: readonly MarketingImage[] = [
  {
    playerSlug: "min-woo-lee",
    src: "/product images/Min Woo Lee Track Jacket/Lululemon Track Jacket Logo Flatlay.png",
    productSlug: "min-woo-lee-track-jacket",
    alt: "Min Woo Lee's Lululemon pullover with sponsor placements",
    genericAlt: "A tour pullover with its sponsor placements",
    fit: "contain",
    panel: "bg-[#e6e6e6]",
  },
  {
    playerSlug: "keith-mitchell",
    src: "/product images/Keith Mitchell Visor/Spruce/KMCGV-3_3.webp",
    productSlug: "keith-mitchell-visor",
    alt: "Keith Mitchell's Imperial tour visor with Mizuno and Cisco marks",
    genericAlt: "A tour visor with its sponsor marks",
    fit: "cover",
    panel: "bg-white",
  },
  {
    playerSlug: "justin-rose",
    src: "/product images/Justin Rose Quarter Zip/Justin Rose Logo Q Zip.png",
    productSlug: "justin-rose-quarter-zip",
    alt: "Justin Rose's Peter Millar quarter zip with sponsor placements",
    genericAlt: "A tour quarter zip with its sponsor placements",
    fit: "contain",
    panel: "bg-[#e6e6e6]",
  },
  {
    playerSlug: "si-woo-kim",
    src: "/product images/Si Woo Kim Blade Polo/Si Woo Blade Logo Flatlay 01.png",
    productSlug: "si-woo-kim-polo",
    alt: "Si Woo Kim's blade-collar polo with sponsor placements",
    genericAlt: "A blade-collar polo with its sponsor placements",
    fit: "contain",
    panel: "bg-[#e6e6e6]",
  },
];
