import type { Category, Motorcycle, Product } from "../interface/catalog";
import type { HomeContent } from "../interface/home";

export const SEED_CATEGORIES: Category[] = [
  {
    slug: "led-headlights",
    name: "Lampu Depan & Projector LED",
    shortName: "Lampu LED",
    description:
      "Bi-LED projector, lampu tembak SQL laser, dan optik cutoff rata anti silau.",
  },
  {
    slug: "signals-tail-lights",
    name: "Sein, DRL & Stoplamp LED",
    shortName: "Sein & Stoplamp",
    description:
      "Sein running smoke, stoplamp 3-in-1 twin blade, dan modul hazard.",
  },
  {
    slug: "controls-cockpit",
    name: "Kokpit & Kontrol CNC",
    shortName: "Kokpit & CNC",
    description:
      "Handle rem CNC 6 klik, saklar waterproof 3 mode, dan spion bar-end anti silau.",
  },
  {
    slug: "protection-body",
    name: "Pelindung & Body Armor",
    shortName: "Proteksi",
    description:
      "Frame slider CNC Delrin, crash bar mesin, dan pelindung bodi motor.",
  },
  {
    slug: "touring-mounts",
    name: "Touring & Holder HP",
    shortName: "Touring",
    description:
      "Holder HP CNC anti getar dengan pengisian cepat USB-C tahan air.",
  },
  {
    slug: "electrical-relays",
    name: "Kelistrikan & Relay Set",
    shortName: "Kelistrikan",
    description:
      "Kabel relay set waterproof 40A, konektor kedap air, dan pengaman sekring.",
  },
];

export const SEED_MOTORCYCLES: Motorcycle[] = [
  { id: "moto-universal", brand: "Universal", model: "Semua Motor", name: "Universal", type: "Universal" },
  { id: "moto-nmax", brand: "Yamaha", model: "NMAX", name: "Yamaha NMAX", type: "Matic" },
  { id: "moto-pcx160", brand: "Honda", model: "PCX 160", name: "Honda PCX 160", type: "Matic" },
  { id: "moto-vario160", brand: "Honda", model: "Vario 160", name: "Honda Vario 160", type: "Matic" },
  { id: "moto-aerox155", brand: "Yamaha", model: "Aerox 155", name: "Yamaha Aerox 155", type: "Matic" },
  { id: "moto-adv160", brand: "Honda", model: "ADV 160", name: "Honda ADV 160", type: "Matic" },
  { id: "moto-ninja", brand: "Kawasaki", model: "Ninja / ZX", name: "Kawasaki Ninja / ZX", type: "Sport" },
  { id: "moto-crf-klx", brand: "Honda / Kawasaki", model: "CRF / KLX", name: "CRF / KLX Trail", type: "Trail / Adventure" },
];

