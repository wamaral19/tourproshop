"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product, ProductSize } from "./products";

/** Which size run a line was added against. Defaults to "adult" everywhere
 *  except headwear (which is sizeless anyway). Tracked on the line so a
 *  Youth M and an Adult M stay distinct carts rows. */
export type AgeGroup = "adult" | "youth";

export type CartLine = {
  id: string;
  product: Product;
  size: ProductSize;
  colorway: string;
  ageGroup: AgeGroup;
  quantity: number;
};

type CartState = {
  lines: CartLine[];
  isOpen: boolean;
  itemCount: number;
  subtotal: number;
  open: () => void;
  close: () => void;
  addLine: (input: {
    product: Product;
    size: ProductSize;
    colorway: string;
    ageGroup?: AgeGroup;
    quantity?: number;
  }) => void;
  removeLine: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
};

const CartContext = createContext<CartState | null>(null);

const lineKey = (
  productId: string,
  size: string,
  colorway: string,
  ageGroup: AgeGroup,
) => `${productId}::${ageGroup}::${size}::${colorway}`;

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const addLine = useCallback(
    ({
      product,
      size,
      colorway,
      ageGroup = "adult",
      quantity = 1,
    }: {
      product: Product;
      size: ProductSize;
      colorway: string;
      ageGroup?: AgeGroup;
      quantity?: number;
    }) => {
      setLines((prev) => {
        const id = lineKey(product.id, size, colorway, ageGroup);
        const existing = prev.find((l) => l.id === id);
        if (existing) {
          return prev.map((l) =>
            l.id === id ? { ...l, quantity: l.quantity + quantity } : l,
          );
        }
        return [
          ...prev,
          { id, product, size, colorway, ageGroup, quantity },
        ];
      });
      setIsOpen(true);
    },
    [],
  );

  const removeLine = useCallback((lineId: string) => {
    setLines((prev) => prev.filter((l) => l.id !== lineId));
  }, []);

  const updateQuantity = useCallback((lineId: string, quantity: number) => {
    setLines((prev) =>
      quantity <= 0
        ? prev.filter((l) => l.id !== lineId)
        : prev.map((l) => (l.id === lineId ? { ...l, quantity } : l)),
    );
  }, []);

  const value = useMemo<CartState>(() => {
    const itemCount = lines.reduce((acc, l) => acc + l.quantity, 0);
    const subtotal = lines.reduce(
      (acc, l) => acc + l.product.price * l.quantity,
      0,
    );
    return {
      lines,
      isOpen,
      itemCount,
      subtotal,
      open,
      close,
      addLine,
      removeLine,
      updateQuantity,
    };
  }, [lines, isOpen, open, close, addLine, removeLine, updateQuantity]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
