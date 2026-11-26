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
  onPrimary?: boolean;
  className?: string;
}

export function OfficialStoreLinks({
  layout = "inline",
  shopeeLabel,
  tiktokLabel,
  onPrimary = false,
  className,
}: OfficialStoreLinksProps) {
  const isStack = layout === "stack";
  const isHero = layout === "hero";

  const resolvedShopee =
    shopeeLabel ??
    (isStack
      ? "Toko Resmi Shopee"
      : isHero
        ? "Toko Shopee"
        : "Shopee");
  const resolvedTikTok =
    tiktokLabel ??
    (isStack
      ? "Toko Resmi TikTok Shop"
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
        aria-label="Buka Toko Resmi Shopee CR7 Racing (buka di tab baru)"
        className={cn(
          buttonVariants({ variant: "default" }),
          onPrimary
            ? "gap-1.5 bg-secondary text-shopee hover:bg-secondary/90 shadow-xs"
            : "gap-1.5 bg-shopee text-shopee-foreground hover:bg-shopee-hover",
          baseHeight
        )}
      >
        <span className="inline-flex items-center gap-1.5">
          <ShopeeIcon className="size-4 shrink-0" />
          <span>{resolvedShopee}</span>
        </span>
        <ExternalLink
          className="size-3.5 shrink-0 opacity-85"
          aria-hidden="true"
        />
      </a>

      <a
        href={STORE_CONFIG.officialTikTokShopUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Buka Toko Resmi TikTok Shop CR7 Racing (buka di tab baru)"
        className={cn(
          buttonVariants({ variant: "default" }),
          onPrimary
            ? "gap-1.5 bg-[#0f0f0f] text-secondary hover:bg-[#262626] border border-white/20 shadow-xs"
            : "gap-1.5 bg-tiktok text-tiktok-foreground hover:bg-tiktok-hover border border-white/20 dark:border-zinc-700",
          baseHeight
        )}
      >
        <span className="inline-flex items-center gap-1.5">
          <TikTokShopIcon className="size-4 shrink-0" />
          <span>{resolvedTikTok}</span>
        </span>
        <ExternalLink
          className="size-3.5 shrink-0 opacity-85"
          aria-hidden="true"
        />
      </a>
    </div>
  );
}
