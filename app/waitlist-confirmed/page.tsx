import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "You're on the list",
  description:
    "You're on the waitlist for sponsor-inclusive Tour looks. We'll be in touch the moment they drop.",
  // Unique confirmation URL is for tracking signups — keep it unindexed.
  robots: { index: false, follow: false },
};

export default function WaitlistConfirmedPage() {
  return (
    <section className="border-b border-line bg-brand-cream">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-[1400px] flex-col justify-center px-4 py-20 md:min-h-[calc(100vh-5rem)] md:px-8 md:py-28">
        <div className="max-w-2xl">
          <p className="eyebrow text-brand-deep">You&apos;re in</p>
          <h1 className="mt-4 font-display text-4xl leading-[1.05] tracking-tight text-brand-ink md:text-6xl lg:text-7xl">
            You&apos;re on the list.
          </h1>
          <p className="mt-6 max-w-xl font-sans text-lg leading-relaxed text-brand-ink/70 md:text-xl">
            You&apos;ll be first to know when the jerseys drop — early access to
            sponsor-inclusive Tour looks, straight to your inbox.
          </p>

          <div className="mt-10">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-full bg-brand-deep px-6 py-3.5 font-sans text-base font-medium text-brand-cream transition hover:bg-brand-ink"
            >
              Browse the shop
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
