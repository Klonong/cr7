export type TrustIconName =
  | "shield"
  | "truck"
  | "gauge"
  | "award"
  | "zap"
  | "wrench";

export interface HomeHeroSettings {
  eyebrow: string;
  headline: string;
  subheadline: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  heroImageUrl: string;
  spotlightTag: string;
  spotlightTitle: string;
  spotlightProductSlug: string;
  showOfficialStoreLinks: boolean;
}

export interface HomeSectionSettings {
  showTrustStrip: boolean;
  showBikeFitmentStrip: boolean;
  showCategoriesGrid: boolean;
  featuredSectionEyebrow: string;
  featuredSectionTitle: string;
  featuredSectionSubtitle: string;
  featuredMaxItems: number;
  showHighlights: boolean;
}

export interface HomeTrustPillar {
  id: string;
  icon: TrustIconName;
  title: string;
  description: string;
}

export interface HomeHighlight {
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
}

export interface HomeHighlightInput {
  badge: string;
  title: string;
  description: string;
  bullets: string[];
  imageUrl: string;
  imageAlt?: string;
  ctaLabel: string;
  ctaHref: string;
  active: boolean;
}

export interface HomeSettingsInput {
  hero: HomeHeroSettings;
  sections: HomeSectionSettings;
  trustPillars: HomeTrustPillar[];
}

export interface HomeContent extends HomeSettingsInput {
  highlights: HomeHighlight[];
}
