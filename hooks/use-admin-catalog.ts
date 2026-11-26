"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  deleteCatalogProduct,
  setCatalogProductStock,
} from "@/lib/api/catalog-api";
import { getErrorMessage } from "@/lib/api/client";
import { computeCatalogStats, filterProducts } from "@/lib/catalog-filters";
import type { CategorySlug, Product } from "@/types/catalog";

export interface AdminFeedback {
  type: "success" | "error";
  message: string;
}

export function useAdminCatalog(initialProducts: Product[]) {
  const router = useRouter();

  const [products, setProducts] = React.useState<Product[]>(initialProducts);
  const [search, setSearch] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState<"all" | CategorySlug>(
    "all"
  );
  const [stockFilter, setStockFilter] = React.useState<"all" | "in" | "out">(
    "all"
  );
  const [togglingId, setTogglingId] = React.useState<string | null>(null);
  const [deleting, setDeleting] = React.useState(false);
  const [feedback, setFeedback] = React.useState<AdminFeedback | null>(null);

  const applySavedProduct = React.useCallback(
    (saved: Product, mode: "create" | "edit") => {
      if (mode === "create") {
        setProducts((prev) => [saved, ...prev]);
        setFeedback({
          type: "success",
          message: `Produk "${saved.name}" (${saved.sku}) berhasil ditambahkan ke katalog.`,
        });
      } else {
        setProducts((prev) =>
          prev.map((p) => (p.id === saved.id ? saved : p))
        );
        setFeedback({
          type: "success",
          message: `Produk "${saved.name}" (${saved.sku}) berhasil diperbarui.`,
        });
      }
      router.refresh();
    },
    [router]
  );

  const toggleStock = React.useCallback(
    async (product: Product, nextStock: boolean) => {
      setTogglingId(product.id);
      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id ? { ...p, inStock: nextStock } : p
        )
      );

      try {
        await setCatalogProductStock(product.id, nextStock);
        setFeedback({
          type: "success",
          message: `${product.sku} ditandai sebagai ${nextStock ? "Tersedia" : "Habis"}.`,
        });
        router.refresh();
      } catch (error) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === product.id ? { ...p, inStock: product.inStock } : p
          )
        );
        setFeedback({
          type: "error",
          message: getErrorMessage(error, "Gagal memperbarui status stok."),
        });
      } finally {
        setTogglingId(null);
      }
    },
    [router]
  );

  const removeProduct = React.useCallback(
    async (product: Product) => {
      setDeleting(true);
      try {
        await deleteCatalogProduct(product.id);
        setProducts((prev) => prev.filter((p) => p.id !== product.id));
        setFeedback({
          type: "success",
          message: `Produk "${product.name}" (${product.sku}) berhasil dihapus.`,
        });
        router.refresh();
        return true;
      } catch (error) {
        setFeedback({
          type: "error",
          message: getErrorMessage(error, "Gagal menghapus produk."),
        });
        return false;
      } finally {
        setDeleting(false);
      }
    },
    [router]
  );

  const filteredProducts = React.useMemo(
    () =>
      filterProducts(products, {
        query: search,
        categories: categoryFilter === "all" ? [] : [categoryFilter],
        stockStatus: stockFilter,
      }),
    [products, search, categoryFilter, stockFilter]
  );

  const stats = React.useMemo(() => computeCatalogStats(products), [products]);

  return {
    products,
    filteredProducts,
    stats,
    search,
    setSearch,
    categoryFilter,
    setCategoryFilter,
    stockFilter,
    setStockFilter,
    togglingId,
    deleting,
    feedback,
    clearFeedback: () => setFeedback(null),
    applySavedProduct,
    toggleStock,
    removeProduct,
  };
}
