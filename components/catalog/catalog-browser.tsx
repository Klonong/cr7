"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import {
  Filter,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { BIKE_MODELS, CATEGORIES } from "@/data/categories";
import { useProductFilters } from "@/hooks/use-product-filters";
import type {
  CategorySlug,
  MarketplaceFilter,
  Product,
  ProductBadge,
  SortOption,
} from "@/types/catalog";

const SORT_LABELS: Record<SortOption, string> = {
  featured: "Featured",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
  newest: "Newest Arrivals",
};

interface FilterPanelProps {
  products: Product[];
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
          Catalog Filters
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
          Category
        </p>
        <div className="space-y-2">
          {CATEGORIES.map((category) => {
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
          Marketplace Link
        </p>
        <div className="grid grid-cols-3 gap-1.5">
          {(
            [
              { value: "all", label: "All" },
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
            Bike Compatibility
          </p>
          {selectedBike && (
            <button
              type="button"
              onClick={() => setSelectedBike("")}
              className="text-[11px] font-medium text-primary hover:underline"
            >
              Clear
            </button>
          )}
        </div>
        <ScrollArea className="h-44 pr-3">
          <div className="space-y-1">
            {BIKE_MODELS.map((bike) => {
              const active = selectedBike === bike;
              return (
                <button
                  key={bike}
                  type="button"
                  onClick={() => setSelectedBike(active ? "" : bike)}
                  className={`flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-xs font-medium transition-colors ${
                    active
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <span>{bike}</span>
                  {active && <X className="size-3" aria-hidden="true" />}
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
          Highlights
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
        <span>Hide Sold Out items</span>
      </label>
    </div>
  );
}

export function CatalogBrowser({ products }: { products: Product[] }) {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") as CategorySlug | null;
  const initialBike = searchParams.get("bike") ?? "";
  const initialQuery = searchParams.get("q") ?? "";

  return (
    <CatalogBrowserInner
      key={`${initialCategory ?? ""}|${initialBike}|${initialQuery}`}
      products={products}
      initialCategory={initialCategory}
      initialBike={initialBike}
      initialQuery={initialQuery}
    />
  );
}

function CatalogBrowserInner({
  products,
  initialCategory,
  initialBike,
  initialQuery,
}: {
  products: Product[];
  initialCategory: CategorySlug | null;
  initialBike: string;
  initialQuery: string;
}) {
  const filters = useProductFilters({
    products,
    initialCategory,
    initialBike,
    initialQuery,
  });

  const [quickViewProduct, setQuickViewProduct] =
    React.useState<Product | null>(null);
  const [mobileFilterOpen, setMobileFilterOpen] = React.useState(false);

  const filterPanelProps: FilterPanelProps = {
    products,
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
        aria-label="Catalog filters"
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
              placeholder="Search part name, SKU, wattage, or bike..."
              aria-label="Search motorcycle accessories"
              className="h-10 pl-9 pr-9 bg-card"
            />
            {filters.query && (
              <button
                type="button"
                onClick={() => filters.setQuery("")}
                aria-label="Clear search query"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-sm p-1 text-muted-foreground hover:text-foreground"
              >
                <X className="size-3.5" aria-hidden="true" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 justify-between sm:justify-end">
            <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
              <SheetTrigger
                render={
                  <Button
                    type="button"
                    variant="outline"
                    className="h-10 min-h-[44px] gap-2 lg:hidden"
                  />
                }
              >
                <SlidersHorizontal className="size-4" aria-hidden="true" />
                <span>Filters</span>
                {filters.activeFilterCount > 0 && (
                  <Badge className="ml-0.5 rounded-full px-1.5 py-0 text-[10px]">
                    {filters.activeFilterCount}
                  </Badge>
                )}
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[340px]">
                <SheetHeader className="text-left">
                  <SheetTitle>Filter Accessories</SheetTitle>
                  <SheetDescription>
                    Narrow down parts by category, bike fitment, or marketplace.
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
                aria-label="Sort products"
                className="h-10 min-h-[40px] w-[175px] bg-card"
              >
                <SelectValue>{SORT_LABELS[filters.sortBy]}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="newest">Newest Arrivals</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Result Count & Active Filter Chips */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-mono font-semibold text-foreground">
              {filters.filteredProducts.length}
            </span>{" "}
            {filters.filteredProducts.length === 1 ? "accessory" : "accessories"}
          </p>

          {filters.activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              {filters.selectedCategories.map((slug) => {
                const cat = CATEGORIES.find((c) => c.slug === slug);
                return (
                  <Badge
                    key={slug}
                    variant="secondary"
                    className="gap-1 pr-1 text-xs"
                  >
                    {cat?.shortName ?? slug}
                    <button
                      type="button"
                      onClick={() => filters.toggleCategory(slug)}
                      aria-label={`Remove ${cat?.shortName ?? slug} filter`}
                      className="rounded-full p-0.5 hover:bg-muted-foreground/20"
                    >
                      <X className="size-3" aria-hidden="true" />
                    </button>
                  </Badge>
                );
              })}
              {filters.selectedBike && (
                <Badge variant="secondary" className="gap-1 pr-1 text-xs">
                  Fits: {filters.selectedBike}
                  <button
                    type="button"
                    onClick={() => filters.setSelectedBike("")}
                    aria-label={`Remove ${filters.selectedBike} filter`}
                    className="rounded-full p-0.5 hover:bg-muted-foreground/20"
                  >
                    <X className="size-3" aria-hidden="true" />
                  </button>
                </Badge>
              )}
              {filters.marketplace !== "all" && (
                <Badge variant="secondary" className="gap-1 pr-1 text-xs">
                  {filters.marketplace === "shopee" ? "Shopee" : "TikTok Shop"}
                  <button
                    type="button"
                    onClick={() => filters.setMarketplace("all")}
                    aria-label="Remove marketplace filter"
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
                Clear all
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
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card px-6 py-16 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground mb-4">
              <Search className="size-5" aria-hidden="true" />
            </div>
            <h3 className="text-base font-semibold text-foreground">
              No accessories match your filters
            </h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Try clearing one of your active filters or searching with a broader
              term like &ldquo;LED&rdquo;, &ldquo;CNC&rdquo;, or &ldquo;NMAX&rdquo;.
            </p>
            <Button
              type="button"
              onClick={filters.resetFilters}
              className="mt-5 gap-1.5"
            >
              <RotateCcw className="size-4" aria-hidden="true" />
              Reset All Filters
            </Button>
          </div>
        )}
      </div>

      <ProductQuickView
        product={quickViewProduct}
        open={Boolean(quickViewProduct)}
        onOpenChange={(open) => {
          if (!open) setQuickViewProduct(null);
        }}
      />
    </div>
  );
}
