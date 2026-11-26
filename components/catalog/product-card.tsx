"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MarketplaceCta } from "@/components/catalog/marketplace-cta";
import { useProductCard } from "@/hooks/catalog/use-product-card";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/catalog";

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
  priority?: boolean;
}

export function ProductCard({
  product,
  onQuickView,
  priority = false,
}: ProductCardProps) {
  const {
    category,
    discount,
    primaryImage,
    secondaryImage,
    activeImageUrl,
    variants,
    handleMouseEnter,
    handleMouseLeave,
  } = useProductCard(product);

  return (
    <Card
      className={cn(
        "group relative flex h-full flex-col gap-0 overflow-hidden rounded-lg border border-border bg-card p-0 ring-0 transition-all duration-200 hover:border-foreground/25 hover:shadow-md",
        !product.inStock && "opacity-90"
      )}
    >
      {/* 1:1 Image Frame */}
      <div
        className="relative overflow-hidden bg-muted border-b border-border/60"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Link
          href={`/products/${product.slug}`}
          className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
          aria-label={`Lihat detail ${product.name}`}
        >
          <AspectRatio ratio={1}>
            <Image
              src={activeImageUrl}
              alt={primaryImage.alt}
              fill
              priority={priority}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className={cn(
                "object-cover transition-transform duration-300 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100",
                !product.inStock && "grayscale-[35%] opacity-75"
              )}
            />
          </AspectRatio>
        </Link>

        {/* Top Left Badges */}
        <div className="pointer-events-none absolute top-2.5 left-2.5 z-10 flex flex-wrap gap-1.5">
          {!product.inStock ? (
            <Badge
              variant="destructive"
              className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide shadow-xs"
            >
              Stok Habis
            </Badge>
          ) : (
            product.badges?.slice(0, 1).map((badge) => (
              <Badge
                key={badge}
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-semibold shadow-xs",
                  badge === "Terlaris"
                    ? "bg-primary text-primary-foreground"
                    : "bg-background/90 text-foreground border border-border backdrop-blur-xs"
                )}
              >
                {badge}
              </Badge>
            ))
          )}
          {discount && product.inStock && (
            <Badge className="rounded-full bg-background/90 px-2 py-0.5 font-mono text-[10px] font-bold text-primary border border-border backdrop-blur-xs">
              -{discount}%
            </Badge>
          )}
        </div>

        {/* Top Right Quick View Button */}
        {onQuickView && (
          <div className="absolute top-2.5 right-2.5 z-10">
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    onClick={() => onQuickView(product)}
                    aria-label={`Lihat cepat ${product.name}`}
                    className="size-8 rounded-full bg-background/90 text-foreground shadow-xs border border-border backdrop-blur-xs hover:bg-background"
                  />
                }
              >
                <Eye className="size-3.5" aria-hidden="true" />
              </TooltipTrigger>
              <TooltipContent side="left">Lihat Cepat</TooltipContent>
            </Tooltip>
          </div>
        )}

        {/* Beam Preview Indicator */}
        {secondaryImage && (
          <div className="pointer-events-none absolute bottom-2 left-2.5 z-10 hidden sm:inline-flex items-center gap-1 rounded-md bg-background/85 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground border border-border/80 backdrop-blur-xs">
            <Sparkles className="size-2.5 text-primary" aria-hidden="true" />
            <span>Arahkan untuk {secondaryImage.label ?? "Sorot"}</span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col justify-between p-3 sm:p-4 gap-3">
        <div className="space-y-2">
          {/* Category + SKU */}
          <div className="flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
            <span className="truncate font-semibold uppercase tracking-wider">
              {category?.shortName ?? product.category}
            </span>
            <span className="shrink-0 font-mono text-[10px] opacity-80">
              {product.sku}
            </span>
          </div>

          {/* Title */}
          <Link
            href={`/products/${product.slug}`}
            className="block focus-visible:outline-none focus-visible:underline"
          >
            <h3 className="line-clamp-2 min-h-[2.6rem] text-sm sm:text-[15px] font-semibold leading-snug text-foreground group-hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* Mono Spec Pills */}
          <div className="flex flex-wrap gap-1">
            {product.shortSpecs.slice(0, 3).map((spec) => (
              <span
                key={spec}
                className="inline-flex items-center rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground border border-border/60"
              >
                {spec}
              </span>
            ))}
          </div>

          {/* Variant Swatch Indicator */}
          {variants.length > 0 && (
            <div className="flex items-center gap-1.5 pt-0.5">
              <div className="flex items-center -space-x-1">
                {variants.slice(0, 4).map((v) => (
                  <span
                    key={v.id}
                    title={v.name}
                    className="inline-block size-3.5 rounded-full border border-border shadow-2xs"
                    style={{ backgroundColor: v.colorHex || "#18181b" }}
                  />
                ))}
              </div>
              <span className="text-[11px] font-medium text-muted-foreground">
                {variants.length} Pilihan Varian
              </span>
            </div>
          )}

          {/* Compatibility */}
          <p className="truncate text-xs text-muted-foreground">
            <span className="font-medium text-foreground/80">Cocok:</span>{" "}
            {product.compatibility.join(" · ")}
          </p>
        </div>

        {/* Price + Marketplace CTAs */}
        <div className="space-y-2.5 pt-2.5 border-t border-border/70">
          <div className="flex flex-wrap items-baseline gap-1.5">
            <span className="font-mono text-base sm:text-lg font-bold tabular-nums text-foreground">
              {formatPrice(product.price, product.currency)}
            </span>
            {product.originalPrice && (
              <span className="font-mono text-[11px] sm:text-xs tabular-nums text-muted-foreground line-through">
                {formatPrice(product.originalPrice, product.currency)}
              </span>
            )}
          </div>

          <MarketplaceCta product={product} variant="card" />
        </div>
      </div>
    </Card>
  );
}
