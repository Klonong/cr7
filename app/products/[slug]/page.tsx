import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, ExternalLink } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ProductGallery } from "@/components/catalog/product-gallery";
import { ProductDetailPurchase } from "@/components/catalog/product-detail-purchase";
import { FeaturedGrid } from "@/components/catalog/featured-grid";
import {
  getCatalogProductBySlug,
  getCatalogProducts,
} from "@/lib/server/catalog-service";
import { getCatalogCategories } from "@/lib/server/category-service";
import { getRelatedProducts } from "@/lib/catalog-filters";
import { STORE_CONFIG } from "@/config/store";

export async function generateMetadata({
  params,
}: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getCatalogProductBySlug(slug);
  if (!product) {
    return { title: "Produk Tidak Ditemukan" };
  }
  return {
    title: product.name,
    description: `${product.name} (${product.sku}) — ${product.shortSpecs.join(" · ")}. Order langsung di Shopee atau TikTok Shop resmi CR7 Racing.`,
  };
}

async function ProductDetailContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [product, allProducts, categories] = await Promise.all([
    getCatalogProductBySlug(slug),
    getCatalogProducts(),
    getCatalogCategories(),
  ]);

  if (!product) {
    notFound();
  }

  const category = categories.find((c) => c.slug === product.category);
  const related = getRelatedProducts(allProducts, product, 4);

  return (
    <div className="mx-auto w-full max-w-[1320px] px-4 py-8 pb-32 sm:px-6 md:pb-14 lg:px-8">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/" />}>Beranda</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/products" />}>
              Katalog
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
        {/* Left Gallery */}
        <div className="lg:col-span-7">
          <ProductGallery images={product.images} productName={product.name} />
        </div>

        {/* Right Sticky Purchase, Variant Selector & Mobile Sticky Bar */}
        <div className="lg:col-span-5">
          <ProductDetailPurchase product={product} category={category} />
        </div>
      </div>

      {/* Below-Fold Details: Tabs & FAQ Accordion */}
      <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Tabs defaultValue="specs" className="w-full">
            <TabsList className="w-full justify-start h-10 p-1">
              <TabsTrigger value="specs" className="px-4">
                Spesifikasi
              </TabsTrigger>
              <TabsTrigger value="box" className="px-4">
                Isi Paket
              </TabsTrigger>
              <TabsTrigger value="fitment" className="px-4">
                Catatan Pasang
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
                  Kelengkapan dalam Kemasan
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
                  Panduan Pemasangan &amp; Kecocokan Motor
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
                  <span>
                    Masih ragu apakah cocok di motor Anda? Tanya teknisi via
                    WhatsApp
                  </span>
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
              Pertanyaan Seputar Order &amp; Garansi
            </h2>
            <Accordion defaultValue={["faq-1"]}>
              <AccordionItem value="faq-1">
                <AccordionTrigger>
                  Bagaimana cara membeli produk ini?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Website ini adalah katalog resmi CR7 Racing. Pilih varian yang
                  diinginkan, lalu klik{" "}
                  <strong className="text-foreground">Beli di Shopee</strong>{" "}
                  atau{" "}
                  <strong className="text-foreground">
                    Beli di TikTok Shop
                  </strong>{" "}
                  untuk checkout aman dengan voucher dan COD.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-2">
                <AccordionTrigger>
                  Apakah lampu LED wajib pakai relay set?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Untuk lampu tembak atau Bi-LED 30W ke atas, sangat disarankan
                  menggunakan Kabel Relay Set 40A CR7 Racing agar tegangan aki
                  stabil, cahaya maksimal, dan saklar standar motor tetap awet.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-3">
                <AccordionTrigger>
                  Bagaimana cara klaim garansi resmi?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Wajib merekam video unboxing saat paket diterima dan simpan
                  kartu garansi CR7 Racing. Klaim langsung diproses melalui chat
                  toko Shopee atau TikTok Shop dengan menyertakan nomor pesanan.
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
              Lengkapi Setup Motor Anda
            </p>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Aksesoris Terkait Lainnya
            </h2>
          </div>
          <Link
            href="/products"
            className="text-xs font-semibold text-primary hover:underline"
          >
            Lihat semua →
          </Link>
        </div>

        <FeaturedGrid products={related} categories={categories} columns={4} />
      </section>
    </div>
  );
}

export default function ProductDetailPage({
  params,
}: PageProps<"/products/[slug]">) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-[1320px] px-4 py-16 text-center text-sm text-muted-foreground">
          Memuat detail produk...
        </div>
      }
    >
      <ProductDetailContent params={params} />
    </Suspense>
  );
}
