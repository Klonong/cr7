"use client";

import { usePathname } from "next/navigation";
import { STORE_CONFIG } from "@/config/store";
import { cn } from "@/lib/utils";

function WhatsAppSvg({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M16.01 3.2c-7.05 0-12.78 5.73-12.78 12.78 0 2.25.59 4.45 1.71 6.39L3.1 28.9l6.71-1.76a12.74 12.74 0 0 0 6.2 1.61h.01c7.05 0 12.78-5.73 12.78-12.78 0-3.41-1.33-6.62-3.74-9.03A12.7 12.7 0 0 0 16.01 3.2zm0 23.38h-.01a10.6 10.6 0 0 1-5.41-1.48l-.39-.23-3.98 1.04 1.06-3.88-.25-.4a10.56 10.56 0 0 1-1.63-5.65c0-5.85 4.76-10.61 10.62-10.61 2.84 0 5.5 1.1 7.5 3.11a10.55 10.55 0 0 1 3.11 7.51c0 5.86-4.76 10.59-10.62 10.59zm5.82-7.95c-.32-.16-1.89-.93-2.18-1.04-.29-.11-.5-.16-.72.16-.21.32-.82 1.04-1.01 1.25-.19.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.59-.95-.85-1.59-1.9-1.78-2.22-.19-.32-.02-.49.14-.65.14-.14.32-.37.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.72-1.73-.98-2.37-.26-.62-.52-.54-.72-.55h-.61c-.21 0-.56.08-.85.4-.29.32-1.12 1.09-1.12 2.66s1.14 3.09 1.3 3.3c.16.21 2.25 3.44 5.45 4.82.76.33 1.36.53 1.82.67.77.24 1.46.21 2.01.13.61-.09 1.89-.77 2.15-1.52.27-.75.27-1.39.19-1.52-.08-.13-.29-.21-.61-.37z" />
    </svg>
  );
}

export function FloatingWhatsApp() {
  const pathname = usePathname();
  // Lift above mobile sticky buy bar on Product Detail Pages
  const isProductDetail =
    pathname.startsWith("/products/") && pathname !== "/products";

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
      <WhatsAppSvg className="size-6 shrink-0" />
      <span className="hidden sm:inline text-xs font-bold tracking-wide pr-0.5">
        Chat WhatsApp
      </span>
    </a>
  );
}
