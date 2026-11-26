"use client";

import { ProductCard } from "@/components/catalog/product-card";
import { ProductQuickView } from "@/components/catalog/product-quick-view";
import { useQuickView } from "@/hooks/catalog/use-quick-view";
import type { Product } from "@/types/catalog";

interface FeaturedGridProps {
  products: Product[];
  columns?: 3 | 4;
}

export function FeaturedGrid({ products, columns = 4 }: FeaturedGridProps) {
  const { quickViewProduct, isOpen, openQuickView, handleOpenChange } =
    useQuickView();

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
            priority={index < 4}
            onQuickView={openQuickView}
          />
        ))}
      </div>

      <ProductQuickView
        product={quickViewProduct}
        open={isOpen}
        onOpenChange={handleOpenChange}
      />
    </>
  );
}
