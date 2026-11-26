import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/server/admin-auth";
import { getLiveCatalogProducts } from "@/lib/server/catalog-service";
import { getLiveCatalogCategories } from "@/lib/server/category-service";
import { getLiveHomeContent } from "@/lib/server/home-service";
import { AdminOverview } from "@/components/admin/admin-overview";

export const metadata: Metadata = {
  title: "Dashboard Admin",
  robots: {
    index: false,
    follow: false,
  },
};

async function ProtectedAdminDashboard() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const [products, categories, homeContent] = await Promise.all([
    getLiveCatalogProducts(),
    getLiveCatalogCategories(),
    getLiveHomeContent(),
  ]);

  return (
    <AdminOverview
      products={products}
      categories={categories}
      homeContent={homeContent}
      username={session.username}
    />
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
          Memuat Dashboard Admin CR7 Racing...
        </div>
      }
    >
      <ProtectedAdminDashboard />
    </Suspense>
  );
}
