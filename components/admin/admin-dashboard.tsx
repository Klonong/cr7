"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ExternalLink,
  Package,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Star,
  Trash2,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  ShopeeIcon,
  TikTokShopIcon,
} from "@/components/icons/marketplace-icons";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminFeedbackBanner } from "@/components/admin/admin-feedback-banner";
import { ProductFormDialog } from "@/components/admin/product-form-dialog";
import { DEFAULT_PRODUCT_IMAGE } from "@/config/store";
import { useAdminCatalog } from "@/hooks/admin/use-admin-catalog";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import type {
  Category,
  CategorySlug,
  Motorcycle,
  Product,
} from "@/interface/catalog";

interface AdminDashboardProps {
  initialProducts: Product[];
  categories: Category[];
  motorcycles: Motorcycle[];
  username: string;
}

export function AdminDashboard({
  initialProducts,
  categories,
  motorcycles,
  username,
}: AdminDashboardProps) {
  const catalog = useAdminCatalog(initialProducts, categories);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AdminHeader username={username} />

      <div className="mx-auto w-full max-w-[1320px] flex-1 px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        {/* Heading + Primary Insert Action */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-primary">
              Manajemen Katalog
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Daftar Produk Aksesori Motor
            </h1>
            <p className="text-sm text-muted-foreground">
              Tambah, edit varian &amp; foto, ubah status stok, atau hapus
              produk. Perubahan langsung tampil di toko publik.
            </p>
          </div>

          <Button
            type="button"
            onClick={catalog.openCreateForm}
            className="h-11 min-h-[44px] gap-2 px-5 font-semibold self-start sm:self-auto"
          >
            <Plus className="size-4" aria-hidden="true" />
            <span>Tambah Produk</span>
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <Card className="rounded-lg border border-border bg-card p-4 ring-0 gap-1">
            <p className="text-xs font-medium text-muted-foreground">
              Total SKU Produk
            </p>
            <p className="font-mono text-2xl font-extrabold tabular-nums text-foreground">
              {catalog.stats.total}
            </p>
          </Card>

          <Card className="rounded-lg border border-border bg-card p-4 ring-0 gap-1">
            <p className="text-xs font-medium text-muted-foreground">
              Stok Tersedia
            </p>
            <div className="flex items-baseline gap-2">
              <p className="font-mono text-2xl font-extrabold tabular-nums text-status-success">
                {catalog.stats.inStock}
              </p>
              <span className="font-mono text-xs text-muted-foreground">
                / {catalog.stats.soldOut} habis
              </span>
            </div>
          </Card>

          <Card className="rounded-lg border border-border bg-card p-4 ring-0 gap-1">
            <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <ShopeeIcon className="size-3.5 text-shopee" />
              <span>Terhubung Shopee</span>
            </p>
            <p className="font-mono text-2xl font-extrabold tabular-nums text-foreground">
              {catalog.stats.shopeeLinked}
            </p>
          </Card>

          <Card className="rounded-lg border border-border bg-card p-4 ring-0 gap-1">
            <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <TikTokShopIcon className="size-3.5" />
              <span>Terhubung TikTok Shop</span>
            </p>
            <p className="font-mono text-2xl font-extrabold tabular-nums text-foreground">
              {catalog.stats.tiktokLinked}
            </p>
          </Card>
        </div>

        <AdminFeedbackBanner
          feedback={catalog.feedback}
          onDismiss={catalog.clearFeedback}
        />

        {/* Filter Toolbar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              value={catalog.search}
              onChange={(e) => catalog.setSearch(e.target.value)}
              placeholder="Cari nama produk, SKU, atau tipe motor..."
              aria-label="Filter katalog admin"
              className="h-10 pl-9 bg-card"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={catalog.categoryFilter}
              onValueChange={(v) => {
                if (v) catalog.setCategoryFilter(v as "all" | CategorySlug);
              }}
            >
              <SelectTrigger className="h-10 w-[170px] bg-card">
                <SelectValue>{catalog.selectedCategoryLabel}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.slug} value={c.slug}>
                    {c.shortName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex rounded-lg border border-border bg-card p-1">
              {(
                [
                  { id: "all", label: "Semua" },
                  { id: "in", label: "Tersedia" },
                  { id: "out", label: "Habis" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => catalog.setStockFilter(tab.id)}
                  className={cn(
                    "rounded-md px-3 py-1 text-xs font-medium transition-colors",
                    catalog.stockFilter === tab.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop Data Table */}
        <div className="hidden md:block overflow-hidden rounded-xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="w-[340px]">Produk</TableHead>
                <TableHead>Kategori &amp; Varian</TableHead>
                <TableHead>Harga</TableHead>
                <TableHead>Marketplace</TableHead>
                <TableHead>Stok</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {catalog.filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-40 text-center text-sm text-muted-foreground"
                  >
                    <div className="flex flex-col items-center justify-center gap-2.5">
                      <Package
                        className="size-6 opacity-50"
                        aria-hidden="true"
                      />
                      <span>Tidak ada produk yang cocok dengan filter.</span>
                      {catalog.hasActiveFilters && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={catalog.clearFilters}
                          className="gap-1.5"
                        >
                          <RotateCcw className="size-3.5" aria-hidden="true" />
                          <span>Reset Filter</span>
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                catalog.filteredProducts.map((product) => {
                  const category = catalog.findCategory(product.category);
                  const variantCount = product.variants?.length ?? 0;
                  return (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="relative size-12 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                            <Image
                              src={
                                product.images[0]?.url ?? DEFAULT_PRODUCT_IMAGE
                              }
                              alt={product.name}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p className="truncate max-w-[240px] font-semibold text-foreground">
                                {product.name}
                              </p>
                              {product.featured && (
                                <Star
                                  className="size-3.5 shrink-0 fill-amber-400 text-amber-400"
                                  aria-label="Produk unggulan"
                                />
                              )}
                            </div>
                            <p className="font-mono text-xs text-muted-foreground">
                              {product.sku}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <Badge
                            variant="secondary"
                            className="text-xs font-medium border border-border"
                          >
                            {category?.shortName ?? product.category}
                          </Badge>
                          {variantCount > 0 && (
                            <Badge
                              variant="outline"
                              className="font-mono text-[10px]"
                            >
                              {variantCount} varian
                            </Badge>
                          )}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="font-mono text-sm font-semibold tabular-nums text-foreground">
                          {formatPrice(product.price, product.currency)}
                        </div>
                        {product.originalPrice && (
                          <div className="font-mono text-[11px] tabular-nums text-muted-foreground line-through">
                            {formatPrice(
                              product.originalPrice,
                              product.currency
                            )}
                          </div>
                        )}
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          {product.links.shopee ? (
                            <a
                              href={product.links.shopee}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 rounded-md bg-shopee-soft px-2 py-1 text-[11px] font-semibold text-shopee-soft-foreground hover:opacity-80"
                            >
                              <ShopeeIcon className="size-3" />
                              <span>Shopee</span>
                            </a>
                          ) : (
                            <span className="rounded-md border border-dashed border-border px-2 py-1 text-[11px] text-muted-foreground/60">
                              Tanpa Shopee
                            </span>
                          )}

                          {product.links.tiktokShop ? (
                            <a
                              href={product.links.tiktokShop}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-[11px] font-semibold text-foreground border border-border hover:opacity-80"
                            >
                              <TikTokShopIcon className="size-3" />
                              <span>TikTok</span>
                            </a>
                          ) : (
                            <span className="rounded-md border border-dashed border-border px-2 py-1 text-[11px] text-muted-foreground/60">
                              Tanpa TikTok
                            </span>
                          )}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={product.inStock}
                            disabled={catalog.togglingId === product.id}
                            onCheckedChange={(checked) =>
                              catalog.toggleStock(product, Boolean(checked))
                            }
                            aria-label={`Ubah status stok ${product.name}`}
                          />
                          <span
                            className={cn(
                              "text-xs font-medium",
                              product.inStock
                                ? "text-status-success"
                                : "text-muted-foreground"
                            )}
                          >
                            {product.inStock ? "Tersedia" : "Habis"}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="inline-flex items-center justify-end gap-1">
                          <Link
                            href={`/products/${product.slug}`}
                            target="_blank"
                            aria-label={`Lihat ${product.name}`}
                            className={cn(
                              buttonVariants({
                                variant: "ghost",
                                size: "icon-sm",
                              })
                            )}
                          >
                            <ExternalLink
                              className="size-3.5"
                              aria-hidden="true"
                            />
                          </Link>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => catalog.openEditForm(product)}
                            aria-label={`Edit ${product.name}`}
                          >
                            <Pencil className="size-3.5" aria-hidden="true" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => catalog.setDeletingProduct(product)}
                            aria-label={`Hapus ${product.name}`}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="size-3.5" aria-hidden="true" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Stacked Cards */}
        <div className="grid grid-cols-1 gap-3 md:hidden">
          {catalog.filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card px-6 py-12 text-center">
              <Package
                className="size-7 text-muted-foreground/50 mb-2.5"
                aria-hidden="true"
              />
              <p className="text-sm font-semibold text-foreground">
                Tidak ada produk yang cocok dengan filter
              </p>
              {catalog.hasActiveFilters && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={catalog.clearFilters}
                  className="mt-3 gap-1.5"
                >
                  <RotateCcw className="size-3.5" aria-hidden="true" />
                  <span>Reset Filter</span>
                </Button>
              )}
            </div>
          ) : (
            catalog.filteredProducts.map((product) => {
              const category = catalog.findCategory(product.category);
              return (
                <Card
                  key={product.id}
                  className="rounded-lg border border-border bg-card p-4 ring-0 gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="relative size-14 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                      <Image
                        src={product.images[0]?.url ?? DEFAULT_PRODUCT_IMAGE}
                        alt={product.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[11px] text-muted-foreground">
                          {product.sku}
                        </span>
                        <Badge
                          variant="secondary"
                          className="text-[10px] border border-border"
                        >
                          {category?.shortName ?? product.category}
                        </Badge>
                      </div>
                      <h2 className="line-clamp-2 text-sm font-semibold text-foreground">
                        {product.name}
                      </h2>
                      <p className="font-mono text-sm font-bold tabular-nums text-foreground">
                        {formatPrice(product.price, product.currency)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-border pt-3 gap-2">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={product.inStock}
                        disabled={catalog.togglingId === product.id}
                        onCheckedChange={(checked) =>
                          catalog.toggleStock(product, Boolean(checked))
                        }
                        aria-label={`Ubah stok ${product.name}`}
                      />
                      <span className="text-xs font-medium text-muted-foreground">
                        {product.inStock ? "Tersedia" : "Habis"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => catalog.openEditForm(product)}
                        className="h-9 min-h-[40px] gap-1.5 px-3 text-xs"
                      >
                        <Pencil className="size-3.5" aria-hidden="true" />
                        <span>Edit</span>
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => catalog.setDeletingProduct(product)}
                        className="h-9 min-h-[40px] px-3 text-xs"
                        aria-label={`Hapus ${product.name}`}
                      >
                        <Trash2 className="size-3.5" aria-hidden="true" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>

      {/* Insert / Edit Modal */}
      <ProductFormDialog
        open={catalog.formOpen}
        onOpenChange={catalog.setFormOpen}
        product={catalog.editingProduct}
        categories={categories}
        motorcycles={motorcycles}
        onSaved={catalog.applySavedProduct}
      />

      {/* Delete Confirmation AlertDialog */}
      <AlertDialog
        open={Boolean(catalog.deletingProduct)}
        onOpenChange={(open) => {
          if (!open) catalog.setDeletingProduct(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus produk ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Produk{" "}
              <strong className="text-foreground">
                {catalog.deletingProduct?.name}
              </strong>{" "}
              (
              <span className="font-mono">{catalog.deletingProduct?.sku}</span>)
              akan dihapus permanen dari katalog CR7 Racing.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={catalog.deleting}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={catalog.confirmDelete}
              disabled={catalog.deleting}
            >
              {catalog.deleting ? "Menghapus..." : "Hapus Produk"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
