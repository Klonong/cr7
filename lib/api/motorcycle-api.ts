import { apiFetch } from "@/lib/api/client";
import type {
  DeleteResponse,
  MotorcycleMutationResponse,
  MotorcyclesListResponse,
} from "@/interface/api";
import type { Motorcycle, MotorcycleInput } from "@/interface/catalog";

export async function fetchPublicMotorcycles(): Promise<Motorcycle[]> {
  const data = await apiFetch<MotorcyclesListResponse>("/api/motorcycles");
  return data.motorcycles;
}

export async function createCatalogMotorcycle(
  input: MotorcycleInput
): Promise<Motorcycle> {
  const data = await apiFetch<MotorcycleMutationResponse>(
    "/api/admin/motorcycles",
    {
      method: "POST",
      body: JSON.stringify(input),
    }
  );
  return data.motorcycle;
}

export async function deleteCatalogMotorcycle(id: string): Promise<string> {
  const data = await apiFetch<DeleteResponse>(
    `/api/admin/motorcycles/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
    }
  );
  return data.id;
}
