import { DEFAULT_PRODUCT_IMAGE, PRODUCT_BADGES } from "@/config/store";
import { slugify } from "@/lib/format";
import type {
  CategorySlug,
  ProductBadge,
  ProductImage,
  ProductInput,
  ProductVariant,
} from "@/types/catalog";

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

  if (!name || name.length < 3) {
    return { ok: false, error: "Nama produk minimal 3 karakter." };
  }
  if (!sku || sku.length < 2) {
    return { ok: false, error: "Kode SKU wajib diisi." };
  }
  const allowedCategorySet = validCategorySlugs
    ? new Set(validCategorySlugs)
    : null;
  if (!category || (allowedCategorySet && !allowedCategorySet.has(category))) {
    return { ok: false, error: "Silakan pilih kategori produk yang valid." };
  }
  if (!Number.isFinite(price) || price <= 0) {
    return { ok: false, error: "Harga harus berupa angka lebih dari 0." };
  }
  if (
    originalPriceRaw !== undefined &&
    (!Number.isFinite(originalPriceRaw) || originalPriceRaw < 0)
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

  if (shopee && !isSafeHttpUrl(shopee)) {
    return {
      ok: false,
      error: "Link Shopee harus diawali http:// atau https://",
    };
  }
  if (tiktokShop && !isSafeHttpUrl(tiktokShop)) {
    return {
      ok: false,
      error: "Link TikTok Shop harus diawali http:// atau https://",
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
      label: "Utama",
    });
  }

  // Parse & validate variants
  const variantsRaw = Array.isArray(body.variants) ? body.variants : [];
  const variants: ProductVariant[] = [];
  for (let i = 0; i < variantsRaw.length; i++) {
    const v = variantsRaw[i];
    if (!v || typeof v !== "object") continue;
    const item = v as Record<string, unknown>;
    const vName = typeof item.name === "string" ? item.name.trim() : "";
    if (!vName) continue;

    const vPrice =
      item.price !== undefined && item.price !== null && item.price !== ""
        ? Number(item.price)
        : undefined;
    if (vPrice !== undefined && (!Number.isFinite(vPrice) || vPrice <= 0)) {
      return {
        ok: false,
        error: `Harga varian "${vName}" harus lebih dari 0.`,
      };
    }

    const vShopee =
      typeof item.shopeeUrl === "string" ? item.shopeeUrl.trim() : "";
    const vTiktok =
      typeof item.tiktokShopUrl === "string" ? item.tiktokShopUrl.trim() : "";
    if (vShopee && !isSafeHttpUrl(vShopee)) {
      return {
        ok: false,
        error: `Link Shopee varian "${vName}" harus diawali http(s)://`,
      };
    }
    if (vTiktok && !isSafeHttpUrl(vTiktok)) {
      return {
        ok: false,
        error: `Link TikTok varian "${vName}" harus diawali http(s)://`,
      };
    }

    variants.push({
      id:
        typeof item.id === "string" && item.id.trim()
          ? item.id.trim()
          : `var-${slugify(vName) || i + 1}`,
      name: vName,
      ...(typeof item.sku === "string" && item.sku.trim()
        ? { sku: item.sku.trim().toUpperCase() }
        : {}),
      ...(vPrice ? { price: Math.round(vPrice) } : {}),
      inStock: item.inStock !== false,
      ...(typeof item.colorHex === "string" && item.colorHex.trim()
        ? { colorHex: item.colorHex.trim() }
        : {}),
      ...(vShopee ? { shopeeUrl: vShopee } : {}),
      ...(vTiktok ? { tiktokShopUrl: vTiktok } : {}),
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
      : `${name} — aksesoris motor presisi resmi dari CR7 Racing.`;

  const fitmentNotes =
    typeof body.fitmentNotes === "string" && body.fitmentNotes.trim()
      ? body.fitmentNotes.trim()
      : "Pastikan kecocokan soket, dudukan stang, atau ruang reflektor sebelum pemasangan.";

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
