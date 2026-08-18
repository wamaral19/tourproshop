import type { Metadata } from "next";
import Image from "next/image";
import { SponsorHeroCarousel } from "@/components/sponsor-hero-carousel";
import { getSponsorHotspotHeroes } from "@/lib/marketing-assets";
import { PHOTOGRAPHY_HIDDEN } from "@/lib/site-mode";
import { getPublicSponsorsByPlayer } from "@/lib/sponsors";

export const metadata: Metadata = {
  title: "For Apparel Brands — A new wholesale channel",
  description:
    "Tour Pro Shop links your professional ambassador programs directly to sales through a new wholesale partner — and opens a new customer acquisition channel by letting fans hear from your brand directly.",
  robots: { index: false, follow: false },
};

export default function ApparelLandingPage() {
  // The hero is a carousel of sponsor-callout flatlays, resolved from the live
  // catalog rather than named here: it matches on the hotspots (so a re-shot or
  // renamed flatlay still resolves) and skips any product whose player has gone
  // dark (so this page needs no edit when one does).
  const heroes = getSponsorHotspotHeroes().map((hero) => ({
    ...hero,
    sponsors: getPublicSponsorsByPlayer(hero.product.playerSlug),
  }));

  return (
    <div className="apparel-page">
      {/* HERO */}
      <section className="border-b border-line bg-brand-cream">
        <div className="mx-auto max-w-[1400px] px-4 pb-12 pt-16 md:px-8 md:pb-20 md:pt-24">
          <div
            className={
              PHOTOGRAPHY_HIDDEN
                ? "max-w-3xl"
                : "grid gap-10 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:items-center md:gap-14"
            }
          >
            <div>
              <p className="eyebrow text-brand-deep">For apparel sponsors</p>
              <h1 className="mt-4 font-display text-4xl leading-[1.05] tracking-tight text-brand-ink md:text-6xl lg:text-7xl">
                Access a new wholesale channel.
              </h1>
              <p className="mt-6 font-sans text-lg leading-relaxed text-brand-ink/70 md:text-xl">
                Directly link your professional ambassador programs to sales
                through a new wholesale partner. The gear fans already see on
                tour becomes merchandise they can buy — with your brand on it.
              </p>
            </div>
            <SponsorHeroCarousel
              heroes={heroes}
              className="md:justify-self-end md:w-full md:max-w-md"
            />
          </div>
        </div>
      </section>

      {/* NEW CUSTOMER ACQUISITION CHANNEL */}
      <section className="bg-brand-ink py-20 text-brand-cream md:py-28">
        <div className="mx-auto max-w-[1400px] px-4 md:px-8">
          <div className="grid gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:gap-16">
            <div>
              <p className="eyebrow text-brand-accent">A new-age retail partner</p>
              <h2 className="mt-4 font-display text-3xl leading-tight tracking-tight md:text-5xl">
                Turn fans into known customers
              </h2>
              <p className="mt-6 max-w-xl font-sans text-base leading-relaxed text-brand-cream/80 md:text-lg">
                Customers are opted into marketing communications with apparel partners by default. Tour Pro Shop lets customers opt in to marketing communications
                We create a new customer acquisition channel for your brand. We&apos;re not just another
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
                      Get the customer, not just the sale
                    </strong>{" "}
                    — receive individual purchaser data similar to a direct-to-consumer transaction.
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
                    — turn player affinity into product purchases and long-term brand loyalty.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span
                    aria-hidden
                    className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-brand-accent"
                  />
                  <span>
                    <strong className="font-semibold text-brand-cream">
                      Reach new audiences
                    </strong>{" "}
                    — introduce your brand to highly engaged golf fans through the players they trust.
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
              <h2 className="mt-4 font-display text-3xl leading-tight tracking-tight md:text-5xl">
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
              <h2 className="mt-4 font-display text-3xl leading-tight tracking-tight md:text-5xl">
                Sponsors give back
              </h2>
              <p className="mt-6 max-w-xl font-sans text-base leading-relaxed text-brand-cream/80 md:text-lg">
                A portion of every sale is directed to a philanthropic cause
                of the sponsor&apos;s choosing. The sponsor decides where the dollars land,
                and both the sponsors and the player share credit for giving back.
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
                      The sponsors direct the dollars
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
                      The sponsors and player share the story
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
