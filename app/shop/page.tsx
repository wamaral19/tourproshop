import { Suspense } from "react";
import type { Metadata } from "next";
import { ShopExperience } from "@/components/shop-experience";

export const metadata: Metadata = {
  title: "Shop",
  description: "Heritage golf apparel, gear, and accessories.",
};

export default function ShopPage() {
  return (
    <Suspense fallback={null}>
      <ShopExperience />
    </Suspense>
  );
}
