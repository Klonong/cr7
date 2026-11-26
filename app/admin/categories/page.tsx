import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/server/admin-auth";
import { getLiveCatalogProducts } from "@/lib/server/catalog-service";
import { getLiveCatalogCategories } from "@/lib/server/category-service";
import { CategoriesManager } from "@/components/admin/categories-manager";

export const metadata: Metadata = {
  title: "Kelola Kategori Admin",
  robots: {
    index: false,
    follow: false,
  },
};

async function ProtectedAdminCategoriesContent() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const [categories, products] = await Promise.all([
    getLiveCatalogCategories(),
    getLiveCatalogProducts(),
  ]);

  return (
    <CategoriesManager
      initialCategories={categories}
      products={products}
      username={session.username}
    />
  );
}

export default function AdminCategoriesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
          Memuat Daftar Kategori...
        </div>
      }
    >
      <ProtectedAdminCategoriesContent />
    </Suspense>
  );
}
