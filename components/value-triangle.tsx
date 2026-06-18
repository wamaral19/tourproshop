import type { ReactNode } from "react";

/** A value-ecosystem diagram: Tour Pro Shop sits at the center of a triangle,
 *  with sponsors at the apex and players + fans forming the base. Each corner
 *  spells out the value the program delivers to that side of the equation.
 *
 *  Desktop renders the literal triangle (absolutely positioned corner cards with
 *  an SVG perimeter + spokes behind them); below `lg` it gracefully stacks. */

type Side = {
  key: string;
  label: string;
  tagline: string;
  points: string[];
  /** Tailwind color classes — kept as full literal strings so Tailwind can see them. */
  labelText: string;
  dot: string;
  iconWrap: string;
  icon: ReactNode;
};

const SIDES: Side[] = [
  {
    key: "sponsors",
    label: "Sponsors",
    tagline: "Transform sponsorships into something fans choose to wear.",
    points: [
      "Build brand affinity",
      "Extend exposure beyond tournament week",
      "Generate measurable incremental value",
    ],
    labelText: "text-brand-deep",
    dot: "bg-brand-deep",
    iconWrap: "bg-brand-deep/10 text-brand-deep",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
        <path
          d="M20.5 11.5 12.5 3.5H4v8.5l8 8 8.5-8.5Z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
        <circle cx="8" cy="8" r="1.6" fill="currentColor" />
      </svg>
    ),
  },
  {
    key: "players",
    label: "Players",
    tagline: "Extend your brand beyond competition.",
    points: [
      "Give fans a way to support you",
      "Increase the value you deliver sponsors",
      "Create future opportunities",
    ],
    labelText: "text-brand-primary",
    dot: "bg-brand-primary",
    iconWrap: "bg-brand-primary/10 text-brand-primary",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
        <path
          d="M6 21V3m0 0 11 1.5L13 8l4 3.5L6 13"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    key: "fans",
    label: "Fans",
    tagline: "Finally, wear what your favorite player wears.",
    points: [
      "Authentic sponsor-inclusive gear",
      "A deeper connection to the players you follow",
      "A new way to show support",
    ],
    labelText: "text-brand-flag",
    dot: "bg-brand-flag",
    iconWrap: "bg-brand-flag/10 text-brand-flag",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden>
        <path d="M12 20.5S3.5 15 3.5 8.9C3.5 6.1 5.7 4 8.4 4c1.6 0 3 .8 3.6 2 .6-1.2 2-2 3.6-2 2.7 0 4.9 2.1 4.9 4.9 0 6.1-8.5 11.6-8.5 11.6Z" />
      </svg>
    ),
  },
];

function SideCard({ side }: { side: Side }) {
  return (
    <div className="rounded-2xl border border-line bg-surface-raised p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${side.iconWrap}`}
        >
          {side.icon}
        </span>
        <p
          className={`font-condensed text-lg uppercase leading-none tracking-[0.18em] ${side.labelText}`}
        >
          {side.label}
        </p>
      </div>
      <p className="mt-4 font-sans text-base font-semibold leading-snug text-brand-ink">
        {side.tagline}
      </p>
      <ul className="mt-4 space-y-2.5">
        {side.points.map((point) => (
          <li
            key={point}
            className="flex gap-2.5 font-sans text-sm leading-snug text-brand-ink/70"
          >
            <span
              aria-hidden
              className={`mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full ${side.dot}`}
            />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CenterMedallion({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-full bg-brand-ink text-center text-brand-cream ${className}`}
    >
      <p className="font-wordmark text-2xl leading-none tracking-wide md:text-3xl">
        Tour Pro Shop
      </p>
      <p className="mt-3 px-2 font-sans text-sm font-medium leading-snug text-brand-cream/90">
        Turning professional golfers into digital pro shops.
      </p>
      <p className="mt-2 px-2 font-sans text-xs leading-snug text-brand-accent">
        No additional work required from players or sponsors.
      </p>
    </div>
  );
}

export function ValueTriangle() {
  return (
    <>
      {/* Desktop: literal triangle */}
      <div className="relative mx-auto hidden min-h-[760px] max-w-[1080px] lg:block">
        {/* Connecting lines (perimeter + spokes to the hub), painted behind cards */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full text-brand-primary"
          aria-hidden
        >
          <polygon
            points="50,16 15,84 85,84"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.3"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />
          <g stroke="currentColor" strokeOpacity="0.22" strokeWidth="1.5">
            <line x1="50" y1="55" x2="50" y2="16" vectorEffect="non-scaling-stroke" />
            <line x1="50" y1="55" x2="15" y2="84" vectorEffect="non-scaling-stroke" />
            <line x1="50" y1="55" x2="85" y2="84" vectorEffect="non-scaling-stroke" />
          </g>
        </svg>

        {/* Sponsors — apex */}
        <div className="absolute left-1/2 top-0 w-[340px] -translate-x-1/2">
          <SideCard side={SIDES[0]} />
        </div>
        {/* Players — bottom left */}
        <div className="absolute bottom-0 left-0 w-[320px]">
          <SideCard side={SIDES[1]} />
        </div>
        {/* Fans — bottom right */}
        <div className="absolute bottom-0 right-0 w-[320px]">
          <SideCard side={SIDES[2]} />
        </div>
        {/* Tour Pro Shop — hub */}
        <CenterMedallion className="absolute left-1/2 top-[55%] h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 border-4 border-brand-cream shadow-xl" />
      </div>

      {/* Mobile / tablet: stacked */}
      <div className="lg:hidden">
        <CenterMedallion className="mx-auto h-[260px] w-[260px] border-4 border-brand-cream shadow-xl" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {SIDES.map((side) => (
            <SideCard key={side.key} side={side} />
          ))}
        </div>
      </div>
    </>
  );
}
