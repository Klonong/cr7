import Link from "next/link";
import { Clock, ExternalLink, MapPin, MessageCircle, ShieldCheck } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { buttonVariants } from "@/components/ui/button";
import { BrandLogo } from "@/components/shared/brand-logo";
import { OfficialStoreLinks } from "@/components/shared/official-store-links";
import { STORE_CONFIG } from "@/config/store";
import { CATEGORIES } from "@/data/categories";
import { cn } from "@/lib/utils";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-card">
      <div className="mx-auto max-w-[1320px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div className="space-y-4">
            <BrandLogo href="/" subtitle={STORE_CONFIG.brandTagline} />
            <p className="text-sm leading-relaxed text-muted-foreground">
              Official digital showroom for precision motorcycle LED lighting,
              CNC cockpit controls, touring mounts, and protection hardware.
              Inspect full specs here and check out securely via Shopee or
              TikTok Shop.
            </p>
            <div className="inline-flex items-center gap-2 rounded-md border border-border bg-muted/60 px-3 py-1.5 text-xs font-medium text-foreground">
              <ShieldCheck
                className="size-4 text-status-success shrink-0"
                aria-hidden="true"
              />
              <span>100% Original &amp; Tested Parts</span>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Catalog Categories
            </h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/products"
                  className="hover:text-foreground transition-colors"
                >
                  All Accessories
                </Link>
              </li>
              {CATEGORIES.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/products?category=${category.slug}`}
                    className="hover:text-foreground transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Official Marketplaces */}
          <div className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Buy on Official Stores
            </h2>
            <p className="text-xs leading-relaxed text-muted-foreground">
              We do not process payments on this site. All orders, vouchers, COD,
              and buyer protection are handled directly on Shopee &amp; TikTok
              Shop.
            </p>
            <OfficialStoreLinks
              layout="stack"
              shopeeLabel="CR7 Official Shopee"
              tiktokLabel="CR7 Official TikTok Shop"
              className="pt-1"
            />
          </div>

          {/* Fitment Consultation & Hours */}
          <div className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Fitment Help &amp; Hours
            </h2>
            <div className="space-y-2.5 text-sm text-muted-foreground">
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
            <a
              href={STORE_CONFIG.whatsappConsultUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "mt-2 h-10 w-full justify-between px-3.5 text-xs font-medium"
              )}
            >
              <span className="inline-flex items-center gap-2">
                <MessageCircle
                  className="size-4 text-status-success"
                  aria-hidden="true"
                />
                Ask Bike Fitment on WhatsApp
              </span>
              <ExternalLink
                className="size-3.5 opacity-70"
                aria-hidden="true"
              />
            </a>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © 2026 {STORE_CONFIG.brandName}. Digital Product Catalog Showcase.
          </p>
          <p>
            Reference prices &amp; promos follow live Shopee and TikTok Shop
            listings.
          </p>
        </div>
      </div>
    </footer>
  );
}
