import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "A private pitch for JJ Spaun",
  description:
    "A confidential proposal from Tour Pro Shop, prepared for JJ Spaun.",
  // Link-only: keep this out of search engines and crawler indexes.
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

export default function JJSpaunPitchPage() {
  return (
    <div className="jjspaun-page">
      {/* HERO */}
      <section className="border-b border-line bg-brand-cream">
        <div className="mx-auto max-w-[1200px] px-4 pb-6 pt-6 md:px-8 md:pb-8 md:pt-8">
          <div className="grid gap-6 md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] md:items-center md:gap-10">
            <div>
              <h1 className="font-sans text-2xl font-semibold leading-[1.1] tracking-tight text-brand-ink md:text-3xl">
                Fans already support you. Let them show it.
              </h1>
              <div className="mt-4 space-y-3 font-sans text-sm leading-relaxed text-brand-ink/70 md:text-base">
                <p>
                  Today, there are kids out there practicing lag putts imagining they're you standing over a 64-footer to win the U.S. Open. In their head they need two putts to win, but they're hoping it only takes one.
                </p>
                <p>
                  They're your fans, but they have no way of showing it today. We want to give them the chance to make their support visible and make the imaginary moments more real by giving fans access to the same sponsor-inclusive gear they see you wearing in competition.
                </p>
              </div>
            </div>
            <figure className="grid w-full grid-cols-2 gap-8 md:ml-6 md:max-w-[24rem] md:justify-self-start">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-line bg-white">
                <Image
                  src="/product images/JJ Spaun Polo/JJ Spaun Polo Logo GPT.png"
                  alt="JJ Spaun's Puma tournament polo with sponsor logos"
                  fill
                  sizes="(max-width: 768px) 50vw, 192px"
                  className="scale-110 object-cover"
                  priority
                />
              </div>
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-line bg-white">
                <Image
                  src="/product images/JJ Spaun Polo/JJ Spaun White Polo GPT.png"
                  alt="JJ Spaun's white Puma tournament polo with sponsor logos"
                  fill
                  sizes="(max-width: 768px) 50vw, 192px"
                  className="object-cover p-[0.5px] md:p-[1px]"
                  priority
                />
              </div>
            </figure>
          </div>
        </div>
      </section>

      {/* BUILD YOUR LEGACY */}
      <section className="bg-brand-ink py-6 text-brand-cream md:py-8">
        <div className="mx-auto max-w-[1200px] px-4 md:px-8">
          <h2 className="font-sans text-xl font-semibold leading-tight tracking-tight md:text-2xl">
            Build your legacy
          </h2>

          <div className="mt-5 grid gap-6 md:grid-cols-2 md:gap-12">
            <div className="rounded-2xl border border-brand-cream/15 p-5 md:p-6">
              <p className="eyebrow text-brand-accent">Be the first</p>
              <div className="mt-4 space-y-3 font-sans text-sm leading-relaxed text-brand-cream/80 md:text-base">
                <p>Be the first player to have fans show support with sponsors.</p>
                <p>Other sports have jerseys. Golf doesn&apos;t. You can be the first.</p>
                <p>
                  You&apos;re already a fan favorite, but you&apos;ll get even
                  more support once you have supporters wearing your gear at
                  events.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-brand-cream/15 p-5 md:p-6">
              <p className="eyebrow text-brand-accent">Support the causes you care about</p>
              <div className="mt-4 space-y-3 font-sans text-sm leading-relaxed text-brand-cream/80 md:text-base">
                <p>
                  A portion of every sale will be directed to Breakthrough T1D
                  on your behalf.
                </p>
                <div className="mx-auto w-fit rounded-xl bg-white px-5 py-3">
                  <div className="relative h-[3.75rem] w-[16.5rem]">
                    <Image
                      src="/product images/JJ Spaun Polo/Breakthrough_T1D_logo.svg.webp"
                      alt="Breakthrough T1D (formerly JDRF)"
                      fill
                      sizes="264px"
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT WE NEED / GIVE BACK SPLIT */}
      <section className="border-b border-line bg-brand-cream py-6 md:py-8">
        <div className="mx-auto max-w-[1200px] px-4 md:px-8">
          <div className="grid gap-6 md:grid-cols-2 md:gap-12">
            <div>
              <h2 className="font-sans text-xl font-semibold leading-tight tracking-tight text-brand-ink md:text-2xl">
                What do we need from you?
              </h2>
              <ul className="mt-5 space-y-3 font-sans text-sm text-brand-ink/75 md:text-base">
                <li className="flex gap-2.5">
                  <span
                    aria-hidden
                    className="mt-[0.5em] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-brand-ink/40"
                  />
                  <span>
                    <strong className="font-semibold text-brand-ink">
                      Approval.
                    </strong>{" "}
                    That&apos;s it.
                  </span>
                </li>
                <li className="flex gap-2.5">
                  <span
                    aria-hidden
                    className="mt-[0.5em] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-brand-ink/40"
                  />
                  <span>No time. No posts. No effort.</span>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="font-sans text-xl font-semibold leading-tight tracking-tight text-brand-ink md:text-2xl">
                Become part of lifelong memories.
              </h2>
              <p className="mt-4 max-w-md font-sans text-sm leading-relaxed text-brand-ink/70 md:text-base">
                Whether it&apos;s a junior winning their first tournament or
                someone making their first hole-in-one - if someone is wearing
                your shirt for a memorable life moment they&apos;ll never forget
                it.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
