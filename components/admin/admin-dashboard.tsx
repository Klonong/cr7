"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  ExternalLink,
  LogOut,
  Package,
  Pencil,
  Plus,
  Search,
  Star,
  Trash2,
  X,
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
import { BrandLogo } from "@/components/shared/brand-logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { ProductFormDialog } from "@/components/admin/product-form-dialog";
import { DEFAULT_PRODUCT_IMAGE } from "@/config/store";
import { CATEGORIES, getCategoryBySlug } from "@/data/categories";
import { useAdminCatalog } from "@/hooks/use-admin-catalog";
import { logoutAdmin } from "@/lib/api/auth-api";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { CategorySlug, Product } from "@/types/catalog";

interface AdminDashboardProps {
  initialProducts: Product[];
  username: string;
}

export function AdminDashboard({
  initialProducts,
  username,
}: AdminDashboardProps) {
  const router = useRouter();
  const catalog = useAdminCatalog(initialProducts);

  const [formOpen, setFormOpen] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(
    null
  );
  const [deletingProduct, setDeletingProduct] = React.useState<Product | null>(
    null
  );

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setFormOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingProduct) return;
    await catalog.removeProduct(deletingProduct);
    setDeletingProduct(null);
  };

  const handleLogout = async () => {
    await logoutAdmin();
    router.replace("/admin/login");
    router.refresh();
  };

  const selectedCategoryLabel =
    catalog.categoryFilter === "all"
      ? "All Categories"
      : (getCategoryBySlug(catalog.categoryFilter)?.shortName ??
        catalog.categoryFilter);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Dedicated Admin Topbar */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1320px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <BrandLogo
            href={null}
            badge="Admin"
            subtitle={`Signed in as ${username}`}
          />

          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "h-9 gap-1.5 text-xs"
              )}
            >
              <span className="hidden sm:inline">View Storefront</span>
              <span className="sm:hidden">Store</span>
              <ExternalLink
                className="size-3.5 opacity-75"
                aria-hidden="true"
              />
            </Link>

            <ThemeToggle withTooltip={false} />

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="h-9 gap-1.5 text-xs text-destructive hover:text-destructive"
            >
              <LogOut className="size-3.5" aria-hidden="true" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[1320px] flex-1 px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        {/* Heading + Primary Insert Action */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-primary">
              Catalog Management
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Motorcycle Accessories Inventory
            </h1>
            <p className="text-sm text-muted-foreground">
              Insert, edit, toggle stock, or delete products. Changes sync
              immediately to the public storefront.
            </p>
          </div>

          <Button
            type="button"
            onClick={handleOpenCreate}
            className="h-11 min-h-[44px] gap-2 px-5 font-semibold self-start sm:self-auto"
          >
            <Plus className="size-4" aria-hidden="true" />
            <span>Add Product</span>
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <Card className="rounded-lg border border-border bg-card p-4 ring-0 gap-1">
            <p className="text-xs font-medium text-muted-foreground">
              Total Catalog SKUs
            </p>
            <p className="font-mono text-2xl font-extrabold tabular-nums text-foreground">
              {catalog.stats.total}
            </p>
          </Card>

          <Card className="rounded-lg border border-border bg-card p-4 ring-0 gap-1">
            <p className="text-xs font-medium text-muted-foreground">
              Active / In Stock
            </p>
            <div className="flex items-baseline gap-2">
              <p className="font-mono text-2xl font-extrabold tabular-nums text-status-success">
                {catalog.stats.inStock}
              </p>
              <span className="font-mono text-xs text-muted-foreground">
                / {catalog.stats.soldOut} sold out
              </span>
            </div>
          </Card>

          <Card className="rounded-lg border border-border bg-card p-4 ring-0 gap-1">
            <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <ShopeeIcon className="size-3.5 text-shopee" />
              <span>Shopee Linked</span>
            </p>
            <p className="font-mono text-2xl font-extrabold tabular-nums text-foreground">
              {catalog.stats.shopeeLinked}
            </p>
          </Card>

          <Card className="rounded-lg border border-border bg-card p-4 ring-0 gap-1">
            <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <TikTokShopIcon className="size-3.5" />
              <span>TikTok Shop Linked</span>
            </p>
            <p className="font-mono text-2xl font-extrabold tabular-nums text-foreground">
              {catalog.stats.tiktokLinked}
            </p>
          </Card>
        </div>

        {/* Live Feedback Banner */}
        {catalog.feedback && (
          <div
            role="status"
            className={cn(
              "flex items-center justify-between gap-3 rounded-lg border px-4 py-3 text-sm font-medium",
              catalog.feedback.type === "success"
                ? "border-status-success/30 bg-status-success/10 text-status-success"
                : "border-destructive/30 bg-destructive/10 text-destructive"
            )}
          >
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="size-4 shrink-0" aria-hidden="true" />
              <span>{catalog.feedback.message}</span>
            </span>
            <button
              type="button"
              onClick={catalog.clearFeedback}
              aria-label="Dismiss message"
              className="rounded p-1 hover:bg-black/5 dark:hover:bg-white/10"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
        )}

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
              placeholder="Search by product name, SKU, or bike..."
              aria-label="Filter admin catalog"
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
                <SelectValue>{selectedCategoryLabel}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c.slug} value={c.slug}>
                    {c.shortName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex rounded-lg border border-border bg-card p-1">
              {(
                [
                  { id: "all", label: "All" },
                  { id: "in", label: "In Stock" },
                  { id: "out", label: "Sold Out" },
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
                <TableHead className="w-[340px]">Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Marketplaces</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {catalog.filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-32 text-center text-sm text-muted-foreground"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Package
                        className="size-6 opacity-50"
                        aria-hidden="true"
                      />
                      <span>No products match your search criteria.</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                catalog.filteredProducts.map((product) => {
                  const category = getCategoryBySlug(product.category);
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
                                  aria-label="Featured on home"
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
                        <Badge
                          variant="secondary"
                          className="text-xs font-medium"
                        >
                          {category?.shortName ?? product.category}
                        </Badge>
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
                              No Shopee
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
                              No TikTok
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
                            aria-label={`Toggle stock status for ${product.name}`}
                          />
                          <span
                            className={cn(
                              "text-xs font-medium",
                              product.inStock
                                ? "text-status-success"
                                : "text-muted-foreground"
                            )}
                          >
                            {product.inStock ? "In Stock" : "Sold Out"}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="inline-flex items-center justify-end gap-1">
                          <Link
                            href={`/products/${product.slug}`}
                            target="_blank"
                            aria-label={`Preview ${product.name}`}
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
                            onClick={() => handleOpenEdit(product)}
                            aria-label={`Edit ${product.name}`}
                          >
                            <Pencil className="size-3.5" aria-hidden="true" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => setDeletingProduct(product)}
                            aria-label={`Delete ${product.name}`}
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
          {catalog.filteredProducts.map((product) => {
            const category = getCategoryBySlug(product.category);
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
                      <Badge variant="secondary" className="text-[10px]">
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
                      aria-label={`Toggle stock for ${product.name}`}
                    />
                    <span className="text-xs font-medium text-muted-foreground">
                      {product.inStock ? "In Stock" : "Sold Out"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenEdit(product)}
                      className="h-9 min-h-[40px] gap-1.5 px-3 text-xs"
                    >
                      <Pencil className="size-3.5" aria-hidden="true" />
                      <span>Edit</span>
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => setDeletingProduct(product)}
                      className="h-9 min-h-[40px] px-3 text-xs"
                      aria-label={`Delete ${product.name}`}
                    >
                      <Trash2 className="size-3.5" aria-hidden="true" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Insert / Edit Modal */}
      <ProductFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        product={editingProduct}
        onSaved={catalog.applySavedProduct}
      />

      {/* Delete Confirmation AlertDialog */}
      <AlertDialog
        open={Boolean(deletingProduct)}
        onOpenChange={(open) => {
          if (!open) setDeletingProduct(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this accessory?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove{" "}
              <strong className="text-foreground">
                {deletingProduct?.name}
              </strong>{" "}
              (<span className="font-mono">{deletingProduct?.sku}</span>) from
              the live CR7 MOTO catalog. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={catalog.deleting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={catalog.deleting}
            >
              {catalog.deleting ? "Deleting..." : "Delete Product"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
