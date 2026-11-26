"use client";

import Image from "next/image";
import { AlertCircle, ImagePlus, Loader2, UploadCloud, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useImageDropzone } from "@/hooks/admin/use-image-dropzone";
import { cn } from "@/lib/utils";

interface ImagePreset {
  readonly label: string;
  readonly url: string;
}

interface ImageDropzoneProps {
  value: string;
  onChange: (url: string) => void;
  presets?: readonly ImagePreset[];
  label?: string;
  fallbackSrc?: string;
  previewAspect?: "square" | "wide";
}

export function ImageDropzone({
  value,
  onChange,
  presets,
  label = "Unggah atau seret gambar ke sini",
  fallbackSrc = "/images/prod-biled-projector.svg",
  previewAspect = "square",
}: ImageDropzoneProps) {
  const {
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
  } = useImageDropzone({ value, fallbackSrc, onChange });

  return (
    <div className="space-y-3">
      {/* Drag & Drop Zone */}
      <div
        role="button"
        tabIndex={0}
        onClick={openFilePicker}
        onKeyDown={handleKeyDown}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative flex flex-col sm:flex-row items-center gap-4 rounded-xl border-2 border-dashed p-4 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          dragging
            ? "border-primary bg-primary/10"
            : "border-border bg-muted/30 hover:border-primary/60 hover:bg-muted/50"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleInputChange}
          className="hidden"
          aria-label="Pilih file gambar dari perangkat"
        />

        {/* Preview Box */}
        <div
          className={cn(
            "relative shrink-0 overflow-hidden rounded-lg border border-border bg-zinc-950",
            previewAspect === "wide" ? "h-20 w-32" : "size-20"
          )}
        >
          <Image
            src={previewUrl}
            alt="Pratinjau gambar"
            fill
            sizes="128px"
            className="object-cover"
          />
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/65 text-white">
              <Loader2 className="size-5 animate-spin" aria-hidden="true" />
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="flex-1 text-center sm:text-left space-y-1 min-w-0">
          <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground">
            {dragging ? (
              <>
                <UploadCloud
                  className="size-4 text-primary"
                  aria-hidden="true"
                />
                <span>Lepaskan file gambar untuk mengunggah...</span>
              </>
            ) : (
              <>
                <ImagePlus className="size-4 text-primary" aria-hidden="true" />
                <span>{label}</span>
              </>
            )}
          </p>
          <p className="text-[11px] text-muted-foreground">
            Seret &amp; lepas file (Drag &amp; Drop) atau klik untuk memilih
            file · JPG, PNG, WebP (otomatis dikonversi ke .webp · Maks. 5 MB)
          </p>
          {value && (
            <p className="truncate font-mono text-[10px] text-muted-foreground">
              {value}
            </p>
          )}
        </div>

        {value && value !== fallbackSrc && (
          <button
            type="button"
            onClick={handleReset}
            aria-label="Reset ke gambar default"
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        )}
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive"
        >
          <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      {/* Optional URL Manual Override */}
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="/uploads/... atau /images/..."
        aria-label="Path atau URL gambar"
        className="h-9 font-mono text-xs"
      />

      {/* Optional Studio Presets */}
      {presets && presets.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {presets.map((preset) => (
            <button
              key={preset.url}
              type="button"
              onClick={() => onChange(preset.url)}
              className={cn(
                "rounded-md border px-2 py-0.5 text-[11px] font-medium transition-colors",
                value === preset.url
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-muted/50 text-muted-foreground hover:text-foreground"
              )}
            >
              {preset.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
