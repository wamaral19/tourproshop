import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "The Graveyard & the Signals",
  description:
    "The case in pictures: the bootleg, meme, and print-on-demand merch that deserves to die — and the flood of fan demand proving the market for real, sponsor-inclusive player apparel already exists.",
  robots: { index: false, follow: false },
};

type Item = {
  src: string;
  width: number;
  height: number;
  alt: string;
  href?: string;
  label?: string;
};

const GRAVEYARD: Item[] = [
  {
    src: "/graveyard-signals/graveyard/burnsy-bootleg-tee.jpg",
    width: 1000,
    height: 1250,
    alt: "Sam Burns wearing a bootleg vintage-style 'BURNSY' graphic tee in a locker room",
  },
  {
    src: "/graveyard-signals/graveyard/min-woo-lee-let-him-cook.jpg",
    width: 2580,
    height: 1490,
    alt: "A crowd of golf fans wearing red 'Let Him Cook' chef hats",
  },
  {
    src: "/graveyard-signals/graveyard/sinner-carota-boys.jpg",
    width: 1920,
    height: 1080,
    alt: "Jannik Sinner with the Carota Boys superfans in matching orange tracksuits",
  },
  {
    src: "/graveyard-signals/graveyard/hideki-print-on-demand-tee.jpg",
    width: 750,
    height: 1000,
    alt: "A print-on-demand t-shirt with an illustration of a golfer celebrating in a green jacket",
  },
  {
    src: "/graveyard-signals/graveyard/joe-dean-jolene-tee.png",
    width: 1290,
    height: 2796,
    alt: "Golf coverage screenshot describing a fan club printing its own t-shirts for a cult-hero pro",
  },
  {
    src: "/graveyard-signals/graveyard/fonseca-djokovic-scoreboard-hoodie.png",
    width: 1290,
    height: 2796,
    alt: "A fan wearing a one-off hoodie stitched with a match scoreboard",
  },
  {
    src: "/graveyard-signals/graveyard/big-vibes-guy-meme.png",
    width: 1290,
    height: 2796,
    alt: "An Instagram story of a fan in the gallery captioned 'Big vibes guy'",
  },
];

const SIGNALS: Item[] = [
  {
    src: "/graveyard-signals/signals/peter-millar-cam-tour-logo-polo.png",
    width: 1202,
    height: 1240,
    alt: "Peter Millar tweet announcing Cameron Young's Tour Logo Polo is now available",
  },
  {
    src: "/graveyard-signals/signals/we-want-the-mlb-logo.png",
    width: 1202,
    height: 244,
    alt: "Tweet reply: 'This only has the Peter Millar logo in huge font on the back? We want the MLB logo'",
  },
  {
    src: "/graveyard-signals/signals/demand-limited-edition-drop.png",
    width: 1208,
    height: 322,
    alt: "Tweet: 'Just make it a limited edition drop. I can get my people to call your people to make this happen.'",
  },
  {
    src: "/graveyard-signals/signals/demand-mutual-of-omaha-cisco.png",
    width: 1206,
    height: 194,
    alt: "Tweet: 'Where's the version with Mutual of Omaha and Cisco on it?'",
  },
  {
    src: "/graveyard-signals/signals/demand-where-can-i-get-one.png",
    width: 1202,
    height: 1220,
    alt: "A column of tweet replies asking where to buy the product",
  },
  {
    src: "/graveyard-signals/signals/demand-drop-it.png",
    width: 1208,
    height: 788,
    alt: "Tweet replies including 'DROP IT!!!!' and 'I need it'",
  },
  {
    src: "/graveyard-signals/signals/demand-i-need-it.png",
    width: 1202,
    height: 1246,
    alt: "Tweet replies with an 'I NEED IT' reaction and fans describing wearing the polo",
  },
  {
    src: "/graveyard-signals/signals/demand-larger-logos.png",
    width: 1204,
    height: 1208,
    alt: "Tweet replies asking whether the larger sponsor logos are available to non-sponsored fans",
  },
  {
    src: "/graveyard-signals/signals/johnnie-o-gold-mine.png",
    width: 1198,
    height: 1244,
    alt: "Tweet from a brand: 'Found the gold mine at the office' with a table of folded sample tees",
  },
  {
    src: "/graveyard-signals/signals/demand-anything-for-a-polo.png",
    width: 1198,
    height: 1330,
    alt: "Tweet replies including 'I'd do anything for a polo'",
  },
  {
    src: "/graveyard-signals/signals/ncaa-20m-jersey-patches.png",
    width: 1394,
    height: 1316,
    alt: "Newsletter headline: '$20 million college football jersey patches, plus vintage NCAA silliness'",
  },
  {
    src: "/graveyard-signals/signals/ncaa-jersey-patch-deals.png",
    width: 1726,
    height: 1464,
    alt: "Marketing article: 'Notre Dame, Ohio State jersey patch deals mark revenue shift for blue blood programs' showing a SoFi patch",
  },
  {
    src: "/graveyard-signals/signals/boston-fans-wearing-jerseys.jpeg",
    width: 1280,
    height: 853,
    alt: "Boston Bruins fans and kids in team jerseys pressed against the glass as Brad Marchand skates up before a game",
    href: "https://www.masslive.com/patriots/2023/11/boston-athletes-reveal-what-its-like-to-see-fans-wearing-their-jersey-vautour.html",
    label: "Read the story: Boston athletes on what it feels like to see fans wearing their jersey",
  },
  {
    src: "/graveyard-signals/signals/jt-favorite-shirt-of-the-day.jpeg",
    width: 447,
    height: 447,
    alt: "Justin Thomas reposting a young fan wearing a homemade collage shirt of him",
  },
  {
    src: "/graveyard-signals/signals/kids-golfer-caddie-costume.avif",
    width: 966,
    height: 643,
    alt: "Two kids dressed as a tour golfer and a USGA-bibbed caddie on a course",
  },
  {
    src: "/graveyard-signals/signals/toddler-tiger-costume.jpg",
    width: 354,
    height: 471,
    alt: "A toddler in a Sunday-red shirt and cap swinging a club like Tiger Woods",
  },
];

