"use client";

import * as React from "react";
import { getDiscountPercent } from "@/lib/format";
import type { Category, Product } from "@/interface/catalog";

export function useProductVariant(
  product: Product | null,
  categories?: Category[]
) {
  const [selection, setSelection] = React.useState<{
    id: string;
    imgIdx: number;
    variantId: string | null;
  }>({ id: "", imgIdx: 0, variantId: null });

  const variants = React.useMemo(() => product?.variants ?? [], [product]);

  const activeImageIdx =
    product && selection.id === product.id ? selection.imgIdx : 0;

  const selectedVariantId =
    product && selection.id === product.id
      ? selection.variantId
      : (variants[0]?.id ?? null);

  const selectedVariant =
    variants.find((v) => v.id === selectedVariantId) ?? null;

  const selectImage = React.useCallback(
    (imgIdx: number) => {
      if (!product) return;
      setSelection({ id: product.id, imgIdx, variantId: selectedVariantId });
    },
    [product, selectedVariantId]
  );

  const selectVariant = React.useCallback(
    (variantId: string) => {
      if (!product) return;
      setSelection({ id: product.id, imgIdx: activeImageIdx, variantId });
    },
    [product, activeImageIdx]
  );

  const category = product
    ? categories?.find((c) => c.slug === product.category)
    : undefined;
  const displayPrice = selectedVariant?.price ?? product?.price ?? 0;
  const displaySku = selectedVariant?.sku ?? product?.sku ?? "";
  const isAvailable = product
    ? selectedVariant
      ? product.inStock && selectedVariant.inStock
      : product.inStock
    : false;
  const discount = product
    ? getDiscountPercent(displayPrice, product.originalPrice)
    : null;
  const activeImage = product
    ? (product.images[activeImageIdx] ?? product.images[0])
    : null;

  return {
    variants,
    selectedVariantId,
    selectedVariant,
    selectVariant,
    activeImageIdx,
    activeImage,
    selectImage,
    category,
    displayPrice,
    displaySku,
    isAvailable,
    discount,
  };
}
