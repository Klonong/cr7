import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/server/admin-auth";
import { getLiveCatalogProducts } from "@/lib/server/catalog-service";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export const metadata: Metadata = {
  title: "Catalog Admin Console",
  robots: {
    index: false,
    follow: false,
  },
};

async function ProtectedAdminContent() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const products = await getLiveCatalogProducts();
  return (
    <AdminDashboard initialProducts={products} username={session.username} />
  );
}

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
          Loading CR7 MOTO Admin Console...
        </div>
      }
    >
      <ProtectedAdminContent />
    </Suspense>
  );
}
