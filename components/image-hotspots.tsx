"use client";

import { useEffect, useRef, useState } from "react";
import type { ProductImageHotspot } from "@/lib/products";
import type { Sponsor } from "@/lib/sponsors";

/** Overlays a set of open ring callouts on a product image. Clicking one
 *  toggles a popover that surfaces the matching sponsor's name and blurb.
 *  The rings are hollow on purpose — they sit directly over sponsor logos,
 *  so a filled dot would hide the mark it's pointing at (worst on mobile,
 *  where the same fixed-size dot covers far more of a smaller image). A
 *  hairline "+" sits inside to signal the ring is clickable. Both the ring
 *  and the "+" are white over a dark halo, which keeps them legible on pale
 *  flatlays and dark garments alike. */
export function ImageHotspots({
  hotspots,
  sponsors,
}: {
  hotspots: ProductImageHotspot[];
  sponsors: Sponsor[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const openSpot = openIndex !== null ? hotspots[openIndex] : null;
  const openSponsor = openSpot
    ? sponsors.find(
        (s) => s.name.toLowerCase() === openSpot.sponsorName.toLowerCase(),
      )
    : undefined;

  useEffect(() => {
    if (openIndex === null) return;
    function onPointerDown(e: PointerEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) setOpenIndex(null);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenIndex(null);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [openIndex]);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0"
      aria-label="Sponsor callouts"
    >
      {hotspots.map((spot, i) => {
        const sponsor = sponsors.find(
          (s) => s.name.toLowerCase() === spot.sponsorName.toLowerCase(),
        );
        const isOpen = openIndex === i;
        const openLeft = spot.x > 55;
        const openUp = spot.y > 60;

        return (
          <div
            key={`${spot.sponsorName}-${i}`}
            className={`pointer-events-auto absolute ${isOpen ? "z-20" : "z-0"}`}
            style={{
              left: `${spot.x}%`,
              top: `${spot.y}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <button
              type="button"
              aria-label={`Sponsor: ${spot.sponsorName}`}
              aria-expanded={isOpen}
              onClick={(e) => {
                e.stopPropagation();
                setOpenIndex(isOpen ? null : i);
              }}
              className={`relative flex h-7 w-7 items-center justify-center rounded-full border-2 transition-transform hover:scale-110 sm:h-8 sm:w-8 ${
                isOpen
                  ? "scale-110 border-white ring-1 ring-brand-ink/60"
                  : "border-white/85 ring-1 ring-brand-ink/40"
              }`}
            >
              {/* Invisible hit area — keeps the tap target near 44px while the
                  painted ring stays small enough not to crowd the logo. */}
              <span aria-hidden className="absolute -inset-2 rounded-full" />
              {/* "+" affordance — without it a bare ring reads as decoration
                  rather than a control. Drawn as a hairline cross so the logo
                  still shows through: the dark stroke underneath is a halo for
                  the white one on top, which is what keeps it readable on both
                  pale flatlays and dark garments (the same white-over-dark
                  trick as the ring). Rotates to an "×" while open. */}
              <svg
                aria-hidden
                viewBox="0 0 12 12"
                className={`h-2.5 w-2.5 transition-transform duration-200 sm:h-3 sm:w-3 ${
                  isOpen ? "rotate-45" : ""
                }`}
              >
                <path
                  d="M6 1.75V10.25M1.75 6H10.25"
                  stroke="currentColor"
                  strokeWidth="3.25"
                  strokeLinecap="round"
                  className="text-brand-ink/60"
                />
                <path
                  d="M6 1.75V10.25M1.75 6H10.25"
                  stroke="#fff"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <span
                aria-hidden
                className={`absolute inset-0 -z-10 rounded-full ring-1 ring-white/70 ${
                  isOpen ? "animate-none" : "animate-ping"
                }`}
              />
            </button>

            {isOpen && sponsor ? (
              <div
                role="dialog"
                aria-label={sponsor.name}
                className={`absolute z-10 hidden w-72 rounded-2xl bg-brand-cream p-4 text-left text-brand-ink shadow-xl ring-1 ring-brand-ink/10 sm:block ${
                  openLeft ? "right-[calc(100%+10px)]" : "left-[calc(100%+10px)]"
                } ${openUp ? "bottom-0" : "top-0"}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="font-condensed text-[11px] uppercase tracking-widest text-brand-deep">
                    {sponsor.name}
                  </p>
                  <button
                    type="button"
                    aria-label="Close"
                    onClick={() => setOpenIndex(null)}
                    className="-mt-1 -mr-1 h-6 w-6 shrink-0 rounded-full text-brand-ink/60 hover:text-brand-ink"
                  >
                    ×
                  </button>
                </div>
                {sponsor.blurb ? (
                  <p className="mt-2 text-sm leading-relaxed text-brand-ink/80">
                    {sponsor.blurb}
                  </p>
                ) : null}
              </div>
            ) : isOpen && !sponsor ? (
              <div
                role="dialog"
                className={`absolute z-10 hidden w-56 rounded-2xl bg-brand-cream p-4 text-sm text-brand-ink/70 shadow-xl ring-1 ring-brand-ink/10 sm:block ${
                  openLeft ? "right-[calc(100%+10px)]" : "left-[calc(100%+10px)]"
                } ${openUp ? "bottom-0" : "top-0"}`}
              >
                {spot.sponsorName}
              </div>
            ) : null}
          </div>
        );
      })}

      {/* Mobile popover — anchored to the image frame (not the dot) so the card
          and its text always stay fully on screen. Desktop keeps the dot-side
          popovers above; this one only renders below sm. */}
      {openSpot ? (
        <div
          role="dialog"
          aria-label={openSponsor?.name ?? openSpot.sponsorName}
          className="pointer-events-auto absolute inset-x-3 bottom-3 z-30 rounded-2xl bg-brand-cream p-4 text-left text-brand-ink shadow-xl ring-1 ring-brand-ink/10 sm:hidden"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="font-condensed text-[11px] uppercase tracking-widest text-brand-deep">
              {openSponsor?.name ?? openSpot.sponsorName}
            </p>
            <button
              type="button"
              aria-label="Close"
              onClick={() => setOpenIndex(null)}
              className="-mt-1 -mr-1 h-6 w-6 shrink-0 rounded-full text-brand-ink/60 hover:text-brand-ink"
            >
              ×
            </button>
          </div>
          {openSponsor?.blurb ? (
            <p className="mt-2 text-sm leading-relaxed text-brand-ink/80">
              {openSponsor.blurb}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
