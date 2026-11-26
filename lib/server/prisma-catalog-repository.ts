import { Prisma } from "@prisma/client";
import { slugify } from "@/lib/format";
import {
  isDatabaseUnavailableError,
  isPrismaConfigured,
  prisma,
} from "@/lib/server/prisma";
import type {
  CurrencyCode,
  Product,
  ProductBadge,
  ProductImage,
  ProductInput,
  ProductVariant,
} from "@/interface/catalog";
import type { CatalogRepository } from "@/interface/repository";

type PrismaProductWithVariants = Prisma.ProductGetPayload<{
  include: { variants: true };
}>;

function mapProduct(row: PrismaProductWithVariants): Product {
  const images = Array.isArray(row.images)
    ? (row.images as unknown as ProductImage[])
    : [];
  const fullSpecs =
    row.fullSpecs &&
    typeof row.fullSpecs === "object" &&
    !Array.isArray(row.fullSpecs)
      ? (row.fullSpecs as Record<string, string>)
      : {};

  const variants: ProductVariant[] = [...row.variants]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((v) => ({
      id: v.id,
      name: v.name,
      ...(v.sku ? { sku: v.sku } : {}),
      ...(v.price !== null ? { price: v.price } : {}),
      inStock: v.inStock,
      ...(v.colorHex ? { colorHex: v.colorHex } : {}),
      ...(v.shopeeUrl ? { shopeeUrl: v.shopeeUrl } : {}),
      ...(v.tiktokShopUrl ? { tiktokShopUrl: v.tiktokShopUrl } : {}),
    }));

  return {
    id: row.id,
    slug: row.slug,
    sku: row.sku,
    name: row.name,
    category: row.categorySlug,
    price: row.price,
    ...(row.originalPrice !== null ? { originalPrice: row.originalPrice } : {}),
    currency: (row.currency === "USD" ? "USD" : "IDR") as CurrencyCode,
    images,
    variants,
    shortSpecs: row.shortSpecs,
    fullSpecs,
    inTheBox: row.inTheBox,
    fitmentNotes: row.fitmentNotes,
    compatibility: row.compatibility,
    badges: row.badges as ProductBadge[],
    featured: row.featured,
    inStock: row.inStock,
    links: {
      ...(row.shopeeUrl ? { shopee: row.shopeeUrl } : {}),
      ...(row.tiktokShopUrl ? { tiktokShop: row.tiktokShopUrl } : {}),
    },
    description: row.description,
  };
}

async function resolveUniqueSlug(
  baseSlug: string,
  excludeId?: string
): Promise<string> {
  const cleanBase = slugify(baseSlug) || `produk-${Date.now()}`;
  let candidate = cleanBase;
  let counter = 2;

  while (true) {
    const existing = await prisma.product.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });
    if (!existing || existing.id === excludeId) {
      return candidate;
    }
    candidate = `${cleanBase}-${counter}`;
    counter += 1;
  }
}

function buildVariantCreates(variants: ProductVariant[]) {
  return variants.map((v, idx) => ({
    name: v.name.trim(),
    sku: v.sku?.trim() || null,
    price: v.price ?? null,
    inStock: v.inStock,
    colorHex: v.colorHex?.trim() || null,
    shopeeUrl: v.shopeeUrl?.trim() || null,
    tiktokShopUrl: v.tiktokShopUrl?.trim() || null,
    sortOrder: idx,
  }));
}

