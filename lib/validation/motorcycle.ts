import { MOTORCYCLE_TYPES } from "@/config/store";
import type { ValidationResult } from "@/lib/validation/product";
import type { MotorcycleInput, MotorcycleType } from "@/interface/catalog";

const VALID_TYPES = new Set<string>(MOTORCYCLE_TYPES);

export function validateMotorcycleInput(
  raw: unknown
): ValidationResult<MotorcycleInput> {
  if (!raw || typeof raw !== "object") {
    return { ok: false, error: "Data motor tidak valid." };
  }

  const body = raw as Record<string, unknown>;
  const brand = typeof body.brand === "string" ? body.brand.trim() : "";
  const model = typeof body.model === "string" ? body.model.trim() : "";
  const customName = typeof body.name === "string" ? body.name.trim() : "";
  const type = typeof body.type === "string" ? body.type.trim() : "";

  if (!brand || brand.length < 2 || brand.length > 40) {
    return {
      ok: false,
      error: "Merek motor harus 2–40 karakter (mis. Yamaha, Honda).",
    };
  }
  if (!model || model.length < 2 || model.length > 60) {
    return {
      ok: false,
      error: "Nama tipe/model motor harus 2–60 karakter (mis. NMAX 155).",
    };
  }
  if (customName.length > 80) {
    return {
      ok: false,
      error: "Label tampil motor maksimal 80 karakter.",
    };
  }
  if (!VALID_TYPES.has(type)) {
    return { ok: false, error: "Pilih jenis motor yang valid." };
  }

  const displayName =
    customName ||
    (brand.toLowerCase() === "universal" ? "Universal" : `${brand} ${model}`);

  return {
    ok: true,
    data: {
      brand,
      model,
      name: displayName,
      type: type as MotorcycleType,
    },
  };
}
