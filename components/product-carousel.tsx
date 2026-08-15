"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

export type CarouselSlide = {
  /** Server-rendered image for the slide. */
  node: ReactNode;
  /** Optional overlay pinned to the frame — e.g. sponsor hotspots. Only the
   *  active slide's overlay is mounted, so its popover state resets on move. */
  overlay?: ReactNode;
  /** Short label under the frame, e.g. "Peter Millar polo". */
  caption?: string;
};

/** How long a touch/click inside the frame holds the auto-advance. */
const INTERACTION_PAUSE_MS = 8000;
/** Slide transition; kept under the interval so motion settles between steps. */
const TRANSITION_MS = 600;

/**
 * Auto-advancing rail of product shots. Deliberately link-free: it shows the
 * gear without sending anyone to a PDP, which is what the Partners pages and
 * the waitlist need while the storefront is dark.
 *
 * Pauses on hover and focus so a visitor can actually look, and holds for a
 * beat after a tap — on touch there's no hover to pause it, and the hero
 * carousel's sponsor callouts are tapped, not hovered.
 */
export function ProductCarousel({
  slides,
  className,
  frameClassName = "aspect-[4/5]",
  note,
  intervalMs = 3000,
}: {
  slides: CarouselSlide[];
  className?: string;
  /** Aspect/size classes for the image frame. */
  frameClassName?: string;
  /** Fixed line above the per-slide caption, e.g. "Tap a callout to see each sponsor". */
  note?: string;
  intervalMs?: number;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const resumeRef = useRef<number | null>(null);

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      intervalMs,
    );
    return () => window.clearInterval(id);
  }, [paused, slides.length, intervalMs]);

  const holdForInteraction = useCallback(() => {
    setPaused(true);
    if (resumeRef.current) window.clearTimeout(resumeRef.current);
    resumeRef.current = window.setTimeout(
      () => setPaused(false),
      INTERACTION_PAUSE_MS,
    );
  }, []);

  useEffect(
    () => () => {
      if (resumeRef.current) window.clearTimeout(resumeRef.current);
    },
    [],
  );

  const go = (delta: number) =>
    setIndex((i) => (i + delta + slides.length) % slides.length);

  if (slides.length === 0) return null;
  const current = slides[index];

  return (
    <figure className={className}>
      <div
        className={`group relative ${frameClassName}`}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
        onPointerDown={holdForInteraction}
      >
        <div className="absolute inset-0 overflow-hidden rounded-2xl border border-line">
          <div
            className="flex h-full w-full ease-out"
            style={{
              transform: `translateX(-${index * 100}%)`,
              transition: `transform ${TRANSITION_MS}ms`,
            }}
          >
            {/* Keyed by index on purpose: the slide list is static, and any
                natural key here (image path, product slug) spells out a player
                name in the serialized payload. */}
            {slides.map((slide, i) => (
              <div
                key={i}
                // Only the active slide is announced to assistive tech.
                aria-hidden={i !== index}
                className="relative h-full w-full shrink-0"
              >
                {slide.node}
              </div>
            ))}
          </div>
        </div>

        {/* Overlay sits outside the sliding track so it stays pinned to the
            frame instead of scrolling away with its slide. */}
        {current.overlay ?? null}

        {slides.length > 1 ? (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous look"
              className="absolute left-3 top-1/2 z-10 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-brand-cream/85 text-brand-ink shadow-sm ring-1 ring-brand-ink/10 backdrop-blur transition hover:bg-brand-cream focus-visible:opacity-100 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
                <path
                  d="M15 6l-6 6 6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next look"
              className="absolute right-3 top-1/2 z-10 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-brand-cream/85 text-brand-ink shadow-sm ring-1 ring-brand-ink/10 backdrop-blur transition hover:bg-brand-cream focus-visible:opacity-100 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
                <path
                  d="M9 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <div className="absolute inset-x-0 bottom-3 z-10 flex items-center justify-center gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Show look ${i + 1} of ${slides.length}`}
                  aria-current={i === index}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index
                      ? "w-5 bg-brand-deep"
                      : "w-1.5 bg-brand-ink/25 hover:bg-brand-ink/40"
                  }`}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>

      {note || current.caption ? (
        <figcaption className="mt-3 text-center">
          {note ? (
            <span className="block font-condensed text-[11px] uppercase tracking-widest text-brand-ink/55">
              {note}
            </span>
          ) : null}
          {current.caption ? (
            <span className="mt-1 block font-sans text-sm text-brand-ink/60">
              {current.caption}
            </span>
          ) : null}
        </figcaption>
      ) : null}
    </figure>
  );
}
