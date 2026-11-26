import fs from "node:fs/promises";
import path from "node:path";
import {
  AlignmentType,
  BorderStyle,
  Document,
  Footer,
  Header,
  HeadingLevel,
  ImageRun,
  Packer,
  PageNumber,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  VerticalAlign,
  WidthType,
} from "docx";

interface FeatureItem {
  no: number;
  title: string;
  scope: string;
  price: number;
}

interface DeploymentItem {
  no: number;
  component: string;
  recommendation: string;
  billingCycle: string;
}

const BRAND_RED = "CA0C1F";
const BRAND_DARK = "111111";
const TEXT_DARK = "18181B";
const TEXT_MUTED = "52525B";
const BORDER_GRAY = "D4D4D8";
const ROW_ALT_BG = "F8F8FA";
const HEADER_TINT = "FEF2F2";

const FEATURES: readonly FeatureItem[] = [
  {
    no: 1,
    title: "Desain UI/UX & Branding Responsif (Desktop & Mobile)",
    scope:
      "Desain identitas visual CR7 Racing (hitam-merah), navigasi sticky + menu drawer mobile, footer lengkap dengan tautan sosial media (Instagram, Facebook, YouTube, TikTok), integrasi logo & favicon resmi, serta dukungan mode Terang/Gelap (Light & Dark Mode).",
    price: 600_000,
  },
  {
    no: 2,
    title: "Halaman Beranda (Home Showcase) & Spotlight Carousel",
    scope:
      "Banner hero dinamis, strip kepercayaan toko resmi, filter cepat berdasarkan tipe motor, grid kategori produk, etalase produk unggulan, serta Spotlight Carousel interaktif yang dapat diatur langsung dari panel admin.",
    price: 550_000,
  },
  {
    no: 3,
    title: "Katalog Produk, Pencarian Instan (Ctrl+K) & Filter Multi-Kriteria",
    scope:
      "Halaman indeks katalog lengkap dengan filter kategori, kecocokan tipe motor, status ketersediaan stok, sortir harga, pencarian cepat Ctrl+K, kartu produk dengan pratinjau foto kedua saat hover, serta modal Lihat Cepat (Quick View).",
    price: 650_000,
  },
  {
    no: 4,
    title: "Halaman Detail Produk (PDP), Multi-Foto, Varian & Integrasi Marketplace",
    scope:
      "Galeri multi-foto interaktif (hingga 10 foto per produk), pemilih varian warna/SKU/harga otomatis, tab spesifikasi teknis, kelengkapan paket, catatan pasang, FAQ akordeon, tombol beli langsung ke Shopee & TikTok Shop, serta tombol konsultasi WhatsApp melayang.",
    price: 650_000,
  },
  {
    no: 5,
    title: "Halaman Tentang Kami & Showcase Video YouTube",
    scope:
      "Profil merek CR7 Racing, keunggulan standar kualitas & ketahanan air IP67, pemutar video YouTube interaktif (uji sorot malam & tutorial pemasangan), serta informasi jam operasional dan kontak resmi.",
    price: 300_000,
  },
  {
    no: 6,
    title: "Backend Database PostgreSQL, Prisma ORM & REST API",
    scope:
      "Perancangan skema database relasional ternormalisasi (AdminUser, Category, Motorcycle, Product, ProductVariant, HomeSettings, HomeHighlight), migrasi Prisma, seeding awal 10 produk katalog, serta seluruh endpoint REST API publik dan admin.",
    price: 700_000,
  },
  {
    no: 7,
    title: "Panel Admin Tersembunyi (CMS Lengkap)",
    scope:
      "Dashboard ringkasan KPI, manajemen CRUD Produk (multi-varian & toggle stok cepat), CRUD Kategori, CRUD Tipe Motor, serta pengaturan konten Beranda & Sorotan Carousel tanpa perlu menyentuh kode.",
    price: 600_000,
  },
  {
    no: 8,
    title: "Upload Multi-Foto, Konversi .webp Otomatis & Integrasi Cloudflare R2",
    scope:
      "Unggah banyak foto produk sekaligus (Drag & Drop, atur urutan, pilih foto utama, alt text SEO), konversi & kompresi otomatis ke format .webp menggunakan Sharp (hapus metadata EXIF), integrasi penyimpanan bucket Cloudflare R2 (siap 200+ gambar), serta pembersihan otomatis file tidak terpakai.",
    price: 350_000,
  },
  {
    no: 9,
    title: "Keamanan Aplikasi, Autentikasi JWT & Kelola Akun Admin Database",
    scope:
      "Autentikasi 100% berbasis database PostgreSQL (enkripsi password scrypt), sesi token JWT HS256 (HttpOnly, SameSite=Strict) dengan pencabutan sesi real-time, halaman Kelola Akun Admin (/admin/users) dengan peran SUPER_ADMIN & ADMIN, rate limiting anti brute-force, proteksi CSRF, CSP & security headers, serta audit log.",
    price: 350_000,
  },
  {
    no: 10,
    title: "Optimasi Technical SEO & Automated End-to-End Testing",
    scope:
      "Konfigurasi robots.txt, sitemap.xml dinamis dari database, manifest.webmanifest, Open Graph image otomatis (1200x630), Structured Data JSON-LD (Organization, WebSite, Product, BreadcrumbList, FAQPage, VideoObject), serta 17 skenario pengujian otomatis proses bisnis End-to-End.",
    price: 250_000,
  },
];

