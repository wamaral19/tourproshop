"use client";

import { useEffect, useRef, useState } from "react";
import type { ProductImageHotspot } from "@/lib/products";
import type { Sponsor } from "@/lib/sponsors";

/** Overlays a set of circular "+" callouts on a product image. Clicking one
 *  toggles a popover that surfaces the matching sponsor's name and blurb. */
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
              className={`relative flex h-8 w-8 items-center justify-center rounded-full bg-white text-brand-ink shadow-md ring-1 ring-brand-ink/15 transition-transform hover:scale-110 ${
                isOpen ? "scale-110" : ""
              }`}
            >
              <span aria-hidden className="block h-3 w-3 relative">
                <span className="absolute left-1/2 top-0 h-full w-[1.5px] -translate-x-1/2 rounded-full bg-current" />
                <span className="absolute top-1/2 left-0 h-[1.5px] w-full -translate-y-1/2 rounded-full bg-current" />
              </span>
              <span
                aria-hidden
                className={`absolute inset-0 -z-10 rounded-full bg-white/60 ${
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
                <p className="mt-2 text-sm leading-relaxed text-brand-ink/80">
                  {sponsor.blurb}
                </p>
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
          {openSponsor ? (
            <p className="mt-2 text-sm leading-relaxed text-brand-ink/80">
              {openSponsor.blurb}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
