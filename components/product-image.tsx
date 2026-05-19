import Image from "next/image";
import type { Product, ProductImage as ProductImageData } from "@/lib/products";

/**
 * Renders a product image. When the product has real photography (any image
 * whose `src` doesn't live under `/placeholders/`), we render that file via
 * `next/image`. Otherwise we fall back to an inline editorial SVG so PLP/PDP
 * layouts can be designed without waiting on photography.
 *
 * Pass `image` to render a specific shot (e.g. the i-th slide in a gallery
 * rail); omit it to use the product's lead image.
 */
export function ProductImage({
  product,
  image,
  className,
  priority,
  sizes,
}: {
  product: Product;
  image?: ProductImageData;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  const target = image ?? product.images[0];
  const isReal = target && !target.src.startsWith("/placeholders/");
  // `align` is a gallery-only hint — only honor it when an explicit image
  // is being rendered (PDP carousel). Lead-image thumbnails (product cards)
  // always center so a top-anchored flatlay doesn't crop awkwardly on tiles.
  const isGalleryContext = Boolean(image);

  if (isReal) {
    const isContain = target.fit === "contain";
    const fitClass = isContain ? "object-contain" : "object-cover";
    const alignClass =
      isContain && isGalleryContext && target.align === "top"
        ? "object-top"
        : "object-center";
    // Contained images don't fill the frame — the wrapper bg shows through as
    // top/bottom bands. Per-image `bgColor` lets a flatlay match its own
    // backdrop; otherwise contained defaults to white and cover to brand-cream.
    const fallbackBg = isContain ? "bg-white" : "bg-brand-cream";
    const useInlineBg = isContain && Boolean(target.bgColor);
    return (
      <div
        className={`relative overflow-hidden ${useInlineBg ? "" : fallbackBg} ${className ?? ""}`}
        style={useInlineBg ? { backgroundColor: target.bgColor } : undefined}
      >
        <Image
          src={target.src}
          alt={target.alt}
          fill
          sizes={sizes ?? "(max-width: 768px) 88vw, 50vw"}
          priority={priority}
          className={`${fitClass} ${alignClass}`}
        />
      </div>
    );
  }

  const colorway = product.colorways[0]?.hex ?? "#f4f1ea";
  const accent = product.colorways[1]?.hex ?? "#30682b";
  const monogram = product.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 3)
    .join("")
    .toUpperCase();

  return (
    <div
      className={`relative overflow-hidden bg-[var(--c)] ${className ?? ""}`}
      style={
        {
          ["--c" as never]: colorway,
        } as React.CSSProperties
      }
      data-priority={priority ? "true" : undefined}
      aria-label={product.name}
    >
      <svg
        viewBox="0 0 400 500"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id={`g-${product.id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={colorway} stopOpacity="1" />
            <stop offset="1" stopColor={accent} stopOpacity="0.18" />
          </linearGradient>
          <radialGradient id={`r-${product.id}`} cx="0.7" cy="0.2" r="0.9">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.45" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="400" height="500" fill={`url(#g-${product.id})`} />
        <rect width="400" height="500" fill={`url(#r-${product.id})`} />
        <g
          fill="none"
          stroke={accent}
          strokeWidth="0.75"
          opacity="0.18"
        >
          <circle cx="200" cy="260" r="120" />
          <circle cx="200" cy="260" r="80" />
          <circle cx="200" cy="260" r="40" />
        </g>
        <text
          x="200"
          y="275"
          textAnchor="middle"
          fontFamily="var(--font-fraunces), Georgia, serif"
          fontSize="64"
          fontWeight="500"
          fill={accent}
          opacity="0.55"
          letterSpacing="0.04em"
        >
          {monogram}
        </text>
      </svg>
    </div>
  );
}
