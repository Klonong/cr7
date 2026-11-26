"use client";

import * as React from "react";
import { filterProducts, sortProducts } from "@/lib/catalog-filters";
import type {
  Category,
  CategorySlug,
  MarketplaceFilter,
  Product,
  ProductBadge,
  SortOption,
} from "@/types/catalog";

export interface UseProductFiltersOptions {
  products: readonly Product[];
  categories: readonly Category[];
  initialCategory?: CategorySlug | null;
  initialBike?: string;
  initialQuery?: string;
}

export function useProductFilters({
  products,
  categories,
  initialCategory = null,
  initialBike = "",
  initialQuery = "",
}: UseProductFiltersOptions) {
  const [query, setQuery] = React.useState(initialQuery);
  const [selectedCategories, setSelectedCategories] = React.useState<
    CategorySlug[]
  >(
    initialCategory && categories.some((c) => c.slug === initialCategory)
      ? [initialCategory]
      : []
  );
  const [selectedBike, setSelectedBike] = React.useState(initialBike);
  const [marketplace, setMarketplace] = React.useState<MarketplaceFilter>("all");
  const [selectedBadges, setSelectedBadges] = React.useState<ProductBadge[]>(
    []
  );
  const [inStockOnly, setInStockOnly] = React.useState(false);
  const [sortBy, setSortBy] = React.useState<SortOption>("featured");

  const toggleCategory = React.useCallback((slug: CategorySlug) => {
    setSelectedCategories((prev) =>
      prev.includes(slug) ? prev.filter((c) => c !== slug) : [...prev, slug]
    );
  }, []);

  const toggleBadge = React.useCallback((badge: ProductBadge) => {
    setSelectedBadges((prev) =>
      prev.includes(badge) ? prev.filter((b) => b !== badge) : [...prev, badge]
    );
  }, []);

  const resetFilters = React.useCallback(() => {
    setQuery("");
    setSelectedCategories([]);
    setSelectedBike("");
    setMarketplace("all");
    setSelectedBadges([]);
    setInStockOnly(false);
    setSortBy("featured");
  }, []);

  const activeFilterCount =
    selectedCategories.length +
    (selectedBike ? 1 : 0) +
    (marketplace !== "all" ? 1 : 0) +
    selectedBadges.length +
    (inStockOnly ? 1 : 0) +
    (query.trim() ? 1 : 0);

  const filteredProducts = React.useMemo(() => {
    const filtered = filterProducts(products, {
      query,
      categories: selectedCategories,
      bike: selectedBike,
      marketplace,
      badges: selectedBadges,
      inStockOnly,
    });
    return sortProducts(filtered, sortBy);
  }, [
    products,
    query,
    selectedCategories,
    selectedBike,
    marketplace,
    selectedBadges,
    inStockOnly,
    sortBy,
  ]);

  return {
    query,
    setQuery,
    selectedCategories,
    toggleCategory,
    selectedBike,
    setSelectedBike,
    marketplace,
    setMarketplace,
    selectedBadges,
    toggleBadge,
    inStockOnly,
    setInStockOnly,
    sortBy,
    setSortBy,
    resetFilters,
    activeFilterCount,
    filteredProducts,
  };
}
