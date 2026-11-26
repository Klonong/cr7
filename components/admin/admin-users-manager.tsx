"use client";

import {
  AlertCircle,
  KeyRound,
  Loader2,
  RotateCcw,
  Search,
  Shield,
  ShieldCheck,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminFeedbackBanner } from "@/components/admin/admin-feedback-banner";
import {
  formatAdminDate,
  useAdminUsers,
} from "@/hooks/admin/use-admin-users";
import { cn } from "@/lib/utils";
import type { AdminRole, AdminUserPublic } from "@/interface/api";

interface AdminUsersManagerProps {
  initialUsers: AdminUserPublic[];
  currentUserId: string;
  currentUsername: string;
  currentRole: AdminRole;
}

export function AdminUsersManager({
  initialUsers,
  currentUserId,
  currentUsername,
  currentRole,
}: AdminUsersManagerProps) {
  const state = useAdminUsers(initialUsers, currentUserId);
  const isSuperAdmin = currentRole === "SUPER_ADMIN";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AdminHeader username={currentUsername} />

      <div className="mx-auto w-full max-w-[1320px] flex-1 px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        {/* Heading + Primary Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-primary">
              Keamanan & Akses Database
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Kelola Akun Admin
            </h1>
            <p className="text-sm text-muted-foreground">
              Semua kredensial admin tersimpan terenkripsi (scrypt) di tabel{" "}
              <span className="font-mono text-xs text-foreground">
                admin_users
              </span>{" "}
              PostgreSQL dengan pencabutan sesi JWT otomatis.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            {state.currentUser && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (state.currentUser) {
                    state.openPasswordDialog(state.currentUser);
                  }
                }}
                className="h-11 min-h-[44px] gap-2 px-4 font-semibold"
              >
                <KeyRound className="size-4" aria-hidden="true" />
                <span>Ganti Password Saya</span>
              </Button>
            )}

            {isSuperAdmin && (
              <Button
                type="button"
                onClick={state.openCreateDialog}
                className="h-11 min-h-[44px] gap-2 px-5 font-semibold"
              >
                <UserPlus className="size-4" aria-hidden="true" />
                <span>Tambah Akun Admin</span>
              </Button>
            )}
          </div>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <Card className="rounded-lg border border-border bg-card p-4 ring-0 gap-1">
            <p className="text-xs font-medium text-muted-foreground">
              Total Akun Database
            </p>
            <p className="font-mono text-2xl font-extrabold tabular-nums text-foreground">
              {state.users.length}
            </p>
          </Card>

          <Card className="rounded-lg border border-border bg-card p-4 ring-0 gap-1">
            <p className="text-xs font-medium text-muted-foreground">
              Akun Aktif
            </p>
            <p className="font-mono text-2xl font-extrabold tabular-nums text-status-success">
              {state.activeCount}
            </p>
          </Card>

          <Card className="rounded-lg border border-border bg-card p-4 ring-0 gap-1">
            <p className="text-xs font-medium text-muted-foreground">
              Super Admin Aktif
            </p>
            <p className="font-mono text-2xl font-extrabold tabular-nums text-primary">
              {state.superAdminCount}
            </p>
          </Card>

          <Card className="rounded-lg border border-border bg-card p-4 ring-0 gap-1">
            <p className="text-xs font-medium text-muted-foreground">
              Role Sesi Anda
            </p>
            <p className="font-mono text-base sm:text-lg font-extrabold text-foreground truncate pt-1">
              {isSuperAdmin ? "SUPER_ADMIN" : "ADMIN"}
            </p>
          </Card>
        </div>

        <AdminFeedbackBanner
          feedback={state.feedback}
          onDismiss={state.dismissFeedback}
        />

        {/* Search Toolbar */}
        <div className="relative max-w-md">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={state.search}
            onChange={(e) => state.setSearch(e.target.value)}
            placeholder="Cari username atau role admin..."
            aria-label="Cari akun admin"
            className="h-10 pl-9 bg-card"
          />
        </div>

        {/* Admin Users Grid */}
        {state.filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center">
            <Users
              className="size-8 text-muted-foreground/50 mb-3"
              aria-hidden="true"
            />
            <h2 className="text-base font-semibold text-foreground">
              Akun admin tidak ditemukan
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Coba kata kunci lain atau tambahkan akun admin baru.
            </p>
            {state.search.trim() && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => state.setSearch("")}
                className="mt-4 gap-1.5"
              >
                <RotateCcw className="size-3.5" aria-hidden="true" />
                <span>Reset Pencarian</span>
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {state.filteredUsers.map((user) => {
              const isSelf = user.id === currentUserId;
              const isBusy = state.busyUserId === user.id;
              const isLastSuperAdmin =
                user.role === "SUPER_ADMIN" &&
                user.isActive &&
                state.superAdminCount <= 1;

              return (
                <Card
                  key={user.id}
                  className="flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-card p-0 ring-0 gap-0"
                >
                  <div className="p-5 space-y-4 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={cn(
                            "flex size-10 shrink-0 items-center justify-center rounded-lg border",
                            user.role === "SUPER_ADMIN"
                              ? "border-primary/30 bg-primary/10 text-primary"
                              : "border-border bg-muted text-muted-foreground"
                          )}
                        >
                          {user.role === "SUPER_ADMIN" ? (
                            <ShieldCheck
                              className="size-5"
                              aria-hidden="true"
                            />
                          ) : (
                            <Shield className="size-5" aria-hidden="true" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h2 className="truncate font-mono text-base font-bold text-foreground">
                              {user.username}
                            </h2>
                            {isSelf && (
                              <Badge
                                variant="secondary"
                                className="text-[10px] font-semibold"
                              >
                                Anda
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {user.role === "SUPER_ADMIN"
                              ? "Super Admin"
                              : "Admin Standar"}
                          </p>
                        </div>
                      </div>

                      <Badge
                        variant="outline"
                        className={cn(
                          "shrink-0 text-[11px] font-semibold",
                          user.isActive
                            ? "border-status-success/40 bg-status-success/10 text-status-success"
                            : "border-destructive/40 bg-destructive/10 text-destructive"
                        )}
                      >
                        {user.isActive ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 rounded-lg border border-border/70 bg-muted/30 px-3 py-2 text-[11px]">
                      <div>
                        <p className="text-muted-foreground">Dibuat</p>
                        <p className="font-mono font-medium text-foreground">
                          {formatAdminDate(user.createdAt)}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Diperbarui</p>
                        <p className="font-mono font-medium text-foreground">
                          {formatAdminDate(user.updatedAt)}
                        </p>
                      </div>
                    </div>

                    {isSuperAdmin && !isSelf && (
                      <div className="flex items-center justify-between gap-3 pt-1">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={user.isActive}
                            disabled={
                              isBusy || (user.isActive && isLastSuperAdmin)
                            }
                            onCheckedChange={(checked) =>
                              state.handleToggleActive(user, checked)
                            }
                            aria-label={`Ubah status aktif ${user.username}`}
                          />
                          <span className="text-xs font-medium text-muted-foreground">
                            {user.isActive ? "Akses Aktif" : "Akses Diblokir"}
                          </span>
                        </div>

                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          disabled={isBusy || isLastSuperAdmin}
                          onClick={() => state.handleToggleRole(user)}
                          className="h-7 px-2 text-[11px] font-semibold text-muted-foreground hover:text-foreground"
                        >
                          {user.role === "SUPER_ADMIN"
                            ? "Ubah ke Admin"
                            : "Jadikan Super Admin"}
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-2 border-t border-border bg-muted/30 px-5 py-3">
                    {isSelf || isSuperAdmin ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isBusy}
                        onClick={() => state.openPasswordDialog(user)}
                        className="h-8 gap-1.5 px-3 text-xs"
                      >
                        <KeyRound className="size-3.5" aria-hidden="true" />
                        <span>
                          {isSelf ? "Ganti Password" : "Reset Password"}
                        </span>
                      </Button>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        Dikelola Super Admin
                      </span>
                    )}

                    {isSuperAdmin && !isSelf ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        disabled={isBusy || isLastSuperAdmin}
                        onClick={() => state.setDeletingUser(user)}
                        aria-label={`Hapus akun ${user.username}`}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="size-3.5" aria-hidden="true" />
                      </Button>
                    ) : (
                      <span className="text-[11px] font-mono text-muted-foreground">
                        {isSelf ? "Sesi aktif" : ""}
                      </span>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Admin User Dialog */}
      <Dialog
        open={state.createOpen}
        onOpenChange={(open) => {
          if (!open) state.closeCreateDialog();
        }}
      >
        <DialogContent className="sm:max-w-md p-0 overflow-hidden gap-0">
          <form onSubmit={state.handleCreateSubmit} className="flex flex-col">
            <DialogHeader className="border-b border-border px-6 py-4 text-left">
              <DialogTitle className="text-lg font-bold">
                Tambah Akun Admin Baru
              </DialogTitle>
              <DialogDescription className="text-xs">
                Akun baru langsung disimpan ke PostgreSQL dengan hash password{" "}
                <span className="font-mono">scrypt</span>.
              </DialogDescription>
            </DialogHeader>

            <div className="px-6 py-5 space-y-4">
              {state.createError && (
                <div
                  role="alert"
                  className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-xs font-medium text-destructive"
                >
                  <AlertCircle
                    className="size-4 shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span>{state.createError}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <Label
                  htmlFor="create-admin-username"
                  className="text-xs font-semibold"
                >
                  Username *
                </Label>
                <Input
                  id="create-admin-username"
                  required
                  autoComplete="off"
                  placeholder="contoh: staff_katalog"
                  value={state.createUsername}
                  onChange={(e) => state.setCreateUsername(e.target.value)}
                />
                <p className="text-[11px] text-muted-foreground">
                  3–32 karakter: huruf kecil, angka, titik, strip, atau
                  underscore.
                </p>
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="create-admin-password"
                  className="text-xs font-semibold"
                >
                  Password Awal *
                </Label>
                <Input
                  id="create-admin-password"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="Minimal 8 karakter"
                  value={state.createPassword}
                  onChange={(e) => state.setCreatePassword(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-semibold block">Role Akses *</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => state.setCreateRole("ADMIN")}
                    className={cn(
                      "rounded-lg border px-3 py-2.5 text-left transition-colors",
                      state.createRole === "ADMIN"
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border bg-card text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <p className="text-xs font-bold">Admin</p>
                    <p className="text-[11px] text-muted-foreground">
                      Kelola katalog & beranda
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => state.setCreateRole("SUPER_ADMIN")}
                    className={cn(
                      "rounded-lg border px-3 py-2.5 text-left transition-colors",
                      state.createRole === "SUPER_ADMIN"
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border bg-card text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <p className="text-xs font-bold">Super Admin</p>
                    <p className="text-[11px] text-muted-foreground">
                      Akses penuh + kelola admin
                    </p>
                  </button>
                </div>
              </div>
            </div>

            <DialogFooter className="mx-0 mb-0 rounded-b-xl border-t border-border bg-muted/40 px-6 py-3.5">
              <Button
                type="button"
                variant="outline"
                onClick={state.closeCreateDialog}
                disabled={state.creating}
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={state.creating}
                className="gap-1.5"
              >
                {state.creating ? (
                  <>
                    <Loader2
                      className="size-4 animate-spin"
                      aria-hidden="true"
                    />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="size-4" aria-hidden="true" />
                    <span>Buat Akun</span>
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Change / Reset Password Dialog */}
      <Dialog
        open={Boolean(state.passwordTarget)}
        onOpenChange={(open) => {
          if (!open) state.closePasswordDialog();
        }}
      >
        <DialogContent className="sm:max-w-md p-0 overflow-hidden gap-0">
          <form onSubmit={state.handlePasswordSubmit} className="flex flex-col">
            <DialogHeader className="border-b border-border px-6 py-4 text-left">
              <DialogTitle className="text-lg font-bold">
                {state.passwordTarget?.id === currentUserId
                  ? "Ganti Password Saya"
                  : `Reset Password · ${state.passwordTarget?.username ?? ""}`}
              </DialogTitle>
              <DialogDescription className="text-xs">
                {state.passwordTarget?.id === currentUserId
                  ? "Sesi perangkat lain akan langsung dicabut; sesi Anda saat ini tetap aktif."
                  : "Semua sesi JWT aktif milik akun ini akan langsung dicabut setelah reset."}
              </DialogDescription>
            </DialogHeader>

            <div className="px-6 py-5 space-y-4">
              {state.passwordError && (
                <div
                  role="alert"
                  className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-xs font-medium text-destructive"
                >
                  <AlertCircle
                    className="size-4 shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span>{state.passwordError}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <Label
                  htmlFor="new-admin-password"
                  className="text-xs font-semibold"
                >
                  Password Baru *
                </Label>
                <Input
                  id="new-admin-password"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="Minimal 8 karakter"
                  value={state.newPassword}
                  onChange={(e) => state.setNewPassword(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="confirm-admin-password"
                  className="text-xs font-semibold"
                >
                  Konfirmasi Password Baru *
                </Label>
                <Input
                  id="confirm-admin-password"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="Ulangi password baru"
                  value={state.confirmPassword}
                  onChange={(e) => state.setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter className="mx-0 mb-0 rounded-b-xl border-t border-border bg-muted/40 px-6 py-3.5">
              <Button
                type="button"
                variant="outline"
                onClick={state.closePasswordDialog}
                disabled={state.savingPassword}
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={state.savingPassword}
                className="gap-1.5"
              >
                {state.savingPassword ? (
                  <>
                    <Loader2
                      className="size-4 animate-spin"
                      aria-hidden="true"
                    />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="size-4" aria-hidden="true" />
                    <span>Simpan Password</span>
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={Boolean(state.deletingUser)}
        onOpenChange={(open) => {
          if (!open) state.setDeletingUser(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus akun admin ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Akun{" "}
              <strong className="font-mono text-foreground">
                {state.deletingUser?.username}
              </strong>{" "}
              akan dihapus permanen dari database PostgreSQL dan semua sesi
              loginnya akan langsung terhenti.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={state.deleting}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={state.confirmDelete}
              disabled={state.deleting}
            >
              {state.deleting ? "Menghapus..." : "Hapus Akun"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
