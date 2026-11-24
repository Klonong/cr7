"use client";

import * as React from "react";
import Image from "next/image";
import { AlertCircle, Loader2, Plus, Save } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ShopeeIcon,
  TikTokShopIcon,
} from "@/components/icons/marketplace-icons";
import {
  BEAM_TEST_IMAGE,
  DEFAULT_PRODUCT_IMAGE,
  PRODUCT_BADGES,
  PRODUCT_IMAGE_PRESETS,
} from "@/config/store";
import { BIKE_MODELS, CATEGORIES } from "@/data/categories";
import {
  createCatalogProduct,
  updateCatalogProduct,
} from "@/lib/api/catalog-api";
import { getErrorMessage } from "@/lib/api/client";
import {
  parseCsvList,
  parseKeyValueLines,
  parseNewlineList,
  serializeKeyValueLines,
  slugify,
} from "@/lib/format";
import { validateProductInput } from "@/lib/validation/product";
import type {
  CategorySlug,
  Product,
  ProductBadge,
  ProductInput,
} from "@/types/catalog";

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onSaved: (product: Product, mode: "create" | "edit") => void;
}

export function ProductFormDialog({
  open,
  onOpenChange,
  product,
  onSaved,
}: ProductFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden gap-0">
        {open && (
          <ProductFormInner
            key={product?.id ?? "new-product"}
            product={product}
            onClose={() => onOpenChange(false)}
            onSaved={onSaved}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function ProductFormInner({
  product,
  onClose,
  onSaved,
}: {
  product: Product | null;
  onClose: () => void;
  onSaved: (product: Product, mode: "create" | "edit") => void;
}) {
  const isEdit = Boolean(product);

  const [name, setName] = React.useState(product?.name ?? "");
  const [sku, setSku] = React.useState(product?.sku ?? "");
  const [slug, setSlug] = React.useState(product?.slug ?? "");
  const [slugTouched, setSlugTouched] = React.useState(isEdit);
  const [category, setCategory] = React.useState<CategorySlug>(
    product?.category ?? "led-headlights"
  );
  const [price, setPrice] = React.useState(
    product ? String(product.price) : ""
  );
  const [originalPrice, setOriginalPrice] = React.useState(
    product?.originalPrice ? String(product.originalPrice) : ""
  );
  const [inStock, setInStock] = React.useState(product?.inStock ?? true);
  const [featured, setFeatured] = React.useState(product?.featured ?? false);

  const [shopeeUrl, setShopeeUrl] = React.useState(product?.links.shopee ?? "");
  const [tiktokUrl, setTiktokUrl] = React.useState(
    product?.links.tiktokShop ?? ""
  );

  const [imageUrl, setImageUrl] = React.useState(
    product?.images[0]?.url ?? DEFAULT_PRODUCT_IMAGE
  );
  const [includeBeamImage, setIncludeBeamImage] = React.useState(
    Boolean(product?.images.some((i) => i.url === BEAM_TEST_IMAGE))
  );

  const [shortSpecsText, setShortSpecsText] = React.useState(
    product?.shortSpecs.join(", ") ?? ""
  );
  const [compatibility, setCompatibility] = React.useState<string[]>(
    product?.compatibility ?? ["Universal"]
  );
  const [badges, setBadges] = React.useState<ProductBadge[]>(
    product?.badges ?? []
  );
  const [description, setDescription] = React.useState(
    product?.description ?? ""
  );
  const [fitmentNotes, setFitmentNotes] = React.useState(
    product?.fitmentNotes ?? ""
  );
  const [inTheBoxText, setInTheBoxText] = React.useState(
    product?.inTheBox.join("\n") ?? ""
  );
  const [fullSpecsText, setFullSpecsText] = React.useState(
    serializeKeyValueLines(product?.fullSpecs)
  );

  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!slugTouched) {
      setSlug(slugify(val));
    }
  };

  const toggleBike = (bike: string) => {
    setCompatibility((prev) =>
      prev.includes(bike) ? prev.filter((b) => b !== bike) : [...prev, bike]
    );
  };

  const toggleBadge = (badge: ProductBadge) => {
    setBadges((prev) =>
      prev.includes(badge) ? prev.filter((b) => b !== badge) : [...prev, badge]
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const rawPayload: ProductInput = {
      name: name.trim(),
      sku: sku.trim().toUpperCase(),
      slug: slug.trim() || slugify(name),
      category,
      price: Number(price),
      originalPrice: originalPrice.trim() ? Number(originalPrice) : undefined,
      currency: "IDR",
      images: [
        {
          url: imageUrl.trim() || DEFAULT_PRODUCT_IMAGE,
          alt: name.trim() || "Motorcycle accessory",
          label: "Main",
        },
        ...(includeBeamImage
          ? [
              {
                url: BEAM_TEST_IMAGE,
                alt: `${name.trim()} night beam cutoff test`,
                label: "Beam Pattern" as const,
              },
            ]
          : []),
      ],
      shortSpecs: parseCsvList(shortSpecsText),
      fullSpecs: parseKeyValueLines(fullSpecsText),
      inTheBox: parseNewlineList(inTheBoxText),
      fitmentNotes: fitmentNotes.trim(),
      compatibility: compatibility.length > 0 ? compatibility : ["Universal"],
      badges,
      featured,
      inStock,
      links: {
        shopee: shopeeUrl.trim() || undefined,
        tiktokShop: tiktokUrl.trim() || undefined,
      },
      description: description.trim(),
    };

    // Reuse isomorphic validator on the client before sending network request
    const validation = validateProductInput(rawPayload);
    if (!validation.ok) {
      setError(validation.error);
      return;
    }

    setSubmitting(true);
    try {
      const saved = isEdit
        ? await updateCatalogProduct(product!.id, validation.data)
        : await createCatalogProduct(validation.data);

      onSaved(saved, isEdit ? "edit" : "create");
      onClose();
    } catch (err) {
      setError(getErrorMessage(err, "Failed to save product."));
      setSubmitting(false);
    }
  };

  const selectedCategoryObj = CATEGORIES.find((c) => c.slug === category);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col max-h-[88vh]">
      <DialogHeader className="border-b border-border px-6 py-4 text-left">
        <DialogTitle className="text-lg font-bold">
          {isEdit
            ? `Edit Accessory · ${product?.sku}`
            : "Add New Motorcycle Accessory"}
        </DialogTitle>
        <DialogDescription className="text-xs">
          {isEdit
            ? "Update product specs, pricing, stock status, or Shopee / TikTok Shop links."
            : "Insert a new product into the live CR7 MOTO catalog."}
        </DialogDescription>
      </DialogHeader>

      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
        {error && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-xs font-medium text-destructive"
          >
            <AlertCircle
              className="size-4 shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <span>{error}</span>
          </div>
        )}

        {/* Section 1: Basic Info */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="pf-name" className="text-xs font-semibold">
              Product Name *
            </Label>
            <Input
              id="pf-name"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g., CR7 SQL 3-Eye Laser Mini Driving Light 60W"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="pf-sku" className="text-xs font-semibold">
              SKU Code *
            </Label>
            <Input
              id="pf-sku"
              required
              value={sku}
              onChange={(e) => setSku(e.target.value.toUpperCase())}
              placeholder="e.g., CR7-SQL3-60W"
              className="font-mono uppercase"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="pf-slug" className="text-xs font-semibold">
              URL Slug
            </Label>
            <Input
              id="pf-slug"
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
              placeholder="auto-generated-from-name"
              className="font-mono text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="pf-category" className="text-xs font-semibold">
              Category *
            </Label>
            <Select
              value={category}
              onValueChange={(val) => {
                if (val) setCategory(val as CategorySlug);
              }}
            >
              <SelectTrigger id="pf-category" className="w-full h-9">
                <SelectValue>
                  {selectedCategoryObj?.name ?? category}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c.slug} value={c.slug}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="space-y-1.5">
              <Label htmlFor="pf-price" className="text-xs font-semibold">
                Price (IDR) *
              </Label>
              <Input
                id="pf-price"
                type="number"
                min={1}
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="245000"
                className="font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="pf-orig-price" className="text-xs font-semibold">
                Original Price
              </Label>
              <Input
                id="pf-orig-price"
                type="number"
                min={0}
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                placeholder="295000"
                className="font-mono"
              />
            </div>
          </div>
        </div>

        {/* Status Toggles */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 rounded-lg border border-border bg-muted/40 p-3.5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <Label htmlFor="pf-instock" className="text-xs font-semibold">
                In Stock on Stores
              </Label>
              <p className="text-[11px] text-muted-foreground">
                Show active Shopee / TikTok buy buttons
              </p>
            </div>
            <Switch
              id="pf-instock"
              checked={inStock}
              onCheckedChange={(checked) => setInStock(Boolean(checked))}
            />
          </div>

          <div className="flex items-center justify-between gap-3">
            <div>
              <Label htmlFor="pf-featured" className="text-xs font-semibold">
                Featured on Home
              </Label>
              <p className="text-[11px] text-muted-foreground">
                Display in homepage Best Sellers grid
              </p>
            </div>
            <Switch
              id="pf-featured"
              checked={featured}
              onCheckedChange={(checked) => setFeatured(Boolean(checked))}
            />
          </div>
        </div>

        <Separator />

        {/* Section 2: Marketplace Links */}
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Outbound Marketplace Links
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label
                htmlFor="pf-shopee"
                className="flex items-center gap-1.5 text-xs font-semibold"
              >
                <ShopeeIcon className="size-3.5 text-shopee" />
                <span>Shopee Product URL</span>
              </Label>
              <Input
                id="pf-shopee"
                type="url"
                value={shopeeUrl}
                onChange={(e) => setShopeeUrl(e.target.value)}
                placeholder="https://shopee.co.id/..."
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="pf-tiktok"
                className="flex items-center gap-1.5 text-xs font-semibold"
              >
                <TikTokShopIcon className="size-3.5" />
                <span>TikTok Shop Product URL</span>
              </Label>
              <Input
                id="pf-tiktok"
                type="url"
                value={tiktokUrl}
                onChange={(e) => setTiktokUrl(e.target.value)}
                placeholder="https://shop.tiktok.com/..."
                className="text-xs"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Section 3: Product Image */}
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Product Imagery
          </p>
          <div className="flex flex-col sm:flex-row gap-3 items-start">
            <div className="relative size-20 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
              <Image
                src={imageUrl.startsWith("/") ? imageUrl : DEFAULT_PRODUCT_IMAGE}
                alt="Preview"
                fill
                sizes="80px"
                className="object-cover"
              />
            </div>
            <div className="flex-1 w-full space-y-2">
              <Label htmlFor="pf-image" className="text-xs font-semibold">
                Primary Image Path
              </Label>
              <Input
                id="pf-image"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder={DEFAULT_PRODUCT_IMAGE}
                className="font-mono text-xs"
              />
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {PRODUCT_IMAGE_PRESETS.map((preset) => (
                  <button
                    key={preset.url}
                    type="button"
                    onClick={() => setImageUrl(preset.url)}
                    className={`rounded-md border px-2 py-0.5 text-[11px] font-medium transition-colors ${
                      imageUrl === preset.url
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-muted/50 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-md border border-border/70 px-3 py-2">
            <Label htmlFor="pf-beam" className="text-xs text-muted-foreground">
              Attach Night Beam Cutoff Test as secondary hover/gallery image
            </Label>
            <Switch
              id="pf-beam"
              size="sm"
              checked={includeBeamImage}
              onCheckedChange={(checked) => setIncludeBeamImage(Boolean(checked))}
            />
          </div>
        </div>

        <Separator />

        {/* Section 4: Specs, Badges & Compatibility */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="pf-short-specs" className="text-xs font-semibold">
              Short Spec Pills (comma-separated, up to 3 shown on cards)
            </Label>
            <Input
              id="pf-short-specs"
              value={shortSpecsText}
              onChange={(e) => setShortSpecsText(e.target.value)}
              placeholder="60W Real, 3000K / 6000K, IP67"
              className="font-mono text-xs"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold">Highlight Badges</Label>
            <div className="flex flex-wrap gap-1.5">
              {PRODUCT_BADGES.map((badge) => {
                const active = badges.includes(badge);
                return (
                  <button
                    key={badge}
                    type="button"
                    onClick={() => toggleBadge(badge)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-muted/40 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {badge}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold">
              Compatible Motorcycles
            </Label>
            <div className="flex flex-wrap gap-1.5">
              {BIKE_MODELS.map((bike) => {
                const active = compatibility.includes(bike);
                return (
                  <button
                    key={bike}
                    type="button"
                    onClick={() => toggleBike(bike)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                      active
                        ? "border-primary bg-primary/15 text-primary"
                        : "border-border bg-muted/40 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {bike}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="pf-desc" className="text-xs font-semibold">
              Product Description
            </Label>
            <Textarea
              id="pf-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe optics, materials, and key riding benefits..."
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="pf-specs" className="text-xs font-semibold">
                Technical Specs (`Key: Value` per line)
              </Label>
              <Textarea
                id="pf-specs"
                rows={4}
                value={fullSpecsText}
                onChange={(e) => setFullSpecsText(e.target.value)}
                placeholder={
                  "Power Output: 60W\nInput Voltage: DC 12V-24V\nWaterproof: IP67"
                }
                className="font-mono text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="pf-box" className="text-xs font-semibold">
                In the Box (one item per line)
              </Label>
              <Textarea
                id="pf-box"
                rows={4}
                value={inTheBoxText}
                onChange={(e) => setInTheBoxText(e.target.value)}
                placeholder={
                  "1x CR7 Mini Driving Light\n1x Stainless U-Bracket\n1x Warranty Card"
                }
                className="text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="pf-fitment" className="text-xs font-semibold">
              Fitment &amp; Installation Notes
            </Label>
            <Textarea
              id="pf-fitment"
              rows={2}
              value={fitmentNotes}
              onChange={(e) => setFitmentNotes(e.target.value)}
              placeholder="e.g., Requires DC 12V wiring; recommended to pair with CR7 40A Relay Harness."
            />
          </div>
        </div>
      </div>

      <DialogFooter className="mx-0 mb-0 rounded-b-xl border-t border-border bg-muted/40 px-6 py-3.5">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={submitting} className="gap-1.5">
          {submitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              <span>Saving...</span>
            </>
          ) : isEdit ? (
            <>
              <Save className="size-4" aria-hidden="true" />
              <span>Save Changes</span>
            </>
          ) : (
            <>
              <Plus className="size-4" aria-hidden="true" />
              <span>Insert Product</span>
            </>
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}
