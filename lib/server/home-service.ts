import { cacheLife, cacheTag, revalidatePath, revalidateTag } from "next/cache";
import { homeRepository } from "@/lib/server/home-repository";
import type { HomeContent } from "@/types/home";

export const HOME_CONTENT_CACHE_TAG = "home-content";

export async function getHomeContent(): Promise<HomeContent> {
  "use cache";
  cacheTag(HOME_CONTENT_CACHE_TAG);
  cacheLife("hours");
  return homeRepository.getContent();
}

export async function getLiveHomeContent(): Promise<HomeContent> {
  return homeRepository.getContent();
}

export function revalidateHomeContent(): void {
  revalidateTag(HOME_CONTENT_CACHE_TAG, "max");
  revalidatePath("/");
}