export const SEED_PRODUCTS: Product[] = [
  {
    id: "cr7-sql3-60w",
    slug: "cr7-sql-3-eye-laser-mini-driving-light",
    sku: "CR7-SQL3-60W",
    name: "CR7 Racing SQL 3 Mata Laser Mini Driving Light Hi/Lo",
    category: "led-headlights",
    price: 245000,
    originalPrice: 295000,
    currency: "IDR",
    images: [
      {
        url: "/images/prod-biled-projector.svg",
        alt: "Lampu tembak CR7 Racing SQL 3 Mata Laser dengan sirip pendingin CNC dan breket stainless",
        label: "Utama",
      },
      {
        url: "/images/prod-beam-test.svg",
        alt: "Uji sorot malam cutoff rata 6000K putih dan 3000K kuning kabut",
        label: "Pola Cahaya",
      },
    ],
    variants: [
      {
        id: "var-sql3-wk",
        name: "Putih - Kuning (3000K/6000K)",
        sku: "CR7-SQL3-WK",
        price: 245000,
        inStock: true,
        colorHex: "#F59E0B",
      },
      {
        id: "var-sql3-ww",
        name: "Putih - Putih (6000K/6000K)",
        sku: "CR7-SQL3-WW",
        price: 245000,
        inStock: true,
        colorHex: "#E0F2FE",
      },
      {
        id: "var-sql3-relay",
        name: "Paket Lengkap + Relay 40A",
        sku: "CR7-SQL3-KIT",
        price: 319000,
        inStock: true,
        colorHex: "#CA0C1F",
      },
    ],
    shortSpecs: ["60W Real", "3000K / 6000K", "IP67"],
    fullSpecs: {
      "Daya Output": "60W Total (30W Low + 30W High)",
      "Suhu Warna": "6000K Putih Terang + 3000K Kuning Kabut",
      "Tegangan Input": "DC 12V – 24V",
      "Lensa Optik": "3 Mata Kaca Cembung Cutoff Rata",
      "Material Bodi": "CNC Die-Cast Aviation Aluminium 6063",
      "Ketahanan Air": "IP67 Tahan Air & Debu",
      "Sistem Pendingin": "Sirip Heatsink + Kipas Turbo Internal",
      "Usia Pakai": "50.000+ Jam",
    },
    inTheBox: [
      "1x Lampu Tembak CR7 Racing SQL 3 Mata",
      "1x Breket U Stainless Steel & Baut L",
      "1x Driver Eksternal Arus Stabil",
      "1x Kartu Garansi Resmi CR7 Racing",
    ],
    fitmentNotes:
      "Breket universal cocok dipasang di crash bar, shock depan, atau bawah headlamp. Wajib arus DC 12V (disarankan pakai Kabel Relay Set 40A CR7 Racing).",
    compatibility: [
      "Universal",
      "Yamaha NMAX",
      "Honda PCX 160",
      "Honda ADV 160",
      "Honda Vario 160",
    ],
    badges: ["Terlaris", "Waterproof"],
    featured: true,
    inStock: true,
    links: {
      shopee:
        "https://shopee.co.id/search?keyword=CR7%20SQL%203%20Mata%20Laser%2060W",
      tiktokShop: "https://shop.tiktok.com/",
    },
    description:
      "Lampu tembak 3 mata unggulan dengan lensa optik cutoff rata anti silau. Beralih mulus antara cahaya putih 6000K untuk jalan gelap dan kuning 3000K untuk menembus hujan deras serta kabut.",
  },
  {
    id: "cr7-biled-25-pro",
    slug: "cr7-biled-25-inch-projector-angel-devil-eye",
    sku: "CR7-BILED25-PRO",
    name: "CR7 Racing Bi-LED 2.5\" Projector Headlight + Demon Eye",
    category: "led-headlights",
    price: 385000,
    originalPrice: 440000,
    currency: "IDR",
    images: [
      {
        url: "/images/prod-biled-headlight.svg",
        alt: "Projector Bi-LED 2.5 inci CR7 Racing dengan shroud halo dan demon eye merah",
        label: "Utama",
      },
      {
        url: "/images/prod-beam-test.svg",
        alt: "Hasil sorot cutoff rata projector Bi-LED pada jarak 15 meter",
        label: "Pola Cahaya",
      },
    ],
    variants: [
      {
        id: "var-biled-red",
        name: "Shroud Putih + Demon Merah",
        sku: "CR7-BL25-RED",
        price: 385000,
        inStock: true,
        colorHex: "#CA0C1F",
      },
      {
        id: "var-biled-ice",
        name: "Shroud Putih + Demon Ice Blue",
        sku: "CR7-BL25-ICE",
        price: 385000,
        inStock: true,
        colorHex: "#38BDF8",
      },
      {
        id: "var-biled-rgb",
        name: "Demon Eye RGB App Control",
        sku: "CR7-BL25-RGB",
        price: 425000,
        inStock: true,
        colorHex: "#8B5CF6",
      },
    ],
    shortSpecs: ["55W Bi-LED", "Shroud 2.5\"", "12V DC"],
    fullSpecs: {
      "Daya Output": "45W Lampu Dekat / 55W Lampu Jauh",
      "Diameter Lensa": "2.5 Inci Blue-Coated HD Glass",
      "Suhu Warna": "6000K Putih Murni + Halo + Demon Eye",
      "Pola Cutoff": "RHD Flat Step Cutoff Anti Silau",
      "Tegangan Input": "DC 12V (Disarankan Full Wave)",
      "Material Bodi": "Mangkok Reflektor Full Aluminium",
    },
    inTheBox: [
      "1x Unit Projector Bi-LED CR7 2.5 Inci",
      "1x Shroud BMW Halo (Terpasang)",
      "1x Ring Pengunci Soket H4 / H7",
      "1x Karet Penutup Debu Silikon",
    ],
    fitmentNotes:
      "Cocok untuk sebagian besar reflektor motor 150cc–250cc. Disarankan pemasangan di bengkel retrofit agar tinggi cutoff presisi.",
    compatibility: [
      "Universal",
      "Honda Vario 160",
      "Yamaha Aerox 155",
      "Yamaha NMAX",
      "Kawasaki Ninja / ZX",
    ],
    badges: ["Terlaris", "Baru"],
    featured: true,
    inStock: true,
    links: {
      shopee:
        "https://shopee.co.id/search?keyword=CR7%20Biled%20Projector%202.5%20inch",
      tiktokShop: "https://shop.tiktok.com/",
    },
    description:
      "Projector Bi-LED 2.5 inci dengan pancaran cahaya lebar merata, garis cutoff tegas anti silau, dan solenoid lampu jauh responsif dilengkapi Angel & Demon Eye.",
  },
  {
    id: "cr7-seq-signal-09",
    slug: "cr7-smoked-sequential-led-turn-signals",
    sku: "CR7-SEQ-09",
    name: "CR7 Racing Lampu Sein LED Running Sequential Smoke (Sepasang)",
    category: "signals-tail-lights",
    price: 115000,
    originalPrice: 145000,
    currency: "IDR",
    images: [
      {
        url: "/images/prod-turn-signal.svg",
        alt: "Sepasang lampu sein LED running sequential kaca smoke dengan cahaya kuning amber",
        label: "Utama",
      },
    ],
    variants: [
      {
        id: "var-seq-amber",
        name: "Kuning Running + Senja Putih",
        sku: "CR7-SEQ-AW",
        price: 115000,
        inStock: true,
        colorHex: "#F59E0B",
      },
      {
        id: "var-seq-blue",
        name: "Kuning Running + Senja Biru",
        sku: "CR7-SEQ-AB",
        price: 115000,
        inStock: true,
        colorHex: "#2563EB",
      },
      {
        id: "var-seq-red",
        name: "Kuning Running + Senja Merah",
        sku: "CR7-SEQ-AR",
        price: 119000,
        inStock: true,
        colorHex: "#CA0C1F",
      },
    ],
    shortSpecs: ["Running Flow", "Baut M10", "IP66"],
    fullSpecs: {
      "Mode Cahaya": "Running Sequential Mengalir Kuning Amber",
      "Drat Pemasangan": "Baut Standar M10 Tangkai Lentur",
      "Tegangan Input": "DC 12V",
      "Finishing Lensa": "Polikarbonat Smoke Anti Gores",
      "Ketahanan Air": "IP66 Tahan Hujan",
      "Isi Paket": "1 Pasang (Kiri + Kanan)",
    },
    inTheBox: [
      "2x Lampu Sein LED Running CR7 Racing (Kiri & Kanan)",
      "2x Mur Pengunci M10 & Ring",
    ],
    fitmentNotes:
      "Langsung pasang untuk motor dengan dudukan sein tangkai M10. Gunakan flasher sein LED setelan agar kecepatan running optimal.",
    compatibility: [
      "Universal",
      "Kawasaki Ninja / ZX",
      "CRF / KLX Trail",
      "Yamaha Aerox 155",
    ],
    badges: ["Terlaris", "Waterproof"],
    featured: true,
    inStock: true,
    links: {
      shopee:
        "https://shopee.co.id/search?keyword=CR7%20Sein%20LED%20Running%20Sequential",
      tiktokShop: "https://shop.tiktok.com/",
    },
    description:
      "Lampu sein LED 12-SMD mengalir super terang dengan bodi tangkai lentur anti patah dan lensa smoke sporty. Tetap terlihat jelas di siang terik.",
  },
  {
    id: "cr7-cnc-lever-6c",
    slug: "cr7-cnc-6-click-adjustable-brake-clutch-levers",
    sku: "CR7-LVR-6C",
    name: "CR7 Racing Handle Rem & Kopling CNC 6-Click Setelan",
    category: "controls-cockpit",
    price: 195000,
    originalPrice: 235000,
    currency: "IDR",
    images: [
      {
        url: "/images/prod-cnc-levers.svg",
        alt: "Handle rem CNC aluminium hitam doff CR7 Racing dengan setelan 6 klik merah",
        label: "Utama",
      },
    ],
    variants: [
      {
        id: "var-lvr-nmax",
        name: "Yamaha NMAX — Hitam / Merah",
        sku: "CR7-LVR-NMAX",
        price: 195000,
        inStock: true,
        colorHex: "#CA0C1F",
      },
      {
        id: "var-lvr-pcx",
        name: "Honda PCX 160 ABS — Hitam / Merah",
        sku: "CR7-LVR-PCX",
        price: 199000,
        inStock: true,
        colorHex: "#18181B",
      },
      {
        id: "var-lvr-vario",
        name: "Honda Vario 160 — Hitam / Silver",
        sku: "CR7-LVR-VAR",
        price: 195000,
        inStock: true,
        colorHex: "#A1A1AA",
      },
    ],
    shortSpecs: ["CNC 6061-T6", "Setelan 6 Klik", "Anodized"],
    fullSpecs: {
      Material: "Aluminium Billet 6061-T6 Full CNC",
      "Fitur Setelan": "6 Posisi Jarak Jangkauan Jari",
      Finishing: "Hard Anodized Hitam Doff + Dial Merah Racing",
      Hardware: "Bushing Pivot Stainless Steel 304",
      Berat: "290 gram (Sepasang)",
    },
    inTheBox: [
      "1x Handle Rem Depan (Kanan)",
      "1x Handle Rem Belakang / Kopling (Kiri)",
      "1x Bushing Kuningan Terpasang",
    ],
    fitmentNotes:
      "Pilih varian tipe motor Anda (NMAX, PCX 160, Vario 160, atau Aerox) sebelum checkout di Shopee atau TikTok Shop.",
    compatibility: [
      "Yamaha NMAX",
      "Honda PCX 160",
      "Honda Vario 160",
      "Yamaha Aerox 155",
    ],
    badges: ["CNC Alloy", "Terlaris"],
    featured: true,
    inStock: true,
    links: {
      shopee:
        "https://shopee.co.id/search?keyword=Handle%20Rem%20CNC%206%20Click%20NMAX%20PCX",
      tiktokShop: "https://shop.tiktok.com/",
    },
    description:
      "Handle rem dan kopling aluminium CNC presisi dengan 6 tingkat setelan jarak untuk kenyamanan jari optimal saat macet harian maupun touring.",
  },
  {
    id: "cr7-slider-pro",
    slug: "cr7-cnc-delrin-frame-slider-crash-protector",
    sku: "CR7-SLD-02",
    name: "CR7 Racing Frame Slider CNC Delrin Pelindung Bodi & Mesin",
    category: "protection-body",
    price: 275000,
    originalPrice: 320000,
    currency: "IDR",
    images: [
      {
        url: "/images/prod-crash-guard.svg",
        alt: "Sepasang frame slider motor CNC Delrin hitam doff dengan ring merah racing",
        label: "Utama",
      },
    ],
    variants: [
      {
        id: "var-sld-red",
        name: "Hitam + Ring Merah Racing",
        sku: "CR7-SLD-RED",
        price: 275000,
        inStock: true,
        colorHex: "#CA0C1F",
      },
      {
        id: "var-sld-blk",
        name: "Full Stealth Hitam Doff",
        sku: "CR7-SLD-BLK",
        price: 275000,
        inStock: true,
        colorHex: "#18181B",
      },
      {
        id: "var-sld-gold",
        name: "Hitam + Ring Gold CNC",
        sku: "CR7-SLD-GLD",
        price: 285000,
        inStock: false,
        colorHex: "#EAB308",
      },
    ],
    shortSpecs: ["POM Delrin", "Ring CNC", "Baut M10"],
    fullSpecs: {
      "Kepala Slider": "POM Delrin Tahan Gesek Tinggi",
      "Collar Dudukan": "CNC Aluminium 6061 + Ring Anodized",
      "Spesifikasi Baut": "Baja Grade 10.9 M10 Anti Patah",
      "Panjang Total": "115mm",
      "Isi Paket": "1 Pasang (Kiri + Kanan)",
    },
    inTheBox: [
      "2x Frame Slider POM Delrin CR7 Racing",
      "2x Baut Baja High-Tensile M10",
      "2x Spacer Collar Aluminium",
    ],
    fitmentNotes:
      "Dirancang meredam benturan saat motor rebah agar fairing, bak mesin, dan radiator tetap terlindungi tanpa merusak rangka utama.",
    compatibility: [
      "Universal",
      "Kawasaki Ninja / ZX",
      "Yamaha NMAX",
      "Honda ADV 160",
    ],
    badges: ["CNC Alloy"],
    featured: true,
    inStock: true,
    links: {
      shopee:
        "https://shopee.co.id/search?keyword=Frame%20Slider%20CNC%20Motor%20Delrin",
      tiktokShop: "https://shop.tiktok.com/",
    },
    description:
      "Pelindung rangka POM Delrin yang meluncur halus di aspal dipadukan collar aluminium CNC anodized untuk proteksi maksimal bergaya racing.",
  },
  {
    id: "cr7-mount-vibe",
    slug: "cr7-anti-vibration-cnc-phone-mount-usbc",
    sku: "CR7-MNT-PD20",
    name: "CR7 Racing Holder HP Motor CNC Anti Getar + Charger USB-C",
    category: "touring-mounts",
    price: 229000,
    originalPrice: 279000,
    currency: "IDR",
    images: [
      {
        url: "/images/prod-phone-mount.svg",
        alt: "Holder HP stang motor CNC anti getar 4 titik dengan port charger USB-C",
        label: "Utama",
      },
    ],
    variants: [
      {
        id: "var-mnt-stang",
        name: "Dudukan Stang + Charger USB-C",
        sku: "CR7-MNT-BAR",
        price: 229000,
        inStock: true,
        colorHex: "#18181B",
      },
      {
        id: "var-mnt-spion",
        name: "Dudukan Spion + Charger USB-C",
        sku: "CR7-MNT-MRR",
        price: 229000,
        inStock: true,
        colorHex: "#CA0C1F",
      },
      {
        id: "var-mnt-nonchg",
        name: "Tanpa Charger (Anti Getar Saja)",
        sku: "CR7-MNT-STD",
        price: 169000,
        inStock: true,
        colorHex: "#71717A",
      },
    ],
    shortSpecs: ["Peredam 4 Titik", "PD 20W USB-C", "IP65"],
    fullSpecs: {
      "Ukuran HP": "4.7\" – 6.9\" (Lebar 65–90mm)",
      "Peredam Getar": "Modul Silikon 4 Titik Aman Kamera OIS",
      "Output Charger": "USB-C PD 20W Fast Charge (Input 12V–24V)",
      "Tipe Dudukan": "Klem Stang (22–32mm) & Adaptor Spion",
      Material: "CNC Aluminium Alloy + Baut Pengunci Stainless",
    },
    inTheBox: [
      "1x Cradle Holder HP CNC Anti Getar",
      "1x Klem Stang + Karet Shim",
      "1x Adaptor Dudukan Spion",
      "1x Kabel Power 1.5m Waterproof + Sekring",
    ],
    fitmentNotes:
      "Melindungi modul kamera OIS smartphone dari getaran mesin berfrekuensi tinggi saat perjalanan touring jarak jauh.",
    compatibility: [
      "Universal",
      "Yamaha NMAX",
      "Honda PCX 160",
      "Honda ADV 160",
      "Honda Vario 160",
    ],
    badges: ["Terlaris", "Waterproof", "CNC Alloy"],
    featured: true,
    inStock: true,
    links: {
      shopee:
        "https://shopee.co.id/search?keyword=Holder%20HP%20Motor%20Anti%20Getar%20CNC%20USB",
      tiktokShop: "https://shop.tiktok.com/",
    },
    description:
      "Holder HP aluminium CNC kelas touring dengan peredam getaran 4 titik untuk keamanan kamera smartphone plus port fast charging USB-C 20W kedap hujan.",
  },
  {
    id: "cr7-relay-40a",
    slug: "cr7-waterproof-40a-led-relay-wiring-harness",
    sku: "CR7-RLY-40A",
    name: "CR7 Racing Kabel Relay Set 40A Waterproof Lampu Tembak",
    category: "electrical-relays",
    price: 89000,
    originalPrice: 110000,
    currency: "IDR",
    images: [
      {
        url: "/images/prod-relay-harness.svg",
        alt: "Kabel relay set motor 12V 40A waterproof dengan sekring 30A dan selongsong braided",
        label: "Utama",
      },
    ],
    variants: [
      {
        id: "var-rly-1out",
        name: "1 Output (Untuk 1 Lampu)",
        sku: "CR7-RLY-1CH",
        price: 75000,
        inStock: true,
        colorHex: "#18181B",
      },
      {
        id: "var-rly-2out",
        name: "2 Output (Untuk 2 Lampu)",
        sku: "CR7-RLY-2CH",
        price: 89000,
        inStock: true,
        colorHex: "#CA0C1F",
      },
    ],
    shortSpecs: ["12V 40A", "Sekring 30A", "Kabel Braided"],
    fullSpecs: {
      "Kapasitas Relay": "DC 12V 40A Sealed Waterproof",
      "Pengaman Sekring": "Inline Blade Fuse 30A Tutup Karet",
      "Ukuran Kabel": "Tembaga Murni 16 AWG + Selongsong Nylon",
      "Jumlah Jalur": "1 atau 2 Output Lampu Tambahan",
      Konektor: "Soket Waterproof Plug & Play",
    },
    inTheBox: [
      "1x Set Kabel Relay 40A Waterproof",
      "1x Sekring Tancap 30A Terpasang",
      "4x Kabel Ties Heavy-Duty",
    ],
    fitmentNotes:
      "Wajib digunakan untuk lampu tembak atau Bi-LED 30W–120W agar arus aki langsung ke lampu tanpa membebani saklar standar motor.",
    compatibility: [
      "Universal",
      "Yamaha NMAX",
      "Honda PCX 160",
      "Honda Vario 160",
      "Honda ADV 160",
      "CRF / KLX Trail",
    ],
    badges: ["Waterproof"],
    featured: true,
    inStock: true,
    links: {
      shopee:
        "https://shopee.co.id/search?keyword=Relay%20Set%20Lampu%20Tembak%20Motor%20Waterproof",
      tiktokShop: "https://shop.tiktok.com/",
    },
    description:
      "Kabel relay set tembaga murni berbalut braided khusus lampu tembak daya besar. Menjaga tegangan tetap maksimal dan kelistrikan motor aman.",
  },
  {
    id: "cr7-mirror-barend",
    slug: "cr7-cnc-stealth-bar-end-mirrors-anti-glare",
    sku: "CR7-MRR-BE01",
    name: "CR7 Racing Spion Bar-End Jalu CNC Stealth (Kaca Biru Anti Silau)",
    category: "controls-cockpit",
    price: 165000,
    originalPrice: 199000,
    currency: "IDR",
    images: [
      {
        url: "/images/prod-bar-end-mirrors.svg",
        alt: "Sepasang spion bar-end CNC hitam doff dengan kaca biru cembung anti silau",
        label: "Utama",
      },
    ],
    variants: [
      {
        id: "var-mrr-blue",
        name: "Hitam Doff — Kaca Biru Anti Silau",
        sku: "CR7-MRR-BLU",
        price: 165000,
        inStock: true,
        colorHex: "#3B82F6",
      },
      {
        id: "var-mrr-clear",
        name: "Hitam Doff — Kaca Bening HD",
        sku: "CR7-MRR-CLR",
        price: 155000,
        inStock: true,
        colorHex: "#E4E4E7",
      },
    ],
    shortSpecs: ["Kaca Biru", "Stang 22mm", "CNC Alloy"],
    fullSpecs: {
      Kaca: "Cembung Biru Optik Anti Silau Malam",
      Bodi: "Aluminium CNC 6061 Hitam Doff",
      "Cocok Stang": "Stang Hollow Standar 22mm (7/8\")",
      Setelan: "Ball-Joint Putar 360°",
      "Isi Paket": "1 Pasang (Kiri + Kanan)",
    },
    inTheBox: [
      "2x Spion Bar-End CNC Stealth CR7 Racing",
      "2x Jalu Ekspansi Aluminium (13mm–18mm)",
      "1x Kunci L Pemasangan",
    ],
    fitmentNotes:
      "Dapat dipasang langsung ke lubang ujung stang 22mm atau menjepit di luar jalu. Mengurangi pantulan lampu jauh kendaraan belakang.",
    compatibility: [
      "Universal",
      "Yamaha NMAX",
      "Yamaha Aerox 155",
      "Honda PCX 160",
      "Kawasaki Ninja / ZX",
    ],
    badges: ["CNC Alloy", "Baru"],
    featured: true,
    inStock: true,
    links: {
      shopee:
        "https://shopee.co.id/search?keyword=Spion%20Bar%20End%20CNC%20Anti%20Silau",
      tiktokShop: "https://shop.tiktok.com/",
    },
    description:
      "Spion jalu CNC berprofil tajam dengan kaca cembung biru anti silau untuk tampilan kokpit bersih dan visibilitas belakang lebih luas.",
  },
  {
    id: "cr7-tail-blade",
    slug: "cr7-twin-blade-smoked-led-tail-light",
    sku: "CR7-TL-NMAX",
    name: "CR7 Racing Stoplamp LED 3-in-1 Twin Blade Smoke + Sein",
    category: "signals-tail-lights",
    price: 415000,
    originalPrice: 485000,
    currency: "IDR",
    images: [
      {
        url: "/images/prod-tail-light.svg",
        alt: "Stoplamp LED twin blade smoke dengan lampu senja merah dan sein kuning terintegrasi",
        label: "Utama",
      },
    ],
    variants: [
      {
        id: "var-tl-nmax",
        name: "Yamaha NMAX New — Mika Smoke",
        sku: "CR7-TL-NMXN",
        price: 415000,
        inStock: true,
        colorHex: "#CA0C1F",
      },
      {
        id: "var-tl-aerox",
        name: "Yamaha Aerox Connected — Mika Smoke",
        sku: "CR7-TL-ARXC",
        price: 425000,
        inStock: true,
        colorHex: "#18181B",
      },
    ],
    shortSpecs: ["3-in-1 DRL", "Plug & Play", "Mika Smoke"],
    fullSpecs: {
      Fungsi: "Lampu Senja Merah + Rem Terang + Sein Running Kuning",
      "Jenis Mika": "Akrilik Smoke Gelap Tahan Benturan",
      Pemasangan: "Soket OEM Plug & Play Tanpa Potong Kabel",
      Tegangan: "DC 12V",
      "Ketahanan Air": "IP67 Ultrasonic Sealed",
    },
    inTheBox: [
      "1x Unit Stoplamp LED Twin Blade Smoke",
      "1x Soket Adaptor OEM Plug & Play",
    ],
    fitmentNotes:
      "Pengganti langsung stoplamp bawaan tanpa ubahan kabel. Tersedia di Shopee Official CR7 Racing.",
    compatibility: ["Yamaha NMAX", "Yamaha Aerox 155"],
    badges: ["Baru", "Waterproof"],
    featured: false,
    inStock: true,
    links: {
      shopee:
        "https://shopee.co.id/search?keyword=Stoplamp%20LED%203in1%20Smoke%20NMAX",
    },
    description:
      "Lampu belakang 3-in-1 bermika smoke agresif yang memadukan bar DRL twin-blade, lampu rem matriks terang, dan sein sequential terintegrasi.",
  },
  {
    id: "cr7-switch-3m",
    slug: "cr7-cnc-waterproof-3-mode-pass-beam-switch",
    sku: "CR7-SW-3M",
    name: "CR7 Racing Saklar Stang CNC 3 Mode + Tombol Pass Beam",
    category: "controls-cockpit",
    price: 98000,
    currency: "IDR",
    images: [
      {
        url: "/images/prod-switch-3mode.svg",
        alt: "Saklar stang motor CNC waterproof 3 mode dengan tombol dim pass beam kuning",
        label: "Utama",
      },
    ],
    variants: [
      {
        id: "var-sw-bar",
        name: "Dudukan Klem Stang 22mm",
        sku: "CR7-SW-BAR",
        price: 98000,
        inStock: true,
        colorHex: "#18181B",
      },
      {
        id: "var-sw-mrr",
        name: "Dudukan Baut Spion",
        sku: "CR7-SW-MRR",
        price: 98000,
        inStock: true,
        colorHex: "#CA0C1F",
      },
    ],
    shortSpecs: ["3 Mode + Dim", "IP67 Sealed", "Klem 22mm"],
    fullSpecs: {
      Tombol: "Saklar Utama + Pilih Hi/Lo + Tombol Pass Beam Instan",
      Bodi: "Blok Aluminium CNC Anodized",
      Dudukan: "Klem Stang 22mm / Breket Spion",
      "Panjang Kabel": "60cm Kabel Waterproof Berwarna",
    },
    inTheBox: [
      "1x Saklar CNC 3 Mode CR7 Racing",
      "1x Breket Dudukan Spion",
    ],
    fitmentNotes:
      "Kontroler ideal untuk lampu tembak SQL 3 Mata atau mini projector 2 warna. Tersedia bundling spesial di TikTok Shop.",
    compatibility: [
      "Universal",
      "Yamaha NMAX",
      "Honda PCX 160",
      "Honda Vario 160",
      "Honda ADV 160",
    ],
    badges: ["CNC Alloy", "Waterproof"],
    featured: false,
    inStock: true,
    links: {
      tiktokShop: "https://shop.tiktok.com/",
    },
    description:
      "Saklar aluminium kedap air yang ringkas dengan pemilih warna Hi/Lo dan tombol Pass Beam ibu jari untuk kode dim instan saat menyalip.",
  },
];

export const SEED_HOME_CONTENT: HomeContent = {
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
