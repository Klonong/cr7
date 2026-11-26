import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/server/admin-auth";
import { getLiveCatalogCategories } from "@/lib/server/category-service";
import { CategoryCreateView } from "@/components/admin/category-create-view";

export const metadata: Metadata = {
  title: "Buat Kategori Baru",
  robots: {
    index: false,
    follow: false,
  },
};

async function ProtectedCreateCategoryContent() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const existingCategories = await getLiveCatalogCategories();
  return (
    <CategoryCreateView
      existingCategories={existingCategories}
      username={session.username}
    />
  );
}

export default function AdminCreateCategoryPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
          Memuat Halaman Tambah Kategori...
        </div>
      }
    >
      <ProtectedCreateCategoryContent />
    </Suspense>
  );
}
