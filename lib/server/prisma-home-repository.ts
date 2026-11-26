import { Prisma } from "@prisma/client";
import { EMPTY_HOME_CONTENT } from "@/config/store";
import {
  isDatabaseUnavailableError,
  isPrismaConfigured,
  prisma,
} from "@/lib/server/prisma";
import type {
  HomeContent,
  HomeHeroSettings,
  HomeHighlight,
  HomeHighlightInput,
  HomeSectionSettings,
  HomeSettingsInput,
  HomeTrustPillar,
} from "@/interface/home";
import type { HomeRepository } from "@/interface/repository";

function mapHighlight(row: {
  id: string;
  badge: string;
  title: string;
  description: string;
  bullets: string[];
  imageUrl: string;
  imageAlt: string;
  ctaLabel: string;
  ctaHref: string;
  active: boolean;
}): HomeHighlight {
  return {
    id: row.id,
    badge: row.badge,
    title: row.title,
    description: row.description,
    bullets: row.bullets,
    imageUrl: row.imageUrl,
    imageAlt: row.imageAlt,
    ctaLabel: row.ctaLabel,
    ctaHref: row.ctaHref,
    active: row.active,
  };
}

export const prismaHomeRepository: HomeRepository = {
  async getContent(): Promise<HomeContent> {
    if (!isPrismaConfigured()) return EMPTY_HOME_CONTENT;
    try {
      const [settings, highlights] = await Promise.all([
        prisma.homeSettings.findUnique({ where: { id: "default" } }),
        prisma.homeHighlight.findMany({
          orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        }),
      ]);

      return {
        hero:
          (settings?.hero as unknown as HomeHeroSettings) ??
          EMPTY_HOME_CONTENT.hero,
        sections:
          (settings?.sections as unknown as HomeSectionSettings) ??
          EMPTY_HOME_CONTENT.sections,
        trustPillars: Array.isArray(settings?.trustPillars)
          ? (settings.trustPillars as unknown as HomeTrustPillar[])
          : EMPTY_HOME_CONTENT.trustPillars,
        highlights: highlights.map(mapHighlight),
      };
    } catch (err) {
      if (isDatabaseUnavailableError(err)) {
        return EMPTY_HOME_CONTENT;
      }
      throw err;
    }
  },

  async updateSettings(input: HomeSettingsInput): Promise<HomeContent> {
    await prisma.homeSettings.upsert({
      where: { id: "default" },
      update: {
        hero: input.hero as unknown as Prisma.InputJsonValue,
        sections: input.sections as unknown as Prisma.InputJsonValue,
        trustPillars: input.trustPillars as unknown as Prisma.InputJsonValue,
      },
      create: {
        id: "default",
        hero: input.hero as unknown as Prisma.InputJsonValue,
        sections: input.sections as unknown as Prisma.InputJsonValue,
        trustPillars: input.trustPillars as unknown as Prisma.InputJsonValue,
      },
    });

    return this.getContent();
  },

  async createHighlight(input: HomeHighlightInput): Promise<HomeHighlight> {
    const created = await prisma.homeHighlight.create({
      data: {
        badge: input.badge,
        title: input.title,
        description: input.description,
        bullets: input.bullets,
        imageUrl: input.imageUrl,
        imageAlt: input.imageAlt || input.title,
        ctaLabel: input.ctaLabel,
        ctaHref: input.ctaHref,
        active: input.active,
        sortOrder: 0,
      },
    });
    return mapHighlight(created);
  },

  async updateHighlight(
    id: string,
    input: HomeHighlightInput
  ): Promise<HomeHighlight | null> {
    try {
      const updated = await prisma.homeHighlight.update({
        where: { id },
        data: {
          badge: input.badge,
          title: input.title,
          description: input.description,
          bullets: input.bullets,
          imageUrl: input.imageUrl,
          imageAlt: input.imageAlt || input.title,
          ctaLabel: input.ctaLabel,
          ctaHref: input.ctaHref,
          active: input.active,
        },
      });
      return mapHighlight(updated);
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2025"
      ) {
        return null;
      }
      throw err;
    }
  },

  async toggleHighlight(
    id: string,
    active: boolean
  ): Promise<HomeHighlight | null> {
    try {
      const updated = await prisma.homeHighlight.update({
        where: { id },
        data: { active },
      });
      return mapHighlight(updated);
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2025"
      ) {
        return null;
      }
      throw err;
    }
  },

  async deleteHighlight(id: string): Promise<boolean> {
    try {
      await prisma.homeHighlight.delete({ where: { id } });
      return true;
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2025"
      ) {
        return false;
      }
      throw err;
    }
  },
};
