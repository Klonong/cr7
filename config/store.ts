import type { MotorcycleType, ProductBadge } from "@/types/catalog";

export const STORE_CONFIG = {
  brandName: "CR7 Racing",
  // brandTagline: "Katalog Resmi Aksesori & Lampu Motor",
  officialShopeeUrl: "https://shopee.co.id/search?keyword=cr7%20lampu%20motor",
  officialTikTokShopUrl: "https://shop.tiktok.com/",
  instagramUrl: "https://www.instagram.com/cr7racing.id/",
  facebookUrl: "https://www.facebook.com/cr7racing.id/",
  youtubeChannelUrl: "https://www.youtube.com/@CR7OfficialIndonesia",
  tiktokUrl: "https://www.tiktok.com/@cr7racing.id",
  whatsappConsultUrl:
    "https://wa.me/6281200000000?text=Halo%20CR7%20Racing%2C%20saya%20ingin%20tanya%20produk%20dan%20kecocokan%20aksesoris%20motor",
  operatingHours: "Senin – Sabtu · 09:00 – 18:00 WIB",
  location: "Jakarta, Indonesia",
} as const;

export const YOUTUBE_SHOWCASE_VIDEOS = [
  {
    id: "yt-beam-test",
    youtubeId: "dQw4w9WgXcQ",
    title: "Tes Sorot Malam CR7 SQL 3 Mata Laser 60W — Cutoff Rata Anti Silau",
    duration: "04:15",
    category: "Tes Lampu LED",
    description:
      "Pengujian langsung sorot lampu 6000K putih dan 3000K kuning di jalan gelap dan kondisi hujan deras.",
  },
  {
    id: "yt-biled-install",
    youtubeId: "M7lc1UVf-VE",
    title: "Panduan Pemasangan Bi-LED Projector 2.5 Inci & Relay Set 40A",
    duration: "06:40",
    category: "Tutorial Pasang",
    description:
      "Langkah demi langkah pemasangan relay waterproof 40A agar arus kelistrikan motor stabil dan aman.",
  },
  {
    id: "yt-cnc-review",
    youtubeId: "ysz5S6PUM-U",
    title: "Review Detail Handle Rem CNC 6-Click & Spion Bar-End CR7 Racing",
    duration: "03:28",
    category: "Review CNC",
    description:
      "Melihat presisi bahan aluminium billet 6061-T6 dan ergonomi setelan 6 klik untuk harian maupun touring.",
  },
] as const;

export const PRIMARY_NAV_LINKS = [
  { label: "Katalog", href: "/products" },
  { label: "Lampu LED", href: "/products?category=led-headlights" },
  { label: "Kokpit & CNC", href: "/products?category=controls-cockpit" },
  { label: "Proteksi", href: "/products?category=protection-body" },
  { label: "Tentang Kami", href: "/about" },
] as const;

export const PRODUCT_BADGES: readonly ProductBadge[] = [
  "Terlaris",
  "Baru",
  "Waterproof",
  "CNC Alloy",
] as const;

export const MOTORCYCLE_TYPES: readonly MotorcycleType[] = [
  "Universal",
  "Matic",
  "Sport",
  "Bebek",
  "Trail / Adventure",
] as const;

export const PRODUCT_IMAGE_PRESETS = [
  { label: "SQL 3 Mata Projector", url: "/images/prod-biled-projector.svg" },
  { label: "Bi-LED 2.5\" Headlight", url: "/images/prod-biled-headlight.svg" },
  { label: "Sein LED Running", url: "/images/prod-turn-signal.svg" },
  { label: "Stoplamp LED Smoke", url: "/images/prod-tail-light.svg" },
  { label: "Handle Rem CNC", url: "/images/prod-cnc-levers.svg" },
  { label: "Saklar 3 Mode CNC", url: "/images/prod-switch-3mode.svg" },
  { label: "Spion Bar-End CNC", url: "/images/prod-bar-end-mirrors.svg" },
  { label: "Frame Slider Delrin", url: "/images/prod-crash-guard.svg" },
  { label: "Holder HP Anti Getar", url: "/images/prod-phone-mount.svg" },
  { label: "Relay Set 40A", url: "/images/prod-relay-harness.svg" },
] as const;

export const DEFAULT_PRODUCT_IMAGE = "/images/prod-biled-projector.svg";
export const BEAM_TEST_IMAGE = "/images/prod-beam-test.svg";
