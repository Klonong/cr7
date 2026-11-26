"use client";

import { ProductCard } from "@/components/catalog/product-card";
import { ProductQuickView } from "@/components/catalog/product-quick-view";
import { useQuickView } from "@/hooks/catalog/use-quick-view";
import type { Category, Product } from "@/interface/catalog";

interface FeaturedGridProps {
  products: Product[];
  categories?: Category[];
  columns?: 3 | 4;
}

export function FeaturedGrid({
  products,
  categories,
  columns = 4,
}: FeaturedGridProps) {
  const { quickViewProduct, isOpen, openQuickView, handleOpenChange } =
    useQuickView();

  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card px-6 py-12 text-center">
        <p className="text-sm font-semibold text-foreground">
          Belum ada produk di katalog database.
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Jalankan seed database atau tambahkan produk baru melalui panel admin.
        </p>
      </div>
    );
  }

  return (
    <>
      <div
        className={
          columns === 4
            ? "grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4"
            : "grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3"
        }
      >
        {products.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            categories={categories}
            priority={index < 4}
            onQuickView={openQuickView}
          />
        ))}
      </div>

      <ProductQuickView
        product={quickViewProduct}
        categories={categories}
        open={isOpen}
        onOpenChange={handleOpenChange}
      />
    </>
  );
}
