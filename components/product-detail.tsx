"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { type AgeGroup } from "@/lib/cart-context";
import { formatPrice } from "@/lib/format";
import { ProductImage } from "./product-image";
import { ProductCard } from "./product-card";
import { ImageHotspots } from "./image-hotspots";
import { ProductInterestForm } from "./product-interest-form";
import type { Product, ProductSize } from "@/lib/products";
import { YOUTH_AGE_RANGE } from "@/lib/products";
import { getSponsorsByPlayer } from "@/lib/sponsors";
import { getPlayerBySlug, getDisplayFirstName } from "@/lib/players";

export function ProductDetail({
  product,
  related,
}: {
  product: Product;
  related: Product[];
}) {
  const player = getPlayerBySlug(product.playerSlug);
  const playerFirstName = getDisplayFirstName(
    player ?? { slug: product.playerSlug, name: product.name },
  );
  const [colorway, setColorway] = useState(product.colorways[0]?.name ?? "");
  /** Default Adult. Toggle only renders when the product carries a youth run. */
  const [ageGroup, setAgeGroup] = useState<AgeGroup>("adult");
  const hasYouthSizes = (product.youthSizes?.length ?? 0) > 0;
  const activeSizes =
    ageGroup === "youth" && product.youthSizes
      ? product.youthSizes
      : product.sizes;
  const [size, setSize] = useState<ProductSize | undefined>(
    activeSizes.length === 1 ? activeSizes[0] : undefined,
  );
  const sponsors = getSponsorsByPlayer(product.playerSlug);

  // Switching age group invalidates any selected size (Adult M and Youth M are
  // different cuts). Re-auto-select only when the new run has exactly one
  // option. activeSizes is derived from ageGroup + product, so depending on
  // the primitive is enough and avoids re-running on every render.
  useEffect(() => {
    setSize(activeSizes.length === 1 ? activeSizes[0] : undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ageGroup, product.id]);

  // Filter images by selected colorway. Images without a `colorway` tag are
  // shared across all colorways; images with one only show when their tag
  // matches. If a colorway has no tagged images at all, fall back to showing
  // everything so we never render an empty gallery.
  const galleryImages = useMemo(() => {
    const matching = product.images.filter(
      (img) => !img.colorway || img.colorway === colorway,
    );
    const resolved = matching.length > 0 ? matching : product.images;
    return resolved.length > 0 ? resolved : [undefined];
  }, [product.images, colorway]);

  const galleryRef = useRef<HTMLDivElement>(null);
  const [activeImage, setActiveImage] = useState(0);

  const scrollToImage = useCallback((index: number) => {
    const el = galleryRef.current;
    if (!el) return;
    const slide = el.children[index] as HTMLElement | undefined;
    if (!slide) return;
    el.scrollTo({ left: slide.offsetLeft - el.offsetLeft, behavior: "smooth" });
  }, []);

  // Snap back to the first slide whenever the gallery changes (e.g., colorway
  // switch). Instant jump — the user just picked a new color and expects to
  // see it immediately.
  useEffect(() => {
    const el = galleryRef.current;
    if (!el) return;
    el.scrollTo({ left: 0, behavior: "auto" });
    setActiveImage(0);
  }, [colorway]);

  useEffect(() => {
    const el = galleryRef.current;
    if (!el) return;
    const onScroll = () => {
      const tileWidth = (el.firstElementChild as HTMLElement | null)
        ?.offsetWidth;
      if (!tileWidth) return;
      const idx = Math.round(el.scrollLeft / tileWidth);
      setActiveImage(Math.min(galleryImages.length - 1, Math.max(0, idx)));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [galleryImages.length]);

  return (
    <article className="bg-brand-cream pb-24">
      {/* Demo banner — sits directly below the site header on every PDP. */}
      <div className="bg-brand-deep px-4 py-2.5 text-center">
        <p className="font-condensed uppercase tracking-[0.18em] text-sm text-white">
          For demo purposes only — exclusives coming soon
        </p>
      </div>

      {/* Breadcrumb */}
      <div className="mx-auto max-w-[1400px] px-4 pt-6 md:px-8 md:pt-10">
        <nav
          aria-label="Breadcrumb"
          className="font-condensed text-xs uppercase tracking-widest text-brand-ink/60"
        >
          <Link href="/shop" className="hover:text-brand-deep">
            Shop
          </Link>
          <span className="mx-2">/</span>
          <span className="text-brand-ink">{product.name}</span>
        </nav>
      </div>

      {/* Main */}
      <div className="mx-auto mt-6 grid max-w-[1400px] grid-cols-1 gap-10 px-4 md:grid-cols-12 md:gap-12 md:px-8">
        {/* Gallery — single horizontal scroll rail across all viewports.
            Mobile peeks the next slide; desktop snaps one image at a time. */}
        <div className="md:col-span-6 lg:col-span-6">
          <div className="relative">
            <div
              ref={galleryRef}
              className="scroll-rail flex gap-3 overflow-x-auto"
            >
              {galleryImages.map((img, i) => (
                <div
                  key={img?.src ?? i}
                  className="scroll-snap-center relative aspect-[4/5] w-[88vw] shrink-0 md:w-full"
                >
                  <ProductImage
                    product={product}
                    image={img}
                    priority={i === 0}
                    sizes="(max-width: 768px) 88vw, 50vw"
                    className="absolute inset-0 h-full w-full"
                  />
                  {img?.hotspots && img.hotspots.length > 0 ? (
                    <ImageHotspots
                      hotspots={img.hotspots}
                      sponsors={sponsors}
                    />
                  ) : null}
                </div>
              ))}
            </div>

            {galleryImages.length > 1 ? (
              <>
                <button
                  type="button"
                  aria-label="Previous image"
                  onClick={() =>
                    scrollToImage(Math.max(0, activeImage - 1))
                  }
                  disabled={activeImage === 0}
                  className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-brand-cream/95 text-brand-ink shadow-md transition-opacity hover:bg-brand-cream disabled:opacity-0 md:h-12 md:w-12"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    aria-hidden
                  >
                    <path d="M15 6l-6 6 6 6" strokeLinecap="round" />
                  </svg>
                </button>
                <button
                  type="button"
                  aria-label="Next image"
                  onClick={() =>
                    scrollToImage(
                      Math.min(galleryImages.length - 1, activeImage + 1),
                    )
                  }
                  disabled={activeImage === galleryImages.length - 1}
                  className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-brand-cream/95 text-brand-ink shadow-md transition-opacity hover:bg-brand-cream disabled:opacity-0 md:h-12 md:w-12"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    aria-hidden
                  >
                    <path d="M9 6l6 6-6 6" strokeLinecap="round" />
                  </svg>
                </button>
              </>
            ) : null}
          </div>

          {galleryImages.length > 1 ? (
            <div className="mt-4 flex items-center justify-center gap-1.5">
              {galleryImages.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Go to image ${i + 1}`}
                  onClick={() => scrollToImage(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === activeImage
                      ? "w-6 bg-brand-ink"
                      : "w-1.5 bg-brand-ink/30"
                  }`}
                />
              ))}
            </div>
          ) : null}
        </div>

        {/* Info */}
        <aside className="md:col-span-6 md:sticky md:top-24 md:h-fit lg:col-span-6">
          <p className="eyebrow text-brand-ink/60">{product.brand}</p>
          <h1 className="font-display mt-3 text-3xl leading-tight md:text-5xl">
            {product.name}
          </h1>
          <p className="mt-3 text-lg tabular-nums">
            {formatPrice(product.price)}
          </p>
          <p className="mt-5 text-base leading-relaxed text-brand-ink/80">
            {product.description}
          </p>

          {/* Colorways */}
          {product.colorways.length > 1 ? (
            <div className="mt-8">
              <div className="flex items-center justify-between">
                <span className="eyebrow text-brand-ink/60">Color</span>
                <span className="text-sm">{colorway}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.colorways.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    aria-label={c.name}
                    onClick={() => setColorway(c.name)}
                    className={`relative h-10 w-10 rounded-full border-2 transition-transform ${
                      colorway === c.name
                        ? "border-brand-ink scale-110"
                        : "border-line hover:scale-105"
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>
          ) : null}

          {/* Age group toggle — only when the product carries a youth run. */}
          {hasYouthSizes ? (
            <div className="mt-8">
              <div
                role="radiogroup"
                aria-label="Size group"
                className="relative inline-flex h-11 w-full max-w-[280px] items-center rounded-full border border-line bg-brand-cream p-1"
              >
                {/* Sliding selection pill — animates between the two halves. */}
                <span
                  aria-hidden
                  className={`absolute top-1 bottom-1 w-[calc(50%-0.25rem)] rounded-full bg-brand-ink transition-transform duration-300 ease-out ${
                    ageGroup === "adult" ? "translate-x-[calc(100%+0.25rem)]" : "translate-x-0"
                  }`}
                />
                <button
                  type="button"
                  role="radio"
                  aria-checked={ageGroup === "youth"}
                  onClick={() => setAgeGroup("youth")}
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
                  onClick={() => setAgeGroup("adult")}
                  className={`relative z-10 flex-1 font-condensed text-xs uppercase tracking-widest transition-colors ${
                    ageGroup === "adult" ? "text-brand-cream" : "text-brand-ink/70"
                  }`}
                >
                  Adult
                </button>
              </div>
            </div>
          ) : null}

          {/* Sizes */}
          {activeSizes.length > 1 ? (
            <div className={hasYouthSizes ? "mt-5" : "mt-8"}>
              <div className="flex items-center justify-between">
                <span className="eyebrow text-brand-ink/60">Size</span>
                <button
                  type="button"
                  className="font-condensed text-xs uppercase tracking-widest text-brand-ink/60 underline underline-offset-4 hover:text-brand-ink"
                >
                  Sizing guide
                </button>
              </div>
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
            </div>
          ) : null}

          {/* Not live to buy yet — capture interest instead of Add to Bag. */}
          <ProductInterestForm
            productSlug={product.slug}
            productName={product.name}
            playerSlug={product.playerSlug}
            playerFirstName={playerFirstName}
            size={size}
            colorway={product.colorways.length > 1 ? colorway : undefined}
          />

          {/* Details */}
          <details className="mt-10 border-t border-line py-5">
            <summary className="flex cursor-pointer items-center justify-between font-condensed text-sm uppercase tracking-widest">
              Details &amp; fit
              <span className="text-lg">+</span>
            </summary>
            <ul className="mt-4 space-y-2 text-sm leading-relaxed text-brand-ink/80">
              {product.details.map((d) => (
                <li key={d} className="flex gap-3">
                  <span aria-hidden className="text-brand-deep">
                    ·
                  </span>
                  {d}
                </li>
              ))}
            </ul>
          </details>
          {sponsors.length > 0 ? (
            <details className="border-t border-line py-5">
              <summary className="flex cursor-pointer items-center justify-between font-condensed text-sm uppercase tracking-widest">
                About the sponsors
                <span className="text-lg">+</span>
              </summary>
              <ul className="mt-4 space-y-5 text-sm leading-relaxed text-brand-ink/80">
                {sponsors.map((s) => (
                  <li key={s.name}>
                    <p className="font-condensed text-xs uppercase tracking-widest text-brand-deep">
                      {s.name}
                    </p>
                    <p className="mt-1.5">{s.blurb}</p>
                  </li>
                ))}
              </ul>
            </details>
          ) : null}
          <details className="border-t border-line py-5">
            <summary className="flex cursor-pointer items-center justify-between font-condensed text-sm uppercase tracking-widest">
              Giving back
              <span className="text-lg">+</span>
            </summary>
            <p className="mt-4 text-sm leading-relaxed text-brand-ink/80">
              To be updated. A portion of proceeds from every purchase is
              donated to charitable organizations selected by the player.
            </p>
          </details>
          <details className="border-t border-line py-5">
            <summary className="flex cursor-pointer items-center justify-between font-condensed text-sm uppercase tracking-widest">
              Shipping &amp; returns
              <span className="text-lg">+</span>
            </summary>
            <p className="mt-4 text-sm leading-relaxed text-brand-ink/80">
              Every purchase ships free. Free returns within 30 days for
              unworn, unused items.
            </p>
          </details>
        </aside>
      </div>

      {/* Related */}
      {related.length > 0 ? (
        <section className="mt-24 border-t border-line">
          <div className="mx-auto max-w-[1400px] px-4 py-16 md:px-8 md:py-24">
            <p className="eyebrow text-brand-ink/60">More like this</p>
            <h2 className="font-display mt-3 text-3xl leading-tight md:text-5xl">
              You may also like.
            </h2>
            <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </article>
  );
}
