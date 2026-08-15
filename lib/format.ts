const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

/**
 * Nothing is live yet, so every product price renders as a placeholder.
 * The numbers in `lib/products.ts` are kept intact — flip this to false
 * (and restore the price sort options in `components/shop-experience.tsx`)
 * once real prices are set.
 */
export const PRICES_TBD: boolean = true;

export function formatPrice(value: number) {
  return PRICES_TBD ? "Price TBD" : formatter.format(value);
}
