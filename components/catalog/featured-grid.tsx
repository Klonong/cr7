"use client";

import * as React from "react";
import { ProductCard } from "@/components/catalog/product-card";
import { ProductQuickView } from "@/components/catalog/product-quick-view";
import type { Product } from "@/data/products";

interface FeaturedGridProps {
  products: Product[];
  columns?: 3 | 4;
}

export function FeaturedGrid({ products, columns = 4 }: FeaturedGridProps) {
  const [quickViewProduct, setQuickViewProduct] =
    React.useState<Product | null>(null);

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
            onQuickView={(p) => setQuickViewProduct(p)}
          />
        ))}
      </div>

      <ProductQuickView
        product={quickViewProduct}
        open={Boolean(quickViewProduct)}
        onOpenChange={(open) => {
          if (!open) setQuickViewProduct(null);
        }}
      />
    </>
  );
}
