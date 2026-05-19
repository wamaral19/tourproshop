import Link from "next/link";
import type { Player } from "@/lib/players";
import { PlayerPortrait } from "./player-portrait";

export function PlayerCard({ player }: { player: Player }) {
  return (
    <Link
      href={`/shop?player=${player.slug}`}
      className="group flex flex-col gap-3"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <PlayerPortrait
          player={player}
          className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex items-baseline justify-between gap-3">
        <div className="min-w-0">
          <p className="text-base leading-tight tracking-tight">
            {player.name}
          </p>
          <p className="eyebrow mt-1 text-brand-ink/60">{player.country}</p>
        </div>
        {player.relationship === "exclusive" ? (
          <span className="font-condensed text-[11px] uppercase tracking-widest text-brand-deep">
            Exclusive
          </span>
        ) : null}
      </div>
    </Link>
  );
}
