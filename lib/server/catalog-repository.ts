import { prismaCatalogRepository } from "@/lib/server/prisma-catalog-repository";
import type { CatalogRepository } from "@/interface/repository";

export type { CatalogRepository };

export const catalogRepository: CatalogRepository = prismaCatalogRepository;
