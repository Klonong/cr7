import { jsonMotorcycleRepository } from "@/lib/server/json-motorcycle-repository";
import type { Motorcycle, MotorcycleInput } from "@/types/catalog";

/**
 * Backend-agnostic data access contract for compatible Motorcycle Models.
 * Swap jsonMotorcycleRepository with your DB repository when implementing backend logic.
 */
export interface MotorcycleRepository {
  findAll(): Promise<Motorcycle[]>;
  create(input: MotorcycleInput): Promise<Motorcycle>;
  delete(id: string): Promise<boolean>;
}

export const motorcycleRepository: MotorcycleRepository =
  jsonMotorcycleRepository;
