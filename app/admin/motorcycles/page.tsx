import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/server/admin-auth";
import { getLiveCatalogProducts } from "@/lib/server/catalog-service";
import { getLiveCatalogMotorcycles } from "@/lib/server/motorcycle-service";
import { MotorcyclesManager } from "@/components/admin/motorcycles-manager";

export const metadata: Metadata = {
  title: "Admin Tipe Motor",
  robots: { index: false, follow: false },
};

async function ProtectedMotorcyclesContent() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const [motorcycles, products] = await Promise.all([
    getLiveCatalogMotorcycles(),
    getLiveCatalogProducts(),
  ]);

  return (
    <MotorcyclesManager
      initialMotorcycles={motorcycles}
      products={products}
      username={session.username}
    />
  );
}

export default function AdminMotorcyclesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
          Memuat daftar motor...
        </div>
      }
    >
      <ProtectedMotorcyclesContent />
    </Suspense>
  );
}
