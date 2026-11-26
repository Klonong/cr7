"use client";

import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BrandLogo } from "@/components/shared/brand-logo";
import { useAdminLogin } from "@/hooks/admin/use-admin-login";

export function AdminLoginForm() {
  const {
    username,
    setUsername,
    password,
    setPassword,
    showPassword,
    toggleShowPassword,
    error,
    loading,
    handleSubmit,
  } = useAdminLogin();

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-[0.03] dark:opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 w-full max-w-md space-y-6">
        <div className="flex flex-col items-center text-center space-y-2">
          <BrandLogo
            href={null}
            size="lg"
            badge="Admin"
            subtitle="Panel pengelolaan katalog CR7 Racing"
          />
        </div>

        <Card className="rounded-xl border border-border bg-card shadow-md ring-0 py-0">
          <CardHeader className="p-6 pb-4 space-y-1">
            <CardTitle className="flex items-center gap-2 text-lg font-bold">
              <Lock className="size-4 text-primary" aria-hidden="true" />
              <span>Masuk Admin</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Masukkan akun administrator untuk mengelola katalog produk,
              kategori, motor, dan konten beranda.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="px-6 pb-5 space-y-4">
              {error && (
                <div
                  role="alert"
                  className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-xs font-medium text-destructive"
                >
                  <AlertCircle
                    className="size-4 shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="admin-username" className="text-xs font-semibold">
                  Username
                </Label>
                <Input
                  id="admin-username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username admin"
                  disabled={loading}
                  className="h-10"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="admin-password" className="text-xs font-semibold">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="admin-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan password admin"
                    disabled={loading}
                    className="h-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={toggleShowPassword}
                    aria-label={
                      showPassword ? "Sembunyikan password" : "Tampilkan password"
                    }
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" aria-hidden="true" />
                    ) : (
                      <Eye className="size-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="h-11 min-h-[44px] w-full font-semibold"
              >
                {loading ? (
                  <>
                    <Loader2
                      className="size-4 animate-spin"
                      aria-hidden="true"
                    />
                    <span>Memproses...</span>
                  </>
                ) : (
                  <span>Masuk ke Dashboard Admin</span>
                )}
              </Button>
            </CardContent>
          </form>

          <CardFooter className="flex items-center justify-between border-t border-border bg-muted/40 px-6 py-3.5 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Shield
                className="size-3.5 text-status-success"
                aria-hidden="true"
              />
              Sesi Terenkripsi HttpOnly
            </span>
            <Link
              href="/"
              className="inline-flex items-center gap-1 font-medium text-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="size-3.5" aria-hidden="true" />
              <span>Kembali ke Toko</span>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
