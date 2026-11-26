"use client";

import * as React from "react";
import { BEAM_TEST_IMAGE, DEFAULT_PRODUCT_IMAGE } from "@/config/store";
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
  Category,
  CategorySlug,
  Product,
  ProductBadge,
  ProductInput,
  ProductVariant,
} from "@/interface/catalog";

import type { VariantDraft } from "@/interface/hooks";

export type { VariantDraft };

function toVariantDrafts(variants?: ProductVariant[]): VariantDraft[] {
  if (!variants || variants.length === 0) return [];
  return variants.map((v) => ({
    id: v.id,
    name: v.name,
    sku: v.sku ?? "",
    price: v.price ? String(v.price) : "",
    colorHex: v.colorHex ?? "#CA0C1F",
    inStock: v.inStock,
    shopeeUrl: v.shopeeUrl ?? "",
    tiktokShopUrl: v.tiktokShopUrl ?? "",
  }));
}

interface UseProductFormOptions {
  product: Product | null;
  categories: Category[];
  onClose: () => void;
  onSaved: (product: Product, mode: "create" | "edit") => void;
}

export function useProductForm({
  product,
  categories,
  onClose,
  onSaved,
}: UseProductFormOptions) {
  const isEdit = Boolean(product);

  const [name, setName] = React.useState(product?.name ?? "");
  const [sku, setSku] = React.useState(product?.sku ?? "");
  const [slug, setSlug] = React.useState(product?.slug ?? "");
  const [slugTouched, setSlugTouched] = React.useState(isEdit);
  const [category, setCategory] = React.useState<CategorySlug>(
    product?.category ?? categories[0]?.slug ?? "led-headlights"
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

  const [variants, setVariants] = React.useState<VariantDraft[]>(() =>
    toVariantDrafts(product?.variants)
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

  const handleNameChange = React.useCallback(
    (val: string) => {
      setName(val);
      if (!slugTouched) {
        setSlug(slugify(val));
      }
    },
    [slugTouched]
  );

  const handleSlugChange = React.useCallback((val: string) => {
    setSlugTouched(true);
    setSlug(val);
  }, []);

  const toggleBike = React.useCallback((bike: string) => {
    setCompatibility((prev) =>
      prev.includes(bike) ? prev.filter((b) => b !== bike) : [...prev, bike]
    );
  }, []);

  const toggleBadge = React.useCallback((badge: ProductBadge) => {
    setBadges((prev) =>
      prev.includes(badge) ? prev.filter((b) => b !== badge) : [...prev, badge]
    );
  }, []);

  const handleAddVariant = React.useCallback(() => {
    setVariants((prev) => [
      ...prev,
      {
        id: `var-${Date.now().toString(36)}-${prev.length + 1}`,
        name: "",
        sku: "",
        price: price || "",
        colorHex: "#CA0C1F",
        inStock: true,
        shopeeUrl: "",
        tiktokShopUrl: "",
      },
    ]);
  }, [price]);

  const handleUpdateVariant = React.useCallback(
    (id: string, patch: Partial<Omit<VariantDraft, "id">>) => {
      setVariants((prev) =>
        prev.map((v) => (v.id === id ? { ...v, ...patch } : v))
      );
    },
    []
  );

  const handleRemoveVariant = React.useCallback((id: string) => {
    setVariants((prev) => prev.filter((v) => v.id !== id));
  }, []);

  const handleSubmit = React.useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError(null);

      const parsedVariants: ProductVariant[] = variants
        .filter((v) => v.name.trim().length > 0)
        .map((v) => ({
          id: v.id,
          name: v.name.trim(),
          ...(v.sku.trim() ? { sku: v.sku.trim().toUpperCase() } : {}),
          ...(v.price.trim() ? { price: Number(v.price) } : {}),
          colorHex: v.colorHex.trim() || undefined,
          inStock: v.inStock,
          ...(v.shopeeUrl.trim() ? { shopeeUrl: v.shopeeUrl.trim() } : {}),
          ...(v.tiktokShopUrl.trim()
            ? { tiktokShopUrl: v.tiktokShopUrl.trim() }
            : {}),
        }));

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
            alt: name.trim() || "Aksesoris motor CR7 Racing",
            label: "Utama",
          },
          ...(includeBeamImage
            ? [
                {
                  url: BEAM_TEST_IMAGE,
                  alt: `Uji pola cahaya malam ${name.trim()}`,
                  label: "Pola Cahaya" as const,
                },
              ]
            : []),
        ],
        variants: parsedVariants,
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

      const validation = validateProductInput(
        rawPayload,
        categories.map((c) => c.slug)
      );
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
        setError(getErrorMessage(err, "Gagal menyimpan produk."));
        setSubmitting(false);
      }
    },
    [
      variants,
      name,
      sku,
      slug,
      category,
      price,
      originalPrice,
      imageUrl,
      includeBeamImage,
      shortSpecsText,
      fullSpecsText,
      inTheBoxText,
      fitmentNotes,
      compatibility,
      badges,
      featured,
      inStock,
      shopeeUrl,
      tiktokUrl,
      description,
      categories,
      isEdit,
      product,
      onSaved,
      onClose,
    ]
  );

  const selectedCategoryObj = React.useMemo(
    () => categories.find((c) => c.slug === category),
    [categories, category]
  );

  return {
    isEdit,
    name,
    handleNameChange,
    sku,
    setSku,
    slug,
    handleSlugChange,
    category,
    setCategory,
    selectedCategoryObj,
    price,
    setPrice,
    originalPrice,
    setOriginalPrice,
    inStock,
    setInStock,
    featured,
    setFeatured,
    shopeeUrl,
    setShopeeUrl,
    tiktokUrl,
    setTiktokUrl,
    imageUrl,
    setImageUrl,
    includeBeamImage,
    setIncludeBeamImage,
    variants,
    handleAddVariant,
    handleUpdateVariant,
    handleRemoveVariant,
    shortSpecsText,
    setShortSpecsText,
    compatibility,
    toggleBike,
    badges,
    toggleBadge,
    description,
    setDescription,
    fitmentNotes,
    setFitmentNotes,
    inTheBoxText,
    setInTheBoxText,
    fullSpecsText,
    setFullSpecsText,
    submitting,
    error,
    handleSubmit,
  };
}
