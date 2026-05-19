import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import Image from "next/image";
import { getRoster } from "@/lib/owgr";
import {
  EXCLUSIVE_PLAYERS,
  LINKED_PLAYERS,
  getDisplayFirstName,
} from "@/lib/players";
import {
  getPlayerImageUrl,
  getPlayerObjectPositionClass,
} from "@/lib/player-images";
import { getPlayerShopHref } from "@/lib/catalog";
import { PlayerBrowse } from "@/components/player-browse";

export const metadata: Metadata = {
  title: "Players",
  description:
    "Browse the players we carry — Tour Pro Shop Exclusives plus the world's best, with links to where you can shop their looks.",
};

type SearchParams = { tier?: string };

export default async function PlayersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { tier } = await searchParams;
  const isExclusivesView = tier === "exclusive";

  const players = await getRoster();
  const exclusives = EXCLUSIVE_PLAYERS(players);
  const linked = LINKED_PLAYERS(players);
  const enriched = players.map((p) => ({
    ...p,
    imageUrl: getPlayerImageUrl(p.slug),
  }));

  return (
    <>
      {/* HERO — flips by view. Exclusives view drops the eyebrow + display
          headline pattern entirely; default view keeps a clean wordmark hero. */}
      {isExclusivesView ? (
        <section className="border-b border-line bg-brand-cream">
          <div className="mx-auto max-w-[1400px] px-4 pb-8 pt-14 md:px-8 md:pb-12 md:pt-20">
            <h1 className="font-sans font-semibold text-5xl leading-tight tracking-tight text-brand-ink md:text-6xl">
              Exclusives
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-brand-ink/75 md:text-xl">
              Sponsor-logoed gear you can only access at the Tour Pro Shop.
            </p>
            <Link
              href="/players"
              className="mt-6 inline-flex font-sans text-sm font-medium text-brand-ink/65 underline underline-offset-4 hover:text-brand-ink"
            >
              ← All players
            </Link>
          </div>
        </section>
      ) : (
        <section className="border-b border-line bg-brand-cream">
          <div className="mx-auto max-w-[1400px] px-4 pb-6 pt-12 md:px-8 md:pb-10 md:pt-16">
            <h1 className="font-sans font-semibold text-5xl leading-tight tracking-tight text-brand-ink md:text-6xl">
              Players
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-brand-ink/70 md:text-lg">
              Pick a player. Get their look. Exclusives carry the full
              sponsor-logoed kit; everyone else links out to where they shop.
            </p>
          </div>
        </section>
      )}

      {/* EXCLUSIVES — when in the exclusives view this is the only main section. */}
      {(isExclusivesView ? exclusives : exclusives).length > 0 ? (
        <section className="bg-brand-cream py-12 md:py-16">
          <div className="mx-auto max-w-[1400px] px-4 md:px-8">
            {!isExclusivesView ? (
              <div className="flex items-end justify-between gap-4 border-b border-line pb-4">
                <p className="font-sans text-base font-semibold text-brand-deep">
                  Tour Pro Shop Exclusives
                </p>
                <span className="font-sans text-sm text-brand-ink/60">
                  {exclusives.length}{" "}
                  {exclusives.length === 1 ? "player" : "players"}
                </span>
              </div>
            ) : null}

            <div
              className={`grid grid-cols-2 gap-4 ${
                isExclusivesView ? "mt-2" : "mt-8"
              } sm:grid-cols-3 md:grid-cols-4 md:gap-6 lg:grid-cols-5`}
            >
              {exclusives.map((player, idx) => (
                <PlayerExclusiveTile
                  key={player.slug}
                  player={player}
                  index={idx}
                  imageUrl={getPlayerImageUrl(player.slug)}
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* BROWSE the full roster — hidden when arriving on the exclusives view
          (user came here for exclusives only). */}
      {!isExclusivesView ? (
        <section className="bg-brand-cream pb-20 md:pb-28">
          <div className="mx-auto max-w-[1400px] px-4 md:px-8">
            <div className="flex items-end justify-between gap-4 border-t border-line pt-12 md:pt-16">
              <div>
                <h2 className="font-sans text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
                  The full roster
                </h2>
              </div>
              <span className="font-sans text-sm text-brand-ink/60">
                {linked.length + exclusives.length} players
              </span>
            </div>

            <Suspense fallback={null}>
              <PlayerBrowse players={enriched} />
            </Suspense>
          </div>
        </section>
      ) : null}
    </>
  );
}

// Local tile renderer — sans player name + per-tile "Shop {firstName}" CTA.
function PlayerExclusiveTile({
  player,
  index,
  imageUrl,
}: {
  player: import("@/lib/players").Player;
  index: number;
  imageUrl: string | null;
}) {
  const first = getDisplayFirstName(player);
  return (
    <Link
      href={getPlayerShopHref(player.slug)}
      className="group flex flex-col gap-3"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-brand-deep">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={player.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className={`object-cover ${getPlayerObjectPositionClass(player.slug)} transition-transform duration-700 ease-out group-hover:scale-[1.03]`}
            priority={index < 3}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-brand-deep to-brand-ink text-brand-cream/90 font-display text-7xl">
            {player.name
              .split(" ")
              .map((w) => w[0])
              .slice(0, 2)
              .join("")}
          </div>
        )}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-brand-ink/65 via-brand-ink/0 to-brand-ink/0"
        />
        <span className="absolute left-3 top-3 rounded-full bg-brand-accent px-2.5 py-1 font-sans text-[10px] font-semibold uppercase tracking-widest text-brand-ink">
          TPS Exclusive
        </span>
        <div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-2 text-brand-cream">
          <p className="font-sans text-lg font-semibold leading-tight tracking-tight md:text-xl">
            {player.name}
          </p>
          <span className="rounded-full bg-brand-cream px-3 py-1.5 font-sans text-[11px] font-medium uppercase tracking-wider text-brand-ink opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            Shop {first} →
          </span>
        </div>
      </div>
    </Link>
  );
}
