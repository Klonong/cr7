import { cacheLife, cacheTag, revalidatePath, revalidateTag } from "next/cache";
import { catalogRepository } from "@/lib/server/catalog-repository";
import type { Product } from "@/types/catalog";

export const CATALOG_CACHE_TAG = "catalog";

export async function getCatalogProducts(): Promise<Product[]> {
  "use cache";
  cacheTag(CATALOG_CACHE_TAG);
  cacheLife("hours");
  return catalogRepository.findAll();
}

export async function getCatalogProductBySlug(
  slug: string
): Promise<Product | null> {
  "use cache";
  cacheTag(CATALOG_CACHE_TAG);
  cacheLife("hours");
  return catalogRepository.findBySlug(slug);
}

export async function getLiveCatalogProducts(): Promise<Product[]> {
  return catalogRepository.findAll();
}

export function revalidateCatalog(slug?: string): void {
  revalidateTag(CATALOG_CACHE_TAG, "max");
  revalidatePath("/");
  revalidatePath("/products");
  if (slug) {
    revalidatePath(`/products/${slug}`);
  }
}
