import {
  isSafeHttpUrl,
  isSafeLocalImageUrl,
  type ValidationResult,
} from "@/lib/validation/product";
import type {
  HomeHighlightInput,
  HomeSettingsInput,
  HomeTrustPillar,
  TrustIconName,
} from "@/interface/home";

const VALID_ICONS = new Set<TrustIconName>([
  "shield",
  "truck",
  "gauge",
  "award",
  "zap",
  "wrench",
]);

export function isSafeLinkHref(href: string): boolean {
  const trimmed = href.trim();
  if (!trimmed || trimmed.length > 300) return false;
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) return true;
  return isSafeHttpUrl(trimmed);
}

export function isSafeImageSrc(src: string): boolean {
  return isSafeLocalImageUrl(src);
}

export function validateHighlightInput(
  raw: unknown
): ValidationResult<HomeHighlightInput> {
  if (!raw || typeof raw !== "object") {
    return { ok: false, error: "Data sorotan tidak valid." };
  }

  const body = raw as Record<string, unknown>;
  const badge = typeof body.badge === "string" ? body.badge.trim() : "";
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const description =
    typeof body.description === "string" ? body.description.trim() : "";
  const imageUrl =
    typeof body.imageUrl === "string" ? body.imageUrl.trim() : "";
  const imageAlt =
    typeof body.imageAlt === "string" ? body.imageAlt.trim() : "";
  const ctaLabel =
    typeof body.ctaLabel === "string" ? body.ctaLabel.trim() : "";
  const ctaHref = typeof body.ctaHref === "string" ? body.ctaHref.trim() : "";

  if (!badge || badge.length < 2) {
    return { ok: false, error: "Label badge sorotan wajib diisi." };
  }
  if (!title || title.length < 4) {
    return { ok: false, error: "Judul sorotan minimal 4 karakter." };
  }
  if (!description || description.length < 10) {
    return {
      ok: false,
      error: "Deskripsi sorotan minimal 10 karakter.",
    };
  }
  if (!ctaLabel) {
    return { ok: false, error: "Label tombol CTA wajib diisi." };
  }
  if (!isSafeLinkHref(ctaHref)) {
    return {
      ok: false,
      error: "Link CTA harus diawali dengan / atau https://",
    };
  }

  const resolvedImage = imageUrl || "/images/prod-beam-test.svg";
  if (!isSafeImageSrc(resolvedImage)) {
    return {
      ok: false,
      error: "Path gambar sorotan harus dari folder lokal /images/... atau /uploads/...",
    };
  }

  const bullets = Array.isArray(body.bullets)
    ? body.bullets
        .filter((b): b is string => typeof b === "string" && b.trim().length > 0)
        .map((b) => b.trim())
        .slice(0, 5)
    : [];

  return {
    ok: true,
    data: {
      badge: badge.toUpperCase(),
      title,
      description,
      bullets,
      imageUrl: resolvedImage,
      imageAlt: imageAlt || title,
      ctaLabel,
      ctaHref,
      active: body.active !== false,
    },
  };
}