const DEPLOYMENT_ITEMS: readonly DeploymentItem[] = [
  {
    no: 1,
    component: "Domain Utama (.com)",
    recommendation:
      "Pendaftaran & perpanjangan domain resmi .com (Cloudflare Registrar / Porkbun / Rumahweb / Niagahoster).",
    billingCycle: "Tahunan",
  },
  {
    no: 2,
    component: "Server / Hosting Aplikasi (Next.js 16)",
    recommendation:
      "Server produksi komersial untuk menjalankan aplikasi Next.js SSR & API (Vercel Pro / VPS Singapore + Coolify / Cloudflare Workers).",
    billingCycle: "Bulanan / Tahunan",
  },
  {
    no: 3,
    component: "Managed Database PostgreSQL",
    recommendation:
      "Database PostgreSQL produksi region Singapore (ap-southeast-1) untuk akses cepat dari Indonesia (Neon PostgreSQL / Supabase PostgreSQL).",
    billingCycle: "Bulanan",
  },
  {
    no: 4,
    component: "Bucket Object Storage (200+ Gambar)",
    recommendation:
      "Penyimpanan file gambar produk .webp & banner dengan CDN global bebas biaya egress (Cloudflare R2 / Supabase Storage).",
    billingCycle: "Bulanan",
  },
  {
    no: 5,
    component: "SSL Certificate, DNS & CDN",
    recommendation:
      "Sertifikat HTTPS otomatis, proteksi DDoS dasar, dan distribusi konten cepat (Cloudflare DNS / bawaan hosting).",
    billingCycle: "Tahunan / Termasuk",
  },
  {
    no: 6,
    component: "Setup & Konfigurasi Deployment (Opsional)",
    recommendation:
      "Pengaturan DNS domain, environment produksi, migrasi & seed database awal, integrasi bucket R2, dan verifikasi Google Search Console.",
    billingCycle: "Sekali Bayar",
  },
];

