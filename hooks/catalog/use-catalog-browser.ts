"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import {
  useProductFilters,
  type UseProductFiltersOptions,
} from "@/hooks/catalog/use-product-filters";
import { useQuickView } from "@/hooks/catalog/use-quick-view";
import type { CategorySlug } from "@/types/catalog";

export function useCatalogUrlParams() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") as CategorySlug | null;
  const initialBike = searchParams.get("bike") ?? "";
  const initialQuery = searchParams.get("q") ?? "";
  const urlKey = `${initialCategory ?? ""}|${initialBike}|${initialQuery}`;

  return {
    initialCategory,
    initialBike,
    initialQuery,
    urlKey,
  };
}

export function useCatalogBrowser(options: UseProductFiltersOptions) {
  const filters = useProductFilters(options);
  const quickView = useQuickView();
  const [mobileFilterOpen, setMobileFilterOpen] = React.useState(false);

  return {
    filters,
    quickView,
    mobileFilterOpen,
    setMobileFilterOpen,
  };
}
