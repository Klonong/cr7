import { prismaMotorcycleRepository } from "@/lib/server/prisma-motorcycle-repository";
import type { MotorcycleRepository } from "@/interface/repository";

export type { MotorcycleRepository };

export const motorcycleRepository: MotorcycleRepository =
  prismaMotorcycleRepository;
