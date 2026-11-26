"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CommandSearch } from "@/components/layout/command-search";
import { BrandLogo } from "@/components/shared/brand-logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { OfficialStoreLinks } from "@/components/shared/official-store-links";
import { PRIMARY_NAV_LINKS } from "@/config/store";
import { useNavbar } from "@/hooks/layout/use-navbar";
import { cn } from "@/lib/utils";

export function Navbar() {
  const {
    mobileOpen,
    categories,
    handleMobileOpenChange,
    closeMobileMenu,
    isNavItemActive,
  } = useNavbar();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/15 bg-[#000000] text-[#fefefe] shadow-sm">
      <div className="mx-auto flex min-h-20 max-w-[1320px] items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-3.5 lg:px-8">
        {/* Brand Logo */}
        <BrandLogo href="/" onDark />

        {/* Center Desktop Navigation */}
        <nav
          aria-label="Navigasi katalog utama"
          className="hidden lg:flex items-center gap-1"
        >
          {PRIMARY_NAV_LINKS.map((item) => {
            const isActive = isNavItemActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-white/10 hover:text-[#fefefe] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  isActive
                    ? "bg-primary text-[#fefefe] font-semibold"
                    : "text-zinc-300"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Utilities — Search, Official Store Links, Theme Toggle */}
        <div className="flex items-center gap-2">
          <CommandSearch onPrimary />

          <OfficialStoreLinks
            layout="inline"
            className="hidden xl:flex pl-1"
          />

          <ThemeToggle className="text-[#fefefe] hover:bg-white/10 hover:text-[#fefefe]" />

          {/* Mobile Menu Drawer */}
          <Sheet open={mobileOpen} onOpenChange={handleMobileOpenChange}>
            <SheetTrigger
              type="button"
              aria-label="Buka menu navigasi"
              className={cn(
                buttonVariants({ variant: "outline", size: "icon" }),
                "size-9 min-h-[44px] min-w-[44px] border-white/20 bg-white/10 text-[#fefefe] hover:bg-white/20 hover:text-[#fefefe] lg:hidden"
              )}
            >
              <Menu className="size-5" aria-hidden="true" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[340px]">
              <SheetHeader className="text-left">
                <SheetTitle>
                  <BrandLogo href={null} size="sm" />
                </SheetTitle>
                <SheetDescription>
                  Jelajahi katalog aksesori motor dan order langsung di toko
                  resmi Shopee atau TikTok Shop.
                </SheetDescription>
              </SheetHeader>

              <div className="flex flex-col gap-4 px-4 pb-6 overflow-y-auto">
                <div className="space-y-1">
                  <p className="px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Menu &amp; Kategori
                  </p>
                  <Link
                    href="/products"
                    onClick={closeMobileMenu}
                    className="flex min-h-[44px] items-center rounded-md px-2.5 text-sm font-medium text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    Semua Aksesori Motor
                  </Link>
                  <Link
                    href="/about"
                    onClick={closeMobileMenu}
                    className="flex min-h-[44px] items-center rounded-md px-2.5 text-sm font-medium text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    Tentang Kami &amp; YouTube
                  </Link>
                  {categories.map((category) => (
                    <Link
                      key={category.slug}
                      href={`/products?category=${category.slug}`}
                      onClick={closeMobileMenu}
                      className="flex min-h-[44px] items-center rounded-md px-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2">
                  <p className="px-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Toko Resmi Kami
                  </p>
                  <OfficialStoreLinks layout="stack" />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
