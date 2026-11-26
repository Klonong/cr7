import type { HomeContent } from "@/types/home";

export const HERO_IMAGE_PRESETS = [
  { label: "Hero Dual-Lens LED", url: "/images/hero-led.svg" },
  { label: "Tes Sorot Cutoff Malam", url: "/images/prod-beam-test.svg" },
  { label: "SQL 3 Mata Projector", url: "/images/prod-biled-projector.svg" },
  { label: "Bi-LED 2.5\" Headlight", url: "/images/prod-biled-headlight.svg" },
  { label: "Handle Rem CNC", url: "/images/prod-cnc-levers.svg" },
  { label: "Frame Slider Delrin", url: "/images/prod-crash-guard.svg" },
  { label: "Holder HP CNC", url: "/images/prod-phone-mount.svg" },
] as const;

export const DEFAULT_HOME_CONTENT: HomeContent = {
  hero: {
    eyebrow: "Katalog Resmi Aksesoris Motor CR7 Racing",
    headline: "Lampu LED Presisi & Part CNC Racing untuk Setiap Perjalanan.",
    subheadline:
      "Cek spesifikasi lengkap, uji sorot cutoff malam, dan kecocokan tipe motor. Klik langsung untuk checkout aman di toko resmi Shopee atau TikTok Shop CR7 Racing.",
    primaryCtaLabel: "Lihat Semua Katalog",
    primaryCtaHref: "/products",
    heroImageUrl: "/images/hero-led.svg",
    spotlightTag: "Produk Unggulan · CR7-SQL3-60W",
    spotlightTitle: "CR7 SQL 3 Mata Laser Mini Driving Light",
    spotlightProductSlug: "cr7-sql-3-eye-laser-mini-driving-light",
    showOfficialStoreLinks: true,
  },
  sections: {
    showTrustStrip: true,
    showBikeFitmentStrip: true,
    showCategoriesGrid: true,
    featuredSectionEyebrow: "Upgrade Paling Diminati",
    featuredSectionTitle: "Aksesoris Motor Unggulan",
    featuredSectionSubtitle:
      "Klik Lihat Cepat untuk cek varian & spesifikasi, atau langsung order via Shopee dan TikTok Shop.",
    featuredMaxItems: 8,
    showHighlights: true,
  },
  trustPillars: [
    {
      id: "pillar-original",
      icon: "shield",
      title: "100% Produk Original",
      description:
        "Part lampu LED & aksesori CNC resmi CR7 Racing dengan kartu garansi.",
    },
    {
      id: "pillar-checkout",
      icon: "truck",
      title: "Order Shopee & TikTok",
      description:
        "Checkout mudah via aplikasi favorit dengan voucher gratis ongkir & COD.",
    },
    {
      id: "pillar-specs",
      icon: "gauge",
      title: "Spesifikasi Teruji",
      description:
        "Watt real, uji ketahanan air IP67, dan panduan kecocokan motor akurat.",
    },
    {
      id: "pillar-warranty",
      icon: "award",
      title: "Garansi Toko Resmi",
      description:
        "Klaim tukar unit cepat dan transparan langsung melalui chat toko resmi.",
    },
  ],
  highlights: [
    {
      id: "hl-flat-cutoff",
      badge: "CUTOFF RATA ANTI SILAU",
      title: "Dirancang untuk Hujan Deras, Kabut, & Jalan Gelap.",
      description:
        "Setiap projector Bi-LED dan SQL laser CR7 Racing diuji pada jarak 15 meter untuk menghasilkan garis cutoff horizontal yang tajam—terang maksimal tanpa menyilaukan pengendara lawan arah.",
      bullets: [
        "Lampu dekat 6000K putih tajam + lampu jauh 3000K kuning tembus kabut",
        "Bodi aluminium CNC 6063 dengan sertifikasi tahan air IP67",
        "Langsung plug-and-play dengan Kabel Relay Set 40A CR7 Racing",
      ],
      imageUrl: "/images/prod-beam-test.svg",
      imageAlt:
        "Uji pola cahaya cutoff projector LED CR7 Racing 6000K putih dan 3000K kuning",
      ctaLabel: "Jelajahi Seri Lampu LED",
      ctaHref: "/products?category=led-headlights",
      active: true,
    },
    {
      id: "hl-cnc-cockpit",
      badge: "CNC BILLET 6061-T6",
      title: "Upgrade Kokpit Presisi dengan Handle & Spion CNC.",
      description:
        "Tingkatkan kontrol pengereman dan tampilan setang motor Anda menggunakan material aluminium CNC anodized yang kuat, ringan, dan anti karat untuk pemakaian harian maupun touring.",
      bullets: [
        "Setelan jarak 6 klik ergonomis sesuai ukuran jari pengendara",
        "Kaca spion biru anti silau untuk visibilitas aman di malam hari",
        "Tersedia varian khusus Yamaha NMAX, PCX 160, Vario 160 & Aerox",
      ],
      imageUrl: "/images/prod-cnc-levers.svg",
      imageAlt: "Handle rem CNC 6 klik CR7 Racing hitam merah",
      ctaLabel: "Lihat Aksesoris Kokpit",
      ctaHref: "/products?category=controls-cockpit",
      active: true,
    },
    {
      id: "hl-touring-ready",
      badge: "SIAP TOURING JARAK JAUH",
      title: "Lindungi Smartphone & Mesin Motor di Setiap Medan.",
      description:
        "Kombinasi holder HP anti getar dengan charger PD 20W USB-C dan frame slider Delrin memberikan keamanan penuh saat berkendara jarak jauh.",
      bullets: [
        "Peredam silikon 4 titik menjaga kamera OIS HP tetap aman dari getaran",
        "Port USB-C fast charging 20W dengan penutup karet tahan hujan",
        "Tersedia promo paket bundling di Shopee & TikTok Shop CR7 Racing",
      ],
      imageUrl: "/images/prod-phone-mount.svg",
      imageAlt: "Holder HP CNC anti getar USB-C CR7 Racing",
      ctaLabel: "Lihat Perlengkapan Touring",
      ctaHref: "/products?category=touring-mounts",
      active: true,
    },
  ],
};
