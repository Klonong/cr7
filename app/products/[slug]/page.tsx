import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CheckCircle2,
  ExternalLink,
  Info,
  PackageCheck,
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ProductGallery } from "@/components/catalog/product-gallery";
import { MarketplaceCta } from "@/components/catalog/marketplace-cta";
import { FeaturedGrid } from "@/components/catalog/featured-grid";
import {
  getCatalogProductBySlug,
  getCatalogProducts,
} from "@/lib/server/catalog-service";
import { getRelatedProducts } from "@/lib/catalog-filters";
import { PRODUCTS } from "@/data/products";
import { getCategoryBySlug } from "@/data/categories";
import {
  formatPrice,
  getDiscountPercent,
} from "@/lib/format";
import { STORE_CONFIG } from "@/config/store";

export async function generateStaticParams() {
  return PRODUCTS.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getCatalogProductBySlug(slug);
  if (!product) {
    return { title: "Product Not Found" };
  }
  return {
    title: product.name,
    description: `${product.name} (${product.sku}) — ${product.shortSpecs.join(" · ")}. Order directly via official CR7 Moto Shopee or TikTok Shop.`,
  };
}

export default async function ProductDetailPage({
  params,
}: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const [product, allProducts] = await Promise.all([
    getCatalogProductBySlug(slug),
    getCatalogProducts(),
  ]);

  if (!product) {
    notFound();
  }

  const category = getCategoryBySlug(product.category);
  const discount = getDiscountPercent(product.price, product.originalPrice);
  const related = getRelatedProducts(allProducts, product, 4);

  return (
    <div className="mx-auto w-full max-w-[1320px] px-4 py-8 pb-28 sm:px-6 md:pb-14 lg:px-8">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/" />}>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/products" />}>
              Catalog
            </BreadcrumbLink>
          </BreadcrumbItem>
          {category && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  render={<Link href={`/products?category=${category.slug}`} />}
                >
                  {category.shortName}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </>
          )}
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="max-w-[200px] sm:max-w-xs truncate">
              {product.name}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Main 2-Column Product Showcase */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
        {/* Left Gallery (55% -> 7 cols) */}
        <div className="lg:col-span-7">
          <ProductGallery images={product.images} productName={product.name} />
        </div>

        {/* Right Sticky Purchase & Specs Panel (45% -> 5 cols) */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 space-y-5 rounded-xl border border-border bg-card p-5 sm:p-6">
            {/* Top Meta */}
            <div className="flex flex-wrap items-center gap-2">
              {category && (
                <Link
                  href={`/products?category=${category.slug}`}
                  className="text-xs font-semibold uppercase tracking-wider text-primary hover:underline"
                >
                  {category.shortName}
                </Link>
              )}
              <span className="text-muted-foreground/40">•</span>
              <span className="font-mono text-xs text-muted-foreground">
                SKU: {product.sku}
              </span>
              <Badge
                variant={product.inStock ? "secondary" : "destructive"}
                className={
                  product.inStock
                    ? "ml-auto text-[11px] font-medium text-status-success border border-status-success/25 bg-status-success/10"
                    : "ml-auto text-[11px]"
                }
              >
                {product.inStock ? "In Stock on Stores" : "Sold Out"}
              </Badge>
            </div>

            {/* Product H1 */}
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight text-foreground">
                {product.name}
              </h1>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {product.description}
              </p>
            </div>

            {/* Reference Price */}
            <div className="rounded-lg border border-border bg-muted/40 p-4 space-y-1.5">
              <div className="flex flex-wrap items-baseline gap-2.5">
                <span className="font-mono text-2xl sm:text-3xl font-extrabold tabular-nums text-foreground">
                  {formatPrice(product.price, product.currency)}
                </span>
                {product.originalPrice && (
                  <span className="font-mono text-sm tabular-nums text-muted-foreground line-through">
                    {formatPrice(product.originalPrice, product.currency)}
                  </span>
                )}
                {discount && (
                  <Badge className="bg-primary text-primary-foreground font-mono text-xs">
                    Save {discount}%
                  </Badge>
                )}
              </div>
              <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
                <Info className="size-3.5 shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  Reference catalog price. Final price, store vouchers, free
                  shipping &amp; COD are applied on Shopee or TikTok Shop.
                </span>
              </p>
            </div>

            {/* Primary Marketplace CTAs */}
            <div className="space-y-2.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Order Directly from Official Store
              </p>
              <MarketplaceCta product={product} variant="pdp" />
            </div>

            <Separator />

            {/* Short Specs */}
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Key Technical Highlights
              </p>
              <div className="flex flex-wrap gap-1.5">
                {product.shortSpecs.map((spec) => (
                  <Badge
                    key={spec}
                    variant="secondary"
                    className="font-mono text-xs px-2.5 py-1"
                  >
                    {spec}
                  </Badge>
                ))}
                {product.badges?.map((badge) => (
                  <Badge
                    key={badge}
                    variant="outline"
                    className="text-xs px-2.5 py-1"
                  >
                    {badge}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Compatible Bikes */}
            <div className="space-y-2">
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Wrench className="size-3.5 text-primary" aria-hidden="true" />
                <span>Compatible Motorcycles</span>
              </p>
              <div className="flex flex-wrap gap-1.5">
                {product.compatibility.map((bike) => (
                  <Link
                    key={bike}
                    href={`/products?bike=${encodeURIComponent(bike)}`}
                    className="rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-foreground hover:border-primary hover:text-primary transition-colors"
                  >
                    {bike}
                  </Link>
                ))}
              </div>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-2 gap-2.5 pt-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-2 rounded-md border border-border/70 p-2.5">
                <ShieldCheck className="size-4 text-status-success shrink-0" aria-hidden="true" />
                <span>Original CR7 Warranty</span>
              </div>
              <div className="flex items-center gap-2 rounded-md border border-border/70 p-2.5">
                <PackageCheck className="size-4 text-status-success shrink-0" aria-hidden="true" />
                <span>Bubble-Wrapped Dispatch</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Below-Fold Details: Tabs & FAQ Accordion */}
      <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Tabs defaultValue="specs" className="w-full">
            <TabsList className="w-full justify-start h-10 p-1">
              <TabsTrigger value="specs" className="px-4">
                Specifications
              </TabsTrigger>
              <TabsTrigger value="box" className="px-4">
                In the Box
              </TabsTrigger>
              <TabsTrigger value="fitment" className="px-4">
                Fitment Notes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="specs" className="mt-4">
              <div className="overflow-hidden rounded-lg border border-border bg-card">
                <dl className="divide-y divide-border">
                  {Object.entries(product.fullSpecs).map(([key, value]) => (
                    <div
                      key={key}
                      className="grid grid-cols-1 gap-1 px-4 py-3 sm:grid-cols-3 sm:gap-4"
                    >
                      <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {key}
                      </dt>
                      <dd className="font-mono text-sm text-foreground sm:col-span-2">
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </TabsContent>

            <TabsContent value="box" className="mt-4">
              <div className="rounded-lg border border-border bg-card p-5 space-y-3">
                <h2 className="text-sm font-semibold text-foreground">
                  Package Contents
                </h2>
                <ul className="space-y-2.5 text-sm text-muted-foreground">
                  {product.inTheBox.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <CheckCircle2
                        className="size-4 shrink-0 mt-0.5 text-status-success"
                        aria-hidden="true"
                      />
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="fitment" className="mt-4">
              <div className="rounded-lg border border-border bg-card p-5 space-y-4">
                <h2 className="text-sm font-semibold text-foreground">
                  Installation &amp; Compatibility Guidance
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {product.fitmentNotes}
                </p>
                <a
                  href={STORE_CONFIG.whatsappConsultUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                >
                  <span>Unsure if this fits your bike? Ask our technician on WhatsApp</span>
                  <ExternalLink className="size-3.5" aria-hidden="true" />
                </a>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Ordering & Warranty FAQ Accordion */}
        <div className="lg:col-span-5">
          <div className="rounded-lg border border-border bg-card p-5">
            <h2 className="text-sm font-semibold text-foreground mb-3">
              Ordering &amp; Warranty FAQ
            </h2>
            <Accordion defaultValue={["faq-1"]}>
              <AccordionItem value="faq-1">
                <AccordionTrigger>
                  How do I buy this product?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  This website is our official digital catalog. Simply click{" "}
                  <strong className="text-foreground">Buy on Shopee</strong> or{" "}
                  <strong className="text-foreground">Buy on TikTok Shop</strong>{" "}
                  to open the verified product listing and complete checkout
                  with your marketplace vouchers or COD.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-2">
                <AccordionTrigger>
                  Do I need a relay harness for LED lights?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  For auxiliary lights rated 30W and above (such as SQL 3-Eye or
                  Bi-LED projectors), we strongly recommend pairing them with
                  our waterproof 40A relay harness so your bike receives stable
                  12V DC battery current without stressing OEM switches.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-3">
                <AccordionTrigger>
                  How does warranty replacement work?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Record a quick unboxing video when your package arrives and
                  keep the CR7 warranty card. All claims are handled directly
                  through Shopee or TikTok Shop chat with your order number.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>

      {/* Related Accessories */}
      <section className="mt-14 pt-10 border-t border-border">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-primary">
              Complete Your Setup
            </p>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Related Motorcycle Accessories
            </h2>
          </div>
          <Link
            href="/products"
            className="text-xs font-semibold text-primary hover:underline"
          >
            Browse all →
          </Link>
        </div>

        <FeaturedGrid products={related} columns={4} />
      </section>

      {/* Mobile Sticky Bottom Buy Bar (<768px) */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 p-3 backdrop-blur-md md:hidden">
        <div className="mx-auto flex max-w-lg flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="truncate font-medium text-muted-foreground pr-2">
              {product.name}
            </span>
            <span className="shrink-0 font-mono font-bold tabular-nums text-foreground">
              {formatPrice(product.price, product.currency)}
            </span>
          </div>
          <MarketplaceCta product={product} variant="sticky" />
        </div>
      </div>
    </div>
  );
}
