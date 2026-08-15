import Image from "next/image";
import Link from "next/link";
import { categoryLabels, hasProductsForPlayer } from "@/lib/catalog";
import { getRoster } from "@/lib/owgr";
import { EXCLUSIVE_PLAYERS } from "@/lib/players";
import { getPlayerImageUrl } from "@/lib/player-images";
import { HOME_CATEGORY_IMAGES, pickLiveImage } from "@/lib/marketing-assets";
import { LOCKDOWN } from "@/lib/site-mode";
import { PlayerCard } from "@/components/player-card";
import { HomeExclusivesRail } from "@/components/home-exclusives-rail";
import { LockdownNotice } from "@/components/lockdown-notice";

const HOME_EXCLUSIVE_ORDER = [
  "jackson-koivun",
  "ben-griffin",
  "cameron-young",
  "keith-mitchell",
  "si-woo-kim",
];

export default async function HomePage() {
  // Lockdown short-circuits before any roster read — the notice must not be
  // able to render a player name even by accident.
  if (LOCKDOWN) return <LockdownNotice />;

  const players = await getRoster();
  const exclusives = EXCLUSIVE_PLAYERS(players);

  // HOME_EXCLUSIVE_ORDER is the authoritative home-rail spec. New exclusives
  // are not auto-promoted to the landing page — add their slug above when
  // ready to feature them.
  //
  // Being listed is necessary but not sufficient: the rail sells gear, so a
  // player only appears while we carry something shoppable for them. That
  // makes every way of pulling a player self-healing here — HIDDEN_PLAYERS,
  // HIDDEN_PRODUCTS, or a per-product `visible: false` all drop them off the
  // lander with no edit to the list above, and restoring the piece puts them
  // back in their original slot. Leave retired slugs in place.
  const orderedExclusives = HOME_EXCLUSIVE_ORDER.map((slug) =>
    exclusives.find((p) => p.slug === slug),
  ).filter(
    (p): p is NonNullable<typeof p> =>
      p !== undefined && hasProductsForPlayer(p.slug),
  );

  const enrichedRail = orderedExclusives.map((p) => ({
    ...p,
    imageUrl: getPlayerImageUrl(p.slug),
  }));

  const browsePlayers = players.slice(0, 12);

  // Category tiles resolve their photo through the marketing-asset chains, so
  // taking a player dark swaps the tile to the next live example rather than
  // leaving their photo on the lander. A category with no live photo left keeps
  // its tile and falls back to the plain brand panel.
  const categoryTiles = (["polos", "outerwear", "headwear"] as const).map(
    (cat) => {
      const picked = pickLiveImage(HOME_CATEGORY_IMAGES[cat] ?? []);
      return { cat, image: picked?.src ?? null, alt: picked?.alt ?? "" };
    },
  );

  return (
    <>
      {/* HERO — full-bleed exclusives rail */}
      <HomeExclusivesRail players={enrichedRail} />

      {/* BROWSE PLAYERS */}
      <section className="bg-brand-cream pt-16 pb-20 md:pt-20 md:pb-28">
        <div className="mx-auto max-w-[1400px] px-4 md:px-8">
          <div className="flex items-end justify-between gap-6">
            <div>
              <h2 className="font-display text-3xl leading-tight tracking-tight md:text-5xl">
                Browse the roster
              </h2>
              <p className="mt-2 max-w-xl text-base leading-relaxed text-brand-ink/65 md:text-lg">
                Pick a player. Get their look. Exclusives carry the full
                sponsor-logoed kit; everyone else links out to where they shop.
              </p>
            </div>
            <Link
              href="/players"
              className="hidden font-sans text-sm font-medium uppercase tracking-wider text-brand-deep underline underline-offset-4 hover:text-brand-ink md:inline-block"
            >
              All players →
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 md:gap-5 lg:grid-cols-6">
            {browsePlayers.map((player) => (
              <PlayerCard key={player.slug} player={player} />
            ))}
          </div>

          <div className="mt-8 md:hidden">
            <Link
              href="/players"
              className="inline-flex h-11 items-center rounded-full border border-line px-5 font-sans text-sm font-medium uppercase tracking-wider text-brand-ink hover:border-brand-ink"
            >
              All players →
            </Link>
          </div>
        </div>
      </section>

      {/* SHOP BY CATEGORY */}
      <section className="bg-brand-cream pb-24 md:pb-32">
        <div className="mx-auto max-w-[1400px] px-4 md:px-8">
          <div className="flex items-end justify-between gap-6 border-t border-line pt-12 md:pt-16">
            <div>
              <h2 className="font-display text-3xl leading-tight tracking-tight md:text-5xl">
                Shop by category
              </h2>
            </div>
            <Link
              href="/shop"
              className="hidden font-sans text-sm font-medium uppercase tracking-wider text-brand-deep underline underline-offset-4 hover:text-brand-ink md:inline-block"
            >
              All apparel →
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-3 md:gap-5">
            {categoryTiles.map(({ cat, image, alt }) => (
              <Link
                key={cat}
                href={`/shop?category=${cat}`}
                className="group relative flex aspect-[3/4] items-end overflow-hidden bg-brand-ink/95 p-5 text-brand-cream"
              >
                {image ? (
                  <Image
                    src={image}
                    alt={alt}
                    fill
                    sizes="(min-width: 1024px) 460px, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                ) : null}
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-brand-ink/80 to-transparent"
                />
                <div className="relative z-10 flex w-full items-end justify-between">
                  <span className="font-display text-2xl leading-none md:text-3xl">
                    {categoryLabels[cat]}
                  </span>
                  <svg
                    className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
