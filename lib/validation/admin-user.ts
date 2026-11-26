import type { ValidationResult } from "@/lib/validation/product";
import type {
  AdminRole,
  AdminUserCreateInput,
  AdminUserUpdateInput,
} from "@/interface/api";

const USERNAME_REGEX = /^[a-z0-9_.-]{3,32}$/;
const VALID_ROLES = new Set<AdminRole>(["ADMIN", "SUPER_ADMIN"]);

export function validateAdminUserCreate(
  raw: unknown
): ValidationResult<AdminUserCreateInput> {
  if (!raw || typeof raw !== "object") {
    return { ok: false, error: "Data akun admin tidak valid." };
  }

  const body = raw as Record<string, unknown>;
  const username =
    typeof body.username === "string" ? body.username.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const roleCandidate =
    typeof body.role === "string" ? body.role.trim().toUpperCase() : "ADMIN";

  if (!USERNAME_REGEX.test(username)) {
    return {
      ok: false,
      error:
        "Username harus 3–32 karakter (huruf kecil, angka, titik, strip, atau underscore).",
    };
  }
  if (password.length < 8 || password.length > 128) {
    return {
      ok: false,
      error: "Password minimal 8 karakter (maksimal 128 karakter).",
    };
  }
  if (!VALID_ROLES.has(roleCandidate as AdminRole)) {
    return { ok: false, error: "Role admin tidak valid." };
  }

  return {
    ok: true,
    data: {
      username,
      password,
      role: roleCandidate as AdminRole,
    },
  };
}

export function validateAdminUserUpdate(
  raw: unknown
): ValidationResult<AdminUserUpdateInput> {
  if (!raw || typeof raw !== "object") {
    return { ok: false, error: "Data pembaruan akun tidak valid." };
  }

  const body = raw as Record<string, unknown>;
  const result: AdminUserUpdateInput = {};

  if (typeof body.password === "string" && body.password.length > 0) {
    if (body.password.length < 8 || body.password.length > 128) {
      return {
        ok: false,
        error: "Password baru minimal 8 karakter (maksimal 128 karakter).",
      };
    }
    result.password = body.password;
  }

  if (typeof body.role === "string" && body.role.trim()) {
    const roleCandidate = body.role.trim().toUpperCase();
    if (!VALID_ROLES.has(roleCandidate as AdminRole)) {
      return { ok: false, error: "Role admin tidak valid." };
    }
    result.role = roleCandidate as AdminRole;
  }

  if (typeof body.isActive === "boolean") {
    result.isActive = body.isActive;
  }

  if (
    !result.password &&
    !result.role &&
    typeof result.isActive !== "boolean"
  ) {
    return { ok: false, error: "Tidak ada perubahan yang dikirim." };
  }

  return { ok: true, data: result };
}
