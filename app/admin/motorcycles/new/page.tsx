import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/server/admin-auth";
import { getLiveCatalogMotorcycles } from "@/lib/server/motorcycle-service";
import { MotorcycleCreateView } from "@/components/admin/motorcycle-create-view";

export const metadata: Metadata = {
  title: "Tambah Tipe Motor Baru",
  robots: { index: false, follow: false },
};

async function ProtectedCreateMotorcycleContent() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const existingMotorcycles = await getLiveCatalogMotorcycles();
  return (
    <MotorcycleCreateView
      existingMotorcycles={existingMotorcycles}
      username={session.username}
    />
  );
}

export default function AdminCreateMotorcyclePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
          Memuat halaman tambah motor...
        </div>
      }
    >
      <ProtectedCreateMotorcycleContent />
    </Suspense>
  );
}
