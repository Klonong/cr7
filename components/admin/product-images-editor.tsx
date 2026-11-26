"use client";

import Image from "next/image";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Cloud,
  ImagePlus,
  Loader2,
  Plus,
  Star,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  IMAGE_LABEL_OPTIONS,
  MAX_PRODUCT_IMAGES,
} from "@/hooks/admin/use-product-form";
import { cn } from "@/lib/utils";
import type { ProductImage } from "@/interface/catalog";
import type { ProductImageDraft } from "@/interface/hooks";

interface ImagePreset {
  readonly label: string;
  readonly url: string;
}

interface ProductImagesEditorProps {
  images: ProductImageDraft[];
  inputRef: React.RefObject<HTMLInputElement | null>;
  manualImageUrl: string;
  onManualImageUrlChange: (val: string) => void;
  dragging: boolean;
  uploading: boolean;
  uploadProgress: string | null;
  uploadError: string | null;
  lastUploadStorage: "r2" | "local" | null;
  presets?: readonly ImagePreset[];
  onOpenPicker: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddManualUrl: () => void;
  onAddPreset: (
    url: string,
    label?: NonNullable<ProductImage["label"]>,
    alt?: string
  ) => void;
  onRemove: (id: string) => void;
  onSetPrimary: (id: string) => void;
  onMove: (id: string, direction: "left" | "right") => void;
  onUpdateMeta: (
    id: string,
    patch: Partial<Pick<ProductImageDraft, "alt" | "label">>
  ) => void;
}

