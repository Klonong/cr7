"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { PRODUCTS as FALLBACK_PRODUCTS } from "@/data/products";
import {
  CATEGORIES as FALLBACK_CATEGORIES,
  DEFAULT_MOTORCYCLES as FALLBACK_MOTORCYCLES,
} from "@/data/categories";
import { fetchPublicProducts } from "@/lib/api/catalog-api";
import { fetchPublicCategories } from "@/lib/api/category-api";
import { fetchPublicMotorcycles } from "@/lib/api/motorcycle-api";
import type { Category, Motorcycle, Product } from "@/types/catalog";

export function useCommandSearch() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [products, setProducts] = React.useState<Product[]>(FALLBACK_PRODUCTS);
  const [categories, setCategories] =
    React.useState<Category[]>(FALLBACK_CATEGORIES);
  const [motorcycles, setMotorcycles] =
    React.useState<Motorcycle[]>(FALLBACK_MOTORCYCLES);

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
