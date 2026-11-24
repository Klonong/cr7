"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
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
import { CATEGORIES } from "@/data/categories";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1320px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <BrandLogo
          href="/"
          badge="Catalog"
          subtitle="Motorcycle Parts & Accessories"
        />

        {/* Center Desktop Navigation */}
        <nav
          aria-label="Primary catalog navigation"
          className="hidden lg:flex items-center gap-1"
        >
          {PRIMARY_NAV_LINKS.map((item) => {
            const isActive =
              item.href === "/products" && pathname === "/products";
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isActive
                    ? "text-foreground bg-muted/70"
                    : "text-muted-foreground"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Utilities — Search, Official Store Links, Theme Toggle (NO Cart or Admin Login) */}
        <div className="flex items-center gap-2">
          <CommandSearch />

          <OfficialStoreLinks layout="inline" className="hidden xl:flex pl-1" />

          <ThemeToggle />

          {/* Mobile Menu Drawer */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              render={
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label="Open navigation menu"
                  className="size-9 min-h-[44px] min-w-[44px] lg:hidden"
                />
              }
            >
              <Menu className="size-5" aria-hidden="true" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[340px]">
              <SheetHeader className="text-left">
                <SheetTitle>
                  <BrandLogo href={null} size="sm" />
                </SheetTitle>
                <SheetDescription>
                  Browse accessories and order directly via our official Shopee
                  or TikTok Shop stores.
                </SheetDescription>
              </SheetHeader>

              <div className="flex flex-col gap-4 px-4 pb-6 overflow-y-auto">
                <div className="space-y-1">
                  <p className="px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Catalog Categories
                  </p>
                  <SheetClose
                    render={
                      <Link
                        href="/products"
                        className="flex min-h-[44px] items-center rounded-md px-2.5 text-sm font-medium text-foreground hover:bg-muted"
                      />
                    }
                  >
                    All Motorcycle Accessories
                  </SheetClose>
                  {CATEGORIES.map((category) => (
                    <SheetClose
                      key={category.slug}
                      render={
                        <Link
                          href={`/products?category=${category.slug}`}
                          className="flex min-h-[44px] items-center rounded-md px-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                        />
                      }
                    >
                      {category.name}
                    </SheetClose>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2">
                  <p className="px-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Official Storefronts
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
