"use client";

import * as React from "react";
import { AlertCircle, Loader2, Plus, Save } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ImageDropzone } from "@/components/admin/image-dropzone";
import { HERO_IMAGE_PRESETS } from "@/data/home-defaults";
import { STORE_CONFIG } from "@/config/store";
import {
  createHomeHighlight,
  updateHomeHighlight,
} from "@/lib/api/home-api";
import { getErrorMessage } from "@/lib/api/client";
import { parseNewlineList } from "@/lib/format";
import { validateHighlightInput } from "@/lib/validation/home";
import type { HomeHighlight, HomeHighlightInput } from "@/types/home";

const QUICK_CTA_LINKS = [
  { label: "Lampu LED", href: "/products?category=led-headlights" },
  { label: "Kokpit & CNC", href: "/products?category=controls-cockpit" },
  { label: "Semua Katalog", href: "/products" },
  { label: "Tentang Kami", href: "/about" },
  { label: "Shopee Resmi", href: STORE_CONFIG.officialShopeeUrl },
  { label: "TikTok Shop Resmi", href: STORE_CONFIG.officialTikTokShopUrl },
] as const;

interface HighlightFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  highlight: HomeHighlight | null;
  onSaved: (highlight: HomeHighlight, mode: "create" | "edit") => void;
}

export function HighlightFormDialog({
  open,
  onOpenChange,
  highlight,
  onSaved,
}: HighlightFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden gap-0">
        {open && (
          <HighlightFormInner
            key={highlight?.id ?? "new-highlight"}
            highlight={highlight}
            onClose={() => onOpenChange(false)}
            onSaved={onSaved}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function HighlightFormInner({
  highlight,
  onClose,
  onSaved,
}: {
  highlight: HomeHighlight | null;
  onClose: () => void;
  onSaved: (highlight: HomeHighlight, mode: "create" | "edit") => void;
}) {
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col max-h-[88vh]">
      <DialogHeader className="border-b border-border px-6 py-4 text-left">
        <DialogTitle className="text-lg font-bold">
          {isEdit ? "Edit Sorotan Beranda" : "Buat Sorotan Carousel Baru"}
        </DialogTitle>
        <DialogDescription className="text-xs">
          Sorotan aktif akan tampil sebagai slide pada Spotlight Carousel di
          halaman Beranda.
        </DialogDescription>
      </DialogHeader>

      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
        {error && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-xs font-medium text-destructive"
          >
            <AlertCircle
              className="size-4 shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="hl-badge" className="text-xs font-semibold">
              Label Badge *
            </Label>
            <Input
              id="hl-badge"
              required
              value={badge}
              onChange={(e) => setBadge(e.target.value.toUpperCase())}
              placeholder="mis. PROMO TERBARU · IP67"
              className="font-mono uppercase text-xs"
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 px-3.5 py-2">
            <div>
              <Label htmlFor="hl-active" className="text-xs font-semibold">
                Tampilkan di Carousel
              </Label>
              <p className="text-[11px] text-muted-foreground">
                Langsung aktif di halaman Beranda
              </p>
            </div>
            <Switch
              id="hl-active"
              checked={active}
              onCheckedChange={(checked) => setActive(Boolean(checked))}
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="hl-title" className="text-xs font-semibold">
              Judul Sorotan *
            </Label>
            <Input
              id="hl-title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="mis. Dirancang untuk Touring Malam & Hujan Deras."
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="hl-desc" className="text-xs font-semibold">
              Deskripsi *
            </Label>
            <Textarea
              id="hl-desc"
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan keunggulan fitur, promo, atau paket unggulan..."
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="hl-bullets" className="text-xs font-semibold">
              Poin Keunggulan (1 poin per baris, maks. 5)
            </Label>
            <Textarea
              id="hl-bullets"
              rows={3}
              value={bulletsText}
              onChange={(e) => setBulletsText(e.target.value)}
              placeholder={
                "Cahaya putih 6000K + kuning 3000K tembus kabut\nBodi aluminium CNC waterproof IP67\nSiap pasang dengan Kabel Relay 40A"
              }
            />
          </div>
        </div>

        <Separator />

        {/* CTA Button Config */}
        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="hl-cta-label" className="text-xs font-semibold">
                Teks Tombol CTA *
              </Label>
              <Input
                id="hl-cta-label"
                required
                value={ctaLabel}
                onChange={(e) => setCtaLabel(e.target.value)}
                placeholder="mis. Lihat Seri Lampu LED"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="hl-cta-href" className="text-xs font-semibold">
                Link Tujuan CTA *
              </Label>
              <Input
                id="hl-cta-href"
                required
                value={ctaHref}
                onChange={(e) => setCtaHref(e.target.value)}
                placeholder="/products?category=led-headlights atau https://..."
                className="font-mono text-xs"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-muted-foreground mr-1">
              Link cepat:
            </span>
            {QUICK_CTA_LINKS.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => setCtaHref(item.href)}
                className="rounded-md border border-border bg-muted/40 px-2 py-0.5 text-[11px] font-medium text-muted-foreground hover:text-foreground"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Drag & Drop Image Upload */}
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Gambar Banner Sorotan (Drag &amp; Drop)
          </p>
          <ImageDropzone
            value={imageUrl}
            onChange={setImageUrl}
            presets={HERO_IMAGE_PRESETS}
            label="Seret banner sorotan ke sini atau klik unggah"
            fallbackSrc="/images/prod-beam-test.svg"
            previewAspect="wide"
          />

          <div className="space-y-1.5">
            <Label htmlFor="hl-alt" className="text-xs font-semibold">
              Teks Alt Gambar (Aksesibilitas)
            </Label>
            <Input
              id="hl-alt"
              value={imageAlt}
              onChange={(e) => setImageAlt(e.target.value)}
              placeholder="Deskripsi singkat gambar..."
              className="text-xs"
            />
          </div>
        </div>
      </div>

      <DialogFooter className="mx-0 mb-0 rounded-b-xl border-t border-border bg-muted/40 px-6 py-3.5">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={submitting}
        >
          Batal
        </Button>
        <Button type="submit" disabled={submitting} className="gap-1.5">
          {submitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              <span>Menyimpan...</span>
            </>
          ) : isEdit ? (
            <>
              <Save className="size-4" aria-hidden="true" />
              <span>Simpan Sorotan</span>
            </>
          ) : (
            <>
              <Plus className="size-4" aria-hidden="true" />
              <span>Buat Sorotan</span>
            </>
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}
