# Shopify migration notes

The storefront should keep rendering `Product` / `CatalogProduct` objects. The
source can change from local demo data to Shopify behind `lib/catalog.ts`.

## Current boundary

- Product pages, shop filters, player redirects, and featured rails should read
  through `lib/catalog.ts`.
- Demo products live in `lib/products.ts`.
- A future Shopify mapper is scaffolded in `lib/shopify-catalog.ts`.

When switching to Shopify, replace the internals of these functions:

```ts
getAllProducts()
getFeaturedProducts()
getProductBySlug(slug)
getProductsByPlayer(playerSlug)
hasProductsForPlayer(playerSlug)
getBrands()
```

Keep their return shapes the same so page components do not need to change.

## Shopify field mapping

| TPS field | Shopify source |
|---|---|
| `id` | Product `id`, usually a Shopify GID. |
| `slug` | Product `handle`. |
| `name` | Product `title`. |
| `category` | Product `productType`, mapped to `polos`, `outerwear`, or `headwear`. |
| `playerSlug` | Product tag or metafield. Recommended tag format: `player:ben-griffin`. |
| `brand` | Product `vendor`. |
| `price` | First available variant price, or selected variant price later. |
| `compareAtPrice` | Variant `compareAtPrice`. |
| `description` | Product `description` or rich-text metafield. |
| `details` | Recommended product metafield, such as `custom.details`. |
| `sizes` | Variant selected option named `Size`. |
| `colorways` | Variant selected option named `Color`, plus optional color hex metafields. |
| `images` | Product images: `url` and `altText`. |
| `badge` | Product tags such as `New`, `Limited`, `Restock`, `Exclusive`. |
| `featured` | Product tag `Featured`, or a Shopify collection. |

## Recommended Shopify setup

- Use the product handle as the URL slug.
- Use variant options named exactly `Size` and `Color`.
- Add a `player:<slug>` tag to every TPS exclusive product.
- Add `Featured`, `New`, `Limited`, or `Restock` tags when needed.
- Put structured product bullets in a metafield instead of the description.
- Keep logo hotspot data in a metafield or local sponsor map until the Shopify
  model is finalized.

## Storefront API shape to fetch later

Fetch products with fields like:

```graphql
query Products {
  products(first: 100) {
    nodes {
      id
      handle
      title
      description
      productType
      vendor
      tags
      images(first: 10) {
        nodes {
          url
          altText
        }
      }
      variants(first: 100) {
        nodes {
          id
          availableForSale
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
          selectedOptions {
            name
            value
          }
        }
      }
    }
  }
}
```

