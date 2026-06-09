export type ProductCategory = "polos" | "outerwear" | "headwear";

export type ProductSize = "XS" | "S" | "M" | "L" | "XL" | "XXL" | "XXXL" | "OS";

/** Coordinates are percentages (0–100) of the image's intrinsic frame, where
 *  (0,0) is top-left. `sponsorName` must match a sponsor returned by
 *  `getSponsorsByPlayer(product.playerSlug)`. */
export type ProductImageHotspot = {
  x: number;
  y: number;
  sponsorName: string;
};

export type ProductImage = {
  src: string;
  alt: string;
  /** How the image fits its frame. Defaults to "cover" (fashion-shot crop).
   *  Use "contain" for landscape flatlays so the full image stays visible. */
  fit?: "cover" | "contain";
  /** Vertical alignment inside the slide frame for `fit: "contain"`. Defaults
   *  to "center"; use "top" to anchor a flatlay to the top edge so all
   *  letterbox space falls below it. */
  align?: "center" | "top";
  /** Override for the slide backdrop behind a contained image. Match this to
   *  the photo's own backdrop to hide the seam between image and frame. */
  bgColor?: string;
  /** When set, the product gallery overlays clickable "+" callouts on this
   *  image, each opening a popover with the sponsor's name and blurb. */
  hotspots?: ProductImageHotspot[];
  /** Ties this image to a specific colorway by name (must match a
   *  `colorways[].name`). When the PDP's colorway picker has at least one
   *  matching image, the gallery filters down to that colorway plus any
   *  untagged images (treated as shared across all colorways). Omit to make
   *  the image colorway-agnostic. */
  colorway?: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  /** Slug of the exclusive player this piece belongs to. */
  playerSlug: string;
  /** Apparel brand the player wears for this category. */
  brand: string;
  price: number;
  compareAtPrice?: number;
  description: string;
  details: string[];
  /** Adult size run (the default). Required for every product. */
  sizes: ProductSize[];
  /** Youth size run when the product offers one. Polos and outerwear get
   *  filled in by `createProduct` by default; headwear and any future
   *  adult-only piece leaves this undefined and hides the PDP toggle. */
  youthSizes?: ProductSize[];
  colorways: { name: string; hex: string }[];
  images: ProductImage[];
  badge?: "New" | "Limited" | "Restock" | "Exclusive";
  featured?: boolean;
  /** Controls storefront visibility. When omitted, polos are visible and
   *  other categories are hidden — the PDP route still resolves by slug for
   *  direct links, but the product won't appear in shop/featured/related
   *  surfaces or player navigation. Set explicitly to flip a single piece on. */
  visible?: boolean;
};

const POLO_SIZES: ProductSize[] = ["S", "M", "L", "XL", "XXL"];
const OUTERWEAR_SIZES: ProductSize[] = ["S", "M", "L", "XL", "XXL"];
const HEADWEAR_SIZES: ProductSize[] = ["OS"];

/** Youth size runs for the categories that offer them. Headwear stays
 *  one-size and never gets a youth split. Youth uses the same letter codes
 *  as adult so the underlying type stays clean; the PDP shows the age range
 *  below each letter via `YOUTH_AGE_RANGE`. */
const YOUTH_POLO_SIZES: ProductSize[] = ["XS", "S", "M", "L"];
const YOUTH_OUTERWEAR_SIZES: ProductSize[] = ["XS", "S", "M", "L"];

/** Maps a youth letter size to the age range we show under it on the PDP
 *  size picker and in cart-line metadata. */
export const YOUTH_AGE_RANGE: Partial<Record<ProductSize, string>> = {
  XS: "5–6",
  S: "7–8",
  M: "10–12",
  L: "14–16",
};

const DEFAULT_SIZES_BY_CATEGORY: Record<ProductCategory, ProductSize[]> = {
  polos: POLO_SIZES,
  outerwear: OUTERWEAR_SIZES,
  headwear: HEADWEAR_SIZES,
};

/** Categories that offer a youth-sized run alongside adult. Headwear is
 *  intentionally absent — the PDP age toggle hides for those. */
const DEFAULT_YOUTH_SIZES_BY_CATEGORY: Partial<
  Record<ProductCategory, ProductSize[]>
> = {
  polos: YOUTH_POLO_SIZES,
  outerwear: YOUTH_OUTERWEAR_SIZES,
};

type ProductTemplateInput = Omit<
  Product,
  "id" | "sizes" | "youthSizes" | "colorways" | "images" | "badge"
> &
  Partial<
    Pick<Product, "id" | "sizes" | "youthSizes" | "colorways" | "images" | "badge">
  >;

