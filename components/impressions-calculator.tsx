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

const DEFAULTS = {
  unitsSold: 1000,
  wearsPerYear: 20,
  lifespan: 4,
  impressionsPerWear: 250,
};

function format(n: number) {
  if (!Number.isFinite(n)) return "0";
  return Math.round(n).toLocaleString("en-US");
}

export function ImpressionsCalculator() {
  const [values, setValues] = useState(DEFAULTS);

  const wearsPerUnit =
    values.unitsSold * values.wearsPerYear * values.lifespan;
  const impressions = wearsPerUnit * values.impressionsPerWear;

  return (
    <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:gap-12">
      {/* INPUTS */}
      <div className="space-y-5">
        <p className="eyebrow text-brand-deep">Inputs</p>
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
                  type="number"
                  inputMode="numeric"
                  min={0}
                  value={values[f.key]}
                  onChange={(e) => {
                    const n = Number(e.target.value);
                    setValues((v) => ({
                      ...v,
                      [f.key]: Number.isFinite(n) && n >= 0 ? n : 0,
                    }));
                  }}
                  className="w-28 rounded-md border border-line bg-brand-cream px-3 py-1.5 text-right font-sans text-base font-semibold tabular-nums text-brand-ink outline-none focus:border-brand-deep"
                />
              </div>
              <p className="mt-1 font-sans text-xs text-brand-ink/55">
                {f.hint}
              </p>
            </label>
          ))}
        </div>
      </div>

      {/* OUTPUTS */}
      <div className="flex flex-col justify-between gap-6 rounded-2xl bg-brand-ink p-6 text-brand-cream md:p-10">
        <div>
          <p className="eyebrow text-brand-accent">Wears per unit</p>
          <p className="mt-2 font-sans text-3xl font-semibold tabular-nums tracking-tight md:text-4xl">
            {format(wearsPerUnit)}
          </p>
          <p className="mt-1 font-sans text-sm text-brand-cream/60">
            Units sold × wears per year × lifespan
          </p>
        </div>

        <div className="border-t border-brand-cream/15 pt-6">
          <p className="eyebrow text-brand-accent">Impressions generated</p>
          <p className="mt-3 font-sans text-6xl font-semibold tabular-nums leading-none tracking-tight md:text-7xl lg:text-8xl">
            {format(impressions)}
          </p>
          <p className="mt-3 font-sans text-sm text-brand-cream/60">
            Wears per unit × impressions per wear
          </p>
        </div>
      </div>
    </div>
  );
}
