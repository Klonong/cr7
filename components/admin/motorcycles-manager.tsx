"use client";

import Link from "next/link";
import {
  Bike,
  ExternalLink,
  Plus,
  RotateCcw,
  Search,
  Trash2,
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
import { AdminFeedbackBanner } from "@/components/admin/admin-feedback-banner";
import { useAdminMotorcycles } from "@/hooks/admin/use-admin-motorcycles";
import { cn } from "@/lib/utils";
import type { Motorcycle, Product } from "@/interface/catalog";

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
  const motoState = useAdminMotorcycles(initialMotorcycles, products);

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
              Tambahkan model motor agar pembeli bisa memfilter aksesori CR7
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

        <AdminFeedbackBanner
          feedback={motoState.feedback}
          onDismiss={motoState.dismissFeedback}
        />

        {/* Search */}
        <div className="relative max-w-md">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={motoState.search}
            onChange={(e) => motoState.setSearch(e.target.value)}
            placeholder="Cari merek, model, atau jenis motor..."
            aria-label="Cari tipe motor"
            className="h-10 pl-9 bg-card"
          />
        </div>

        {/* Motorcycles Grid or Empty State */}
        {motoState.filteredMotorcycles.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center">
            <Bike
              className="size-8 text-muted-foreground/50 mb-3"
              aria-hidden="true"
            />
            <h2 className="text-base font-semibold text-foreground">
              Tipe motor tidak ditemukan
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Coba kata kunci lain atau tambahkan model motor baru.
            </p>
            {motoState.search.trim() && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => motoState.setSearch("")}
                className="mt-4 gap-1.5"
              >
                <RotateCcw className="size-3.5" aria-hidden="true" />
                <span>Reset Pencarian</span>
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {motoState.filteredMotorcycles.map((moto) => {
              const compatCount = motoState.countCompatibleProducts(moto.name);
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
                      onClick={() => motoState.setDeletingMoto(moto)}
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
        )}
      </div>

      <AlertDialog
        open={Boolean(motoState.deletingMoto)}
        onOpenChange={(open) => {
          if (!open) motoState.setDeletingMoto(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus tipe motor ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Tipe motor{" "}
              <strong className="text-foreground">
                {motoState.deletingMoto?.name}
              </strong>{" "}
              akan dihapus dari daftar filter kecocokan motor.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={motoState.deleting}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={motoState.confirmDelete}
              disabled={motoState.deleting}
            >
              {motoState.deleting ? "Menghapus..." : "Hapus Motor"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
