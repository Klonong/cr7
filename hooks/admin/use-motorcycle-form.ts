"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { createCatalogMotorcycle } from "@/lib/api/motorcycle-api";
import { getErrorMessage } from "@/lib/api/client";
import { validateMotorcycleInput } from "@/lib/validation/motorcycle";
import type { Motorcycle, MotorcycleType } from "@/types/catalog";

export function useMotorcycleForm(existingMotorcycles: Motorcycle[]) {
  const router = useRouter();

  const [brand, setBrand] = React.useState("");
  const [model, setModel] = React.useState("");
  const [customName, setCustomName] = React.useState("");
  const [nameTouched, setNameTouched] = React.useState(false);
  const [type, setType] = React.useState<MotorcycleType>("Matic");

  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const computedName = nameTouched
    ? customName.trim()
    : brand.trim().toLowerCase() === "universal"
      ? "Universal"
      : [brand.trim(), model.trim()].filter(Boolean).join(" ");

  const isDuplicate = React.useMemo(() => {
    if (!computedName) return false;
    return existingMotorcycles.some(
      (m) => m.name.toLowerCase() === computedName.toLowerCase()
    );
  }, [computedName, existingMotorcycles]);

  const handleCustomNameChange = React.useCallback((val: string) => {
    setNameTouched(true);
    setCustomName(val);
  }, []);

  const handleSubmit = React.useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError(null);

      if (isDuplicate) {
        setError(`Motor "${computedName}" sudah terdaftar di sistem.`);
        return;
      }

      const validation = validateMotorcycleInput({
        brand,
        model,
        name: computedName,
        type,
      });

      if (!validation.ok) {
        setError(validation.error);
        return;
      }

      setSubmitting(true);
      try {
        await createCatalogMotorcycle(validation.data);
        router.push(
          `/admin/motorcycles?created=${encodeURIComponent(validation.data.name ?? computedName)}`
        );
        router.refresh();
      } catch (err) {
        setError(getErrorMessage(err, "Gagal menambahkan data motor."));
        setSubmitting(false);
      }
    },
    [isDuplicate, computedName, brand, model, type, router]
  );

  return {
    brand,
    setBrand,
    model,
    setModel,
    displayNameInput: nameTouched ? customName : computedName,
    handleCustomNameChange,
    computedName,
    type,
    setType,
    isDuplicate,
    submitting,
    error,
    handleSubmit,
  };
}
