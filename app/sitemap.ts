import type { MetadataRoute } from "next";
import { getCatalogProducts } from "@/lib/server/catalog-service";
import { toAbsoluteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getCatalogProducts();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: toAbsoluteUrl("/"),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: toAbsoluteUrl("/products"),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: toAbsoluteUrl("/about"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: toAbsoluteUrl(`/products/${product.slug}`),
    changeFrequency: "weekly",
    priority: product.featured ? 0.85 : 0.75,
  }));

  return [...staticRoutes, ...productRoutes];
}
