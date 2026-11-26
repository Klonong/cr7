"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { fetchPublicProducts } from "@/lib/api/catalog-api";
import { fetchPublicCategories } from "@/lib/api/category-api";
import { fetchPublicMotorcycles } from "@/lib/api/motorcycle-api";
import type { Category, Motorcycle, Product } from "@/interface/catalog";

export function useCommandSearch() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [motorcycles, setMotorcycles] = React.useState<Motorcycle[]>([]);

  const syncLiveCatalog = React.useCallback(() => {
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
  }, []);

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      setOpen(nextOpen);
      if (nextOpen) {
        syncLiveCatalog();
      }
    },
    [syncLiveCatalog]
  );

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => {
          const next = !prev;
          if (next) syncLiveCatalog();
          return next;
        });
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [syncLiveCatalog]);

  const navigate = React.useCallback(
    (href: string) => {
      setOpen(false);
      router.push(href);
    },
    [router]
  );

  return {
    open,
    products,
    categories,
    motorcycles,
    handleOpenChange,
    openSearch: () => handleOpenChange(true),
    navigate,
  };
}
