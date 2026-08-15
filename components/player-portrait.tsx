import Image from "next/image";
import type { Player } from "@/lib/players";
import { getPlayerImageUrl } from "@/lib/player-images";

/**
 * Renders a player headshot from /public/player images/ when one is found,
 * or falls back to an editorial monogram tile so missing photos still look
 * intentional.
 *
 * Server component — uses fs to resolve the image path at render time.
 */
export function PlayerPortrait({
  player,
  className,
  priority,
  showBadge = true,
}: {
  player: Player;
  className?: string;
  priority?: boolean;
  showBadge?: boolean;
}) {
  const imageUrl = getPlayerImageUrl(player.slug);
  const badge =
    showBadge && player.relationship === "exclusive" ? (
      <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
        <span className="eyebrow rounded-full bg-brand-accent px-2.5 py-1 text-brand-cream">
          TPS Exclusive
        </span>
        <span className="eyebrow rounded-full bg-brand-ink/80 px-2.5 py-1 text-brand-cream">
          Demo
        </span>
      </div>
    ) : null;

  if (imageUrl) {
    return (
      <div
        className={`relative overflow-hidden bg-brand-deep ${className ?? ""}`}
      >
        <Image
          src={imageUrl}
          alt={player.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover object-top"
          priority={priority}
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-brand-ink/60 via-brand-ink/0 to-brand-ink/0"
        />
        {badge}
      </div>
    );
  }

  // Monogram fallback
  const initials = player.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

  return (
    <div
      className={`relative overflow-hidden bg-brand-deep text-brand-cream ${
        className ?? ""
      }`}
    >
      <svg
        viewBox="0 0 400 500"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <defs>
          <linearGradient id={`pg-${player.slug}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#17501d" />
            <stop offset="1" stopColor="#0a0907" />
          </linearGradient>
        </defs>
        <rect width="400" height="500" fill={`url(#pg-${player.slug})`} />
        <g fill="none" stroke="#29612d" strokeWidth="0.5" opacity="0.25">
          {Array.from({ length: 14 }).map((_, i) => (
            <line key={i} x1={0} y1={36 * i} x2={400} y2={36 * i} />
          ))}
        </g>
        <text
          x="200"
          y="295"
          textAnchor="middle"
          fontFamily="var(--font-fraunces), Georgia, serif"
          fontSize="180"
          fontWeight="500"
          fill="#f5f1e9"
          opacity="0.92"
          letterSpacing="0.02em"
        >
          {initials}
        </text>
      </svg>
      {badge}
    </div>
  );
}
