"use client";

import * as React from "react";
import { getCategoryBySlug } from "@/data/categories";
import { getDiscountPercent } from "@/lib/format";
import type { Product } from "@/types/catalog";

export function useProductCard(product: Product) {
  const [showSecondary, setShowSecondary] = React.useState(false);

  const category = getCategoryBySlug(product.category);
  const discount = getDiscountPercent(product.price, product.originalPrice);
  const primaryImage = product.images[0];
  const secondaryImage = product.images[1];
  const variants = product.variants ?? [];

  const activeImageUrl =
    showSecondary && secondaryImage ? secondaryImage.url : primaryImage.url;

  const handleMouseEnter = React.useCallback(() => {
    if (secondaryImage) setShowSecondary(true);
  }, [secondaryImage]);

  const handleMouseLeave = React.useCallback(() => {
    setShowSecondary(false);
  }, []);

  return {
    category,
    discount,
    primaryImage,
    secondaryImage,
    activeImageUrl,
    variants,
    handleMouseEnter,
    handleMouseLeave,
  };
}
