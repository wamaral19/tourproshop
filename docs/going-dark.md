# Going dark

Two levers, for two different situations.

| Situation | Lever | Blast radius |
|---|---|---|
| One player needs to come off the site | `HIDDEN_PLAYERS` in `lib/players.ts` | That player, everywhere |
| Every player needs to come off the site | `LOCKDOWN` in `lib/site-mode.ts` | The whole storefront |

Neither deletes anything. Both are one-line edits that are reversed by undoing
the line.

---

## 1. Taking one player dark

Add their slug to `HIDDEN_PLAYERS` in [`lib/players.ts`](../lib/players.ts):

```ts
export const HIDDEN_PLAYERS: ReadonlySet<string> = new Set([
  "sungjae-im",
  "wyndham-clark",
  "their-slug-here",   // ← add
]);
```

Slugs live in [`data/owgr.json`](../data/owgr.json) and are the player's name
lowercased and hyphenated, accents stripped: `Ludvig Åberg` → `ludvig-aberg`.

That single edit removes them from:

- the roster and the browse grid (`getRoster` filters on it)
- `/players`, `/players?tier=exclusive`, and their player page (404)
- the shop, filtered shop links, related rails, and their PDPs (404)
- the home exclusives rail and the home category tiles
- the `/waitlist` carousel
- the sponsor-callout hero on `/agents`, `/apparel`, and `/sponsors`
- the sponsor-placement figures on `/agents` and `/for-players`
- tagged items on `/graveyard-signals`
- their private pitch page under `/p/*`, if they have one (404)

The marketing pages manage this by resolving their imagery through
[`lib/marketing-assets.ts`](../lib/marketing-assets.ts) instead of hardcoding a
path. Each image is attributed to a player and sits in a fallback chain, so a
dark player drops out and the next live example slides into their slot. Nothing
on those pages needs editing by hand.

### Then run the audit

```
npm run audit:dark
```

What the chains cannot reach is prose, one-off pages, and files on disk whose
*names* carry a player's name. The audit is the net for those. It prints three
sections:

- **NEEDS AN EDIT** — code or copy naming a dark player, in a file that has no
  idea they're dark. Exits `1`. These are real edits: usually a sentence to
  rewrite. `app/why/page.tsx` is the known one — it tells a story about a
  specific player by name.
- **Handled automatically** — files that name the player on purpose and drop
  them at render time. Informational.
- **Files on disk** — assets under `public/` whose paths spell the player's
  name. See [Assets](#assets) below.

### Restoring

Remove the slug. If the player was pulled back in stages, restoring is a ladder:
taking them out of `HIDDEN_PLAYERS` returns them to whatever state the rest of
their data describes. For a full relist also check `relationship: "exclusive"`
in `data/owgr.json` and `visible: true` on their products in `lib/products.ts`.

---

## 2. Full lockdown

Flip one constant in [`lib/site-mode.ts`](../lib/site-mode.ts):

```ts
export const LOCKDOWN = true;
```

Then commit, merge, and deploy. That's the whole procedure.

### What happens

`/` and `/waitlist` render the coming-soon notice: the "these pages are coming
soon" copy, the rights-holder contact line, and the waitlist form. No player
name, product, or link into a blocked route appears in the HTML.

Everything else 307-redirects to `/`. It's an **allowlist**, not a blocklist —
a page added to the app later is dark by default rather than leaking because
nobody remembered to list it. The allowlist is:

| Route | Why it stays |
|---|---|
| `/` | The notice |
| `/waitlist` | Same notice, own URL — live ad campaigns point here, and redirecting would break Meta's landing-page matching. The `?ad=` tag survives. |
| `/waitlist-confirmed` | So the signup form completes |
| `/contact` | No player content; gives people a way to reach us |
| `/api/*` | Keeps the signup endpoint alive |
| `/admin/*` | Token-gated (`OUTREACH_ADMIN_TOKEN`) |
| `/r/*`, `/s/*`, `/a/*` | Outreach click trackers; their destinations get caught on the next hop |

The header and footer collapse to the wordmark, which is what actually takes
Shop, Players, and TPS Exclusives out of the directory.
[`proxy.ts`](../proxy.ts) is what stops anyone reaching them by URL.

The redirect is a **307**, not a 308 — lockdown is temporary and a permanent
redirect would get cached past the flag flip.

### Lifting it

Set `LOCKDOWN = false`. Nothing else changes; no content was deleted.

---

## Assets

One gap is worth knowing about before you rely on either lever.

Files under `public/` — `/product images/Cam Young Polo/...`, `/player
images/...` — are served by Cloudflare's static asset layer, which runs *before*
the Worker. `proxy.ts` never sees those requests, so during a lockdown those URLs
stay fetchable by anyone who already knows them. Nothing links to them once the
pages are down, and they won't be in the index, but they are not blocked.

`npm run audit:dark` lists exactly which files those are for a dark player.

To actually close it, pick one:

**Option A — move the assets.** Take the player's directories out of `public/`
(keep them in `_legacy/`, or anywhere outside the build). The build no longer
publishes them. Simple, and it's the right answer for a single player.

**Option B — route them through the Worker.** Add to `wrangler.jsonc`:

```jsonc
"assets": {
  "directory": ".open-next/assets",
  "binding": "ASSETS",
  "run_worker_first": ["/product images/*", "/player images/*"]
}
```

This makes the Worker handle those paths so `proxy.ts` can block them. **Verify
this on a preview deploy before trusting it in production** — if the Worker
doesn't fall through to the `ASSETS` binding for those paths, product imagery
404s sitewide. Worth doing for a real takedown, not worth carrying otherwise.

---

## Testing a change locally

```
SKIP_CF_DEV=1 npm run build && SKIP_CF_DEV=1 npx next start -p 3111
```

`SKIP_CF_DEV=1` skips the Cloudflare dev emulator, which the build doesn't need.
Then check the routes:

```
curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" http://localhost:3111/shop
```
