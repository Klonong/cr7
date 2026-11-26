"use client";

import { AlertCircle, Layers, Loader2, Plus, Save, Trash2 } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ShopeeIcon,
  TikTokShopIcon,
} from "@/components/icons/marketplace-icons";
import { ImageDropzone } from "@/components/admin/image-dropzone";
import {
  DEFAULT_PRODUCT_IMAGE,
  PRODUCT_BADGES,
  PRODUCT_IMAGE_PRESETS,
} from "@/config/store";
import { useProductForm } from "@/hooks/admin/use-product-form";
import type {
  Category,
  CategorySlug,
  Motorcycle,
  Product,
} from "@/interface/catalog";

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  categories: Category[];
  motorcycles: Motorcycle[];
  onSaved: (product: Product, mode: "create" | "edit") => void;
}

export function ProductFormDialog({
  open,
  onOpenChange,
  product,
  categories,
  motorcycles,
  onSaved,
}: ProductFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden gap-0">
        {open && (
          <ProductFormInner
            key={product?.id ?? "new-product"}
            product={product}
            categories={categories}
            motorcycles={motorcycles}
            onClose={() => onOpenChange(false)}
            onSaved={onSaved}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function ProductFormInner({
  product,
  categories,
  motorcycles,
  onClose,
  onSaved,
}: {
  product: Product | null;
  categories: Category[];
  motorcycles: Motorcycle[];
  onClose: () => void;
  onSaved: (product: Product, mode: "create" | "edit") => void;
}) {
  const form = useProductForm({ product, categories, onClose, onSaved });

  return (
    <form onSubmit={form.handleSubmit} className="flex flex-col max-h-[88vh]">
      <DialogHeader className="border-b border-border px-6 py-4 text-left">
        <DialogTitle className="text-lg font-bold">
          {form.isEdit
            ? `Edit Produk · ${product?.sku}`
            : "Tambah Produk Aksesori Baru"}
        </DialogTitle>
        <DialogDescription className="text-xs">
          {form.isEdit
            ? "Perbarui detail produk, pilihan varian, foto, harga, atau link Shopee / TikTok Shop."
            : "Tambahkan produk aksesori motor baru ke katalog CR7 Racing."}
        </DialogDescription>
      </DialogHeader>

      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
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

        {/* Section 1: Informasi Dasar */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="pf-name" className="text-xs font-semibold">
              Nama Produk *
            </Label>
            <Input
              id="pf-name"
              required
              value={form.name}
              onChange={(e) => form.handleNameChange(e.target.value)}
              placeholder="mis. CR7 Racing SQL 3 Mata Laser 60W"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="pf-sku" className="text-xs font-semibold">
              Kode SKU *
            </Label>
            <Input
              id="pf-sku"
              required
              value={form.sku}
              onChange={(e) => form.setSku(e.target.value.toUpperCase())}
              placeholder="mis. CR7-SQL3-60W"
              className="font-mono uppercase"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="pf-slug" className="text-xs font-semibold">
              URL Slug
            </Label>
            <Input
              id="pf-slug"
              value={form.slug}
              onChange={(e) => form.handleSlugChange(e.target.value)}
              placeholder="otomatis-dari-nama"
              className="font-mono text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="pf-category" className="text-xs font-semibold">
              Kategori *
            </Label>
            <Select
              value={form.category}
              onValueChange={(val) => {
                if (val) form.setCategory(val as CategorySlug);
              }}
            >
              <SelectTrigger id="pf-category" className="w-full h-9">
                <SelectValue>
                  {form.selectedCategoryObj?.name ?? form.category}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.slug} value={c.slug}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="space-y-1.5">
              <Label htmlFor="pf-price" className="text-xs font-semibold">
                Harga (IDR) *
              </Label>
              <Input
                id="pf-price"
                type="number"
                min={1}
                required
                value={form.price}
                onChange={(e) => form.setPrice(e.target.value)}
                placeholder="245000"
                className="font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="pf-orig-price" className="text-xs font-semibold">
                Harga Coret
              </Label>
              <Input
                id="pf-orig-price"
                type="number"
                min={0}
                value={form.originalPrice}
                onChange={(e) => form.setOriginalPrice(e.target.value)}
                placeholder="295000"
                className="font-mono"
              />
            </div>
          </div>
        </div>

        {/* Status Toggles */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 rounded-lg border border-border bg-muted/40 p-3.5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <Label htmlFor="pf-instock" className="text-xs font-semibold">
                Stok Tersedia
              </Label>
              <p className="text-[11px] text-muted-foreground">
                Tampilkan tombol beli Shopee / TikTok aktif
              </p>
            </div>
            <Switch
              id="pf-instock"
              checked={form.inStock}
              onCheckedChange={(checked) => form.setInStock(Boolean(checked))}
            />
          </div>

          <div className="flex items-center justify-between gap-3">
            <div>
              <Label htmlFor="pf-featured" className="text-xs font-semibold">
                Tampilkan di Beranda
              </Label>
              <p className="text-[11px] text-muted-foreground">
                Masuk daftar Aksesori Unggulan
              </p>
            </div>
            <Switch
              id="pf-featured"
              checked={form.featured}
              onCheckedChange={(checked) => form.setFeatured(Boolean(checked))}
            />
          </div>
        </div>

        <Separator />

        {/* Section 2: Varian Produk */}
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Layers className="size-3.5 text-primary" aria-hidden="true" />
                <span>Varian Produk ({form.variants.length})</span>
              </p>
              <p className="text-[11px] text-muted-foreground">
                Tambahkan varian warna, ukuran, atau paket bundling.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={form.handleAddVariant}
              className="h-8 gap-1 text-xs"
            >
              <Plus className="size-3.5" aria-hidden="true" />
              <span>Tambah Varian</span>
            </Button>
          </div>

          {form.variants.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border bg-muted/20 px-4 py-4 text-center text-xs text-muted-foreground">
              Belum ada varian. Klik <strong>Tambah Varian</strong> untuk
              menambahkan pilihan warna atau tipe.
            </div>
          ) : (
            <div className="space-y-2.5">
              {form.variants.map((v, idx) => (
                <div
                  key={v.id}
                  className="rounded-lg border border-border bg-muted/25 p-3 space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[11px] font-semibold text-primary">
                      Varian #{idx + 1}
                    </span>
                    <div className="flex items-center gap-3">
                      <label className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <Switch
                          size="sm"
                          checked={v.inStock}
                          onCheckedChange={(checked) =>
                            form.handleUpdateVariant(v.id, {
                              inStock: Boolean(checked),
                            })
                          }
                        />
                        <span>{v.inStock ? "Ready" : "Habis"}</span>
                      </label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => form.handleRemoveVariant(v.id)}
                        aria-label={`Hapus varian ${idx + 1}`}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="size-3.5" aria-hidden="true" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-12">
                    <div className="sm:col-span-5">
                      <Input
                        value={v.name}
                        onChange={(e) =>
                          form.handleUpdateVariant(v.id, {
                            name: e.target.value,
                          })
                        }
                        placeholder="Nama varian (mis. Putih - Kuning)"
                        className="h-8 text-xs bg-card"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <Input
                        value={v.sku}
                        onChange={(e) =>
                          form.handleUpdateVariant(v.id, {
                            sku: e.target.value.toUpperCase(),
                          })
                        }
                        placeholder="SKU Varian"
                        className="h-8 font-mono text-xs bg-card uppercase"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <Input
                        type="number"
                        min={0}
                        value={v.price}
                        onChange={(e) =>
                          form.handleUpdateVariant(v.id, {
                            price: e.target.value,
                          })
                        }
                        placeholder="Harga (IDR)"
                        className="h-8 font-mono text-xs bg-card"
                      />
                    </div>
                    <div className="sm:col-span-1 flex items-center">
                      <input
                        type="color"
                        value={v.colorHex || "#CA0C1F"}
                        onChange={(e) =>
                          form.handleUpdateVariant(v.id, {
                            colorHex: e.target.value,
                          })
                        }
                        title="Warna indikator varian"
                        aria-label="Warna indikator varian"
                        className="h-8 w-full cursor-pointer rounded border border-border bg-card p-0.5"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Separator />

        {/* Section 3: Link Marketplace */}
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Link Toko Resmi (Shopee &amp; TikTok Shop)
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label
                htmlFor="pf-shopee"
                className="flex items-center gap-1.5 text-xs font-semibold"
              >
                <ShopeeIcon className="size-3.5 text-shopee" />
                <span>Link Produk Shopee</span>
              </Label>
              <Input
                id="pf-shopee"
                type="url"
                value={form.shopeeUrl}
                onChange={(e) => form.setShopeeUrl(e.target.value)}
                placeholder="https://shopee.co.id/..."
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="pf-tiktok"
                className="flex items-center gap-1.5 text-xs font-semibold"
              >
                <TikTokShopIcon className="size-3.5" />
                <span>Link Produk TikTok Shop</span>
              </Label>
              <Input
                id="pf-tiktok"
                type="url"
                value={form.tiktokUrl}
                onChange={(e) => form.setTiktokUrl(e.target.value)}
                placeholder="https://shop.tiktok.com/..."
                className="text-xs"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Section 4: Upload Gambar Drag & Drop */}
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Foto Produk (Drag &amp; Drop)
          </p>
          <ImageDropzone
            value={form.imageUrl}
            onChange={form.setImageUrl}
            presets={PRODUCT_IMAGE_PRESETS}
            label="Seret foto produk ke sini atau klik untuk unggah"
            fallbackSrc={DEFAULT_PRODUCT_IMAGE}
          />

          <div className="flex items-center justify-between rounded-md border border-border/70 px-3 py-2">
            <Label htmlFor="pf-beam" className="text-xs text-muted-foreground">
              Sertakan gambar Tes Pola Cahaya sebagai foto kedua saat di-hover
            </Label>
            <Switch
              id="pf-beam"
              size="sm"
              checked={form.includeBeamImage}
              onCheckedChange={(checked) =>
                form.setIncludeBeamImage(Boolean(checked))
              }
            />
          </div>
        </div>

        <Separator />

        {/* Section 5: Spesifikasi, Label & Kecocokan Motor */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="pf-short-specs" className="text-xs font-semibold">
              Ringkasan Spesifikasi (pisahkan dengan koma, maks. 3)
            </Label>
            <Input
              id="pf-short-specs"
              value={form.shortSpecsText}
              onChange={(e) => form.setShortSpecsText(e.target.value)}
              placeholder="60W Real, 3000K / 6000K, IP67"
              className="font-mono text-xs"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold">Label Highlight</Label>
            <div className="flex flex-wrap gap-1.5">
              {PRODUCT_BADGES.map((badge) => {
                const active = form.badges.includes(badge);
                return (
                  <button
                    key={badge}
                    type="button"
                    onClick={() => form.toggleBadge(badge)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-muted/40 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {badge}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold">Motor Kompatibel</Label>
            <div className="flex flex-wrap gap-1.5">
              {motorcycles.map((moto) => {
                const active = form.compatibility.includes(moto.name);
                return (
                  <button
                    key={moto.id}
                    type="button"
                    onClick={() => form.toggleBike(moto.name)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                      active
                        ? "border-primary bg-primary/15 text-primary"
                        : "border-border bg-muted/40 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {moto.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="pf-desc" className="text-xs font-semibold">
              Deskripsi Produk
            </Label>
            <Textarea
              id="pf-desc"
              rows={3}
              value={form.description}
              onChange={(e) => form.setDescription(e.target.value)}
              placeholder="Jelaskan keunggulan cahaya, material CNC, dan manfaat produk..."
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="pf-specs" className="text-xs font-semibold">
                Spesifikasi Teknis (Nama: Nilai per baris)
              </Label>
              <Textarea
                id="pf-specs"
                rows={4}
                value={form.fullSpecsText}
                onChange={(e) => form.setFullSpecsText(e.target.value)}
                placeholder={
                  "Daya Output: 60W\nTegangan Input: DC 12V-24V\nKetahanan Air: IP67"
                }
                className="font-mono text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="pf-box" className="text-xs font-semibold">
                Isi Paket (1 item per baris)
              </Label>
              <Textarea
                id="pf-box"
                rows={4}
                value={form.inTheBoxText}
                onChange={(e) => form.setInTheBoxText(e.target.value)}
                placeholder={
                  "1x Lampu Tembak CR7 Racing\n1x Breket U Stainless\n1x Kartu Garansi"
                }
                className="text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="pf-fitment" className="text-xs font-semibold">
              Catatan Pemasangan &amp; Kecocokan
            </Label>
            <Textarea
              id="pf-fitment"
              rows={2}
              value={form.fitmentNotes}
              onChange={(e) => form.setFitmentNotes(e.target.value)}
              placeholder="mis. Wajib arus DC 12V, disarankan memakai Relay Set 40A."
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
              <span>Simpan Perubahan</span>
            </>
          ) : (
            <>
              <Plus className="size-4" aria-hidden="true" />
              <span>Tambah Produk</span>
            </>
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}
