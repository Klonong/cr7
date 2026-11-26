import Link from "next/link";
import {
  Clock,
  ExternalLink,
  MapPin,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import {
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
  YouTubeIcon,
} from "@/components/icons/marketplace-icons";
import { Separator } from "@/components/ui/separator";
import { buttonVariants } from "@/components/ui/button";
import { BrandLogo } from "@/components/shared/brand-logo";
import { OfficialStoreLinks } from "@/components/shared/official-store-links";
import { STORE_CONFIG } from "@/config/store";
import { CATEGORIES } from "@/data/categories";
import { cn } from "@/lib/utils";

const SOCIAL_LINKS = [
  {
    name: "Instagram",
    href: STORE_CONFIG.instagramUrl,
    icon: InstagramIcon,
  },
  {
    name: "Facebook",
    href: STORE_CONFIG.facebookUrl,
    icon: FacebookIcon,
  },
  {
    name: "YouTube",
    href: STORE_CONFIG.youtubeChannelUrl,
    icon: YouTubeIcon,
  },
  {
    name: "TikTok",
    href: STORE_CONFIG.tiktokUrl,
    icon: TikTokIcon,
  },
] as const;

export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/15 bg-[#000000] text-[#fefefe]">
      <div className="mx-auto max-w-[1320px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div className="space-y-4">
            <BrandLogo href="/" onDark />
            <p className="text-sm leading-relaxed text-zinc-400">
              Katalog digital resmi untuk lampu LED motor, Bi-LED projector,
              aksesoris kokpit CNC, holder touring, dan pelindung bodi. Cek
              spesifikasi lengkap di sini lalu checkout aman melalui Shopee atau
              TikTok Shop.
            </p>
            <div className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-[#fefefe]">
              <ShieldCheck
                className="size-4 text-[#22c55e] shrink-0"
                aria-hidden="true"
              />
              <span>100% Part Original &amp; Teruji</span>
            </div>
          </div>

          {/* Categories & Pages */}
          <div className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#fefefe]">
              Kategori &amp; Halaman
            </h2>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>
                <Link
                  href="/products"
                  className="hover:text-[#fefefe] transition-colors"
                >
                  Semua Aksesoris
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-[#fefefe] transition-colors"
                >
                  Tentang Kami &amp; Video YouTube
                </Link>
              </li>
              {CATEGORIES.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/products?category=${category.slug}`}
                    className="hover:text-[#fefefe] transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Official Marketplaces */}
          <div className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#fefefe]">
              Belanja di Toko Resmi
            </h2>
            <p className="text-xs leading-relaxed text-zinc-400">
              Website ini tidak memproses pembayaran langsung. Seluruh pesanan,
              voucher gratis ongkir, COD, dan proteksi pembeli ditangani di
              Shopee &amp; TikTok Shop.
            </p>
            <OfficialStoreLinks
              layout="stack"
              shopeeLabel="Shopee Resmi CR7 Racing"
              tiktokLabel="TikTok Shop Resmi CR7 Racing"
              className="pt-1"
            />
          </div>

          {/* Fitment Consultation, Hours & Socials */}
          <div className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#fefefe]">
              Konsultasi &amp; Jam Operasional
            </h2>
            <div className="space-y-2.5 text-sm text-zinc-400">
              <p className="flex items-start gap-2">
                <Clock
                  className="size-4 shrink-0 mt-0.5 text-primary"
                  aria-hidden="true"
                />
                <span>{STORE_CONFIG.operatingHours}</span>
              </p>
              <p className="flex items-start gap-2">
                <MapPin
                  className="size-4 shrink-0 mt-0.5 text-primary"
                  aria-hidden="true"
                />
                <span>{STORE_CONFIG.location}</span>
              </p>
            </div>
            <div className="flex flex-col gap-3 pt-1">
              <a
                href={STORE_CONFIG.whatsappConsultUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-10 w-full justify-between border-white/20 bg-white/10 px-3.5 text-xs font-medium text-[#fefefe] hover:bg-white/20 hover:text-[#fefefe]"
                )}
              >
                <span className="inline-flex items-center gap-2">
                  <MessageCircle
                    className="size-4 text-[#25D366]"
                    aria-hidden="true"
                  />
                  Tanya Kecocokan via WhatsApp
                </span>
                <ExternalLink
                  className="size-3.5 opacity-80"
                  aria-hidden="true"
                />
              </a>

              <div className="space-y-2 pt-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#fefefe]">
                  Ikuti Kami
                </p>
                <div className="flex items-center gap-2.5">
                  {SOCIAL_LINKS.map((social) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${social.name} ${STORE_CONFIG.brandName}`}
                        title={social.name}
                        className="inline-flex size-12 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-[#fefefe] transition-colors hover:border-primary hover:bg-primary hover:text-[#fefefe] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      >
                        <Icon className="size-6" aria-hidden="true" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-white/15" />

        <div className="flex flex-col gap-2 text-xs text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © 2026 {STORE_CONFIG.brandName}. Katalog Digital Aksesoris Motor.
          </p>
          <p>
            Harga referensi &amp; promo mengikuti halaman resmi Shopee dan
            TikTok Shop.
          </p>
        </div>
      </div>
    </footer>
  );
}
