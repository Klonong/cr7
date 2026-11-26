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
  role: AdminRole;
  expiresAt: string;
}

export interface AuthLogoutResponse {
  ok: true;
}

export type AdminRole = "ADMIN" | "SUPER_ADMIN";

export interface AdminSession {
  userId: string;
  username: string;
  role: AdminRole;
  tokenVersion: number;
}

export interface AdminJwtPayload {
  sub: string;
  username: string;
  role: AdminRole;
  ver: number;
  iat?: number;
  exp?: number;
}

export interface AdminUserRecord {
  id: string;
  username: string;
  passwordHash: string;
  role: AdminRole;
  isActive: boolean;
  tokenVersion: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminUserPublic {
  id: string;
  username: string;
  role: AdminRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUserCreateInput {
  username: string;
  password: string;
  role: AdminRole;
}

export interface AdminUserUpdateInput {
  password?: string;
  role?: AdminRole;
  isActive?: boolean;
}

export interface AdminUsersListResponse {
  users: AdminUserPublic[];
}

export interface AdminUserMutationResponse {
  user: AdminUserPublic;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}
