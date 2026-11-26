"use client";

import * as React from "react";
import { uploadAdminImage } from "@/lib/api/upload-api";
import { getErrorMessage } from "@/lib/api/client";

interface UseImageDropzoneOptions {
  value: string;
  fallbackSrc: string;
  onChange: (url: string) => void;
}

export function useImageDropzone({
  value,
  fallbackSrc,
  onChange,
}: UseImageDropzoneOptions) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleFile = React.useCallback(
    async (file: File) => {
      setError(null);
      setUploading(true);
      try {
        const uploadedUrl = await uploadAdminImage(file);
        onChange(uploadedUrl);
      } catch (err) {
        setError(getErrorMessage(err, "Gagal mengunggah gambar."));
      } finally {
        setUploading(false);
      }
    },
    [onChange]
  );

  const openFilePicker = React.useCallback(() => {
    if (!uploading) {
      inputRef.current?.click();
    }
  }, [uploading]);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if ((e.key === "Enter" || e.key === " ") && !uploading) {
        e.preventDefault();
        inputRef.current?.click();
      }
    },
    [uploading]
  );

  const handleDragOver = React.useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setDragging(true);
    },
    []
  );

  const handleDragLeave = React.useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setDragging(false);
    },
    []
  );

  const handleDrop = React.useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) {
        void handleFile(file);
      }
    },
    [handleFile]
  );

  const handleInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        void handleFile(file);
      }
      e.target.value = "";
    },
    [handleFile]
  );

  const handleReset = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      onChange(fallbackSrc);
    },
    [fallbackSrc, onChange]
  );

  const previewUrl =
    value.trim().startsWith("/") || value.trim().startsWith("http")
      ? value.trim()
      : fallbackSrc;

  return {
    inputRef,
    dragging,
    uploading,
    error,
    previewUrl,
    openFilePicker,
    handleKeyDown,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleInputChange,
    handleReset,
  };
}
