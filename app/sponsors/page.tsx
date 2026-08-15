import type { Metadata } from "next";
import Image from "next/image";
import { ImpressionsCalculator } from "@/components/impressions-calculator";
import { SponsorHeroCarousel } from "@/components/sponsor-hero-carousel";
import { getSponsorHotspotHeroes } from "@/lib/marketing-assets";
import { neutralSrc } from "@/lib/media";
import { PLAYER_NAMES_HIDDEN } from "@/lib/site-mode";
import { getPublicSponsorsByPlayer } from "@/lib/sponsors";

export const metadata: Metadata = {
  title: "For Sponsors — Get more out of your sponsorships",
  description:
    "We activate your existing sponsorship by selling licensed merchandise at no cost to you. Merch extends sponsor reach far beyond tournament broadcasts — turning fans into year-round, walking ambassadors for your brand.",
  robots: { index: false, follow: false },
};

type Chart = {
  player: string;
  sponsor: string;
  event: string | null;
  src: string;
};

const CHARTS: Chart[] = [
  {
    player: "JT Poston",
    sponsor: "Elijah Craig",
    event: "Memorial Sunday",
    src: "/Sponsor Images/JT Poston - Elijah Craig.png",
  },
  {
    player: "Aaron Rai",
    sponsor: "Me and My Golf",
    event: "PGA Championship Week",
    src: "/Sponsor Images/Aaron Rai - Me and My Golf.png",
  },
];

export default function SponsorsLandingPage() {
  // The hero is a carousel of sponsor-callout flatlays, resolved from the live
  // catalog rather than named here: it matches on the hotspots (so a re-shot or
  // renamed flatlay still resolves) and skips any product whose player has gone
  // dark (so this page needs no edit when one does).
  const heroes = getSponsorHotspotHeroes().map((hero) => ({
    ...hero,
    sponsors: getPublicSponsorsByPlayer(hero.product.playerSlug),
  }));

  return (
    <div className="sponsors-page">
      {/* HERO + CHARTS */}
      <section className="border-b border-line bg-brand-cream">
        <div className="mx-auto max-w-[1400px] px-4 pb-10 pt-12 md:px-8 md:pb-14 md:pt-16">
          <div className="grid gap-10 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:items-center md:gap-14">
            <div>
              <p className="eyebrow text-brand-deep text-xl md:text-3xl">For corporate sponsors</p>
              <h1 className="mt-4 font-display text-4xl leading-[1.05] tracking-tight text-brand-ink md:text-6xl lg:text-7xl">
                Get more out of your sponsorships with zero work.
              </h1>
              <p className="mt-6 font-sans text-lg leading-relaxed text-brand-ink/70 md:text-xl">
                Tour Pro Shop unlocks value from your existing player sponsorships by
                selling player-specific merchandise with your corporate logo at no additional cost to your brand.
              </p>
            </div>
            <SponsorHeroCarousel
              heroes={heroes}
              className="md:justify-self-end md:w-full md:max-w-md"
            />
          </div>

          <div className="mt-8 border-t border-line pt-8 md:mt-12 md:pt-10">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="eyebrow text-brand-deep">The math</p>
                <h2 className="mt-3 font-display text-3xl leading-tight tracking-tight text-brand-ink md:text-5xl">
                  Model the impression engine.
                </h2>
              </div>
              <p className="max-w-md font-sans text-base text-brand-ink/65">
                Adjust the inputs to see what a licensed run can generate over
                the life of the product.
              </p>
            </div>
            <div className="mt-10 md:mt-14">
              <ImpressionsCalculator />
            </div>
          </div>

          <div className="mt-8 border-t border-line pt-8 md:mt-12 md:pt-10">
            <p className="eyebrow text-brand-deep">The proof</p>
            <h2 className="mt-3 font-display text-3xl leading-tight tracking-tight text-brand-ink md:text-5xl">
              We make sponsorships drive value all the time,
              <br />
              not just when a player contends.
            </h2>
            <p className="mt-4 max-w-2xl font-sans text-base leading-relaxed text-brand-ink/65 md:text-lg">
              Earned media creates the peaks. We help raise the floor.
              <br />
              When players contend, sponsors receive tremendous exposure. When they don't, visibility can drop off dramatically. Sponsor inclusive merchandise gives brands a presence that extends beyond tournament coverage.
            </p>

            <div className="mt-6 grid gap-6 md:mt-8 md:grid-cols-2 md:gap-6">
              {CHARTS.map((c, i) => (
                <figure
                  key={c.sponsor}
                  className="flex flex-col overflow-hidden rounded-xl border border-line bg-surface-raised"
                >
                  <div className="relative aspect-[6/2] w-full bg-brand-cream">
                    <Image
                      src={neutralSrc(c.src)}
                      alt={
                        PLAYER_NAMES_HIDDEN
                          ? `Google search interest for ${c.sponsor} during their player's ${c.event ?? "tournament"} performance`
                          : `Google search interest for ${c.sponsor} during ${c.player}'s ${c.event ?? "tournament"} performance`
                      }
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-contain px-2 py-0.5"
                      priority={i === 0}
                    />
                  </div>
                  <figcaption className="border-t border-line px-4 py-3">
                    {/* The player is the subject of the chart, so hiding names
                        changes the caption's shape rather than dropping a word:
                        the sponsor becomes the headline and the player line
                        turns into an unattributed "their player". */}
                    <p className="font-condensed text-[11px] uppercase tracking-widest text-brand-ink/55">
                      {PLAYER_NAMES_HIDDEN ? "Their player" : c.player}
                    </p>
                    <p className="mt-1 font-sans text-base font-semibold text-brand-ink">
                      {c.sponsor}
                    </p>
                    {c.event ? (
                      <p className="mt-0.5 font-sans text-sm text-brand-ink/60">
                        {c.event}
                      </p>
                    ) : null}
                  </figcaption>
                </figure>
              ))}
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
              <h2 className="mt-4 font-display text-3xl leading-tight tracking-tight md:text-5xl">
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
