"use client";

import { AlertCircle, Loader2, Save } from "lucide-react";
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
import { useCategoryEditForm } from "@/hooks/admin/use-category-form";
import type { Category } from "@/interface/catalog";

interface CategoryEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
  onSaved: (category: Category, mode: "create" | "edit") => void;
}

export function CategoryEditDialog({
  open,
  onOpenChange,
  category,
  onSaved,
}: CategoryEditDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden gap-0">
        {open && category && (
          <CategoryEditFormInner
            key={category.slug}
            category={category}
            onClose={() => onOpenChange(false)}
            onSaved={onSaved}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function CategoryEditFormInner({
  category,
  onClose,
  onSaved,
}: {
  category: Category;
  onClose: () => void;
  onSaved: (category: Category, mode: "create" | "edit") => void;
}) {
  const form = useCategoryEditForm({ category, onClose, onSaved });

  return (
    <form onSubmit={form.handleSubmit} className="flex flex-col">
      <DialogHeader className="border-b border-border px-6 py-4 text-left">
        <DialogTitle className="text-lg font-bold">
          Edit Kategori · {category.shortName}
        </DialogTitle>
        <DialogDescription className="font-mono text-xs">
          Slug: {category.slug} (dikunci agar link produk tetap aman)
        </DialogDescription>
      </DialogHeader>

      <div className="px-6 py-5 space-y-4">
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

        <div className="space-y-1.5">
          <Label htmlFor="edit-cat-name" className="text-xs font-semibold">
            Nama Lengkap Kategori *
          </Label>
          <Input
            id="edit-cat-name"
            required
            value={form.name}
            onChange={(e) => form.setName(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="edit-cat-short" className="text-xs font-semibold">
            Label Singkat *
          </Label>
          <Input
            id="edit-cat-short"
            required
            maxLength={22}
            value={form.shortName}
            onChange={(e) => form.setShortName(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="edit-cat-desc" className="text-xs font-semibold">
            Deskripsi Singkat *
          </Label>
          <Textarea
            id="edit-cat-desc"
            required
            rows={3}
            maxLength={140}
            value={form.description}
            onChange={(e) => form.setDescription(e.target.value)}
          />
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
          ) : (
            <>
              <Save className="size-4" aria-hidden="true" />
              <span>Simpan Perubahan</span>
            </>
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}
