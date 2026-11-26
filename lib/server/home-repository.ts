import { prismaHomeRepository } from "@/lib/server/prisma-home-repository";
import type { HomeRepository } from "@/interface/repository";

export type { HomeRepository };

export const homeRepository: HomeRepository = prismaHomeRepository;
