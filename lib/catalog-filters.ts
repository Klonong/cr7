import type {
  CatalogAttentionItem,
  CatalogStats,
  CategoryBreakdownItem,
  Product,
  ProductFilterCriteria,
  SortOption,
} from "@/interface/catalog";

export function filterProducts(
  products: readonly Product[],
  criteria: ProductFilterCriteria
): Product[] {
  const normalizedQuery = criteria.query?.trim().toLowerCase() ?? "";

  return products.filter((product) => {
    if (
      criteria.categories &&
      criteria.categories.length > 0 &&
      !criteria.categories.includes(product.category)
    ) {
      return false;
    }

    if (criteria.bike) {
      const fits =
        product.compatibility.includes(criteria.bike) ||
        product.compatibility.includes("Universal");
      if (!fits) return false;
    }

    if (criteria.marketplace === "shopee" && !product.links.shopee) {
      return false;
    }
    if (criteria.marketplace === "tiktok" && !product.links.tiktokShop) {
      return false;
    }

    if (
      criteria.badges &&
      criteria.badges.length > 0 &&
      !criteria.badges.every((badge) => product.badges?.includes(badge))
    ) {
      return false;
    }

    if (criteria.inStockOnly && !product.inStock) {
      return false;
    }

    if (criteria.stockStatus === "in" && !product.inStock) {
      return false;
    }
    if (criteria.stockStatus === "out" && product.inStock) {
      return false;
    }

    if (normalizedQuery) {
      const haystack = [
        product.name,
        product.sku,
        product.description,
        ...product.shortSpecs,
        ...product.compatibility,
      ]
        .join(" ")
        .toLowerCase();

      if (!haystack.includes(normalizedQuery)) return false;
    }

    return true;
  });
}

export function sortProducts(
  products: readonly Product[],
  sortBy: SortOption
): Product[] {
  const sorted = [...products];

  switch (sortBy) {
    case "price-asc":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      sorted.sort((a, b) => b.price - a.price);
      break;
    case "newest":
      sorted.sort((a, b) => {
        const aNew = a.badges?.includes("Baru") ? 1 : 0;
        const bNew = b.badges?.includes("Baru") ? 1 : 0;
        return bNew - aNew;
      });
      break;
    case "featured":
    default:
      sorted.sort(
        (a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured))
      );
      break;
  }

  return sorted;
}

export function getRelatedProducts(
  allProducts: readonly Product[],
  current: Product,
  limit = 4
): Product[] {
  const sameCategory = allProducts.filter(
    (p) => p.category === current.category && p.id !== current.id
  );
  if (sameCategory.length >= limit) {
    return sameCategory.slice(0, limit);
  }
  const others = allProducts.filter(
    (p) => p.category !== current.category && p.id !== current.id
  );
  return [...sameCategory, ...others].slice(0, limit);
}

export function getFeaturedProducts(
  products: readonly Product[],
  limit = 8
): Product[] {
  const featured = products.filter((p) => p.featured);
  return (featured.length > 0 ? featured : products).slice(0, limit);
}

export function computeCatalogStats(products: readonly Product[]): CatalogStats {
  let inStock = 0;
  let shopeeLinked = 0;
  let tiktokLinked = 0;

  for (const product of products) {
    if (product.inStock) inStock += 1;
    if (product.links.shopee) shopeeLinked += 1;
    if (product.links.tiktokShop) tiktokLinked += 1;
  }

  return {
    total: products.length,
    inStock,
    soldOut: products.length - inStock,
    shopeeLinked,
    tiktokLinked,
  };
}

export type { CatalogAttentionItem, CategoryBreakdownItem };

export function computeCategoryBreakdown(
  products: readonly Product[],
  categorySlugs: readonly Product["category"][]
): CategoryBreakdownItem[] {
  const total = products.length || 1;
  return categorySlugs.map((slug) => {
    const matches = products.filter((p) => p.category === slug);
    const inStockCount = matches.filter((p) => p.inStock).length;
    return {
      slug,
      count: matches.length,
      inStockCount,
      percentage: Math.round((matches.length / total) * 100),
    };
  });
}

export function getCatalogAttentionItems(
  products: readonly Product[]
): CatalogAttentionItem[] {
  const items: CatalogAttentionItem[] = [];

  for (const product of products) {
    const reasons: CatalogAttentionItem["reasons"] = [];
    if (!product.inStock) reasons.push("Sold Out");
    if (!product.links.shopee) reasons.push("No Shopee Link");
    if (!product.links.tiktokShop) reasons.push("No TikTok Link");
    if (reasons.length > 0) {
      items.push({ product, reasons });
    }
  }

  return items;
}
