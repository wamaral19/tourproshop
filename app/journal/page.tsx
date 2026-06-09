import type { Metadata } from "next";
import Link from "next/link";
import { FooterSubscribeForm } from "@/components/footer-subscribe-form";

export const metadata: Metadata = {
  title: "Journal — Coming soon",
  description:
    "Stories from the players, brands, and moments behind Tour Pro Shop. Launching soon.",
};

export default function JournalComingSoonPage() {
  return (
    <section className="border-b border-line bg-brand-cream">
      <div className="mx-auto max-w-[1400px] px-4 pb-24 pt-20 md:px-8 md:pb-32 md:pt-28">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:items-start md:gap-14">
          <div>
            <p className="eyebrow text-brand-deep">The Journal</p>
            <h1 className="mt-4 font-sans text-4xl font-semibold leading-[1.05] tracking-tight text-brand-ink md:text-6xl lg:text-7xl">
              Coming soon.
            </h1>
            <p className="mt-6 max-w-xl font-sans text-lg leading-relaxed text-brand-ink/70 md:text-xl">
              Stories from the players, brands, and moments behind Tour Pro
              Shop — the people on the bag, the partners on the sleeve, and the
              causes the proceeds support. Drop your email and we&apos;ll send
              the first issue when it lands.
            </p>

            <div className="mt-10 max-w-md">
              <FooterSubscribeForm />
            </div>

            <div className="mt-10">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 font-sans text-sm font-medium text-brand-deep underline decoration-brand-deep/30 underline-offset-4 transition hover:decoration-brand-deep"
              >
                <span aria-hidden>←</span>
                Back to the shop
              </Link>
            </div>
          </div>

          <aside className="rounded-2xl border border-line bg-surface-raised p-8 md:p-10">
            <p className="eyebrow text-brand-deep">What to expect</p>
            <ul className="mt-5 space-y-4 font-sans text-base text-brand-ink/80">
              <li className="flex gap-3">
                <span
                  aria-hidden
                  className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-brand-primary"
                />
                <span>
                  <strong className="font-semibold text-brand-ink">
                    Player profiles
                  </strong>{" "}
                  — the story behind each look on tour.
                </span>
              </li>
              <li className="flex gap-3">
                <span
                  aria-hidden
                  className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-brand-primary"
                />
                <span>
                  <strong className="font-semibold text-brand-ink">
                    Sponsor spotlights
                  </strong>{" "}
                  — the brands on the sleeve and why they back the game.
                </span>
              </li>
              <li className="flex gap-3">
                <span
                  aria-hidden
                  className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-brand-primary"
                />
                <span>
                  <strong className="font-semibold text-brand-ink">
                    Cause updates
                  </strong>{" "}
                  — where licensing dollars land and the work they support.
                </span>
              </li>
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
}
