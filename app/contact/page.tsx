import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Tour Pro Shop. Questions about orders, players, partnerships, or anything else — we're an email away.",
};

const CONTACT_EMAIL = "wyatt@tourpro.shop";

export default function ContactPage() {
  return (
    <section className="border-b border-line bg-brand-cream">
      <div className="mx-auto max-w-[1400px] px-4 pb-24 pt-20 md:px-8 md:pb-32 md:pt-28">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:items-start md:gap-14">
          <div>
            <p className="eyebrow text-brand-deep">Contact</p>
            <h1 className="mt-4 font-sans text-4xl font-semibold leading-[1.05] tracking-tight text-brand-ink md:text-6xl lg:text-7xl">
              Let&apos;s talk.
            </h1>
            <p className="mt-6 max-w-xl font-sans text-lg leading-relaxed text-brand-ink/70 md:text-xl">
              Questions about an order, a player, a partnership, or anything
              else? We read every message and reply personally. Drop us a line
              and we&apos;ll get right back to you.
            </p>

            <div className="mt-10">
              <Link
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-flex items-center gap-2 rounded-full bg-brand-deep px-6 py-3 font-sans text-base font-medium text-brand-cream transition hover:bg-brand-ink"
              >
                Email us
                <span aria-hidden>→</span>
              </Link>
            </div>

            <p className="mt-6 font-sans text-sm text-brand-ink/60">
              Or reach us directly at{" "}
              <Link
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-medium text-brand-deep underline decoration-brand-deep/30 underline-offset-4 transition hover:decoration-brand-deep"
              >
                {CONTACT_EMAIL}
              </Link>
              .
            </p>

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
        </div>
      </div>
    </section>
  );
}
