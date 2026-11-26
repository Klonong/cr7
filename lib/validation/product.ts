import { DEFAULT_PRODUCT_IMAGE, PRODUCT_BADGES } from "@/config/store";
import { slugify } from "@/lib/format";
import type {
  CategorySlug,
  ProductBadge,
  ProductImage,
  ProductInput,
  ProductVariant,
} from "@/interface/catalog";

const VALID_BADGES = new Set<string>(PRODUCT_BADGES);
const LOCAL_IMAGE_PATH_REGEX = /^\/(?:images|uploads)\/[a-zA-Z0-9._-]+$/;
const HEX_COLOR_REGEX = /^#[0-9a-fA-F]{6}$/;

const SHOPEE_ALLOWED_HOSTS = new Set([
  "shopee.co.id",
  "www.shopee.co.id",
  "s.shopee.co.id",
  "shp.ee",
  "shopee.com",
]);

const TIKTOK_ALLOWED_HOSTS = new Set([
  "shop.tiktok.com",
  "vt.tiktok.com",
  "vm.tiktok.com",
  "tiktok.com",
  "www.tiktok.com",
  "shop-id.tokopedia.com",
  "www.tokopedia.com",
  "tokopedia.com",
]);

export function isSafeHttpUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function isAllowedMarketplaceUrl(
  url: string,
  platform: "shopee" | "tiktok"
): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return false;
    const host = parsed.hostname.toLowerCase();
    const allowlist =
      platform === "shopee" ? SHOPEE_ALLOWED_HOSTS : TIKTOK_ALLOWED_HOSTS;
    return allowlist.has(host);
  } catch {
    return false;
  }
}

export function isSafeLocalImageUrl(src: string): boolean {
  const trimmed = src.trim();
  if (!trimmed || trimmed.includes("..")) return false;
  return LOCAL_IMAGE_PATH_REGEX.test(trimmed);
}

