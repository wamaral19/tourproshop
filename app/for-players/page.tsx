import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "For Players — Let your fans show their support",
  description:
    "Give fans access to the same sponsor-inclusive apparel you wear in competition. Tour Pro Shop handles everything — no inventory, no logistics, no operational burden.",
  robots: { index: false, follow: false },
};

export default function ForPlayersPage() {
  return (
    <div className="for-players-page">
      {/* HERO */}
      <section className="border-b border-line bg-brand-cream">
        <div className="mx-auto max-w-[1400px] px-4 pb-12 pt-16 md:px-8 md:pb-20 md:pt-24">
          <div className="grid gap-10 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:items-center md:gap-14">
            <div>
              <p className="eyebrow text-brand-deep">For players</p>
              <h1 className="mt-4 font-display text-4xl leading-[1.05] tracking-tight text-brand-ink md:text-5xl">
                Fans already support you. Let them show it.
              </h1>
              <div className="mt-6 space-y-5 font-sans text-lg leading-relaxed text-brand-ink/70 md:text-xl">
                <p>
                  You have fans who watch you compete, follow you weekly, and root for your success. Today they have no way of showing that support.
                </p>
                <p>
                  We want to change that by giving fans access to the same sponsor-inclusive gear they see you wearing in competition.
                </p>
              </div>
            </div>
            <figure className="grid w-full grid-cols-2 gap-4 md:justify-self-end md:max-w-md">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-line bg-white">
                <Image
                  src="/product images/JJ Spaun Polo/JJ Spaun Polo Logo GPT.png"
                  alt="A tournament polo with the player's full sponsor lineup intact"
                  fill
                  sizes="(max-width: 768px) 50vw, 20vw"
                  className="scale-110 object-cover"
                  priority
                />
              </div>
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-line bg-surface-raised">
                <Image
                  src="/product images/Sam Burns Polo/Sam Burns Polo Flatlay GPT.png"
                  alt="Sam Burns's Peter Millar polo with his tour sponsor placements"
                  fill
                  sizes="(max-width: 768px) 50vw, 20vw"
                  className="scale-110 object-contain"
                  priority
                />
              </div>
            </figure>
          </div>
        </div>
      </section>

      {/* WHAT WE NEED / BECOME PART OF MEMORIES */}
      <section className="bg-brand-ink py-20 text-brand-cream md:py-28">
        <div className="mx-auto max-w-[1400px] px-4 md:px-8">
          <div className="grid gap-10 md:grid-cols-2 md:gap-16">
            <div>
              <h2 className="font-display text-3xl leading-tight tracking-tight md:text-4xl">
                What do we need from you?
              </h2>
              <ul className="mt-6 space-y-4 font-sans text-base text-brand-cream/80 md:text-lg">
                <li className="flex gap-3">
                  <span
                    aria-hidden
                    className="mt-[0.6em] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-brand-accent"
                  />
                  <span>
                    <strong className="font-semibold text-brand-cream">
                      Approval.
                    </strong>{" "}
                    That&apos;s it.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span
                    aria-hidden
                    className="mt-[0.6em] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-brand-accent"
                  />
                  <span>No time. No posts. No effort.</span>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="font-display text-3xl leading-tight tracking-tight md:text-4xl">
                Become part of lifelong memories.
              </h2>
              <p className="mt-6 max-w-xl font-sans text-base leading-relaxed text-brand-cream/80 md:text-lg">
                Whether it&apos;s a junior winning their first tournament or
                someone making their first hole-in-one — if someone is wearing
                your shirt for a memorable life moment, they&apos;ll never forget
                it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BUILD YOUR LEGACY */}
      <section className="border-b border-line bg-brand-cream py-20 text-brand-ink md:py-28">
        <div className="mx-auto max-w-[1400px] px-4 md:px-8">
          <h2 className="font-display text-3xl leading-tight tracking-tight md:text-5xl">
            Build your legacy
          </h2>

          <div className="mt-10 grid gap-6 md:grid-cols-2 md:gap-12">
            <div className="rounded-2xl border border-line bg-surface-raised p-6 md:p-8">
              <p className="eyebrow text-brand-deep">Be the first</p>
              <div className="mt-5 space-y-3 font-sans text-base leading-relaxed text-brand-ink/70 md:text-lg">
                <p>Be the first player to have fans show support with sponsors.</p>
                <p>Other sports have jerseys. Golf doesn&apos;t. You can be the first.</p>
                <p>
                  You&apos;re already a fan favorite, but you&apos;ll get even
                  more love once you have supporters wearing your gear at
                  events.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-line bg-surface-raised p-6 md:p-8">
              <p className="eyebrow text-brand-deep">Support the causes you care about</p>
              <div className="mt-5 space-y-3 font-sans text-base leading-relaxed text-brand-ink/70 md:text-lg">
                <p>
                  A portion of every sale is directed to a cause of your
                  choosing, on your behalf.
                </p>
                <p>
                  A charitable narrative layered on top — one both you and your
                  sponsors can share credit for.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INCREASE YOUR VALUE TO SPONSORS */}
      <section className="bg-brand-ink py-20 text-brand-cream md:py-28">
        <div className="mx-auto max-w-[1400px] px-4 md:px-8">
          <div className="grid gap-10 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:items-center md:gap-14">
            <div>
              <p className="eyebrow text-brand-accent">More sponsorship value</p>
              <h2 className="mt-4 font-display text-3xl leading-tight tracking-tight md:text-5xl">
                Increase your value to sponsors.
              </h2>
              <div className="mt-6 space-y-5 font-sans text-base leading-relaxed text-brand-cream/80 md:text-lg">
                <p>
                  We create a new sponsorship asset by offering fans the same
                  sponsor-inclusive apparel you wear in competition.
                </p>
                <p>
                  Tour Pro Shop handles everything, including coordinating with
                  sponsors for approval. No inventory, no logistics, no
                  operational burden. We unlock additional sponsorship value
                  without creating work for you and your team.
                </p>
              </div>
            </div>
            <figure className="grid w-full grid-cols-2 gap-4 md:justify-self-end md:max-w-md">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-line bg-surface-raised">
                <Image
                  src="/product images/Min Woo Lee Track Jacket/Lululemon Track Jacket Logo Flatlay.png"
                  alt="Min Woo Lee's Lululemon pullover with sponsor placements"
                  fill
                  sizes="(max-width: 768px) 50vw, 20vw"
                  className="object-contain"
                />
              </div>
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-line bg-white">
                <Image
                  src="/product images/Keith Mitchell Visor/Spruce/KMCGV-3_3.webp"
                  alt="Keith Mitchell's Imperial tour visor with Mizuno and Cisco marks"
                  fill
                  sizes="(max-width: 768px) 50vw, 20vw"
                  className="object-cover"
                />
              </div>
            </figure>
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
                Across Formula 1, soccer, and cycling, the logos are the uniform. Fans wear what their athletes wear and sponsor brands reap the benefits. We&rsquo;re bringing a proven model to the golf ecosystem.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
