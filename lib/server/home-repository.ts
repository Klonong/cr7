import { jsonHomeRepository } from "@/lib/server/json-home-repository";
import type {
  HomeContent,
  HomeHighlight,
  HomeHighlightInput,
  HomeSettingsInput,
} from "@/types/home";

/**
 * Backend-agnostic data access contract for Home Content & Highlights.
 * Swap jsonHomeRepository with your database implementation when ready.
 */
export interface HomeRepository {
  getContent(): Promise<HomeContent>;
  updateSettings(input: HomeSettingsInput): Promise<HomeContent>;
  createHighlight(input: HomeHighlightInput): Promise<HomeHighlight>;
  updateHighlight(
    id: string,
    input: HomeHighlightInput
  ): Promise<HomeHighlight | null>;
  toggleHighlight(id: string, active: boolean): Promise<HomeHighlight | null>;
  deleteHighlight(id: string): Promise<boolean>;
}

export const homeRepository: HomeRepository = jsonHomeRepository;
