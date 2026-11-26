"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Layers, ShieldCheck, Wrench } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { buttonVariants } from "@/components/ui/button";
import { MarketplaceCta } from "@/components/catalog/marketplace-cta";
import { formatPrice, getDiscountPercent } from "@/lib/format";
import { getCategoryBySlug } from "@/data/categories";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/catalog";

interface ProductQuickViewProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductQuickView({
  product,
  open,
  onOpenChange,
}: ProductQuickViewProps) {
  const [selection, setSelection] = React.useState<{
    id: string;
    imgIdx: number;
    variantId: string | null;
  }>({ id: "", imgIdx: 0, variantId: null });

  if (!product) return null;

  const variants = product.variants ?? [];
  const activeImageIdx = selection.id === product.id ? selection.imgIdx : 0;
  const selectedVariantId =
    selection.id === product.id
      ? selection.variantId
      : (variants[0]?.id ?? null);
  const selectedVariant =
    variants.find((v) => v.id === selectedVariantId) ?? null;

  const setActiveImageIdx = (imgIdx: number) =>
    setSelection({ id: product.id, imgIdx, variantId: selectedVariantId });

  const setSelectedVariantId = (variantId: string) =>
    setSelection({ id: product.id, imgIdx: activeImageIdx, variantId });

  const category = getCategoryBySlug(product.category);
  const displayPrice = selectedVariant?.price ?? product.price;
  const displaySku = selectedVariant?.sku ?? product.sku;
  const discount = getDiscountPercent(displayPrice, product.originalPrice);
  const activeImage = product.images[activeImageIdx] ?? product.images[0];
  const isAvailable = selectedVariant
    ? product.inStock && selectedVariant.inStock
    : product.inStock;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl p-0 overflow-hidden gap-0">
        <div className="grid grid-cols-1 md:grid-cols-2 max-h-[88vh] overflow-y-auto">
          {/* Left Gallery */}
          <div className="bg-muted/60 p-4 sm:p-5 flex flex-col gap-3 border-b md:border-b-0 md:border-r border-border">
            <div className="relative overflow-hidden rounded-lg border border-border bg-muted">
              <AspectRatio ratio={1}>
                <Image
                  src={activeImage.url}
                  alt={activeImage.alt}
                  fill
                  sizes="(max-width: 768px) 90vw, 360px"
                  className="object-cover"
                />
              </AspectRatio>
              {activeImage.label && (
                <span className="absolute bottom-2.5 left-2.5 rounded-md bg-background/85 px-2 py-0.5 font-mono text-[11px] font-medium text-foreground backdrop-blur-sm border border-border">
                  {activeImage.label}
                </span>
              )}
            </div>

            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, idx) => (
                  <button
                    key={`${img.url}-${idx}`}
                    type="button"
                    onClick={() => setActiveImageIdx(idx)}
                    aria-label={`Lihat ${img.label ?? `gambar ${idx + 1}`}`}
                    className={cn(
                      "relative size-14 overflow-hidden rounded-md border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      idx === activeImageIdx
                        ? "border-primary ring-2 ring-primary/25"
                        : "border-border opacity-70 hover:opacity-100"
                    )}
                  >
                    <Image
                      src={img.url}
                      alt={img.alt}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Info */}
          <div className="p-5 sm:p-6 flex flex-col justify-between gap-4">
            <div className="space-y-3.5">
              <DialogHeader className="text-left space-y-1.5">
                <div className="flex flex-wrap items-center gap-2 pr-6">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {category?.shortName ?? product.category}
                  </span>
                  <span className="text-muted-foreground/40">•</span>
                  <span className="font-mono text-xs text-muted-foreground">
                    {displaySku}
                  </span>
                  {!isAvailable && (
                    <Badge variant="destructive" className="text-[10px]">
                      Stok Habis
                    </Badge>
                  )}
                </div>
                <DialogTitle className="text-lg sm:text-xl font-bold leading-snug text-foreground">
                  {product.name}
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
                  {product.description}
                </DialogDescription>
              </DialogHeader>

              {/* Price */}
              <div className="flex flex-wrap items-baseline gap-2.5">
                <span className="font-mono text-2xl font-bold tabular-nums text-foreground">
                  {formatPrice(displayPrice, product.currency)}
                </span>
                {product.originalPrice && product.originalPrice > displayPrice && (
                  <span className="font-mono text-sm tabular-nums text-muted-foreground line-through">
                    {formatPrice(product.originalPrice, product.currency)}
                  </span>
                )}
                {discount && (
                  <Badge className="bg-primary/15 text-primary hover:bg-primary/20 border-transparent font-mono text-xs">
                    -{discount}%
                  </Badge>
                )}
              </div>

              {/* Variant Selector */}
              {variants.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="inline-flex items-center gap-1.5 font-semibold text-foreground">
                      <Layers className="size-3.5 text-primary" aria-hidden="true" />
                      <span>Pilih Varian</span>
                    </span>
                    {selectedVariant && (
                      <span className="text-muted-foreground truncate max-w-[180px]">
                        {selectedVariant.name}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {variants.map((v) => {
                      const active = v.id === selectedVariantId;
                      return (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => setSelectedVariantId(v.id)}
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                            active
                              ? "border-primary bg-primary/10 text-primary font-semibold"
                              : "border-border bg-card text-foreground hover:border-foreground/30",
                            !v.inStock && "opacity-60 line-through"
                          )}
                        >
                          {v.colorHex && (
                            <span
                              className="size-3 rounded-full border border-border shrink-0"
                              style={{ backgroundColor: v.colorHex }}
                              aria-hidden="true"
                            />
                          )}
                          <span>{v.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Specs */}
              <div className="flex flex-wrap gap-1.5">
                {product.shortSpecs.map((spec) => (
                  <Badge
                    key={spec}
                    variant="secondary"
                    className="font-mono text-[11px] font-medium border border-border"
                  >
                    {spec}
                  </Badge>
                ))}
              </div>

              <Separator />

              {/* Fitment */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                  <Wrench className="size-3.5 text-primary" aria-hidden="true" />
                  <span>Motor Kompatibel</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {product.compatibility.map((bike) => (
                    <span
                      key={bike}
                      className="rounded-full border border-border bg-muted/60 px-2.5 py-0.5 text-xs text-muted-foreground"
                    >
                      {bike}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                <span className="inline-flex items-center gap-1">
                  <ShieldCheck
                    className="size-3.5 text-status-success"
                    aria-hidden="true"
                  />
                  100% Original CR7 Racing
                </span>
                <span className="inline-flex items-center gap-1">
                  <CheckCircle2
                    className="size-3.5 text-status-success"
                    aria-hidden="true"
                  />
                  Checkout Toko Resmi
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-2.5 pt-2">
              <MarketplaceCta
                product={product}
                selectedVariant={selectedVariant}
                variant="pdp"
              />
              <Link
                href={`/products/${product.slug}`}
                onClick={() => onOpenChange(false)}
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "w-full justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                )}
              >
                <span>Lihat Spesifikasi Lengkap &amp; Isi Paket</span>
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
