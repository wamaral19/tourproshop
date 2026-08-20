"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { CartDrawer } from "./cart-drawer";
import { FooterSubscribeForm } from "./footer-subscribe-form";
import {
  LOCKDOWN,
  LOCKDOWN_CONTACT_EMAIL,
  PARTNER_LINKS,
} from "@/lib/site-mode";

/** Private, link-only pitch pages under /p/* are bespoke standalone documents:
 *  no storefront header, footer, nav, or cart — just the Tour Pro Shop wordmark
 *  sitting above the content. Everything else gets the full storefront shell. */
function isBareRoute(pathname: string | null): boolean {
  return pathname?.startsWith("/p/") ?? false;
}

function BareHeader() {
  return (
    <header className="border-b border-line bg-brand-cream">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-center px-4 md:h-20 md:px-8">
        <Image
          src="/logo-wordmark.svg"
          alt="Tour Pro Shop"
          width={249}
          height={26}
          priority
          className="h-4 w-auto md:h-5"
        />
      </div>
    </header>
  );
}

/** Lockdown footer. The real footer is three columns of links into the shop and
 *  the roster — every one of them dark. This keeps the pitch: the waitlist
 *  signup, the Partners pages, and a way to reach us. */
function LockdownFooter() {
  return (
    <footer className="mt-24 border-t border-line bg-brand-cream">
      <div className="mx-auto max-w-[1400px] px-4 py-14 md:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.4fr_1fr]">
          <div className="flex flex-col gap-6">
            <p className="max-w-sm font-display text-2xl leading-tight text-brand-ink/80">
              From your favorite tour pro to you.
            </p>
            <FooterSubscribeForm />
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="eyebrow text-brand-ink/60">Partners</h3>
            <ul className="flex flex-col gap-2">
              {PARTNER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-brand-ink/85 hover:text-brand-deep"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/why"
                  className="text-sm text-brand-ink/85 hover:text-brand-deep"
                >
                  Why we exist
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-sm text-brand-ink/85 hover:text-brand-deep"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-line pt-6 text-xs text-brand-ink/55 md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} Tour Pro Shop. All rights reserved.</p>
          <Link
            href={`mailto:${LOCKDOWN_CONTACT_EMAIL}`}
            className="hover:text-brand-deep"
          >
            {LOCKDOWN_CONTACT_EMAIL}
          </Link>
        </div>
      </div>
    </footer>
  );
}

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Lockdown keeps the nav — the Partners pages and /why are still the pitch —
  // but SiteHeader drops Shop, Players and TPS Exclusives from it, and the
  // footer loses its columns of links into the roster and the shop. That is
  // what removes those pages "from the directory"; proxy.ts is what stops
  // anyone reaching them by URL. No cart drawer: nothing is for sale.
  if (LOCKDOWN) {
    return (
      <>
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <LockdownFooter />
      </>
    );
  }

  if (isBareRoute(pathname)) {
    return (
      <>
        <BareHeader />
        <main className="flex-1">{children}</main>
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <CartDrawer />
    </>
  );
}
