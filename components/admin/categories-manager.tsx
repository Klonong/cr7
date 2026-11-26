"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  ExternalLink,
  FolderPlus,
  FolderTree,
  Pencil,
  Search,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AdminHeader } from "@/components/admin/admin-header";
import { CategoryEditDialog } from "@/components/admin/category-edit-dialog";
import { useAdminCategories } from "@/hooks/use-admin-categories";
import { cn } from "@/lib/utils";
import type { Category, Product } from "@/types/catalog";

interface CategoriesManagerProps {
  initialCategories: Category[];
  products: Product[];
  username: string;
}

export function CategoriesManager({
  initialCategories,
  products,
  username,
}: CategoriesManagerProps) {
  const searchParams = useSearchParams();
  const createdName = searchParams.get("created");

  const catState = useAdminCategories(initialCategories);
  const [editingCategory, setEditingCategory] =
    React.useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] =
    React.useState<Category | null>(null);
  const [dismissedCreated, setDismissedCreated] = React.useState(false);

  const productCounts = React.useMemo(() => {
    const map = new Map<string, number>();
    for (const p of products) {
      map.set(p.category, (map.get(p.category) ?? 0) + 1);
    }
    return map;
  }, [products]);

  const populatedCount = catState.categories.filter(
    (c) => (productCounts.get(c.slug) ?? 0) > 0
  ).length;

  const handleConfirmDelete = async () => {
    if (!deletingCategory) return;
    await catState.removeCategory(deletingCategory);
    setDeletingCategory(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AdminHeader username={username} />

      <div className="mx-auto w-full max-w-[1320px] flex-1 px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        {/* Heading + Primary Create Page Link */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-primary">
              Struktur Katalog
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Kategori Aksesoris Motor
            </h1>
            <p className="text-sm text-muted-foreground">
              Kelola kategori produk CR7 Racing. Buat kategori baru, ubah nama
              atau deskripsi, atau hapus kategori yang sudah kosong.
            </p>
          </div>

          <Link
            href="/admin/categories/new"
            className={cn(
              buttonVariants({ variant: "default" }),
              "h-11 min-h-[44px] gap-2 px-5 font-semibold self-start sm:self-auto"
            )}
          >
            <FolderPlus className="size-4" aria-hidden="true" />
            <span>Tambah Kategori Baru</span>
          </Link>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <Card className="rounded-lg border border-border bg-card p-4 ring-0 gap-1">
            <p className="text-xs font-medium text-muted-foreground">
              Total Kategori
            </p>
            <p className="font-mono text-2xl font-extrabold tabular-nums text-foreground">
              {catState.categories.length}
            </p>
          </Card>

          <Card className="rounded-lg border border-border bg-card p-4 ring-0 gap-1">
            <p className="text-xs font-medium text-muted-foreground">
              Kategori Berisi Produk
            </p>
            <p className="font-mono text-2xl font-extrabold tabular-nums text-status-success">
              {populatedCount}
            </p>
          </Card>

          <Card className="rounded-lg border border-border bg-card p-4 ring-0 gap-1">
            <p className="text-xs font-medium text-muted-foreground">
              Kategori Kosong
            </p>
            <p className="font-mono text-2xl font-extrabold tabular-nums text-foreground">
              {catState.categories.length - populatedCount}
            </p>
          </Card>

          <Card className="rounded-lg border border-border bg-card p-4 ring-0 gap-1">
            <p className="text-xs font-medium text-muted-foreground">
              Total Produk Terpetakan
            </p>
            <p className="font-mono text-2xl font-extrabold tabular-nums text-foreground">
              {products.length}
            </p>
          </Card>
        </div>

        {/* Created Redirect Success Banner */}
        {createdName && !dismissedCreated && !catState.feedback && (
          <div
            role="status"
            className="flex items-center justify-between gap-3 rounded-lg border border-status-success/30 bg-status-success/10 px-4 py-3 text-sm font-medium text-status-success"
          >
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="size-4 shrink-0" aria-hidden="true" />
              <span>
                Kategori baru &ldquo;{createdName}&rdquo; berhasil dibuat dan
                tampil di toko.
              </span>
            </span>
            <button
              type="button"
              onClick={() => setDismissedCreated(true)}
              aria-label="Tutup notifikasi"
              className="rounded p-1 hover:bg-black/5 dark:hover:bg-white/10"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
        )}

        {/* Action Feedback Banner */}
        {catState.feedback && (
          <div
            role="status"
            className={cn(
              "flex items-center justify-between gap-3 rounded-lg border px-4 py-3 text-sm font-medium",
              catState.feedback.type === "success"
                ? "border-status-success/30 bg-status-success/10 text-status-success"
                : "border-destructive/30 bg-destructive/10 text-destructive"
            )}
          >
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="size-4 shrink-0" aria-hidden="true" />
              <span>{catState.feedback.message}</span>
            </span>
            <button
              type="button"
              onClick={catState.clearFeedback}
              aria-label="Tutup notifikasi"
              className="rounded p-1 hover:bg-black/5 dark:hover:bg-white/10"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
        )}

        {/* Search Toolbar */}
        <div className="relative max-w-md">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={catState.search}
            onChange={(e) => catState.setSearch(e.target.value)}
            placeholder="Cari kategori berdasarkan nama atau slug..."
            aria-label="Cari kategori"
            className="h-10 pl-9 bg-card"
          />
        </div>

        {/* Typographic Category Cards Grid (Tanpa Gambar) */}
        {catState.filteredCategories.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center">
            <FolderTree
              className="size-8 text-muted-foreground/50 mb-3"
              aria-hidden="true"
            />
            <h2 className="text-base font-semibold text-foreground">
              Kategori tidak ditemukan
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Coba kata kunci lain atau buat kategori baru.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {catState.filteredCategories.map((category) => {
              const count = productCounts.get(category.slug) ?? 0;
              return (
                <Card
                  key={category.slug}
                  className="flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-card p-0 ring-0 gap-0"
                >
                  <div className="p-5 space-y-3 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                        <Tag className="size-3.5" aria-hidden="true" />
                        <span>{category.shortName}</span>
                      </span>
                      <Badge
                        variant="secondary"
                        className="font-mono text-[11px] border border-border"
                      >
                        {count} SKU
                      </Badge>
                    </div>

                    <div className="space-y-1 min-w-0">
                      <h2 className="truncate text-base font-bold text-foreground">
                        {category.name}
                      </h2>
                      <p className="truncate font-mono text-[11px] text-muted-foreground">
                        /{category.slug}
                      </p>
                    </div>

                    <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                      {category.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-2 border-t border-border bg-muted/30 px-5 py-3">
                    <Link
                      href={`/products?category=${category.slug}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
                    >
                      <span>Lihat di Toko</span>
                      <ExternalLink className="size-3" aria-hidden="true" />
                    </Link>

                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingCategory(category)}
                        className="h-8 gap-1.5 px-3 text-xs"
                      >
                        <Pencil className="size-3" aria-hidden="true" />
                        <span>Edit</span>
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setDeletingCategory(category)}
                        aria-label={`Hapus ${category.name}`}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="size-3.5" aria-hidden="true" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <CategoryEditDialog
        open={Boolean(editingCategory)}
        onOpenChange={(open) => {
          if (!open) setEditingCategory(null);
        }}
        category={editingCategory}
        onSaved={catState.applySavedCategory}
      />

      {/* Delete Confirmation */}
      <AlertDialog
        open={Boolean(deletingCategory)}
        onOpenChange={(open) => {
          if (!open) setDeletingCategory(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus kategori ini?</AlertDialogTitle>
            <AlertDialogDescription>
              {(productCounts.get(deletingCategory?.slug ?? "") ?? 0) > 0 ? (
                <>
                  Kategori{" "}
                  <strong className="text-foreground">
                    {deletingCategory?.name}
                  </strong>{" "}
                  masih digunakan oleh{" "}
                  <strong className="text-foreground">
                    {productCounts.get(deletingCategory?.slug ?? "")} produk
                  </strong>
                  . Pindahkan atau hapus produk terkait terlebih dahulu.
                </>
              ) : (
                <>
                  Kategori{" "}
                  <strong className="text-foreground">
                    {deletingCategory?.name}
                  </strong>{" "}
                  (<span className="font-mono">{deletingCategory?.slug}</span>)
                  akan dihapus secara permanen.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={catState.deleting}>
              Batal
            </AlertDialogCancel>
            {(productCounts.get(deletingCategory?.slug ?? "") ?? 0) === 0 && (
              <AlertDialogAction
                variant="destructive"
                onClick={handleConfirmDelete}
                disabled={catState.deleting}
              >
                {catState.deleting ? "Menghapus..." : "Hapus Kategori"}
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