function formatRupiah(amount: number): string {
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

function cellBorders(color = BORDER_GRAY) {
  return {
    top: { style: BorderStyle.SINGLE, size: 4, color },
    bottom: { style: BorderStyle.SINGLE, size: 4, color },
    left: { style: BorderStyle.SINGLE, size: 4, color },
    right: { style: BorderStyle.SINGLE, size: 4, color },
  };
}

function cellMargins() {
  return { top: 110, bottom: 110, left: 130, right: 130 };
}

function createHeaderCell(
  text: string,
  widthPct: number,
  align: (typeof AlignmentType)[keyof typeof AlignmentType] = AlignmentType.LEFT
): TableCell {
  return new TableCell({
    width: { size: widthPct, type: WidthType.PERCENTAGE },
    shading: { type: ShadingType.CLEAR, fill: BRAND_DARK, color: "auto" },
    verticalAlign: VerticalAlign.CENTER,
    margins: cellMargins(),
    borders: cellBorders(BRAND_DARK),
    children: [
      new Paragraph({
        alignment: align,
        children: [
          new TextRun({
            text,
            bold: true,
            color: "FFFFFF",
            size: 19,
          }),
        ],
      }),
    ],
  });
}

function createSectionHeading(label: string): Paragraph {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 320, after: 120 },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 8, color: BRAND_RED },
    },
    children: [
      new TextRun({
        text: label,
        bold: true,
        color: BRAND_DARK,
        size: 24,
      }),
    ],
  });
}

