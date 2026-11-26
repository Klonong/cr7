"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { deleteCatalogMotorcycle } from "@/lib/api/motorcycle-api";
import { getErrorMessage } from "@/lib/api/client";
import type { AdminFeedback } from "@/hooks/admin/use-admin-catalog";
import type { Motorcycle, Product } from "@/types/catalog";

export function useAdminMotorcycles(
  initialMotorcycles: Motorcycle[],
  products: Product[]
) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const createdName = searchParams.get("created");

  const [motorcycles, setMotorcycles] =
    React.useState<Motorcycle[]>(initialMotorcycles);
  const [search, setSearch] = React.useState("");
  const [deletingMoto, setDeletingMoto] = React.useState<Motorcycle | null>(
    null
  );
  const [deleting, setDeleting] = React.useState(false);
  const [dismissedCreated, setDismissedCreated] = React.useState(false);
  const [feedback, setFeedback] = React.useState<AdminFeedback | null>(null);

  const filteredMotorcycles = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return motorcycles;
    return motorcycles.filter((m) =>
      `${m.name} ${m.brand} ${m.model} ${m.type}`.toLowerCase().includes(q)
    );
  }, [motorcycles, search]);

  const countCompatibleProducts = React.useCallback(
    (motoName: string) =>
      products.filter(
        (p) =>
          p.compatibility.includes(motoName) ||
          p.compatibility.includes("Universal")
      ).length,
    [products]
  );

  const confirmDelete = React.useCallback(async () => {
    if (!deletingMoto) return;
    setDeleting(true);
    try {
      await deleteCatalogMotorcycle(deletingMoto.id);
      setMotorcycles((prev) => prev.filter((m) => m.id !== deletingMoto.id));
      setFeedback({
        type: "success",
        message: `Motor "${deletingMoto.name}" berhasil dihapus.`,
      });
      router.refresh();
    } catch (err) {
      setFeedback({
        type: "error",
        message: getErrorMessage(err, "Gagal menghapus data motor."),
      });
    } finally {
      setDeleting(false);
      setDeletingMoto(null);
    }
  }, [deletingMoto, router]);

  const activeFeedback: AdminFeedback | null =
    feedback ??
    (createdName && !dismissedCreated
      ? {
          type: "success",
          message: `Tipe motor "${createdName}" berhasil ditambahkan ke katalog.`,
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
    motorcycles,
    filteredMotorcycles,
    search,
    setSearch,
    deletingMoto,
    setDeletingMoto,
    deleting,
    feedback: activeFeedback,
    dismissFeedback,
    countCompatibleProducts,
    confirmDelete,
  };
}
