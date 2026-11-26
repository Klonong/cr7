"use client";

import * as React from "react";
import { ExternalLink, Store } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  ShopeeIcon,
  TikTokShopIcon,
} from "@/components/icons/marketplace-icons";
import { STORE_CONFIG } from "@/config/store";
import type { Product, ProductVariant } from "@/interface/catalog";

interface MarketplaceCtaProps {
  product: Product;
  selectedVariant?: ProductVariant | null;
  variant?: "card" | "pdp" | "sticky";
  className?: string;
}

export function MarketplaceCta({
  product,
  selectedVariant = null,
  variant = "card",
  className,
}: MarketplaceCtaProps) {
  const shopee = selectedVariant?.shopeeUrl || product.links.shopee;
  const tiktokShop = selectedVariant?.tiktokShopUrl || product.links.tiktokShop;
  const isAvailable = selectedVariant
    ? product.inStock && selectedVariant.inStock
    : product.inStock;
  const hasBoth = Boolean(shopee && tiktokShop);

  if (!isAvailable) {
    const restockUrl = shopee ?? tiktokShop ?? STORE_CONFIG.officialShopeeUrl;
    return (
      <div className={cn("w-full", className)}>
        <a
          href={restockUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Cek update stok untuk ${product.name} (buka di tab baru)`}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "w-full gap-1.5 font-medium",
            variant === "pdp" || variant === "sticky"
              ? "h-12 min-h-[44px] text-sm"
              : "h-9 text-xs"
          )}
        >
          <Store className="size-3.5 shrink-0" aria-hidden="true" />
          <span>Cek Update Stok</span>
          <ExternalLink
            className="size-3 shrink-0 opacity-70"
            aria-hidden="true"
          />
        </a>
      </div>
    );
  }

  const heightClass =
    variant === "pdp"
      ? "h-12 min-h-[44px] px-4 text-sm font-semibold"
      : variant === "sticky"
        ? "h-11 min-h-[44px] px-3 text-sm font-semibold"
        : "h-9 px-2.5 text-xs font-medium";

  const labelPrefix = variant === "pdp" ? "Beli di " : "";
  const variantLabel = selectedVariant ? ` (${selectedVariant.name})` : "";

  return (
    <div
      className={cn(
        "grid w-full gap-2",
        hasBoth
          ? variant === "card"
            ? "grid-cols-1 sm:grid-cols-2"
            : "grid-cols-2"
          : "grid-cols-1",
        className
      )}
    >
      {shopee && (
        <a
          href={shopee}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Beli ${product.name}${variantLabel} di Shopee (buka di tab baru)`}
          className={cn(
            buttonVariants({ variant: "default" }),
            "w-full gap-1.5 bg-shopee text-shopee-foreground hover:bg-shopee-hover focus-visible:ring-shopee/50 active:scale-[0.98] transition-all",
            heightClass
          )}
        >
          <ShopeeIcon className="size-4 shrink-0" />
          <span className="truncate">{labelPrefix}Shopee</span>
          <ExternalLink
            className="size-3 shrink-0 opacity-85"
            aria-hidden="true"
          />
        </a>
      )}

      {tiktokShop && (
        <a
          href={tiktokShop}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Beli ${product.name}${variantLabel} di TikTok Shop (buka di tab baru)`}
          className={cn(
            buttonVariants({ variant: "default" }),
            "w-full gap-1.5 bg-tiktok text-tiktok-foreground hover:bg-tiktok-hover dark:border dark:border-zinc-700 focus-visible:ring-ring/50 active:scale-[0.98] transition-all",
            heightClass
          )}
        >
          <TikTokShopIcon className="size-4 shrink-0" />
          <span className="truncate">
            {labelPrefix}
            {variant === "card" ? "TikTok" : "TikTok Shop"}
          </span>
          <ExternalLink
            className="size-3 shrink-0 opacity-85"
            aria-hidden="true"
          />
        </a>
      )}
    </div>
  );
}
