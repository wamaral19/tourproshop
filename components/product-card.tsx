import Link from "next/link";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { ProductImage } from "./product-image";

export function ProductCard({
  product,
  size = "default",
}: {
  product: Product;
  size?: "default" | "feature";
}) {
  const aspect =
    size === "feature"
      ? "aspect-[4/5] md:aspect-[3/4]"
      : "aspect-[4/5]";

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col gap-3"
    >
      <div className={`relative ${aspect} overflow-hidden bg-brand-cream`}>
        <ProductImage
          product={product}
          className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
        {product.badge ? (
          <span className="eyebrow absolute left-3 top-3 rounded-full bg-brand-cream/95 px-2.5 py-1 text-brand-ink">
            {product.badge}
          </span>
        ) : null}
        <div className="absolute inset-x-3 bottom-3 flex items-center justify-between opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="eyebrow rounded-full bg-brand-ink px-3 py-2 text-brand-cream">
            View
          </span>
        </div>
      </div>

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-base leading-tight tracking-tight">
            {product.name}
          </p>
          <p className="eyebrow mt-1 text-brand-ink/60">{product.brand}</p>
        </div>
        <div className="flex flex-col items-end shrink-0">
          <span className="text-base tabular-nums">
            {formatPrice(product.price)}
          </span>
          {product.colorways.length > 1 ? (
            <span className="eyebrow mt-1 text-brand-ink/60">
              {product.colorways.length} colors
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
