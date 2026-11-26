"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { loginAdmin } from "@/lib/api/auth-api";
import { getErrorMessage } from "@/lib/api/client";

export function useAdminLogin() {
  const router = useRouter();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const toggleShowPassword = React.useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const handleSubmit = React.useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError(null);
      setLoading(true);

      try {
        await loginAdmin({ username, password });
        router.replace("/admin");
        router.refresh();
      } catch (err) {
        setError(
          getErrorMessage(
            err,
            "Username atau password salah. Silakan coba lagi."
          )
        );
        setLoading(false);
      }
    },
    [username, password, router]
  );

  return {
    username,
    setUsername,
    password,
    setPassword,
    showPassword,
    toggleShowPassword,
    error,
    loading,
    handleSubmit,
  };
}
