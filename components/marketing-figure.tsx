import Image from "next/image";
import type { MarketingImage } from "@/lib/marketing-assets";

/**
 * Two-up figure of sponsor-marked gear, used on the partner pitch pages.
 *
 * The images come from a `lib/marketing-assets` chain that has already dropped
 * any player who's gone dark, so this renders whatever is live. Each asset
 * carries its own fit and panel color, which is what lets one substitute for
 * another without the page caring which it got.
 */
export function MarketingFigure({
  images,
  className,
  sizes = "(max-width: 768px) 50vw, 20vw",
  priority,
}: {
  images: readonly MarketingImage[];
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (images.length === 0) return null;

  return (
    <figure className={className}>
      {images.map((image) => (
        <div
          key={image.src}
          className={`relative aspect-[4/5] overflow-hidden rounded-2xl border border-line ${
            image.panel ?? "bg-white"
          }`}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes={sizes}
            priority={priority}
            className={`${image.fit === "cover" ? "object-cover" : "object-contain"} ${
              image.imageClassName ?? ""
            }`}
          />
        </div>
      ))}
    </figure>
  );
}
