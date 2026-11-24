export type CategorySlug =
  | "led-headlights"
  | "signals-tail-lights"
  | "controls-cockpit"
  | "protection-body"
  | "touring-mounts"
  | "electrical-relays";

export interface Category {
  slug: CategorySlug;
  name: string;
  shortName: string;
  description: string;
  image: string;
}

export type CurrencyCode = "IDR" | "USD";

export type MarketplacePlatform = "shopee" | "tiktok";

export type MarketplaceFilter = "all" | MarketplacePlatform;

export type SortOption = "featured" | "price-asc" | "price-desc" | "newest";

export type ProductBadge =
  | "Best Seller"
  | "New Arrival"
  | "Waterproof"
  | "CNC Alloy";

export interface ProductImage {
  url: string;
  alt: string;
  label?: "Main" | "Beam Pattern" | "Detail" | "Kit View";
}

export interface ProductLinks {
  shopee?: string;
  tiktokShop?: string;
}

export interface Product {
  id: string;
  slug: string;
  sku: string;
  name: string;
  category: CategorySlug;
  price: number;
  originalPrice?: number;
  currency: CurrencyCode;
  images: ProductImage[];
  shortSpecs: string[];
  fullSpecs: Record<string, string>;
  inTheBox: string[];
  fitmentNotes: string;
  compatibility: string[];
  badges?: ProductBadge[];
  featured?: boolean;
  inStock: boolean;
  links: ProductLinks;
  description: string;
}

export interface ProductInput {
  name: string;
  sku: string;
  slug?: string;
  category: CategorySlug;
  price: number;
  originalPrice?: number;
  currency?: CurrencyCode;
  images: ProductImage[];
  shortSpecs: string[];
  fullSpecs: Record<string, string>;
  inTheBox: string[];
  fitmentNotes: string;
  compatibility: string[];
  badges?: ProductBadge[];
  featured?: boolean;
  inStock: boolean;
  links: ProductLinks;
  description: string;
}

export interface ProductFilterCriteria {
  query?: string;
  categories?: CategorySlug[];
  bike?: string;
  marketplace?: MarketplaceFilter;
  badges?: ProductBadge[];
  inStockOnly?: boolean;
  stockStatus?: "all" | "in" | "out";
}

export interface CatalogStats {
  total: number;
  inStock: number;
  soldOut: number;
  shopeeLinked: number;
  tiktokLinked: number;
}
