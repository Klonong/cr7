"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { CATEGORIES as FALLBACK_CATEGORIES } from "@/data/categories";
import { fetchPublicCategories } from "@/lib/api/category-api";
import type { Category } from "@/types/catalog";

export function useNavbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [categories, setCategories] =
    React.useState<Category[]>(FALLBACK_CATEGORIES);

  const handleMobileOpenChange = React.useCallback((nextOpen: boolean) => {
    setMobileOpen(nextOpen);
    if (nextOpen) {
      fetchPublicCategories()
        .then((list) => setCategories(list))
        .catch(() => {
          // Keep fallback categories if transient fetch fails
        });
    }
  }, []);

  const closeMobileMenu = React.useCallback(() => {
    setMobileOpen(false);
  }, []);

  const isNavItemActive = React.useCallback(
    (href: string) =>
      (href === "/products" && pathname === "/products") ||
      (href === "/about" && pathname === "/about"),
    [pathname]
  );

  return {
    pathname,
    mobileOpen,
    categories,
    handleMobileOpenChange,
    closeMobileMenu,
    isNavItemActive,
  };
}
