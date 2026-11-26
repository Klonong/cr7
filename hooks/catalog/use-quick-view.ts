"use client";

import * as React from "react";
import type { Product } from "@/types/catalog";

export function useQuickView() {
  const [quickViewProduct, setQuickViewProduct] =
    React.useState<Product | null>(null);

  const openQuickView = React.useCallback((product: Product) => {
    setQuickViewProduct(product);
  }, []);

  const handleOpenChange = React.useCallback((open: boolean) => {
    if (!open) setQuickViewProduct(null);
  }, []);

  return {
    quickViewProduct,
    isOpen: Boolean(quickViewProduct),
    openQuickView,
    handleOpenChange,
  };
}
