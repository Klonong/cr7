"use client";

import * as React from "react";
import { DEFAULT_PRODUCT_IMAGE } from "@/config/store";
import {
  createCatalogProduct,
  updateCatalogProduct,
} from "@/lib/api/catalog-api";
import { uploadAdminImageWithMeta } from "@/lib/api/upload-api";
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
  ProductImage,
  ProductInput,
  ProductVariant,
} from "@/interface/catalog";
import type { ProductImageDraft, VariantDraft } from "@/interface/hooks";

export type { ProductImageDraft, VariantDraft };

export const MAX_PRODUCT_IMAGES = 10;

export const IMAGE_LABEL_OPTIONS: readonly NonNullable<
  ProductImage["label"]
>[] = ["Utama", "Detail", "Pola Cahaya", "Kelengkapan"] as const;

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

function toImageDrafts(images?: ProductImage[]): ProductImageDraft[] {
  if (!images || images.length === 0) {
    return [];
  }
  return images.slice(0, MAX_PRODUCT_IMAGES).map((img, idx) => ({
    id: `img-${idx}-${img.url}`,
    url: img.url,
    alt: img.alt ?? "",
    label: img.label ?? (idx === 0 ? "Utama" : "Detail"),
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
  const imageInputRef = React.useRef<HTMLInputElement>(null);

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

  // Multi-image state (up to 10 images per product, saved to Cloudflare R2 bucket on upload)
  const [images, setImages] = React.useState<ProductImageDraft[]>(() =>
    toImageDrafts(product?.images)
  );
  const [manualImageUrl, setManualImageUrl] = React.useState("");
  const [draggingImages, setDraggingImages] = React.useState(false);
  const [uploadingImages, setUploadingImages] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState<string | null>(
    null
  );
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const [lastUploadStorage, setLastUploadStorage] = React.useState<
    "r2" | "local" | null
  >(null);

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

  // Multi-image upload directly to /api/admin/upload (Cloudflare R2 bucket)
  const handleUploadImageFiles = React.useCallback(
    async (fileList: FileList | File[]) => {
      const files = Array.from(fileList);
      if (files.length === 0) return;

      const remainingSlots = MAX_PRODUCT_IMAGES - images.length;
      if (remainingSlots <= 0) {
        setUploadError(
          `Maksimal ${MAX_PRODUCT_IMAGES} foto per produk. Hapus salah satu foto terlebih dahulu.`
        );
        return;
      }

      const toUpload = files.slice(0, remainingSlots);
      setUploadError(null);
      setUploadingImages(true);

      const uploadedDrafts: ProductImageDraft[] = [];
      const errors: string[] = [];

      for (let i = 0; i < toUpload.length; i++) {
        const file = toUpload[i];
        setUploadProgress(
          `Mengunggah foto ${i + 1} dari ${toUpload.length}...`
        );
        try {
          const result = await uploadAdminImageWithMeta(file, "products");
          if (result.storage) {
            setLastUploadStorage(result.storage);
          }
          const isFirstOverall =
            images.length === 0 && uploadedDrafts.length === 0;
          uploadedDrafts.push({
            id: `img-${Date.now().toString(36)}-${i}-${Math.random().toString(36).slice(2, 6)}`,
            url: result.url,
            alt: name.trim() || file.name.replace(/\.[^.]+$/, ""),
            label: isFirstOverall ? "Utama" : "Detail",
          });
        } catch (err) {
          errors.push(
            `${file.name}: ${getErrorMessage(err, "Gagal mengunggah gambar.")}`
          );
        }
      }

      if (uploadedDrafts.length > 0) {
        setImages((prev) =>
          [...prev, ...uploadedDrafts].slice(0, MAX_PRODUCT_IMAGES)
        );
      }

      if (files.length > remainingSlots) {
        errors.push(
          `Hanya ${remainingSlots} foto pertama yang diunggah (batas maks. ${MAX_PRODUCT_IMAGES} foto).`
        );
      }

      if (errors.length > 0) {
        setUploadError(errors.join(" · "));
      }

      setUploadingImages(false);
      setUploadProgress(null);
    },
    [images.length, name]
  );

  const openImagePicker = React.useCallback(() => {
    if (!uploadingImages && images.length < MAX_PRODUCT_IMAGES) {
      imageInputRef.current?.click();
    }
  }, [uploadingImages, images.length]);

  const handleImagesKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if ((e.key === "Enter" || e.key === " ") && !uploadingImages) {
        e.preventDefault();
        openImagePicker();
      }
    },
    [uploadingImages, openImagePicker]
  );

  const handleImagesDragOver = React.useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setDraggingImages(true);
    },
    []
  );

  const handleImagesDragLeave = React.useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setDraggingImages(false);
    },
    []
  );

  const handleImagesDrop = React.useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setDraggingImages(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        void handleUploadImageFiles(e.dataTransfer.files);
      }
    },
    [handleUploadImageFiles]
  );

  const handleImagesInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        void handleUploadImageFiles(e.target.files);
      }
      e.target.value = "";
    },
    [handleUploadImageFiles]
  );

  const handleAddPresetOrUrlImage = React.useCallback(
    (
      url: string,
      preferredLabel?: NonNullable<ProductImage["label"]>,
      preferredAlt?: string
    ) => {
      const trimmed = url.trim();
      if (!trimmed) return;
      setUploadError(null);
      setImages((prev) => {
        if (prev.length >= MAX_PRODUCT_IMAGES) {
          setUploadError(`Maksimal ${MAX_PRODUCT_IMAGES} foto per produk.`);
          return prev;
        }
        if (prev.some((item) => item.url === trimmed)) {
          return prev;
        }
        const label =
          preferredLabel ?? (prev.length === 0 ? "Utama" : "Detail");
        return [
          ...prev,
          {
            id: `img-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
            url: trimmed,
            alt: preferredAlt || name.trim() || "Foto produk CR7 Racing",
            label,
          },
        ];
      });
    },
    [name]
  );

  const handleAddManualImage = React.useCallback(() => {
    const trimmed = manualImageUrl.trim();
    if (!trimmed) return;
    handleAddPresetOrUrlImage(trimmed);
    setManualImageUrl("");
  }, [manualImageUrl, handleAddPresetOrUrlImage]);

  const handleRemoveImage = React.useCallback((id: string) => {
    setImages((prev) => {
      const next = prev.filter((img) => img.id !== id);
      if (next.length > 0 && next[0].label !== "Utama") {
        next[0] = { ...next[0], label: "Utama" };
      }
      return next;
    });
  }, []);

  const handleSetPrimaryImage = React.useCallback((id: string) => {
    setImages((prev) => {
      const idx = prev.findIndex((img) => img.id === id);
      if (idx <= 0) return prev;
      const target = { ...prev[idx], label: "Utama" as const };
      const rest = prev
        .filter((img) => img.id !== id)
        .map((img) =>
          img.label === "Utama" ? { ...img, label: "Detail" as const } : img
        );
      return [target, ...rest];
    });
  }, []);

  const handleMoveImage = React.useCallback(
    (id: string, direction: "left" | "right") => {
      setImages((prev) => {
        const idx = prev.findIndex((img) => img.id === id);
        if (idx === -1) return prev;
        const targetIdx = direction === "left" ? idx - 1 : idx + 1;
        if (targetIdx < 0 || targetIdx >= prev.length) return prev;
        const next = [...prev];
        [next[idx], next[targetIdx]] = [next[targetIdx], next[idx]];
        return next;
      });
    },
    []
  );

  const handleUpdateImageMeta = React.useCallback(
    (
      id: string,
      patch: Partial<Pick<ProductImageDraft, "alt" | "label">>
    ) => {
      setImages((prev) =>
        prev.map((img) => (img.id === id ? { ...img, ...patch } : img))
      );
    },
    []
  );

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
      if (uploadingImages) return;
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

      const preparedImages: ProductImage[] =
        images.length > 0
          ? images.map((img, idx) => ({
              url: img.url.trim(),
              alt:
                img.alt.trim() ||
                name.trim() ||
                "Aksesoris motor CR7 Racing",
              label: img.label || (idx === 0 ? "Utama" : "Detail"),
            }))
          : [
              {
                url: DEFAULT_PRODUCT_IMAGE,
                alt: name.trim() || "Aksesoris motor CR7 Racing",
                label: "Utama",
              },
            ];

      const rawPayload: ProductInput = {
        name: name.trim(),
        sku: sku.trim().toUpperCase(),
        slug: slug.trim() || slugify(name),
        category,
        price: Number(price),
        originalPrice: originalPrice.trim() ? Number(originalPrice) : undefined,
        currency: "IDR",
        images: preparedImages,
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
      uploadingImages,
      variants,
      images,
      name,
      sku,
      slug,
      category,
      price,
      originalPrice,
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
    images,
    imageInputRef,
    manualImageUrl,
    setManualImageUrl,
    draggingImages,
    uploadingImages,
    uploadProgress,
    uploadError,
    lastUploadStorage,
    openImagePicker,
    handleImagesKeyDown,
    handleImagesDragOver,
    handleImagesDragLeave,
    handleImagesDrop,
    handleImagesInputChange,
    handleAddPresetOrUrlImage,
    handleAddManualImage,
    handleRemoveImage,
    handleSetPrimaryImage,
    handleMoveImage,
    handleUpdateImageMeta,
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
