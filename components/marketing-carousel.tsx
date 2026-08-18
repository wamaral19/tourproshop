import Image from "next/image";
import { ProductCarousel } from "./product-carousel";
import {
  resolveAlt,
  resolveCaption,
  type MarketingImage,
} from "@/lib/marketing-assets";
import { neutralSrc } from "@/lib/media";
import { PHOTOGRAPHY_HIDDEN } from "@/lib/site-mode";

/**
 * Carousel of sponsor-marked gear, used on the Partners pitch pages.
 *
 * The images come from a `lib/marketing-assets` chain that has already dropped
 * any player who has gone dark, so this renders whatever is live. Each asset
 * carries its own fit and panel color, which is what lets one substitute for
 * another without the page caring which it got.
 *
 * No slide links anywhere. These pages are pitching the model to partners, not
 * selling a garment, and the PDPs are dark besides.
 */
export function MarketingCarousel({
  images,
  className,
  sizes = "(max-width: 768px) 100vw, 40vw",
  priority,
}: {
  images: readonly MarketingImage[];
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  // Text-only build: the rail is photography end to end, so it comes off.
  if (PHOTOGRAPHY_HIDDEN) return null;
  if (images.length === 0) return null;

  const slides = images.map((image, i) => ({
    caption: resolveCaption(image) ?? undefined,
    node: (
      <div
        className={`absolute inset-0 ${image.panel ?? "bg-white"}`}
      >
        <Image
          src={neutralSrc(image.src)}
          alt={resolveAlt(image)}
          fill
          sizes={sizes}
          priority={priority && i === 0}
          className={`${image.fit === "cover" ? "object-cover" : "object-contain"} ${
            image.imageClassName ?? ""
          }`}
        />
      </div>
    ),
  }));

  return <ProductCarousel slides={slides} className={className} />;
}
