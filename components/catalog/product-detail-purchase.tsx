"use client";

import Link from "next/link";
import {
  Info,
  Layers,
  PackageCheck,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MarketplaceCta } from "@/components/catalog/marketplace-cta";
import { useProductVariant } from "@/hooks/catalog/use-product-variant";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Category, Product } from "@/interface/catalog";

interface ProductDetailPurchaseProps {
  product: Product;
  category?: Category;
}

export function ProductDetailPurchase({
  product,
  category,
}: ProductDetailPurchaseProps) {
  const {
    variants,
    selectedVariantId,
    selectedVariant,
    selectVariant,
    displayPrice,
    displaySku,
    isAvailable,
    discount,
  } = useProductVariant(product);

  return (
    <>
      <div className="sticky top-24 space-y-5 rounded-xl border border-border bg-card p-5 sm:p-6">
        {/* Top Meta */}
        <div className="flex flex-wrap items-center gap-2">
          {category && (
            <Link
              href={`/products?category=${category.slug}`}
              className="text-xs font-semibold uppercase tracking-wider text-primary hover:underline"
            >
              {category.shortName}
            </Link>
          )}
          <span className="text-muted-foreground/40">•</span>
          <span className="font-mono text-xs text-muted-foreground">
            SKU: {displaySku}
          </span>
          <Badge
            variant={isAvailable ? "secondary" : "destructive"}
            className={
              isAvailable
                ? "ml-auto text-[11px] font-medium text-status-success border border-status-success/25 bg-status-success/10"
                : "ml-auto text-[11px]"
            }
          >
            {isAvailable ? "Stok Tersedia" : "Stok Habis"}
          </Badge>
        </div>

        {/* Product H1 */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight text-foreground">
            {product.name}
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {product.description}
          </p>
        </div>

        {/* Reference Price */}
        <div className="rounded-lg border border-border bg-muted/40 p-4 space-y-1.5">
          <div className="flex flex-wrap items-baseline gap-2.5">
            <span className="font-mono text-2xl sm:text-3xl font-extrabold tabular-nums text-foreground">
              {formatPrice(displayPrice, product.currency)}
            </span>
            {product.originalPrice && product.originalPrice > displayPrice && (
              <span className="font-mono text-sm tabular-nums text-muted-foreground line-through">
                {formatPrice(product.originalPrice, product.currency)}
              </span>
            )}
            {discount && (
              <Badge className="bg-primary text-primary-foreground font-mono text-xs">
                Hemat {discount}%
              </Badge>
            )}
          </div>
          <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
            <Info className="size-3.5 shrink-0 mt-0.5" aria-hidden="true" />
            <span>
              Harga referensi katalog. Harga final, voucher toko, gratis ongkir
              &amp; COD dihitung langsung di Shopee atau TikTok Shop.
            </span>
          </p>
        </div>

        {/* Interactive Variant Selector */}
        {variants.length > 0 && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 font-semibold uppercase tracking-wider text-muted-foreground">
                <Layers className="size-3.5 text-primary" aria-hidden="true" />
                <span>Pilih Varian ({variants.length})</span>
              </span>
              {selectedVariant && (
                <span className="font-semibold text-foreground truncate">
                  {selectedVariant.name}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {variants.map((v) => {
                const active = v.id === selectedVariantId;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => selectVariant(v.id)}
                    className={cn(
                      "flex items-center justify-between gap-2 rounded-lg border px-3 py-2.5 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      active
                        ? "border-primary bg-primary/10 ring-1 ring-primary/30"
                        : "border-border bg-card hover:border-foreground/30",
                      !v.inStock && "opacity-60"
                    )}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {v.colorHex && (
                        <span
                          className="size-3.5 rounded-full border border-border shrink-0"
                          style={{ backgroundColor: v.colorHex }}
                          aria-hidden="true"
                        />
                      )}
                      <div className="min-w-0">
                        <p
                          className={cn(
                            "truncate text-xs font-semibold",
                            active ? "text-primary" : "text-foreground",
                            !v.inStock && "line-through"
                          )}
                        >
                          {v.name}
                        </p>
                        {!v.inStock && (
                          <p className="text-[10px] text-destructive">Habis</p>
                        )}
                      </div>
                    </div>
                    {v.price && v.price !== product.price && (
                      <span className="shrink-0 font-mono text-[11px] font-semibold tabular-nums text-muted-foreground">
                        {formatPrice(v.price, product.currency)}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Primary Marketplace CTAs */}
        <div className="space-y-2.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Order Langsung di Toko Resmi
          </p>
          <MarketplaceCta
            product={product}
            selectedVariant={selectedVariant}
            variant="pdp"
          />
        </div>

        <Separator />

        {/* Short Specs */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Highlight Spesifikasi
          </p>
          <div className="flex flex-wrap gap-1.5">
            {product.shortSpecs.map((spec) => (
              <Badge
                key={spec}
                variant="secondary"
                className="font-mono text-xs px-2.5 py-1 border border-border"
              >
                {spec}
              </Badge>
            ))}
            {product.badges?.map((badge) => (
              <Badge
                key={badge}
                variant="outline"
                className="text-xs px-2.5 py-1"
              >
                {badge}
              </Badge>
            ))}
          </div>
        </div>

        {/* Compatible Bikes */}
        <div className="space-y-2">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Wrench className="size-3.5 text-primary" aria-hidden="true" />
            <span>Motor Kompatibel</span>
          </p>
          <div className="flex flex-wrap gap-1.5">
            {product.compatibility.map((bike) => (
              <Link
                key={bike}
                href={`/products?bike=${encodeURIComponent(bike)}`}
                className="rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-foreground hover:border-primary hover:text-primary transition-colors"
              >
                {bike}
              </Link>
            ))}
          </div>
        </div>

        {/* Guarantees */}
        <div className="grid grid-cols-2 gap-2.5 pt-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-2 rounded-md border border-border/70 p-2.5">
            <ShieldCheck
              className="size-4 text-status-success shrink-0"
              aria-hidden="true"
            />
            <span>Garansi Resmi CR7</span>
          </div>
          <div className="flex items-center gap-2 rounded-md border border-border/70 p-2.5">
            <PackageCheck
              className="size-4 text-status-success shrink-0"
              aria-hidden="true"
            />
            <span>Packing Bubble Tebal</span>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Buy Bar (<768px) */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 p-3 backdrop-blur-md md:hidden">
        <div className="mx-auto flex max-w-lg flex-col gap-2">
          <div className="flex items-center justify-between text-xs gap-2">
            <span className="truncate font-medium text-muted-foreground">
              {selectedVariant
                ? `${product.name} · ${selectedVariant.name}`
                : product.name}
            </span>
            <span className="shrink-0 font-mono font-bold tabular-nums text-foreground">
              {formatPrice(displayPrice, product.currency)}
            </span>
          </div>
          <MarketplaceCta
            product={product}
            selectedVariant={selectedVariant}
            variant="sticky"
          />
        </div>
      </div>
    </>
  );
}
