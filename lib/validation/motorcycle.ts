import { MOTORCYCLE_TYPES } from "@/config/store";
import type { ValidationResult } from "@/lib/validation/product";
import type { MotorcycleInput, MotorcycleType } from "@/types/catalog";

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

  if (!brand || brand.length < 2) {
    return { ok: false, error: "Merek motor minimal 2 karakter (mis. Yamaha, Honda)." };
  }
  if (!model || model.length < 2) {
    return { ok: false, error: "Nama tipe/model motor minimal 2 karakter (mis. NMAX 155)." };
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
