"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { CartDrawer } from "./cart-drawer";

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
        <span className="font-wordmark whitespace-nowrap text-[1.25rem] font-bold uppercase leading-none tracking-[0.18em] text-brand-ink md:text-[1.5rem]">
          Tour Pro Shop
        </span>
      </div>
    </header>
  );
}

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

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
