import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { StorefrontShell } from "@/components/layout/storefront-shell";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "CR7 MOTO — Motorcycle Parts & Accessories Catalog",
    template: "%s | CR7 MOTO Catalog",
  },
  description:
    "Official motorcycle accessories digital showroom. Browse LED headlights, Bi-LED projectors, CNC controls, crash protection, and touring gear with direct Shopee and TikTok Shop purchase links.",
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
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground"
        >
          Skip to product catalog
        </a>
        <ThemeProvider>
          <TooltipProvider>
            <StorefrontShell>{children}</StorefrontShell>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
