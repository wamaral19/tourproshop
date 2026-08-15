"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { CartDrawer } from "./cart-drawer";
import { LOCKDOWN, LOCKDOWN_CONTACT_EMAIL } from "@/lib/site-mode";

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
 *  the roster — every one of them dark. This keeps the wordmark, the year, and a
 *  way to reach us, and nothing else. */
function LockdownFooter() {
  return (
    <footer className="mt-24 border-t border-line bg-brand-cream">
      <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-4 px-4 py-10 text-xs text-brand-ink/55 md:flex-row md:items-center md:px-8">
        <p>© {new Date().getFullYear()} Tour Pro Shop. All rights reserved.</p>
        <Link
          href={`mailto:${LOCKDOWN_CONTACT_EMAIL}`}
          className="hover:text-brand-deep"
        >
          {LOCKDOWN_CONTACT_EMAIL}
        </Link>
      </div>
    </footer>
  );
}

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Lockdown collapses the shell to the bare wordmark. The nav and footer are
  // the two places that link to the shop, the roster, and TPS Exclusives, so
  // taking them out is what actually removes those pages "from the directory" —
  // proxy.ts stops anyone reaching them by URL.
  if (LOCKDOWN) {
    return (
      <>
        <BareHeader />
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
