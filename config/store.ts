import type { ProductBadge } from "@/types/catalog";

export const STORE_CONFIG = {
  brandName: "CR7 MOTO",
  brandTagline: "Official Parts & Accessories Catalog",
  officialShopeeUrl: "https://shopee.co.id/search?keyword=cr7%20lampu%20motor",
  officialTikTokShopUrl: "https://shop.tiktok.com/",
  whatsappConsultUrl:
    "https://wa.me/6281200000000?text=Halo%20CR7%20Moto%2C%20saya%20ingin%20tanya%20kecocokan%20aksesoris%20motor",
  operatingHours: "Mon – Sat · 09:00 – 18:00 WIB",
  location: "Jakarta, Indonesia",
} as const;

export const PRIMARY_NAV_LINKS = [
  { label: "All Catalog", href: "/products" },
  { label: "Lighting", href: "/products?category=led-headlights" },
  { label: "Controls", href: "/products?category=controls-cockpit" },
  { label: "Protection", href: "/products?category=protection-body" },
  { label: "Touring", href: "/products?category=touring-mounts" },
] as const;

export const PRODUCT_BADGES: readonly ProductBadge[] = [
  "Best Seller",
  "New Arrival",
  "Waterproof",
  "CNC Alloy",
] as const;

export const PRODUCT_IMAGE_PRESETS = [
  { label: "SQL 3-Eye Projector", url: "/images/prod-biled-projector.svg" },
  { label: "Bi-LED 2.5\" Headlight", url: "/images/prod-biled-headlight.svg" },
  { label: "Sequential Turn Signals", url: "/images/prod-turn-signal.svg" },
  { label: "Smoked LED Tail Light", url: "/images/prod-tail-light.svg" },
  { label: "CNC Brake Levers", url: "/images/prod-cnc-levers.svg" },
  { label: "CNC 3-Mode Switch", url: "/images/prod-switch-3mode.svg" },
  { label: "CNC Bar-End Mirrors", url: "/images/prod-bar-end-mirrors.svg" },
  { label: "Delrin Frame Sliders", url: "/images/prod-crash-guard.svg" },
  { label: "CNC Phone Mount", url: "/images/prod-phone-mount.svg" },
  { label: "40A Relay Harness", url: "/images/prod-relay-harness.svg" },
] as const;

export const DEFAULT_PRODUCT_IMAGE = "/images/prod-biled-projector.svg";
export const BEAM_TEST_IMAGE = "/images/prod-beam-test.svg";
