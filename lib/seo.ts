import { STORE_CONFIG, YOUTUBE_SHOWCASE_VIDEOS } from "@/config/store";
import type { Category, Product } from "@/interface/catalog";
import type { SeoBreadcrumbItem } from "@/interface/seo";

const DEFAULT_SITE_URL = "https://cr7racing.id";

function normalizeSiteUrl(raw: string | undefined): string {
  const value = (raw || "").trim().replace(/\/+$/, "");
  if (!value) return DEFAULT_SITE_URL;
  try {
    const parsed = new URL(value);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return parsed.origin;
    }
  } catch {
    // Fall back to default canonical domain when env is malformed
  }
  return DEFAULT_SITE_URL;
}

export const SITE_URL = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);

export function toAbsoluteUrl(pathOrUrl: string): string {
  if (!pathOrUrl) return SITE_URL;
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl;
  }
  const normalizedPath = pathOrUrl.startsWith("/")
    ? pathOrUrl
    : `/${pathOrUrl}`;
  return `${SITE_URL}${normalizedPath}`;
}

/**
 * Safely serializes JSON-LD while escaping `<` to prevent `</script>` XSS injection
 * (per official Next.js 16 JSON-LD security guidance).
 */
export function serializeJsonLd(
  data: Record<string, unknown> | Array<Record<string, unknown>>
): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function buildOrganizationJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: STORE_CONFIG.brandName,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: toAbsoluteUrl("/images/cr7-logo.png"),
    },
    description:
      "Katalog resmi aksesoris motor, lampu LED Bi-LED projector, SQL laser, dan part CNC presisi CR7 Racing Indonesia.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Jakarta",
      addressCountry: "ID",
    },
    sameAs: [
      STORE_CONFIG.instagramUrl,
      STORE_CONFIG.facebookUrl,
      STORE_CONFIG.youtubeChannelUrl,
      STORE_CONFIG.tiktokUrl,
      STORE_CONFIG.officialShopeeUrl,
      STORE_CONFIG.officialTikTokShopUrl,
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        availableLanguage: ["Indonesian"],
        url: STORE_CONFIG.whatsappConsultUrl,
      },
    ],
  };
}

export function buildWebSiteJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: STORE_CONFIG.brandName,
    inLanguage: "id-ID",
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/products?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildBreadcrumbJsonLd(
  items: readonly SeoBreadcrumbItem[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: toAbsoluteUrl(item.path),
    })),
  };
}

export function buildCatalogCollectionJsonLd(
  products: readonly Product[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Katalog Part & Aksesoris Motor CR7 Racing",
    url: toAbsoluteUrl("/products"),
    inLanguage: "id-ID",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: products.length,
      itemListElement: products.slice(0, 50).map((product, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        url: toAbsoluteUrl(`/products/${product.slug}`),
        name: product.name,
      })),
    },
  };
}

export function buildProductJsonLd(
  product: Product,
  category?: Category
): Record<string, unknown> {
  const productUrl = toAbsoluteUrl(`/products/${product.slug}`);
  const images = product.images.map((img) => toAbsoluteUrl(img.url));
  const variantPrices = (product.variants ?? [])
    .map((v) => v.price)
    .filter((p): p is number => typeof p === "number" && p > 0);
  const allPrices = [product.price, ...variantPrices];
  const lowPrice = Math.min(...allPrices);
  const highPrice = Math.max(...allPrices);

  const availability = product.inStock
    ? "https://schema.org/InStock"
    : "https://schema.org/OutOfStock";

  const offers =
    highPrice > lowPrice
      ? {
          "@type": "AggregateOffer",
          url: productUrl,
          priceCurrency: product.currency || "IDR",
          lowPrice,
          highPrice,
          offerCount: Math.max(1, product.variants?.length ?? 1),
          availability,
          itemCondition: "https://schema.org/NewCondition",
          seller: { "@id": `${SITE_URL}/#organization` },
        }
      : {
          "@type": "Offer",
          url: productUrl,
          priceCurrency: product.currency || "IDR",
          price: product.price,
          availability,
          itemCondition: "https://schema.org/NewCondition",
          seller: { "@id": `${SITE_URL}/#organization` },
        };

  const additionalProperty = Object.entries(product.fullSpecs).map(
    ([name, value]) => ({
      "@type": "PropertyValue",
      name,
      value,
    })
  );

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${productUrl}#product`,
    name: product.name,
    sku: product.sku,
    mpn: product.sku,
    description: product.description,
    image: images.length > 0 ? images : [toAbsoluteUrl("/opengraph-image")],
    url: productUrl,
    category: category?.name ?? product.category,
    brand: {
      "@type": "Brand",
      name: STORE_CONFIG.brandName,
    },
    offers,
    ...(additionalProperty.length > 0 ? { additionalProperty } : {}),
  };
}

export function buildProductFaqJsonLd(product: Product): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Bagaimana cara membeli ${product.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: "Website ini adalah katalog resmi CR7 Racing. Pilih varian yang diinginkan, lalu klik Beli di Shopee atau Beli di TikTok Shop untuk checkout aman dengan voucher dan COD.",
        },
      },
      {
        "@type": "Question",
        name: "Apakah lampu LED wajib pakai relay set?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Untuk lampu tembak atau Bi-LED 30W ke atas, sangat disarankan menggunakan Kabel Relay Set 40A CR7 Racing agar tegangan aki stabil, cahaya maksimal, dan saklar standar motor tetap awet.",
        },
      },
      {
        "@type": "Question",
        name: "Bagaimana cara klaim garansi resmi CR7 Racing?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Wajib merekam video unboxing saat paket diterima dan simpan kartu garansi CR7 Racing. Klaim langsung diproses melalui chat toko Shopee atau TikTok Shop dengan menyertakan nomor pesanan.",
        },
      },
    ],
  };
}

export function buildAboutPageJsonLd(): Array<Record<string, unknown>> {
  const aboutPage: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "Tentang CR7 Racing",
    url: toAbsoluteUrl("/about"),
    inLanguage: "id-ID",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    mainEntity: { "@id": `${SITE_URL}/#organization` },
  };

  const videos: Array<Record<string, unknown>> = YOUTUBE_SHOWCASE_VIDEOS.map(
    (video) => ({
      "@context": "https://schema.org",
      "@type": "VideoObject",
      name: video.title,
      description: video.description,
      thumbnailUrl: [
        `https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`,
      ],
      embedUrl: `https://www.youtube-nocookie.com/embed/${video.youtubeId}`,
      contentUrl: `https://www.youtube.com/watch?v=${video.youtubeId}`,
      publisher: { "@id": `${SITE_URL}/#organization` },
    })
  );

  return [aboutPage, ...videos];
}