function Gallery({ items, tone }: { items: Item[]; tone: "dark" | "light" }) {
  const cardClass =
    tone === "dark"
      ? "mb-8 break-inside-avoid overflow-hidden rounded-xl border border-white/10 bg-white"
      : "mb-8 break-inside-avoid overflow-hidden rounded-xl border border-line bg-surface-raised";

  return (
    <div className="mt-10 columns-1 gap-5 sm:columns-2 lg:columns-3 [column-fill:balance]">
      {items.map((item) => {
        const image = (
          <Image
            src={item.src}
            alt={item.alt}
            width={item.width}
            height={item.height}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="h-auto w-full"
          />
        );

        if (item.href) {
          return (
            <a
              key={item.src}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`group block ${cardClass} transition-shadow hover:shadow-md`}
            >
              {image}
              <div className="flex items-center justify-between gap-3 border-t border-line bg-surface-raised px-4 py-3">
                <span className="font-sans text-sm font-medium leading-snug text-brand-deep underline decoration-brand-deep/30 underline-offset-4 group-hover:decoration-brand-deep">
                  {item.label}
                </span>
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden
                  className="h-4 w-4 shrink-0 text-brand-deep transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                >
                  <path d="M7 17L17 7M17 7H9M17 7v8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </a>
          );
        }

        return (
          <div key={item.src} className={cardClass}>
            {image}
          </div>
        );
      })}
    </div>
  );
}

export default function GraveyardSignalsPage() {
  return (
    <div className="graveyard-signals-page">
      {/* HERO */}
      <section className="border-b border-line bg-brand-cream">
        <div className="mx-auto max-w-[1400px] px-4 pb-12 pt-16 md:px-8 md:pb-16 md:pt-24">
          <p className="eyebrow text-brand-deep">The case, in pictures</p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl leading-[1.05] tracking-tight text-brand-ink md:text-6xl">
            The Graveyard &amp; the Signals
          </h1>
          <div className="mt-6 grid gap-6 md:grid-cols-2 md:gap-14">
            <p className="font-sans text-lg leading-relaxed text-brand-ink/70 md:text-xl">
              <strong className="font-semibold text-brand-ink">The Graveyard</strong>{" "}
              is the merch that deserves to die: bootleg tees, meme hats, and
              print-on-demand junk. It&rsquo;s what fans are stuck with for now.
            </p>
            <p className="font-sans text-lg leading-relaxed text-brand-ink/70 md:text-xl">
              <strong className="font-semibold text-brand-ink">The Signals</strong>{" "}
              are the proof that consumers want the real deal. Some of the asks are explicit, others show that there&rsquo;s enough demand to take whatever product they can get their hands on.
            </p>
          </div>
        </div>
      </section>

      {/* GRAVEYARD */}
      <section className="bg-brand-ink py-20 text-brand-cream md:py-28">
        <div className="mx-auto max-w-[1400px] px-4 md:px-8">
          <p className="eyebrow text-brand-flag">The Graveyard</p>
          <h2 className="mt-4 max-w-2xl font-display text-3xl leading-tight tracking-tight md:text-5xl">
            Merch that deserves to die.
          </h2>
          <Gallery items={GRAVEYARD} tone="dark" />
        </div>
      </section>

      {/* SIGNALS */}
      <section className="bg-brand-cream py-20 text-brand-ink md:py-28">
        <div className="mx-auto max-w-[1400px] px-4 md:px-8">
          <p className="eyebrow text-brand-deep">The Signals</p>
          <h2 className="mt-4 max-w-2xl font-display text-3xl leading-tight tracking-tight md:text-5xl">
            The market is already shouting.
          </h2>
          <Gallery items={SIGNALS} tone="light" />
        </div>
      </section>

      {/* CLOSING */}
      <section className="border-t border-line bg-brand-ink py-20 text-brand-cream md:py-24">
        <div className="mx-auto max-w-[1400px] px-4 md:px-8">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <h2 className="max-w-2xl font-display text-3xl leading-tight tracking-tight md:text-5xl">
              We turn the signal into the real thing.
            </h2>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/for-players"
                className="inline-flex items-center rounded-full bg-brand-cream px-6 py-3 font-condensed text-sm uppercase text-brand-ink transition-colors hover:bg-white"
              >
                For Players
              </Link>
              <Link
                href="/shop"
                className="inline-flex items-center rounded-full border border-brand-cream/30 px-6 py-3 font-condensed text-sm uppercase text-brand-cream transition-colors hover:border-brand-cream"
              >
                Shop the real thing
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
