import { WaitlistForm } from "@/components/waitlist-form";
import { LOCKDOWN_CONTACT_EMAIL } from "@/lib/site-mode";

/**
 * The only page the storefront serves while `LOCKDOWN` is on. Rendered at `/`
 * and at `/waitlist` (which keeps its own URL so live ad campaigns don't break).
 *
 * Built to read like /waitlist — same hero rhythm, same waitlist form, same dark
 * "what you're joining" band. Nothing here references a player, a product name,
 * or a route that lockdown blocks.
 *
 * It used to carry a showcase rail of garments, link-free and caption-free so it
 * showed the gear without naming whose it was. That rail is gone: this component
 * renders only while `LOCKDOWN` is on, which is exactly when `PHOTOGRAPHY_HIDDEN`
 * is on, so the pitch is made in words. See lib/site-mode.ts.
 */
export function LockdownNotice() {
  return (
    <div className="agents-page">
      {/* HERO */}
      <section className="border-b border-line bg-brand-cream">
        <div className="mx-auto max-w-[1400px] px-4 pb-16 pt-16 md:px-8 md:pb-24 md:pt-24">
          <div className="max-w-2xl">
            <div>
              <p className="eyebrow text-brand-deep">Coming soon</p>
              <h1 className="mt-4 font-display text-4xl leading-[1.05] tracking-tight text-brand-ink md:text-5xl lg:text-6xl">
                Jerseys for golf are here.
                <span className="block text-brand-ink/45">Almost.</span>
              </h1>

              <div className="mt-6 max-w-xl space-y-5 font-sans text-lg leading-relaxed text-brand-ink/70 md:text-xl">
                <p>
                  Tour Pro Shop is giving fans access to the gear they see pros
                  wear inside the ropes, sponsors included. If you&rsquo;re
                  interested in purchasing gear from your favorite players,
                  please sign up for the waitlist below.
                </p>
                <p>
                  If you&rsquo;re a rights holder, please reach out directly to
                  us at{" "}
                  <a
                    href={`mailto:${LOCKDOWN_CONTACT_EMAIL}`}
                    className="font-medium text-brand-deep underline decoration-brand-deep/30 underline-offset-4 transition hover:decoration-brand-deep"
                  >
                    {LOCKDOWN_CONTACT_EMAIL}
                  </a>
                  .
                </p>
              </div>

              <WaitlistForm />
            </div>

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
              to fans — logos and all. Waitlist members are the first to hear
              when a drop goes live.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              {
                title: "Early access",
                body: "First in line when a new collection launches.",
              },
              {
                title: "Sponsor-inclusive",
                body: "The exact looks from the course — down to the sponsor logos.",
              },
              {
                title: "Limited runs",
                body: "Small drops. The list gets the first shot.",
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
