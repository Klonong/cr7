import type { Product } from "./catalog";

export interface ApiErrorResponse {
  error: string;
}

export interface ProductsListResponse {
  products: Product[];
}

export interface ProductMutationResponse {
  product: Product;
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
