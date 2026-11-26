import { apiFetch } from "@/lib/api/client";
import type {
  DeleteResponse,
  HighlightMutationResponse,
  HomeContentResponse,
} from "@/interface/api";
import type {
  HomeContent,
  HomeHighlight,
  HomeHighlightInput,
  HomeSettingsInput,
} from "@/interface/home";

export async function fetchAdminHomeContent(): Promise<HomeContent> {
  const data = await apiFetch<HomeContentResponse>("/api/admin/home");
  return data.content;
}

export async function saveHomeSettings(
  input: HomeSettingsInput
): Promise<HomeContent> {
  const data = await apiFetch<HomeContentResponse>("/api/admin/home", {
    method: "PUT",
    body: JSON.stringify(input),
  });
  return data.content;
}

export async function createHomeHighlight(
  input: HomeHighlightInput
): Promise<HomeHighlight> {
  const data = await apiFetch<HighlightMutationResponse>(
    "/api/admin/home/highlights",
    {
      method: "POST",
      body: JSON.stringify(input),
    }
  );
  return data.highlight;
}

export async function updateHomeHighlight(
  id: string,
  input: HomeHighlightInput
): Promise<HomeHighlight> {
  const data = await apiFetch<HighlightMutationResponse>(
    `/api/admin/home/highlights/${encodeURIComponent(id)}`,
    {
      method: "PUT",
      body: JSON.stringify(input),
    }
  );
  return data.highlight;
}

export async function setHomeHighlightActive(
  id: string,
  active: boolean
): Promise<HomeHighlight> {
  const data = await apiFetch<HighlightMutationResponse>(
    `/api/admin/home/highlights/${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      body: JSON.stringify({ active }),
    }
  );
  return data.highlight;
}

export async function deleteHomeHighlight(id: string): Promise<string> {
  const data = await apiFetch<DeleteResponse>(
    `/api/admin/home/highlights/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
    }
  );
  return data.id;
}
