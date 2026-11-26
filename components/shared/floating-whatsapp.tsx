"use client";

import { WhatsAppIcon } from "@/components/icons/marketplace-icons";
import { STORE_CONFIG } from "@/config/store";
import { useRouteFlags } from "@/hooks/layout/use-route-flags";
import { cn } from "@/lib/utils";

export function FloatingWhatsApp() {
  const { isProductDetail } = useRouteFlags();

  return (
    <a
      href={STORE_CONFIG.whatsappConsultUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat WhatsApp CR7 Racing (buka di tab baru)"
      className={cn(
        "group fixed right-4 sm:right-6 z-40 inline-flex items-center gap-2.5 rounded-full bg-[#25D366] p-3.5 sm:px-4 sm:py-3 text-[#FEFEFE] shadow-lg ring-2 ring-white/30 transition-all duration-200 hover:scale-105 hover:bg-[#1ebe5d] hover:shadow-xl focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#25D366]/60 motion-reduce:transition-none",
        isProductDetail ? "bottom-28 md:bottom-6" : "bottom-5 sm:bottom-6"
      )}
    >
      <WhatsAppIcon className="size-6 shrink-0" />
      <span className="hidden sm:inline text-xs font-bold tracking-wide pr-0.5">
        Chat WhatsApp
      </span>
    </a>
  );
}
