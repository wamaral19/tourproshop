import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getAllProducts,
  getAllProductsIncludingHidden,
  getProductBySlug,
} from "@/lib/catalog";
import { ProductDetail } from "@/components/product-detail";
import { enforceLockdown } from "@/lib/lockdown";

export async function generateStaticParams() {
  // Pre-render hidden PDPs too — they're reachable by direct URL even though
  // they don't appear in any storefront surface yet.
  return getAllProductsIncludingHidden().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Product" };
  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  enforceLockdown();
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = getAllProducts()
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  return <ProductDetail product={product} related={related} />;
}
