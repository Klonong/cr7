"use client";

import {
  Filter,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ProductCard } from "@/components/catalog/product-card";
import { ProductQuickView } from "@/components/catalog/product-quick-view";
import { PRODUCT_BADGES } from "@/config/store";
import {
  useCatalogBrowser,
  useCatalogUrlParams,
} from "@/hooks/catalog/use-catalog-browser";
import type {
  Category,
  CategorySlug,
  MarketplaceFilter,
  Motorcycle,
  Product,
  ProductBadge,
  SortOption,
} from "@/interface/catalog";

const SORT_LABELS: Record<SortOption, string> = {
  featured: "Unggulan",
  "price-asc": "Harga: Terendah",
  "price-desc": "Harga: Tertinggi",
  newest: "Produk Terbaru",
};

interface FilterPanelProps {
  products: Product[];
  categories: Category[];
  motorcycles: Motorcycle[];
  selectedCategories: CategorySlug[];
  toggleCategory: (slug: CategorySlug) => void;
  selectedBike: string;
  setSelectedBike: (bike: string) => void;
  marketplace: MarketplaceFilter;
  setMarketplace: (m: MarketplaceFilter) => void;
  selectedBadges: ProductBadge[];
  toggleBadge: (badge: ProductBadge) => void;
  inStockOnly: boolean;
  setInStockOnly: (checked: boolean) => void;
  onReset: () => void;
  activeCount: number;
}

