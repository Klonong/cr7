"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  withTooltip?: boolean;
  className?: string;
}

export function ThemeToggle({
  withTooltip = true,
  className,
}: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const label = `Ganti ke mode ${theme === "dark" ? "terang" : "gelap"}`;

  const button = (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={label}
      className={cn("size-9 min-h-[40px] min-w-[40px] rounded-lg", className)}
    >
      {theme === "dark" ? (
        <Sun className="size-4" aria-hidden="true" />
      ) : (
        <Moon className="size-4" aria-hidden="true" />
      )}
    </Button>
  );

  if (!withTooltip) return button;

  return (
    <Tooltip>
      <TooltipTrigger render={button} />
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
