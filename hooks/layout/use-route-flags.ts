"use client";

import { usePathname } from "next/navigation";

export function useRouteFlags() {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");
  const isProductDetail =
    pathname.startsWith("/products/") && pathname !== "/products";

  return {
    pathname,
    isAdminRoute,
    isProductDetail,
  };
}
