"use client";

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
import { useHighlightForm } from "@/hooks/admin/use-highlight-form";
import type { HomeHighlight } from "@/types/home";

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
  const form = useHighlightForm({ highlight, onClose, onSaved });

  return (
    <form onSubmit={form.handleSubmit} className="flex flex-col max-h-[88vh]">
      <DialogHeader className="border-b border-border px-6 py-4 text-left">
        <DialogTitle className="text-lg font-bold">
          {form.isEdit ? "Edit Sorotan Beranda" : "Buat Sorotan Carousel Baru"}
        </DialogTitle>
        <DialogDescription className="text-xs">
          Sorotan aktif akan tampil sebagai slide pada Spotlight Carousel di
          halaman Beranda.
        </DialogDescription>
      </DialogHeader>

      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
        {form.error && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-xs font-medium text-destructive"
          >
            <AlertCircle
              className="size-4 shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <span>{form.error}</span>
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
              value={form.badge}
              onChange={(e) => form.setBadge(e.target.value.toUpperCase())}
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
              checked={form.active}
              onCheckedChange={(checked) => form.setActive(Boolean(checked))}
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="hl-title" className="text-xs font-semibold">
              Judul Sorotan *
            </Label>
            <Input
              id="hl-title"
              required
              value={form.title}
              onChange={(e) => form.setTitle(e.target.value)}
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
              value={form.description}
              onChange={(e) => form.setDescription(e.target.value)}
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
              value={form.bulletsText}
              onChange={(e) => form.setBulletsText(e.target.value)}
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
                value={form.ctaLabel}
                onChange={(e) => form.setCtaLabel(e.target.value)}
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
                value={form.ctaHref}
                onChange={(e) => form.setCtaHref(e.target.value)}
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
                onClick={() => form.setCtaHref(item.href)}
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
            value={form.imageUrl}
            onChange={form.setImageUrl}
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
              value={form.imageAlt}
              onChange={(e) => form.setImageAlt(e.target.value)}
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
          disabled={form.submitting}
        >
          Batal
        </Button>
        <Button type="submit" disabled={form.submitting} className="gap-1.5">
          {form.submitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              <span>Menyimpan...</span>
            </>
          ) : form.isEdit ? (
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
