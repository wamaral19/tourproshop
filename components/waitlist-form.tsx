"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fbTrack, trackLead } from "@/lib/meta-pixel";
import { type AgeGroup } from "@/lib/cart-context";
import { type ProductSize, YOUTH_AGE_RANGE } from "@/lib/products";

type State = "idle" | "submitting" | "error";

/** Generic shirt size runs for the waitlist. There's no single product behind
 *  this form, so we mirror the polo runs the PDP uses: adult S–XXL, youth
 *  XS–L with age ranges shown under each letter. */
const ADULT_SIZES: ProductSize[] = ["S", "M", "L", "XL", "XXL"];
const YOUTH_SIZES: ProductSize[] = ["XS", "S", "M", "L"];

/**
 * Waitlist capture form for /waitlist. Collects email, an optional first name,
 * and the shirt size the signup wants — captured with the same age-group
 * toggle + letter-size grid the PDP uses, so Discord alerts tell us youth vs.
 * adult and the exact size. On success it routes to /waitlist-confirmed, a
 * unique URL that makes signup tracking easy.
 *
 * An optional `?ad=<campaign>` param on the landing URL is read client-side and
 * forwarded as `campaign`, so paid clicks are tagged in the Discord alert
 * without forcing the page to render dynamically.
 */
export function WaitlistForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  /** Default Adult — the more common case, so the picker is one tap for most. */
  const [ageGroup, setAgeGroup] = useState<AgeGroup>("adult");
  const [size, setSize] = useState<ProductSize | undefined>(undefined);
  const [state, setState] = useState<State>("idle");

  const activeSizes = ageGroup === "youth" ? YOUTH_SIZES : ADULT_SIZES;

  // Switching age group invalidates any selected size — Adult M and Youth M are
  // different cuts, so a stale letter would misreport the request.
  function selectAgeGroup(next: AgeGroup) {
    setAgeGroup(next);
    setSize(undefined);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("submitting");
    try {
      const campaign =
        new URLSearchParams(window.location.search).get("ad")?.trim() ||
        undefined;
      const res = await fetch("/api/notify-interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intent: "waitlist",
          email,
          firstName: firstName.trim() || undefined,
          sizeClass: ageGroup,
          size,
          campaign,
        }),
      });
      if (!res.ok) throw new Error(`${res.status}`);
      // Email is saved at this point (res.ok). Fire the conversion events
      // exactly once here — after the success guard, before we navigate away.
      // No-op if the pixel isn't loaded (typeof window.fbq !== "function").
      fbTrack("CompleteRegistration");
      trackLead({ content_name: "Waitlist", campaign });
      router.push("/waitlist-confirmed");
    } catch {
      setState("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-10 max-w-md">
      <div className="flex flex-col gap-4">
        <label className="block">
          <span className="sr-only">Email address</span>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="w-full rounded-full border border-line-strong bg-brand-cream px-6 py-3.5 font-sans text-base text-brand-ink outline-none transition placeholder:text-brand-ink/45 focus:border-brand-deep"
          />
        </label>
        <label className="block">
          <span className="sr-only">Name (optional)</span>
          <input
            type="text"
            autoComplete="given-name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Name (optional)"
            className="w-full rounded-full border border-line-strong bg-brand-cream px-6 py-3.5 font-sans text-base text-brand-ink outline-none transition placeholder:text-brand-ink/45 focus:border-brand-deep"
          />
        </label>

        {/* Shirt size — same picker as the PDP: age-group toggle + size grid. */}
        <fieldset className="block">
          <legend className="mb-3 font-sans text-sm text-brand-ink/70">
            Shirt size
          </legend>

          {/* Age group toggle — sliding selection pill. */}
          <div
            role="radiogroup"
            aria-label="Size group"
            className="relative inline-flex h-11 w-full max-w-[280px] items-center rounded-full border border-line bg-brand-cream p-1"
          >
            <span
              aria-hidden
              className={`absolute top-1 bottom-1 w-[calc(50%-0.25rem)] rounded-full bg-brand-ink transition-transform duration-300 ease-out ${
                ageGroup === "adult"
                  ? "translate-x-[calc(100%+0.25rem)]"
                  : "translate-x-0"
              }`}
            />
            <button
              type="button"
              role="radio"
              aria-checked={ageGroup === "youth"}
              onClick={() => selectAgeGroup("youth")}
              className={`relative z-10 flex-1 font-condensed text-xs uppercase tracking-widest transition-colors ${
                ageGroup === "youth" ? "text-brand-cream" : "text-brand-ink/70"
              }`}
            >
              Youth
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={ageGroup === "adult"}
              onClick={() => selectAgeGroup("adult")}
              className={`relative z-10 flex-1 font-condensed text-xs uppercase tracking-widest transition-colors ${
                ageGroup === "adult" ? "text-brand-cream" : "text-brand-ink/70"
              }`}
            >
              Adult
            </button>
          </div>

          {/* Size grid. */}
          <div
            className={`mt-3 grid gap-2 ${
              activeSizes.length >= 5 ? "grid-cols-5" : "grid-cols-4"
            }`}
          >
            {activeSizes.map((s) => {
              const ageRange =
                ageGroup === "youth" ? YOUTH_AGE_RANGE[s] : undefined;
              return (
                <button
                  key={s}
                  type="button"
                  aria-pressed={size === s}
                  onClick={() => setSize(s)}
                  className={`flex h-14 flex-col items-center justify-center border font-condensed text-sm uppercase tracking-widest leading-none transition-colors ${
                    size === s
                      ? "border-brand-ink bg-brand-ink text-brand-cream"
                      : "border-line hover:border-brand-ink"
                  }`}
                >
                  <span>{s}</span>
                  {ageRange ? (
                    <span className="mt-1 text-[10px] tracking-wider opacity-80">
                      {ageRange}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </fieldset>

        <button
          type="submit"
          disabled={state === "submitting"}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-deep px-6 py-3.5 font-sans text-base font-medium text-brand-cream transition hover:bg-brand-ink disabled:opacity-60"
        >
          {state === "submitting" ? "Joining…" : "Join the Waitlist"}
        </button>
      </div>
      {state === "error" ? (
        <p className="mt-3 font-sans text-sm text-red-700">
          Something went wrong. Please try again.
        </p>
      ) : null}
    </form>
  );
}
