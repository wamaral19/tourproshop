# Outreach tracking (`/r/:slug`)

Short links that log a click to Cloudflare D1, set a referral cookie, and
redirect to the agents lander (or any per-slug target URL).

## Architecture

- **Route handler:** `app/r/[slug]/route.ts` — runs inside the OpenNext worker, so
  the existing Next.js deploy pipeline covers it. No separate worker.
- **D1 lookup + insert:** `lib/outreach.ts`. The insert is deferred with
  `ctx.waitUntil` so the redirect isn't blocked.
- **Admin:** `app/api/outreach/route.ts` — bearer-token-protected JSON.
- **Schema:** `migrations/0001_outreach.sql`. Seed: `migrations/0002_outreach_seed.sql`
  (regenerate with `node scripts/generate-outreach-seed.mjs` after editing
  `data/outreach.csv`).

Unknown slugs are still logged (with `is_known = 0`) and redirected to `/agents`,
so typos in outreach emails don't produce broken links.

## One-time setup

```bash
# 1. Create the D1 database (writes a database_id to stdout).
npx wrangler d1 create tourproshop-outreach

# 2. Paste that database_id into wrangler.jsonc, replacing
#    REPLACE_WITH_D1_ID_FROM_WRANGLER_D1_CREATE.

# 3. Apply schema + seed locally and remotely.
npx wrangler d1 execute tourproshop-outreach --local  --file=migrations/0001_outreach.sql
npx wrangler d1 execute tourproshop-outreach --local  --file=migrations/0002_outreach_seed.sql
npx wrangler d1 execute tourproshop-outreach --remote --file=migrations/0001_outreach.sql
npx wrangler d1 execute tourproshop-outreach --remote --file=migrations/0002_outreach_seed.sql

# 4. Set the admin token (runtime secret, not GitHub Actions).
npx wrangler secret put OUTREACH_ADMIN_TOKEN

# 5. Regenerate types (already run, but rerun whenever wrangler.jsonc changes).
npm run cf-typegen
```

Then push to `main` — the existing GitHub Actions workflow deploys the worker.

## Deploying schema changes

Add a new file `migrations/000N_<name>.sql` and run the same `wrangler d1
execute ... --remote --file=...` for it. There's no automatic migration runner;
that's deliberate while the system is small.

## Local dev

`npm run dev` works because `getCloudflareContext` returns `undefined` for the
env when not running under the worker — the route handler degrades gracefully
(skips DB writes, still redirects). To exercise the full path locally:

```bash
npm run preview   # builds with OpenNext and runs wrangler dev with D1 bound
```

## Admin endpoint

```bash
# Summary across all slugs (clicks per slug, last_click epoch seconds).
curl https://tourpro.shop/api/outreach \
  -H "Authorization: Bearer $OUTREACH_ADMIN_TOKEN"

# Recent clicks for one slug.
curl "https://tourpro.shop/api/outreach?slug=andrew-kipper" \
  -H "Authorization: Bearer $OUTREACH_ADMIN_TOKEN"
```

Or pass `?token=...` if you can't set a header (e.g. from a browser address bar
during testing — bearer headers are still preferred).

## Ad-hoc D1 queries

```bash
# Total clicks per slug.
npx wrangler d1 execute tourproshop-outreach --remote --command \
  "SELECT slug, COUNT(*) AS clicks FROM outreach_clicks GROUP BY slug ORDER BY clicks DESC;"

# Last 20 clicks with agent info.
npx wrangler d1 execute tourproshop-outreach --remote --command \
  "SELECT c.ts, c.slug, l.agent_name, l.agency, c.country, c.city
     FROM outreach_clicks c LEFT JOIN outreach_links l ON l.slug = c.slug
     ORDER BY c.ts DESC LIMIT 20;"

# Clicks from agents who actually opened the link (is_known = 1).
npx wrangler d1 execute tourproshop-outreach --remote --command \
  "SELECT slug, COUNT(*) FROM outreach_clicks WHERE is_known = 1 GROUP BY slug;"

# Unknown-slug traffic (typos, scrapers).
npx wrangler d1 execute tourproshop-outreach --remote --command \
  "SELECT slug, ts, user_agent FROM outreach_clicks WHERE is_known = 0 ORDER BY ts DESC LIMIT 50;"
```

## Adding a new agent later

1. Append a row to `data/outreach.csv`.
2. `node scripts/generate-outreach-seed.mjs` rewrites `migrations/0002_outreach_seed.sql`.
3. `npx wrangler d1 execute tourproshop-outreach --remote --file=migrations/0002_outreach_seed.sql`
   — `INSERT OR IGNORE` makes re-runs safe.

## What gets logged per click

| column     | source                                                  |
| ---------- | ------------------------------------------------------- |
| `slug`     | lowercased `[slug]` param                               |
| `ts`       | `unixepoch()` at insert                                 |
| `user_agent` | `User-Agent` header                                   |
| `referrer` | `Referer` header                                        |
| `ip`       | `CF-Connecting-IP`, falling back to `X-Forwarded-For`   |
| `country`  | Workers `request.cf.country` / `CF-IPCountry`           |
| `region`   | `request.cf.region`                                     |
| `city`     | `request.cf.city`                                       |
| `is_known` | 1 if slug exists in `outreach_links`, else 0            |

The cookie set on the redirect response is
`tps_ref=<slug>; Max-Age=7776000; Path=/; SameSite=Lax; Secure` (90 days).
