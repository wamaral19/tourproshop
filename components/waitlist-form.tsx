"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fbTrack, trackLead } from "@/lib/meta-pixel";

type State = "idle" | "submitting" | "error";

const FIELD_CLASS =
  "w-full rounded-full border border-line-strong bg-brand-cream px-6 py-3.5 font-sans text-base text-brand-ink outline-none transition placeholder:text-brand-ink/45 focus:border-brand-deep";

/**
 * Waitlist capture form for /waitlist and the lockdown notice. Collects email,
 * name, and the player whose gear the signup wants — all three required. On
 * success it routes to /waitlist-confirmed, a unique URL that makes signup
 * tracking easy.
 *
 * Favorite player is deliberately free text rather than a roster picker: it is
 * demand signal, and the useful answers are the ones we don't carry yet (and,
 * while the site is dark, we can't show a roster to pick from anyway).
 *
 * An optional `?ad=<campaign>` param on the landing URL is read client-side and
 * forwarded as `campaign`, so paid clicks are tagged in the Discord alert
 * without forcing the page to render dynamically.
 */
export function WaitlistForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [favoritePlayer, setFavoritePlayer] = useState("");
  const [state, setState] = useState<State>("idle");

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
          firstName: name.trim(),
          favoritePlayer: favoritePlayer.trim(),
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
            className={FIELD_CLASS}
          />
        </label>
        <label className="block">
          <span className="sr-only">Name</span>
          <input
            type="text"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className={FIELD_CLASS}
          />
        </label>
        <label className="block">
          <span className="sr-only">Favorite player</span>
          <input
            type="text"
            required
            // Off on purpose: no browser autofill category matches, and
            // guessing one would suggest the wrong saved value.
            autoComplete="off"
            value={favoritePlayer}
            onChange={(e) => setFavoritePlayer(e.target.value)}
            placeholder="Favorite player"
            className={FIELD_CLASS}
          />
        </label>

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
