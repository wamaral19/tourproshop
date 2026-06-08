import type { Metadata } from "next";
import { ImpressionsCalculator } from "@/components/impressions-calculator";

export const metadata: Metadata = {
  title: "For Agents — Drive recognition and sponsor value",
  description:
    "Tour Pro Shop turns licensed merchandise into hundreds of thousands of real-world brand exposure events — with no extra work for the player or their team.",
  robots: { index: false, follow: false },
};

export default function AgentsLandingPage() {
  return (
    <div className="agents-page">
      {/* HERO */}
      <section className="border-b border-line bg-brand-cream">
        <div className="mx-auto max-w-[1400px] px-4 pb-12 pt-16 md:px-8 md:pb-20 md:pt-24">
          <p className="eyebrow text-brand-deep">For agents</p>
          <h1 className="mt-4 max-w-4xl font-sans text-4xl font-semibold leading-[1.05] tracking-tight text-brand-ink md:text-6xl lg:text-7xl">
            Drive player recognition and sponsor value with no additional work.
          </h1>
          <p className="mt-6 max-w-3xl font-sans text-lg leading-relaxed text-brand-ink/70 md:text-xl">
            Tour Pro Shop creates hundreds of thousands of real-world brand
            exposure events among affluent golf consumers who voluntarily paid
            to become walking brand ambassadors through licensed merchandise.
          </p>
        </div>
      </section>

      {/* WE DO THE WORK */}
      <section className="bg-brand-ink py-20 text-brand-cream md:py-28">
        <div className="mx-auto max-w-[1400px] px-4 md:px-8">
          <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:gap-16">
            <div>
              <p className="eyebrow text-brand-accent">No lift on your side</p>
              <h2 className="mt-4 font-sans text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
                We handle the work. We carry the risk.
              </h2>
            </div>
            <div className="space-y-5 font-sans text-base leading-relaxed text-brand-cream/80 md:text-lg">
              <p>
                Tour Pro Shop sources the product, manages the supply chain,
                fronts the inventory, runs the storefront, ships the orders,
                and handles customer service.
              </p>
              <p>
                Tour Pro Shop runs social and grassroots marketing efforts to
                drive sales and organic social media growth for players and
                brands. No participation is necessary from players.
              </p>
              <ul className="grid grid-cols-2 gap-3 pt-3 font-sans text-sm text-brand-cream/70">
                {[
                  "Sourcing & licensing",
                  "Inventory financed by us",
                  "Storefront & checkout",
                  "Fulfillment & support",
                ].map((item) => (
                  <li
                    key={item}
                    className="rounded-xl border border-brand-cream/15 px-4 py-3"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CALCULATOR */}
      <section className="bg-brand-cream py-16 md:py-24">
        <div className="mx-auto max-w-[1400px] px-4 md:px-8">
          <div className="flex flex-col gap-3 border-b border-line pb-8 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow text-brand-deep">The Math for Sponsors</p>
              <h2 className="mt-3 font-sans text-3xl font-semibold leading-tight tracking-tight text-brand-ink md:text-5xl">
                Model the impression engine.
              </h2>
            </div>
            <p className="max-w-md font-sans text-base text-brand-ink/65">
              Adjust the inputs to see what a licensed run can generate over the
              life of the product.
            </p>
          </div>

          <div className="mt-10 md:mt-14">
            <ImpressionsCalculator />
          </div>
        </div>
      </section>

      {/* PHILANTHROPY */}
      <section className="bg-brand-cream py-20 md:py-28">
        <div className="mx-auto max-w-[1400px] px-4 md:px-8">
          <div className="grid gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:gap-16">
            <div>
              <p className="eyebrow text-brand-deep">Support the Causes That Matter</p>
              <h2 className="mt-4 font-sans text-3xl font-semibold leading-tight tracking-tight text-brand-ink md:text-5xl">
                Licensing proceeds go where the player wants them to.
              </h2>
              <p className="mt-6 max-w-xl font-sans text-base leading-relaxed text-brand-ink/70 md:text-lg">
                Every licensing dollar Tour Pro Shop pays out is directed to a
                philanthropic cause of the player&apos;s choosing. The player
                decides where the dollars land — and both the player and the
                sponsor share credit for the cause they back together.
              </p>
            </div>
            <div className="rounded-2xl border border-line bg-surface-raised p-8 md:p-10">
              <p className="eyebrow text-brand-deep">Shared philanthropic credit</p>
              <ul className="mt-5 space-y-4 font-sans text-base text-brand-ink/80">
                <li className="flex gap-3">
                  <span
                    aria-hidden
                    className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-brand-primary"
                  />
                  <span>
                    <strong className="font-semibold text-brand-ink">
                      The player directs the dollars
                    </strong>{" "}
                    to a cause that matters to them.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span
                    aria-hidden
                    className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-brand-primary"
                  />
                  <span>
                    <strong className="font-semibold text-brand-ink">
                      The sponsor shares the story
                    </strong>{" "}
                    — a charitable narrative layered on top of the
                    impressions above.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span
                    aria-hidden
                    className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-brand-primary"
                  />
                  <span>
                    <strong className="font-semibold text-brand-ink">
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
