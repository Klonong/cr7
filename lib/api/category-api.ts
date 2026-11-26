import { apiFetch } from "@/lib/api/client";
import type {
  CategoriesListResponse,
  CategoryMutationResponse,
  DeleteResponse,
} from "@/types/api";
import type { Category, CategoryInput } from "@/types/catalog";

export async function fetchPublicCategories(): Promise<Category[]> {
  const data = await apiFetch<CategoriesListResponse>("/api/categories");
  return data.categories;
}

export async function fetchAdminCategories(): Promise<Category[]> {
  const data = await apiFetch<CategoriesListResponse>("/api/admin/categories");
  return data.categories;
}

export async function createCatalogCategory(
  input: CategoryInput
): Promise<Category> {
  const data = await apiFetch<CategoryMutationResponse>(
    "/api/admin/categories",
    {
      method: "POST",
      body: JSON.stringify(input),
    }
  );
  return data.category;
}

export async function updateCatalogCategory(
  slug: string,
  input: CategoryInput
): Promise<Category> {
  const data = await apiFetch<CategoryMutationResponse>(
    `/api/admin/categories/${encodeURIComponent(slug)}`,
    {
      method: "PUT",
      body: JSON.stringify(input),
    }
  );
  return data.category;
}

export async function deleteCatalogCategory(slug: string): Promise<string> {
  const data = await apiFetch<DeleteResponse>(
    `/api/admin/categories/${encodeURIComponent(slug)}`,
    {
      method: "DELETE",
    }
  );
  return data.id;
}
