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

  const ownerMeta = {
    player: {
      label: "Player",
      place: "col-start-1",
      wrap: "mx-auto w-fit",
      dot: "bg-brand-primary",
      card: "border-brand-primary/50 bg-brand-primary/20 text-brand-cream",
      pill: "border-brand-cream/25 text-brand-cream/80",
    },
    shop: {
      label: "Tour Pro Shop",
      place: "col-start-2",
      wrap: "mx-auto w-fit",
      dot: "bg-brand-cream",
      card: "border-brand-cream/20 bg-surface-raised text-brand-ink/80",
      pill: "border-line text-brand-ink/60",
    },
    sponsor: {
      label: "Sponsor",
      place: "col-start-3",
      wrap: "mx-auto w-fit",
      dot: "bg-brand-sponsor",
      card: "border-brand-sponsor/50 bg-brand-sponsor/25 text-brand-cream",
      pill: "border-brand-cream/25 text-brand-cream/80",
    },
    all: {
      label: "All three",
      place: "col-span-3",
      wrap: "w-full justify-center",
      dot: "bg-brand-primary",
      card: "border-line bg-surface-raised text-brand-ink",
      pill: "border-line text-brand-ink/70",
    },
  } as const;

  const stages: {
    title: string;
    steps: { step: string; owner: keyof typeof ownerMeta }[];
  }[] = [
    {
      title: "Approvals",
      steps: [
        { step: "Player approval", owner: "player" },
        { step: "Select charity", owner: "player" },
        { step: "Introduce to sponsor", owner: "player" },
        { step: "Obtain sponsor approval", owner: "shop" },
        { step: "Approve logo usage", owner: "sponsor" },
      ],
    },
    {
      title: "Launch",
      steps: [
        { step: "Wholesale purchases", owner: "shop" },
        { step: "Embroidery", owner: "shop" },
        { step: "Marketing", owner: "shop" },
        { step: "Store launch", owner: "shop" },
      ],
    },
    {
      title: "Ongoing management",
      steps: [
        { step: "Fulfillment", owner: "shop" },
        { step: "Customer support", owner: "shop" },
        { step: "Returns", owner: "shop" },
        { step: "Reporting", owner: "shop" },
        { step: "Charity administration", owner: "shop" },
      ],
    },
  ];

  return (
    <div className="agents-page">
      {/* HERO */}
      <section className="border-b border-line bg-brand-cream">
        <div className="mx-auto max-w-[1400px] px-4 pb-12 pt-16 md:px-8 md:pb-20 md:pt-24">
          <div className="grid gap-10 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:items-center md:gap-14">
            <div>
              <p className="eyebrow text-brand-deep">For agents</p>
              <h1 className="mt-4 font-display text-4xl leading-[1.05] tracking-tight text-brand-ink md:text-5xl lg:text-5xl">
                Increase the value of your player's sponsorship inventory.
              </h1>
              <p className="mt-6 font-sans text-lg leading-relaxed text-brand-ink/70 md:text-xl">
                We create a new sponsorship asset by offering fans the same sponsor-inclusive apparel your players wear in competition.
                <br />
                <br />
               Tour Pro Shop handles everything, including coordinating with sponsors for approval. No inventory, no logistics, no operational burden. We unlock additional sponsorship value while creating zero additional work for agents.
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

      {/* RESPONSIBILITY TIMELINE */}
      <section className="bg-brand-ink py-20 text-brand-cream md:py-28">
        <div className="mx-auto max-w-[1400px] px-4 md:px-8">
          {/* RESPONSIBILITY TIMELINE */}
          <div className="mb-8 max-w-2xl md:mb-10">
            <p className="eyebrow text-brand-accent">Who does what</p>
            <h2 className="mt-3 font-display text-2xl leading-tight tracking-tight md:text-3xl">
              A clear division of responsibility.
            </h2>
            <p className="mt-4 font-sans text-base leading-relaxed text-brand-cream/70">
              The player and their team make a few key approvals. Tour Pro
              Shop runs everything else, end to end.
            </p>
          </div>

          {/* Mobile: stages stacked, each with its steps */}
          <div className="space-y-8 md:hidden">
            {stages.map((stage, si) => (
              <div key={stage.title}>
                <p className="mb-3 font-condensed text-[13px] uppercase tracking-widest text-brand-accent">
                  Stage {si + 1} · {stage.title}
                </p>
                <ol className="relative space-y-2.5 border-l border-brand-cream/20 pl-5">
                  {stage.steps.map((r) => {
                    const m = ownerMeta[r.owner];
                    return (
                      <li key={r.step} className="relative">
                        <span
                          aria-hidden
                          className={`absolute -left-[1.55rem] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full ring-4 ring-brand-ink ${m.dot}`}
                        />
                        <div
                          className={`flex items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 font-sans text-sm ${m.card}`}
                        >
                          <span className="font-medium">{r.step}</span>
                          <span
                            className={`shrink-0 rounded-full border px-2 py-0.5 font-condensed text-[10px] uppercase tracking-wider ${m.pill}`}
                          >
                            {m.label}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            ))}
          </div>

          {/* Desktop: horizontal left-to-right timeline */}
          <div className="hidden md:block">
            {/* Color legend */}
            <div className="mb-8 flex flex-wrap items-center gap-x-7 gap-y-2">
              {(
                [
                  ["player", "Player & Agent"],
                  ["shop", "Tour Pro Shop"],
                  ["sponsor", "Sponsor"],
                ] as const
              ).map(([owner, label]) => (
                <span
                  key={owner}
                  className="inline-flex items-center gap-2 font-condensed text-[13px] uppercase tracking-widest text-brand-cream/60"
                >
                  <span
                    aria-hidden
                    className={`h-2.5 w-2.5 rounded-full ${ownerMeta[owner].dot}`}
                  />
                  {label}
                </span>
              ))}
            </div>

            {/* Timeline — one row per stage, steps flowing left-to-right */}
            <div className="space-y-10">
              {stages.map((stage, si) => (
                <div key={stage.title}>
                  <div className="mb-4 flex items-center gap-3">
                    <span className="font-condensed text-[13px] uppercase tracking-widest text-brand-accent">
                      Stage {si + 1} · {stage.title}
                    </span>
                    <span aria-hidden className="h-px flex-1 bg-brand-cream/15" />
                  </div>
                  <ol className="grid grid-cols-5 gap-x-0">
                    {stage.steps.map((r, i) => {
                      const m = ownerMeta[r.owner];
                      const isLast = i === stage.steps.length - 1;
                      return (
                        <li
                          key={r.step}
                          className="relative flex flex-col items-center px-2"
                        >
                          {/* connector to the next step in this stage */}
                          {!isLast ? (
                            <span
                              aria-hidden
                              className="absolute left-1/2 top-[6px] h-px w-full bg-brand-cream/20"
                            />
                          ) : null}
                          <span
                            aria-hidden
                            className={`relative z-10 h-3 w-3 rounded-full ring-4 ring-brand-ink ${m.dot}`}
                          />
                          <div
                            className={`mt-4 w-full rounded-xl border px-3 py-2.5 text-center font-sans text-[13px] font-medium leading-snug ${m.card}`}
                          >
                            {r.step}
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CALCULATOR + WE DO THE WORK */}
      <section className="bg-brand-cream py-20 text-brand-ink md:py-28">
        <div className="mx-auto max-w-[1400px] px-4 md:px-8">
          {/* CALCULATOR */}
          <div className="flex flex-col gap-3 border-b border-line pb-8 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow text-brand-deep">Here's the math</p>
              <h2 className="mt-3 font-display text-2xl leading-tight tracking-tight md:text-4xl">
                Estimate the additional sponsor value created when fans wear the same sponsor-inclusive apparel as your player.
              </h2>
            </div>
          </div>
          <div className="mt-10 md:mt-14">
            <ImpressionsCalculator tone="light" />
          </div>

          {/* WE DO THE WORK */}
          <div className="mt-16 grid gap-10 border-t border-line pt-14 md:mt-20 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:gap-16 md:pt-20">
            <div>
              <p className="eyebrow text-brand-deep">No lift on your side</p>
              <h2 className="mt-4 font-display text-3xl leading-tight tracking-tight md:text-5xl">
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
