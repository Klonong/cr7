"use client";

import Link from "next/link";
import {
  Bike,
  ExternalLink,
  FolderTree,
  LayoutDashboard,
  LayoutTemplate,
  LogOut,
  Package,
  ShieldCheck,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { BrandLogo } from "@/components/shared/brand-logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { useAdminHeader } from "@/hooks/admin/use-admin-header";
import { cn } from "@/lib/utils";

const ADMIN_NAV_ITEMS = [
  {
    href: "/admin",
    label: "Dashboard",
    shortLabel: "Dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: "/admin/products",
    label: "Produk",
    shortLabel: "Produk",
    icon: Package,
    exact: false,
  },
  {
    href: "/admin/categories",
    label: "Kategori",
    shortLabel: "Kategori",
    icon: FolderTree,
    exact: false,
  },
  {
    href: "/admin/motorcycles",
    label: "Tipe Motor",
    shortLabel: "Motor",
    icon: Bike,
    exact: false,
  },
  {
    href: "/admin/home",
    label: "Beranda & Sorotan",
    shortLabel: "Beranda",
    icon: LayoutTemplate,
    exact: false,
  },
  {
    href: "/admin/users",
    label: "Akun Admin",
    shortLabel: "Admin",
    icon: ShieldCheck,
    exact: false,
  },
] as const;

interface AdminHeaderProps {
  username: string;
}

export function AdminHeader({ username }: AdminHeaderProps) {
  const { isNavItemActive, handleLogout } = useAdminHeader();

  return (
    <header className="sticky top-0 z-40 border-b border-white/15 bg-[#000000] text-[#fefefe] shadow-sm">
      <div className="mx-auto flex min-h-20 max-w-[1320px] items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-3.5 lg:px-8">
        <div className="flex items-center gap-4 lg:gap-5 min-w-0">
          <BrandLogo
            href="/admin"
            badge="Admin"
            subtitle={`Masuk sebagai ${username}`}
            onDark
          />

          <nav
            aria-label="Navigasi panel admin"
            className="hidden xl:flex items-center gap-1 rounded-lg border border-white/15 bg-zinc-900 p-1"
          >
            {ADMIN_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = isNavItemActive(item.href, item.exact);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "inline-flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors",
                    isActive
                      ? "bg-primary text-[#fefefe] shadow-xs"
                      : "text-zinc-300 hover:bg-white/10 hover:text-[#fefefe]"
                  )}
                >
                  <Icon className="size-3.5" aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "h-9 gap-1.5 border-white/20 bg-white/10 text-xs text-[#fefefe] hover:bg-white/20 hover:text-[#fefefe]"
            )}
          >
            <span className="hidden sm:inline">Lihat Toko</span>
            <span className="sm:hidden">Toko</span>
            <ExternalLink className="size-3.5 opacity-85" aria-hidden="true" />
          </Link>

          <ThemeToggle
            withTooltip={false}
            className="text-[#fefefe] hover:bg-white/10 hover:text-[#fefefe]"
          />

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="h-9 gap-1.5 border-primary/50 bg-primary/15 text-xs text-[#fefefe] hover:bg-primary hover:text-[#fefefe]"
          >
            <LogOut className="size-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">Keluar</span>
          </Button>
        </div>
      </div>

      {/* Tablet & Mobile Admin Sub-Navigation */}
      <nav
        aria-label="Navigasi panel admin mobile"
        className="no-scrollbar flex overflow-x-auto border-t border-white/10 bg-zinc-950 px-4 py-2 gap-1.5 xl:hidden"
      >
        {ADMIN_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = isNavItemActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "inline-flex min-h-[36px] shrink-0 items-center justify-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors",
                isActive
                  ? "border-primary bg-primary text-[#fefefe] shadow-xs"
                  : "border-white/15 bg-zinc-900 text-zinc-300"
              )}
            >
              <Icon className="size-3.5 shrink-0" aria-hidden="true" />
              <span>{item.shortLabel}</span>
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
