import { Prisma } from "@prisma/client";
import {
  isDatabaseUnavailableError,
  isPrismaConfigured,
  prisma,
} from "@/lib/server/prisma";
import type {
  Motorcycle,
  MotorcycleInput,
  MotorcycleType,
} from "@/interface/catalog";
import type { MotorcycleRepository } from "@/interface/repository";

function mapMotorcycle(row: {
  id: string;
  brand: string;
  model: string;
  name: string;
  type: string;
}): Motorcycle {
  return {
    id: row.id,
    brand: row.brand,
    model: row.model,
    name: row.name,
    type: row.type as MotorcycleType,
  };
}

export const prismaMotorcycleRepository: MotorcycleRepository = {
  async findAll(): Promise<Motorcycle[]> {
    if (!isPrismaConfigured()) return [];
    try {
      const rows = await prisma.motorcycle.findMany({
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      });
      return rows.map(mapMotorcycle);
    } catch (err) {
      if (isDatabaseUnavailableError(err)) {
        return [];
      }
      throw err;
    }
  },

  async create(input: MotorcycleInput): Promise<Motorcycle> {
    const brand = input.brand.trim();
    const model = input.model.trim();
    const name =
      input.name?.trim() ||
      (brand.toLowerCase() === "universal" ? "Universal" : `${brand} ${model}`);

    const duplicate = await prisma.motorcycle.findFirst({
      where: { name: { equals: name, mode: "insensitive" } },
      select: { id: true },
    });
    if (duplicate) {
      throw new Error(`Motor "${name}" sudah terdaftar di sistem.`);
    }

    const total = await prisma.motorcycle.count();

    try {
      const created = await prisma.motorcycle.create({
        data: {
          brand,
          model,
          name,
          type: input.type,
          sortOrder: total,
        },
      });
      return mapMotorcycle(created);
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002"
      ) {
        throw new Error(`Motor "${name}" sudah terdaftar di sistem.`);
      }
      throw err;
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.motorcycle.delete({ where: { id } });
      return true;
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2025"
      ) {
        return false;
      }
      throw err;
    }
  },
};
