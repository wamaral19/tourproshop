"use client";

import { useState } from "react";

type Field = {
  key: "unitsSold" | "wearsPerYear" | "lifespan" | "impressionsPerWear";
  label: string;
  hint: string;
};

const FIELDS: Field[] = [
  {
    key: "unitsSold",
    label: "Units sold",
    hint: "Licensed pieces moved through the shop.",
  },
  {
    key: "wearsPerYear",
    label: "Wears per year",
    hint: "Times the average owner puts it on.",
  },
  {
    key: "lifespan",
    label: "Lifespan (years)",
    hint: "How long the piece stays in rotation.",
  },
  {
    key: "impressionsPerWear",
    label: "Impressions per wear",
    hint: "People who see the logo each time it's worn.",
  },
];

const DEFAULTS: Record<Field["key"], string> = {
  unitsSold: "1000",
  wearsPerYear: "25",
  lifespan: "4",
  impressionsPerWear: "250",
};

const DEFAULT_CPM = "10";

function format(n: number) {
  if (!Number.isFinite(n)) return "0";
  return Math.round(n).toLocaleString("en-US");
}

function formatUSD(n: number) {
  if (!Number.isFinite(n)) return "$0";
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export function ImpressionsCalculator({
  tone = "light",
}: {
  /** "dark" adapts the on-background labels/framing for a dark section bg. */
  tone?: "light" | "dark";
}) {
  const [inputs, setInputs] = useState(DEFAULTS);
  const [cpm, setCpm] = useState(DEFAULT_CPM);

  const inputsLabel = tone === "dark" ? "text-brand-accent" : "text-brand-deep";
  const outputPanel =
    tone === "dark" ? "border border-brand-cream/15" : "";

  const nums = {
    unitsSold: Number(inputs.unitsSold) || 0,
    wearsPerYear: Number(inputs.wearsPerYear) || 0,
    lifespan: Number(inputs.lifespan) || 0,
    impressionsPerWear: Number(inputs.impressionsPerWear) || 0,
  };
  const cpmValue = Number(cpm) || 0;

  const wearsPerUnit = nums.unitsSold * nums.wearsPerYear * nums.lifespan;
  const impressions = wearsPerUnit * nums.impressionsPerWear;
  const mediaValue = (impressions / 1000) * cpmValue;

  return (
    <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:gap-12">
      {/* INPUTS */}
      <div className="space-y-5">
        <p className={`eyebrow ${inputsLabel}`}>Inputs</p>
        <div className="space-y-4">
          {FIELDS.map((f) => (
            <label
              key={f.key}
              className="block rounded-2xl border border-line bg-surface-raised p-4 transition-colors focus-within:border-brand-deep"
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-sans text-sm font-semibold text-brand-ink">
                  {f.label}
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={inputs[f.key]}
                  onChange={(e) => {
                    const raw = e.target.value;
                    if (raw === "" || /^\d+$/.test(raw)) {
                      setInputs((v) => ({ ...v, [f.key]: raw }));
                    }
                  }}
                  onBlur={() => {
                    if (inputs[f.key] === "") {
                      setInputs((v) => ({ ...v, [f.key]: "0" }));
                    }
                  }}
                  className="w-28 rounded-md border border-line bg-brand-cream px-3 py-1.5 text-right font-sans text-base font-semibold tabular-nums text-brand-ink outline-none focus:border-brand-deep"
                />
              </div>
              <p className="mt-1 font-sans text-xs text-brand-ink/55">
                {f.hint}
              </p>
            </label>
          ))}

          {/* CPM — a rate input, drives estimated media value */}
          <label className="block rounded-2xl border border-line bg-surface-raised p-4 transition-colors focus-within:border-brand-deep">
            <div className="flex items-center justify-between gap-3">
              <span className="font-sans text-sm font-semibold text-brand-ink">
                CPM
              </span>
              <div className="relative w-28">
                <span
                  aria-hidden
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-sans text-base font-semibold text-brand-ink/55"
                >
                  $
                </span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={cpm}
                  onChange={(e) => {
                    const raw = e.target.value;
                    if (raw === "" || /^\d*\.?\d*$/.test(raw)) {
                      setCpm(raw);
                    }
                  }}
                  onBlur={() => {
                    if (cpm === "" || cpm === ".") setCpm(DEFAULT_CPM);
                  }}
                  className="w-full rounded-md border border-line bg-brand-cream py-1.5 pl-7 pr-3 text-right font-sans text-base font-semibold tabular-nums text-brand-ink outline-none focus:border-brand-deep"
                />
              </div>
            </div>
            <p className="mt-1 font-sans text-xs text-brand-ink/55">
              Cost per 1,000 impressions — converts impressions to media value.
            </p>
          </label>
        </div>
      </div>

      {/* OUTPUTS */}
      <div
        className={`flex flex-col justify-between gap-6 rounded-2xl bg-brand-ink p-6 text-brand-cream md:p-10 ${outputPanel}`}
      >
        <div>
          <p className="eyebrow text-brand-accent">Estimated media value</p>
          <p className="mt-3 font-display text-6xl tabular-nums leading-none tracking-tight text-brand-accent md:text-7xl lg:text-8xl">
            {formatUSD(mediaValue)}
          </p>
          <p className="mt-3 font-sans text-sm text-brand-cream/60">
            Impressions ÷ 1,000 × {formatUSD(cpmValue)} CPM
          </p>
        </div>

        <div className="border-t border-brand-cream/15 pt-6">
          <p className="eyebrow text-brand-accent">Impressions generated</p>
          <p className="mt-3 font-display text-4xl tabular-nums leading-none tracking-tight md:text-5xl lg:text-6xl">
            {format(impressions)}
          </p>
          <p className="mt-3 font-sans text-sm text-brand-cream/60">
            Wears per unit × impressions per wear
          </p>
        </div>

        <div className="border-t border-brand-cream/15 pt-6">
          <p className="eyebrow text-brand-accent">Wears per style</p>
          <p className="mt-2 font-display text-3xl tabular-nums tracking-tight md:text-4xl">
            {format(wearsPerUnit)}
          </p>
          <p className="mt-1 font-sans text-sm text-brand-cream/60">
            Units sold × wears per year × lifespan
          </p>
        </div>
      </div>
    </div>
  );
}
