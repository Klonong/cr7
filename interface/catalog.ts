export type CategorySlug = string;

export interface Category {
  slug: CategorySlug;
  name: string;
  shortName: string;
  description: string;
}

export interface CategoryInput {
  name: string;
  shortName: string;
  slug?: string;
  description: string;
}

export type MotorcycleType =
  | "Matic"
  | "Sport"
  | "Bebek"
  | "Trail / Adventure"
  | "Universal";

export interface Motorcycle {
  id: string;
  brand: string;
  model: string;
  name: string;
  type: MotorcycleType;
}

export interface MotorcycleInput {
  brand: string;
  model: string;
  name?: string;
  type: MotorcycleType;
}

export type CurrencyCode = "IDR" | "USD";

export type MarketplacePlatform = "shopee" | "tiktok";

export type MarketplaceFilter = "all" | MarketplacePlatform;

export type SortOption = "featured" | "price-asc" | "price-desc" | "newest";

export type ProductBadge =
  | "Terlaris"
  | "Baru"
  | "Waterproof"
  | "CNC Alloy";

export interface ProductImage {
  url: string;
  alt: string;
  label?: "Utama" | "Pola Cahaya" | "Detail" | "Kelengkapan";
}

export interface ProductLinks {
  shopee?: string;
  tiktokShop?: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku?: string;
  price?: number;
  inStock: boolean;
  colorHex?: string;
  shopeeUrl?: string;
  tiktokShopUrl?: string;
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
  variants: ProductVariant[];
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
  variants: ProductVariant[];
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

export interface CategoryBreakdownItem {
  slug: CategorySlug;
  count: number;
  inStockCount: number;
  percentage: number;
}

export interface CatalogAttentionItem {
  product: Product;
  reasons: ("Sold Out" | "No Shopee Link" | "No TikTok Link")[];
}