function FilterPanel({
  products,
  categories,
  motorcycles,
  selectedCategories,
  toggleCategory,
  selectedBike,
  setSelectedBike,
  marketplace,
  setMarketplace,
  selectedBadges,
  toggleBadge,
  inStockOnly,
  setInStockOnly,
  onReset,
  activeCount,
}: FilterPanelProps) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
          <Filter className="size-4 text-primary" aria-hidden="true" />
          Filter Katalog
        </span>
        {activeCount > 0 && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="size-3 mr-1" aria-hidden="true" />
            Reset ({activeCount})
          </Button>
        )}
      </div>

      <Separator />

      {/* Category Filter */}
      <div className="space-y-2.5">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Kategori
        </p>
        <div className="space-y-2">
          {categories.map((category) => {
            const checked = selectedCategories.includes(category.slug);
            const count = products.filter(
              (p) => p.category === category.slug
            ).length;
            return (
              <label
                key={category.slug}
                className="flex cursor-pointer items-center justify-between gap-2 text-sm text-foreground/90 hover:text-foreground"
              >
                <span className="flex items-center gap-2.5 min-w-0">
                  <Checkbox
                    checked={checked}
                    onCheckedChange={() => toggleCategory(category.slug)}
                  />
                  <span className="truncate">{category.shortName}</span>
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  {count}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <Separator />

      {/* Marketplace Availability */}
      <div className="space-y-2.5">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Tersedia di Toko
        </p>
        <div className="grid grid-cols-3 gap-1.5">
          {(
            [
              { value: "all", label: "Semua" },
              { value: "shopee", label: "Shopee" },
              { value: "tiktok", label: "TikTok" },
            ] as const
          ).map((item) => (
            <Button
              key={item.value}
              type="button"
              size="sm"
              variant={marketplace === item.value ? "default" : "outline"}
              onClick={() => setMarketplace(item.value)}
              className="h-8 text-xs"
            >
              {item.label}
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Bike Compatibility */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Kecocokan Motor
          </p>
          {selectedBike && (
            <button
              type="button"
              onClick={() => setSelectedBike("")}
              className="text-[11px] font-medium text-primary hover:underline"
            >
              Hapus
            </button>
          )}
        </div>
        <ScrollArea className="h-44 pr-3">
          <div className="space-y-1">
            {motorcycles.map((moto) => {
              const active = selectedBike === moto.name;
              return (
                <button
                  key={moto.id}
                  type="button"
                  onClick={() => setSelectedBike(active ? "" : moto.name)}
                  className={`flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-xs font-medium transition-colors ${
                    active
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <span className="truncate">{moto.name}</span>
                  {active && <X className="size-3 shrink-0" aria-hidden="true" />}
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      <Separator />

      {/* Highlights / Badges */}
      <div className="space-y-2.5">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Label Produk
        </p>
        <div className="flex flex-wrap gap-1.5">
          {PRODUCT_BADGES.map((badge) => {
            const active = selectedBadges.includes(badge);
            return (
              <button
                key={badge}
                type="button"
                onClick={() => toggleBadge(badge)}
                className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-muted/50 text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                }`}
              >
                {badge}
              </button>
            );
          })}
        </div>
      </div>

      <Separator />

      {/* Stock Filter */}
      <label className="flex cursor-pointer items-center gap-2.5 text-sm text-foreground">
        <Checkbox
          checked={inStockOnly}
          onCheckedChange={(checked) => setInStockOnly(Boolean(checked))}
        />
        <span>Sembunyikan stok habis</span>
      </label>
    </div>
  );
}

export function CatalogBrowser({
  products,
  categories,
  motorcycles,
}: {
  products: Product[];
  categories: Category[];
  motorcycles: Motorcycle[];
}) {
  const { initialCategory, initialBike, initialQuery, urlKey } =
    useCatalogUrlParams();

  return (
    <CatalogBrowserInner
      key={urlKey}
      products={products}
      categories={categories}
      motorcycles={motorcycles}
      initialCategory={initialCategory}
      initialBike={initialBike}
      initialQuery={initialQuery}
    />
  );
}

function CatalogBrowserInner({
  products,
  categories,
  motorcycles,
  initialCategory,
  initialBike,
  initialQuery,
}: {
  products: Product[];
  categories: Category[];
  motorcycles: Motorcycle[];
  initialCategory: CategorySlug | null;
  initialBike: string;
  initialQuery: string;
}) {
  const { filters, quickView, mobileFilterOpen, setMobileFilterOpen } =
    useCatalogBrowser({
      products,
      categories,
      initialCategory,
      initialBike,
      initialQuery,
    });

  const filterPanelProps: FilterPanelProps = {
    products,
    categories,
    motorcycles,
    selectedCategories: filters.selectedCategories,
    toggleCategory: filters.toggleCategory,
    selectedBike: filters.selectedBike,
    setSelectedBike: filters.setSelectedBike,
    marketplace: filters.marketplace,
    setMarketplace: filters.setMarketplace,
    selectedBadges: filters.selectedBadges,
    toggleBadge: filters.toggleBadge,
    inStockOnly: filters.inStockOnly,
    setInStockOnly: filters.setInStockOnly,
    onReset: filters.resetFilters,
    activeCount: filters.activeFilterCount,
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
      {/* Sticky Desktop Sidebar */}
      <aside
        aria-label="Filter katalog"
        className="hidden lg:block sticky top-24 self-start rounded-lg border border-border bg-card p-5"
      >
        <FilterPanel {...filterPanelProps} />
      </aside>

      {/* Main Catalog Area */}
      <div className="space-y-5 min-w-0">
        {/* Top Toolbar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              value={filters.query}
              onChange={(e) => filters.setQuery(e.target.value)}
              placeholder="Cari nama produk, SKU, watt, atau motor..."
              aria-label="Cari aksesoris motor"
              className="h-10 pl-9 pr-9 bg-card"
            />
            {filters.query && (
              <button
                type="button"
                onClick={() => filters.setQuery("")}
                aria-label="Hapus kata pencarian"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-sm p-1 text-muted-foreground hover:text-foreground"
              >
                <X className="size-3.5" aria-hidden="true" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 justify-between sm:justify-end">
            <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
              <SheetTrigger
                type="button"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-10 min-h-[44px] gap-2 lg:hidden"
                )}
              >
                <SlidersHorizontal className="size-4" aria-hidden="true" />
                <span>Filter</span>
                {filters.activeFilterCount > 0 && (
                  <Badge className="ml-0.5 rounded-full px-1.5 py-0 text-[10px]">
                    {filters.activeFilterCount}
                  </Badge>
                )}
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[340px]">
                <SheetHeader className="text-left">
                  <SheetTitle>Filter Aksesoris</SheetTitle>
                  <SheetDescription>
                    Saring produk berdasarkan kategori, tipe motor, atau
                    marketplace.
                  </SheetDescription>
                </SheetHeader>
                <div className="overflow-y-auto px-4 pb-6">
                  <FilterPanel {...filterPanelProps} />
                </div>
              </SheetContent>
            </Sheet>

            <Select
              value={filters.sortBy}
              onValueChange={(val) => {
                if (val) filters.setSortBy(val as SortOption);
              }}
            >
              <SelectTrigger
                aria-label="Urutkan produk"
                className="h-10 min-h-[40px] w-[175px] bg-card"
              >
                <SelectValue>{SORT_LABELS[filters.sortBy]}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Unggulan</SelectItem>
                <SelectItem value="price-asc">Harga: Terendah</SelectItem>
                <SelectItem value="price-desc">Harga: Tertinggi</SelectItem>
                <SelectItem value="newest">Produk Terbaru</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Result Count & Active Filter Chips */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground">
            Menampilkan{" "}
            <span className="font-mono font-semibold text-foreground">
              {filters.filteredProducts.length}
            </span>{" "}
            aksesoris
          </p>

          {filters.activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              {filters.selectedCategories.map((slug) => {
                const cat = categories.find((c) => c.slug === slug);
                return (
                  <Badge
                    key={slug}
                    variant="secondary"
                    className="gap-1 pr-1 text-xs border border-border"
                  >
                    {cat?.shortName ?? slug}
                    <button
                      type="button"
                      onClick={() => filters.toggleCategory(slug)}
                      aria-label={`Hapus filter ${cat?.shortName ?? slug}`}
                      className="rounded-full p-0.5 hover:bg-muted-foreground/20"
                    >
                      <X className="size-3" aria-hidden="true" />
                    </button>
                  </Badge>
                );
              })}
              {filters.selectedBike && (
                <Badge
                  variant="secondary"
                  className="gap-1 pr-1 text-xs border border-border"
                >
                  Motor: {filters.selectedBike}
                  <button
                    type="button"
                    onClick={() => filters.setSelectedBike("")}
                    aria-label={`Hapus filter ${filters.selectedBike}`}
                    className="rounded-full p-0.5 hover:bg-muted-foreground/20"
                  >
                    <X className="size-3" aria-hidden="true" />
                  </button>
                </Badge>
              )}
              {filters.marketplace !== "all" && (
                <Badge
                  variant="secondary"
                  className="gap-1 pr-1 text-xs border border-border"
                >
                  {filters.marketplace === "shopee" ? "Shopee" : "TikTok Shop"}
                  <button
                    type="button"
                    onClick={() => filters.setMarketplace("all")}
                    aria-label="Hapus filter toko"
                    className="rounded-full p-0.5 hover:bg-muted-foreground/20"
                  >
                    <X className="size-3" aria-hidden="true" />
                  </button>
                </Badge>
              )}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={filters.resetFilters}
                className="h-6 px-2 text-xs text-primary hover:text-primary"
              >
                Hapus semua
              </Button>
            </div>
          )}
        </div>

        {/* Product Grid or Empty State */}
        {filters.filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
            {filters.filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                categories={categories}
                onQuickView={quickView.openQuickView}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card px-6 py-16 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground mb-4">
              <Search className="size-5" aria-hidden="true" />
            </div>
            <h3 className="text-base font-semibold text-foreground">
              Tidak ada aksesori yang sesuai filter
            </h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Coba hapus salah satu filter aktif atau cari dengan kata kunci
              seperti &ldquo;LED&rdquo;, &ldquo;CNC&rdquo;, atau
              &ldquo;NMAX&rdquo;.
            </p>
            <Button
              type="button"
              onClick={filters.resetFilters}
              className="mt-5 gap-1.5"
            >
              <RotateCcw className="size-4" aria-hidden="true" />
              Reset Semua Filter
            </Button>
          </div>
        )}
      </div>

      <ProductQuickView
        product={quickView.quickViewProduct}
        categories={categories}
        open={quickView.isOpen}
        onOpenChange={quickView.handleOpenChange}
      />
    </div>
  );
}
