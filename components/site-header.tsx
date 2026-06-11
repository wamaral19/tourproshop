"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart-context";

type NavLink = { href: string; label: string };
type NavGroup = { label: string; children: NavLink[] };
type NavItem = NavLink | NavGroup;

const NAV: NavItem[] = [
  { href: "/shop", label: "Shop" },
  { href: "/players", label: "Players" },
  { href: "/players?tier=exclusive", label: "TPS Exclusives" },
  {
    label: "Partners",
    children: [
      { href: "/agents", label: "Agents" },
      { href: "/sponsors", label: "Sponsors" },
    ],
  },
];

function isNavGroup(item: NavItem): item is NavGroup {
  return "children" in item;
}

function DesktopNavGroup({ item }: { item: NavGroup }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onFocus={() => setOpen(true)}
        onBlur={(e) => {
          if (!e.currentTarget.parentElement?.contains(e.relatedTarget as Node)) {
            setOpen(false);
          }
        }}
        className="flex items-center gap-1 font-condensed text-sm uppercase text-brand-ink/85 transition-colors hover:text-brand-deep"
      >
        {item.label}
        <svg
          viewBox="0 0 24 24"
          aria-hidden
          className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open ? (
        <div
          role="menu"
          className="absolute left-1/2 top-full z-50 min-w-[180px] -translate-x-1/2 pt-3"
        >
          <div className="rounded-md border border-line bg-brand-cream py-2 shadow-md">
            {item.children.map((child) => (
              <Link
                key={child.href}
                href={child.href}
                role="menuitem"
                onClick={() => setOpen(false)}
                className="block px-4 py-2 font-condensed text-sm uppercase text-brand-ink/85 transition-colors hover:bg-brand-ink/5 hover:text-brand-deep"
              >
                {child.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function CartButton({
  onOpen,
  count,
  showCount = true,
}: {
  onOpen: () => void;
  count: number;
  showCount?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={`Bag, ${count} items`}
      onClick={onOpen}
      className="relative flex h-10 items-center gap-1.5 px-2 text-brand-ink/85 transition-colors hover:text-brand-deep"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path
          d="M5 8h14l-1.2 11.1A2 2 0 0 1 15.8 21H8.2a2 2 0 0 1-2-1.9L5 8z"
          strokeLinejoin="round"
        />
        <path d="M9 8a3 3 0 0 1 6 0" strokeLinecap="round" />
      </svg>
      {showCount ? (
        <span className="font-condensed text-sm tabular-nums">({count})</span>
      ) : count > 0 ? (
        <span
          aria-hidden
          className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-brand-deep px-1 font-condensed text-[10px] leading-none text-brand-cream"
        >
          {count}
        </span>
      ) : null}
    </button>
  );
}

function Wordmark({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Tour Pro Shop — home"
      className={`font-wordmark whitespace-nowrap font-bold uppercase leading-none tracking-[0.18em] text-brand-ink ${className ?? ""}`}
    >
      Tour Pro Shop
    </Link>
  );
}

export function SiteHeader() {
  const cart = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-40 bg-brand-cream border-b border-line">
      {/* MOBILE LAYOUT — absolute-centered wordmark, fixed-width side controls */}
      <div className="md:hidden relative h-14">
        <button
          type="button"
          aria-label="Menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
          className="absolute left-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            {mobileOpen ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <>
                <path d="M3 7h18" strokeLinecap="round" />
                <path d="M3 17h18" strokeLinecap="round" />
              </>
            )}
          </svg>
        </button>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Wordmark className="text-[1.1rem] pointer-events-auto" />
        </div>

        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          <CartButton onOpen={cart.open} count={cart.itemCount} showCount={false} />
        </div>
      </div>

      {/* DESKTOP LAYOUT */}
      <div className="hidden md:flex h-20 mx-auto max-w-[1400px] items-center justify-between px-8">
        <Wordmark className="text-[1.5rem]" />

        <nav className="flex items-center gap-8">
          {NAV.map((item) =>
            isNavGroup(item) ? (
              <DesktopNavGroup key={item.label} item={item} />
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="font-condensed text-sm uppercase text-brand-ink/85 transition-colors hover:text-brand-deep"
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Search"
            className="flex h-10 w-10 items-center justify-center text-brand-ink/85 transition-colors hover:text-brand-deep"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="11" cy="11" r="6.5" />
              <path d="M16 16l4 4" strokeLinecap="round" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Account"
            className="flex h-10 w-10 items-center justify-center text-brand-ink/85 transition-colors hover:text-brand-deep"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="12" cy="9" r="3.5" />
              <path d="M5 20c1.5-3.6 4.4-5 7-5s5.5 1.4 7 5" strokeLinecap="round" />
            </svg>
          </button>
          <CartButton onOpen={cart.open} count={cart.itemCount} />
        </div>
      </div>

      {mobileOpen ? (
        <div className="md:hidden border-t border-line">
          <nav className="flex flex-col px-4 py-2">
            {NAV.map((item) =>
              isNavGroup(item) ? (
                <div
                  key={item.label}
                  className="border-b border-line/60 py-3 last:border-b-0"
                >
                  <div className="font-condensed text-xs uppercase tracking-widest text-brand-ink/55">
                    {item.label}
                  </div>
                  <div className="mt-1 flex flex-col">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setMobileOpen(false)}
                        className="font-display text-2xl py-2"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="font-display text-2xl py-3 border-b border-line/60 last:border-b-0"
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
