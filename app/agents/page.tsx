import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ImpressionsCalculator } from "@/components/impressions-calculator";
import { ImageHotspots } from "@/components/image-hotspots";
import { ProductImage } from "@/components/product-image";
import { getProductBySlug } from "@/lib/products";
import { getSponsorsByPlayer } from "@/lib/sponsors";

export const metadata: Metadata = {
  title: "Make your players more valuable to sponsors",
  description:
    "Tour Pro Shop turns licensed merchandise into hundreds of thousands of real-world brand exposure events — with no extra work for the player or their team.",
  robots: { index: false, follow: false },
};

export default function AgentsLandingPage() {
  const heroProduct = getProductBySlug("cameron-young-polo");
  const heroImage = heroProduct?.images.find((img) =>
    img.src.includes("Sponsor Logo Flatlay"),
  );
  const heroSponsors = heroProduct
    ? getSponsorsByPlayer(heroProduct.playerSlug)
    : [];

  return (
    <div className="agents-page">
      {/* HERO */}
      <section className="border-b border-line bg-brand-cream">
        <div className="mx-auto max-w-[1400px] px-4 pb-12 pt-16 md:px-8 md:pb-20 md:pt-24">
          <div className="grid gap-10 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:items-center md:gap-14">
            <div>
              <p className="eyebrow text-brand-deep">For agents</p>
              <h1 className="mt-4 font-sans text-4xl font-semibold leading-[1.05] tracking-tight text-brand-ink md:text-6xl lg:text-7xl">
                Strengthen your players brand without any work. 
              </h1>
              <p className="mt-6 font-sans text-lg leading-relaxed text-brand-ink/70 md:text-xl">
                We turn tour players into digital pro shops.
                <br />
                <br />
                By offering sponsor-inclusive versions of the gear fans see on TV, we help players extend their impact beyond tournament week, strengthen fan loyalty, and create measurable value for sponsors through additional brand exposure.
                <br />
                <br />
                No inventory, no logistics, no operational burden. Tour Pro Shop handles everything. We just need your approval.
              </p>
            </div>
            {heroProduct && heroImage ? (
              <figure className="md:justify-self-end md:w-full md:max-w-md">
                <div className="relative aspect-[4/5]">
                  <div className="absolute inset-0 overflow-hidden rounded-2xl border border-line">
                    <ProductImage
                      product={heroProduct}
                      image={heroImage}
                      sizes="(max-width: 768px) 100vw, 40vw"
                      className="absolute inset-0 h-full w-full"
                      priority
                    />
                  </div>
                  {heroImage.hotspots && heroImage.hotspots.length > 0 ? (
                    <ImageHotspots
                      hotspots={heroImage.hotspots}
                      sponsors={heroSponsors}
                    />
                  ) : null}
                </div>
                <figcaption className="mt-3 text-center font-condensed text-[11px] uppercase tracking-widest text-brand-ink/55">
                  Tap a callout to see each sponsor
                </figcaption>
                <div className="mt-4 text-center">
                  <Link
                    href={`/products/${heroProduct.slug}`}
                    className="inline-flex items-center gap-1.5 font-sans text-sm font-medium text-brand-deep underline decoration-brand-deep/30 underline-offset-4 transition hover:decoration-brand-deep"
                  >
                    View the {heroProduct.name}
                    <span aria-hidden>→</span>
                  </Link>
                </div>
              </figure>
            ) : null}
          </div>
        </div>
      </section>

      {/* CALCULATOR */}
      <section className="bg-brand-ink py-20 text-brand-cream md:py-28">
        <div className="mx-auto max-w-[1400px] px-4 md:px-8">
          <div className="flex flex-col gap-3 border-b border-brand-cream/15 pb-8 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow text-brand-accent">The Math for Sponsors</p>
              <h2 className="mt-3 font-sans text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
                Model the impression engine.
              </h2>
            </div>
            <p className="max-w-md font-sans text-base text-brand-cream/70">
              Adjust the inputs to see what a licensed run can generate over the
              life of the product.
            </p>
          </div>

          <div className="mt-10 md:mt-14">
            <ImpressionsCalculator tone="dark" />
          </div>
        </div>
      </section>

      {/* WE DO THE WORK */}
      <section className="bg-brand-cream py-20 text-brand-ink md:py-28">
        <div className="mx-auto max-w-[1400px] px-4 md:px-8">
          <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:gap-16">
            <div>
              <p className="eyebrow text-brand-deep">No lift on your side</p>
              <h2 className="mt-4 font-sans text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
                You benefit from the growth. We take on the risk.
              </h2>
            </div>
            <div className="space-y-5 font-sans text-base leading-relaxed text-brand-ink/70 md:text-lg">
              <p>
                Our partners benefit from increased brand exposure. We promote products
                through paid advertising, grassroots marketing, and fan engagement initiatives
                that benefit both players and sponsors.
              </p>
              <p>
                 From inventory through fulfillment and customer service, we handle every aspect of the business.
              </p>
              <ul className="grid grid-cols-2 gap-3 pt-3 font-sans text-sm text-brand-ink/65">
                {[
                  "Sourcing & licensing",
                  "Inventory financed by us",
                  "Storefront & checkout",
                  "Fulfillment & support",
                ].map((item) => (
                  <li
                    key={item}
                    className="rounded-xl border border-line px-4 py-3"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* PHILANTHROPY */}
      <section className="bg-brand-ink py-20 text-brand-cream md:py-28">
        <div className="mx-auto max-w-[1400px] px-4 md:px-8">
          <div className="grid gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:gap-16">
            <div>
              <p className="eyebrow text-brand-accent">Support the Causes That Matter</p>
              <h2 className="mt-4 font-sans text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
                Players give back
              </h2>
              <p className="mt-6 max-w-xl font-sans text-base leading-relaxed text-brand-cream/80 md:text-lg">
                A portion of every sale is directed to a philanthropic cause
                of the player&apos;s choosing. The player decides where the dollars land,
                and both the player and the sponsor share credit for giving back.
              </p>
            </div>
            <div className="rounded-2xl border border-brand-cream/15 p-8 md:p-10">
              <p className="eyebrow text-brand-accent">Shared philanthropic credit</p>
              <ul className="mt-5 space-y-4 font-sans text-base text-brand-cream/80">
                <li className="flex gap-3">
                  <span
                    aria-hidden
                    className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-brand-accent"
                  />
                  <span>
                    <strong className="font-semibold text-brand-cream">
                      The player directs the dollars
                    </strong>{" "}
                    to a cause that matters to them.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span
                    aria-hidden
                    className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-brand-accent"
                  />
                  <span>
                    <strong className="font-semibold text-brand-cream">
                      The sponsor shares the story
                    </strong>{" "}
                    — a charitable narrative layered on top of the
                    impressions above.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span
                    aria-hidden
                    className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-brand-accent"
                  />
                  <span>
                    <strong className="font-semibold text-brand-cream">
                      Both get credit
                    </strong>{" "}
                    for the philanthropic impact the program creates.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* PROVEN ECOSYSTEM */}
      <section className="bg-brand-cream py-20 text-brand-ink md:py-28">
        <div className="mx-auto max-w-[1400px] px-4 md:px-8">
          <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-center md:gap-16">
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <figure className="overflow-hidden rounded-2xl border border-line">
                <div className="relative aspect-[4/5] w-full">
                  <Image
                    src="/Sponsor Images/Lando Norris Logo Shirt.jpg"
                    alt="Lando Norris in a McLaren sponsor-logo shirt — sponsor logos worn like a uniform"
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover"
                  />
                </div>
              </figure>
              <figure className="overflow-hidden rounded-2xl border border-line">
                <div className="relative aspect-[4/5] w-full">
                  <Image
                    src="/Sponsor Images/Liverpool Jersey.webp"
                    alt="Liverpool kit with Standard Chartered sponsor — Premier League fans wearing sponsored jerseys as everyday gear"
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover"
                  />
                </div>
              </figure>
            </div>
            <div>
              <p className="eyebrow text-brand-deep">A proven playbook</p>
              <h2 className="mt-4 font-sans text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
                A proven ecosystem outside of the golf world.
              </h2>
              <p className="mt-6 font-sans text-base leading-relaxed text-brand-ink/70 md:text-lg">
                Across Formula 1, soccer, and cycling, the logos are the uniform. Fans wear what their athletes wear and sponsor brands reap the benefits. We’re bringing a proven model to the golf ecosystem.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
