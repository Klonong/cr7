"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  deleteCatalogProduct,
  setCatalogProductStock,
} from "@/lib/api/catalog-api";
import { getErrorMessage } from "@/lib/api/client";
import { computeCatalogStats, filterProducts } from "@/lib/catalog-filters";
import type { Category, CategorySlug, Product } from "@/interface/catalog";

import type { AdminFeedback } from "@/interface/hooks";

export type { AdminFeedback };

export function useAdminCatalog(
  initialProducts: Product[],
  categories: Category[] = []
) {
  const router = useRouter();

  const [products, setProducts] = React.useState<Product[]>(initialProducts);
  const [search, setSearch] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState<
    "all" | CategorySlug
  >("all");
  const [stockFilter, setStockFilter] = React.useState<"all" | "in" | "out">(
    "all"
  );
  const [togglingId, setTogglingId] = React.useState<string | null>(null);
  const [deleting, setDeleting] = React.useState(false);
  const [feedback, setFeedback] = React.useState<AdminFeedback | null>(null);

  const [formOpen, setFormOpen] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(
    null
  );
  const [deletingProduct, setDeletingProduct] = React.useState<Product | null>(
    null
  );

  const openCreateForm = React.useCallback(() => {
    setEditingProduct(null);
    setFormOpen(true);
  }, []);

  const openEditForm = React.useCallback((product: Product) => {
    setEditingProduct(product);
    setFormOpen(true);
  }, []);

  const clearFilters = React.useCallback(() => {
    setSearch("");
    setCategoryFilter("all");
    setStockFilter("all");
  }, []);

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

  const confirmDelete = React.useCallback(async () => {
    if (!deletingProduct) return;
    await removeProduct(deletingProduct);
    setDeletingProduct(null);
  }, [deletingProduct, removeProduct]);

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

  const findCategory = React.useCallback(
    (slug: string) => categories.find((c) => c.slug === slug),
    [categories]
  );

  const selectedCategoryLabel =
    categoryFilter === "all"
      ? "Semua Kategori"
      : (findCategory(categoryFilter)?.shortName ?? categoryFilter);

  const hasActiveFilters = Boolean(
    search.trim() || categoryFilter !== "all" || stockFilter !== "all"
  );

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
    hasActiveFilters,
    clearFilters,
    togglingId,
    deleting,
    feedback,
    clearFeedback: () => setFeedback(null),
    formOpen,
    setFormOpen,
    editingProduct,
    deletingProduct,
    setDeletingProduct,
    openCreateForm,
    openEditForm,
    applySavedProduct,
    toggleStock,
    removeProduct,
    confirmDelete,
    findCategory,
    selectedCategoryLabel,
  };
}
