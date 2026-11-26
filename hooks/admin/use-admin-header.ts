"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { logoutAdmin } from "@/lib/api/auth-api";

export function useAdminHeader() {
  const pathname = usePathname();
  const router = useRouter();

  const isNavItemActive = React.useCallback(
    (href: string, exact: boolean) =>
      exact ? pathname === href : pathname.startsWith(href),
    [pathname]
  );

  const handleLogout = React.useCallback(async () => {
    await logoutAdmin();
    router.replace("/admin/login");
    router.refresh();
  }, [router]);

  return {
    pathname,
    isNavItemActive,
    handleLogout,
  };
}
