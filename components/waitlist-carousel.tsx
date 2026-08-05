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

/** Advance cadence — the brief calls for a new look every second. */
const INTERVAL_MS = 1000;
/** Slide transition; kept under the interval so motion settles between steps. */
const TRANSITION_MS = 600;

/**
 * Auto-advancing rail of Tour Pro Shop exclusives for the waitlist landing.
 * Steps to the next slide every second, wrapping around, and pauses while the
 * visitor hovers/focuses so they can actually look. Slides are rendered on the
 * server and passed in as `node` so each shot matches its PDP exactly.
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
