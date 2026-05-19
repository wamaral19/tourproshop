# Roster file — `owgr.json`

This file is the single source of truth for the Player Library and TPS
Exclusives. Every page that lists players reads from here.

For product-page additions, use `PRODUCT_TEMPLATE.md`. Product pages are
generated from `lib/products.ts` and automatically reuse the standard product
detail layout. For the future Shopify path, see `SHOPIFY_MIGRATION.md`.

## Quick weekly update (rankings only)

OWGR posts new rankings each Monday at https://www.owgr.com/current-world-ranking.

1. Set `updatedAt` to today's date (`YYYY-MM-DD`)
2. Update each player's `owgrRank` to match the new week
3. Save (and `git push` to deploy)

Order in the file doesn't matter — the code sorts by `owgrRank` automatically.

## Player schema

```json
{
  "owgrRank": 11,
  "slug": "cameron-young",
  "name": "Cameron Young",
  "country": "United States",
  "countryCode": "US",
  "age": 28,
  "turnedPro": 2019,
  "signatureWin": "2025 Wyndham Championship",
  "bio": "One short sentence in the brand voice.",
  "relationship": "exclusive",
  "vendorLinks": []
}
```

| Field | Notes |
|---|---|
| `owgrRank` | **Optional.** Leave undefined for players we carry as Exclusives who aren't in the OWGR top 20 (e.g., James Nicholas). |
| `slug` | Lowercase, hyphenated, accents stripped. `Ludvig Åberg` → `ludvig-aberg`. Used to match the headshot file in `public/player images/`. |
| `relationship` | `"exclusive"` (we carry official licensed gear) or `"linked"` (we point to third-party vendors). |
| `vendorLinks` | Optional array. For `linked` players, list where to shop their look. Each entry: `{ vendor, url, kind? }`. `kind` ∈ `apparel \| equipment \| headwear \| footwear \| other`. |
| `signatureWin` | Optional. |

## Adding a new exclusive

1. Add the player block to `players` (`relationship: "exclusive"`, `owgrRank` optional)
2. Drop the headshot in `public/player images/<First Last>.<ext>` — `.jpg`, `.jpeg`, `.webp`, or `.avif`
3. Save

The image resolver matches case + accent insensitive on filename, so spelling
just needs to roughly match the player's name.

## Adding vendor links to a linked player

Edit their `vendorLinks` array:

```json
"vendorLinks": [
  { "vendor": "Nike Golf", "url": "https://www.nike.com/w/golf", "kind": "apparel" },
  { "vendor": "TaylorMade", "url": "https://www.taylormadegolf.com", "kind": "equipment" }
]
```

The player's detail page automatically renders these as vendor cards under the
"Shop His Look" section. Empty array → graceful empty state.

## Where players show up

- **Home page hero** — first 6 exclusives (ordered explicitly in `app/page.tsx`)
- **Home `Browse the roster`** — first 12 from the JSON
- **`/players`** — full roster, search + tier filter
- **`/players?tier=exclusive`** — exclusives only, with the Exclusives header
- **`/players/[slug]`** — auto-generates from each entry

---

## Future automation (not wired yet)

If/when you want to stop the weekly manual edit, the recommended path is the
DataGolf API (`datagolf.com/api-access`) — set `OWGR_DATA_URL` env var to a
URL returning this same JSON shape and the data layer in `lib/owgr.ts` will
prefer it over the local file.
