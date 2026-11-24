import { apiFetch } from "@/lib/api/client";
import type { AuthLoginResponse, AuthLogoutResponse } from "@/types/api";

export async function loginAdmin(credentials: {
  username: string;
  password: string;
}): Promise<AuthLoginResponse> {
  return apiFetch<AuthLoginResponse>("/api/admin/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export async function logoutAdmin(): Promise<AuthLogoutResponse> {
  return apiFetch<AuthLogoutResponse>("/api/admin/logout", {
    method: "POST",
  });
}
