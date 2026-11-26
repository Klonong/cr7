import { cacheLife, cacheTag, revalidatePath, revalidateTag } from "next/cache";
import { motorcycleRepository } from "@/lib/server/motorcycle-repository";
import type { Motorcycle } from "@/types/catalog";

export const MOTORCYCLES_CACHE_TAG = "motorcycles";

export async function getCatalogMotorcycles(): Promise<Motorcycle[]> {
  "use cache";
  cacheTag(MOTORCYCLES_CACHE_TAG);
  cacheLife("hours");
  return motorcycleRepository.findAll();
}

export async function getLiveCatalogMotorcycles(): Promise<Motorcycle[]> {
  return motorcycleRepository.findAll();
}

export function revalidateMotorcycles(): void {
  revalidateTag(MOTORCYCLES_CACHE_TAG, "max");
  revalidatePath("/");
  revalidatePath("/products");
}
