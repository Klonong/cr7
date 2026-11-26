import { ApiClientError } from "@/lib/api/client";
import type { ApiErrorResponse, UploadImageResponse } from "@/interface/api";

export async function uploadAdminImage(
  file: File,
  folder: "products" | "home" | "general" = "products"
): Promise<string> {
  const result = await uploadAdminImageWithMeta(file, folder);
  return result.url;
}

export async function uploadAdminImageWithMeta(
  file: File,
  folder: "products" | "home" | "general" = "products"
): Promise<UploadImageResponse> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const response = await fetch("/api/admin/upload", {
    method: "POST",
    body: formData,
  });

  let payload: unknown = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const message =
      payload &&
      typeof payload === "object" &&
      "error" in payload &&
      typeof (payload as ApiErrorResponse).error === "string"
        ? (payload as ApiErrorResponse).error
        : "Gagal mengunggah gambar.";
    throw new ApiClientError(message, response.status);
  }

  return payload as UploadImageResponse;
}
