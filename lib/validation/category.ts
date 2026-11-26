import { slugify } from "@/lib/format";
import type { ValidationResult } from "@/lib/validation/product";
import type { CategoryInput } from "@/types/catalog";

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

  if (!name || name.length < 3) {
    return {
      ok: false,
      error: "Nama kategori minimal 3 karakter.",
    };
  }
  if (!shortName || shortName.length < 2) {
    return {
      ok: false,
      error: "Label singkat minimal 2 karakter.",
    };
  }

  const normalizedSlug = slugify(rawSlug || name);
  if (!normalizedSlug || normalizedSlug.length < 2) {
    return {
      ok: false,
      error: "Slug kategori harus berisi huruf atau angka.",
    };
  }

  if (!description || description.length < 8) {
    return {
      ok: false,
      error: "Deskripsi kategori minimal 8 karakter.",
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
