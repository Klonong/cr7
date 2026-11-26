"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  createAdminUser,
  deleteAdminUser,
  updateAdminUser,
} from "@/lib/api/admin-user-api";
import { getErrorMessage } from "@/lib/api/client";
import {
  validateAdminUserCreate,
  validateAdminUserUpdate,
} from "@/lib/validation/admin-user";
import type { AdminRole, AdminUserPublic } from "@/interface/api";
import type { AdminFeedback } from "@/interface/hooks";

const ID_DATE_FORMATTER = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export function formatAdminDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "-";
  return ID_DATE_FORMATTER.format(date);
}

export function useAdminUsers(
  initialUsers: AdminUserPublic[],
  currentUserId: string
) {
  const router = useRouter();

  const [users, setUsers] = React.useState<AdminUserPublic[]>(initialUsers);
  const [search, setSearch] = React.useState("");
  const [feedback, setFeedback] = React.useState<AdminFeedback | null>(null);

  // Create Admin Dialog state
  const [createOpen, setCreateOpen] = React.useState(false);
  const [createUsername, setCreateUsername] = React.useState("");
  const [createPassword, setCreatePassword] = React.useState("");
  const [createRole, setCreateRole] = React.useState<AdminRole>("ADMIN");
  const [createError, setCreateError] = React.useState<string | null>(null);
  const [creating, setCreating] = React.useState(false);

  // Change / Reset Password Dialog state
  const [passwordTarget, setPasswordTarget] =
    React.useState<AdminUserPublic | null>(null);
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [passwordError, setPasswordError] = React.useState<string | null>(null);
  const [savingPassword, setSavingPassword] = React.useState(false);

  // Per-row action & Delete Dialog state
  const [busyUserId, setBusyUserId] = React.useState<string | null>(null);
  const [deletingUser, setDeletingUser] =
    React.useState<AdminUserPublic | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const filteredUsers = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) =>
      `${u.username} ${u.role} ${u.isActive ? "aktif" : "nonaktif"}`
        .toLowerCase()
        .includes(q)
    );
  }, [users, search]);

  const activeCount = React.useMemo(
    () => users.filter((u) => u.isActive).length,
    [users]
  );

  const superAdminCount = React.useMemo(
    () => users.filter((u) => u.role === "SUPER_ADMIN" && u.isActive).length,
    [users]
  );

  const currentUser = React.useMemo(
    () => users.find((u) => u.id === currentUserId) ?? null,
    [users, currentUserId]
  );

  const dismissFeedback = React.useCallback(() => setFeedback(null), []);

  const openCreateDialog = React.useCallback(() => {
    setCreateUsername("");
    setCreatePassword("");
    setCreateRole("ADMIN");
    setCreateError(null);
    setCreateOpen(true);
  }, []);

  const closeCreateDialog = React.useCallback(() => {
    if (creating) return;
    setCreateOpen(false);
    setCreateError(null);
  }, [creating]);

  const handleCreateSubmit = React.useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setCreateError(null);

      const validated = validateAdminUserCreate({
        username: createUsername,
        password: createPassword,
        role: createRole,
      });

      if (!validated.ok) {
        setCreateError(validated.error);
        return;
      }

      setCreating(true);
      try {
        const created = await createAdminUser(validated.data);
        setUsers((prev) => [...prev, created]);
        setCreateOpen(false);
        setFeedback({
          type: "success",
          message: `Akun admin "${created.username}" (${created.role === "SUPER_ADMIN" ? "Super Admin" : "Admin"}) berhasil ditambahkan ke database.`,
        });
        router.refresh();
      } catch (err) {
        setCreateError(
          getErrorMessage(err, "Gagal membuat akun admin baru.")
        );
      } finally {
        setCreating(false);
      }
    },
    [createUsername, createPassword, createRole, router]
  );

  const openPasswordDialog = React.useCallback((user: AdminUserPublic) => {
    setPasswordTarget(user);
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError(null);
  }, []);

  const closePasswordDialog = React.useCallback(() => {
    if (savingPassword) return;
    setPasswordTarget(null);
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError(null);
  }, [savingPassword]);

  const handlePasswordSubmit = React.useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!passwordTarget) return;
      setPasswordError(null);

      if (newPassword !== confirmPassword) {
        setPasswordError("Konfirmasi password tidak cocok.");
        return;
      }

      const validated = validateAdminUserUpdate({ password: newPassword });
      if (!validated.ok) {
        setPasswordError(validated.error);
        return;
      }

      setSavingPassword(true);
      try {
        const updated = await updateAdminUser(
          passwordTarget.id,
          validated.data
        );
        setUsers((prev) =>
          prev.map((u) => (u.id === updated.id ? updated : u))
        );
        setPasswordTarget(null);
        setNewPassword("");
        setConfirmPassword("");
        setFeedback({
          type: "success",
          message:
            passwordTarget.id === currentUserId
              ? "Password akun Anda berhasil diperbarui dan sesi lama telah dicabut."
              : `Password akun "${updated.username}" berhasil direset dan semua sesi lama dicabut.`,
        });
        router.refresh();
      } catch (err) {
        setPasswordError(getErrorMessage(err, "Gagal memperbarui password."));
      } finally {
        setSavingPassword(false);
      }
    },
    [passwordTarget, newPassword, confirmPassword, currentUserId, router]
  );

  const handleToggleActive = React.useCallback(
    async (user: AdminUserPublic, nextActive: boolean) => {
      setBusyUserId(user.id);
      try {
        const updated = await updateAdminUser(user.id, {
          isActive: nextActive,
        });
        setUsers((prev) =>
          prev.map((u) => (u.id === updated.id ? updated : u))
        );
        setFeedback({
          type: "success",
          message: nextActive
            ? `Akun "${updated.username}" berhasil diaktifkan kembali.`
            : `Akun "${updated.username}" dinonaktifkan dan sesi JWT-nya langsung dicabut.`,
        });
        router.refresh();
      } catch (err) {
        setFeedback({
          type: "error",
          message: getErrorMessage(err, "Gagal mengubah status akun admin."),
        });
      } finally {
        setBusyUserId(null);
      }
    },
    [router]
  );

  const handleToggleRole = React.useCallback(
    async (user: AdminUserPublic) => {
      const nextRole: AdminRole =
        user.role === "SUPER_ADMIN" ? "ADMIN" : "SUPER_ADMIN";
      setBusyUserId(user.id);
      try {
        const updated = await updateAdminUser(user.id, { role: nextRole });
        setUsers((prev) =>
          prev.map((u) => (u.id === updated.id ? updated : u))
        );
        setFeedback({
          type: "success",
          message: `Role "${updated.username}" diubah menjadi ${nextRole === "SUPER_ADMIN" ? "Super Admin" : "Admin"}.`,
        });
        router.refresh();
      } catch (err) {
        setFeedback({
          type: "error",
          message: getErrorMessage(err, "Gagal mengubah role akun admin."),
        });
      } finally {
        setBusyUserId(null);
      }
    },
    [router]
  );

  const confirmDelete = React.useCallback(async () => {
    if (!deletingUser) return;
    setDeleting(true);
    try {
      await deleteAdminUser(deletingUser.id);
      setUsers((prev) => prev.filter((u) => u.id !== deletingUser.id));
      setFeedback({
        type: "success",
        message: `Akun admin "${deletingUser.username}" berhasil dihapus dari database.`,
      });
      setDeletingUser(null);
      router.refresh();
    } catch (err) {
      setFeedback({
        type: "error",
        message: getErrorMessage(err, "Gagal menghapus akun admin."),
      });
      setDeletingUser(null);
    } finally {
      setDeleting(false);
    }
  }, [deletingUser, router]);

  return {
    users,
    filteredUsers,
    activeCount,
    superAdminCount,
    currentUser,
    search,
    setSearch,
    feedback,
    dismissFeedback,
    createOpen,
    openCreateDialog,
    closeCreateDialog,
    createUsername,
    setCreateUsername,
    createPassword,
    setCreatePassword,
    createRole,
    setCreateRole,
    createError,
    creating,
    handleCreateSubmit,
    passwordTarget,
    openPasswordDialog,
    closePasswordDialog,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    passwordError,
    savingPassword,
    handlePasswordSubmit,
    busyUserId,
    handleToggleActive,
    handleToggleRole,
    deletingUser,
    setDeletingUser,
    deleting,
    confirmDelete,
  };
}
