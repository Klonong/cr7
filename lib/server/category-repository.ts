import { prismaCategoryRepository } from "@/lib/server/prisma-category-repository";
import type { CategoryRepository } from "@/interface/repository";

export type { CategoryRepository };

export const categoryRepository: CategoryRepository = prismaCategoryRepository;
