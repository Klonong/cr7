import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/server/admin-auth";
import { getLiveCatalogProducts } from "@/lib/server/catalog-service";
import { getLiveCatalogCategories } from "@/lib/server/category-service";
import { getLiveCatalogMotorcycles } from "@/lib/server/motorcycle-service";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export const metadata: Metadata = {
  title: "Admin Produk Katalog",
  robots: {
    index: false,
    follow: false,
  },
};

async function ProtectedAdminProductsContent() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const [products, categories, motorcycles] = await Promise.all([
    getLiveCatalogProducts(),
    getLiveCatalogCategories(),
    getLiveCatalogMotorcycles(),
  ]);
  return (
    <AdminDashboard
      initialProducts={products}
      categories={categories}
      motorcycles={motorcycles}
      username={session.username}
    />
  );
}

export default function AdminProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
          Memuat daftar produk katalog...
        </div>
      }
    >
      <ProtectedAdminProductsContent />
    </Suspense>
  );
}
