"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Player, PlayerRelationship } from "@/lib/players";
import { getPlayerShopHref } from "@/lib/catalog";
import { getPlayerObjectPositionClass } from "@/lib/player-images";

export type EnrichedPlayer = Player & { imageUrl: string | null };

type TierFilter = "all" | PlayerRelationship;

const TIER_LABELS: Record<TierFilter, string> = {
  all: "All",
  exclusive: "Exclusives",
  linked: "Linked",
};

export function PlayerBrowse({ players }: { players: EnrichedPlayer[] }) {
  const params = useSearchParams();
  const initialTier = (params.get("tier") as TierFilter) ?? "all";

  const [tier, setTier] = useState<TierFilter>(
    (["all", "exclusive", "linked"] as const).includes(initialTier)
      ? initialTier
      : "all",
  );
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return players
      .filter((p) => (tier === "all" ? true : p.relationship === tier))
      .filter((p) => (q ? p.name.toLowerCase().includes(q) : true))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [players, tier, query]);

  const counts = useMemo(
    () => ({
      all: players.length,
      exclusive: players.filter((p) => p.relationship === "exclusive").length,
      linked: players.filter((p) => p.relationship === "linked").length,
    }),
    [players],
  );

  return (
    <>
      {/* Controls */}
      <div className="mt-8 flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
        <label className="relative flex-1">
          <span className="sr-only">Search players</span>
          <svg
            viewBox="0 0 24 24"
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-ink/45"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <circle cx="11" cy="11" r="6.5" />
            <path d="M16 16l4 4" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            placeholder="Search by name"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-11 w-full rounded-full border border-line bg-brand-cream pl-11 pr-4 text-base placeholder:text-brand-ink/45 focus:border-brand-ink focus:outline-none"
          />
        </label>
        <div className="flex shrink-0 items-center gap-1.5 overflow-x-auto">
          {(["all", "exclusive", "linked"] as TierFilter[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTier(t)}
              className={`shrink-0 rounded-full border px-3 py-1.5 font-condensed text-xs uppercase tracking-widest transition-colors ${
                tier === t
                  ? "border-brand-ink bg-brand-ink text-brand-cream"
                  : "border-line text-brand-ink/75 hover:border-brand-ink"
              }`}
            >
              {TIER_LABELS[t]}{" "}
              <span
                className={tier === t ? "text-brand-cream/70" : "text-brand-ink/45"}
              >
                ({counts[t]})
              </span>
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-base text-brand-ink/60">
          No players match.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 md:gap-6 lg:grid-cols-5">
          {filtered.map((player) => (
            <PlayerTile key={player.slug} player={player} />
          ))}
        </div>
      )}
    </>
  );
}

function PlayerTile({ player }: { player: EnrichedPlayer }) {
  return (
    <Link
      href={getPlayerShopHref(player.slug)}
      className="group flex flex-col gap-3"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-brand-deep">
        {player.imageUrl ? (
          <Image
            src={player.imageUrl}
            alt={player.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className={`object-cover ${getPlayerObjectPositionClass(player.slug)} transition-transform duration-700 ease-out group-hover:scale-[1.03]`}
          />
        ) : (
          <Monogram name={player.name} />
        )}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-brand-ink/55 via-brand-ink/0 to-brand-ink/0"
        />
        {player.relationship === "exclusive" ? (
          <span className="eyebrow absolute left-3 top-3 rounded-full bg-brand-accent px-2.5 py-1 text-brand-cream">
            TPS Exclusive
          </span>
        ) : null}
      </div>
      <div className="flex items-baseline justify-between gap-3">
        <div className="min-w-0">
          <p className="text-base leading-tight tracking-tight">
            {player.name}
          </p>
          {player.country ? (
            <p className="eyebrow mt-1 text-brand-ink/60">{player.country}</p>
          ) : null}
        </div>
      </div>
    </Link>
  );
}

function Monogram({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-brand-deep to-brand-ink">
      <span
        className="font-display text-7xl text-brand-cream/90"
        aria-hidden
      >
        {initials}
      </span>
    </div>
  );
}