async function buildProposalDocument(): Promise<Document> {
  const totalBudget = FEATURES.reduce((sum, item) => sum + item.price, 0);
  if (totalBudget !== 5_000_000) {
    throw new Error(`Expected total budget 5,000,000 IDR, got ${totalBudget}`);
  }

  let logoBuffer: Buffer | null = null;
  try {
    logoBuffer = await fs.readFile(
      path.resolve(process.cwd(), "public", "images", "cr7-logo.png")
    );
  } catch {
    logoBuffer = null;
  }

  // Header Banner Table (Dark bar with Logo + Document Title)
  const bannerTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 30, type: WidthType.PERCENTAGE },
            shading: { type: ShadingType.CLEAR, fill: BRAND_DARK, color: "auto" },
            verticalAlign: VerticalAlign.CENTER,
            margins: { top: 180, bottom: 180, left: 200, right: 120 },
            borders: cellBorders(BRAND_DARK),
            children: logoBuffer
              ? [
                  new Paragraph({
                    children: [
                      new ImageRun({
                        type: "png",
                        data: logoBuffer,
                        transformation: { width: 135, height: 56 },
                        altText: {
                          name: "CR7 Racing Logo",
                          description: "Logo resmi CR7 Racing",
                          title: "CR7 Racing",
                        },
                      }),
                    ],
                  }),
                ]
              : [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "CR7 RACING",
                        bold: true,
                        color: "FFFFFF",
                        size: 32,
                      }),
                    ],
                  }),
                ],
          }),
          new TableCell({
            width: { size: 70, type: WidthType.PERCENTAGE },
            shading: { type: ShadingType.CLEAR, fill: BRAND_DARK, color: "auto" },
            verticalAlign: VerticalAlign.CENTER,
            margins: { top: 180, bottom: 180, left: 160, right: 200 },
            borders: cellBorders(BRAND_DARK),
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                spacing: { after: 60 },
                children: [
                  new TextRun({
                    text: "RINCIAN PENAWARAN HARGA & FITUR",
                    bold: true,
                    color: "FFFFFF",
                    size: 26,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: "Website Katalog Resmi & Panel Admin CR7 Racing",
                    color: "E4E4E7",
                    size: 19,
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  // Project Info Summary Table
  const metaRows = [
    ["Nama Proyek", "Pengembangan Website Katalog Resmi & CMS Admin CR7 Racing"],
    ["Klien", "CR7 Racing Indonesia"],
    ["Teknologi Utama", "Next.js 16 (TypeScript), PostgreSQL + Prisma ORM, JWT Auth, Cloudflare R2"],
    ["Total Biaya Pengembangan", `${formatRupiah(totalBudget)} (Lima Juta Rupiah)`],
    ["Biaya Infrastruktur / Deployment", "Di luar biaya pengembangan (rincian kebutuhan terlampir di Bagian B)"],
  ];

  const metaTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: metaRows.map(
      ([label, value], idx) =>
        new TableRow({
          children: [
            new TableCell({
              width: { size: 32, type: WidthType.PERCENTAGE },
              shading: {
                type: ShadingType.CLEAR,
                fill: idx === 3 ? HEADER_TINT : ROW_ALT_BG,
                color: "auto",
              },
              margins: { top: 80, bottom: 80, left: 130, right: 130 },
              borders: cellBorders(),
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: label,
                      bold: true,
                      color: TEXT_DARK,
                      size: 19,
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              width: { size: 68, type: WidthType.PERCENTAGE },
              shading: {
                type: ShadingType.CLEAR,
                fill: idx === 3 ? HEADER_TINT : "FFFFFF",
                color: "auto",
              },
              margins: { top: 80, bottom: 80, left: 130, right: 130 },
              borders: cellBorders(),
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: value,
                      bold: idx === 3,
                      color: idx === 3 ? BRAND_RED : TEXT_DARK,
                      size: 19,
                    }),
                  ],
                }),
              ],
            }),
          ],
        })
    ),
  });

  // Table A: Feature Breakdown (Total = Rp 5.000.000)
  const featureTableRows: TableRow[] = [
    new TableRow({
      tableHeader: true,
      children: [
        createHeaderCell("No", 7, AlignmentType.CENTER),
        createHeaderCell("Modul / Fitur", 28, AlignmentType.LEFT),
        createHeaderCell("Ruang Lingkup Pekerjaan", 47, AlignmentType.LEFT),
        createHeaderCell("Harga (IDR)", 18, AlignmentType.RIGHT),
      ],
    }),
    ...FEATURES.map((item, idx) => {
      const fill = idx % 2 === 1 ? ROW_ALT_BG : "FFFFFF";
      return new TableRow({
        cantSplit: true,
        children: [
          new TableCell({
            width: { size: 7, type: WidthType.PERCENTAGE },
            shading: { type: ShadingType.CLEAR, fill, color: "auto" },
            verticalAlign: VerticalAlign.TOP,
            margins: cellMargins(),
            borders: cellBorders(),
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: String(item.no),
                    bold: true,
                    color: TEXT_DARK,
                    size: 19,
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 28, type: WidthType.PERCENTAGE },
            shading: { type: ShadingType.CLEAR, fill, color: "auto" },
            verticalAlign: VerticalAlign.TOP,
            margins: cellMargins(),
            borders: cellBorders(),
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: item.title,
                    bold: true,
                    color: TEXT_DARK,
                    size: 19,
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 47, type: WidthType.PERCENTAGE },
            shading: { type: ShadingType.CLEAR, fill, color: "auto" },
            verticalAlign: VerticalAlign.TOP,
            margins: cellMargins(),
            borders: cellBorders(),
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: item.scope,
                    color: TEXT_MUTED,
                    size: 18,
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 18, type: WidthType.PERCENTAGE },
            shading: { type: ShadingType.CLEAR, fill, color: "auto" },
            verticalAlign: VerticalAlign.TOP,
            margins: cellMargins(),
            borders: cellBorders(),
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: formatRupiah(item.price),
                    bold: true,
                    color: TEXT_DARK,
                    size: 19,
                  }),
                ],
              }),
            ],
          }),
        ],
      });
    }),
    // Total Row
    new TableRow({
      cantSplit: true,
      children: [
        new TableCell({
          columnSpan: 3,
          shading: { type: ShadingType.CLEAR, fill: HEADER_TINT, color: "auto" },
          verticalAlign: VerticalAlign.CENTER,
          margins: { top: 130, bottom: 130, left: 150, right: 150 },
          borders: cellBorders(BRAND_RED),
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun({
                  text: "TOTAL BIAYA PENGEMBANGAN WEBSITE",
                  bold: true,
                  color: BRAND_DARK,
                  size: 20,
                }),
              ],
            }),
          ],
        }),
        new TableCell({
          shading: { type: ShadingType.CLEAR, fill: BRAND_RED, color: "auto" },
          verticalAlign: VerticalAlign.CENTER,
          margins: { top: 130, bottom: 130, left: 130, right: 130 },
          borders: cellBorders(BRAND_RED),
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun({
                  text: formatRupiah(totalBudget),
                  bold: true,
                  color: "FFFFFF",
                  size: 21,
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  ];

  const featureTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: featureTableRows,
  });

  // Table B: Deployment & Infrastructure Needs (Price column intentionally BLANK!)
  const deploymentTableRows: TableRow[] = [
    new TableRow({
      tableHeader: true,
      children: [
        createHeaderCell("No", 7, AlignmentType.CENTER),
        createHeaderCell("Komponen Infrastruktur", 26, AlignmentType.LEFT),
        createHeaderCell("Kebutuhan & Rekomendasi Layanan", 37, AlignmentType.LEFT),
        createHeaderCell("Siklus", 14, AlignmentType.CENTER),
        createHeaderCell("Biaya (IDR)", 16, AlignmentType.RIGHT),
      ],
    }),
    ...DEPLOYMENT_ITEMS.map((item, idx) => {
      const fill = idx % 2 === 1 ? ROW_ALT_BG : "FFFFFF";
      return new TableRow({
        cantSplit: true,
        children: [
          new TableCell({
            width: { size: 7, type: WidthType.PERCENTAGE },
            shading: { type: ShadingType.CLEAR, fill, color: "auto" },
            verticalAlign: VerticalAlign.TOP,
            margins: cellMargins(),
            borders: cellBorders(),
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: String(item.no),
                    bold: true,
                    color: TEXT_DARK,
                    size: 19,
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 26, type: WidthType.PERCENTAGE },
            shading: { type: ShadingType.CLEAR, fill, color: "auto" },
            verticalAlign: VerticalAlign.TOP,
            margins: cellMargins(),
            borders: cellBorders(),
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: item.component,
                    bold: true,
                    color: TEXT_DARK,
                    size: 19,
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 37, type: WidthType.PERCENTAGE },
            shading: { type: ShadingType.CLEAR, fill, color: "auto" },
            verticalAlign: VerticalAlign.TOP,
            margins: cellMargins(),
            borders: cellBorders(),
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: item.recommendation,
                    color: TEXT_MUTED,
                    size: 18,
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 14, type: WidthType.PERCENTAGE },
            shading: { type: ShadingType.CLEAR, fill, color: "auto" },
            verticalAlign: VerticalAlign.TOP,
            margins: cellMargins(),
            borders: cellBorders(),
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: item.billingCycle,
                    color: TEXT_DARK,
                    size: 18,
                  }),
                ],
              }),
            ],
          }),
          // Intentionally blank price cell for client/developer to fill in later
          new TableCell({
            width: { size: 16, type: WidthType.PERCENTAGE },
            shading: { type: ShadingType.CLEAR, fill, color: "auto" },
            verticalAlign: VerticalAlign.CENTER,
            margins: cellMargins(),
            borders: cellBorders(),
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [new TextRun({ text: "", size: 19 })],
              }),
            ],
          }),
        ],
      });
    }),
    // Blank subtotal row for Deployment
    new TableRow({
      cantSplit: true,
      children: [
        new TableCell({
          columnSpan: 4,
          shading: { type: ShadingType.CLEAR, fill: ROW_ALT_BG, color: "auto" },
          verticalAlign: VerticalAlign.CENTER,
          margins: { top: 120, bottom: 120, left: 150, right: 150 },
          borders: cellBorders(BRAND_DARK),
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun({
                  text: "TOTAL BIAYA INFRASTRUKTUR & DEPLOYMENT",
                  bold: true,
                  color: BRAND_DARK,
                  size: 19,
                }),
              ],
            }),
          ],
        }),
        new TableCell({
          shading: { type: ShadingType.CLEAR, fill: "FFFFFF", color: "auto" },
          verticalAlign: VerticalAlign.CENTER,
          margins: { top: 120, bottom: 120, left: 130, right: 130 },
          borders: cellBorders(BRAND_DARK),
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [new TextRun({ text: "", bold: true, size: 19 })],
            }),
          ],
        }),
      ],
    }),
  ];

  const deploymentTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: deploymentTableRows,
  });

  // Signature Table
  const signatureTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            borders: cellBorders("FFFFFF"),
            margins: { top: 100, bottom: 100, left: 100, right: 100 },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 900 },
                children: [
                  new TextRun({
                    text: "Pihak Pengembang,",
                    bold: true,
                    size: 19,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: "( __________________________________ )",
                    color: TEXT_MUTED,
                    size: 19,
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            borders: cellBorders("FFFFFF"),
            margins: { top: 100, bottom: 100, left: 100, right: 100 },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 900 },
                children: [
                  new TextRun({
                    text: "Disetujui Oleh (Klien — CR7 Racing),",
                    bold: true,
                    size: 19,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: "( __________________________________ )",
                    color: TEXT_MUTED,
                    size: 19,
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  return new Document({
    creator: "CR7 Racing Development Team",
    title: "Penawaran Harga & Rincian Fitur Website CR7 Racing",
    description:
      "Dokumen rincian harga pengembangan website katalog & admin CR7 Racing (Rp 5.000.000) beserta daftar kebutuhan infrastruktur deployment.",
    styles: {
      default: {
        document: {
          run: {
            font: "Calibri",
            size: 20,
            color: TEXT_DARK,
          },
          paragraph: {
            spacing: { line: 276 },
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 900,
              right: 900,
              bottom: 900,
              left: 900,
            },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: "CR7 Racing · Penawaran Harga Pengembangan Website & Kebutuhan Deployment",
                    color: TEXT_MUTED,
                    size: 16,
                  }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: "Dokumen Rahasia Klien — Halaman ",
                    color: TEXT_MUTED,
                    size: 16,
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    color: TEXT_MUTED,
                    size: 16,
                  }),
                  new TextRun({
                    text: " dari ",
                    color: TEXT_MUTED,
                    size: 16,
                  }),
                  new TextRun({
                    children: [PageNumber.TOTAL_PAGES],
                    color: TEXT_MUTED,
                    size: 16,
                  }),
                ],
              }),
            ],
          }),
        },
        children: [
          bannerTable,
          new Paragraph({ spacing: { before: 180, after: 80 }, children: [] }),
          metaTable,

          // Ringkasan Eksekutif
          createSectionHeading("Ringkasan Eksekutif"),
          new Paragraph({
            spacing: { after: 140 },
            children: [
              new TextRun({
                text: "Dokumen ini menyajikan rincian lengkap biaya pengembangan website katalog resmi ",
                size: 20,
              }),
              new TextRun({
                text: "CR7 Racing",
                bold: true,
                size: 20,
              }),
              new TextRun({
                text: " beserta panel administrasi berbasis database PostgreSQL yang terintegrasi penuh dengan toko resmi Shopee, TikTok Shop, WhatsApp, serta penyimpanan media Cloudflare R2 (kapasitas siap 200+ foto produk berformat .webp otomatis). Seluruh biaya pengembangan disusun transparan sesuai anggaran klien sebesar ",
                size: 20,
              }),
              new TextRun({
                text: formatRupiah(totalBudget),
                bold: true,
                color: BRAND_RED,
                size: 20,
              }),
              new TextRun({
                text: ".",
                size: 20,
              }),
            ],
          }),

          // Section A: Feature Breakdown
          createSectionHeading("A. Rincian Harga Pengembangan per Fitur"),
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: "Seluruh modul di bawah ini merupakan pekerjaan pengembangan aplikasi (frontend, backend API, database, keamanan, SEO, dan pengujian) dengan total biaya tetap sebesar Rp 5.000.000:",
                color: TEXT_MUTED,
                size: 19,
              }),
            ],
          }),
          featureTable,

          // Section B: Deployment & Infrastructure Requirements (Blank Prices)
          createSectionHeading(
            "B. Kebutuhan Infrastruktur & Deployment (Di Luar Biaya Pengembangan)"
          ),
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: "Agar website dapat diakses publik secara online dengan performa cepat di Indonesia dan mampu menampung lebih dari 200 gambar produk, berikut daftar komponen infrastruktur pihak ketiga yang dibutuhkan. Kolom ",
                color: TEXT_MUTED,
                size: 19,
              }),
              new TextRun({
                text: "Biaya (IDR)",
                bold: true,
                color: TEXT_DARK,
                size: 19,
              }),
              new TextRun({
                text: " sengaja dikosongkan agar dapat diisi sesuai penyedia layanan dan paket yang disepakati:",
                color: TEXT_MUTED,
                size: 19,
              }),
            ],
          }),
          deploymentTable,

          new Paragraph({
            spacing: { before: 140, after: 140 },
            children: [
              new TextRun({
                text: "Catatan Infrastruktur: ",
                bold: true,
                color: BRAND_RED,
                size: 18,
              }),
              new TextRun({
                text: "Seluruh akun domain, server/hosting, database PostgreSQL, dan bucket storage Cloudflare R2 didaftarkan langsung atas nama klien (CR7 Racing) sehingga kepemilikan aset digital 100% berada di pihak klien.",
                color: TEXT_MUTED,
                size: 18,
              }),
            ],
          }),

          // Section C: Payment & Warranty Terms
          createSectionHeading("C. Ketentuan Pembayaran & Garansi"),
          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 60 },
            children: [
              new TextRun({
                text: "Termin 1 (DP 50% — Rp 2.500.000): ",
                bold: true,
                size: 19,
              }),
              new TextRun({
                text: "Dibayarkan saat persetujuan ruang lingkup dan dimulainya proses implementasi/finalisasi.",
                size: 19,
              }),
            ],
          }),
          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 60 },
            children: [
              new TextRun({
                text: "Termin 2 (Pelunasan 50% — Rp 2.500.000): ",
                bold: true,
                size: 19,
              }),
              new TextRun({
                text: "Dibayarkan setelah seluruh fitur selesai diuji (UAT / serah terima) dan siap dipublikasikan.",
                size: 19,
              }),
            ],
          }),
          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 60 },
            children: [
              new TextRun({
                text: "Garansi Pemeliharaan (30 Hari): ",
                bold: true,
                size: 19,
              }),
              new TextRun({
                text: "Mencakup perbaikan bug teknis pada fitur yang tercantum di Bagian A setelah serah terima (tidak mencakup penambahan fitur baru di luar ruang lingkup).",
                size: 19,
              }),
            ],
          }),
          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 180 },
            children: [
              new TextRun({
                text: "Serah Terima Aset: ",
                bold: true,
                size: 19,
              }),
              new TextRun({
                text: "Meliputi seluruh source code aplikasi, skema & seed database Prisma, panduan penggunaan panel admin, serta akses penuh akun Super Admin.",
                size: 19,
              }),
            ],
          }),

          // Section D: Sign-off
          createSectionHeading("D. Lembar Persetujuan"),
          new Paragraph({
            spacing: { after: 180 },
            children: [
              new TextRun({
                text: "Dengan menandatangani dokumen ini, kedua belah pihak menyetujui rincian fitur, total biaya pengembangan sebesar Rp 5.000.000, serta daftar kebutuhan infrastruktur deployment di atas.",
                color: TEXT_MUTED,
                size: 19,
              }),
            ],
          }),
          signatureTable,
        ],
      },
    ],
  });
}

async function main() {
  const outDir = path.resolve(process.cwd(), "docs");
  await fs.mkdir(outDir, { recursive: true });
  const outPath = path.resolve(
    outDir,
    "Penawaran_Harga_Website_CR7_Racing.docx"
  );

  const doc = await buildProposalDocument();
  const buffer = await Packer.toBuffer(doc);
  await fs.writeFile(outPath, buffer);

  console.log(`DOCX_GENERATED=${outPath}`);
  console.log(`BYTES=${buffer.length}`);
}

main().catch((err) => {
  console.error("Failed to generate DOCX:", err);
  process.exit(1);
});
