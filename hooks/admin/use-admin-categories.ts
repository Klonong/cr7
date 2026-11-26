"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { deleteCatalogCategory } from "@/lib/api/category-api";
import { getErrorMessage } from "@/lib/api/client";
import type { AdminFeedback } from "@/hooks/admin/use-admin-catalog";
import type { Category, Product } from "@/interface/catalog";

export function useAdminCategories(
  initialCategories: Category[],
  products: Product[] = []
) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const createdName = searchParams.get("created");

  const [categories, setCategories] =
    React.useState<Category[]>(initialCategories);
  const [search, setSearch] = React.useState("");
  const [deleting, setDeleting] = React.useState(false);
  const [feedback, setFeedback] = React.useState<AdminFeedback | null>(null);
  const [editingCategory, setEditingCategory] =
    React.useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] =
    React.useState<Category | null>(null);
  const [dismissedCreated, setDismissedCreated] = React.useState(false);

  const applySavedCategory = React.useCallback(
    (saved: Category, mode: "create" | "edit") => {
      if (mode === "create") {
        setCategories((prev) => [...prev, saved]);
        setFeedback({
          type: "success",
          message: `Kategori "${saved.name}" (${saved.slug}) berhasil dibuat.`,
        });
      } else {
        setCategories((prev) =>
          prev.map((c) => (c.slug === saved.slug ? saved : c))
        );
        setFeedback({
          type: "success",
          message: `Kategori "${saved.name}" berhasil diperbarui.`,
        });
      }
      router.refresh();
    },
    [router]
  );

  const removeCategory = React.useCallback(
    async (category: Category) => {
      setDeleting(true);
      try {
        await deleteCatalogCategory(category.slug);
        setCategories((prev) => prev.filter((c) => c.slug !== category.slug));
        setFeedback({
          type: "success",
          message: `Kategori "${category.name}" berhasil dihapus.`,
        });
        router.refresh();
        return true;
      } catch (err) {
        setFeedback({
          type: "error",
          message: getErrorMessage(err, "Gagal menghapus kategori."),
        });
        return false;
      } finally {
        setDeleting(false);
      }
    },
    [router]
  );

  const confirmDelete = React.useCallback(async () => {
    if (!deletingCategory) return;
    await removeCategory(deletingCategory);
    setDeletingCategory(null);
  }, [deletingCategory, removeCategory]);

  const filteredCategories = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c) =>
      `${c.name} ${c.shortName} ${c.slug} ${c.description}`
        .toLowerCase()
        .includes(q)
    );
  }, [categories, search]);

  const productCounts = React.useMemo(() => {
    const map = new Map<string, number>();
    for (const p of products) {
      map.set(p.category, (map.get(p.category) ?? 0) + 1);
    }
    return map;
  }, [products]);

  const populatedCount = React.useMemo(
    () => categories.filter((c) => (productCounts.get(c.slug) ?? 0) > 0).length,
    [categories, productCounts]
  );

  const activeFeedback: AdminFeedback | null =
    feedback ??
    (createdName && !dismissedCreated
      ? {
          type: "success",
          message: `Kategori baru "${createdName}" berhasil dibuat dan tampil di toko.`,
        }
      : null);

  const dismissFeedback = React.useCallback(() => {
    if (feedback) {
      setFeedback(null);
    } else {
      setDismissedCreated(true);
    }
  }, [feedback]);

  return {
    categories,
    filteredCategories,
    productCounts,
    populatedCount,
    search,
    setSearch,
    deleting,
    feedback: activeFeedback,
    dismissFeedback,
    editingCategory,
    setEditingCategory,
    deletingCategory,
    setDeletingCategory,
    applySavedCategory,
    removeCategory,
    confirmDelete,
  };
}
