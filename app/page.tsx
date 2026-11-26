import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  Bike,
  ExternalLink,
  Gauge,
  ShieldCheck,
  Tag,
  Truck,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { buttonVariants } from "@/components/ui/button";
import { FeaturedGrid } from "@/components/catalog/featured-grid";
import { SpotlightCarousel } from "@/components/catalog/spotlight-carousel";
import { OfficialStoreLinks } from "@/components/shared/official-store-links";
import { getFeaturedProducts } from "@/lib/catalog-filters";
import { getCatalogProducts } from "@/lib/server/catalog-service";
import { getCatalogCategories } from "@/lib/server/category-service";
import { getCatalogMotorcycles } from "@/lib/server/motorcycle-service";
import { getHomeContent } from "@/lib/server/home-service";
import { cn } from "@/lib/utils";
import type { TrustIconName } from "@/types/home";

const TRUST_ICON_MAP: Record<TrustIconName, LucideIcon> = {
  shield: ShieldCheck,
  truck: Truck,
  gauge: Gauge,
  award: Award,
  zap: Zap,
  wrench: Wrench,
};

function isExternalUrl(href: string): boolean {
  return href.startsWith("http://") || href.startsWith("https://");
}

export default async function HomePage() {
  const [products, categories, motorcycles, homeContent] = await Promise.all([
    getCatalogProducts(),
    getCatalogCategories(),
    getCatalogMotorcycles(),
    getHomeContent(),
  ]);

  const { hero, sections, trustPillars, highlights } = homeContent;
  const displayFeatured = getFeaturedProducts(
    products,
    sections.featuredMaxItems
  );
  const activeHighlights = highlights.filter((hl) => hl.active);
  const primaryCtaExternal = isExternalUrl(hero.primaryCtaHref);

  return (
    <div className="flex flex-col">
      {/* 1. Hero Showcase Banner */}
      <section className="relative overflow-hidden border-b border-border bg-card">
        <div className="mx-auto grid max-w-[1320px] grid-cols-1 items-center gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-12 lg:gap-10 lg:px-8 lg:py-16">
          {/* Hero Copy */}
          <div className="space-y-6 lg:col-span-6">
            {hero.eyebrow && (
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/70 px-3 py-1 text-xs font-medium text-foreground">
                <span
                  className="size-2 rounded-full bg-primary"
                  aria-hidden="true"
                />
                <span>{hero.eyebrow}</span>
              </div>
            )}

            <div className="space-y-3">
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl leading-[1.1]">
                {hero.headline}
              </h1>
              <p className="max-w-xl text-sm sm:text-base leading-relaxed text-muted-foreground">
                {hero.subheadline}
              </p>
            </div>

            {/* Primary & Marketplace CTAs */}
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              {primaryCtaExternal ? (
                <a
                  href={hero.primaryCtaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "h-11 min-h-[44px] gap-2 px-5 text-sm font-semibold"
                  )}
                >
                  <span>{hero.primaryCtaLabel}</span>
                  <ExternalLink className="size-4" aria-hidden="true" />
                </a>
              ) : (
                <Link
                  href={hero.primaryCtaHref}
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "h-11 min-h-[44px] gap-2 px-5 text-sm font-semibold"
                  )}
                >
                  <span>{hero.primaryCtaLabel}</span>
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              )}

              {hero.showOfficialStoreLinks && (
                <OfficialStoreLinks layout="hero" />
              )}
            </div>

            {/* Quick Telemetry Stats */}
            <div className="grid grid-cols-3 gap-4 border-t border-border pt-5 max-w-md">
              <div>
                <p className="font-mono text-lg sm:text-xl font-bold text-foreground">
                  {products.length}+
                </p>
                <p className="text-xs text-muted-foreground">SKU Katalog</p>
              </div>
              <div>
                <p className="font-mono text-lg sm:text-xl font-bold text-foreground">
                  IP67
                </p>
                <p className="text-xs text-muted-foreground">Tahan Hujan</p>
              </div>
              <div>
                <p className="font-mono text-lg sm:text-xl font-bold text-foreground">
                  2 Toko
                </p>
                <p className="text-xs text-muted-foreground">
                  Shopee &amp; TikTok
                </p>
              </div>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="lg:col-span-6">
            <div className="relative overflow-hidden rounded-xl border border-border bg-zinc-950 shadow-lg">
              <AspectRatio ratio={16 / 10}>
                <Image
                  src={hero.heroImageUrl}
                  alt={hero.headline}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </AspectRatio>

              {(hero.spotlightTitle || hero.spotlightTag) && (
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 rounded-lg border border-white/10 bg-zinc-950/85 px-3.5 py-2.5 text-xs text-[#fefefe] backdrop-blur-md">
                  <div className="min-w-0">
                    {hero.spotlightTag && (
                      <p className="font-mono text-[10px] uppercase tracking-wider text-primary">
                        {hero.spotlightTag}
                      </p>
                    )}
                    <p className="truncate font-semibold">
                      {hero.spotlightTitle}
                    </p>
                  </div>
                  {hero.spotlightProductSlug && (
                    <Link
                      href={`/products/${hero.spotlightProductSlug}`}
                      className="shrink-0 inline-flex items-center gap-1 rounded-md bg-primary px-2.5 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                      <span>Detail</span>
                      <ArrowRight className="size-3" aria-hidden="true" />
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Official Marketplace Trust Strip */}
      {sections.showTrustStrip && trustPillars.length > 0 && (
        <section
          aria-label="Jaminan katalog resmi CR7 Racing"
          className="border-b border-border bg-muted/35"
        >
          <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-4 px-4 py-6 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
            {trustPillars.map((pillar) => {
              const Icon = TRUST_ICON_MAP[pillar.icon] ?? ShieldCheck;
              return (
                <div
                  key={pillar.id}
                  className="flex items-start gap-3 rounded-lg border border-border/70 bg-card p-3.5"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Icon className="size-4.5" aria-hidden="true" />
                  </span>
                  <div className="space-y-0.5">
                    <h2 className="text-sm font-semibold text-foreground">
                      {pillar.title}
                    </h2>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 3. Quick Bike-Model Filter Strip */}
      {sections.showBikeFitmentStrip && motorcycles.length > 0 && (
        <section
          aria-label="Cari aksesoris berdasarkan tipe motor"
          className="mx-auto w-full max-w-[1320px] px-4 pt-10 sm:px-6 lg:px-8"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Bike className="size-5 text-primary" aria-hidden="true" />
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
                Cari Berdasarkan Tipe Motor
              </h2>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              <span>Lihat semua motor kompatibel</span>
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          </div>

          <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">
            {motorcycles.map((moto) => (
              <Link
                key={moto.id}
                href={`/products?bike=${encodeURIComponent(moto.name)}`}
                className="inline-flex min-h-[40px] shrink-0 items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-xs sm:text-sm font-medium text-foreground transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span>{moto.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 4. Shop by Category Grid (Clean Typographic Cards — Tanpa Gambar) */}
      {sections.showCategoriesGrid && categories.length > 0 && (
        <section className="mx-auto w-full max-w-[1320px] px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div className="space-y-1">
              <p className="font-mono text-xs font-semibold uppercase tracking-wider text-primary">
                Kategori Produk
              </p>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                Pilih Aksesoris Motor Sesuai Kebutuhan
              </h2>
            </div>
            <Link
              href="/products"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "hidden sm:inline-flex gap-1.5"
              )}
            >
              <span>Semua Kategori</span>
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const count = products.filter(
                (p) => p.category === category.slug
              ).length;
              return (
                <Link
                  key={category.slug}
                  href={`/products?category=${category.slug}`}
                  className="group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
                >
                  <Card className="h-full gap-3 rounded-xl border border-border bg-card p-5 ring-0 transition-all duration-200 hover:border-primary hover:shadow-md">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                        <Tag className="size-3.5" aria-hidden="true" />
                        <span>{category.shortName}</span>
                      </span>
                      <span className="font-mono text-xs font-semibold text-muted-foreground">
                        {count} produk
                      </span>
                    </div>

                    <div className="space-y-1.5 flex-1">
                      <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                        {category.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-semibold text-primary pt-1">
                      <span>Lihat koleksi</span>
                      <ArrowRight
                        className="size-3.5 transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
                        aria-hidden="true"
                      />
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* 5. Best Sellers Showcase */}
      <section className="border-t border-border bg-muted/25">
        <div className="mx-auto w-full max-w-[1320px] px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-6">
            <div className="space-y-1">
              <p className="font-mono text-xs font-semibold uppercase tracking-wider text-primary">
                {sections.featuredSectionEyebrow}
              </p>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                {sections.featuredSectionTitle}
              </h2>
              {sections.featuredSectionSubtitle && (
                <p className="text-sm text-muted-foreground">
                  {sections.featuredSectionSubtitle}
                </p>
              )}
            </div>
            <Link
              href="/products"
              className={cn(
                buttonVariants({ variant: "default" }),
                "h-10 gap-1.5 self-start sm:self-auto px-4 font-semibold"
              )}
            >
              <span>Lihat Semua Katalog ({products.length})</span>
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>

          <FeaturedGrid products={displayFeatured} columns={4} />
        </div>
      </section>

      {/* 6. Spotlight Carousel (Interactive Managed Highlights) */}
      {sections.showHighlights && activeHighlights.length > 0 && (
        <section
          aria-label="Sorotan unggulan CR7 Racing"
          className="mx-auto w-full max-w-[1320px] px-4 py-14 sm:px-6 lg:px-8"
        >
          <SpotlightCarousel highlights={activeHighlights} />
        </section>
      )}
    </div>
  );
}
