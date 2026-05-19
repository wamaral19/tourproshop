# Product page template

Product pages are generated from `lib/products.ts`. To add another product:

1. Add product images under `public/product images/<Product Folder>/`.
2. Copy the block below into the `products` array in `lib/products.ts`.
3. Change the fields and save.
4. Visit `/products/<slug>`.

The page design comes from `app/products/[slug]/page.tsx` and
`components/product-detail.tsx`, so each product automatically uses the same
layout as Ben Griffin's polo.

```ts
createProduct({
  slug: "first-last-product-name",
  name: "First Last Product Name",
  category: "polos",
  playerSlug: "first-last",
  brand: "Brand Name",
  price: 138,
  description:
    "Short product description that appears next to the gallery on the product page.",
  details: [
    "Fabric or material",
    "Fit note",
    "Performance feature",
    "Care instruction",
  ],
  colorways: [{ name: "White", hex: "#ffffff" }],
  images: [
    {
      src: "/product images/Product Folder/main-image.webp",
      alt: "First Last Product Name - front view",
      fit: "contain",
    },
    {
      src: "/product images/Product Folder/second-image.webp",
      alt: "First Last Product Name - detail view",
    },
  ],
  featured: true,
}),
```

## Fields

| Field | Notes |
|---|---|
| `slug` | The URL. Example: `ben-griffin-polo` becomes `/products/ben-griffin-polo`. |
| `name` | Product title shown on the page and product cards. |
| `category` | Use `"polos"`, `"outerwear"`, or `"headwear"`. This also sets default sizes. |
| `playerSlug` | Must match the player slug in `data/owgr.json`. |
| `brand` | Brand label shown above the product title. |
| `price` | Number only, without `$`. |
| `description` | Product intro copy. |
| `details` | Bullets in the "Details & fit" accordion. |
| `colorways` | Optional. Defaults to white when omitted. |
| `sizes` | Optional. Defaults by category: polos/outerwear use `S`-`XXL`, headwear uses `OS`. |
| `images` | Optional, but real product pages should include real images from `public/product images/`. |
| `badge` | Optional. Defaults to `"Exclusive"`. Also supports `"New"`, `"Limited"`, and `"Restock"`. |
| `featured` | Optional. Set `true` to show in featured product rails. |

## Hotspots

For logo callouts like Ben Griffin's polo, add `hotspots` to the image:

```ts
{
  src: "/product images/Product Folder/flatlay.png",
  alt: "Product flatlay showing sponsor placements",
  fit: "contain",
  hotspots: [
    { x: 18, y: 40, sponsorName: "Delta Air Lines" },
    { x: 38, y: 44, sponsorName: "Prometric" },
  ],
}
```

`x` and `y` are percentages across the image frame. `sponsorName` should match a
sponsor in `lib/sponsors.ts` for that player.
