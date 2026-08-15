import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Why",
  description:
    "Why Tour Pro Shop exists — a note from Wyatt, founder, on repping your favorite players and backing the causes they care about.",
};

const CONTACT_EMAIL = "wyatt@tourpro.shop";
const INSTAGRAM_URL = "https://www.instagram.com/tourpro.shop/";

export default function WhyPage() {
  return (
    <section className="border-b border-line bg-brand-cream">
      <div className="mx-auto max-w-[1400px] px-4 pb-24 pt-20 md:px-8 md:pb-32 md:pt-28">
        <div className="max-w-2xl">
          <p className="eyebrow text-brand-deep">Why</p>
          <h1 className="mt-4 font-display text-4xl leading-[1.05] tracking-tight text-brand-ink md:text-6xl lg:text-7xl">
            Why we&apos;re doing this.
          </h1>

          <div className="mt-10 space-y-6 font-sans text-lg leading-relaxed text-brand-ink/75 md:text-xl">
            <p>
              As a junior golfer, I remember wanting to rep my favorite players.
              Nike gave us the chance to do that through the TW collection, but
              for every other player that didn’t exist. I loved Tiger, but I
              also loved Ernie and Rocco and Stricker. There was no way to rep
              them.
            </p>
            <p>
              I was playing early on Masters Sunday and one of the guys was
              talking about how much of a Cam Young fan he is. Sure, he could
              buy a graphic shirt with Cam’s face printed on it, but that’s not
              really the vibe he wanted to give off. I had flashbacks to wanting
              one of Ernie’s SAP shirts as a kid. Almost every player in the top
              100 in the world has some super fans, why not give fans access to
              the gear while contributing to the causes players care about.
            </p>
            <p>
              As of mid-August we don’t have rights yet, but we’re working on
              changing that (including hitting the road which you can see on our{" "}
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-brand-deep underline decoration-brand-deep/30 underline-offset-4 transition hover:decoration-brand-deep"
              >
                IG
              </a>
              ). If you are a player, agent, or sponsor, we’d love to chat and
              you can reach us at{" "}
              <Link
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-medium text-brand-deep underline decoration-brand-deep/30 underline-offset-4 transition hover:decoration-brand-deep"
              >
                {CONTACT_EMAIL}
              </Link>
              .
            </p>
            <p>
              PS: If you came here to tell me “shrink” send me an email and tell
              me why this is such a bad thing. I got hit in the head on the fly
              from 260 out in my mid-am qualifier, maybe that knocked some
              screws loose and you can talk me into shutting this whole thing
              down. Or maybe we can set up a match and connect over the game we
              all love.
            </p>
          </div>

          <p className="mt-10 font-display text-2xl tracking-tight text-brand-ink md:text-3xl">
            — Wyatt, Founder of Tour Pro Shop
          </p>

          <div className="mt-12">
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
    </section>
  );
}
