"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { fetchPublicCategories } from "@/lib/api/category-api";
import type { Category } from "@/interface/catalog";

export function useNavbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [categories, setCategories] = React.useState<Category[]>([]);

  React.useEffect(() => {
    let active = true;
    fetchPublicCategories()
      .then((list) => {
        if (active) setCategories(list);
      })
      .catch(() => {
        // Ignore transient network errors
      });
    return () => {
      active = false;
    };
  }, []);

  const handleMobileOpenChange = React.useCallback((nextOpen: boolean) => {
    setMobileOpen(nextOpen);
    if (nextOpen) {
      fetchPublicCategories()
        .then((list) => setCategories(list))
        .catch(() => {
          // Keep current categories if transient fetch fails
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
