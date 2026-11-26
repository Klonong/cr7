import { ApiClientError } from "@/lib/api/client";
import type { ApiErrorResponse, UploadImageResponse } from "@/types/api";

export async function uploadAdminImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

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

  return (payload as UploadImageResponse).url;
}
