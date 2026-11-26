import { apiFetch } from "@/lib/api/client";
import type {
  AdminSession,
  AuthLoginResponse,
  AuthLogoutResponse,
} from "@/interface/api";

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

export async function fetchCurrentAdminSession(): Promise<{
  authenticated: boolean;
  session: AdminSession;
}> {
  return apiFetch<{ authenticated: boolean; session: AdminSession }>(
    "/api/admin/me"
  );
}
