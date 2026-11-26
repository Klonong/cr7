import { apiFetch } from "@/lib/api/client";
import type {
  DeleteResponse,
  ProductMutationResponse,
  ProductsListResponse,
} from "@/interface/api";
import type { Product, ProductInput } from "@/interface/catalog";

export async function fetchPublicProducts(): Promise<Product[]> {
  const data = await apiFetch<ProductsListResponse>("/api/products");
  return data.products;
}

export async function fetchAdminProducts(): Promise<Product[]> {
  const data = await apiFetch<ProductsListResponse>("/api/admin/products");
  return data.products;
}

export async function createCatalogProduct(
  input: ProductInput
): Promise<Product> {
  const data = await apiFetch<ProductMutationResponse>("/api/admin/products", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return data.product;
}

export async function updateCatalogProduct(
  id: string,
  input: ProductInput
): Promise<Product> {
  const data = await apiFetch<ProductMutationResponse>(
    `/api/admin/products/${encodeURIComponent(id)}`,
    {
      method: "PUT",
      body: JSON.stringify(input),
    }
  );
  return data.product;
}

export async function setCatalogProductStock(
  id: string,
  inStock: boolean
): Promise<Product> {
  const data = await apiFetch<ProductMutationResponse>(
    `/api/admin/products/${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      body: JSON.stringify({ inStock }),
    }
  );
  return data.product;
}

export async function deleteCatalogProduct(id: string): Promise<string> {
  const data = await apiFetch<DeleteResponse>(
    `/api/admin/products/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
    }
  );
  return data.id;
}
