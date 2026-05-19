"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/format";
import { ProductImage } from "./product-image";

export function CartDrawer() {
  const cart = useCart();

  useEffect(() => {
    document.body.style.overflow = cart.isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [cart.isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") cart.close();
    };
    if (cart.isOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cart.isOpen, cart.close]);

  return (
    <div
      aria-hidden={!cart.isOpen}
      className={`fixed inset-0 z-50 transition ${
        cart.isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      <button
        type="button"
        aria-label="Close cart"
        onClick={cart.close}
        className={`absolute inset-0 bg-brand-ink/40 transition-opacity duration-300 ${
          cart.isOpen ? "opacity-100" : "opacity-0"
        }`}
      />
      <aside
        role="dialog"
        aria-label="Bag"
        aria-modal="true"
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-brand-cream shadow-2xl transition-transform duration-300 ease-out ${
          cart.isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-display text-xl">
            Your Bag
            <span className="ml-2 align-middle text-sm tabular-nums text-brand-ink/60">
              ({cart.itemCount})
            </span>
          </h2>
          <button
            type="button"
            onClick={cart.close}
            aria-label="Close bag"
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-brand-ink/5"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        {cart.lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <p className="font-display text-3xl leading-tight">
              Your bag is empty.
            </p>
            <p className="text-sm text-brand-ink/60">
              Pick a player. Get their look.
            </p>
            <Link
              href="/shop"
              onClick={cart.close}
              className="mt-4 inline-flex h-12 items-center justify-center rounded-full bg-brand-ink px-6 font-condensed text-sm uppercase tracking-widest text-brand-cream hover:bg-brand-deep"
            >
              Shop the Field
            </Link>
          </div>
        ) : (
          <ul className="flex-1 overflow-y-auto divide-y divide-line">
            {cart.lines.map((line) => (
              <li key={line.id} className="flex gap-4 px-5 py-4">
                <Link
                  href={`/products/${line.product.slug}`}
                  onClick={cart.close}
                  className="block aspect-[4/5] w-20 shrink-0 overflow-hidden bg-brand-cream"
                >
                  <ProductImage
                    product={line.product}
                    className="h-full w-full"
                  />
                </Link>
                <div className="flex flex-1 flex-col gap-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link
                        href={`/products/${line.product.slug}`}
                        onClick={cart.close}
                        className="text-sm leading-tight"
                      >
                        {line.product.name}
                      </Link>
                      <p className="eyebrow mt-1 text-brand-ink/60">
                        {line.colorway} · {line.size}
                      </p>
                    </div>
                    <span className="text-sm tabular-nums">
                      {formatPrice(line.product.price * line.quantity)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center rounded-full border border-line">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() =>
                          cart.updateQuantity(line.id, line.quantity - 1)
                        }
                        className="flex h-8 w-8 items-center justify-center"
                      >
                        −
                      </button>
                      <span className="min-w-[1.5rem] text-center text-sm tabular-nums">
                        {line.quantity}
                      </span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() =>
                          cart.updateQuantity(line.id, line.quantity + 1)
                        }
                        className="flex h-8 w-8 items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => cart.removeLine(line.id)}
                      className="text-xs uppercase tracking-widest text-brand-ink/55 hover:text-brand-flag"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {cart.lines.length > 0 ? (
          <footer className="border-t border-line px-5 py-5">
            <div className="flex items-center justify-between text-sm">
              <span className="eyebrow text-brand-ink/60">Subtotal</span>
              <span className="font-display text-xl tabular-nums">
                {formatPrice(cart.subtotal)}
              </span>
            </div>
            <p className="mt-1 text-xs text-brand-ink/55">
              Shipping and taxes calculated at checkout.
            </p>
            <button
              type="button"
              className="mt-4 flex h-12 w-full items-center justify-center rounded-full bg-brand-ink font-condensed text-sm uppercase tracking-widest text-brand-cream hover:bg-brand-deep"
              disabled
              title="Shopify checkout coming soon"
            >
              Checkout · Coming Soon
            </button>
            <button
              type="button"
              onClick={cart.close}
              className="mt-2 flex h-10 w-full items-center justify-center rounded-full border border-line text-sm hover:bg-brand-ink/5"
            >
              Keep Shopping
            </button>
          </footer>
        ) : null}
      </aside>
    </div>
  );
}
