import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  Bike,
  CheckCircle2,
  Gauge,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { buttonVariants } from "@/components/ui/button";
import { FeaturedGrid } from "@/components/catalog/featured-grid";
import { BIKE_MODELS, CATEGORIES } from "@/data/categories";
import { getFeaturedProducts } from "@/lib/catalog-filters";
import { getCatalogProducts } from "@/lib/server/catalog-service";
import { OfficialStoreLinks } from "@/components/shared/official-store-links";
import { cn } from "@/lib/utils";

const TRUST_PILLARS = [
  {
    icon: ShieldCheck,
    title: "100% Original Parts",
    description: "Factory-verified CR7 lighting & CNC hardware with serial warranty.",
  },
  {
    icon: Truck,
    title: "Shopee & TikTok Checkout",
    description: "Order via your favorite app with official vouchers, COD & buyer protection.",
  },
  {
    icon: Gauge,
    title: "Tested Beam & Specs",
    description: "Real wattage ratings, IP67 sealing tests, and verified bike fitment charts.",
  },
  {
    icon: Award,
    title: "Official Store Warranty",
    description: "Direct replacement support through our official marketplace stores.",
  },
];

export default async function HomePage() {
  const products = await getCatalogProducts();
  const displayFeatured = getFeaturedProducts(products, 8);

  return (
    <div className="flex flex-col">
      {/* 1. Hero Showcase Banner */}
      <section className="relative overflow-hidden border-b border-border bg-card">
        <div className="mx-auto grid max-w-[1320px] grid-cols-1 items-center gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-12 lg:gap-10 lg:px-8 lg:py-16">
          {/* Hero Copy */}
          <div className="space-y-6 lg:col-span-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/70 px-3 py-1 text-xs font-medium text-foreground">
              <span className="size-2 rounded-full bg-primary" aria-hidden="true" />
              <span>Official Motorcycle Accessories Showroom</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl leading-[1.1]">
                Precision Lighting &amp; CNC Gear Built for Every Ride.
              </h1>
              <p className="max-w-xl text-sm sm:text-base leading-relaxed text-muted-foreground">
                Explore full technical specifications, night beam cutoff tests,
                and motorcycle fitment guides. Click straight through to purchase
                securely from our verified{" "}
                <span className="font-semibold text-foreground">Shopee</span> or{" "}
                <span className="font-semibold text-foreground">
                  TikTok Shop
                </span>{" "}
                listings.
              </p>
            </div>

            {/* Primary & Marketplace CTAs */}
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Link
                href="/products"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-11 min-h-[44px] gap-2 px-5 text-sm font-semibold"
                )}
              >
                <span>Browse Full Catalog</span>
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>

              <OfficialStoreLinks layout="hero" />
            </div>

            {/* Quick Telemetry Stats */}
            <div className="grid grid-cols-3 gap-4 border-t border-border pt-5 max-w-md">
              <div>
                <p className="font-mono text-lg sm:text-xl font-bold text-foreground">
                  {products.length}+
                </p>
                <p className="text-xs text-muted-foreground">Catalog SKUs</p>
              </div>
              <div>
                <p className="font-mono text-lg sm:text-xl font-bold text-foreground">
                  IP67
                </p>
                <p className="text-xs text-muted-foreground">Rain-Ready Gear</p>
              </div>
              <div>
                <p className="font-mono text-lg sm:text-xl font-bold text-foreground">
                  2 Apps
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
                  src="/images/hero-led.svg"
                  alt="CR7 Dual-Lens CNC Motorcycle LED Projector emitting 6000K white and 3000K amber cutoff beams"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </AspectRatio>
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 rounded-lg border border-white/10 bg-zinc-950/80 px-3.5 py-2.5 text-xs text-zinc-100 backdrop-blur-md">
                <div className="min-w-0">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-red-400">
                    Flagship Spotlight · CR7-SQL3-60W
                  </p>
                  <p className="truncate font-semibold">
                    SQL 3-Eye Laser Mini Driving Light
                  </p>
                </div>
                <Link
                  href="/products/cr7-sql-3-eye-laser-mini-driving-light"
                  className="shrink-0 inline-flex items-center gap-1 rounded-md bg-white/10 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-white/20 transition-colors"
                >
                  <span>Inspect</span>
                  <ArrowRight className="size-3" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Official Marketplace Trust Strip */}
      <section
        aria-label="Official catalog guarantees"
        className="border-b border-border bg-muted/35"
      >
        <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-4 px-4 py-6 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {TRUST_PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
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

      {/* 3. Quick Bike-Model Filter Strip */}
      <section
        aria-label="Filter accessories by motorcycle model"
        className="mx-auto w-full max-w-[1320px] px-4 pt-10 sm:px-6 lg:px-8"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Bike className="size-5 text-primary" aria-hidden="true" />
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
              Browse by Motorcycle Fitment
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            <span>See all compatible models</span>
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>

        <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">
          {BIKE_MODELS.map((bike) => (
            <Link
              key={bike}
              href={`/products?bike=${encodeURIComponent(bike)}`}
              className="inline-flex min-h-[40px] shrink-0 items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-xs sm:text-sm font-medium text-foreground transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span>{bike}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Shop by Category Grid */}
      <section className="mx-auto w-full max-w-[1320px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div className="space-y-1">
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-primary">
              Categories
            </p>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Shop Motorcycle Accessories by System
            </h2>
          </div>
          <Link
            href="/products"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "hidden sm:inline-flex gap-1.5"
            )}
          >
            <span>All Categories</span>
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map((category) => {
            const count = products.filter(
              (p) => p.category === category.slug
            ).length;
            return (
              <Link
                key={category.slug}
                href={`/products?category=${category.slug}`}
                className="group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
              >
                <Card className="h-full gap-0 overflow-hidden rounded-lg border border-border bg-card p-0 ring-0 transition-all duration-200 hover:border-primary/50 hover:shadow-md">
                  <div className="overflow-hidden bg-muted border-b border-border/60">
                    <AspectRatio ratio={1}>
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none"
                      />
                    </AspectRatio>
                  </div>
                  <div className="p-3 space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="truncate text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                        {category.shortName}
                      </h3>
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {count}
                      </span>
                    </div>
                    <p className="line-clamp-2 text-[11px] leading-snug text-muted-foreground">
                      {category.description}
                    </p>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 5. Best Sellers Showcase */}
      <section className="border-t border-border bg-muted/25">
        <div className="mx-auto w-full max-w-[1320px] px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-6">
            <div className="space-y-1">
              <p className="font-mono text-xs font-semibold uppercase tracking-wider text-primary">
                Most Popular Upgrades
              </p>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                Featured Motorcycle Accessories
              </h2>
              <p className="text-sm text-muted-foreground">
                Tap Quick View to inspect specs, or go straight to Shopee or
                TikTok Shop.
              </p>
            </div>
            <Link
              href="/products"
              className={cn(
                buttonVariants({ variant: "default" }),
                "h-10 gap-1.5 self-start sm:self-auto px-4"
              )}
            >
              <span>View Full Catalog ({products.length})</span>
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>

          <FeaturedGrid products={displayFeatured} columns={4} />
        </div>
      </section>

      {/* 6. Optical Engineering & Night Beam Spotlight */}
      <section className="mx-auto w-full max-w-[1320px] px-4 py-14 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-xl border border-border bg-zinc-950 text-zinc-50">
          <div className="grid grid-cols-1 items-center lg:grid-cols-12">
            <div className="p-6 sm:p-8 lg:col-span-6 lg:p-10 space-y-5">
              <Badge className="bg-red-600/20 text-red-400 border border-red-500/30 font-mono text-xs">
                <Sparkles className="size-3 mr-1" aria-hidden="true" />
                ANTI-GLARE FLAT CUTOFF
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
                Engineered for Rain, Fog, and Zero Oncoming Glare.
              </h2>
              <p className="text-sm leading-relaxed text-zinc-300">
                Every CR7 Bi-LED and SQL laser projector is bench-tested at 15
                meters to produce a razor-sharp horizontal cutoff line—giving
                you maximum road visibility while keeping oncoming riders safe.
              </p>
              <ul className="space-y-2 text-sm text-zinc-200">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-400 shrink-0" aria-hidden="true" />
                  <span>6000K pure white low beam + 3000K golden fog high beam</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-400 shrink-0" aria-hidden="true" />
                  <span>CNC 6063 aluminum thermal body rated IP67 waterproof</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-400 shrink-0" aria-hidden="true" />
                  <span>Direct plug-and-play pairing with CR7 40A Relay Kits</span>
                </li>
              </ul>
              <div className="pt-2">
                <Link
                  href="/products?category=led-headlights"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "h-11 gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-5"
                  )}
                >
                  <span>Explore LED Lighting Series</span>
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 border-t lg:border-t-0 lg:border-l border-zinc-800">
              <AspectRatio ratio={4 / 3}>
                <Image
                  src="/images/prod-beam-test.svg"
                  alt="CR7 LED projector night beam cutoff pattern showing 6000K white low beam and 3000K amber fog beam"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </AspectRatio>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