export type ValidationResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export function validateProductInput(
  raw: unknown,
  validCategorySlugs?: readonly string[]
): ValidationResult<ProductInput> {
  if (!raw || typeof raw !== "object") {
    return { ok: false, error: "Data produk tidak valid." };
  }

  const body = raw as Record<string, unknown>;
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const sku = typeof body.sku === "string" ? body.sku.trim().toUpperCase() : "";
  const category =
    typeof body.category === "string" ? slugify(body.category) : "";
  const price = Number(body.price);
  const originalPriceRaw =
    body.originalPrice !== undefined &&
    body.originalPrice !== null &&
    body.originalPrice !== ""
      ? Number(body.originalPrice)
      : undefined;

  if (!name || name.length < 3 || name.length > 140) {
    return { ok: false, error: "Nama produk harus 3–140 karakter." };
  }
  if (!sku || sku.length < 2 || sku.length > 40) {
    return { ok: false, error: "Kode SKU harus 2–40 karakter." };
  }
  const allowedCategorySet = validCategorySlugs
    ? new Set(validCategorySlugs)
    : null;
  if (!category || (allowedCategorySet && !allowedCategorySet.has(category))) {
    return { ok: false, error: "Silakan pilih kategori produk yang valid." };
  }
  if (!Number.isFinite(price) || price <= 0 || price > 1_000_000_000) {
    return {
      ok: false,
      error: "Harga harus berupa angka valid antara Rp 1 hingga Rp 1.000.000.000.",
    };
  }
  if (
    originalPriceRaw !== undefined &&
    (!Number.isFinite(originalPriceRaw) ||
      originalPriceRaw < 0 ||
      originalPriceRaw > 1_000_000_000)
  ) {
    return { ok: false, error: "Harga coret harus berupa angka yang valid." };
  }

  const linksObj =
    body.links && typeof body.links === "object"
      ? (body.links as Record<string, unknown>)
      : {};
  const shopee =
    typeof linksObj.shopee === "string" ? linksObj.shopee.trim() : "";
  const tiktokShop =
    typeof linksObj.tiktokShop === "string" ? linksObj.tiktokShop.trim() : "";

  if (shopee && !isAllowedMarketplaceUrl(shopee, "shopee")) {
    return {
      ok: false,
      error:
        "Link Shopee harus menggunakan https:// dengan domain resmi Shopee (shopee.co.id / s.shopee.co.id).",
    };
  }
  if (tiktokShop && !isAllowedMarketplaceUrl(tiktokShop, "tiktok")) {
    return {
      ok: false,
      error:
        "Link TikTok Shop harus menggunakan https:// dengan domain resmi TikTok / Tokopedia.",
    };
  }

  const imagesRaw = Array.isArray(body.images) ? body.images.slice(0, 10) : [];
  const images: ProductImage[] = [];
  for (const img of imagesRaw) {
    if (!img || typeof img !== "object") continue;
    const item = img as { url?: unknown; alt?: unknown; label?: unknown };
    if (typeof item.url !== "string" || !item.url.trim()) continue;
    const cleanUrl = item.url.trim();
    if (!isSafeLocalImageUrl(cleanUrl)) {
      return {
        ok: false,
        error:
          "Path foto produk harus berasal dari folder lokal /images/... atau /uploads/... yang valid.",
      };
    }
    images.push({
      url: cleanUrl,
      alt:
        typeof item.alt === "string" && item.alt.trim()
          ? item.alt.trim().slice(0, 160)
          : name,
      ...(item.label === "Utama" ||
      item.label === "Pola Cahaya" ||
      item.label === "Detail" ||
      item.label === "Kelengkapan"
        ? { label: item.label }
        : {}),
    });
  }

  if (images.length === 0) {
    images.push({
      url: DEFAULT_PRODUCT_IMAGE,
      alt: name,
      label: "Utama",
    });
  }

  // Parse & strictly validate variants (capped at 20)
  const variantsRaw = Array.isArray(body.variants)
    ? body.variants.slice(0, 20)
    : [];
  const variants: ProductVariant[] = [];
  for (let i = 0; i < variantsRaw.length; i++) {
    const v = variantsRaw[i];
    if (!v || typeof v !== "object") continue;
    const item = v as Record<string, unknown>;
    const vName =
      typeof item.name === "string" ? item.name.trim().slice(0, 80) : "";
    if (!vName) continue;

    const vPrice =
      item.price !== undefined && item.price !== null && item.price !== ""
        ? Number(item.price)
        : undefined;
    if (
      vPrice !== undefined &&
      (!Number.isFinite(vPrice) || vPrice <= 0 || vPrice > 1_000_000_000)
    ) {
      return {
        ok: false,
        error: `Harga varian "${vName}" harus lebih dari 0.`,
      };
    }

    const vShopee =
      typeof item.shopeeUrl === "string" ? item.shopeeUrl.trim() : "";
    const vTiktok =
      typeof item.tiktokShopUrl === "string" ? item.tiktokShopUrl.trim() : "";
    if (vShopee && !isAllowedMarketplaceUrl(vShopee, "shopee")) {
      return {
        ok: false,
        error: `Link Shopee varian "${vName}" harus https:// domain resmi Shopee.`,
      };
    }
    if (vTiktok && !isAllowedMarketplaceUrl(vTiktok, "tiktok")) {
      return {
        ok: false,
        error: `Link TikTok varian "${vName}" harus https:// domain resmi TikTok.`,
      };
    }

    const rawHex =
      typeof item.colorHex === "string" ? item.colorHex.trim() : "";
    const safeColorHex =
      rawHex && HEX_COLOR_REGEX.test(rawHex) ? rawHex : undefined;

    variants.push({
      id:
        typeof item.id === "string" && item.id.trim()
          ? item.id.trim().slice(0, 64)
          : `var-${slugify(vName) || i + 1}`,
      name: vName,
      ...(typeof item.sku === "string" && item.sku.trim()
        ? { sku: item.sku.trim().toUpperCase().slice(0, 40) }
        : {}),
      ...(vPrice ? { price: Math.round(vPrice) } : {}),
      inStock: item.inStock !== false,
      ...(safeColorHex ? { colorHex: safeColorHex } : {}),
      ...(vShopee ? { shopeeUrl: vShopee } : {}),
      ...(vTiktok ? { tiktokShopUrl: vTiktok } : {}),
    });
  }

  const shortSpecs = Array.isArray(body.shortSpecs)
    ? body.shortSpecs
        .filter((s): s is string => typeof s === "string" && s.trim().length > 0)
        .map((s) => s.trim().slice(0, 48))
        .slice(0, 4)
    : [];

  const compatibility = Array.isArray(body.compatibility)
    ? body.compatibility
        .filter((c): c is string => typeof c === "string" && c.trim().length > 0)
        .map((c) => c.trim().slice(0, 60))
        .slice(0, 30)
    : ["Universal"];

  const inTheBox = Array.isArray(body.inTheBox)
    ? body.inTheBox
        .filter((i): i is string => typeof i === "string" && i.trim().length > 0)
        .map((i) => i.trim().slice(0, 120))
        .slice(0, 20)
    : [];

  const fullSpecs: Record<string, string> = {};
  if (
    body.fullSpecs &&
    typeof body.fullSpecs === "object" &&
    !Array.isArray(body.fullSpecs)
  ) {
    let count = 0;
    for (const [k, v] of Object.entries(
      body.fullSpecs as Record<string, unknown>
    )) {
      if (count >= 30) break;
      if (k.trim() && typeof v === "string" && v.trim()) {
        fullSpecs[k.trim().slice(0, 64)] = v.trim().slice(0, 160);
        count += 1;
      }
    }
  }

  const badges = Array.isArray(body.badges)
    ? body.badges
        .filter(
          (b): b is ProductBadge => typeof b === "string" && VALID_BADGES.has(b)
        )
        .slice(0, 4)
    : [];

  const description =
    typeof body.description === "string" && body.description.trim()
      ? body.description.trim().slice(0, 2000)
      : `${name} — aksesori motor presisi resmi dari CR7 Racing.`;

  const fitmentNotes =
    typeof body.fitmentNotes === "string" && body.fitmentNotes.trim()
      ? body.fitmentNotes.trim().slice(0, 1000)
      : "Pastikan kecocokan soket, dudukan stang, atau ruang reflektor sebelum pemasangan.";

  const resolvedSlug =
    typeof body.slug === "string" && body.slug.trim()
      ? slugify(body.slug).slice(0, 100)
      : slugify(name).slice(0, 100);

  return {
    ok: true,
    data: {
      name,
      sku,
      slug: resolvedSlug,
      category: category as CategorySlug,
      price: Math.round(price),
      ...(originalPriceRaw && originalPriceRaw > price
        ? { originalPrice: Math.round(originalPriceRaw) }
        : {}),
      currency: body.currency === "USD" ? "USD" : "IDR",
      images,
      variants,
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
