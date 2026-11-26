import type { Category, CategorySlug, Product } from "./catalog";

export type Theme = "light" | "dark";

export interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export interface AdminFeedback {
  type: "success" | "error";
  message: string;
}

export interface VariantDraft {
  id: string;
  name: string;
  sku: string;
  price: string;
  colorHex: string;
  inStock: boolean;
  shopeeUrl: string;
  tiktokShopUrl: string;
}

export interface UseProductFiltersOptions {
  products: readonly Product[];
  categories: readonly Category[];
  initialCategory?: CategorySlug | null;
  initialBike?: string;
  initialQuery?: string;
}
