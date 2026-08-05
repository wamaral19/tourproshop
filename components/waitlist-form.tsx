"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trackLead } from "@/lib/meta-pixel";

type State = "idle" | "submitting" | "error";

/**
 * Waitlist capture form for /waitlist. Collects only email and an optional
 * first name — every extra field is friction on a cold ad click. On success it
 * routes to /waitlist-confirmed, a unique URL that makes signup tracking easy.
 *
 * An optional `?ad=<campaign>` param on the landing URL is read client-side and
 * forwarded as `campaign`, so paid clicks are tagged in the Discord alert
 * without forcing the page to render dynamically.
 */
export function WaitlistForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
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
          firstName: firstName.trim() || undefined,
          campaign,
        }),
      });
      if (!res.ok) throw new Error(`${res.status}`);
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
