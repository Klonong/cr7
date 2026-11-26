"use client";

import * as React from "react";
import {
  createHomeHighlight,
  updateHomeHighlight,
} from "@/lib/api/home-api";
import { getErrorMessage } from "@/lib/api/client";
import { parseNewlineList } from "@/lib/format";
import { validateHighlightInput } from "@/lib/validation/home";
import type { HomeHighlight, HomeHighlightInput } from "@/interface/home";

interface UseHighlightFormOptions {
  highlight: HomeHighlight | null;
  onClose: () => void;
  onSaved: (highlight: HomeHighlight, mode: "create" | "edit") => void;
}

export function useHighlightForm({
  highlight,
  onClose,
  onSaved,
}: UseHighlightFormOptions) {
  const isEdit = Boolean(highlight);

  const [badge, setBadge] = React.useState(highlight?.badge ?? "");
  const [title, setTitle] = React.useState(highlight?.title ?? "");
  const [description, setDescription] = React.useState(
    highlight?.description ?? ""
  );
  const [bulletsText, setBulletsText] = React.useState(
    highlight?.bullets.join("\n") ?? ""
  );
  const [imageUrl, setImageUrl] = React.useState(
    highlight?.imageUrl ?? "/images/prod-beam-test.svg"
  );
  const [imageAlt, setImageAlt] = React.useState(highlight?.imageAlt ?? "");
  const [ctaLabel, setCtaLabel] = React.useState(
    highlight?.ctaLabel ?? "Jelajahi Katalog"
  );
  const [ctaHref, setCtaHref] = React.useState(
    highlight?.ctaHref ?? "/products"
  );
  const [active, setActive] = React.useState(highlight?.active ?? true);

  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = React.useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError(null);

      const payload: HomeHighlightInput = {
        badge: badge.trim(),
        title: title.trim(),
        description: description.trim(),
        bullets: parseNewlineList(bulletsText),
        imageUrl: imageUrl.trim() || "/images/prod-beam-test.svg",
        imageAlt: imageAlt.trim() || title.trim(),
        ctaLabel: ctaLabel.trim(),
        ctaHref: ctaHref.trim(),
        active,
      };

      const validation = validateHighlightInput(payload);
      if (!validation.ok) {
        setError(validation.error);
        return;
      }

      setSubmitting(true);
      try {
        const saved = isEdit
          ? await updateHomeHighlight(highlight!.id, validation.data)
          : await createHomeHighlight(validation.data);

        onSaved(saved, isEdit ? "edit" : "create");
        onClose();
      } catch (err) {
        setError(getErrorMessage(err, "Gagal menyimpan sorotan."));
        setSubmitting(false);
      }
    },
    [
      badge,
      title,
      description,
      bulletsText,
      imageUrl,
      imageAlt,
      ctaLabel,
      ctaHref,
      active,
      isEdit,
      highlight,
      onSaved,
      onClose,
    ]
  );

  return {
    isEdit,
    badge,
    setBadge,
    title,
    setTitle,
    description,
    setDescription,
    bulletsText,
    setBulletsText,
    imageUrl,
    setImageUrl,
    imageAlt,
    setImageAlt,
    ctaLabel,
    setCtaLabel,
    ctaHref,
    setCtaHref,
    active,
    setActive,
    submitting,
    error,
    handleSubmit,
  };
}
