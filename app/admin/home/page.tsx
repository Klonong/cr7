import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/server/admin-auth";
import { getLiveCatalogProducts } from "@/lib/server/catalog-service";
import { getLiveHomeContent } from "@/lib/server/home-service";
import { HomeSettingsManager } from "@/components/admin/home-settings-manager";

export const metadata: Metadata = {
  title: "Pengaturan Beranda & Sorotan",
  robots: {
    index: false,
    follow: false,
  },
};

async function ProtectedAdminHomeContent() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const [homeContent, products] = await Promise.all([
    getLiveHomeContent(),
    getLiveCatalogProducts(),
  ]);

  return (
    <HomeSettingsManager
      initialContent={homeContent}
      products={products}
      username={session.username}
    />
  );
}

export default function AdminHomeSettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
          Memuat Pengaturan Beranda &amp; Sorotan...
        </div>
      }
    >
      <ProtectedAdminHomeContent />
    </Suspense>
  );
}
