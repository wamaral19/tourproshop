"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { ReactNode } from "react";

export type WaitlistSlide = {
  /** Server-rendered <ProductImage> for the slide. */
  node: ReactNode;
  name: string;
  href: string;
};

/** Advance cadence — a new look every 1.5s, slow enough to actually register. */
const INTERVAL_MS = 1500;
/** Slide transition; kept under the interval so motion settles between steps. */
const TRANSITION_MS = 600;

/**
 * Auto-advancing rail of Tour Pro Shop exclusives for the waitlist landing.
 * Steps to the next slide on a timer, wrapping around, and pauses while the
 * visitor hovers/focuses so they can actually look. Prev/next arrows let them
 * step through by hand. Slides are rendered on the server and passed in as
 * `node` so each shot matches its PDP exactly.
 */
export function WaitlistCarousel({ slides }: { slides: WaitlistSlide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      INTERVAL_MS,
    );
    return () => clearInterval(id);
  }, [paused, slides.length]);

  const go = (delta: number) =>
    setIndex((i) => (i + delta + slides.length) % slides.length);

  const current = slides[index];

  return (
    <figure className="md:justify-self-end md:w-full md:max-w-md">
      <div
        className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-line"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
      >
        <div
          className="flex h-full w-full ease-out"
          style={{
            transform: `translateX(-${index * 100}%)`,
            transition: `transform ${TRANSITION_MS}ms`,
          }}
        >
          {slides.map((slide, i) => (
            <div key={slide.href} className="relative h-full w-full shrink-0">
              {/* Only the active slide is announced to assistive tech. */}
              <div aria-hidden={i !== index} className="h-full w-full">
                {slide.node}
              </div>
            </div>
          ))}
        </div>

        {/* Prev / next arrows. Fade in on hover/focus of the frame; always
            visible on touch where there's no hover state. */}
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous look"
          className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-brand-cream/85 text-brand-ink shadow-sm ring-1 ring-brand-ink/10 backdrop-blur transition hover:bg-brand-cream focus-visible:opacity-100 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100"
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
          className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-brand-cream/85 text-brand-ink shadow-sm ring-1 ring-brand-ink/10 backdrop-blur transition hover:bg-brand-cream focus-visible:opacity-100 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100"
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

        {/* Dots */}
        <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-2">
          {slides.map((slide, i) => (
            <button
              key={slide.href}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show ${slide.name}`}
              aria-current={i === index}
              className={`h-1.5 rounded-full transition-all ${
                i === index
                  ? "w-5 bg-brand-deep"
                  : "w-1.5 bg-brand-ink/25 hover:bg-brand-ink/40"
              }`}
            />
          ))}
        </div>
      </div>

      <figcaption className="mt-4 text-center">
        <Link
          href={current.href}
          className="inline-flex items-center gap-1.5 font-sans text-sm font-medium text-brand-deep underline decoration-brand-deep/30 underline-offset-4 transition hover:decoration-brand-deep"
        >
          {current.name}
          <span aria-hidden>→</span>
        </Link>
      </figcaption>
    </figure>
  );
}
