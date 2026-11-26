"use client";

import * as React from "react";
import type { Theme, ThemeContextValue } from "@/interface/hooks";

export type { Theme, ThemeContextValue };

export const ThemeContext = React.createContext<ThemeContextValue | undefined>(
  undefined
);

const STORAGE_KEY = "cr7-catalog-theme";
const listeners = new Set<() => void>();

function readClientTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  const handleStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) callback();
  };
  window.addEventListener("storage", handleStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", handleStorage);
  };
}

function getServerSnapshot(): Theme {
  return "dark";
}

function writeTheme(next: Theme) {
  window.localStorage.setItem(STORAGE_KEY, next);
  document.documentElement.classList.toggle("dark", next === "dark");
  listeners.forEach((l) => l());
}

export function useThemeProvider(): ThemeContextValue {
  const theme = React.useSyncExternalStore(
    subscribe,
    readClientTheme,
    getServerSnapshot
  );

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const setTheme = React.useCallback((next: Theme) => {
    writeTheme(next);
  }, []);

  const toggleTheme = React.useCallback(() => {
    const current = readClientTheme();
    writeTheme(current === "dark" ? "light" : "dark");
  }, []);

  return React.useMemo(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme]
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}
