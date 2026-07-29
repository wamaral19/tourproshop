"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { getDisplayFirstName, type Player } from "@/lib/players";
import { getPlayerShopHref } from "@/lib/catalog";

export type RailPlayer = Player & { imageUrl: string | null };

// Per-player mobile framing tweaks. The default `object-top` centers
// horizontally, which leaves some subjects cropped at the edge. Tailwind
// arbitrary values: underscores → spaces, so `right_top` = `right top`.
const MOBILE_OBJECT_POSITION: Record<string, string> = {
  "keith-mitchell": "object-[right_top]",
  "ben-griffin": "object-[25%_top]",
};

/**
 * Full-bleed horizontal scroll-snap rail of TPS Exclusives. Replaces the
 * landing hero — the player tiles ARE the hero. Native swipe on mobile,
 * prev/next buttons + tile counter on desktop.
 */
export function HomeExclusivesRail({ players }: { players: RailPlayer[] }) {
  const railRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoPaused, setAutoPaused] = useState(false);

  const scrollToIndex = useCallback(
    (next: number) => {
      const el = railRef.current;
      if (!el) return;
      const tile = el.children[next] as HTMLElement | undefined;
      if (!tile) return;
      el.scrollTo({ left: tile.offsetLeft - el.offsetLeft, behavior: "smooth" });
    },
    [],
  );

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    const onScroll = () => {
      const tileWidth = (el.firstElementChild as HTMLElement | null)
        ?.offsetWidth;
      if (!tileWidth) return;
      const idx = Math.round(el.scrollLeft / tileWidth);
      setActiveIndex(Math.min(players.length - 1, Math.max(0, idx)));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [players.length]);

  // Auto-advance every 3s, looping. Paused on hover/focus and while the user
  // is touching the rail. Skipped if the OS requests reduced motion.
  useEffect(() => {
    if (autoPaused || players.length < 2) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const id = window.setTimeout(() => {
      scrollToIndex((activeIndex + 1) % players.length);
    }, 3000);
    return () => window.clearTimeout(id);
  }, [activeIndex, autoPaused, players.length, scrollToIndex]);

  // Pause briefly after touch interactions so mobile users can read.
  const touchResumeRef = useRef<number | null>(null);
  const pauseForTouch = useCallback(() => {
    setAutoPaused(true);
    if (touchResumeRef.current) window.clearTimeout(touchResumeRef.current);
    touchResumeRef.current = window.setTimeout(
      () => setAutoPaused(false),
      4000,
    );
  }, []);

  return (
    <section
      aria-label="Tour Pro Shop Exclusives"
      className="relative bg-brand-ink"
      onMouseEnter={() => setAutoPaused(true)}
      onMouseLeave={() => setAutoPaused(false)}
      onFocusCapture={() => setAutoPaused(true)}
      onBlurCapture={() => setAutoPaused(false)}
      onTouchStart={pauseForTouch}
    >
      <div
        ref={railRef}
        className="scroll-rail flex overflow-x-auto"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {players.map((player, idx) => (
          <ExclusiveTile
            key={player.slug}
            player={player}
            priority={idx < 2}
          />
        ))}
      </div>

      {/* Nav arrows — visible on all viewports so the rail's scrollability is
          obvious. They loop, matching the auto-advance behavior. */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 md:pl-4">
          <button
            type="button"
            aria-label="Previous"
            onClick={() =>
              scrollToIndex(
                (activeIndex - 1 + players.length) % players.length,
              )
            }
            className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-brand-cream/90 text-brand-ink shadow-lg transition-colors hover:bg-brand-cream md:h-12 md:w-12"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden
            >
              <path d="M15 6l-6 6 6 6" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 md:pr-4">
          <button
            type="button"
            aria-label="Next"
            onClick={() => scrollToIndex((activeIndex + 1) % players.length)}
            className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-brand-cream/90 text-brand-ink shadow-lg transition-colors hover:bg-brand-cream md:h-12 md:w-12"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden
            >
              <path d="M9 6l6 6-6 6" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Footer rail: counter + section CTA */}
      <div className="bg-brand-ink text-brand-cream">
        <div className="mx-auto flex max-w-[1400px] flex-col items-start gap-4 px-4 py-6 md:flex-row md:items-center md:justify-between md:px-8">
          <div className="flex items-center gap-3">
            <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-cream/60">
              Tour Pro Shop Exclusives
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/players?tier=exclusive"
              className="inline-flex h-11 items-center rounded-full bg-brand-cream px-5 font-sans text-sm font-medium uppercase tracking-wider text-brand-ink hover:bg-brand-accent hover:text-brand-cream"
            >
              Shop Exclusives
            </Link>
          </div>
        </div>
        {/* dot indicators (mobile) */}
        <div className="flex items-center justify-center gap-1.5 pb-5 md:hidden">
          {players.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => scrollToIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === activeIndex
                  ? "w-6 bg-brand-cream"
                  : "w-1.5 bg-brand-cream/35"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ExclusiveTile({
  player,
  priority,
}: {
  player: RailPlayer;
  priority?: boolean;
}) {
  const first = getDisplayFirstName(player);
  const initials = player.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

  return (
    <article
      className="relative flex shrink-0 snap-start"
      style={{
        width: "100vw",
        height: "min(85svh, 720px)",
      }}
    >
      <div className="relative h-full w-full overflow-hidden bg-brand-deep">
        {player.imageUrl ? (
          <Image
            src={player.imageUrl}
            alt={player.name}
            fill
            sizes="100vw"
            priority={priority}
            className={`object-cover ${MOBILE_OBJECT_POSITION[player.slug] ?? "object-top"} md:object-[center_20%]`}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-brand-deep to-brand-ink">
            <span
              className="font-display text-[20vh] leading-none text-brand-cream/85"
              aria-hidden
            >
              {initials}
            </span>
          </div>
        )}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-brand-ink/85 via-brand-ink/15 to-brand-ink/30"
        />

        {/* Top-left chip */}
        <div className="absolute left-4 top-4 flex items-center gap-2 md:left-8 md:top-8">
          <span className="rounded-full bg-brand-accent px-3 py-1.5 font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-cream">
            Tour Pro Shop Exclusive
          </span>
        </div>

        {/* Bottom overlay: name + Shop CTA */}
        <div className="absolute inset-x-4 bottom-6 flex flex-col gap-4 md:inset-x-12 md:bottom-12 md:flex-row md:items-end md:justify-between">
          <div className="text-brand-cream">
            <p className="font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-brand-cream/65">
              {player.country}
            </p>
            <h2 className="font-display mt-3 text-5xl leading-[0.95] tracking-tight md:text-7xl">
              {player.name}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={getPlayerShopHref(player.slug)}
              className="inline-flex h-12 items-center rounded-full bg-brand-cream px-6 font-sans text-sm font-medium uppercase tracking-wider text-brand-ink transition-colors hover:bg-brand-accent hover:text-brand-cream"
            >
              Shop {first}
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
