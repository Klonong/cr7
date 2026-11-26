import { Suspense } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { StorefrontShell } from "@/components/layout/storefront-shell";
import { JsonLd } from "@/components/shared/json-ld";
import { STORE_CONFIG } from "@/config/store";
import {
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
  SITE_URL,
} from "@/lib/seo";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const googleVerification = process.env.GOOGLE_SITE_VERIFICATION?.trim();

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "CR7 Racing — Katalog Resmi Lampu LED Motor & Part CNC",
    template: "%s | CR7 Racing",
  },
  description:
    "Katalog digital resmi CR7 Racing untuk lampu LED motor, Bi-LED projector, SQL laser, handle rem CNC, frame slider, dan aksesoris touring. Order aman via Shopee dan TikTok Shop.",
  applicationName: STORE_CONFIG.brandName,
  authors: [{ name: STORE_CONFIG.brandName, url: SITE_URL }],
  creator: STORE_CONFIG.brandName,
  publisher: STORE_CONFIG.brandName,
  keywords: [
    "CR7 Racing",
    "lampu LED motor",
    "Bi-LED projector motor",
    "lampu tembak SQL 3 mata",
    "aksesoris motor CNC",
    "handle rem CNC",
    "frame slider motor",
    "holder HP motor anti getar",
    "relay set lampu tembak",
    "sparepart motor NMAX PCX Vario Aerox",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: SITE_URL,
    siteName: STORE_CONFIG.brandName,
    title: "CR7 Racing — Katalog Resmi Lampu LED Motor & Part CNC",
    description:
      "Cek spesifikasi lengkap lampu Bi-LED, SQL laser, dan part CNC CR7 Racing. Order langsung di toko resmi Shopee & TikTok Shop.",
  },
  twitter: {
    card: "summary_large_image",
    title: "CR7 Racing — Katalog Resmi Lampu LED Motor & Part CNC",
    description:
      "Katalog resmi lampu LED motor Bi-LED projector, SQL laser, dan part CNC CR7 Racing Indonesia.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  ...(googleVerification
    ? { verification: { google: googleVerification } }
    : {}),
};

const themeInitScript = `
(function() {
  try {
    var stored = localStorage.getItem('cr7-catalog-theme');
    var dark = stored ? stored === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('dark', dark);
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <JsonLd data={[buildOrganizationJsonLd(), buildWebSiteJsonLd()]} />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground"
        >
          Langsung ke katalog produk
        </a>
        <ThemeProvider>
          <TooltipProvider>
            <Suspense fallback={<div className="min-h-screen bg-background" />}>
              <StorefrontShell>{children}</StorefrontShell>
            </Suspense>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
