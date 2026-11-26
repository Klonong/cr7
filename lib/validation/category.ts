import { slugify } from "@/lib/format";
import type { ValidationResult } from "@/lib/validation/product";
import type { CategoryInput } from "@/interface/catalog";

export function validateCategoryInput(
  raw: unknown
): ValidationResult<CategoryInput> {
  if (!raw || typeof raw !== "object") {
    return { ok: false, error: "Data kategori tidak valid." };
  }

  const body = raw as Record<string, unknown>;
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const shortName =
    typeof body.shortName === "string" ? body.shortName.trim() : "";
  const rawSlug = typeof body.slug === "string" ? body.slug.trim() : "";
  const description =
    typeof body.description === "string" ? body.description.trim() : "";

  if (!name || name.length < 3 || name.length > 80) {
    return {
      ok: false,
      error: "Nama kategori harus 3–80 karakter.",
    };
  }
  if (!shortName || shortName.length < 2 || shortName.length > 24) {
    return {
      ok: false,
      error: "Label singkat harus 2–24 karakter.",
    };
  }

  const normalizedSlug = slugify(rawSlug || name).slice(0, 60);
  if (!normalizedSlug || normalizedSlug.length < 2) {
    return {
      ok: false,
      error: "Slug kategori harus berisi huruf atau angka.",
    };
  }

  if (!description || description.length < 8 || description.length > 200) {
    return {
      ok: false,
      error: "Deskripsi kategori harus 8–200 karakter.",
    };
  }

  return {
    ok: true,
    data: {
      name,
      shortName,
      slug: normalizedSlug,
      description,
    },
  };
}