export const prismaCatalogRepository: CatalogRepository = {
  async findAll(): Promise<Product[]> {
    if (!isPrismaConfigured()) return [];
    try {
      const rows = await prisma.product.findMany({
        include: { variants: { orderBy: { sortOrder: "asc" } } },
        orderBy: [{ createdAt: "desc" }],
      });
      return rows.map(mapProduct);
    } catch (err) {
      if (isDatabaseUnavailableError(err)) {
        return [];
      }
      throw err;
    }
  },

  async findById(id: string): Promise<Product | null> {
    if (!isPrismaConfigured()) return null;
    try {
      const row = await prisma.product.findUnique({
        where: { id },
        include: { variants: { orderBy: { sortOrder: "asc" } } },
      });
      return row ? mapProduct(row) : null;
    } catch (err) {
      if (isDatabaseUnavailableError(err)) {
        return null;
      }
      throw err;
    }
  },

  async findBySlug(slug: string): Promise<Product | null> {
    if (!isPrismaConfigured()) return null;
    try {
      const row = await prisma.product.findUnique({
        where: { slug },
        include: { variants: { orderBy: { sortOrder: "asc" } } },
      });
      return row ? mapProduct(row) : null;
    } catch (err) {
      if (isDatabaseUnavailableError(err)) {
        return null;
      }
      throw err;
    }
  },

  async create(input: ProductInput): Promise<Product> {
    const slug = await resolveUniqueSlug(input.slug || input.name);

    try {
      const created = await prisma.product.create({
        data: {
          slug,
          sku: input.sku.trim().toUpperCase(),
          name: input.name.trim(),
          categorySlug: input.category,
          price: Math.round(input.price),
          originalPrice:
            input.originalPrice && input.originalPrice > input.price
              ? Math.round(input.originalPrice)
              : null,
          currency: input.currency ?? "IDR",
          images: input.images as unknown as Prisma.InputJsonValue,
          shortSpecs: input.shortSpecs,
          fullSpecs: input.fullSpecs as unknown as Prisma.InputJsonValue,
          inTheBox: input.inTheBox,
          fitmentNotes: input.fitmentNotes,
          compatibility: input.compatibility,
          badges: input.badges ?? [],
          featured: Boolean(input.featured),
          inStock: input.inStock,
          shopeeUrl: input.links.shopee ?? null,
          tiktokShopUrl: input.links.tiktokShop ?? null,
          description: input.description,
          variants: {
            create: buildVariantCreates(input.variants ?? []),
          },
        },
        include: { variants: { orderBy: { sortOrder: "asc" } } },
      });

      return mapProduct(created);
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
          throw new Error("Kode SKU atau URL slug produk sudah terdaftar.");
        }
        if (err.code === "P2003") {
          throw new Error("Kategori produk yang dipilih tidak ditemukan.");
        }
      }
      throw err;
    }
  },

  async update(id: string, input: ProductInput): Promise<Product | null> {
    const existing = await prisma.product.findUnique({
      where: { id },
      select: { id: true, slug: true },
    });
    if (!existing) return null;

    const slug = await resolveUniqueSlug(
      input.slug || existing.slug || input.name,
      id
    );

    try {
      const updated = await prisma.$transaction(async (tx) => {
        const existingVariants = await tx.productVariant.findMany({
          where: { productId: id },
          select: { id: true },
        });
        const existingIds = new Set(existingVariants.map((v) => v.id));
        const incomingVariants = input.variants ?? [];
        const keptIds = new Set<string>();

        for (let idx = 0; idx < incomingVariants.length; idx++) {
          const v = incomingVariants[idx];
          const data = {
            name: v.name.trim(),
            sku: v.sku?.trim() || null,
            price: v.price ?? null,
            inStock: v.inStock,
            colorHex: v.colorHex?.trim() || null,
            shopeeUrl: v.shopeeUrl?.trim() || null,
            tiktokShopUrl: v.tiktokShopUrl?.trim() || null,
            sortOrder: idx,
          };

          if (v.id && existingIds.has(v.id)) {
            keptIds.add(v.id);
            await tx.productVariant.update({
              where: { id: v.id },
              data,
            });
          } else {
            await tx.productVariant.create({
              data: {
                productId: id,
                ...data,
              },
            });
          }
        }

        const removedIds = [...existingIds].filter((eid) => !keptIds.has(eid));
        if (removedIds.length > 0) {
          await tx.productVariant.deleteMany({
            where: { productId: id, id: { in: removedIds } },
          });
        }

        return tx.product.update({
          where: { id },
          data: {
            slug,
            sku: input.sku.trim().toUpperCase(),
            name: input.name.trim(),
            categorySlug: input.category,
            price: Math.round(input.price),
            originalPrice:
              input.originalPrice && input.originalPrice > input.price
                ? Math.round(input.originalPrice)
                : null,
            currency: input.currency ?? "IDR",
            images: input.images as unknown as Prisma.InputJsonValue,
            shortSpecs: input.shortSpecs,
            fullSpecs: input.fullSpecs as unknown as Prisma.InputJsonValue,
            inTheBox: input.inTheBox,
            fitmentNotes: input.fitmentNotes,
            compatibility: input.compatibility,
            badges: input.badges ?? [],
            featured: Boolean(input.featured),
            inStock: input.inStock,
            shopeeUrl: input.links.shopee ?? null,
            tiktokShopUrl: input.links.tiktokShop ?? null,
            description: input.description,
          },
          include: { variants: { orderBy: { sortOrder: "asc" } } },
        });
      });

      return mapProduct(updated);
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
          throw new Error("Kode SKU atau URL slug sudah digunakan produk lain.");
        }
        if (err.code === "P2003") {
          throw new Error("Kategori produk yang dipilih tidak ditemukan.");
        }
      }
      throw err;
    }
  },

  async updateStock(id: string, inStock: boolean): Promise<Product | null> {
    try {
      const updated = await prisma.product.update({
        where: { id },
        data: { inStock },
        include: { variants: { orderBy: { sortOrder: "asc" } } },
      });
      return mapProduct(updated);
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

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.product.delete({ where: { id } });
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
