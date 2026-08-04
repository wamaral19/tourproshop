"use client";

import { useEffect, useState } from "react";

type State = "idle" | "submitting" | "done" | "error";

/**
 * Email-capture popup shown when a shopper lands on a PDP straight from a paid
 * ad. It only opens when the landing URL carries the ad query param
 * (`?ad=<campaign>`), so organic PDP traffic never sees it — those visitors get
 * the inline <ProductInterestForm> instead. The submit posts to
 * /api/notify-interest with the product/player context plus the `campaign` tag,
 * which makes the Discord alert fire as an "ad-lander signup" so we know the
 * lead came from the ad and which campaign it was.
 *
 * The shopper can dismiss it (X button, Escape, or clicking the backdrop) and
 * keep browsing the PDP normally.
 *
 * Ad destination URL example:
 *   https://tourpro.shop/products/<slug>?ad=ig-polo-launch
 */

/** Query param that flags ad traffic; its value becomes the campaign tag. */
const AD_PARAM = "ad";
const DEFAULT_CAMPAIGN = "instagram-ad";

export function AdLanderModal({
  productSlug,
  productName,
  playerSlug,
  playerFirstName,
}: {
  productSlug: string;
  productName: string;
  playerSlug: string;
  playerFirstName: string;
}) {
  const [campaign, setCampaign] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");

  // Read the ad param on mount only. Using window.location keeps this fully
  // client-side so the PDP stays statically rendered (no useSearchParams
  // Suspense boundary, no forced-dynamic page).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (!params.has(AD_PARAM)) return;
    const value = params.get(AD_PARAM)?.trim();
    // Syncing state from the URL, which is only readable client-side (the page
    // is statically prerendered, so this can't run during render).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCampaign(value && value.length > 0 ? value : DEFAULT_CAMPAIGN);
    setOpen(true);
  }, []);

  // Lock body scroll and wire up Escape-to-close while the popup is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  if (!open || !campaign) return null;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("submitting");
    try {
      const res = await fetch("/api/notify-interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          playerSlug,
          productSlug,
          productName,
          campaign,
        }),
      });
      if (!res.ok) throw new Error(`${res.status}`);
      setState("done");
    } catch {
      setState("error");
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ad-lander-title"
    >
      {/* Backdrop — clicking it dismisses the popup. */}
      <button
        type="button"
        aria-label="Close"
        onClick={() => setOpen(false)}
        className="absolute inset-0 bg-brand-ink/60 backdrop-blur-sm"
      />

      <div className="relative z-10 w-full max-w-md rounded-3xl border border-line bg-brand-cream p-8 shadow-2xl sm:p-10">
        <button
          type="button"
          aria-label="Close"
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-brand-ink/60 transition-colors hover:bg-brand-ink/5 hover:text-brand-ink"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden
          >
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>

        {state === "done" ? (
          <div className="text-center">
            <p className="font-condensed text-xs uppercase tracking-widest text-brand-deep">
              You&apos;re on the list
            </p>
            <h2
              id="ad-lander-title"
              className="font-display mt-3 text-2xl leading-tight sm:text-3xl"
            >
              First in line.
            </h2>
            <p className="mt-3 text-base leading-relaxed text-brand-ink/80">
              We&apos;ll email you the moment {playerFirstName}&apos;s exclusive
              drops. Take a look around while you&apos;re here.
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-brand-ink px-8 font-condensed text-sm uppercase tracking-widest text-brand-cream transition-colors hover:bg-brand-deep"
            >
              Keep browsing
            </button>
          </div>
        ) : (
          <>
            <p className="font-condensed text-xs uppercase tracking-widest text-brand-deep">
              Exclusive drop
            </p>
            <h2
              id="ad-lander-title"
              className="font-display mt-3 text-2xl leading-tight sm:text-3xl"
            >
              Get first access.
            </h2>
            <p className="mt-3 text-base leading-relaxed text-brand-ink/80">
              Drop your email and we&apos;ll let you know the moment{" "}
              {playerFirstName}&apos;s exclusive is live to buy.
            </p>
            <form onSubmit={onSubmit} className="mt-6">
              <label className="block">
                <span className="sr-only">Email address</span>
                <input
                  type="email"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="h-14 w-full rounded-full border border-line bg-brand-cream px-6 text-base placeholder:text-brand-ink/45 focus:border-brand-ink focus:outline-none"
                />
              </label>
              <button
                type="submit"
                disabled={state === "submitting"}
                className="mt-3 flex h-14 w-full items-center justify-center rounded-full bg-brand-primary px-8 font-condensed text-sm uppercase tracking-widest text-brand-cream transition-colors hover:bg-brand-accent disabled:opacity-60"
              >
                {state === "submitting" ? "Sending…" : "Notify me"}
              </button>
              {state === "error" ? (
                <p className="mt-3 text-center text-sm text-brand-flag">
                  Something went wrong — try again in a moment.
                </p>
              ) : null}
            </form>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-4 w-full text-center font-condensed text-xs uppercase tracking-widest text-brand-ink/50 transition-colors hover:text-brand-ink"
            >
              No thanks, just browsing
            </button>
          </>
        )}
      </div>
    </div>
  );
}
