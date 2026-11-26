"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Bike,
  CheckCircle2,
  ExternalLink,
  Plus,
  Search,
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
import { deleteCatalogMotorcycle } from "@/lib/api/motorcycle-api";
import { getErrorMessage } from "@/lib/api/client";
import { cn } from "@/lib/utils";
import type { Motorcycle, Product } from "@/types/catalog";

interface MotorcyclesManagerProps {
  initialMotorcycles: Motorcycle[];
  products: Product[];
  username: string;
}

export function MotorcyclesManager({
  initialMotorcycles,
  products,
  username,
}: MotorcyclesManagerProps) {
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
  const [feedback, setFeedback] = React.useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return motorcycles;
    return motorcycles.filter((m) =>
      `${m.name} ${m.brand} ${m.model} ${m.type}`.toLowerCase().includes(q)
    );
  }, [motorcycles, search]);

  const countCompatibleProducts = (motoName: string) =>
    products.filter(
      (p) =>
        p.compatibility.includes(motoName) ||
        p.compatibility.includes("Universal")
    ).length;

  const handleConfirmDelete = async () => {
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
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AdminHeader username={username} />

      <div className="mx-auto w-full max-w-[1320px] flex-1 px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-primary">
              Daftar Kecocokan Motor
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Kelola Tipe Motor Kompatibel
            </h1>
            <p className="text-sm text-muted-foreground">
              Tambahkan model motor agar pembeli bisa memfilter aksesoris CR7
              Racing sesuai motor mereka.
            </p>
          </div>

          <Link
            href="/admin/motorcycles/new"
            className={cn(
              buttonVariants({ variant: "default" }),
              "h-11 min-h-[44px] gap-2 px-5 font-semibold self-start sm:self-auto"
            )}
          >
            <Plus className="size-4" aria-hidden="true" />
            <span>Tambah Motor</span>
          </Link>
        </div>

        {/* Banners */}
        {createdName && !dismissedCreated && !feedback && (
          <div
            role="status"
            className="flex items-center justify-between gap-3 rounded-lg border border-status-success/30 bg-status-success/10 px-4 py-3 text-sm font-medium text-status-success"
          >
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="size-4 shrink-0" aria-hidden="true" />
              <span>
                Tipe motor &ldquo;{createdName}&rdquo; berhasil ditambahkan ke
                katalog.
              </span>
            </span>
            <button
              type="button"
              onClick={() => setDismissedCreated(true)}
              aria-label="Tutup notifikasi"
              className="rounded p-1 hover:bg-black/5"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
        )}

        {feedback && (
          <div
            role="status"
            className={cn(
              "flex items-center justify-between gap-3 rounded-lg border px-4 py-3 text-sm font-medium",
              feedback.type === "success"
                ? "border-status-success/30 bg-status-success/10 text-status-success"
                : "border-destructive/30 bg-destructive/10 text-destructive"
            )}
          >
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="size-4 shrink-0" aria-hidden="true" />
              <span>{feedback.message}</span>
            </span>
            <button
              type="button"
              onClick={() => setFeedback(null)}
              aria-label="Tutup notifikasi"
              className="rounded p-1 hover:bg-black/5"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
        )}

        {/* Search */}
        <div className="relative max-w-md">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari merek, model, atau jenis motor..."
            aria-label="Cari tipe motor"
            className="h-10 pl-9 bg-card"
          />
        </div>

        {/* Motorcycles Grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((moto) => {
            const compatCount = countCompatibleProducts(moto.name);
            return (
              <Card
                key={moto.id}
                className="rounded-xl border border-border bg-card p-4 ring-0 gap-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Bike className="size-4.5" aria-hidden="true" />
                    </span>
                    <Badge variant="outline" className="text-[11px]">
                      {moto.type}
                    </Badge>
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-foreground">
                      {moto.name}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      {moto.brand} · {moto.model}
                    </p>
                  </div>
                  <p className="font-mono text-xs text-muted-foreground">
                    {compatCount} produk kompatibel
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-border pt-3">
                  <Link
                    href={`/products?bike=${encodeURIComponent(moto.name)}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
                  >
                    <span>Lihat Produk</span>
                    <ExternalLink className="size-3" aria-hidden="true" />
                  </Link>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setDeletingMoto(moto)}
                    aria-label={`Hapus ${moto.name}`}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="size-3.5" aria-hidden="true" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      <AlertDialog
        open={Boolean(deletingMoto)}
        onOpenChange={(open) => {
          if (!open) setDeletingMoto(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus tipe motor ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Tipe motor{" "}
              <strong className="text-foreground">{deletingMoto?.name}</strong>{" "}
              akan dihapus dari daftar filter kecocokan motor.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleting}
            >
              {deleting ? "Menghapus..." : "Hapus Motor"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
