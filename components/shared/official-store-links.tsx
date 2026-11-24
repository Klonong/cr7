import { ExternalLink } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  ShopeeIcon,
  TikTokShopIcon,
} from "@/components/icons/marketplace-icons";
import { STORE_CONFIG } from "@/config/store";
import { cn } from "@/lib/utils";

interface OfficialStoreLinksProps {
  layout?: "inline" | "stack" | "hero";
  shopeeLabel?: string;
  tiktokLabel?: string;
  className?: string;
}

export function OfficialStoreLinks({
  layout = "inline",
  shopeeLabel,
  tiktokLabel,
  className,
}: OfficialStoreLinksProps) {
  const isStack = layout === "stack";
  const isHero = layout === "hero";

  const resolvedShopee =
    shopeeLabel ??
    (isStack
      ? "Official Shopee Store"
      : isHero
        ? "Shopee Store"
        : "Shopee");
  const resolvedTikTok =
    tiktokLabel ??
    (isStack
      ? "Official TikTok Shop"
      : isHero
        ? "TikTok Shop"
        : "TikTok");

  const baseHeight = isHero
    ? "h-11 min-h-[44px] flex-1 sm:flex-none px-4 text-xs sm:text-sm font-semibold"
    : isStack
      ? "h-10 min-h-[44px] w-full justify-between px-3.5 text-xs sm:text-sm font-semibold"
      : "h-9 px-3 text-xs font-semibold";

  return (
    <div
      className={cn(
        isStack ? "flex flex-col gap-2" : "flex items-center gap-2",
        className
      )}
    >
      <a
        href={STORE_CONFIG.officialShopeeUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open Official CR7 Moto Shopee Store (opens in a new tab)"
        className={cn(
          buttonVariants({ variant: "default" }),
          "gap-1.5 bg-shopee text-shopee-foreground hover:bg-shopee-hover",
          baseHeight
        )}
      >
        <span className="inline-flex items-center gap-1.5">
          <ShopeeIcon className="size-4 shrink-0" />
          <span>{resolvedShopee}</span>
        </span>
        <ExternalLink className="size-3.5 shrink-0 opacity-85" aria-hidden="true" />
      </a>

      <a
        href={STORE_CONFIG.officialTikTokShopUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open Official CR7 Moto TikTok Shop (opens in a new tab)"
        className={cn(
          buttonVariants({ variant: "default" }),
          "gap-1.5 bg-tiktok text-tiktok-foreground hover:bg-tiktok-hover dark:border dark:border-zinc-700",
          baseHeight
        )}
      >
        <span className="inline-flex items-center gap-1.5">
          <TikTokShopIcon className="size-4 shrink-0" />
          <span>{resolvedTikTok}</span>
        </span>
        <ExternalLink className="size-3.5 shrink-0 opacity-85" aria-hidden="true" />
      </a>
    </div>
  );
}
