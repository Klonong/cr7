import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Clock,
  ExternalLink,
  Gauge,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { YoutubeShowcase } from "@/components/about/youtube-showcase";
import { OfficialStoreLinks } from "@/components/shared/official-store-links";
import { STORE_CONFIG } from "@/config/store";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description:
    "Mengenal CR7 Racing — penyedia aksesoris motor, lampu LED Bi-LED & SQL projector, serta part CNC presisi dengan toko resmi Shopee, TikTok Shop, dan channel YouTube.",
};

const BRAND_VALUES = [
  {
    icon: ShieldCheck,
    title: "Kualitas Terjamin & Original",
    description:
      "Setiap unit melewati kontrol kualitas ketat (QC) sebelum dikirim agar arus stabil, lensa jernih, dan tahan cuaca ekstrem Indonesia.",
  },
  {
    icon: Gauge,
    title: "Spesifikasi Transparan & Terukur",
    description:
      "Kami mencantumkan watt real, suhu warna Kelvin, dan ketahanan air IP67 secara jujur agar pengendara mendapatkan performa nyata di jalan.",
  },
  {
    icon: Wrench,
    title: "Dukungan Teknis & Kecocokan Motor",
    description:
      "Bingung memilih ukuran lensa atau breket untuk motor Anda? Tim kami siap membantu konsultasi langsung via WhatsApp.",
  },
  {
    icon: Award,
    title: "Transaksi Aman di Marketplace Resmi",
    description:
      "Semua pembelian diproses melalui Shopee dan TikTok Shop resmi CR7 Racing lengkap dengan proteksi pembeli, voucher, dan COD.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-[1320px] px-4 py-8 sm:px-6 lg:px-8 space-y-14">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/" />}>Beranda</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Tentang Kami</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Hero Story */}
      <section className="overflow-hidden rounded-2xl border border-border bg-[#000000] text-[#fefefe] p-6 sm:p-10 lg:p-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 space-y-5">
            <Badge className="bg-primary text-primary-foreground font-mono text-xs">
              TENTANG CR7 RACING
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.1]">
              Dirancang untuk Pengendara yang Mengutamakan Performa &amp; Keamanan.
            </h1>
            <p className="text-sm sm:text-base leading-relaxed text-zinc-300 max-w-2xl">
              <strong className="text-[#fefefe]">{STORE_CONFIG.brandName}</strong>{" "}
              hadir sebagai pusat katalog resmi lampu LED motor (Bi-LED
              Projector, SQL Laser, Sein Sequential) serta aksesoris CNC
              presisi. Kami menggabungkan desain racing, ketahanan hujan IP67,
              dan kemudahan belanja melalui toko resmi Shopee serta TikTok Shop.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                href="/products"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-11 gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-5 font-semibold"
                )}
              >
                <span>Jelajahi Katalog</span>
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <a
                href={STORE_CONFIG.whatsappConsultUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-11 gap-2 border-white/25 bg-white/10 text-[#fefefe] hover:bg-white/20 hover:text-[#fefefe] px-5 font-semibold"
                )}
              >
                <MessageCircle className="size-4 text-[#25D366]" aria-hidden="true" />
                <span>Konsultasi WhatsApp</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-white/15 bg-zinc-900/90 p-5 space-y-1">
              <p className="font-mono text-3xl font-extrabold text-primary">
                50K+
              </p>
              <p className="text-xs text-zinc-300">
                Unit lampu &amp; part CNC terkirim ke seluruh Indonesia
              </p>
            </div>
            <div className="rounded-xl border border-white/15 bg-zinc-900/90 p-5 space-y-1">
              <p className="font-mono text-3xl font-extrabold text-[#fefefe]">
                IP67
              </p>
              <p className="text-xs text-zinc-300">
                Standar ketahanan air &amp; debu untuk cuaca tropis
              </p>
            </div>
            <div className="rounded-xl border border-white/15 bg-zinc-900/90 p-5 space-y-1">
              <p className="font-mono text-3xl font-extrabold text-[#fefefe]">
                100%
              </p>
              <p className="text-xs text-zinc-300">
                Produk original bergaransi resmi CR7 Racing
              </p>
            </div>
            <div className="rounded-xl border border-white/15 bg-zinc-900/90 p-5 space-y-1">
              <p className="font-mono text-3xl font-extrabold text-primary">
                24/7
              </p>
              <p className="text-xs text-zinc-300">
                Katalog online &amp; order cepat di Shopee / TikTok Shop
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Pillars */}
      <section className="space-y-6">
        <div className="space-y-1">
          <p className="font-mono text-xs font-semibold uppercase tracking-wider text-primary">
            Keunggulan Kami
          </p>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
            Mengapa Pengendara Memilih CR7 Racing?
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BRAND_VALUES.map((item) => {
            const Icon = item.icon;
            return (
              <Card
                key={item.title}
                className="rounded-xl border border-border bg-card p-5 ring-0 gap-3"
              >
                <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <div className="space-y-1.5">
                  <h3 className="text-sm font-bold text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Official YouTube Channel & Embedded Video Player */}
      <YoutubeShowcase />

      {/* Store Info & Official Marketplace Links */}
      <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
              Belanja Resmi &amp; Hubungi Tim CR7 Racing
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Website ini adalah katalog resmi untuk melihat detail produk,
              varian, dan kecocokan motor. Seluruh transaksi, promo voucher, dan
              pengiriman dilakukan melalui toko resmi kami di Shopee dan TikTok
              Shop.
            </p>
            <div className="flex flex-wrap gap-5 text-sm text-muted-foreground pt-1">
              <span className="inline-flex items-center gap-2">
                <Clock className="size-4 text-primary" aria-hidden="true" />
                {STORE_CONFIG.operatingHours}
              </span>
              <span className="inline-flex items-center gap-2">
                <MapPin className="size-4 text-primary" aria-hidden="true" />
                {STORE_CONFIG.location}
              </span>
            </div>
            <ul className="space-y-1.5 text-xs text-muted-foreground pt-1">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-3.5 text-status-success" aria-hidden="true" />
                <span>Pengemasan aman dengan bubble wrap tebal</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-3.5 text-status-success" aria-hidden="true" />
                <span>Gratis konsultasi tipe soket &amp; instalasi relay via WhatsApp</span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-5 space-y-3">
            <OfficialStoreLinks
              layout="stack"
              shopeeLabel="Toko Resmi Shopee CR7 Racing"
              tiktokLabel="Toko Resmi TikTok Shop CR7 Racing"
            />
            <a
              href={STORE_CONFIG.whatsappConsultUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-10 min-h-[44px] w-full justify-between px-3.5 text-xs sm:text-sm font-semibold"
              )}
            >
              <span className="inline-flex items-center gap-2">
                <MessageCircle className="size-4 text-[#25D366]" aria-hidden="true" />
                <span>Chat Admin WhatsApp</span>
              </span>
              <ExternalLink className="size-3.5 opacity-70" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
