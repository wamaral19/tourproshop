"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  categories,
  categoryLabels,
  getAllProducts,
  getBrands,
  hasProductsForPlayer,
  type CatalogProductCategory,
} from "@/lib/catalog";
import { PLAYERS_SNAPSHOT } from "@/lib/players";
import { PRICES_TBD } from "@/lib/format";
import { ProductCard } from "./product-card";

type SortKey = "featured" | "price-asc" | "price-desc" | "newest";

const SORT_LABELS: Record<SortKey, string> = {
  featured: "Featured",
  newest: "Newest",
  "price-asc": "Price · Low to High",
  "price-desc": "Price · High to Low",
};

// Sorting by price is meaningless while every price renders as "TBD".
const SORT_OPTIONS = (Object.keys(SORT_LABELS) as SortKey[]).filter(
  (k) => !(PRICES_TBD && k.startsWith("price-")),
);

// Player filter options — only players that actually have product entries.
const PLAYER_OPTIONS = (() => {
  const products = getAllProducts();
  const slugs = new Set(products.map((p) => p.playerSlug));
  return PLAYERS_SNAPSHOT.filter((p) => slugs.has(p.slug)).map((p) => ({
    slug: p.slug,
    name: p.name,
  }));
})();

export function ShopExperience() {
  const params = useSearchParams();
  const router = useRouter();

  const category = (params.get("category") ?? "all") as
    | CatalogProductCategory
    | "all";
  const player = params.get("player") ?? "all";
  const brand = params.get("brand") ?? "all";

  const [sort, setSort] = useState<SortKey>("featured");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value === "all") next.delete(key);
    else next.set(key, value);
    const qs = next.toString();
    router.replace(qs ? `/shop?${qs}` : "/shop", { scroll: false });
  };

  const setCategory = (v: CatalogProductCategory | "all") =>
    updateParam("category", v);
  const setPlayer = (v: string) => updateParam("player", v);
  const setBrand = (v: string) => updateParam("brand", v);

  // If someone landed here filtered to a player we don't carry, hand them off
  // to that player's landing page instead of dropping an empty grid on them.
  useEffect(() => {
    if (player !== "all" && !hasProductsForPlayer(player)) {
      router.replace(`/players/${player}`);
    }
  }, [player, router]);

  const filtered = useMemo(() => {
    const products = getAllProducts();
    let list = products.slice();
    if (category !== "all") list = list.filter((p) => p.category === category);
    if (player !== "all") list = list.filter((p) => p.playerSlug === player);
    if (brand !== "all") list = list.filter((p) => p.brand === brand);
    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        list.sort(
          (a, b) =>
            (a.badge === "New" ? 0 : 1) - (b.badge === "New" ? 0 : 1),
        );
        break;
      default:
        list.sort(
          (a, b) =>
            (a.featured ? 0 : 1) - (b.featured ? 0 : 1) ||
            a.name.localeCompare(b.name),
        );
    }
    return list;
  }, [category, player, brand, sort]);

  const playerName =
    player !== "all"
      ? PLAYER_OPTIONS.find((p) => p.slug === player)?.name
      : undefined;

  const heading = playerName
    ? category !== "all"
      ? `${playerName} · ${categoryLabels[category]}`
      : playerName
    : category !== "all"
      ? categoryLabels[category]
      : "All Apparel";

  const resetAll = () => {
    router.replace("/shop", { scroll: false });
    setSort("featured");
  };
  const activeFilterCount =
    (category !== "all" ? 1 : 0) +
    (player !== "all" ? 1 : 0) +
    (brand !== "all" ? 1 : 0);
  const anyFilterActive = activeFilterCount > 0;

  return (
    <>
      {/* HEADER */}
      <section className="border-b border-line bg-brand-cream">
        <div className="mx-auto max-w-[1400px] px-4 pb-6 pt-12 md:px-8 md:pb-10 md:pt-16">
          <p className="eyebrow text-brand-ink/60">Shop</p>
          <h1 className="font-display mt-3 text-4xl leading-[0.95] md:text-6xl">
            {heading}.
          </h1>
          <p className="mt-3 text-sm text-brand-ink/65">
            {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}
          </p>
        </div>
      </section>

      {/* FILTERS — collapsed by default. The bar stays compact so products
          are reachable in one scroll; Player / Brand / Type expand on toggle. */}
      <div className="sticky top-16 z-30 border-b border-line bg-brand-cream/95 backdrop-blur-md md:top-20">
        <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-4 py-3 md:px-8">
          <button
            type="button"
            onClick={() => setFiltersOpen((v) => !v)}
            aria-expanded={filtersOpen}
            aria-controls="shop-filters-panel"
            className="inline-flex h-10 items-center gap-2 rounded-full border border-line px-4 font-condensed text-sm uppercase tracking-widest hover:bg-brand-ink hover:text-brand-cream"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden
            >
              <path d="M4 7h16M7 12h10M10 17h4" strokeLinecap="round" />
            </svg>
            Filters
            {activeFilterCount > 0 ? (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-ink px-1.5 text-[10px] font-semibold text-brand-cream">
                {activeFilterCount}
              </span>
            ) : null}
          </button>

          {anyFilterActive ? (
            <button
              type="button"
              onClick={resetAll}
              className="font-condensed text-xs uppercase tracking-widest text-brand-ink/60 underline underline-offset-4 hover:text-brand-ink"
            >
              Reset
            </button>
          ) : null}

          <label className="ml-auto flex items-center gap-2">
            <span className="eyebrow hidden text-brand-ink/60 sm:inline">
              Sort
            </span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="h-9 rounded-full border border-line bg-transparent pl-3 pr-8 font-condensed text-xs uppercase tracking-widest"
            >
              {SORT_OPTIONS.map((k) => (
                <option key={k} value={k}>
                  {SORT_LABELS[k]}
                </option>
              ))}
            </select>
          </label>
        </div>

        {filtersOpen ? (
          <div
            id="shop-filters-panel"
            className="border-t border-line"
          >
            <div className="mx-auto flex max-w-[1400px] flex-col gap-6 px-4 py-6 md:px-8 md:py-8">
              <FilterRow
                legend="Player"
                activeValue={player}
                onSelect={setPlayer}
                options={[
                  { value: "all", label: "All" },
                  ...PLAYER_OPTIONS.map((p) => ({
                    value: p.slug,
                    label: p.name,
                  })),
                ]}
              />
              <FilterRow
                legend="Brand"
                activeValue={brand}
                onSelect={setBrand}
                options={[
                  { value: "all", label: "All" },
                  ...getBrands().map((b) => ({ value: b, label: b })),
                ]}
              />
              <FilterRow
                legend="Type"
                activeValue={category}
                onSelect={(v) =>
                  setCategory(v as CatalogProductCategory | "all")
                }
                options={[
                  { value: "all", label: "All" },
                  ...categories.map((c) => ({
                    value: c,
                    label: categoryLabels[c],
                  })),
                ]}
              />
            </div>
          </div>
        ) : null}
      </div>

      {/* GRID */}
      <section className="bg-brand-cream pb-24 pt-8 md:pb-32 md:pt-12">
        <div className="mx-auto max-w-[1400px] px-4 md:px-8">
          {filtered.length === 0 ? (
            <p className="py-20 text-center text-base text-brand-ink/60">
              Nothing in stock for those filters yet.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 md:gap-y-14 lg:grid-cols-4">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function FilterRow({
  legend,
  options,
  activeValue,
  onSelect,
}: {
  legend: string;
  options: { value: string; label: string }[];
  activeValue: string;
  onSelect: (value: string) => void;
}) {
  return (
    <fieldset>
      <legend className="eyebrow text-brand-ink/60">{legend}</legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((opt) => {
          const isActive = activeValue === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onSelect(opt.value)}
              className={`shrink-0 rounded-full border px-3 py-1.5 font-condensed text-xs uppercase tracking-widest transition-colors ${
                isActive
                  ? "border-brand-ink bg-brand-ink text-brand-cream"
                  : "border-line text-brand-ink/75 hover:border-brand-ink"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
