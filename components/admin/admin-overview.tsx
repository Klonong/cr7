import Image from "next/image";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Bike,
  CheckCircle2,
  ExternalLink,
  FolderPlus,
  LayoutTemplate,
  Package,
  Sparkles,
  Star,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { buttonVariants } from "@/components/ui/button";
import { AdminHeader } from "@/components/admin/admin-header";
import {
  ShopeeIcon,
  TikTokShopIcon,
} from "@/components/icons/marketplace-icons";
import { DEFAULT_PRODUCT_IMAGE } from "@/config/store";
import {
  computeCatalogStats,
  computeCategoryBreakdown,
  getCatalogAttentionItems,
} from "@/lib/catalog-filters";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Category, Product } from "@/types/catalog";
import type { HomeContent } from "@/types/home";

interface AdminOverviewProps {
  products: Product[];
  categories: Category[];
  homeContent: HomeContent;
  username: string;
}

const REASON_LABELS: Record<string, string> = {
  "Sold Out": "Stok Habis",
  "No Shopee Link": "Tanpa Link Shopee",
  "No TikTok Link": "Tanpa Link TikTok",
};

export function AdminOverview({
  products,
  categories,
  homeContent,
  username,
}: AdminOverviewProps) {
  const stats = computeCatalogStats(products);
  const featuredCount = products.filter((p) => p.featured).length;
  const activeHighlights = homeContent.highlights.filter((h) => h.active);
  const categoryBreakdown = computeCategoryBreakdown(
    products,
    categories.map((c) => c.slug)
  );
  const attentionItems = getCatalogAttentionItems(products);

  const shopeeCoverage =
    stats.total > 0 ? Math.round((stats.shopeeLinked / stats.total) * 100) : 0;
  const tiktokCoverage =
    stats.total > 0 ? Math.round((stats.tiktokLinked / stats.total) * 100) : 0;

  const enabledSectionsCount = [
    homeContent.sections.showTrustStrip,
    homeContent.sections.showBikeFitmentStrip,
    homeContent.sections.showCategoriesGrid,
    homeContent.sections.showHighlights,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AdminHeader username={username} />

      <div className="mx-auto w-full max-w-[1320px] flex-1 px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Welcome Header + Quick Actions */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-1">
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-primary">
              Pusat Kontrol CR7 Racing
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Dashboard Admin
            </h1>
            <p className="text-sm text-muted-foreground">
              Pantau stok aksesoris motor, cakupan link Shopee &amp; TikTok
              Shop, kategori, motor kompatibel, serta sorotan beranda.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/admin/products"
              className={cn(
                buttonVariants({ variant: "default" }),
                "h-10 min-h-[42px] gap-2 px-4 font-semibold"
              )}
            >
              <Package className="size-4" aria-hidden="true" />
              <span>Kelola Produk</span>
            </Link>

            <Link
              href="/admin/categories/new"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-10 min-h-[42px] gap-2 px-3.5 font-semibold"
              )}
            >
              <FolderPlus className="size-4" aria-hidden="true" />
              <span>Tambah Kategori</span>
            </Link>

            <Link
              href="/admin/motorcycles/new"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-10 min-h-[42px] gap-2 px-3.5 font-semibold"
              )}
            >
              <Bike className="size-4" aria-hidden="true" />
              <span>Tambah Motor</span>
            </Link>

            <Link
              href="/admin/home"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-10 min-h-[42px] gap-2 px-3.5 font-semibold"
              )}
            >
              <LayoutTemplate className="size-4" aria-hidden="true" />
              <span>Beranda</span>
            </Link>
          </div>
        </div>

        {/* 4 Top KPI Cards */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <Card className="rounded-xl border border-border bg-card p-5 ring-0 gap-1.5">
            <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
              <span>Total SKU Produk</span>
              <Package className="size-4 text-primary" aria-hidden="true" />
            </div>
            <p className="font-mono text-3xl font-extrabold tabular-nums text-foreground">
              {stats.total}
            </p>
            <p className="text-xs text-muted-foreground">
              {featuredCount} produk unggulan beranda
            </p>
          </Card>

          <Card className="rounded-xl border border-border bg-card p-5 ring-0 gap-1.5">
            <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
              <span>Kesehatan Stok</span>
              <CheckCircle2
                className="size-4 text-status-success"
                aria-hidden="true"
              />
            </div>
            <div className="flex items-baseline gap-2">
              <p className="font-mono text-3xl font-extrabold tabular-nums text-status-success">
                {stats.inStock}
              </p>
              <span className="font-mono text-xs text-muted-foreground">
                tersedia
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.soldOut === 0
                ? "Semua produk siap order"
                : `${stats.soldOut} produk stok habis`}
            </p>
          </Card>

          <Card className="rounded-xl border border-border bg-card p-5 ring-0 gap-1.5">
            <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
              <span>Link Marketplace</span>
              <span className="inline-flex items-center gap-1">
                <ShopeeIcon className="size-3.5 text-shopee" />
                <TikTokShopIcon className="size-3.5" />
              </span>
            </div>
            <div className="flex items-baseline gap-3">
              <div>
                <span className="font-mono text-2xl font-extrabold tabular-nums text-foreground">
                  {stats.shopeeLinked}
                </span>
                <span className="ml-1 text-[11px] text-muted-foreground">
                  Shopee
                </span>
              </div>
              <span className="text-border">/</span>
              <div>
                <span className="font-mono text-2xl font-extrabold tabular-nums text-foreground">
                  {stats.tiktokLinked}
                </span>
                <span className="ml-1 text-[11px] text-muted-foreground">
                  TikTok
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              {shopeeCoverage}% Shopee · {tiktokCoverage}% TikTok
            </p>
          </Card>

          <Card className="rounded-xl border border-border bg-card p-5 ring-0 gap-1.5">
            <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
              <span>Sorotan Carousel</span>
              <Sparkles className="size-4 text-primary" aria-hidden="true" />
            </div>
            <div className="flex items-baseline gap-2">
              <p className="font-mono text-3xl font-extrabold tabular-nums text-foreground">
                {activeHighlights.length}
              </p>
              <span className="font-mono text-xs text-muted-foreground">
                / {homeContent.highlights.length} total
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {enabledSectionsCount} dari 4 bagian beranda aktif
            </p>
          </Card>
        </div>

        {/* Middle Analytics & Attention Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Category Breakdown + Marketplace Readiness */}
          <Card className="lg:col-span-7 rounded-xl border border-border bg-card p-5 sm:p-6 ring-0 space-y-6">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-bold text-foreground">
                  Distribusi Kategori Katalog
                </h2>
                <p className="text-xs text-muted-foreground">
                  Sebaran produk aksesoris motor di {categories.length} kategori
                  aktif.
                </p>
              </div>
              <Link
                href="/admin/categories"
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                <span>Kelola Kategori</span>
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            </div>

            <div className="space-y-3.5">
              {categoryBreakdown.map((item) => {
                const cat = categories.find((c) => c.slug === item.slug);
                return (
                  <div key={item.slug} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-foreground">
                        {cat?.name ?? item.slug}
                      </span>
                      <span className="font-mono text-muted-foreground tabular-nums">
                        {item.count} SKU ({item.percentage}%)
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${Math.max(item.percentage, 3)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <Separator />

            {/* Marketplace Coverage Meters */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Cakupan Link Checkout Marketplace
              </h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-border bg-muted/35 p-3.5 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="inline-flex items-center gap-1.5 font-semibold text-foreground">
                      <ShopeeIcon className="size-4 text-shopee" />
                      Shopee
                    </span>
                    <span className="font-mono font-bold tabular-nums text-foreground">
                      {shopeeCoverage}%
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-shopee"
                      style={{ width: `${shopeeCoverage}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    {stats.shopeeLinked} dari {stats.total} produk memiliki link
                    Shopee
                  </p>
                </div>

                <div className="rounded-lg border border-border bg-muted/35 p-3.5 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="inline-flex items-center gap-1.5 font-semibold text-foreground">
                      <TikTokShopIcon className="size-4" />
                      TikTok Shop
                    </span>
                    <span className="font-mono font-bold tabular-nums text-foreground">
                      {tiktokCoverage}%
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-foreground"
                      style={{ width: `${tiktokCoverage}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    {stats.tiktokLinked} dari {stats.total} produk memiliki link
                    TikTok Shop
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Needs Attention Queue */}
          <Card className="lg:col-span-5 rounded-xl border border-border bg-card p-5 sm:p-6 ring-0 flex flex-col justify-between gap-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h2 className="flex items-center gap-2 text-base font-bold text-foreground">
                    <AlertTriangle
                      className="size-4 text-status-warning"
                      aria-hidden="true"
                    />
                    <span>Perlu Perhatian</span>
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Produk dengan stok habis atau link Shopee / TikTok belum
                    lengkap.
                  </p>
                </div>
                <Badge
                  variant="secondary"
                  className="font-mono text-xs border border-border"
                >
                  {attentionItems.length}
                </Badge>
              </div>

              {attentionItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/25 px-4 py-10 text-center">
                  <CheckCircle2
                    className="size-7 text-status-success mb-2"
                    aria-hidden="true"
                  />
                  <p className="text-sm font-semibold text-foreground">
                    Semua produk lengkap!
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Seluruh produk tersedia dan terhubung ke Shopee serta TikTok
                    Shop.
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-border rounded-lg border border-border overflow-hidden">
                  {attentionItems.slice(0, 6).map(({ product, reasons }) => (
                    <li
                      key={product.id}
                      className="flex items-center justify-between gap-3 bg-card px-3.5 py-3 hover:bg-muted/40 transition-colors"
                    >
                      <div className="min-w-0 space-y-1">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {product.name}
                        </p>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="font-mono text-[11px] text-muted-foreground">
                            {product.sku}
                          </span>
                          {reasons.map((reason) => (
                            <Badge
                              key={reason}
                              variant={
                                reason === "Sold Out"
                                  ? "destructive"
                                  : "secondary"
                              }
                              className="text-[10px] px-1.5 py-0 border border-border"
                            >
                              {REASON_LABELS[reason] ?? reason}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Link
                        href="/admin/products"
                        className="shrink-0 text-xs font-semibold text-primary hover:underline"
                      >
                        Perbaiki →
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <Link
              href="/admin/products"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "w-full gap-1.5 text-xs font-semibold"
              )}
            >
              <span>Tinjau Semua Produk di Katalog</span>
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          </Card>
        </div>

        {/* Bottom Snapshots */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <Card className="lg:col-span-7 rounded-xl border border-border bg-card p-5 sm:p-6 ring-0 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-bold text-foreground">
                  Ringkasan Produk Terbaru
                </h2>
                <p className="text-xs text-muted-foreground">
                  Daftar cepat aksesoris motor di katalog CR7 Racing.
                </p>
              </div>
              <Link
                href="/admin/products"
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                <span>Kelola semua ({stats.total})</span>
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            </div>

            <div className="divide-y divide-border rounded-lg border border-border overflow-hidden">
              {products.slice(0, 5).map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between gap-3 px-3.5 py-2.5 bg-card"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative size-10 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                      <Image
                        src={product.images[0]?.url ?? DEFAULT_PRODUCT_IMAGE}
                        alt={product.name}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {product.name}
                        </p>
                        {product.featured && (
                          <Star className="size-3 shrink-0 fill-amber-400 text-amber-400" />
                        )}
                      </div>
                      <p className="font-mono text-[11px] text-muted-foreground">
                        {product.sku} · {product.variants?.length ?? 0} varian
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-mono text-xs font-bold tabular-nums text-foreground">
                      {formatPrice(product.price, product.currency)}
                    </span>
                    <Badge
                      variant={product.inStock ? "secondary" : "destructive"}
                      className="text-[10px] border border-border"
                    >
                      {product.inStock ? "Tersedia" : "Habis"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="lg:col-span-5 rounded-xl border border-border bg-card p-5 sm:p-6 ring-0 flex flex-col justify-between gap-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h2 className="text-base font-bold text-foreground">
                    Konfigurasi Beranda Aktif
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Headline hero dan slide sorotan carousel saat ini.
                  </p>
                </div>
                <Link
                  href="/admin/home"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                >
                  <span>Edit</span>
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </Link>
              </div>

              <div className="rounded-lg border border-border bg-muted/35 p-4 space-y-2">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-primary">
                  Headline Hero Aktif
                </p>
                <p className="text-sm font-bold leading-snug text-foreground">
                  {homeContent.hero.headline}
                </p>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  Sorotan Hero: {homeContent.hero.spotlightTitle || "Belum diatur"}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Slide Carousel Aktif ({activeHighlights.length})
                </p>
                {activeHighlights.length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    Belum ada slide sorotan aktif di beranda.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {activeHighlights.slice(0, 3).map((hl) => (
                      <div
                        key={hl.id}
                        className="flex items-center justify-between gap-2 rounded-lg border border-border px-3 py-2 text-xs"
                      >
                        <div className="min-w-0">
                          <p className="font-mono text-[10px] font-semibold text-primary truncate">
                            {hl.badge}
                          </p>
                          <p className="truncate font-medium text-foreground">
                            {hl.title}
                          </p>
                        </div>
                        <Badge className="shrink-0 text-[10px]">Aktif</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/admin/home"
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "gap-1.5 text-xs font-semibold"
                )}
              >
                <Sparkles className="size-3.5" aria-hidden="true" />
                <span>Atur Beranda</span>
              </Link>
              <Link
                href="/"
                target="_blank"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "gap-1.5 text-xs font-semibold"
                )}
              >
                <span>Buka Toko</span>
                <ExternalLink className="size-3.5" aria-hidden="true" />
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
