"use client";

import { useState } from "react";

type State = "idle" | "submitting" | "done" | "error";

export function PlayerInterestForm({
  playerSlug,
  playerFirstName,
}: {
  playerSlug: string;
  playerFirstName: string;
}) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("submitting");
    setErrorMsg(null);
    try {
      const res = await fetch("/api/notify-interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerSlug, email }),
      });
      if (!res.ok) throw new Error(`${res.status}`);
      setState("done");
    } catch {
      setErrorMsg("Something went wrong — try again in a moment.");
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="rounded-2xl border border-line bg-brand-cream/60 p-6">
        <p className="font-sans text-base text-brand-ink">
          You&apos;re on the list. We&apos;ll reach out the moment {playerFirstName}
          &apos;s gear lands at Tour Pro Shop.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-line bg-brand-cream/60 p-6"
    >
      <p className="eyebrow text-brand-ink/60">Tell us</p>
      <h3 className="mt-2 font-sans text-2xl font-semibold leading-tight tracking-tight text-brand-ink md:text-3xl">
        Let {playerFirstName} know you want his gear.
      </h3>
      <p className="mt-2 max-w-xl text-sm text-brand-ink/70">
        Drop your email and we&apos;ll let you know if {playerFirstName} joins
        the Tour Pro Shop roster.
      </p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <label className="flex-1">
          <span className="sr-only">Email address</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="h-12 w-full rounded-full border border-line bg-brand-cream px-5 text-base placeholder:text-brand-ink/45 focus:border-brand-ink focus:outline-none"
          />
        </label>
        <button
          type="submit"
          disabled={state === "submitting"}
          className="inline-flex h-12 shrink-0 items-center justify-center rounded-full bg-brand-ink px-6 font-sans text-sm font-medium uppercase tracking-wider text-brand-cream transition-colors hover:bg-brand-accent hover:text-brand-ink disabled:opacity-60"
        >
          {state === "submitting" ? "Sending…" : "Notify me"}
        </button>
      </div>
      {errorMsg ? (
        <p className="mt-3 text-sm text-red-700">{errorMsg}</p>
      ) : null}
    </form>
  );
}
