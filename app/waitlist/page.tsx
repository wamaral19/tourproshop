import type { Metadata } from "next";
import { WaitlistForm } from "@/components/waitlist-form";
import {
  WaitlistCarousel,
  type WaitlistSlide,
} from "@/components/waitlist-carousel";
import { ProductImage } from "@/components/product-image";
import { products } from "@/lib/products";

export const metadata: Metadata = {
  title: "Golf jerseys are almost here",
  description:
    "Join the waitlist for early access to sponsor-inclusive Tour looks.",
  // Paid-traffic landing page — keep it out of the index.
  robots: { index: false, follow: false },
};

/** Every exclusive garment with real photography, in catalog order — the rail
 *  auto-includes new drops as their photos land. Headwear is excluded so the
 *  "golf jerseys" rail stays apparel-only. We render each product's lead image
 *  (not an explicit gallery shot) so it centers in the frame instead of
 *  top-anchoring the way the PDP gallery does. */
const showcaseProducts = products.filter(
  (product) =>
    product.category !== "headwear" &&
    !product.images[0]?.src.startsWith("/placeholders/"),
);

export default function WaitlistPage() {
  const slides: WaitlistSlide[] = showcaseProducts.map((product, i) => ({
    name: product.name,
    href: `/products/${product.slug}`,
    node: (
      <ProductImage
        product={product}
        sizes="(max-width: 768px) 100vw, 40vw"
        className="absolute inset-0 h-full w-full"
        // Only the first slide is above the fold at load — the rest advance in.
        priority={i === 0}
      />
    ),
  }));

  return (
    <div className="agents-page">
      {/* HERO */}
      <section className="border-b border-line bg-brand-cream">
        <div className="mx-auto max-w-[1400px] px-4 pb-16 pt-16 md:px-8 md:pb-24 md:pt-24">
          <div className="grid gap-10 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:items-center md:gap-14">
            <div>
              <p className="eyebrow text-brand-deep">Coming soon</p>
              <h1 className="mt-4 font-display text-4xl leading-[1.05] tracking-tight text-brand-ink md:text-5xl lg:text-6xl">
                Golf jerseys are almost here.
              </h1>
              <p className="mt-6 max-w-xl font-sans text-lg leading-relaxed text-brand-ink/70 md:text-xl">
                Join the waitlist for early access to sponsor-inclusive Tour
                looks — the same pieces the pros wear, sponsor logos and all.
              </p>

              <WaitlistForm />
            </div>

            {slides.length > 0 ? <WaitlistCarousel slides={slides} /> : null}
          </div>
        </div>
      </section>

      {/* WHAT YOU'RE JOINING */}
      <section className="bg-brand-ink py-20 text-brand-cream md:py-28">
        <div className="mx-auto max-w-[1400px] px-4 md:px-8">
          <div className="max-w-2xl">
            <p className="eyebrow text-brand-accent">What you&apos;re joining</p>
            <h2 className="mt-3 font-display text-2xl leading-tight tracking-tight md:text-4xl">
              The looks your favorite tour pros actually wear.
            </h2>
            <p className="mt-4 font-sans text-base leading-relaxed text-brand-cream/70 md:text-lg">
              We make the sponsor-inclusive apparel worn in competition available
              to fans — logos and all. Waitlist members get early access before
              each drop goes live.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              {
                title: "Early access",
                body: "First in line when a new player's collection launches.",
              },
              {
                title: "Sponsor-inclusive",
                body: "The exact looks from the course — down to the sponsor logos.",
              },
              {
                title: "Limited runs",
                body: "Small drops per player. The list gets the first shot.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-2xl border border-brand-cream/15 p-6 md:p-7"
              >
                <p className="font-condensed text-sm uppercase tracking-widest text-brand-accent">
                  {card.title}
                </p>
                <p className="mt-3 font-sans text-base leading-relaxed text-brand-cream/80">
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
