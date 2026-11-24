import fs from "fs/promises";
import path from "path";
import { PRODUCTS as DEFAULT_PRODUCTS } from "@/data/products";
import { slugify } from "@/lib/format";
import type { CatalogRepository } from "@/lib/server/catalog-repository";
import type { Product, ProductInput } from "@/types/catalog";

const STORE_FILE = path.join(process.cwd(), "data", "catalog-store.json");

async function ensureStoreFile(): Promise<void> {
  try {
    await fs.access(STORE_FILE);
  } catch {
    await fs.mkdir(path.dirname(STORE_FILE), { recursive: true });
    await fs.writeFile(
      STORE_FILE,
      JSON.stringify(DEFAULT_PRODUCTS, null, 2),
      "utf8"
    );
  }
}

async function readStore(): Promise<Product[]> {
  await ensureStoreFile();
  const raw = await fs.readFile(STORE_FILE, "utf8");
  const parsed = JSON.parse(raw) as Product[];
  return Array.isArray(parsed) ? parsed : DEFAULT_PRODUCTS;
}

async function writeStore(products: Product[]): Promise<void> {
  await fs.mkdir(path.dirname(STORE_FILE), { recursive: true });
  await fs.writeFile(STORE_FILE, JSON.stringify(products, null, 2), "utf8");
}

function generateUniqueSlug(
  base: string,
  existing: readonly Product[],
  ignoreId?: string
): string {
  let candidate = base;
  let suffix = 2;
  while (existing.some((p) => p.slug === candidate && p.id !== ignoreId)) {
    candidate = `${base}-${suffix++}`;
  }
  return candidate;
}

export const jsonCatalogRepository: CatalogRepository = {
  async findAll() {
    return readStore();
  },

  async findBySlug(slug: string) {
    const products = await readStore();
    return products.find((p) => p.slug === slug) ?? null;
  },

  async create(input: ProductInput) {
    const products = await readStore();
    const baseSlug =
      input.slug || slugify(input.name) || `product-${Date.now()}`;
    const uniqueSlug = generateUniqueSlug(baseSlug, products);

    const newProduct: Product = {
      id: `prod-${Date.now().toString(36)}`,
      ...input,
      slug: uniqueSlug,
      currency: input.currency ?? "IDR",
    };

    await writeStore([newProduct, ...products]);
    return newProduct;
  },

  async update(id: string, input: ProductInput) {
    const products = await readStore();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const baseSlug = input.slug || slugify(input.name) || products[index].slug;
    const uniqueSlug = generateUniqueSlug(baseSlug, products, id);

    const updated: Product = {
      id,
      ...input,
      slug: uniqueSlug,
      currency: input.currency ?? products[index].currency ?? "IDR",
    };

    const next = [...products];
    next[index] = updated;
    await writeStore(next);
    return updated;
  },

  async updateStock(id: string, inStock: boolean) {
    const products = await readStore();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const updated: Product = { ...products[index], inStock };
    const next = [...products];
    next[index] = updated;
    await writeStore(next);
    return updated;
  },

  async delete(id: string) {
    const products = await readStore();
    const next = products.filter((p) => p.id !== id);
    if (next.length === products.length) return false;
    await writeStore(next);
    return true;
  },
};
