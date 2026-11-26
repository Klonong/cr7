"use client";

import Image from "next/image";
import {
  CheckCircle2,
  ExternalLink,
  Loader2,
  Pencil,
  Plus,
  Save,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminFeedbackBanner } from "@/components/admin/admin-feedback-banner";
import { HighlightFormDialog } from "@/components/admin/highlight-form-dialog";
import { ImageDropzone } from "@/components/admin/image-dropzone";
import { HERO_IMAGE_PRESETS } from "@/data/home-defaults";
import { useAdminHome } from "@/hooks/admin/use-admin-home";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/catalog";
import type { HomeContent, TrustIconName } from "@/types/home";

const TRUST_ICON_OPTIONS: { value: TrustIconName; label: string }[] = [
  { value: "shield", label: "Perisai (Original)" },
  { value: "truck", label: "Truk (Pengiriman / Checkout)" },
  { value: "gauge", label: "Gauge (Spesifikasi Teruji)" },
  { value: "award", label: "Penghargaan (Garansi)" },
  { value: "zap", label: "Petir (Daya LED)" },
  { value: "wrench", label: "Kunci Pas (Pemasangan)" },
];

interface HomeSettingsManagerProps {
  initialContent: HomeContent;
  products: Product[];
  username: string;
}

export function HomeSettingsManager({
  initialContent,
  products,
  username,
}: HomeSettingsManagerProps) {
  const home = useAdminHome(initialContent, products);
  const { hero, setHero, sections, setSections, trustPillars, updatePillar } =
    home;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AdminHeader username={username} />

      <div className="mx-auto w-full max-w-[1320px] flex-1 px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-primary">
              Pengaturan Tampilan Beranda
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Konten Beranda &amp; Sorotan Carousel
            </h1>
            <p className="text-sm text-muted-foreground">
              Buat slide sorotan carousel, atur banner hero, unggah gambar
              dengan drag &amp; drop, dan atur bagian yang tampil di beranda.
            </p>
          </div>

          <Button
            type="button"
            onClick={home.openCreateHighlight}
            className="h-11 min-h-[44px] gap-2 px-5 font-semibold self-start sm:self-auto"
          >
            <Plus className="size-4" aria-hidden="true" />
            <span>Buat Sorotan</span>
          </Button>
        </div>

        {/* Summary KPI Strip */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <Card className="rounded-lg border border-border bg-card p-4 ring-0 gap-1">
            <p className="text-xs font-medium text-muted-foreground">
              Total Slide Sorotan
            </p>
            <p className="font-mono text-2xl font-extrabold tabular-nums text-foreground">
              {home.content.highlights.length}
            </p>
          </Card>

          <Card className="rounded-lg border border-border bg-card p-4 ring-0 gap-1">
            <p className="text-xs font-medium text-muted-foreground">
              Aktif di Carousel
            </p>
            <p className="font-mono text-2xl font-extrabold tabular-nums text-status-success">
              {home.activeHighlightsCount}
            </p>
          </Card>

          <Card className="rounded-lg border border-border bg-card p-4 ring-0 gap-1">
            <p className="text-xs font-medium text-muted-foreground">
              Bagian Aktif
            </p>
            <p className="font-mono text-2xl font-extrabold tabular-nums text-foreground">
              {home.visibleSectionsCount} / 4
            </p>
          </Card>

          <Card className="rounded-lg border border-border bg-card p-4 ring-0 gap-1">
            <p className="text-xs font-medium text-muted-foreground">
              Batas Produk Unggulan
            </p>
            <p className="font-mono text-2xl font-extrabold tabular-nums text-foreground">
              {sections.featuredMaxItems} SKU
            </p>
          </Card>
        </div>

        <AdminFeedbackBanner
          feedback={home.feedback}
          onDismiss={home.clearFeedback}
        />

        {/* Main Tabbed Workspace */}
        <Tabs defaultValue="highlights" className="space-y-6">
          <TabsList className="h-10 p-1 w-full sm:w-auto justify-start">
            <TabsTrigger value="highlights" className="px-4">
              Sorotan Carousel ({home.content.highlights.length})
            </TabsTrigger>
            <TabsTrigger value="hero" className="px-4">
              Banner Hero
            </TabsTrigger>
            <TabsTrigger value="sections" className="px-4">
              Bagian &amp; Jaminan Toko
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: Highlights Carousel CRUD */}
          <TabsContent value="highlights" className="space-y-4">
            {home.content.highlights.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center">
                <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted text-primary">
                  <Sparkles className="size-5" aria-hidden="true" />
                </div>
                <h2 className="text-base font-semibold text-foreground">
                  Belum ada slide sorotan
                </h2>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  Tambahkan slide sorotan untuk menampilkan promo Shopee,
                  projector unggulan, atau paket touring di carousel beranda.
                </p>
                <Button
                  type="button"
                  onClick={home.openCreateHighlight}
                  className="mt-5 gap-1.5"
                >
                  <Plus className="size-4" aria-hidden="true" />
                  <span>Buat Sorotan Pertama</span>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {home.content.highlights.map((hl) => (
                  <Card
                    key={hl.id}
                    className={cn(
                      "flex flex-col overflow-hidden rounded-xl border border-border bg-card p-0 ring-0 gap-0",
                      !hl.active && "opacity-75"
                    )}
                  >
                    <div className="relative w-full overflow-hidden border-b border-border bg-zinc-950">
                      <AspectRatio ratio={16 / 9}>
                        <Image
                          src={hl.imageUrl}
                          alt={hl.imageAlt}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950/85 via-zinc-950/20 to-transparent" />
                      </AspectRatio>

                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                        <Badge className="bg-zinc-950/85 text-[#fefefe] border border-primary/50 font-mono text-[10px] backdrop-blur-sm max-w-[75%] truncate">
                          <Sparkles
                            className="size-3 mr-1 shrink-0 text-primary"
                            aria-hidden="true"
                          />
                          <span className="truncate">{hl.badge}</span>
                        </Badge>
                        <Badge
                          variant={hl.active ? "default" : "secondary"}
                          className="shrink-0 text-[10px] font-semibold shadow-xs"
                        >
                          {hl.active ? "Aktif" : "Disembunyikan"}
                        </Badge>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3">
                        <h2 className="line-clamp-2 text-base font-bold leading-snug text-white drop-shadow-xs">
                          {hl.title}
                        </h2>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col justify-between gap-4 p-4 sm:p-5 min-w-0">
                      <div className="space-y-3 min-w-0">
                        <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                          {hl.description}
                        </p>

                        {hl.bullets.length > 0 && (
                          <ul className="space-y-1.5">
                            {hl.bullets.slice(0, 3).map((bullet) => (
                              <li
                                key={bullet}
                                className="flex items-start gap-2 text-xs text-foreground/90 min-w-0"
                              >
                                <CheckCircle2
                                  className="size-3.5 shrink-0 mt-0.5 text-status-success"
                                  aria-hidden="true"
                                />
                                <span className="truncate">{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        )}

                        <div className="flex items-center gap-2 rounded-md border border-border bg-muted/40 px-2.5 py-1.5 text-[11px] min-w-0">
                          <span className="shrink-0 font-semibold text-foreground">
                            {hl.ctaLabel}
                          </span>
                          <span className="text-muted-foreground/60 shrink-0">
                            →
                          </span>
                          <span className="truncate font-mono text-muted-foreground">
                            {hl.ctaHref}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 border-t border-border bg-muted/30 px-4 py-3 sm:px-5">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={hl.active}
                          disabled={home.togglingId === hl.id}
                          onCheckedChange={(checked) =>
                            home.toggleHighlight(hl, Boolean(checked))
                          }
                          aria-label={`Ubah visibilitas ${hl.title}`}
                        />
                        <span className="text-xs font-medium text-muted-foreground">
                          {hl.active ? "Tampil di Carousel" : "Disembunyikan"}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => home.openEditHighlight(hl)}
                          className="h-8 gap-1.5 px-3 text-xs"
                        >
                          <Pencil className="size-3" aria-hidden="true" />
                          <span>Edit</span>
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => home.setDeletingHighlight(hl)}
                          aria-label={`Hapus ${hl.title}`}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="size-3.5" aria-hidden="true" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* TAB 2: Hero Banner & Flagship Spotlight */}
          <TabsContent value="hero">
            <form onSubmit={home.handleSaveSettings}>
              <Card className="rounded-xl border border-border bg-card p-6 ring-0 space-y-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
                  <div>
                    <h2 className="text-base font-bold text-foreground">
                      Banner Hero &amp; Produk Unggulan
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Mengatur teks utama, gambar hero (drag &amp; drop), dan
                      produk sorotan di bagian atas beranda.
                    </p>
                  </div>
                  <Button
                    type="submit"
                    disabled={home.savingSettings}
                    className="gap-1.5 self-start sm:self-auto"
                  >
                    {home.savingSettings ? (
                      <>
                        <Loader2
                          className="size-4 animate-spin"
                          aria-hidden="true"
                        />
                        <span>Menyimpan...</span>
                      </>
                    ) : (
                      <>
                        <Save className="size-4" aria-hidden="true" />
                        <span>Simpan Pengaturan</span>
                      </>
                    )}
                  </Button>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="hero-eyebrow"
                        className="text-xs font-semibold"
                      >
                        Label Atas Hero
                      </Label>
                      <Input
                        id="hero-eyebrow"
                        value={hero.eyebrow}
                        onChange={(e) =>
                          setHero((p) => ({ ...p, eyebrow: e.target.value }))
                        }
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label
                        htmlFor="hero-headline"
                        className="text-xs font-semibold"
                      >
                        Judul Utama Hero *
                      </Label>
                      <Input
                        id="hero-headline"
                        required
                        value={hero.headline}
                        onChange={(e) =>
                          setHero((p) => ({ ...p, headline: e.target.value }))
                        }
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="hero-sub" className="text-xs font-semibold">
                        Subjudul Hero *
                      </Label>
                      <Textarea
                        id="hero-sub"
                        required
                        rows={3}
                        value={hero.subheadline}
                        onChange={(e) =>
                          setHero((p) => ({
                            ...p,
                            subheadline: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="hero-cta-label"
                          className="text-xs font-semibold"
                        >
                          Teks Tombol Utama
                        </Label>
                        <Input
                          id="hero-cta-label"
                          required
                          value={hero.primaryCtaLabel}
                          onChange={(e) =>
                            setHero((p) => ({
                              ...p,
                              primaryCtaLabel: e.target.value,
                            }))
                          }
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label
                          htmlFor="hero-cta-href"
                          className="text-xs font-semibold"
                        >
                          Link Tombol Utama
                        </Label>
                        <Input
                          id="hero-cta-href"
                          required
                          value={hero.primaryCtaHref}
                          onChange={(e) =>
                            setHero((p) => ({
                              ...p,
                              primaryCtaHref: e.target.value,
                            }))
                          }
                          className="font-mono text-xs"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 p-3.5">
                      <div>
                        <Label
                          htmlFor="hero-stores"
                          className="text-xs font-semibold"
                        >
                          Tampilkan Tombol Shopee &amp; TikTok Shop di Hero
                        </Label>
                        <p className="text-[11px] text-muted-foreground">
                          Menampilkan tombol toko resmi di sebelah CTA utama
                        </p>
                      </div>
                      <Switch
                        id="hero-stores"
                        checked={hero.showOfficialStoreLinks}
                        onCheckedChange={(checked) =>
                          setHero((p) => ({
                            ...p,
                            showOfficialStoreLinks: Boolean(checked),
                          }))
                        }
                      />
                    </div>
                  </div>

                  {/* Right Column: Hero Image Dropzone & Flagship Spotlight */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold">
                        Gambar Banner Hero (Drag &amp; Drop)
                      </Label>
                      <ImageDropzone
                        value={hero.heroImageUrl}
                        onChange={(url) =>
                          setHero((p) => ({ ...p, heroImageUrl: url }))
                        }
                        presets={HERO_IMAGE_PRESETS}
                        label="Seret gambar hero ke sini atau klik unggah"
                        fallbackSrc="/images/hero-led.svg"
                        previewAspect="wide"
                      />
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <Label className="text-xs font-semibold">
                        Pilih Produk Sorotan Hero
                      </Label>
                      <Select
                        value={hero.spotlightProductSlug}
                        onValueChange={home.handlePickSpotlightProduct}
                      >
                        <SelectTrigger className="w-full h-10">
                          <SelectValue>
                            {home.selectedSpotlightProduct
                              ? `${home.selectedSpotlightProduct.sku} · ${home.selectedSpotlightProduct.name}`
                              : "Pilih produk dari katalog"}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((prod) => (
                            <SelectItem key={prod.id} value={prod.slug}>
                              {prod.sku} · {prod.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="space-y-1.5">
                          <Label
                            htmlFor="spot-tag"
                            className="text-xs font-semibold"
                          >
                            Label Sorotan
                          </Label>
                          <Input
                            id="spot-tag"
                            value={hero.spotlightTag}
                            onChange={(e) =>
                              setHero((p) => ({
                                ...p,
                                spotlightTag: e.target.value,
                              }))
                            }
                            className="font-mono text-xs"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label
                            htmlFor="spot-title"
                            className="text-xs font-semibold"
                          >
                            Judul Sorotan
                          </Label>
                          <Input
                            id="spot-title"
                            value={hero.spotlightTitle}
                            onChange={(e) =>
                              setHero((p) => ({
                                ...p,
                                spotlightTitle: e.target.value,
                              }))
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </form>
          </TabsContent>

          {/* TAB 3: Sections Visibility & Trust Strip */}
          <TabsContent value="sections">
            <form onSubmit={home.handleSaveSettings} className="space-y-6">
              <Card className="rounded-xl border border-border bg-card p-6 ring-0 space-y-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
                  <div>
                    <h2 className="text-base font-bold text-foreground">
                      Visibilitas Bagian &amp; Produk Unggulan
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Aktifkan atau sembunyikan bagian halaman beranda secara
                      instan.
                    </p>
                  </div>
                  <Button
                    type="submit"
                    disabled={home.savingSettings}
                    className="gap-1.5 self-start sm:self-auto"
                  >
                    {home.savingSettings ? (
                      <>
                        <Loader2
                          className="size-4 animate-spin"
                          aria-hidden="true"
                        />
                        <span>Menyimpan...</span>
                      </>
                    ) : (
                      <>
                        <Save className="size-4" aria-hidden="true" />
                        <span>Simpan Pengaturan</span>
                      </>
                    )}
                  </Button>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {(
                    [
                      {
                        key: "showTrustStrip",
                        label: "Baris Jaminan Toko",
                        desc: "4 kartu keunggulan di bawah hero",
                      },
                      {
                        key: "showBikeFitmentStrip",
                        label: "Filter Cepat Tipe Motor",
                        desc: "Pilihan cepat NMAX, PCX, Vario, ADV, dll.",
                      },
                      {
                        key: "showCategoriesGrid",
                        label: "Daftar Kategori Produk",
                        desc: "Kartu kategori aksesoris tanpa gambar",
                      },
                      {
                        key: "showHighlights",
                        label: "Spotlight Carousel Sorotan",
                        desc: "Menampilkan slide sorotan aktif dari Tab 1",
                      },
                    ] as const
                  ).map((toggle) => (
                    <div
                      key={toggle.key}
                      className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/35 p-3.5"
                    >
                      <div>
                        <Label
                          htmlFor={`sec-${toggle.key}`}
                          className="text-xs font-semibold"
                        >
                          {toggle.label}
                        </Label>
                        <p className="text-[11px] text-muted-foreground">
                          {toggle.desc}
                        </p>
                      </div>
                      <Switch
                        id={`sec-${toggle.key}`}
                        checked={sections[toggle.key]}
                        onCheckedChange={(checked) =>
                          setSections((prev) => ({
                            ...prev,
                            [toggle.key]: Boolean(checked),
                          }))
                        }
                      />
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="feat-eyebrow"
                      className="text-xs font-semibold"
                    >
                      Label Atas Produk Unggulan
                    </Label>
                    <Input
                      id="feat-eyebrow"
                      value={sections.featuredSectionEyebrow}
                      onChange={(e) =>
                        setSections((p) => ({
                          ...p,
                          featuredSectionEyebrow: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="feat-title" className="text-xs font-semibold">
                      Judul Produk Unggulan
                    </Label>
                    <Input
                      id="feat-title"
                      value={sections.featuredSectionTitle}
                      onChange={(e) =>
                        setSections((p) => ({
                          ...p,
                          featuredSectionTitle: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="feat-max" className="text-xs font-semibold">
                      Maksimal Produk Tampil
                    </Label>
                    <Select
                      value={String(sections.featuredMaxItems)}
                      onValueChange={(val) => {
                        if (val) {
                          setSections((p) => ({
                            ...p,
                            featuredMaxItems: Number(val),
                          }));
                        }
                      }}
                    >
                      <SelectTrigger id="feat-max" className="w-full h-9">
                        <SelectValue>
                          {sections.featuredMaxItems} Produk
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="4">4 Produk</SelectItem>
                        <SelectItem value="8">8 Produk</SelectItem>
                        <SelectItem value="12">12 Produk</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5 sm:col-span-3">
                    <Label htmlFor="feat-sub" className="text-xs font-semibold">
                      Subjudul Produk Unggulan
                    </Label>
                    <Input
                      id="feat-sub"
                      value={sections.featuredSectionSubtitle}
                      onChange={(e) =>
                        setSections((p) => ({
                          ...p,
                          featuredSectionSubtitle: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </Card>

              {/* Editable 4 Trust Pillars */}
              <Card className="rounded-xl border border-border bg-card p-6 ring-0 space-y-4">
                <div>
                  <h2 className="text-base font-bold text-foreground">
                    Kartu Jaminan Toko (4 Poin)
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Ubah ikon, judul, dan deskripsi singkat pada baris jaminan
                    di bawah hero.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {trustPillars.map((pillar, idx) => {
                    const iconMeta = TRUST_ICON_OPTIONS.find(
                      (i) => i.value === pillar.icon
                    );
                    return (
                      <div
                        key={pillar.id}
                        className="rounded-lg border border-border bg-muted/25 p-4 space-y-3"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-xs font-semibold text-primary">
                            Poin #{idx + 1}
                          </span>
                          <Select
                            value={pillar.icon}
                            onValueChange={(val) => {
                              if (val) {
                                updatePillar(pillar.id, {
                                  icon: val as TrustIconName,
                                });
                              }
                            }}
                          >
                            <SelectTrigger className="h-8 w-[185px] text-xs bg-card">
                              <SelectValue>
                                {iconMeta?.label ?? pillar.icon}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {TRUST_ICON_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-1.5">
                          <Label
                            htmlFor={`pillar-title-${pillar.id}`}
                            className="text-xs font-semibold"
                          >
                            Judul
                          </Label>
                          <Input
                            id={`pillar-title-${pillar.id}`}
                            value={pillar.title}
                            onChange={(e) =>
                              updatePillar(pillar.id, { title: e.target.value })
                            }
                            className="bg-card"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label
                            htmlFor={`pillar-desc-${pillar.id}`}
                            className="text-xs font-semibold"
                          >
                            Deskripsi
                          </Label>
                          <Textarea
                            id={`pillar-desc-${pillar.id}`}
                            rows={2}
                            value={pillar.description}
                            onChange={(e) =>
                              updatePillar(pillar.id, {
                                description: e.target.value,
                              })
                            }
                            className="bg-card text-xs"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </form>
          </TabsContent>
        </Tabs>

        <div className="flex items-center justify-end text-xs text-muted-foreground pt-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-medium hover:text-foreground"
          >
            <span>Buka halaman beranda toko untuk melihat hasil</span>
            <ExternalLink className="size-3" aria-hidden="true" />
          </a>
        </div>
      </div>

      {/* Create / Edit Highlight Dialog */}
      <HighlightFormDialog
        open={home.highlightDialogOpen}
        onOpenChange={home.setHighlightDialogOpen}
        highlight={home.editingHighlight}
        onSaved={home.applySavedHighlight}
      />

      {/* Delete Highlight Confirmation */}
      <AlertDialog
        open={Boolean(home.deletingHighlight)}
        onOpenChange={(open) => {
          if (!open) home.setDeletingHighlight(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus sorotan ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Sorotan{" "}
              <strong className="text-foreground">
                {home.deletingHighlight?.title}
              </strong>{" "}
              akan dihapus dari carousel beranda.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={home.deleting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={home.confirmDeleteHighlight}
              disabled={home.deleting}
            >
              {home.deleting ? "Menghapus..." : "Hapus Sorotan"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
