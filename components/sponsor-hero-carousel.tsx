import { ImageHotspots } from "./image-hotspots";
import { ProductCarousel } from "./product-carousel";
import { ProductImage } from "./product-image";
import type { SponsorHero } from "@/lib/marketing-assets";
import { getProductAlt, getProductLabel } from "@/lib/product-labels";
import { LOCKDOWN } from "@/lib/site-mode";
import type { Sponsor } from "@/lib/sponsors";

export type SponsorHeroSlide = SponsorHero & { sponsors: Sponsor[] };

/**
 * The Partners hero: a carousel of tour garments with their sponsor marks
 * called out. The whole pitch on /agents, /apparel and /sponsors is how much
 * sponsor real estate a tour shirt carries, and several garments make that case
 * better than one.
 *
 * While `LOCKDOWN` is on the callouts come off and the rail is bare
 * photography. Naming each sponsor mark on a named player's garment is the
 * loudest thing these pages do, and it is the same exposure the rest of the
 * takedown is about — so it goes dark with everything else and returns with the
 * storefront. The garments still carry their visible sponsor logos in the
 * photography; what's removed is us annotating and naming them.
 *
 * With callouts on, each slide keeps its own hotspots, but only the active
 * slide's overlay is mounted — so moving between slides closes any open sponsor
 * popover instead of leaving one hanging over the wrong garment.
 *
 * The slides don't link out. These pages pitch the model to partners rather
 * than selling a piece, and the PDPs are dark while the site is locked down.
 */
export function SponsorHeroCarousel({
  heroes,
  className,
}: {
  heroes: SponsorHeroSlide[];
  className?: string;
}) {
  if (heroes.length === 0) return null;

  // Not merely hidden: with callouts off, ImageHotspots never renders, so the
  // sponsor list is never serialized into the payload either.
  const showCallouts = !LOCKDOWN;

  const slides = heroes.map(({ product, image, sponsors }, i) => ({
    caption: getProductLabel(product),
    node: (
      <ProductImage
        product={product}
        image={image}
        alt={getProductAlt(product, image.alt)}
        sizes="(max-width: 768px) 100vw, 40vw"
        className="absolute inset-0 h-full w-full"
        priority={i === 0}
      />
    ),
    overlay:
      showCallouts && image.hotspots && image.hotspots.length > 0 ? (
        <ImageHotspots hotspots={image.hotspots} sponsors={sponsors} />
      ) : undefined,
  }));

  return (
    <ProductCarousel
      slides={slides}
      className={className}
      // The note instructs a tap, so it only makes sense when there's something
      // to tap.
      note={showCallouts ? "Tap a callout to see each sponsor" : undefined}
      // Slower than the waitlist rail when the slides are meant to be poked at;
      // bare photography can move at the waitlist rail's pace.
      intervalMs={showCallouts ? 6000 : 1500}
    />
  );
}
