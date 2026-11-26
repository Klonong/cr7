"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  createCatalogCategory,
  updateCatalogCategory,
} from "@/lib/api/category-api";
import { getErrorMessage } from "@/lib/api/client";
import { slugify } from "@/lib/format";
import { validateCategoryInput } from "@/lib/validation/category";
import type { Category } from "@/types/catalog";

export function useCategoryCreateForm(existingCategories: Category[]) {
  const router = useRouter();

  const [name, setName] = React.useState("");
  const [shortName, setShortName] = React.useState("");
  const [shortNameTouched, setShortNameTouched] = React.useState(false);
  const [slug, setSlug] = React.useState("");
  const [slugTouched, setSlugTouched] = React.useState(false);
  const [description, setDescription] = React.useState("");

  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const existingSlugs = React.useMemo(
    () => new Set(existingCategories.map((c) => c.slug)),
    [existingCategories]
  );

  const previewSlug = slugify(slug || name);
  const isDuplicateSlug = Boolean(
    previewSlug && existingSlugs.has(previewSlug)
  );

  const handleNameChange = React.useCallback(
    (val: string) => {
      setName(val);
      if (!slugTouched) {
        setSlug(slugify(val));
      }
      if (!shortNameTouched) {
        const firstWord = val.trim().split(/[\s&/]+/)[0] ?? "";
        setShortName(firstWord.slice(0, 18));
      }
    },
    [slugTouched, shortNameTouched]
  );

  const handleShortNameChange = React.useCallback((val: string) => {
    setShortNameTouched(true);
    setShortName(val);
  }, []);

  const handleSlugChange = React.useCallback((val: string) => {
    setSlugTouched(true);
    setSlug(val);
  }, []);

  const handleSubmit = React.useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError(null);

      if (isDuplicateSlug) {
        setError(
          `Kategori dengan slug "${previewSlug}" sudah terdaftar. Gunakan slug lain.`
        );
        return;
      }

      const validation = validateCategoryInput({
        name,
        shortName,
        slug: slug || name,
        description,
      });

      if (!validation.ok) {
        setError(validation.error);
        return;
      }

      setSubmitting(true);
      try {
        await createCatalogCategory(validation.data);
        router.push(
          "/admin/categories?created=" + encodeURIComponent(validation.data.name)
        );
        router.refresh();
      } catch (err) {
        setError(getErrorMessage(err, "Gagal membuat kategori baru."));
        setSubmitting(false);
      }
    },
    [isDuplicateSlug, previewSlug, name, shortName, slug, description, router]
  );

  return {
    name,
    handleNameChange,
    shortName,
    handleShortNameChange,
    slug,
    handleSlugChange,
    description,
    setDescription,
    previewSlug,
    isDuplicateSlug,
    submitting,
    error,
    handleSubmit,
  };
}

interface UseCategoryEditFormOptions {
  category: Category;
  onClose: () => void;
  onSaved: (category: Category, mode: "create" | "edit") => void;
}

export function useCategoryEditForm({
  category,
  onClose,
  onSaved,
}: UseCategoryEditFormOptions) {
  const [name, setName] = React.useState(category.name);
  const [shortName, setShortName] = React.useState(category.shortName);
  const [description, setDescription] = React.useState(category.description);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = React.useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError(null);

      const validation = validateCategoryInput({
        name,
        shortName,
        slug: category.slug,
        description,
      });
      if (!validation.ok) {
        setError(validation.error);
        return;
      }

      setSubmitting(true);
      try {
        const updated = await updateCatalogCategory(
          category.slug,
          validation.data
        );
        onSaved(updated, "edit");
        onClose();
      } catch (err) {
        setError(getErrorMessage(err, "Gagal memperbarui kategori."));
        setSubmitting(false);
      }
    },
    [name, shortName, category.slug, description, onSaved, onClose]
  );

  return {
    name,
    setName,
    shortName,
    setShortName,
    description,
    setDescription,
    submitting,
    error,
    handleSubmit,
  };
}
