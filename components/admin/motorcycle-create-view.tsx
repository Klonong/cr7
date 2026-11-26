"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  Bike,
  Loader2,
  Plus,
  Sparkles,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { AdminHeader } from "@/components/admin/admin-header";
import { MOTORCYCLE_TYPES } from "@/config/store";
import { createCatalogMotorcycle } from "@/lib/api/motorcycle-api";
import { getErrorMessage } from "@/lib/api/client";
import { validateMotorcycleInput } from "@/lib/validation/motorcycle";
import { cn } from "@/lib/utils";
import type { Motorcycle, MotorcycleType } from "@/types/catalog";

const POPULAR_BRANDS = [
  "Yamaha",
  "Honda",
  "Kawasaki",
  "Suzuki",
  "Vespa",
  "Universal",
] as const;

interface MotorcycleCreateViewProps {
  existingMotorcycles: Motorcycle[];
  username: string;
}

export function MotorcycleCreateView({
  existingMotorcycles,
  username,
}: MotorcycleCreateViewProps) {
  const router = useRouter();

  const [brand, setBrand] = React.useState("");
  const [model, setModel] = React.useState("");
  const [customName, setCustomName] = React.useState("");
  const [nameTouched, setNameTouched] = React.useState(false);
  const [type, setType] = React.useState<MotorcycleType>("Matic");

  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const computedName = nameTouched
    ? customName.trim()
    : brand.trim().toLowerCase() === "universal"
      ? "Universal"
      : [brand.trim(), model.trim()].filter(Boolean).join(" ");

  const isDuplicate = React.useMemo(() => {
    if (!computedName) return false;
    return existingMotorcycles.some(
      (m) => m.name.toLowerCase() === computedName.toLowerCase()
    );
  }, [computedName, existingMotorcycles]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (isDuplicate) {
      setError(`Motor "${computedName}" sudah terdaftar di sistem.`);
      return;
    }

    const validation = validateMotorcycleInput({
      brand,
      model,
      name: computedName,
      type,
    });

    if (!validation.ok) {
      setError(validation.error);
      return;
    }

    setSubmitting(true);
    try {
      await createCatalogMotorcycle(validation.data);
      router.push(
        `/admin/motorcycles?created=${encodeURIComponent(validation.data.name ?? computedName)}`
      );
      router.refresh();
    } catch (err) {
      setError(getErrorMessage(err, "Gagal menambahkan data motor."));
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AdminHeader username={username} />

      <div className="mx-auto w-full max-w-[1320px] flex-1 px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/admin" />}>
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/admin/motorcycles" />}>
                Tipe Motor
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Tambah Motor Baru</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between border-b border-border pb-6">
          <div className="space-y-1">
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-primary">
              Master Data Kecocokan Motor
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Tambah Tipe Motor Baru
            </h1>
            <p className="text-sm text-muted-foreground">
              Tambahkan model motor agar muncul di filter Beranda, Katalog,
              Pencarian Cepat, dan pilihan kecocokan di formulir Produk.
            </p>
          </div>

          <Link
            href="/admin/motorcycles"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-10 gap-1.5 self-start sm:self-auto"
            )}
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            <span>Kembali ke Daftar Motor</span>
          </Link>
        </div>

        {/* 2-Column Form + Live Preview */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
          <form onSubmit={handleSubmit} className="lg:col-span-7">
            <Card className="rounded-xl border border-border bg-card p-6 ring-0 space-y-6">
              {error && (
                <div
                  role="alert"
                  className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-xs font-medium text-destructive"
                >
                  <AlertCircle
                    className="size-4 shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span>{error}</span>
                </div>
              )}

              {/* Quick Brand Picker */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold">
                  Pilih Cepat Merek Populer
                </Label>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_BRANDS.map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setBrand(b)}
                      className={cn(
                        "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                        brand.toLowerCase() === b.toLowerCase()
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-muted/40 text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="moto-brand" className="text-xs font-semibold">
                    Merek Motor *
                  </Label>
                  <Input
                    id="moto-brand"
                    required
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="mis. Yamaha, Honda, Vespa"
                    className="h-10"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="moto-model" className="text-xs font-semibold">
                    Model / Tipe *
                  </Label>
                  <Input
                    id="moto-model"
                    required
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="mis. XMAX 250, Stylo 160, CBR250RR"
                    className="h-10"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="moto-type" className="text-xs font-semibold">
                    Jenis Motor *
                  </Label>
                  <Select
                    value={type}
                    onValueChange={(v) => {
                      if (v) setType(v as MotorcycleType);
                    }}
                  >
                    <SelectTrigger id="moto-type" className="w-full h-10">
                      <SelectValue>{type}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {MOTORCYCLE_TYPES.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="moto-name" className="text-xs font-semibold">
                    Label Tampil (Opsional)
                  </Label>
                  <Input
                    id="moto-name"
                    value={nameTouched ? customName : computedName}
                    onChange={(e) => {
                      setNameTouched(true);
                      setCustomName(e.target.value);
                    }}
                    placeholder="Otomatis: Merek + Model"
                    aria-invalid={isDuplicate}
                    className="h-10"
                  />
                  {isDuplicate && (
                    <p className="text-[11px] font-medium text-destructive">
                      Motor &ldquo;{computedName}&rdquo; sudah ada.
                    </p>
                  )}
                </div>
              </div>

              <Separator />

              <div className="flex flex-col-reverse gap-2.5 sm:flex-row sm:items-center sm:justify-end">
                <Link
                  href="/admin/motorcycles"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "h-11 min-h-[44px] px-5"
                  )}
                >
                  Batal
                </Link>
                <Button
                  type="submit"
                  disabled={submitting || isDuplicate}
                  className="h-11 min-h-[44px] gap-2 px-6 font-semibold"
                >
                  {submitting ? (
                    <>
                      <Loader2
                        className="size-4 animate-spin"
                        aria-hidden="true"
                      />
                      <span>Menyimpan Motor...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="size-4" aria-hidden="true" />
                      <span>Simpan Tipe Motor</span>
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </form>

          {/* Live Preview */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <Card className="rounded-xl border border-border bg-card p-5 ring-0 space-y-5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-4 text-primary" aria-hidden="true" />
                  <h2 className="text-sm font-bold text-foreground">
                    Pratinjau Filter Toko
                  </h2>
                </div>
                <Badge variant="secondary" className="font-mono text-[10px] border border-border">
                  Real-time
                </Badge>
              </div>

              <div className="space-y-3 rounded-lg border border-border bg-muted/35 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Tombol Filter di Beranda
                </p>
                <span className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-primary bg-card px-4 py-2 text-sm font-semibold text-primary shadow-xs">
                  <Bike className="size-4" aria-hidden="true" />
                  <span>{computedName || "Yamaha XMAX 250"}</span>
                </span>
              </div>

              <div className="space-y-2 rounded-lg border border-border bg-muted/35 p-4 text-xs">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Detail Data Tersimpan
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Merek</span>
                  <span className="font-semibold text-foreground">
                    {brand.trim() || "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Model</span>
                  <span className="font-semibold text-foreground">
                    {model.trim() || "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Jenis</span>
                  <Badge variant="outline" className="text-[11px]">
                    {type}
                  </Badge>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
