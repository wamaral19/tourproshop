import Image from "next/image";
import Link from "next/link";
import { categoryLabels } from "@/lib/catalog";
import { getRoster } from "@/lib/owgr";
import { EXCLUSIVE_PLAYERS } from "@/lib/players";
import { getPlayerImageUrl } from "@/lib/player-images";
import { PlayerCard } from "@/components/player-card";
import { HomeExclusivesRail } from "@/components/home-exclusives-rail";

const HOME_EXCLUSIVE_ORDER = [
  "ben-griffin",
  "cameron-young",
  "james-nicholas",
  "keith-mitchell",
  "si-woo-kim",
];

export default async function HomePage() {
  const players = await getRoster();
  const exclusives = EXCLUSIVE_PLAYERS(players);

  // HOME_EXCLUSIVE_ORDER is the authoritative home-rail spec. New exclusives
  // are not auto-promoted to the landing page — add their slug above when
  // ready to feature them.
  const orderedExclusives = HOME_EXCLUSIVE_ORDER.map((slug) =>
    exclusives.find((p) => p.slug === slug),
  ).filter((p): p is NonNullable<typeof p> => Boolean(p));

  const enrichedRail = orderedExclusives.map((p) => ({
    ...p,
    imageUrl: getPlayerImageUrl(p.slug),
  }));

  const browsePlayers = players.slice(0, 12);

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
            {(
              [
                {
                  cat: "polos",
                  image: "/product images/Cam Young Polo/Cam Young Lifestyle 02.jpg",
                  alt: "Cameron Young in his Peter Millar polo — on-course lifestyle shot",
                },
                {
                  cat: "outerwear",
                  image:
                    "/product images/Min Woo Lee Track Jacket/Min Woo Lee Track Jacket 001.avif",
                  alt: "Min Woo Lee in his Lululemon track jacket",
                },
                {
                  cat: "headwear",
                  image:
                    "/product images/Keith Mitchell Visor/White/Keith Mitchell Visor 02.webp",
                  alt: "Keith Mitchell in his Imperial tour visor",
                },
              ] as const
            ).map(({ cat, image, alt }) => (
              <Link
                key={cat}
                href={`/shop?category=${cat}`}
                className="group relative flex aspect-[3/4] items-end overflow-hidden bg-brand-ink/95 p-5 text-brand-cream"
              >
                <Image
                  src={image}
                  alt={alt}
                  fill
                  sizes="(min-width: 1024px) 460px, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
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
