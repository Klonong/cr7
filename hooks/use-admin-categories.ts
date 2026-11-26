"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { deleteCatalogCategory } from "@/lib/api/category-api";
import { getErrorMessage } from "@/lib/api/client";
import type { AdminFeedback } from "@/hooks/use-admin-catalog";
import type { Category } from "@/types/catalog";

export function useAdminCategories(initialCategories: Category[]) {
  const router = useRouter();
  const [categories, setCategories] =
    React.useState<Category[]>(initialCategories);
  const [search, setSearch] = React.useState("");
  const [deleting, setDeleting] = React.useState(false);
  const [feedback, setFeedback] = React.useState<AdminFeedback | null>(null);

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

  const filteredCategories = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c) =>
      `${c.name} ${c.shortName} ${c.slug} ${c.description}`
        .toLowerCase()
        .includes(q)
    );
  }, [categories, search]);

  return {
    categories,
    filteredCategories,
    search,
    setSearch,
    deleting,
    feedback,
    clearFeedback: () => setFeedback(null),
    applySavedCategory,
    removeCategory,
  };
}
