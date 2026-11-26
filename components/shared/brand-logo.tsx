import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { STORE_CONFIG } from "@/config/store";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  href?: string | null;
  badge?: string;
  subtitle?: string;
  size?: "sm" | "md" | "lg";
  inverted?: boolean;
  onDark?: boolean;
  className?: string;
}

export function BrandLogo({
  href = "/",
  badge,
  subtitle,
  size = "md",
  inverted = false,
  onDark = false,
  className,
}: BrandLogoProps) {
  const isLightText = inverted || onDark;

  const imgHeightClass =
    size === "lg"
      ? "h-10 w-auto"
      : size === "sm"
        ? "h-6 w-auto"
        : "h-8 sm:h-9 w-auto";

  const frameClass = onDark
    ? "inline-flex shrink-0 items-center"
    : cn(
        "inline-flex shrink-0 items-center bg-[#000000] border border-black/10 dark:border-white/15 shadow-xs",
        size === "lg"
          ? "rounded-xl px-3.5 py-2"
          : size === "sm"
            ? "rounded-md px-2 py-1"
            : "rounded-lg px-2.5 py-1.5"
      );

  const showMeta = Boolean(badge || subtitle);

  const content = (
    <span className={cn("group inline-flex items-start gap-3", className)}>
      <span
        className={cn(
          frameClass,
          "transition-transform group-hover:scale-[1.03] motion-reduce:transition-none"
        )}
      >
        <Image
          src="/images/cr7-logo.png"
          alt={STORE_CONFIG.brandName}
          width={664}
          height={274}
          priority
          className={cn("object-contain select-none", imgHeightClass)}
        />
      </span>

      {showMeta ? (
        <span className="flex flex-col items-start text-left">
          {badge && (
            <Badge
              variant="secondary"
              className={cn(
                "px-1.5 py-0 font-mono text-[10px] uppercase tracking-wider",
                isLightText
                  ? "bg-white/15 text-[#fefefe] border border-white/20 hover:bg-white/20"
                  : "border border-border"
              )}
            >
              {badge}
            </Badge>
          )}
          {subtitle && (
            <span
              className={cn(
                "text-[11px] leading-none",
                badge && "mt-1",
                onDark
                  ? "text-zinc-400"
                  : inverted
                    ? "text-primary-foreground/80"
                    : "text-muted-foreground"
              )}
            >
              {subtitle}
            </span>
          )}
        </span>
      ) : (
        <span className="sr-only">{STORE_CONFIG.brandName}</span>
      )}
    </span>
  );

  if (!href) return content;

  return (
    <Link
      href={href}
      aria-label={STORE_CONFIG.brandName}
      className={cn(
        "inline-flex rounded-md focus-visible:outline-none focus-visible:ring-2",
        isLightText ? "focus-visible:ring-white/80" : "focus-visible:ring-ring"
      )}
    >
      {content}
    </Link>
  );
}