function createProduct(product: ProductTemplateInput): Product {
  return {
    id: product.id ?? product.slug,
    sizes: product.sizes ?? DEFAULT_SIZES_BY_CATEGORY[product.category],
    youthSizes:
      product.youthSizes ?? DEFAULT_YOUTH_SIZES_BY_CATEGORY[product.category],
    colorways: product.colorways ?? [{ name: "White", hex: "#ffffff" }],
    images:
      product.images && product.images.length > 0
        ? product.images
        : [
            {
              src: `/placeholders/product-${product.slug}.svg`,
              alt: product.name,
            },
          ],
    badge: product.badge ?? "Exclusive",
    ...product,
  };
}

/**
 * Mock catalog. Every piece is tied to an Exclusive player and the apparel
 * brand they wear in that category. Structured to mirror what we'll later map
 * from the Shopify Storefront API — only the data layer changes when we wire
 * up Shopify.
 */
export const products: Product[] = [
  // ─── Ben Griffin · Holderness & Bourne ─────────────────────────────────────
  createProduct({
    id: "bg-polo",
    slug: "ben-griffin-polo",
    name: "Ben Griffin Polo",
    category: "polos",
    playerSlug: "ben-griffin",
    brand: "Holderness & Bourne",
    price: 112,
    description:
      "A staple look for Ben Griffin from inside the ropes. The Anderson polo from Holderness & Bourne with Ben's sponsor logos. The Anderson is a crisp polo crafted from Holderness & Bourne's jersey knit performance fabric with stretch, moisture wicking, and a soft hand.",
    details: [
      "88% polyester / 12% elastane jersey knit",
      "UPF 50+ sun protection",
      "4-way stretch with moisture wicking",
      "Sewn-in collar stays",
      "Structured cutaway collar",
      "Three-button set-in placket",
      "H&B signature athletic fit",
      "Machine wash cold; tumble dry low or hang dry",
    ],
    sizes: ["S", "M", "L", "XL"],
    images: [
      {
        src: "/product images/Ben Griffin Polo/Ben Griffin Polo Flatlay GPT.png",
        alt: "Ben Griffin Holderness & Bourne polo — flatlay showing sponsor placements",
        fit: "contain",
        bgColor: "#f4f1ea",
        // Hotspot positions are percentages of the slide frame. Tweak as the
        // photo gets recropped or replaced.
        hotspots: [
          { x: 18.5, y: 33.4, sponsorName: "Delta Air Lines" },
          { x: 38, y: 37.1, sponsorName: "Prometric" },
          { x: 62.8, y: 37.1, sponsorName: "Lord Abbett" },
          { x: 82.2, y: 29.8, sponsorName: "Holderness & Bourne" },
          { x: 65.6, y: 18.7, sponsorName: "Zurich Insurance Group" },
        ],
      },
      {
        src: "/product images/Ben Griffin Polo/Ben Griffin Lifestyle Shot 1.png",
        alt: "Ben Griffin Holderness & Bourne polo — on-course lifestyle shot",
        fit: "contain",
        bgColor: "#f4f1ea",
      },
      {
        src: "/product images/Ben Griffin Polo/Ben Griffin Polo - 1 Stock H&B.webp",
        alt: "Ben Griffin Holderness & Bourne polo — front view",
      },
      {
        src: "/product images/Ben Griffin Polo/Ben Griffin 2 Stock H&B Polo.webp",
        alt: "Ben Griffin Holderness & Bourne polo — alternate angle",
      },
      {
        src: "/product images/Ben Griffin Polo/Ben Griffin 3 Stock H&B.webp",
        alt: "Ben Griffin Holderness & Bourne polo — detail",
      },
    ],
    featured: true,
  }),
  createProduct({
    id: "bg-hoodie",
    slug: "ben-griffin-hoodie",
    name: "Ben Griffin Hoodie",
    category: "outerwear",
    playerSlug: "ben-griffin",
    brand: "Holderness & Bourne",
    price: 198,
    description:
      "Heavyweight brushed-back hoodie from Holderness & Bourne in Griffin's range-day spec. Soft hand, dropped shoulders, embroidered BG mark.",
    details: [
      "Brushed-back cotton-poly fleece",
      "Self-lined hood",
      "Kangaroo pocket",
      "Embroidered BG mark at chest",
    ],
    sizes: OUTERWEAR_SIZES,
    colorways: [
      { name: "Deep Fairway", hex: "#30682b" },
      { name: "Cream", hex: "#f4f1ea" },
    ],
    images: [{ src: "/placeholders/product-bg-hoodie.svg", alt: "Ben Griffin Hoodie" }],
    featured: true,
  }),
  createProduct({
    id: "bg-hat",
    slug: "ben-griffin-hat",
    name: "Ben Griffin Hat",
    category: "headwear",
    playerSlug: "ben-griffin",
    brand: "Holderness & Bourne",
    price: 52,
    description:
      "Griffin's tournament cap by Holderness & Bourne. Six-panel structured build, sponsor mark front-and-center, leather strap.",
    details: [
      "Brushed cotton twill",
      "Buckram-fronted six-panel build",
      "Embroidered sponsor mark",
      "Leather strap with brass buckle",
    ],
    sizes: HEADWEAR_SIZES,
    colorways: [
      { name: "Cream", hex: "#f4f1ea" },
      { name: "Ink", hex: "#1a1a1a" },
    ],
    images: [{ src: "/placeholders/product-bg-hat.svg", alt: "Ben Griffin Hat" }],
  }),

  // ─── James Nicholas · Greyson ──────────────────────────────────────────────
  {
    id: "jn-polo",
    slug: "james-nicholas-polo",
    name: "James Nicholas Polo",
    category: "polos",
    playerSlug: "james-nicholas",
    brand: "Greyson Clothiers",
    price: 120,
    description:
      "A staple look for James Nicholas inside the ropes. A printed performance polo from Greyson Clothiers with James's sponsor logos — built on Greyson's signature jersey, with their iconic wolf mark at the chest and a two-tone striped collar.",
    details: [
      "Performance jersey blend with stretch and moisture wicking",
      "UPF 50+ sun protection",
      "Contrast two-tone striped collar",
      "Three-button placket",
      "Embroidered Greyson wolf at left chest",
      "Tour sponsor placements",
      "Machine wash cold; tumble dry low or hang dry",
    ],
    sizes: POLO_SIZES,
    youthSizes: YOUTH_POLO_SIZES,
    colorways: [{ name: "Ice Blue", hex: "#c9d6e2" }],
    images: [
      {
        src: "/product images/James Nicholas Polo/James Nicholas Polo Flatlay Sponsor1.png",
        alt: "James Nicholas Greyson Clothiers polo — flatlay showing sponsor placements",
        fit: "contain",
        bgColor: "#f4f1ea",
        hotspots: [
          { x: 35, y: 22, sponsorName: "Greyson Clothiers" },
          { x: 18, y: 33, sponsorName: "Pepe Auto Group" },
          { x: 37.5, y: 32, sponsorName: "IKON Pass" },
          { x: 62, y: 33, sponsorName: "protiviti" },
        ],
      },
      {
        src: "/product images/James Nicholas Polo/James Nicholas Polo 2.webp",
        alt: "James Nicholas Greyson Clothiers polo — front view",
      },
      {
        src: "/product images/James Nicholas Polo/James Nicholas Polo 3.webp",
        alt: "James Nicholas Greyson Clothiers polo — alternate angle",
      },
      {
        src: "/product images/James Nicholas Polo/James Nicholas Polo 4.webp",
        alt: "James Nicholas Greyson Clothiers polo — detail",
      },
      {
        src: "/product images/James Nicholas Polo/James Nicholas Polo 5.webp",
        alt: "James Nicholas Greyson Clothiers polo — back view",
      },
      {
        src: "/product images/James Nicholas Polo/James Nicholas Polo 6.webp",
        alt: "James Nicholas Greyson Clothiers polo — collar detail",
      },
    ],
    badge: "Exclusive",
    featured: true,
  },
  {
    id: "jn-hoodie",
    slug: "james-nicholas-hoodie",
    name: "James Nicholas Hoodie",
    category: "outerwear",
    playerSlug: "james-nicholas",
    brand: "Greyson",
    price: 218,
    description:
      "Greyson's heavyweight hoodie in Nicholas's off-course rotation. French terry, ribbed cuffs, the wolf at the chest.",
    details: [
      "Heavyweight French terry",
      "Self-lined hood with woven drawcords",
      "Kangaroo pocket",
      "Embroidered Greyson wolf",
    ],
    sizes: OUTERWEAR_SIZES,
    youthSizes: YOUTH_OUTERWEAR_SIZES,
    colorways: [
      { name: "Smoke", hex: "#5a5a5a" },
      { name: "Bone", hex: "#ece6d8" },
    ],
    images: [{ src: "/placeholders/product-jn-hoodie.svg", alt: "James Nicholas Hoodie" }],
    badge: "Exclusive",
  },
  {
    id: "jn-hat",
    slug: "james-nicholas-hat",
    name: "James Nicholas Hat",
    category: "headwear",
    playerSlug: "james-nicholas",
    brand: "Greyson",
    price: 48,
    description:
      "Greyson's six-panel rope cap as Nicholas wears it. Wolf at the front, sponsor mark on the side.",
    details: [
      "Washed cotton twill",
      "Rope detail along brim",
      "Embroidered Greyson wolf",
      "Adjustable back strap",
    ],
    sizes: HEADWEAR_SIZES,
    colorways: [
      { name: "Bone", hex: "#ece6d8" },
      { name: "Forest", hex: "#2c4a3a" },
    ],
    images: [{ src: "/placeholders/product-jn-hat.svg", alt: "James Nicholas Hat" }],
    badge: "Exclusive",
  },

  // ─── Keith Mitchell · Sid Mashburn ─────────────────────────────────────────
  {
    id: "km-polo",
    slug: "keith-mitchell-polo",
    name: "Keith Mitchell Polo",
    category: "polos",
    playerSlug: "keith-mitchell",
    brand: "Sid Mashburn",
    price: 165,
    description:
      "Sid Mashburn's tailored knit polo in Mitchell's tournament spec. Italian cotton, three-button placket, sponsor logos intact.",
    details: [
      "Italian-knit pima cotton",
      "Three-button mother-of-pearl placket",
      "Tonal stitch detail",
      "Tour sponsor placements",
    ],
    sizes: POLO_SIZES,
    youthSizes: YOUTH_POLO_SIZES,
    colorways: [
      { name: "Stone", hex: "#bdb29c" },
      { name: "Navy", hex: "#1f3148" },
    ],
    images: [{ src: "/placeholders/product-km-polo.svg", alt: "Keith Mitchell Polo" }],
    badge: "Exclusive",
    visible: false,
  },
  {
    id: "km-cashmere-sweater",
    slug: "keith-mitchell-cashmere-sweater",
    name: "Keith Mitchell Cashmere Sweater",
    category: "outerwear",
    playerSlug: "keith-mitchell",
    brand: "Sid Mashburn",
    price: 395,
    description:
      "Sid Mashburn cashmere crewneck in Mitchell's clubhouse rotation. Italian-spun yarn, ribbed cuffs and hem, quietly sponsor-marked.",
    details: [
      "Italian-spun cashmere",
      "12-gauge knit",
      "Ribbed cuffs and hem",
      "Tonal sponsor mark at left chest",
    ],
    sizes: OUTERWEAR_SIZES,
    youthSizes: YOUTH_OUTERWEAR_SIZES,
    colorways: [
      { name: "Camel", hex: "#a98860" },
      { name: "Navy", hex: "#1f3148" },
    ],
    images: [
      {
        src: "/placeholders/product-km-cashmere.svg",
        alt: "Keith Mitchell Cashmere Sweater",
      },
    ],
    badge: "Exclusive",
    featured: true,
  },
  {
    id: "km-visor",
    slug: "keith-mitchell-visor",
    name: "Keith Mitchell Visor",
    category: "headwear",
    playerSlug: "keith-mitchell",
    brand: "Imperial",
    price: 49,
    description:
      "Mitchell's signature look from inside the ropes — Imperial's tour visor in his three tournament colorways. Cotton twill front panel with a structured build, sweat-wicking band, and Keith's sponsor placements intact: Cisco at the front, Mizuno along the side.",
    details: [
      "Heavy cotton twill front panel",
      "Structured, pre-curved brim",
      "Sweat-wicking interior band",
      "Embroidered Cisco mark at front, Mizuno runbird at side",
      "Adjustable hook-and-loop back closure",
      "One size fits most",
    ],
    sizes: HEADWEAR_SIZES,
    colorways: [
      { name: "Putty", hex: "#c2a983" },
      { name: "Spruce", hex: "#2d4a3a" },
      { name: "White", hex: "#f7f3ea" },
    ],
    images: [
      {
        src: "/product images/Keith Mitchell Visor/Putty/KMCGV_2_1.webp",
        alt: "Keith Mitchell Imperial Tour Visor in Putty — front view with Cisco mark",
        colorway: "Putty",
      },
      {
        src: "/product images/Keith Mitchell Visor/Putty/KMCGV_2_2.webp",
        alt: "Keith Mitchell Imperial Tour Visor in Putty — Cisco front detail",
        colorway: "Putty",
      },
      {
        src: "/product images/Keith Mitchell Visor/Putty/KMCGV_2_3.webp",
        alt: "Keith Mitchell Imperial Tour Visor in Putty — angled view",
        colorway: "Putty",
      },
      {
        src: "/product images/Keith Mitchell Visor/Putty/KMCGV_2_4.webp",
        alt: "Keith Mitchell Imperial Tour Visor in Putty — side view with Mizuno mark",
        colorway: "Putty",
      },
      {
        src: "/product images/Keith Mitchell Visor/Putty/KMCGV_2_5.webp",
        alt: "Keith Mitchell Imperial Tour Visor in Putty — back closure detail",
        colorway: "Putty",
      },
      {
        src: "/product images/Keith Mitchell Visor/Spruce/KMCGV-3_1.webp",
        alt: "Keith Mitchell Imperial Tour Visor in Spruce — front view with Cisco mark",
        colorway: "Spruce",
      },
      {
        src: "/product images/Keith Mitchell Visor/Spruce/KMCGV-3_2.webp",
        alt: "Keith Mitchell Imperial Tour Visor in Spruce — Mizuno side detail",
        colorway: "Spruce",
      },
      {
        src: "/product images/Keith Mitchell Visor/Spruce/KMCGV-3_3.webp",
        alt: "Keith Mitchell Imperial Tour Visor in Spruce — three-quarter view",
        colorway: "Spruce",
      },
      {
        src: "/product images/Keith Mitchell Visor/Spruce/KMCGV-3_4.webp",
        alt: "Keith Mitchell Imperial Tour Visor in Spruce — back closure detail",
        colorway: "Spruce",
      },
      {
        src: "/product images/Keith Mitchell Visor/White/Keith Mitchell Visor 01.webp",
        alt: "Keith Mitchell Imperial Tour Visor in White — front view with Mizuno and Cisco marks",
        colorway: "White",
      },
      {
        src: "/product images/Keith Mitchell Visor/White/Keith Mitchell Visor Lifestyle 01.webp",
        alt: "Keith Mitchell Imperial Tour Visor in White — on-course lifestyle shot",
        colorway: "White",
      },
      {
        src: "/product images/Keith Mitchell Visor/White/Keith Mitchell Visor 02.webp",
        alt: "Keith Mitchell Imperial Tour Visor in White — on-course context shot",
        colorway: "White",
      },
      {
        src: "/product images/Keith Mitchell Visor/White/Keith Mitchell Visor 03.webp",
        alt: "Keith Mitchell Imperial Tour Visor in White — alternate angle",
        colorway: "White",
      },
      {
        src: "/product images/Keith Mitchell Visor/White/Keith Mitchell Visor 04.webp",
        alt: "Keith Mitchell Imperial Tour Visor in White — detail shot",
        colorway: "White",
      },
    ],
    badge: "Exclusive",
    visible: true,
  },

  // ─── Cameron Young · Peter Millar ──────────────────────────────────────────
  {
    id: "cy-polo",
    slug: "cameron-young-polo",
    name: "Cameron Young Polo",
    category: "polos",
    playerSlug: "cameron-young",
    brand: "Peter Millar",
    price: 135,
    description:
      "Cameron Young's tournament look — Peter Millar's solid performance jersey polo with Cam's full sponsor lineup intact, including the unmistakable MLB mark on the right collar that nods to his Westchester roots and lifelong Yankees fandom.",
    details: [
      "Performance jersey with four-way stretch and moisture wicking",
      "UPF 50+ sun protection",
      "Self-fabric collar with rib trim",
      "Three-button placket",
      "Tour sponsor placements: Mastercard, MLB, Cisco, Mutual of Omaha, iCapital",
      "Peter Millar pennant at left hem",
      "Machine wash cold; tumble dry low or hang dry",
    ],
    sizes: POLO_SIZES,
    youthSizes: YOUTH_POLO_SIZES,
    colorways: [{ name: "White", hex: "#f7f3ea" }],
    images: [
      {
        src: "/product images/Cam Young Polo/Cam Young Polo Sponsor Logo Flatlay 01.jpg",
        alt: "Cameron Young Peter Millar polo — flatlay showing sponsor placements",
        fit: "contain",
        bgColor: "#ecebeb",
        hotspots: [
          { x: 43, y: 23, sponsorName: "MLB" },
          { x: 58, y: 23, sponsorName: "Mastercard" },
          { x: 36, y: 37, sponsorName: "Mutual of Omaha" },
          { x: 65, y: 37, sponsorName: "iCapital" },
          { x: 15, y: 40, sponsorName: "Cisco" },
        ],
      },
      {
        src: "/product images/Cam Young Polo/Cam Young Lifestyle 01.jpg",
        alt: "Cameron Young Peter Millar polo — on-course lifestyle shot",
      },
      {
        src: "/product images/Cam Young Polo/Cam Young Polo 02.jpg",
        alt: "Cameron Young Peter Millar polo — front view",
      },
      {
        src: "/product images/Cam Young Polo/Cam Young Polo 03.webp",
        alt: "Cameron Young Peter Millar polo — alternate angle",
      },
      {
        src: "/product images/Cam Young Polo/Cam Young Polo 04.webp",
        alt: "Cameron Young Peter Millar polo — detail",
      },
      {
        src: "/product images/Cam Young Polo/Cam Young Polo 05.webp",
        alt: "Cameron Young Peter Millar polo — back view",
      },
      {
        src: "/product images/Cam Young Polo/Cam Young Polo 06.webp",
        alt: "Cameron Young Peter Millar polo — collar detail",
      },
    ],
    badge: "Exclusive",
    featured: true,
    visible: true,
  },
  {
    id: "cy-quarter-zip",
    slug: "cameron-young-quarter-zip",
    name: "Cameron Young Quarter Zip",
    category: "outerwear",
    playerSlug: "cameron-young",
    brand: "Peter Millar",
    price: 178,
    description:
      "Peter Millar's tour-issue quarter zip in Young's cold-morning rotation. Performance interlock, mock collar, sponsor marks intact.",
    details: [
      "Performance interlock knit",
      "Mock collar with hidden zip garage",
      "Tour sponsor placements",
      "Embroidered PM pennant",
    ],
    sizes: OUTERWEAR_SIZES,
    youthSizes: YOUTH_OUTERWEAR_SIZES,
    colorways: [
      { name: "Navy", hex: "#1f3148" },
      { name: "Heather Stone", hex: "#a89f8c" },
    ],
    images: [
      {
        src: "/placeholders/product-cy-quarter-zip.svg",
        alt: "Cameron Young Quarter Zip",
      },
    ],
    badge: "Exclusive",
    featured: true,
  },
  {
    id: "cy-hat",
    slug: "cameron-young-hat",
    name: "Cameron Young Hat",
    category: "headwear",
    playerSlug: "cameron-young",
    brand: "Peter Millar",
    price: 46,
    description:
      "Peter Millar performance cap in Young's tournament spec. Lightweight, sweat-wicking, sponsor mark dead-center.",
    details: [
      "Performance ripstop crown",
      "Sweat-wicking band",
      "Embroidered sponsor mark",
      "Adjustable back closure",
    ],
    sizes: HEADWEAR_SIZES,
    colorways: [
      { name: "White", hex: "#f7f3ea" },
      { name: "Navy", hex: "#1f3148" },
    ],
    images: [{ src: "/placeholders/product-cy-hat.svg", alt: "Cameron Young Hat" }],
    badge: "Exclusive",
  },

  // ─── Sungjae Im · Malbon ───────────────────────────────────────────────────
  {
    id: "si-polo",
    slug: "sungjae-im-polo",
    name: "Sungjae Im Polo",
    category: "polos",
    playerSlug: "sungjae-im",
    brand: "Malbon",
    price: 142,
    description:
      "Malbon's tour-issue polo in Im's tournament spec. Buckets golfer at the chest, sponsor placements intact, performance hand.",
    details: [
      "Performance piqué blend",
      "Embroidered Buckets golfer",
      "Self-fabric collar",
      "Tour sponsor placements",
    ],
    sizes: POLO_SIZES,
    youthSizes: YOUTH_POLO_SIZES,
    colorways: [
      { name: "Cream", hex: "#f4f1ea" },
      { name: "Black", hex: "#1a1a1a" },
    ],
    images: [{ src: "/placeholders/product-si-polo.svg", alt: "Sungjae Im Polo" }],
    badge: "Exclusive",
  },
  {
    id: "si-crewneck",
    slug: "sungjae-im-crewneck-sweater",
    name: "Sungjae Im Crewneck Sweater",
    category: "outerwear",
    playerSlug: "sungjae-im",
    brand: "Malbon",
    price: 188,
    description:
      "Malbon's heavyweight crewneck as Im wears it on cold range mornings. Soft fleece, ribbed trim, Buckets at the chest.",
    details: [
      "Heavyweight cotton-poly fleece",
      "Ribbed crew neck, cuffs, and hem",
      "Embroidered Buckets golfer",
      "Tour sponsor placements",
    ],
    sizes: OUTERWEAR_SIZES,
    youthSizes: YOUTH_OUTERWEAR_SIZES,
    colorways: [
      { name: "Bone", hex: "#ece6d8" },
      { name: "Black", hex: "#1a1a1a" },
    ],
    images: [
      {
        src: "/placeholders/product-si-crewneck.svg",
        alt: "Sungjae Im Crewneck Sweater",
      },
    ],
    badge: "Exclusive",
  },
  {
    id: "si-hat",
    slug: "sungjae-im-hat",
    name: "Sungjae Im Hat",
    category: "headwear",
    playerSlug: "sungjae-im",
    brand: "Malbon",
    price: 50,
    description:
      "Malbon's six-panel cap in Im's tournament spec. Buckets golfer front-and-center, sponsor mark on the side.",
    details: [
      "Brushed cotton twill",
      "Embroidered Buckets golfer",
      "Side sponsor mark",
      "Adjustable back closure",
    ],
    sizes: HEADWEAR_SIZES,
    colorways: [
      { name: "Cream", hex: "#f4f1ea" },
      { name: "Black", hex: "#1a1a1a" },
    ],
    images: [{ src: "/placeholders/product-si-hat.svg", alt: "Sungjae Im Hat" }],
    badge: "Exclusive",
  },

  // ─── Si Woo Kim · Primo ────────────────────────────────────────────────────
  createProduct({
    id: "sw-polo",
    slug: "si-woo-kim-polo",
    name: "Si Woo Kim Polo",
    category: "polos",
    playerSlug: "si-woo-kim",
    brand: "Primo",
    price: 89,
    description:
      "Primo's Echo Classic Collar Polo in Si Woo's tournament spec — a textured grayscale print on Primo's signature performance jersey, finished with a contrast graphite collar, three-button placket, and Si Woo's full sponsor lineup intact, headlined by the CJ Group lockup of bibigo and CJ Logistics.",
    details: [
      "Performance jersey blend with stretch and moisture wicking",
      "All-over Echo print on graphite",
      "Contrast solid collar with woven Primo neck label",
      "Three-button placket",
      "Embroidered Primo script at the right chest",
      "Tour sponsor placements: NetJets, CJ Logistics, bibigo, Brock",
      "Machine wash cold; tumble dry low or hang dry",
    ],
    sizes: POLO_SIZES,
    colorways: [{ name: "Echo Graphite", hex: "#8a8d8f" }],
    images: [
      {
        src: "/product images/Si Woo Kim Blade Polo/Si Woo Blade Logo Flatlay 01.png",
        alt: "Si Woo Kim Primo Echo polo — flatlay showing sponsor placements",
        fit: "contain",
        bgColor: "#e9e8e6",
        hotspots: [
          { x: 14, y: 37, sponsorName: "NetJets" },
          { x: 40, y: 27, sponsorName: "Bibigo" },
          { x: 63, y: 22, sponsorName: "Brock" },
          { x: 80, y: 37, sponsorName: "CJ Logistics" },
        ],
      },
      {
        src: "/product images/Si Woo Kim Blade Polo/Si Woo Polo Lifestyle 01.png",
        alt: "Si Woo Kim Primo Echo polo — on-course lifestyle shot",
        fit: "contain",
        bgColor: "#e9e8e6",
      },
      {
        src: "/product images/Si Woo Kim Blade Polo/EchoClassicCollarPoloFL-1.jpg",
        alt: "Primo Echo Classic Collar Polo — unbranded flatlay",
        fit: "contain",
      },
      {
        src: "/product images/Si Woo Kim Blade Polo/EchoClassicCollarPolo-1.jpg",
        alt: "Primo Echo Classic Collar Polo — front view on model",
      },
      {
        src: "/product images/Si Woo Kim Blade Polo/EchoClassicCollarPolo-3.jpg",
        alt: "Primo Echo Classic Collar Polo — chest detail with embroidered Primo script",
      },
    ],
    badge: "Exclusive",
    featured: true,
    visible: true,
  }),
  {
    id: "sw-hoodie",
    slug: "si-woo-kim-hoodie",
    name: "Si Woo Kim Hoodie",
    category: "outerwear",
    playerSlug: "si-woo-kim",
    brand: "Primo",
    price: 178,
    description:
      "Primo's range-day hoodie as Kim wears it. Brushed fleece interior, clean exterior, sponsor placements intact.",
    details: [
      "Cotton-poly brushed fleece",
      "Self-lined hood",
      "Kangaroo pocket",
      "Primo wordmark at chest",
    ],
    sizes: OUTERWEAR_SIZES,
    youthSizes: YOUTH_OUTERWEAR_SIZES,
    colorways: [
      { name: "Marine", hex: "#284a6b" },
      { name: "Black", hex: "#1a1a1a" },
    ],
    images: [{ src: "/placeholders/product-sw-hoodie.svg", alt: "Si Woo Kim Hoodie" }],
    badge: "Exclusive",
  },
  {
    id: "sw-hat",
    slug: "si-woo-kim-hat",
    name: "Si Woo Kim Hat",
    category: "headwear",
    playerSlug: "si-woo-kim",
    brand: "Primo",
    price: 46,
    description:
      "Primo's structured cap in Kim's tournament spec. Clean front panel, sponsor mark front-and-center.",
    details: [
      "Heavy cotton twill",
      "Buckram-fronted six-panel build",
      "Embroidered sponsor mark",
      "Adjustable back closure",
    ],
    sizes: HEADWEAR_SIZES,
    colorways: [
      { name: "Marine", hex: "#284a6b" },
      { name: "Cream", hex: "#f4f1ea" },
    ],
    images: [{ src: "/placeholders/product-sw-hat.svg", alt: "Si Woo Kim Hat" }],
    badge: "Exclusive",
  },

  // ─── Min Woo Lee · Lululemon ───────────────────────────────────────────────
  createProduct({
    id: "mwl-track-jacket",
    slug: "min-woo-lee-track-jacket",
    name: "Min Woo Lee Track Jacket",
    category: "outerwear",
    playerSlug: "min-woo-lee",
    brand: "Lululemon",
    price: 188,
    description:
      "Cook up one of Min Woo's many unique looks with Lululemon's oversized track jacket — the retro colorblocked layer he reaches for on cool mornings inside the ropes. Lightweight nylon shell, stand collar, full-zip front, and a relaxed cut built to throw on over a polo.",
    details: [
      "100% recycled nylon shell",
      "Oversized fit",
      "Stand collar with full-zip front",
      "Colorblocked shoulder and side panels",
      "Elasticized cuffs and hem",
      "Zippered side pockets",
      "Machine wash cold; tumble dry low",
    ],
    colorways: [{ name: "True Navy / Natural Ivory / Auric Orange", hex: "#1f2a44" }],
    images: [
      {
        src: "/product images/Min Woo Lee Track Jacket/Lululemon Track Jacket Logo Flatlay.png",
        alt: "Min Woo Lee Lululemon Nylon Oversized Track Jacket — flatlay showing sponsor placements",
        fit: "contain",
        align: "top",
        bgColor: "#e5e4e5",
        hotspots: [
          { x: 20, y: 30, sponsorName: "IREN" },
          { x: 57.7, y: 23, sponsorName: "Lululemon" },
          { x: 80, y: 25, sponsorName: "Ares" },
        ],
      },
      {
        src: "/product images/Min Woo Lee Track Jacket/Min Woo Lee Track Lifestyle 01.avif",
        alt: "Min Woo Lee Lululemon Nylon Oversized Track Jacket — on-course lifestyle shot",
      },
      {
        src: "/product images/Min Woo Lee Track Jacket/Min Woo Lee Track Jacket 001.avif",
        alt: "Min Woo Lee Lululemon Nylon Oversized Track Jacket — on-course look",
      },
      {
        src: "/product images/Min Woo Lee Track Jacket/LM3GHIS_077281_1.webp",
        alt: "Lululemon Nylon Oversized Track Jacket — front view",
      },
      {
        src: "/product images/Min Woo Lee Track Jacket/Min Woo Lee Track Jacket 2.webp",
        alt: "Lululemon Nylon Oversized Track Jacket — full-length front view",
      },
      {
        src: "/product images/Min Woo Lee Track Jacket/Min Woo Lee Track Jacket 3.webp",
        alt: "Lululemon Nylon Oversized Track Jacket — back view",
      },
      {
        src: "/product images/Min Woo Lee Track Jacket/Min Woo Lee Track Jacket 4.webp",
        alt: "Lululemon Nylon Oversized Track Jacket — pocket and cuff detail",
      },
      {
        src: "/product images/Min Woo Lee Track Jacket/Min Woo Lee Track Jacket 5.webp",
        alt: "Lululemon Nylon Oversized Track Jacket — colorblock side panel detail",
      },
    ],
    visible: true,
  }),
];

export const featuredProducts = products.filter((p) => p.featured);

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getProductsByPlayer(playerSlug: string) {
  return products.filter((p) => p.playerSlug === playerSlug);
}

export function hasProductsForPlayer(playerSlug: string): boolean {
  return products.some((p) => p.playerSlug === playerSlug);
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

export const brands: string[] = Array.from(
  new Set(products.map((p) => p.brand)),
).sort((a, b) => a.localeCompare(b));

export const categoryLabels: Record<ProductCategory, string> = {
  polos: "Polos",
  outerwear: "Outerwear",
  headwear: "Headwear",
};

export const categories = Object.keys(categoryLabels) as ProductCategory[];
