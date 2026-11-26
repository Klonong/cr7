"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  deleteHomeHighlight,
  saveHomeSettings,
  setHomeHighlightActive,
} from "@/lib/api/home-api";
import { getErrorMessage } from "@/lib/api/client";
import type { AdminFeedback } from "@/hooks/use-admin-catalog";
import type {
  HomeContent,
  HomeHighlight,
  HomeSettingsInput,
} from "@/types/home";

export function useAdminHome(initialContent: HomeContent) {
  const router = useRouter();

  const [content, setContent] = React.useState<HomeContent>(initialContent);
  const [savingSettings, setSavingSettings] = React.useState(false);
  const [togglingId, setTogglingId] = React.useState<string | null>(null);
  const [deleting, setDeleting] = React.useState(false);
  const [feedback, setFeedback] = React.useState<AdminFeedback | null>(null);

  const updateSettings = React.useCallback(
    async (input: HomeSettingsInput) => {
      setSavingSettings(true);
      setFeedback(null);
      try {
        const updated = await saveHomeSettings(input);
        setContent(updated);
        setFeedback({
          type: "success",
          message: "Pengaturan konten beranda berhasil disimpan dan dipublikasikan.",
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

  const activeHighlightsCount = React.useMemo(
    () => content.highlights.filter((h) => h.active).length,
    [content.highlights]
  );

  return {
    content,
    activeHighlightsCount,
    savingSettings,
    togglingId,
    deleting,
    feedback,
    clearFeedback: () => setFeedback(null),
    updateSettings,
    applySavedHighlight,
    toggleHighlight,
    removeHighlight,
  };
}
