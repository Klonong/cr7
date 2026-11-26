import fs from "fs/promises";
import path from "path";
import { DEFAULT_MOTORCYCLES } from "@/data/categories";
import { slugify } from "@/lib/format";
import type { MotorcycleRepository } from "@/lib/server/motorcycle-repository";
import type { Motorcycle, MotorcycleInput } from "@/types/catalog";

const MOTO_STORE_FILE = path.join(
  process.cwd(),
  "data",
  "motorcycles-store.json"
);

async function ensureMotoFile(): Promise<void> {
  try {
    await fs.access(MOTO_STORE_FILE);
  } catch {
    await fs.mkdir(path.dirname(MOTO_STORE_FILE), { recursive: true });
    await fs.writeFile(
      MOTO_STORE_FILE,
      JSON.stringify(DEFAULT_MOTORCYCLES, null, 2),
      "utf8"
    );
  }
}

async function readMotorcycles(): Promise<Motorcycle[]> {
  await ensureMotoFile();
  const raw = await fs.readFile(MOTO_STORE_FILE, "utf8");
  const parsed = JSON.parse(raw) as Motorcycle[];
  return Array.isArray(parsed) && parsed.length > 0
    ? parsed
    : DEFAULT_MOTORCYCLES;
}

async function writeMotorcycles(items: Motorcycle[]): Promise<void> {
  await fs.mkdir(path.dirname(MOTO_STORE_FILE), { recursive: true });
  await fs.writeFile(MOTO_STORE_FILE, JSON.stringify(items, null, 2), "utf8");
}

export const jsonMotorcycleRepository: MotorcycleRepository = {
  async findAll() {
    return readMotorcycles();
  },

  async create(input: MotorcycleInput) {
    const items = await readMotorcycles();
    const displayName =
      input.name?.trim() || `${input.brand.trim()} ${input.model.trim()}`;

    if (
      items.some((m) => m.name.toLowerCase() === displayName.toLowerCase())
    ) {
      throw new Error(`Motor "${displayName}" sudah terdaftar.`);
    }

    const created: Motorcycle = {
      id: `moto-${slugify(displayName) || Date.now().toString(36)}`,
      brand: input.brand.trim(),
      model: input.model.trim(),
      name: displayName,
      type: input.type,
    };

    await writeMotorcycles([...items, created]);
    return created;
  },

  async delete(id: string) {
    const items = await readMotorcycles();
    const next = items.filter((m) => m.id !== id);
    if (next.length === items.length) return false;
    await writeMotorcycles(next);
    return true;
  },
};
