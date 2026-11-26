import type { Category, Motorcycle, Product } from "./catalog";
import type { HomeContent, HomeHighlight } from "./home";

export interface ApiErrorResponse {
  error: string;
}

export interface ProductsListResponse {
  products: Product[];
}

export interface ProductMutationResponse {
  product: Product;
}

export interface CategoriesListResponse {
  categories: Category[];
}

export interface CategoryMutationResponse {
  category: Category;
}

export interface MotorcyclesListResponse {
  motorcycles: Motorcycle[];
}

export interface MotorcycleMutationResponse {
  motorcycle: Motorcycle;
}

export interface UploadImageResponse {
  url: string;
}

export interface HomeContentResponse {
  content: HomeContent;
}

export interface HighlightMutationResponse {
  highlight: HomeHighlight;
}

export interface DeleteResponse {
  ok: true;
  id: string;
}

export interface AuthLoginResponse {
  ok: true;
  username: string;
}

export interface AuthLogoutResponse {
  ok: true;
}

export interface AdminSession {
  username: string;
}
