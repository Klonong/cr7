import Link from "next/link";
import { Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { STORE_CONFIG } from "@/config/store";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  href?: string | null;
  badge?: string;
  subtitle?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function BrandLogo({
  href = "/",
  badge,
  subtitle,
  size = "md",
  className,
}: BrandLogoProps) {
  const iconBoxSize =
    size === "lg" ? "size-12 rounded-xl" : size === "sm" ? "size-7 rounded-md" : "size-9 rounded-lg";
  const iconSize = size === "lg" ? "size-6" : size === "sm" ? "size-4" : "size-5";

  const content = (
    <span className={cn("group inline-flex items-center gap-2.5", className)}>
      <span
        className={cn(
          "flex shrink-0 items-center justify-center bg-primary text-primary-foreground shadow-xs transition-transform group-hover:scale-105 motion-reduce:transition-none",
          iconBoxSize
        )}
      >
        <Zap className={cn(iconSize, "fill-current")} aria-hidden="true" />
      </span>
      <span className="flex flex-col text-left">
        <span className="flex items-center gap-1.5">
          <span
            className={cn(
              "font-extrabold tracking-tight text-foreground",
              size === "lg" ? "text-xl" : "text-base"
            )}
          >
            {STORE_CONFIG.brandName}
          </span>
          {badge && (
            <Badge
              variant="secondary"
              className="px-1.5 py-0 font-mono text-[10px] uppercase tracking-wider"
            >
              {badge}
            </Badge>
          )}
        </span>
        {subtitle && (
          <span className="text-[11px] leading-tight text-muted-foreground">
            {subtitle}
          </span>
        )}
      </span>
    </span>
  );

  if (!href) return content;

  return (
    <Link
      href={href}
      className="inline-flex rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {content}
    </Link>
  );
}
