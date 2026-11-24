import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { CatalogBrowser } from "@/components/catalog/catalog-browser";
import { CatalogGridSkeleton } from "@/components/catalog/product-skeleton";
import { getCatalogProducts } from "@/lib/server/catalog-service";

export const metadata: Metadata = {
  title: "Full Motorcycle Accessories Catalog",
  description:
    "Filter and browse CR7 motorcycle LED headlights, CNC brake levers, frame sliders, phone mounts, and waterproof relay kits. Buy directly on Shopee or TikTok Shop.",
};

export default async function ProductsCatalogPage() {
  const products = await getCatalogProducts();

  return (
    <div className="mx-auto w-full max-w-[1320px] px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-5">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/" />}>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Catalog</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page Heading */}
      <div className="mb-8 space-y-2 border-b border-border pb-6">
        <p className="font-mono text-xs font-semibold uppercase tracking-wider text-primary">
          Official Product Index
        </p>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Motorcycle Parts &amp; Accessories Catalog
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Filter by category, bike model, or marketplace availability. Select
          any product to compare technical specifications and jump straight to
          our verified Shopee or TikTok Shop checkout page.
        </p>
      </div>

      {/* Interactive Filterable Catalog (Wrapped in Suspense for Next.js 16 Cache Components) */}
      <Suspense fallback={<CatalogGridSkeleton count={6} />}>
        <CatalogBrowser products={products} />
      </Suspense>
    </div>
  );
}
