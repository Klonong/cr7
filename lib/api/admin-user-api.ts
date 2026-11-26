import { apiFetch } from "@/lib/api/client";
import type {
  AdminUserCreateInput,
  AdminUserMutationResponse,
  AdminUserPublic,
  AdminUsersListResponse,
  AdminUserUpdateInput,
  DeleteResponse,
} from "@/interface/api";

export async function fetchAdminUsers(): Promise<AdminUserPublic[]> {
  const data = await apiFetch<AdminUsersListResponse>("/api/admin/users");
  return data.users;
}

export async function createAdminUser(
  input: AdminUserCreateInput
): Promise<AdminUserPublic> {
  const data = await apiFetch<AdminUserMutationResponse>("/api/admin/users", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return data.user;
}

export async function updateAdminUser(
  id: string,
  input: AdminUserUpdateInput
): Promise<AdminUserPublic> {
  const data = await apiFetch<AdminUserMutationResponse>(
    `/api/admin/users/${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      body: JSON.stringify(input),
    }
  );
  return data.user;
}

export async function deleteAdminUser(id: string): Promise<string> {
  const data = await apiFetch<DeleteResponse>(
    `/api/admin/users/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
    }
  );
  return data.id;
}
