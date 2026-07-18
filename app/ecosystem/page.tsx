import type { Metadata } from "next";
import { ValueTriangle } from "@/components/value-triangle";

export const metadata: Metadata = {
  title: "The Ecosystem — Value on every side",
  description:
    "Tour Pro Shop sits at the center of the equation — turning professional golfers into digital pro shops and aligning sponsors, players, and fans around the same merchandise.",
  robots: { index: false, follow: false },
};

export default function EcosystemPage() {
  return (
    <div className="sponsors-page">
      <section className="bg-brand-cream py-20 md:py-28">
        <div className="mx-auto max-w-[1400px] px-4 md:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow text-brand-deep">The ecosystem</p>
            <h1 className="mt-3 font-display text-4xl leading-tight tracking-tight text-brand-ink md:text-6xl">
              One product. Value on every side.
            </h1>
            <p className="mt-4 font-sans text-base leading-relaxed text-brand-ink/65 md:text-lg">
              Tour Pro Shop sits at the center of the equation — turning
              professional golfers into digital pro shops and aligning sponsors,
              players, and fans around the same merchandise.
            </p>
          </div>

          <div className="mt-14 md:mt-16">
            <ValueTriangle />
          </div>
        </div>
      </section>
    </div>
  );
}
