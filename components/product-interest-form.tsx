"use client";

import { useState } from "react";

type State = "idle" | "submitting" | "done" | "error";

/**
 * PDP email capture for exclusive pieces that aren't live to buy yet. Replaces
 * the "Add to Bag" button. Posts to /api/notify-interest with product + player
 * context so the Discord alert pings us to reach out. Selected size/colorway
 * ride along when the shopper has picked them.
 */
export function ProductInterestForm({
  productSlug,
  productName,
  playerSlug,
  playerFirstName,
  size,
  colorway,
}: {
  productSlug: string;
  productName: string;
  playerSlug: string;
  playerFirstName: string;
  size?: string;
  colorway?: string;
}) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");

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
          size,
          colorway,
        }),
      });
      if (!res.ok) throw new Error(`${res.status}`);
      setState("done");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="mt-8 rounded-2xl border border-line bg-brand-cream/60 p-6">
        <p className="font-condensed text-xs uppercase tracking-widest text-brand-deep">
          You&apos;re on the list
        </p>
        <p className="mt-2 text-base leading-relaxed text-brand-ink">
          We&apos;ll email you the moment {playerFirstName}&apos;s{" "}
          {productName.replace(`${playerFirstName} `, "")} is available to buy.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-8">
      <p className="font-condensed text-xs uppercase tracking-widest text-brand-ink/60">
        Not yet available
      </p>
      <p className="mt-2 text-sm leading-relaxed text-brand-ink/80">
        This exclusive isn&apos;t live to buy yet. Drop your email and we&apos;ll
        reach out the moment it drops.
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <label className="flex-1">
          <span className="sr-only">Email address</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="h-14 w-full rounded-full border border-line bg-brand-cream px-6 text-base placeholder:text-brand-ink/45 focus:border-brand-ink focus:outline-none"
          />
        </label>
        <button
          type="submit"
          disabled={state === "submitting"}
          className="flex h-14 shrink-0 items-center justify-center rounded-full bg-brand-ink px-8 font-condensed text-sm uppercase tracking-widest text-brand-cream transition-colors hover:bg-brand-deep disabled:opacity-60 sm:w-auto"
        >
          {state === "submitting" ? "Sending…" : "Notify me"}
        </button>
      </div>
      {state === "error" ? (
        <p className="mt-2 text-sm text-brand-flag">
          Something went wrong — try again in a moment.
        </p>
      ) : null}
    </form>
  );
}
