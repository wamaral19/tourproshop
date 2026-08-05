"use client";

import { useState } from "react";
import { trackLead } from "@/lib/meta-pixel";

type State = "idle" | "submitting" | "done" | "error";

export function FooterSubscribeForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("submitting");
    try {
      const res = await fetch("/api/notify-interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error(`${res.status}`);
      trackLead({ content_name: "Footer subscribe" });
      setState("done");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <p className="max-w-sm border-b border-line-strong pb-2 text-sm text-brand-ink/80">
        You&apos;re in. We&apos;ll be in touch.
      </p>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex max-w-sm items-center gap-0 border-b border-line-strong pb-2"
    >
      <label className="flex-1">
        <span className="sr-only">Email address</span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Join the field"
          className="w-full bg-transparent py-2 text-base outline-none placeholder:text-brand-ink/45"
        />
      </label>
      <button
        type="submit"
        disabled={state === "submitting"}
        className="font-condensed text-sm uppercase tracking-widest text-brand-deep disabled:opacity-60"
      >
        {state === "submitting" ? "Sending…" : "Subscribe"}
      </button>
      {state === "error" ? (
        <span className="ml-3 text-xs text-red-700">Try again</span>
      ) : null}
    </form>
  );
}
