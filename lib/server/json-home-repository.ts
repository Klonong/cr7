import fs from "fs/promises";
import path from "path";
import { DEFAULT_HOME_CONTENT } from "@/data/home-defaults";
import type { HomeRepository } from "@/lib/server/home-repository";
import type {
  HomeContent,
  HomeHighlight,
  HomeHighlightInput,
  HomeSettingsInput,
} from "@/types/home";

const HOME_STORE_FILE = path.join(process.cwd(), "data", "home-content.json");

async function ensureHomeFile(): Promise<void> {
  try {
    await fs.access(HOME_STORE_FILE);
  } catch {
    await fs.mkdir(path.dirname(HOME_STORE_FILE), { recursive: true });
    await fs.writeFile(
      HOME_STORE_FILE,
      JSON.stringify(DEFAULT_HOME_CONTENT, null, 2),
      "utf8"
    );
  }
}

async function readHomeStore(): Promise<HomeContent> {
  await ensureHomeFile();
  const raw = await fs.readFile(HOME_STORE_FILE, "utf8");
  const parsed = JSON.parse(raw) as Partial<HomeContent>;

  return {
    hero: { ...DEFAULT_HOME_CONTENT.hero, ...(parsed.hero ?? {}) },
    sections: { ...DEFAULT_HOME_CONTENT.sections, ...(parsed.sections ?? {}) },
    trustPillars:
      Array.isArray(parsed.trustPillars) && parsed.trustPillars.length > 0
        ? parsed.trustPillars
        : DEFAULT_HOME_CONTENT.trustPillars,
    highlights: Array.isArray(parsed.highlights)
      ? parsed.highlights
      : DEFAULT_HOME_CONTENT.highlights,
  };
}

async function writeHomeStore(content: HomeContent): Promise<void> {
  await fs.mkdir(path.dirname(HOME_STORE_FILE), { recursive: true });
  await fs.writeFile(HOME_STORE_FILE, JSON.stringify(content, null, 2), "utf8");
}

export const jsonHomeRepository: HomeRepository = {
  async getContent() {
    return readHomeStore();
  },

  async updateSettings(input: HomeSettingsInput) {
    const current = await readHomeStore();
    const updated: HomeContent = {
      ...current,
      hero: input.hero,
      sections: input.sections,
      trustPillars:
        input.trustPillars.length > 0
          ? input.trustPillars
          : current.trustPillars,
    };
    await writeHomeStore(updated);
    return updated;
  },

  async createHighlight(input: HomeHighlightInput) {
    const current = await readHomeStore();
    const created: HomeHighlight = {
      id: `hl-${Date.now().toString(36)}`,
      badge: input.badge,
      title: input.title,
      description: input.description,
      bullets: input.bullets,
      imageUrl: input.imageUrl,
      imageAlt: input.imageAlt || input.title,
      ctaLabel: input.ctaLabel,
      ctaHref: input.ctaHref,
      active: input.active,
    };
    await writeHomeStore({
      ...current,
      highlights: [created, ...current.highlights],
    });
    return created;
  },

  async updateHighlight(id: string, input: HomeHighlightInput) {
    const current = await readHomeStore();
    const index = current.highlights.findIndex((h) => h.id === id);
    if (index === -1) return null;

    const updated: HomeHighlight = {
      id,
      badge: input.badge,
      title: input.title,
      description: input.description,
      bullets: input.bullets,
      imageUrl: input.imageUrl,
      imageAlt: input.imageAlt || input.title,
      ctaLabel: input.ctaLabel,
      ctaHref: input.ctaHref,
      active: input.active,
    };

    const nextHighlights = [...current.highlights];
    nextHighlights[index] = updated;
    await writeHomeStore({ ...current, highlights: nextHighlights });
    return updated;
  },

  async toggleHighlight(id: string, active: boolean) {
    const current = await readHomeStore();
    const index = current.highlights.findIndex((h) => h.id === id);
    if (index === -1) return null;

    const updated: HomeHighlight = { ...current.highlights[index], active };
    const nextHighlights = [...current.highlights];
    nextHighlights[index] = updated;
    await writeHomeStore({ ...current, highlights: nextHighlights });
    return updated;
  },

  async deleteHighlight(id: string) {
    const current = await readHomeStore();
    const nextHighlights = current.highlights.filter((h) => h.id !== id);
    if (nextHighlights.length === current.highlights.length) return false;
    await writeHomeStore({ ...current, highlights: nextHighlights });
    return true;
  },
};
