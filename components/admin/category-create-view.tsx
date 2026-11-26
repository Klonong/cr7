"use client";

import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  FolderPlus,
  Loader2,
  Sparkles,
  Tag,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { AdminHeader } from "@/components/admin/admin-header";
import { useCategoryCreateForm } from "@/hooks/admin/use-category-form";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/catalog";

interface CategoryCreateViewProps {
  existingCategories: Category[];
  username: string;
}

export function CategoryCreateView({
  existingCategories,
  username,
}: CategoryCreateViewProps) {
  const form = useCategoryCreateForm(existingCategories);

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
              <BreadcrumbLink render={<Link href="/admin/categories" />}>
                Kategori
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Tambah Kategori Baru</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Page Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between border-b border-border pb-6">
          <div className="space-y-1">
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-primary">
              Pengaturan Kategori
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Tambah Kategori Aksesori Baru
            </h1>
            <p className="text-sm text-muted-foreground">
              Kategori tampil ringkas tanpa gambar agar cepat dipindai di
              Beranda, filter katalog, dan pilihan produk.
            </p>
          </div>

          <Link
            href="/admin/categories"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-10 gap-1.5 self-start sm:self-auto"
            )}
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            <span>Kembali ke Kategori</span>
          </Link>
        </div>

        {/* 2-Column Form + Live Preview */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
          <form onSubmit={form.handleSubmit} className="lg:col-span-7">
            <Card className="rounded-xl border border-border bg-card p-6 ring-0 space-y-6">
              {form.error && (
                <div
                  role="alert"
                  className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-xs font-medium text-destructive"
                >
                  <AlertCircle
                    className="size-4 shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span>{form.error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="cat-name" className="text-xs font-semibold">
                    Nama Lengkap Kategori *
                  </Label>
                  <Input
                    id="cat-name"
                    required
                    value={form.name}
                    onChange={(e) => form.handleNameChange(e.target.value)}
                    placeholder="mis. Knalpot & Sistem Pembuangan Racing"
                    className="h-10"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="cat-short" className="text-xs font-semibold">
                    Label Singkat (Filter &amp; Badge) *
                  </Label>
                  <Input
                    id="cat-short"
                    required
                    maxLength={22}
                    value={form.shortName}
                    onChange={(e) => form.handleShortNameChange(e.target.value)}
                    placeholder="mis. Knalpot"
                    className="h-10"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="cat-slug" className="text-xs font-semibold">
                    URL Slug *
                  </Label>
                  <Input
                    id="cat-slug"
                    required
                    value={form.slug}
                    onChange={(e) => form.handleSlugChange(e.target.value)}
                    placeholder="knalpot-racing"
                    aria-invalid={form.isDuplicateSlug}
                    className="h-10 font-mono text-xs"
                  />
                  {form.isDuplicateSlug ? (
                    <p className="text-[11px] font-medium text-destructive">
                      Slug &ldquo;{form.previewSlug}&rdquo; sudah terdaftar.
                    </p>
                  ) : (
                    <p className="truncate font-mono text-[11px] text-muted-foreground">
                      /products?category={form.previewSlug || "slug-kategori"}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="cat-desc" className="text-xs font-semibold">
                      Deskripsi Singkat *
                    </Label>
                    <span className="font-mono text-[11px] text-muted-foreground">
                      {form.description.length} / 140 karakter
                    </span>
                  </div>
                  <Textarea
                    id="cat-desc"
                    required
                    rows={3}
                    maxLength={140}
                    value={form.description}
                    onChange={(e) => form.setDescription(e.target.value)}
                    placeholder="Silincer slip-on racing, header stainless, dan breket knalpot CNC."
                  />
                </div>
              </div>

              <Separator />

              <div className="flex flex-col-reverse gap-2.5 sm:flex-row sm:items-center sm:justify-end">
                <Link
                  href="/admin/categories"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "h-11 min-h-[44px] px-5"
                  )}
                >
                  Batal
                </Link>
                <Button
                  type="submit"
                  disabled={form.submitting || form.isDuplicateSlug}
                  className="h-11 min-h-[44px] gap-2 px-6 font-semibold"
                >
                  {form.submitting ? (
                    <>
                      <Loader2
                        className="size-4 animate-spin"
                        aria-hidden="true"
                      />
                      <span>Menyimpan Kategori...</span>
                    </>
                  ) : (
                    <>
                      <FolderPlus className="size-4" aria-hidden="true" />
                      <span>Simpan Kategori</span>
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </form>

          {/* Sticky Live Preview (Imageless Typographic Card) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <Card className="rounded-xl border border-border bg-card p-5 ring-0 space-y-5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-4 text-primary" aria-hidden="true" />
                  <h2 className="text-sm font-bold text-foreground">
                    Pratinjau Kartu Kategori
                  </h2>
                </div>
                <Badge
                  variant="secondary"
                  className="font-mono text-[10px] border border-border"
                >
                  Real-time
                </Badge>
              </div>

              {/* Home Page Card Preview */}
              <Card className="gap-3 rounded-xl border border-primary/40 bg-card p-5 ring-0 shadow-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                    <Tag className="size-3.5" aria-hidden="true" />
                    <span>{form.shortName.trim() || "Label Singkat"}</span>
                  </span>
                  <span className="font-mono text-xs font-semibold text-muted-foreground">
                    0 produk
                  </span>
                </div>

                <div className="space-y-1.5">
                  <p className="text-base font-bold text-foreground">
                    {form.name.trim() || "Nama Lengkap Kategori"}
                  </p>
                  <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                    {form.description.trim() ||
                      "Deskripsi kategori akan tampil rapi maksimal 2 baris di kartu beranda."}
                  </p>
                </div>

                <div className="flex items-center gap-1 text-xs font-semibold text-primary pt-1">
                  <span>Lihat koleksi</span>
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </div>
              </Card>

              <Separator />

              <div className="rounded-lg border border-border bg-muted/40 p-3.5 space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Pratinjau Breadcrumb Katalog
                </p>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap">
                  <span>Beranda</span>
                  <ChevronRight className="size-3" aria-hidden="true" />
                  <span>Katalog</span>
                  <ChevronRight className="size-3" aria-hidden="true" />
                  <span className="font-semibold text-foreground">
                    {form.shortName.trim() || "Label Singkat"}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