export function ProductImagesEditor({
  images,
  inputRef,
  manualImageUrl,
  onManualImageUrlChange,
  dragging,
  uploading,
  uploadProgress,
  uploadError,
  lastUploadStorage,
  presets,
  onOpenPicker,
  onKeyDown,
  onDragOver,
  onDragLeave,
  onDrop,
  onInputChange,
  onAddManualUrl,
  onAddPreset,
  onRemove,
  onSetPrimary,
  onMove,
  onUpdateMeta,
}: ProductImagesEditorProps) {
  const remaining = MAX_PRODUCT_IMAGES - images.length;

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Cloud className="size-3.5 text-primary" aria-hidden="true" />
            <span>
              Galeri Foto Produk ({images.length}/{MAX_PRODUCT_IMAGES})
            </span>
          </p>
          <p className="text-[11px] text-muted-foreground">
            Unggah banyak foto sekaligus (otomatis disimpan ke bucket Cloudflare
            R2 saat terkonfigurasi). Foto #1 menjadi foto utama &amp; foto #2
            tampil saat hover.
          </p>
        </div>

        {lastUploadStorage && (
          <Badge
            variant="outline"
            className="font-mono text-[10px] border-primary/30 bg-primary/5 text-primary"
          >
            {lastUploadStorage === "r2"
              ? "Tersimpan di Cloudflare R2"
              : "Mode Dev Lokal (/uploads)"}
          </Badge>
        )}
      </div>

      {/* Multi-File Drag & Drop Zone */}
      <div
        role="button"
        tabIndex={0}
        onClick={onOpenPicker}
        onKeyDown={onKeyDown}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={cn(
          "relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-6 text-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          remaining <= 0
            ? "border-border/60 bg-muted/20 opacity-60 cursor-not-allowed"
            : dragging
              ? "border-primary bg-primary/10 cursor-pointer"
              : "border-border bg-muted/30 hover:border-primary/60 hover:bg-muted/50 cursor-pointer"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/png,image/jpeg,image/webp"
          onChange={onInputChange}
          disabled={uploading || remaining <= 0}
          className="hidden"
          aria-label="Pilih satu atau lebih foto produk"
        />

        {uploading ? (
          <>
            <Loader2
              className="size-6 animate-spin text-primary"
              aria-hidden="true"
            />
            <p className="text-xs font-semibold text-foreground">
              {uploadProgress || "Mengunggah foto ke bucket..."}
            </p>
          </>
        ) : (
          <>
            {dragging ? (
              <UploadCloud
                className="size-6 text-primary"
                aria-hidden="true"
              />
            ) : (
              <ImagePlus className="size-6 text-primary" aria-hidden="true" />
            )}
            <p className="text-xs font-semibold text-foreground">
              {remaining <= 0
                ? `Batas maksimal ${MAX_PRODUCT_IMAGES} foto tercapai`
                : dragging
                  ? "Lepaskan foto-foto untuk mengunggah ke Cloudflare R2..."
                  : "Seret beberapa foto ke sini atau klik untuk memilih banyak file"}
            </p>
            <p className="text-[11px] text-muted-foreground">
              JPG, PNG, WebP (otomatis dikonversi ke .webp) · Maks. 5 MB/foto ·
              Sisa slot: {remaining} foto
            </p>
          </>
        )}
      </div>

      {uploadError && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive"
        >
          <AlertCircle className="size-3.5 shrink-0 mt-0.5" aria-hidden="true" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Uploaded Images Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {images.map((img, idx) => (
            <div
              key={img.id}
              className={cn(
                "flex gap-3 rounded-lg border p-2.5 bg-card",
                idx === 0 ? "border-primary/50 bg-primary/5" : "border-border"
              )}
            >
              {/* Thumbnail */}
              <div className="relative size-20 shrink-0 overflow-hidden rounded-md border border-border bg-zinc-950">
                <Image
                  src={img.url}
                  alt={img.alt || `Foto produk ${idx + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
                <span className="absolute top-1 left-1 rounded bg-black/75 px-1.5 py-0.5 font-mono text-[10px] font-bold text-white">
                  #{idx + 1}
                </span>
              </div>

              {/* Meta & Actions */}
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1 flex-wrap">
                    {idx === 0 ? (
                      <Badge className="h-5 px-1.5 text-[10px] font-semibold">
                        Foto Utama
                      </Badge>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onSetPrimary(img.id)}
                        className="h-6 gap-1 px-2 text-[10px]"
                      >
                        <Star className="size-3" aria-hidden="true" />
                        <span>Utama</span>
                      </Button>
                    )}
                    {idx === 1 && (
                      <Badge
                        variant="secondary"
                        className="h-5 px-1.5 text-[10px]"
                      >
                        Hover
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-0.5 shrink-0">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      disabled={idx === 0}
                      onClick={() => onMove(img.id, "left")}
                      aria-label={`Geser foto ${idx + 1} ke kiri`}
                    >
                      <ArrowLeft className="size-3" aria-hidden="true" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      disabled={idx === images.length - 1}
                      onClick={() => onMove(img.id, "right")}
                      aria-label={`Geser foto ${idx + 1} ke kanan`}
                    >
                      <ArrowRight className="size-3" aria-hidden="true" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => onRemove(img.id)}
                      aria-label={`Hapus foto ${idx + 1}`}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="size-3" aria-hidden="true" />
                    </Button>
                  </div>
                </div>

                {/* Label Pills */}
                <div className="flex flex-wrap gap-1">
                  {IMAGE_LABEL_OPTIONS.map((lbl) => (
                    <button
                      key={lbl}
                      type="button"
                      onClick={() => onUpdateMeta(img.id, { label: lbl })}
                      className={cn(
                        "rounded border px-1.5 py-0.5 text-[10px] font-medium transition-colors",
                        img.label === lbl
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-muted/40 text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>

                {/* SEO Alt Text */}
                <Input
                  value={img.alt}
                  onChange={(e) =>
                    onUpdateMeta(img.id, { alt: e.target.value })
                  }
                  placeholder="Teks alt foto (untuk SEO)"
                  aria-label={`Teks alt foto ${idx + 1}`}
                  className="h-7 text-[11px] bg-background"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Optional Manual Bucket/Local URL Adder */}
      {remaining > 0 && (
        <div className="flex gap-2">
          <Input
            value={manualImageUrl}
            onChange={(e) => onManualImageUrlChange(e.target.value)}
            placeholder="Tambah URL bucket R2 (https://...) atau /images/..."
            aria-label="URL foto produk tambahan"
            className="h-9 font-mono text-xs"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onAddManualUrl}
            disabled={!manualImageUrl.trim()}
            className="h-9 gap-1 shrink-0 text-xs"
          >
            <Plus className="size-3.5" aria-hidden="true" />
            <span>Tambah URL</span>
          </Button>
        </div>
      )}

      {/* Optional Studio Presets */}
      {presets && presets.length > 0 && remaining > 0 && (
        <div className="space-y-1">
          <p className="text-[11px] text-muted-foreground">
            Atau tambahkan preset gambar lokal:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {presets.map((preset) => {
              const alreadyAdded = images.some((i) => i.url === preset.url);
              return (
                <button
                  key={preset.url}
                  type="button"
                  disabled={alreadyAdded}
                  onClick={() =>
                    onAddPreset(
                      preset.url,
                      preset.url.includes("beam-test")
                        ? "Pola Cahaya"
                        : undefined,
                      preset.label
                    )
                  }
                  className={cn(
                    "rounded-md border px-2 py-0.5 text-[11px] font-medium transition-colors",
                    alreadyAdded
                      ? "border-primary/40 bg-primary/10 text-primary opacity-75 cursor-default"
                      : "border-border bg-muted/50 text-muted-foreground hover:text-foreground"
                  )}
                >
                  {alreadyAdded ? `✓ ${preset.label}` : `+ ${preset.label}`}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
