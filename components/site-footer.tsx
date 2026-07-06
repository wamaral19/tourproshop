import Link from "next/link";
import { SiteLogo } from "./site-logo";
import { FooterSubscribeForm } from "./footer-subscribe-form";

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Shop",
    links: [
      { label: "All Apparel", href: "/shop" },
      { label: "Polos", href: "/shop?category=polos" },
      { label: "Outerwear", href: "/shop?category=outerwear" },
      { label: "Headwear", href: "/shop?category=headwear" },
    ],
  },
  {
    title: "Inside",
    links: [
      { label: "The Players", href: "/players" },
      { label: "Journal", href: "/journal" },
      { label: "TPS Exclusives", href: "/players?tier=exclusive" },
    ],
  },
  {
    title: "Service",
    links: [
      { label: "Shipping & Returns", href: "#" },
      { label: "Sizing", href: "#" },
      { label: "Contact", href: "/contact" },
      { label: "Account", href: "#" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line bg-brand-cream">
      <div className="mx-auto max-w-[1400px] px-4 py-16 md:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="flex flex-col gap-6">
            <SiteLogo variant="footer" />
            <p className="max-w-sm font-display text-2xl leading-tight text-brand-ink/80">
              Where the game lives.
            </p>
            <FooterSubscribeForm />
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title} className="flex flex-col gap-3">
              <h3 className="eyebrow text-brand-ink/60">{col.title}</h3>
              <ul className="flex flex-col gap-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-brand-ink/85 hover:text-brand-deep"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-line pt-6 text-xs text-brand-ink/55 md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} Tour Pro Shop. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link href="#" className="hover:text-brand-deep">
              Privacy
            </Link>
            <Link href="#" className="hover:text-brand-deep">
              Terms
            </Link>
            <Link href="#" className="hover:text-brand-deep">
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