export function validateHomeSettingsInput(
  raw: unknown
): ValidationResult<HomeSettingsInput> {
  if (!raw || typeof raw !== "object") {
    return { ok: false, error: "Data pengaturan beranda tidak valid." };
  }

  const body = raw as Record<string, unknown>;
  const heroRaw =
    body.hero && typeof body.hero === "object"
      ? (body.hero as Record<string, unknown>)
      : null;
  const sectionsRaw =
    body.sections && typeof body.sections === "object"
      ? (body.sections as Record<string, unknown>)
      : null;

  if (!heroRaw || !sectionsRaw) {
    return { ok: false, error: "Pengaturan hero dan bagian beranda wajib diisi." };
  }

  const eyebrow =
    typeof heroRaw.eyebrow === "string" ? heroRaw.eyebrow.trim() : "";
  const headline =
    typeof heroRaw.headline === "string" ? heroRaw.headline.trim() : "";
  const subheadline =
    typeof heroRaw.subheadline === "string" ? heroRaw.subheadline.trim() : "";
  const primaryCtaLabel =
    typeof heroRaw.primaryCtaLabel === "string"
      ? heroRaw.primaryCtaLabel.trim()
      : "";
  const primaryCtaHref =
    typeof heroRaw.primaryCtaHref === "string"
      ? heroRaw.primaryCtaHref.trim()
      : "/products";
  const heroImageUrl =
    typeof heroRaw.heroImageUrl === "string" && heroRaw.heroImageUrl.trim()
      ? heroRaw.heroImageUrl.trim()
      : "/images/hero-led.svg";
  const spotlightTag =
    typeof heroRaw.spotlightTag === "string" ? heroRaw.spotlightTag.trim() : "";
  const spotlightTitle =
    typeof heroRaw.spotlightTitle === "string"
      ? heroRaw.spotlightTitle.trim()
      : "";
  const spotlightProductSlug =
    typeof heroRaw.spotlightProductSlug === "string"
      ? heroRaw.spotlightProductSlug.trim()
      : "";

  if (!headline || headline.length < 5) {
    return { ok: false, error: "Judul utama hero minimal 5 karakter." };
  }
  if (!subheadline) {
    return { ok: false, error: "Subjudul hero wajib diisi." };
  }
  if (!primaryCtaLabel) {
    return { ok: false, error: "Label CTA utama wajib diisi." };
  }
  if (!isSafeLinkHref(primaryCtaHref)) {
    return {
      ok: false,
      error: "Link CTA utama harus diawali dengan / atau https://",
    };
  }
  if (!isSafeImageSrc(heroImageUrl)) {
    return {
      ok: false,
      error: "Path gambar hero harus dari folder lokal /images/... atau /uploads/...",
    };
  }

  const featuredMaxRaw = Number(sectionsRaw.featuredMaxItems);
  const featuredMaxItems =
    Number.isFinite(featuredMaxRaw) && featuredMaxRaw >= 2 && featuredMaxRaw <= 16
      ? Math.round(featuredMaxRaw)
      : 8;

  const pillarsRaw = Array.isArray(body.trustPillars) ? body.trustPillars : [];
  const trustPillars: HomeTrustPillar[] = pillarsRaw
    .filter((p): p is Record<string, unknown> => Boolean(p && typeof p === "object"))
    .slice(0, 4)
    .map((p, idx) => {
      const iconCandidate =
        typeof p.icon === "string" && VALID_ICONS.has(p.icon as TrustIconName)
          ? (p.icon as TrustIconName)
          : "shield";
      return {
        id: typeof p.id === "string" && p.id.trim() ? p.id.trim() : `pillar-${idx + 1}`,
        icon: iconCandidate,
        title:
          typeof p.title === "string" && p.title.trim()
            ? p.title.trim()
            : "Official Guarantee",
        description:
          typeof p.description === "string" ? p.description.trim() : "",
      };
    });

  return {
    ok: true,
    data: {
      hero: {
        eyebrow: eyebrow || "Official Showroom",
        headline,
        subheadline,
        primaryCtaLabel,
        primaryCtaHref,
        heroImageUrl,
        spotlightTag,
        spotlightTitle,
        spotlightProductSlug,
        showOfficialStoreLinks: heroRaw.showOfficialStoreLinks !== false,
      },
      sections: {
        showTrustStrip: sectionsRaw.showTrustStrip !== false,
        showBikeFitmentStrip: sectionsRaw.showBikeFitmentStrip !== false,
        showCategoriesGrid: sectionsRaw.showCategoriesGrid !== false,
        featuredSectionEyebrow:
          typeof sectionsRaw.featuredSectionEyebrow === "string" &&
          sectionsRaw.featuredSectionEyebrow.trim()
            ? sectionsRaw.featuredSectionEyebrow.trim()
            : "Most Popular Upgrades",
        featuredSectionTitle:
          typeof sectionsRaw.featuredSectionTitle === "string" &&
          sectionsRaw.featuredSectionTitle.trim()
            ? sectionsRaw.featuredSectionTitle.trim()
            : "Featured Motorcycle Accessories",
        featuredSectionSubtitle:
          typeof sectionsRaw.featuredSectionSubtitle === "string"
            ? sectionsRaw.featuredSectionSubtitle.trim()
            : "",
        featuredMaxItems,
        showHighlights: sectionsRaw.showHighlights !== false,
      },
      trustPillars,
    },
  };
}
