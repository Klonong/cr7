import { CATEGORIES } from "@/data/categories";
import { DEFAULT_PRODUCT_IMAGE, PRODUCT_BADGES } from "@/config/store";
import { slugify } from "@/lib/format";
import type {
  CategorySlug,
  ProductBadge,
  ProductImage,
  ProductInput,
} from "@/types/catalog";

const VALID_CATEGORIES = new Set<string>(CATEGORIES.map((c) => c.slug));
const VALID_BADGES = new Set<string>(PRODUCT_BADGES);

export function isSafeHttpUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

export type ValidationResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export function validateProductInput(
  raw: unknown
): ValidationResult<ProductInput> {
  if (!raw || typeof raw !== "object") {
    return { ok: false, error: "Invalid request payload." };
  }

  const body = raw as Record<string, unknown>;
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const sku = typeof body.sku === "string" ? body.sku.trim().toUpperCase() : "";
  const category =
    typeof body.category === "string" ? body.category.trim() : "";
  const price = Number(body.price);
  const originalPriceRaw =
    body.originalPrice !== undefined &&
    body.originalPrice !== null &&
    body.originalPrice !== ""
      ? Number(body.originalPrice)
      : undefined;

  if (!name || name.length < 3) {
    return { ok: false, error: "Product name must be at least 3 characters." };
  }
  if (!sku || sku.length < 2) {
    return { ok: false, error: "SKU is required." };
  }
  if (!VALID_CATEGORIES.has(category)) {
    return { ok: false, error: "Invalid product category." };
  }
  if (!Number.isFinite(price) || price <= 0) {
    return { ok: false, error: "Price must be a positive number." };
  }
  if (
    originalPriceRaw !== undefined &&
    (!Number.isFinite(originalPriceRaw) || originalPriceRaw < 0)
  ) {
    return { ok: false, error: "Original price must be a valid number." };
  }

  const linksObj =
    body.links && typeof body.links === "object"
      ? (body.links as Record<string, unknown>)
      : {};
  const shopee =
    typeof linksObj.shopee === "string" ? linksObj.shopee.trim() : "";
  const tiktokShop =
    typeof linksObj.tiktokShop === "string" ? linksObj.tiktokShop.trim() : "";

  if (shopee && !isSafeHttpUrl(shopee)) {
    return {
      ok: false,
      error: "Shopee URL must start with http:// or https://",
    };
  }
  if (tiktokShop && !isSafeHttpUrl(tiktokShop)) {
    return {
      ok: false,
      error: "TikTok Shop URL must start with http:// or https://",
    };
  }

  const imagesRaw = Array.isArray(body.images) ? body.images : [];
  const images: ProductImage[] = imagesRaw
    .filter(
      (img): img is ProductImage =>
        Boolean(
          img &&
            typeof img === "object" &&
            typeof (img as { url?: unknown }).url === "string" &&
            (img as { url: string }).url.trim()
        )
    )
    .map((img) => ({
      url: img.url.trim(),
      alt: (img.alt && img.alt.trim()) || name,
      ...(img.label ? { label: img.label } : {}),
    }));

  if (images.length === 0) {
    images.push({
      url: DEFAULT_PRODUCT_IMAGE,
      alt: name,
      label: "Main",
    });
  }

  const shortSpecs = Array.isArray(body.shortSpecs)
    ? body.shortSpecs
        .filter((s): s is string => typeof s === "string" && s.trim().length > 0)
        .map((s) => s.trim())
        .slice(0, 4)
    : [];

  const compatibility = Array.isArray(body.compatibility)
    ? body.compatibility
        .filter((c): c is string => typeof c === "string" && c.trim().length > 0)
        .map((c) => c.trim())
    : ["Universal"];

  const inTheBox = Array.isArray(body.inTheBox)
    ? body.inTheBox
        .filter((i): i is string => typeof i === "string" && i.trim().length > 0)
        .map((i) => i.trim())
    : [];

  const fullSpecs: Record<string, string> = {};
  if (
    body.fullSpecs &&
    typeof body.fullSpecs === "object" &&
    !Array.isArray(body.fullSpecs)
  ) {
    for (const [k, v] of Object.entries(
      body.fullSpecs as Record<string, unknown>
    )) {
      if (k.trim() && typeof v === "string" && v.trim()) {
        fullSpecs[k.trim()] = v.trim();
      }
    }
  }

  const badges = Array.isArray(body.badges)
    ? body.badges.filter(
        (b): b is ProductBadge => typeof b === "string" && VALID_BADGES.has(b)
      )
    : [];

  const description =
    typeof body.description === "string" && body.description.trim()
      ? body.description.trim()
      : `${name} — precision motorcycle accessory from CR7 MOTO.`;

  const fitmentNotes =
    typeof body.fitmentNotes === "string" && body.fitmentNotes.trim()
      ? body.fitmentNotes.trim()
      : "Verify handlebar, socket, or bracket clearance before installation.";

  return {
    ok: true,
    data: {
      name,
      sku,
      slug:
        typeof body.slug === "string" && body.slug.trim()
          ? slugify(body.slug)
          : slugify(name),
      category: category as CategorySlug,
      price: Math.round(price),
      ...(originalPriceRaw && originalPriceRaw > price
        ? { originalPrice: Math.round(originalPriceRaw) }
        : {}),
      currency: body.currency === "USD" ? "USD" : "IDR",
      images,
      shortSpecs,
      fullSpecs,
      inTheBox,
      fitmentNotes,
      compatibility: compatibility.length > 0 ? compatibility : ["Universal"],
      badges,
      featured: Boolean(body.featured),
      inStock: body.inStock !== false,
      links: {
        ...(shopee ? { shopee } : {}),
        ...(tiktokShop ? { tiktokShop } : {}),
      },
      description,
    },
  };
}
