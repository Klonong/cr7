import { cacheLife, cacheTag, revalidatePath, revalidateTag } from "next/cache";
import { categoryRepository } from "@/lib/server/category-repository";
import type { Category } from "@/types/catalog";

export const CATEGORIES_CACHE_TAG = "categories";

export async function getCatalogCategories(): Promise<Category[]> {
  "use cache";
  cacheTag(CATEGORIES_CACHE_TAG);
  cacheLife("hours");
  return categoryRepository.findAll();
}

export async function getLiveCatalogCategories(): Promise<Category[]> {
  return categoryRepository.findAll();
}

export function revalidateCategories(): void {
  revalidateTag(CATEGORIES_CACHE_TAG, "max");
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/products/[slug]", "page");
}
