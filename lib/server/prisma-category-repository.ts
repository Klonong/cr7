import { Prisma } from "@prisma/client";
import { slugify } from "@/lib/format";
import {
  isDatabaseUnavailableError,
  isPrismaConfigured,
  prisma,
} from "@/lib/server/prisma";
import type { Category, CategoryInput } from "@/interface/catalog";
import type { CategoryRepository } from "@/interface/repository";

function mapCategory(row: {
  slug: string;
  name: string;
  shortName: string;
  description: string;
}): Category {
  return {
    slug: row.slug,
    name: row.name,
    shortName: row.shortName,
    description: row.description,
  };
}

export const prismaCategoryRepository: CategoryRepository = {
  async findAll(): Promise<Category[]> {
    if (!isPrismaConfigured()) return [];
    try {
      const rows = await prisma.category.findMany({
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      });
      return rows.map(mapCategory);
    } catch (err) {
      if (isDatabaseUnavailableError(err)) {
        return [];
      }
      throw err;
    }
  },

  async findBySlug(slug: string): Promise<Category | null> {
    if (!isPrismaConfigured()) return null;
    try {
      const row = await prisma.category.findUnique({ where: { slug } });
      return row ? mapCategory(row) : null;
    } catch (err) {
      if (isDatabaseUnavailableError(err)) {
        return null;
      }
      throw err;
    }
  },

  async countProducts(slug: string): Promise<number> {
    return prisma.product.count({ where: { categorySlug: slug } });
  },

  async create(input: CategoryInput): Promise<Category> {
    const slug = slugify(input.slug || input.name);
    if (!slug) {
      throw new Error("Slug kategori tidak valid.");
    }

    const total = await prisma.category.count();

    try {
      const created = await prisma.category.create({
        data: {
          slug,
          name: input.name.trim(),
          shortName: input.shortName.trim(),
          description: input.description.trim(),
          sortOrder: total,
        },
      });
      return mapCategory(created);
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002"
      ) {
        throw new Error(`Kategori dengan slug "${slug}" sudah terdaftar.`);
      }
      throw err;
    }
  },

  async update(slug: string, input: CategoryInput): Promise<Category | null> {
    try {
      const updated = await prisma.category.update({
        where: { slug },
        data: {
          name: input.name.trim(),
          shortName: input.shortName.trim(),
          description: input.description.trim(),
        },
      });
      return mapCategory(updated);
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2025"
      ) {
        return null;
      }
      throw err;
    }
  },

  async delete(slug: string): Promise<boolean> {
    try {
      await prisma.category.delete({ where: { slug } });
      return true;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2025") return false;
        if (err.code === "P2003") {
          throw new Error(
            "Kategori ini masih digunakan oleh produk aktif. Pindahkan produk terlebih dahulu."
          );
        }
      }
      throw err;
    }
  },
};
