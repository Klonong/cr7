import { jsonCategoryRepository } from "@/lib/server/json-category-repository";
import type { Category, CategoryInput } from "@/types/catalog";

/**
 * Backend-agnostic data access contract for Motorcycle Accessory Categories.
 * Swap jsonCategoryRepository with your DB repository when implementing backend logic.
 */
export interface CategoryRepository {
  findAll(): Promise<Category[]>;
  findBySlug(slug: string): Promise<Category | null>;
  create(input: CategoryInput): Promise<Category>;
  update(slug: string, input: CategoryInput): Promise<Category | null>;
  delete(slug: string): Promise<boolean>;
}

export const categoryRepository: CategoryRepository = jsonCategoryRepository;
