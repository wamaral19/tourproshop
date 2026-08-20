import type { Metadata } from "next";
import Link from "next/link";
import { Fragment } from "react";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers to the questions we get most about Tour Pro Shop — when exclusives go on sale, what they'll cost, what sizes we'll carry, and how you can help.",
};

const CONTACT_EMAIL = "wyatt@tourpro.shop";

/**
 * Answers are plain strings so the same copy feeds both the rendered page and
 * the FAQPage structured data below — write it once, and the two can't drift.
 * Any mention of the contact address is turned into a mailto link at render.
 */
const FAQS: readonly { question: string; answer: string }[] = [
  {
    question: "When will exclusives be available for purchase?",
    answer:
      "We’re currently working with players and their teams to get the products you want. If you have a message you’d like to pass along to your favorite player or their agent, send us an email at " +
      CONTACT_EMAIL +
      " and he’ll pass it along.",
  },
  {
    question: "How much will items cost?",
    answer:
      "Our goal is to deliver fans access to the gear at a reasonable cost. We don’t have pricing finalized yet, but we’d much rather give lots of people access to high quality products than sell a novelty product to a few people.",
  },
  {
    question: "What sizes will you offer?",
    answer:
      "We’ll offer both youth and adult sizing, but final sizes and quantities will be dependent on our wholesale clothing partners. If you’re worried about whether or not we’ll have your size available, always feel free to reach out and you can always lock things in by pre-ordering once available.",
  },
  {
    question: "I love what Tour Pro Shop is doing, how can I help?",
    answer:
      "Send our founder, Wyatt, a note at " +
      CONTACT_EMAIL +
      ". Whether you have feedback, know someone we should talk to, or just want to tell us which player you’d most like to see, we’d love to hear from you. If you introduce us to a player or their team and we end up bringing them on board we have a special gift for you from our team.",
  },
];

/** Splits an answer on the contact address and links every occurrence. */
function Answer({ text }: { text: string }) {
  const parts = text.split(CONTACT_EMAIL);
  return (
    <>
      {parts.map((part, i) => (
        <Fragment key={i}>
          {i > 0 ? (
            <Link
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-medium text-brand-deep underline decoration-brand-deep/30 underline-offset-4 transition hover:decoration-brand-deep"
            >
              {CONTACT_EMAIL}
            </Link>
          ) : null}
          {part}
        </Fragment>
      ))}
    </>
  );
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

export default function FaqPage() {
  return (
    <section className="border-b border-line bg-brand-cream">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <div className="mx-auto max-w-[1400px] px-4 pb-24 pt-20 md:px-8 md:pb-32 md:pt-28">
        <div className="max-w-2xl">
          <p className="eyebrow text-brand-deep">FAQ</p>
          <h1 className="mt-4 font-display text-4xl leading-[1.05] tracking-tight text-brand-ink md:text-6xl lg:text-7xl">
            Questions, answered.
          </h1>

          <dl className="mt-12 border-t border-line">
            {FAQS.map((faq) => (
              <div key={faq.question} className="border-b border-line py-8">
                <dt className="font-display text-2xl leading-tight tracking-tight text-brand-ink md:text-3xl">
                  {faq.question}
                </dt>
                <dd className="mt-4 font-sans text-lg leading-relaxed text-brand-ink/75 md:text-xl">
                  <Answer text={faq.answer} />
                </dd>
              </div>
            ))}
          </dl>

          <p className="mt-10 font-sans text-base text-brand-ink/60">
            Still have a question? Reach us any time at{" "}
            <Link
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-medium text-brand-deep underline decoration-brand-deep/30 underline-offset-4 transition hover:decoration-brand-deep"
            >
              {CONTACT_EMAIL}
            </Link>
            .
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
