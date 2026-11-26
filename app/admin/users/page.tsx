import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/server/admin-auth";
import { adminUserRepository } from "@/lib/server/admin-user-repository";
import { isDatabaseUnavailableError } from "@/lib/server/prisma";
import { AdminUsersManager } from "@/components/admin/admin-users-manager";
import type { AdminUserPublic } from "@/interface/api";

export const metadata: Metadata = {
  title: "Kelola Akun Admin",
  robots: {
    index: false,
    follow: false,
  },
};

async function ProtectedAdminUsersContent() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  let users: AdminUserPublic[] = [];
  try {
    users = await adminUserRepository.findAllPublic();
  } catch (err) {
    if (!isDatabaseUnavailableError(err)) {
      throw err;
    }
  }

  return (
    <AdminUsersManager
      initialUsers={users}
      currentUserId={session.userId}
      currentUsername={session.username}
      currentRole={session.role}
    />
  );
}

export default function AdminUsersPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
          Memuat Daftar Akun Admin...
        </div>
      }
    >
      <ProtectedAdminUsersContent />
    </Suspense>
  );
}
