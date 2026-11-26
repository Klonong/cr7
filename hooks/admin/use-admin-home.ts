"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  deleteHomeHighlight,
  saveHomeSettings,
  setHomeHighlightActive,
} from "@/lib/api/home-api";
import { getErrorMessage } from "@/lib/api/client";
import type { AdminFeedback } from "@/hooks/admin/use-admin-catalog";
import type { Product } from "@/interface/catalog";
import type {
  HomeContent,
  HomeHighlight,
  HomeSettingsInput,
  HomeTrustPillar,
} from "@/interface/home";

export function useAdminHome(
  initialContent: HomeContent,
  products: Product[] = []
) {
  const router = useRouter();

  const [content, setContent] = React.useState<HomeContent>(initialContent);
  const [hero, setHero] = React.useState(initialContent.hero);
  const [sections, setSections] = React.useState(initialContent.sections);
  const [trustPillars, setTrustPillars] = React.useState<HomeTrustPillar[]>(
    initialContent.trustPillars
  );

  const [savingSettings, setSavingSettings] = React.useState(false);
  const [togglingId, setTogglingId] = React.useState<string | null>(null);
  const [deleting, setDeleting] = React.useState(false);
  const [feedback, setFeedback] = React.useState<AdminFeedback | null>(null);

  const [highlightDialogOpen, setHighlightDialogOpen] = React.useState(false);
  const [editingHighlight, setEditingHighlight] =
    React.useState<HomeHighlight | null>(null);
  const [deletingHighlight, setDeletingHighlight] =
    React.useState<HomeHighlight | null>(null);

  const openCreateHighlight = React.useCallback(() => {
    setEditingHighlight(null);
    setHighlightDialogOpen(true);
  }, []);

  const openEditHighlight = React.useCallback((hl: HomeHighlight) => {
    setEditingHighlight(hl);
    setHighlightDialogOpen(true);
  }, []);

  const updateSettings = React.useCallback(
    async (input: HomeSettingsInput) => {
      setSavingSettings(true);
      setFeedback(null);
      try {
        const updated = await saveHomeSettings(input);
        setContent(updated);
        setFeedback({
          type: "success",
          message:
            "Pengaturan konten beranda berhasil disimpan dan dipublikasikan.",
        });
        router.refresh();
        return true;
      } catch (err) {
        setFeedback({
          type: "error",
          message: getErrorMessage(err, "Gagal menyimpan pengaturan beranda."),
        });
        return false;
      } finally {
        setSavingSettings(false);
      }
    },
    [router]
  );

  const handleSaveSettings = React.useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      await updateSettings({ hero, sections, trustPillars });
    },
    [hero, sections, trustPillars, updateSettings]
  );

  const handlePickSpotlightProduct = React.useCallback(
    (slug: string | null) => {
      if (!slug) return;
      const found = products.find((p) => p.slug === slug);
      if (!found) return;
      setHero((prev) => ({
        ...prev,
        spotlightProductSlug: found.slug,
        spotlightTag: `Produk Unggulan · ${found.sku}`,
        spotlightTitle: found.name,
      }));
    },
    [products]
  );

  const updatePillar = React.useCallback(
    (id: string, patch: Partial<Omit<HomeTrustPillar, "id">>) => {
      setTrustPillars((prev) =>
        prev.map((pillar) =>
          pillar.id === id ? { ...pillar, ...patch } : pillar
        )
      );
    },
    []
  );

  const applySavedHighlight = React.useCallback(
    (saved: HomeHighlight, mode: "create" | "edit") => {
      setContent((prev) => ({
        ...prev,
        highlights:
          mode === "create"
            ? [saved, ...prev.highlights]
            : prev.highlights.map((h) => (h.id === saved.id ? saved : h)),
      }));
      setFeedback({
        type: "success",
        message:
          mode === "create"
            ? `Sorotan "${saved.title}" berhasil ditambahkan.`
            : `Sorotan "${saved.title}" berhasil diperbarui.`,
      });
      router.refresh();
    },
    [router]
  );

  const toggleHighlight = React.useCallback(
    async (highlight: HomeHighlight, nextActive: boolean) => {
      setTogglingId(highlight.id);
      setContent((prev) => ({
        ...prev,
        highlights: prev.highlights.map((h) =>
          h.id === highlight.id ? { ...h, active: nextActive } : h
        ),
      }));

      try {
        await setHomeHighlightActive(highlight.id, nextActive);
        setFeedback({
          type: "success",
          message: `"${highlight.badge}" sekarang ${nextActive ? "ditampilkan" : "disembunyikan"} di Beranda.`,
        });
        router.refresh();
      } catch (err) {
        setContent((prev) => ({
          ...prev,
          highlights: prev.highlights.map((h) =>
            h.id === highlight.id ? { ...h, active: highlight.active } : h
          ),
        }));
        setFeedback({
          type: "error",
          message: getErrorMessage(err, "Gagal mengubah visibilitas sorotan."),
        });
      } finally {
        setTogglingId(null);
      }
    },
    [router]
  );

  const removeHighlight = React.useCallback(
    async (highlight: HomeHighlight) => {
      setDeleting(true);
      try {
        await deleteHomeHighlight(highlight.id);
        setContent((prev) => ({
          ...prev,
          highlights: prev.highlights.filter((h) => h.id !== highlight.id),
        }));
        setFeedback({
          type: "success",
          message: `Sorotan "${highlight.title}" berhasil dihapus.`,
        });
        router.refresh();
        return true;
      } catch (err) {
        setFeedback({
          type: "error",
          message: getErrorMessage(err, "Gagal menghapus sorotan."),
        });
        return false;
      } finally {
        setDeleting(false);
      }
    },
    [router]
  );

  const confirmDeleteHighlight = React.useCallback(async () => {
    if (!deletingHighlight) return;
    await removeHighlight(deletingHighlight);
    setDeletingHighlight(null);
  }, [deletingHighlight, removeHighlight]);

  const activeHighlightsCount = React.useMemo(
    () => content.highlights.filter((h) => h.active).length,
    [content.highlights]
  );

  const visibleSectionsCount = [
    sections.showTrustStrip,
    sections.showBikeFitmentStrip,
    sections.showCategoriesGrid,
    sections.showHighlights,
  ].filter(Boolean).length;

  const selectedSpotlightProduct = React.useMemo(
    () => products.find((p) => p.slug === hero.spotlightProductSlug),
    [products, hero.spotlightProductSlug]
  );

  return {
    content,
    hero,
    setHero,
    sections,
    setSections,
    trustPillars,
    updatePillar,
    activeHighlightsCount,
    visibleSectionsCount,
    selectedSpotlightProduct,
    savingSettings,
    togglingId,
    deleting,
    feedback,
    clearFeedback: () => setFeedback(null),
    highlightDialogOpen,
    setHighlightDialogOpen,
    editingHighlight,
    deletingHighlight,
    setDeletingHighlight,
    openCreateHighlight,
    openEditHighlight,
    handleSaveSettings,
    handlePickSpotlightProduct,
    applySavedHighlight,
    toggleHighlight,
    removeHighlight,
    confirmDeleteHighlight,
  };
}
