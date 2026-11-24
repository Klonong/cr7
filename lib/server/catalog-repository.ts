import { jsonCatalogRepository } from "@/lib/server/json-catalog-repository";
import type { Product, ProductInput } from "@/types/catalog";

/**
 * Backend-agnostic data access contract for the motorcycle accessories catalog.
 *
 * To connect a real database (PostgreSQL / Prisma / Drizzle / Supabase) or an
 * external backend service, implement this interface and swap the export below.
 * No pages, API routes, or React components need to change.
 */
export interface CatalogRepository {
  findAll(): Promise<Product[]>;
  findBySlug(slug: string): Promise<Product | null>;
  create(input: ProductInput): Promise<Product>;
  update(id: string, input: ProductInput): Promise<Product | null>;
  updateStock(id: string, inStock: boolean): Promise<Product | null>;
  delete(id: string): Promise<boolean>;
}

export const catalogRepository: CatalogRepository = jsonCatalogRepository;
