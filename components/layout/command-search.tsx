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
import {
  CATEGORIES as FALLBACK_CATEGORIES,
  DEFAULT_MOTORCYCLES as FALLBACK_MOTORCYCLES,
} from "@/data/categories";
import { fetchPublicProducts } from "@/lib/api/catalog-api";
import { fetchPublicCategories } from "@/lib/api/category-api";
import { fetchPublicMotorcycles } from "@/lib/api/motorcycle-api";
import { formatPrice } from "@/lib/format";
import type { Category, Motorcycle, Product } from "@/types/catalog";

export function CommandSearch({ onPrimary = false }: { onPrimary?: boolean }) {
  const [open, setOpen] = React.useState(false);
  const [products, setProducts] = React.useState<Product[]>(FALLBACK_PRODUCTS);
  const [categories, setCategories] =
    React.useState<Category[]>(FALLBACK_CATEGORIES);
  const [motorcycles, setMotorcycles] =
    React.useState<Motorcycle[]>(FALLBACK_MOTORCYCLES);
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
      Promise.all([
        fetchPublicProducts(),
        fetchPublicCategories(),
        fetchPublicMotorcycles(),
      ])
        .then(([productList, categoryList, motoList]) => {
          setProducts(productList);
          setCategories(categoryList);
          setMotorcycles(motoList);
        })
        .catch(() => {
          // Keep current cached items on transient network error
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
        aria-label="Cari aksesoris motor di katalog (Ctrl+K)"
        className={
          onPrimary
            ? "relative h-9 w-9 justify-center rounded-lg border-white/25 bg-white/15 px-0 text-[#fefefe] hover:bg-white/25 hover:text-[#fefefe] sm:w-56 sm:justify-start sm:px-3 lg:w-64"
            : "relative h-9 w-9 justify-center rounded-lg border-border bg-muted/60 px-0 text-muted-foreground hover:bg-muted hover:text-foreground sm:w-56 sm:justify-start sm:px-3 lg:w-64"
        }
      >
        <Search className="size-4 shrink-0" aria-hidden="true" />
        <span className="hidden sm:inline-flex truncate text-xs">
          Cari SKU, part, atau motor...
        </span>
        <kbd
          className={
            onPrimary
              ? "pointer-events-none ml-auto hidden h-5 select-none items-center gap-0.5 rounded border border-white/25 bg-black/20 px-1.5 font-mono text-[10px] font-medium text-[#fefefe] sm:inline-flex"
              : "pointer-events-none ml-auto hidden h-5 select-none items-center gap-0.5 rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:inline-flex"
          }
        >
          Ctrl K
        </kbd>
      </Button>

      <CommandDialog
        open={open}
        onOpenChange={handleOpenChange}
        title="Cari Katalog CR7 Racing"
        description="Cari aksesoris berdasarkan nama produk, kode SKU, kategori, atau tipe motor."
      >
        <Command>
          <CommandInput placeholder="Ketik nama produk, SKU (mis. CR7-SQL3), atau motor (mis. NMAX)..." />
          <CommandList>
            <CommandEmpty>
              Aksesoris motor yang dicari tidak ditemukan.
            </CommandEmpty>

            <CommandGroup heading="Produk">
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
                        {product.sku} ·{" "}
                        {product.shortSpecs.slice(0, 2).join(" · ")}
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

            <CommandGroup heading="Filter Kategori">
              {categories.map((category) => (
                <CommandItem
                  key={category.slug}
                  value={`kategori ${category.name} ${category.shortName}`}
                  onSelect={() =>
                    navigate(`/products?category=${category.slug}`)
                  }
                >
                  <Tag className="size-4 text-primary" aria-hidden="true" />
                  <span>{category.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Filter Tipe Motor">
              {motorcycles.map((moto) => (
                <CommandItem
                  key={moto.id}
                  value={`motor ${moto.name} ${moto.brand} ${moto.type}`}
                  onSelect={() =>
                    navigate(`/products?bike=${encodeURIComponent(moto.name)}`)
                  }
                >
                  <Bike
                    className="size-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <span>Cocok untuk {moto.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
