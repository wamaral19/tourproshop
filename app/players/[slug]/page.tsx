import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { getOwgrPlayer } from "@/lib/owgr";
import { getDisplayFirstName } from "@/lib/players";
import { getPlayerImageUrl } from "@/lib/player-images";
import { hasProductsForPlayer } from "@/lib/catalog";
import { PlayerInterestForm } from "@/components/player-interest-form";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const player = await getOwgrPlayer(slug);
  if (!player) return { title: "Player" };
  return {
    title: player.name,
    description: `Where to find ${player.name}'s on-course look — vendors and a way to tell us you want his gear at Tour Pro Shop.`,
  };
}

export default async function PlayerLandingPage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;
  const player = await getOwgrPlayer(slug);
  if (!player) notFound();

  // If we DO carry their gear, this page shouldn't render — push them to the
  // filtered shop instead.
  if (hasProductsForPlayer(player.slug)) {
    redirect(`/shop?player=${player.slug}`);
  }

  const imageUrl = getPlayerImageUrl(player.slug);
  const firstName = getDisplayFirstName(player);
  const apparel = (player.vendorLinks ?? []).find(
    (v) => v.kind === "apparel",
  );
  const otherVendors = (player.vendorLinks ?? []).filter(
    (v) => v.kind !== "apparel",
  );

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-brand-deep">
        <div className="relative aspect-[16/9] w-full md:aspect-[21/9]">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={player.name}
              fill
              sizes="100vw"
              priority
              className="object-cover object-[center_15%]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-brand-deep to-brand-ink">
              <span className="font-display text-[18vw] leading-none text-brand-cream/85 md:text-[12vw]">
                {player.name
                  .split(" ")
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join("")}
              </span>
            </div>
          )}
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-brand-ink/85 via-brand-ink/15 to-brand-ink/30"
          />
          <div className="absolute inset-x-4 bottom-6 md:inset-x-12 md:bottom-12">
            {player.country || typeof player.owgrRank === "number" ? (
              <p className="font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-brand-cream/70">
                {[
                  player.country,
                  typeof player.owgrRank === "number"
                    ? `OWGR #${player.owgrRank}`
                    : null,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            ) : null}
            <h1 className="font-display mt-3 text-5xl leading-[0.95] tracking-tight text-brand-cream md:text-7xl">
              {player.name}
            </h1>
          </div>
        </div>
      </section>

      {/* BODY */}
      <section className="bg-brand-cream pb-24 pt-12 md:pb-32 md:pt-16">
        <div className="mx-auto grid max-w-[1100px] gap-12 px-4 md:grid-cols-[1.1fr_1fr] md:gap-16 md:px-8">
          <div>
            <Link
              href="/players"
              className="inline-flex font-sans text-sm font-medium text-brand-ink/65 underline underline-offset-4 hover:text-brand-ink"
            >
              ← All players
            </Link>
            {player.bio ? (
              <p className="mt-6 text-lg leading-relaxed text-brand-ink/80 md:text-xl">
                {player.bio}
              </p>
            ) : null}
            {player.signatureWin ? (
              <p className="mt-4 font-sans text-sm text-brand-ink/65">
                Signature win · {player.signatureWin}
              </p>
            ) : null}

            <div className="mt-10">
              <PlayerInterestForm
                playerSlug={player.slug}
                playerFirstName={firstName}
              />
            </div>
          </div>

          <div className="md:pt-12">
            <div className="border-t border-line pt-8 md:border-t-0 md:pt-0">
              <p className="eyebrow text-brand-ink/60">
                Where {firstName} shops
              </p>
              {player.freeAgent ? (
                <p className="mt-3 font-sans text-base text-brand-ink/80">
                  <span className="font-semibold text-brand-ink">
                    Free Agent
                  </span>{" "}
                  — request their sponsor gear below.
                </p>
              ) : apparel ? (
                <>
                  <a
                    href={apparel.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex h-12 items-center rounded-full bg-brand-ink px-6 font-sans text-sm font-medium uppercase tracking-wider text-brand-cream transition-colors hover:bg-brand-accent hover:text-brand-cream"
                  >
                    {apparel.vendor} →
                  </a>
                  {otherVendors.length > 0 ? (
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {otherVendors.map((v) => (
                        <li key={v.url}>
                          <a
                            href={v.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex h-9 items-center rounded-full border border-line px-4 font-condensed text-xs uppercase tracking-widest text-brand-ink/75 hover:border-brand-ink hover:text-brand-ink"
                          >
                            {v.vendor}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </>
              ) : (
                <p className="mt-3 text-sm text-brand-ink/70">
                  We&apos;re still tracking down {firstName}&apos;s apparel
                  sponsor. Tell us below if you want his gear at Tour Pro
                  Shop.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
