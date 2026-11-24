"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, Bike, Package, Tag } from "lucide-react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { PRODUCTS as FALLBACK_PRODUCTS } from "@/data/products";
import { BIKE_MODELS, CATEGORIES } from "@/data/categories";
import { fetchPublicProducts } from "@/lib/api/catalog-api";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/types/catalog";

export function CommandSearch() {
  const [open, setOpen] = React.useState(false);
  const [products, setProducts] = React.useState<Product[]>(FALLBACK_PRODUCTS);
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleOpenChange = React.useCallback((nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen) {
      fetchPublicProducts()
        .then((list) => setProducts(list))
        .catch(() => {
          // Keep current products on transient network error
        });
    }
  }, []);

  const navigate = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={() => handleOpenChange(true)}
        aria-label="Search motorcycle accessories catalog (Ctrl+K)"
        className="relative h-9 w-9 justify-center rounded-lg border-border bg-muted/60 px-0 text-muted-foreground hover:bg-muted hover:text-foreground sm:w-56 sm:justify-start sm:px-3 lg:w-64"
      >
        <Search className="size-4 shrink-0" aria-hidden="true" />
        <span className="hidden sm:inline-flex truncate text-xs">
          Search SKU, part, or bike...
        </span>
        <kbd className="pointer-events-none ml-auto hidden h-5 select-none items-center gap-0.5 rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:inline-flex">
          Ctrl K
        </kbd>
      </Button>

      <CommandDialog
        open={open}
        onOpenChange={handleOpenChange}
        title="Search CR7 Moto Catalog"
        description="Search accessories by name, SKU, category, or motorcycle model."
      >
        <Command>
          <CommandInput placeholder="Type product name, SKU (e.g. CR7-SQL3), or bike (e.g. NMAX)..." />
          <CommandList>
            <CommandEmpty>
              No matching motorcycle accessories found.
            </CommandEmpty>

            <CommandGroup heading="Products">
              {products.map((product) => (
                <CommandItem
                  key={product.id}
                  value={`${product.name} ${product.sku} ${product.shortSpecs.join(" ")} ${product.compatibility.join(" ")}`}
                  onSelect={() => navigate(`/products/${product.slug}`)}
                  className="flex items-center justify-between gap-2 py-2"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Package
                      className="size-4 shrink-0 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {product.name}
                      </p>
                      <p className="truncate font-mono text-[11px] text-muted-foreground">
                        {product.sku} · {product.shortSpecs.slice(0, 2).join(" · ")}
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 font-mono text-xs font-semibold tabular-nums text-foreground">
                    {formatPrice(product.price, product.currency)}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Filter by Category">
              {CATEGORIES.map((category) => (
                <CommandItem
                  key={category.slug}
                  value={`category ${category.name} ${category.shortName}`}
                  onSelect={() => navigate(`/products?category=${category.slug}`)}
                >
                  <Tag className="size-4 text-primary" aria-hidden="true" />
                  <span>{category.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Filter by Motorcycle Model">
              {BIKE_MODELS.map((bike) => (
                <CommandItem
                  key={bike}
                  value={`bike ${bike}`}
                  onSelect={() =>
                    navigate(`/products?bike=${encodeURIComponent(bike)}`)
                  }
                >
                  <Bike
                    className="size-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <span>Fits {bike}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
