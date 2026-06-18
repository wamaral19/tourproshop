import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ImageHotspots } from "@/components/image-hotspots";
import { ProductImage } from "@/components/product-image";
import { getProductBySlug } from "@/lib/products";
import { getSponsorsByPlayer } from "@/lib/sponsors";

export const metadata: Metadata = {
  title: "For Apparel Brands — A new wholesale channel",
  description:
    "Tour Pro Shop links your professional ambassador programs directly to sales through a new wholesale partner — and opens a new customer acquisition channel by letting fans hear from your brand directly.",
  robots: { index: false, follow: false },
};

export default function ApparelLandingPage() {
  const heroProduct = getProductBySlug("cameron-young-polo");
  const heroImage = heroProduct?.images.find((img) =>
    img.src.includes("Sponsor Logo Flatlay"),
  );
  const heroSponsors = heroProduct
    ? getSponsorsByPlayer(heroProduct.playerSlug)
    : [];

  return (
    <div className="apparel-page">
      {/* HERO */}
      <section className="border-b border-line bg-brand-cream">
        <div className="mx-auto max-w-[1400px] px-4 pb-12 pt-16 md:px-8 md:pb-20 md:pt-24">
          <div className="grid gap-10 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:items-center md:gap-14">
            <div>
              <p className="eyebrow text-brand-deep">For apparel sponsors</p>
              <h1 className="mt-4 font-sans text-4xl font-semibold leading-[1.05] tracking-tight text-brand-ink md:text-6xl lg:text-7xl">
                Access a new wholesale channel.
              </h1>
              <p className="mt-6 font-sans text-lg leading-relaxed text-brand-ink/70 md:text-xl">
                Directly link your professional ambassador programs to sales
                through a new wholesale partner. The gear fans already see on
                tour becomes merchandise they can buy — with your brand on it.
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

      {/* NEW CUSTOMER ACQUISITION CHANNEL */}
      <section className="bg-brand-ink py-20 text-brand-cream md:py-28">
        <div className="mx-auto max-w-[1400px] px-4 md:px-8">
          <div className="grid gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:gap-16">
            <div>
              <p className="eyebrow text-brand-accent">A new-age retail partner</p>
              <h2 className="mt-4 font-sans text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
                A new customer acquisition channel.
              </h2>
              <p className="mt-6 max-w-xl font-sans text-base leading-relaxed text-brand-cream/80 md:text-lg">
                Tour Pro Shop lets customers opt in to marketing communications
                directly from apparel partners, creating a new customer
                acquisition channel for your brand. We&apos;re not just another
                wholesale account — we&apos;re a new-age retail partner that hands
                you the relationship, not just the sale.
              </p>
            </div>
            <div className="rounded-2xl border border-brand-cream/15 p-8 md:p-10">
              <p className="eyebrow text-brand-accent">What you get</p>
              <ul className="mt-5 space-y-4 font-sans text-base text-brand-cream/80">
                <li className="flex gap-3">
                  <span
                    aria-hidden
                    className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-brand-accent"
                  />
                  <span>
                    <strong className="font-semibold text-brand-cream">
                      Direct-to-customer permission
                    </strong>{" "}
                    — fans opt in to hear from your brand, not just from us.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span
                    aria-hidden
                    className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-brand-accent"
                  />
                  <span>
                    <strong className="font-semibold text-brand-cream">
                      Ambassador programs that sell
                    </strong>{" "}
                    — your existing player deals become a revenue channel.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span
                    aria-hidden
                    className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-brand-accent"
                  />
                  <span>
                    <strong className="font-semibold text-brand-cream">
                      Net-new customers
                    </strong>{" "}
                    — golf fans who discover your brand through the players they
                    follow.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* PROVEN PLAYBOOK */}
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
                A proven playbook outside of the golf world.
              </h2>
              <p className="mt-6 font-sans text-base leading-relaxed text-brand-ink/70 md:text-lg">
                Across Formula 1, soccer, and cycling, the logos are the uniform.
                Fans wear what their athletes wear and apparel brands reap the
                benefits. We&apos;re bringing a proven model to the golf
                ecosystem.
              </p>
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
                and both the player and the apparel partner share credit for giving back.
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
                      The apparel partner shares the story
                    </strong>{" "}
                    — a charitable narrative layered on top of the brand exposure.
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
    </div>
  );
}
