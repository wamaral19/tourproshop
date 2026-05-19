import type { Product, ProductCategory, ProductImage, ProductSize } from "./products";

type ShopifyMoney = {
  amount: string;
  currencyCode: string;
};

type ShopifyImage = {
  url: string;
  altText: string | null;
};

type ShopifySelectedOption = {
  name: string;
  value: string;
};

type ShopifyVariant = {
  id: string;
  availableForSale: boolean;
  price: ShopifyMoney;
  compareAtPrice: ShopifyMoney | null;
  selectedOptions: ShopifySelectedOption[];
};

export type ShopifyProductForCatalog = {
  id: string;
  handle: string;
  title: string;
  description: string;
  productType: string;
  vendor: string;
  tags: string[];
  images: { nodes: ShopifyImage[] };
  variants: { nodes: ShopifyVariant[] };
};

const CATEGORY_BY_SHOPIFY_TYPE: Record<string, ProductCategory> = {
  hat: "headwear",
  hats: "headwear",
  headwear: "headwear",
  hoodie: "outerwear",
  outerwear: "outerwear",
  polo: "polos",
  polos: "polos",
  "quarter zip": "outerwear",
  sweater: "outerwear",
};

function normalizeProductCategory(productType: string): ProductCategory {
  return CATEGORY_BY_SHOPIFY_TYPE[productType.toLowerCase()] ?? "polos";
}

function getTagValue(tags: string[], prefix: string): string | undefined {
  const normalizedPrefix = `${prefix}:`;
  return tags
    .find((tag) => tag.toLowerCase().startsWith(normalizedPrefix))
    ?.slice(normalizedPrefix.length)
    .trim();
}

function selectedValues(variants: ShopifyVariant[], optionName: string) {
  const values = variants.flatMap((variant) =>
    variant.selectedOptions
      .filter((option) => option.name.toLowerCase() === optionName)
      .map((option) => option.value),
  );
  return Array.from(new Set(values));
}

function mapShopifyImages(product: ShopifyProductForCatalog): ProductImage[] {
  return product.images.nodes.map((image) => ({
    src: image.url,
    alt: image.altText ?? product.title,
  }));
}

/**
 * Future Shopify mapper.
 *
 * Keep page components pointed at `Product`. Shopify's Storefront API shape can
 * stay isolated here: `handle` becomes `slug`, variants become sizes/colors,
 * and tags/metafields can carry TPS-only data like `playerSlug`.
 */
export function mapShopifyProductToCatalogProduct(
  shopifyProduct: ShopifyProductForCatalog,
): Product {
  const variants = shopifyProduct.variants.nodes;
  const firstVariant = variants[0];
  const sizes = selectedValues(variants, "size") as ProductSize[];
  const colors = selectedValues(variants, "color");

  return {
    id: shopifyProduct.id,
    slug: shopifyProduct.handle,
    name: shopifyProduct.title,
    category: normalizeProductCategory(shopifyProduct.productType),
    playerSlug: getTagValue(shopifyProduct.tags, "player") ?? "",
    brand: shopifyProduct.vendor,
    price: Number(firstVariant?.price.amount ?? 0),
    compareAtPrice: firstVariant?.compareAtPrice
      ? Number(firstVariant.compareAtPrice.amount)
      : undefined,
    description: shopifyProduct.description,
    details: [],
    sizes: sizes.length > 0 ? sizes : ["OS"],
    colorways:
      colors.length > 0
        ? colors.map((name) => ({ name, hex: "#ffffff" }))
        : [{ name: "Default", hex: "#ffffff" }],
    images: mapShopifyImages(shopifyProduct),
    badge: shopifyProduct.tags.includes("New") ? "New" : "Exclusive",
    featured: shopifyProduct.tags.includes("Featured"),
  };
}

