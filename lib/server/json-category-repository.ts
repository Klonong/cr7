import fs from "fs/promises";
import path from "path";
import { CATEGORIES as DEFAULT_CATEGORIES } from "@/data/categories";
import { slugify } from "@/lib/format";
import type { CategoryRepository } from "@/lib/server/category-repository";
import type { Category, CategoryInput } from "@/types/catalog";

const CATEGORY_STORE_FILE = path.join(
  process.cwd(),
  "data",
  "categories-store.json"
);

async function ensureCategoryFile(): Promise<void> {
  try {
    await fs.access(CATEGORY_STORE_FILE);
  } catch {
    await fs.mkdir(path.dirname(CATEGORY_STORE_FILE), { recursive: true });
    await fs.writeFile(
      CATEGORY_STORE_FILE,
      JSON.stringify(DEFAULT_CATEGORIES, null, 2),
      "utf8"
    );
  }
}

async function readCategoriesStore(): Promise<Category[]> {
  await ensureCategoryFile();
  const raw = await fs.readFile(CATEGORY_STORE_FILE, "utf8");
  const parsed = JSON.parse(raw) as Category[];
  return Array.isArray(parsed) && parsed.length > 0
    ? parsed
    : DEFAULT_CATEGORIES;
}

async function writeCategoriesStore(categories: Category[]): Promise<void> {
  await fs.mkdir(path.dirname(CATEGORY_STORE_FILE), { recursive: true });
  await fs.writeFile(
    CATEGORY_STORE_FILE,
    JSON.stringify(categories, null, 2),
    "utf8"
  );
}

export const jsonCategoryRepository: CategoryRepository = {
  async findAll() {
    return readCategoriesStore();
  },

  async findBySlug(slug: string) {
    const categories = await readCategoriesStore();
    return categories.find((c) => c.slug === slug) ?? null;
  },

  async create(input: CategoryInput) {
    const categories = await readCategoriesStore();
    const baseSlug = slugify(input.slug || input.name);
    if (!baseSlug) {
      throw new Error("Slug kategori wajib diisi.");
    }
    if (categories.some((c) => c.slug === baseSlug)) {
      throw new Error(`Slug kategori "${baseSlug}" sudah terdaftar.`);
    }

    const created: Category = {
      slug: baseSlug,
      name: input.name,
      shortName: input.shortName,
      description: input.description,
    };

    await writeCategoriesStore([...categories, created]);
    return created;
  },

  async update(slug: string, input: CategoryInput) {
    const categories = await readCategoriesStore();
    const idx = categories.findIndex((c) => c.slug === slug);
    if (idx === -1) return null;

    const updated: Category = {
      slug,
      name: input.name,
      shortName: input.shortName,
      description: input.description,
    };

    const next = [...categories];
    next[idx] = updated;
    await writeCategoriesStore(next);
    return updated;
  },

  async delete(slug: string) {
    const categories = await readCategoriesStore();
    const next = categories.filter((c) => c.slug !== slug);
    if (next.length === categories.length) return false;
    await writeCategoriesStore(next);
    return true;
  },
};
