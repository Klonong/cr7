"use client";

import type * as React from "react";
import { ThemeContext, useThemeProvider } from "@/hooks/shared/use-theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const value = useThemeProvider();

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
