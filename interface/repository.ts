import type {
  AdminRole,
  AdminUserPublic,
  AdminUserRecord,
} from "./api";
import type {
  Category,
  CategoryInput,
  Motorcycle,
  MotorcycleInput,
  Product,
  ProductInput,
} from "./catalog";
import type {
  HomeContent,
  HomeHighlight,
  HomeHighlightInput,
  HomeSettingsInput,
} from "./home";

export interface CatalogRepository {
  findAll(): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  findBySlug(slug: string): Promise<Product | null>;
  create(input: ProductInput): Promise<Product>;
  update(id: string, input: ProductInput): Promise<Product | null>;
  updateStock(id: string, inStock: boolean): Promise<Product | null>;
  delete(id: string): Promise<boolean>;
}

export interface CategoryRepository {
  findAll(): Promise<Category[]>;
  findBySlug(slug: string): Promise<Category | null>;
  countProducts(slug: string): Promise<number>;
  create(input: CategoryInput): Promise<Category>;
  update(slug: string, input: CategoryInput): Promise<Category | null>;
  delete(slug: string): Promise<boolean>;
}

export interface MotorcycleRepository {
  findAll(): Promise<Motorcycle[]>;
  create(input: MotorcycleInput): Promise<Motorcycle>;
  delete(id: string): Promise<boolean>;
}

export interface HomeRepository {
  getContent(): Promise<HomeContent>;
  updateSettings(input: HomeSettingsInput): Promise<HomeContent>;
  createHighlight(input: HomeHighlightInput): Promise<HomeHighlight>;
  updateHighlight(
    id: string,
    input: HomeHighlightInput
  ): Promise<HomeHighlight | null>;
  toggleHighlight(id: string, active: boolean): Promise<HomeHighlight | null>;
  deleteHighlight(id: string): Promise<boolean>;
}

export interface AdminUserRepository {
  findAllPublic(): Promise<AdminUserPublic[]>;
  findByUsername(username: string): Promise<AdminUserRecord | null>;
  findById(id: string): Promise<AdminUserRecord | null>;
  countActiveSuperAdmins(): Promise<number>;
  create(input: {
    username: string;
    passwordHash: string;
    role: AdminRole;
  }): Promise<AdminUserPublic>;
  update(
    id: string,
    input: {
      passwordHash?: string;
      role?: AdminRole;
      isActive?: boolean;
      bumpTokenVersion?: boolean;
    }
  ): Promise<AdminUserPublic | null>;
  delete(id: string): Promise<boolean>;
  ensureDefaultAdmin(
    username: string,
    passwordHash: string
  ): Promise<AdminUserRecord>;
  incrementTokenVersion(id: string): Promise<void>;
}
