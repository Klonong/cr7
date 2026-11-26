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
import { getCatalogCategories } from "@/lib/server/category-service";
import { getCatalogMotorcycles } from "@/lib/server/motorcycle-service";
import { JsonLd } from "@/components/shared/json-ld";
import {
  buildBreadcrumbJsonLd,
  buildCatalogCollectionJsonLd,
  toAbsoluteUrl,
} from "@/lib/seo";

export const metadata: Metadata = {
  title: "Katalog Lengkap Aksesoris & Sparepart Motor",
  description:
    "Jelajahi katalog lengkap CR7 Racing: lampu depan LED, Bi-LED projector, SQL laser, handle rem CNC, frame slider, holder HP, dan relay set. Filter sesuai tipe motor Anda.",
  alternates: {
    canonical: "/products",
  },
  openGraph: {
    type: "website",
    url: toAbsoluteUrl("/products"),
    title: "Katalog Lengkap Aksesoris & Sparepart Motor | CR7 Racing",
    description:
      "Filter lampu LED motor, Bi-LED projector, dan aksesoris CNC CR7 Racing berdasarkan kategori & tipe motor.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Katalog Lengkap Aksesoris & Sparepart Motor | CR7 Racing",
    description:
      "Filter lampu LED motor, Bi-LED projector, dan aksesoris CNC CR7 Racing berdasarkan kategori & tipe motor.",
  },
};

export default async function ProductsCatalogPage() {
  const [products, categories, motorcycles] = await Promise.all([
    getCatalogProducts(),
    getCatalogCategories(),
    getCatalogMotorcycles(),
  ]);

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Beranda", path: "/" },
    { name: "Katalog", path: "/products" },
  ]);
  const collectionJsonLd = buildCatalogCollectionJsonLd(products);

  return (
    <div className="mx-auto w-full max-w-[1320px] px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd data={[breadcrumbJsonLd, collectionJsonLd]} />
      {/* Breadcrumb */}
      <Breadcrumb className="mb-5">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/" />}>Beranda</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Katalog</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page Heading */}
      <div className="mb-8 space-y-2 border-b border-border pb-6">
        <p className="font-mono text-xs font-semibold uppercase tracking-wider text-primary">
          Indeks Produk Resmi CR7 Racing
        </p>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Katalog Part &amp; Aksesoris Motor
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Filter produk berdasarkan kategori, tipe motor, atau ketersediaan
          toko. Pilih produk untuk melihat pilihan varian, spesifikasi teknis,
          dan langsung checkout di Shopee atau TikTok Shop resmi kami.
        </p>
      </div>

      {/* Interactive Filterable Catalog */}
      <Suspense fallback={<CatalogGridSkeleton count={6} />}>
        <CatalogBrowser
          products={products}
          categories={categories}
          motorcycles={motorcycles}
        />
      </Suspense>
    </div>
  );
}
