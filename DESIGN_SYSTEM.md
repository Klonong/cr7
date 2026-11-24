# CR7 Moto Accessories — UI Design System & Catalog Storefront Specification

> **Project Type**: Product Showcase / Catalog-Only E-Commerce Storefront (No Cart / No Checkout)  
> **Domain**: Motorcycle Parts & Accessories (LED Lighting, CNC Hardware, Controls, Touring & Protection Gear)  
> **Conversion Model**: Outbound Marketplace Deep-Links (**Shopee** & **TikTok Shop**)  
> **Tech Stack**: Next.js 16 (`App Router`), React 19, TypeScript, Tailwind CSS v4, **shadcn/ui**, Lucide Icons  
> **Accessibility Baseline**: WCAG 2.1 Level AA (minimum `4.5:1` normal text, `3:1` large text & UI borders, `44px` touch targets)

---

## 1. Product Vision & UX Architecture

### 1.1 Core Storefront Philosophy
This website acts as an **official digital product catalog and brand showroom** for a motorcycle accessories shop. Unlike traditional e-commerce stores, **there is no shopping cart, checkout flow, or user account barrier**. Every visual cue and interaction guides riders to:

1. **Discover** accessories by category or motorcycle model compatibility (e.g., *NMAX, PCX, Vario, Aerox, Universal*).
2. **Inspect** crisp product photography, beam patterns, technical specs (`Watt`, `Kelvin`, `IP Rating`, `Material`), and fitment details.
3. **Buy immediately** via verified external links to the shop's **Shopee** or **TikTok Shop** listings.

### 1.2 Anti-Patterns to Avoid
- **No Cart or Bag Icon in the Navbar**: Displaying a shopping cart creates false checkout expectations. Replace that slot with **Official Store Links** (Shopee / TikTok Shop) and a **Search trigger**.
- **No Broken Single-Platform Dead Ends**: If a product is only listed on Shopee (or only on TikTok Shop), dynamically render a full-width button for the available platform instead of a disabled/greyed-out button.
- **No Ambiguous External Navigation**: Every Shopee and TikTok Shop CTA must visually signal outbound navigation (external arrow icon) and announce `(opens in new tab)` to assistive technologies.

---

## 2. Visual Identity & Design Foundations

### 2.1 Brand Aesthetic: "Precision Garage"
Motorcycle enthusiasts associate quality aftermarket parts with **machined precision, high-visibility lighting, and rugged durability**.

- **Visual Tone**: Clean, technical, high-contrast industrial minimalism.
- **Surface Strategy**: Neutral light and dark surfaces let product photography (anodized CNC colors, LED light outputs, matte black housings) stay the hero without visual clutter.
- **Primary Theme Support**: Full **Light Mode** (high daylight readability for browsing on mobile outdoors) and **Dark Mode** (showroom aesthetic that makes LED lighting accessories pop).

### 2.2 Color System & `shadcn/ui` Tokens (Tailwind CSS v4)

All tokens map directly into `app/globals.css` using Tailwind CSS v4 `@theme inline` and `shadcn/ui` semantic CSS variables.

#### Brand & Neutral Palette
| Role | Light Mode | Dark Mode | Usage |
| :--- | :--- | :--- | :--- |
| **Background** (`--background`) | `#FAFAFA` | `#09090B` | Page canvas |
| **Surface / Card** (`--card`) | `#FFFFFF` | `#121215` | Product cards, filter panels, modals |
| **Surface Elevated** (`--muted`) | `#F4F4F5` | `#1C1C21` | Product image backdrop, spec pills, search input |
| **Primary Brand** (`--primary`) | `#DC2626` *(Racing Red)* | `#EF4444` | Active tabs, primary brand accents, focus highlights |
| **Primary Foreground** | `#FFFFFF` | `#FFFFFF` | Text on primary accents |
| **Text Primary** (`--foreground`) | `#09090B` | `#FAFAFA` | Titles, prices, primary copy (`>15:1` contrast) |
| **Text Muted** (`--muted-foreground`) | `#52525B` | `#A1A1AA` | SKUs, category labels, secondary specs (`>=5.7:1` contrast) |
| **Border** (`--border`) | `#E4E4E7` | `#27272A` | Hairline card edges, dividers, spec tables |
| **Ring** (`--ring`) | `#DC2626` | `#F87171` | Keyboard `:focus-visible` outlines |

#### Semantic & Status Tokens
| Token | Hex | Usage |
| :--- | :--- | :--- |
| `--color-success` | `#15803D` (Light) / `#22C55E` (Dark) | "In Stock", "Verified Fit", "Waterproof IP67" |
| `--color-warning` | `#B45309` (Light) / `#F59E0B` (Dark) | "Limited Batch", "Pre-Order on Marketplace" |
| `--color-destructive` | `#B91C1C` (Light) / `#EF4444` (Dark) | "Out of Stock", error states |
| `--color-info` | `#1D4ED8` (Light) / `#3B82F6` (Dark) | "New Arrival", technical notes |

#### Marketplace Brand Tokens (WCAG AA Calibrated)
> **Accessibility Note**: Raw Shopee Orange (`#EE4D2D`) with `#FFFFFF` text yields a `3.55:1` contrast ratio — passing for large/bold UI accents (`>=3:1`) but failing strict `4.5:1` for small `12px–14px` text. For solid small-text Shopee buttons, use **`#C83214`** (`5.21:1` contrast with `#FFFFFF`) or pair `#EE4D2D` strictly with bold `>=14px` icons + darkened hover `#B32A0F`.

| Marketplace | Background | Hover | Foreground | Border (Dark Mode) | Contrast Ratio |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Shopee CTA (Solid AA)** | `#C83214` | `#A8280E` | `#FFFFFF` | `transparent` | **5.21:1 (AA Pass)** |
| **Shopee Soft Badge** | `#FFF1EE` | `#FFE2DC` | `#A8280E` | `#FDBAAB` | **6.85:1 (AA Pass)** |
| **TikTok Shop CTA (Light Mode)** | `#0F0F0F` | `#262626` | `#FFFFFF` | `transparent` | **19.1:1 (AAA Pass)** |
| **TikTok Shop CTA (Dark Mode)** | `#18181B` | `#27272A` | `#FFFFFF` | `#3F3F46` (with `#FE2C55` / `#25F4EE` icon) | **17.4:1 (AAA Pass)** |

#### Copy-Paste Token Architecture (`app/globals.css`)
```css
@import "tailwindcss";

:root {
  --radius: 0.5rem;

  /* Core shadcn/ui Semantic Tokens (Light) */
  --background: #fafafa;
  --foreground: #09090b;
  --card: #ffffff;
  --card-foreground: #09090b;
  --popover: #ffffff;
  --popover-foreground: #09090b;
  --primary: #dc2626;
  --primary-foreground: #ffffff;
  --secondary: #f4f4f5;
  --secondary-foreground: #18181b;
  --muted: #f4f4f5;
  --muted-foreground: #52525b;
  --accent: #f4f4f5;
  --accent-foreground: #18181b;
  --destructive: #b91c1c;
  --destructive-foreground: #ffffff;
  --border: #e4e4e7;
  --input: #e4e4e7;
  --ring: #dc2626;

  /* Marketplace CTA Tokens */
  --shopee: #c83214;
  --shopee-hover: #a8280e;
  --shopee-foreground: #ffffff;
  --shopee-soft: #fff1ee;
  --shopee-soft-foreground: #a8280e;

  --tiktok: #0f0f0f;
  --tiktok-hover: #262626;
  --tiktok-foreground: #ffffff;
  --tiktok-accent-pink: #fe2c55;
  --tiktok-accent-cyan: #25f4ee;
}

.dark {
  --background: #09090b;
  --foreground: #fafafa;
  --card: #121215;
  --card-foreground: #fafafa;
  --popover: #121215;
  --popover-foreground: #fafafa;
  --primary: #ef4444;
  --primary-foreground: #ffffff;
  --secondary: #1c1c21;
  --secondary-foreground: #fafafa;
  --muted: #1c1c21;
  --muted-foreground: #a1a1aa;
  --accent: #27272a;
  --accent-foreground: #fafafa;
  --destructive: #ef4444;
  --destructive-foreground: #ffffff;
  --border: #27272a;
  --input: #27272a;
  --ring: #f87171;

  --shopee: #d43819;
  --shopee-hover: #b82d12;
  --tiktok: #18181b;
  --tiktok-hover: #27272a;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-shopee: var(--shopee);
  --color-shopee-hover: var(--shopee-hover);
  --color-tiktok: var(--tiktok);
  --color-tiktok-hover: var(--tiktok-hover);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}
```

---

### 2.3 Typography System

Leverages the pre-configured `Geist` and `Geist Mono` fonts from `app/layout.tsx` via `next/font/google`.

| Level | Font Family | Size / Line-Height | Weight | Tracking | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display / Hero** | `Geist Sans` | `36px–48px` / `1.1` | `700` | `-0.03em` | Hero headlines, campaign banners |
| **Page Title (H1)** | `Geist Sans` | `28px–32px` / `1.2` | `700` | `-0.02em` | Category headers, PDP product title |
| **Section Heading (H2)** | `Geist Sans` | `20px–24px` / `1.3` | `600` | `-0.01em` | "Featured Lighting", "Shop by Category" |
| **Card Title (H3)** | `Geist Sans` | `15px–16px` / `1.35` | `600` | `0` | Product card titles (max 2 lines, `line-clamp-2`) |
| **Body** | `Geist Sans` | `14px–16px` / `1.6` | `400` | `0` | Product descriptions, fitment notes |
| **UI Label / Button** | `Geist Sans` | `13px–14px` / `1.2` | `500` | `0.01em` | Marketplace buttons, filter labels, nav links |
| **Technical Specs & Price** | `Geist Mono` | `12px–18px` / `1.3` | `500–700` | `0` | Prices (`tabular-nums`), SKUs (`CR7-C915`), specs (`40W · 6000K · IP67`) |

---

### 2.4 Spacing, Radius & Elevation

- **Base Grid Unit**: `4px` (`0.25rem`).
- **Spacing Scale**: `4px` (`1`), `8px` (`2`), `12px` (`3`), `16px` (`4`), `24px` (`6`), `32px` (`8`), `48px` (`12`), `64px` (`16`).
- **Card Padding**: `12px` on mobile compact cards, `16px` on desktop cards.
- **Border Radius**: `8px` (`rounded-lg`) for cards/dialogs, `6px` (`rounded-md`) for buttons/inputs, `9999px` (`rounded-full`) for category pills & status badges.
- **Elevation**: Prefer crisp `1px solid var(--border)` with subtle hover elevation (`hover:border-foreground/25 hover:shadow-md transition-all duration-200`) rather than heavy drop shadows.

---

## 3. Motorcycle Accessories Catalog Taxonomy & Data Model

### 3.1 Core Product Categories
| Category Slug | Display Label | Example Products |
| :--- | :--- | :--- |
| `led-headlights` | LED Headlights & Projectors | Bi-LED Projectors, H4/H6 Laser LED, Mini Driving Lights (D2/SQL) |
| `signals-tail-lights` | Signals, DRL & Tail Lights | Sequential Turn Signals, Smoked LED Tail Lights, Hazard Flashers |
| `controls-cockpit` | Cockpit & Controls | CNC Brake Levers, 3-Mode Light Switches, Bar-End Mirrors, Handgrips |
| `protection-body` | Protection & Armor | Engine Crash Bars, Frame Sliders, Handguards, Radiator Guards |
| `touring-mounts` | Touring & Phone Mounts | Anti-Vibration Phone Holders, USB Fast Chargers, Top Box Brackets |
| `electrical-relays` | Wiring & Relays | Waterproof Relay Sets, Horn Kits, Voltmeter Gauges, Fuse Boxes |

### 3.2 Product Data Schema (TypeScript Contract)
```ts
export type MarketplacePlatform = "shopee" | "tiktok";

export interface Product {
  id: string;
  slug: string;
  sku: string; // e.g., "CR7-SQL3-60W"
  name: string;
  category:
    | "led-headlights"
    | "signals-tail-lights"
    | "controls-cockpit"
    | "protection-body"
    | "touring-mounts"
    | "electrical-relays";
  price: number; // Display reference price (in IDR or target currency)
  originalPrice?: number; // Optional strikethrough reference price
  currency: "IDR" | "USD";
  images: {
    url: string;
    alt: string;
    label?: "Main" | "Beam Pattern" | "Installed" | "Dimensions";
  }[];
  shortSpecs: string[]; // Max 3 pills, e.g. ["60W", "Hi/Lo Beam", "IP67"]
  fullSpecs: Record<string, string>; // Key-value table for PDP / Quick View
  compatibility: string[]; // e.g. ["Universal", "NMAX", "PCX 160", "Vario 160"]
  badges?: ("Best Seller" | "New Arrival" | "Waterproof" | "CNC Alloy")[];
  inStock: boolean;
  links: {
    shopee?: string; // Full verified Shopee product URL
    tiktokShop?: string; // Full verified TikTok Shop product URL
  };
  description: string;
}
```

---

## 4. `shadcn/ui` Component Library Architecture

### 4.1 Required `shadcn/ui` Primitives
Install and standardize around the following `shadcn/ui` components:

| `shadcn/ui` Component | Catalog Storefront Role |
| :--- | :--- |
| `Button` | Shopee CTA, TikTok Shop CTA, Quick View trigger, Filter reset, Theme toggle |
| `Card` | Product catalog cards, category highlight tiles, official store trust cards |
| `Badge` | Product highlights (`Best Seller`, `IP67`), fitment tags (`Universal`, `NMAX`), spec pills |
| `Input` | Catalog search input, price range inputs |
| `Select` | Sort dropdown (`Featured`, `Price: Low to High`, `Price: High to Low`, `Newest`) |
| `Tabs` | Category quick-switch bar, PDP tabs (`Specifications`, `Bike Fitment`, `In the Box`) |
| `Sheet` | Mobile filter drawer (`side="left"`), Mobile navigation menu (`side="right"`) |
| `Dialog` | Desktop **Quick View** product modal with full gallery + instant Shopee/TikTok links |
| `Carousel` | Product image gallery (Main shot, Night beam test, Installed photo, Dimensions) |
| `Command` | `Ctrl+K` / `Cmd+K` instant search modal (search by product name, SKU, or bike model) |
| `Accordion` | Technical specs breakdown, installation & warranty FAQ |
| `Skeleton` | Shimmer placeholders for product cards during filtering/loading |
| `Breadcrumb` | `Home / LED Headlights / CR7 SQL 3 Mata Laser` |
| `AspectRatio` | Strict `1 / 1` image framing so cards stay aligned across rows |
| `Tooltip` | Clarifies technical icons (e.g., `IP67 = Dust-tight & water-resistant`) |
| `Separator` | Clean horizontal dividers inside cards and filter groups |
| `ScrollArea` | Scrollable filter facet lists (long list of compatible motorcycle models) |

---

### 4.2 Product Card Specification (Core Reusable Pattern)

The **Product Card** is the highest-impact component in the entire design system.

```text
+--------------------------------------------------+
| [Best Seller]                       [Quick View] |  <- Top overlay badges (z-10)
|                                                  |
|              1:1 Product Image                   |  <- AspectRatio (bg-muted), subtle scale-105 on hover
|            (e.g. LED Projector)                  |     Optional beam-pattern swap on hover
|                                                  |
+--------------------------------------------------+
| LED HEADLIGHTS                        CR7-SQL3   |  <- 11px uppercase muted + mono SKU
| CR7 SQL 3-Eye Laser Mini Driving Light           |  <- 15px semibold, line-clamp-2, min-h-[2.75rem]
| [60W]  [Hi/Lo Yellow-White]  [IP67]              |  <- Mono spec badges (max 3)
| Fits: Universal · NMAX · PCX · ADV               |  <- 12px muted single-line truncate
|--------------------------------------------------|
| Rp 245.000   (Rp 295.000)                        |  <- 18px bold tabular-nums + optional strikethrough
|                                                  |
| [ Shopee ↗ ]           [ TikTok Shop ↗ ]         |  <- Equal 50/50 split on desktop; stacked or icon+label on small mobile
+--------------------------------------------------+
```

#### Marketplace Button Behavior Rules
1. **Both Links Available**: Render a 2-column grid (`grid-cols-2 gap-2`) with **Shopee** on the left and **TikTok Shop** on the right. On very narrow mobile 2-column grids (`<400px` card width), render compact stacked buttons (`min-h-[36px]` inside card, or `44px` inside Quick View / PDP) with clear brand icons (`Shopee` / `TikTok`).
2. **Only One Link Available**: Render a single full-width (`w-full`) button for the active marketplace so layout symmetry never looks broken.
3. **Out of Stock (`inStock: false`)**: Dim image slightly (`opacity-75`), show `"Sold Out"` badge, and change CTA to a neutral outline button `"Check Store Updates ↗"` linking to the shop profile.
4. **Link Security**: Every external link uses `target="_blank" rel="noopener noreferrer"` and optional UTM tracking (`?utm_source=catalog&utm_medium=web&utm_campaign=product_card`).

---

### 4.3 Component States Matrix

| State | Visual Specification |
| :--- | :--- |
| **Default** | `bg-card border border-border`, crisp image frame, full-contrast marketplace CTAs |
| **Hover** | Card border shifts to `border-foreground/20`, `shadow-md`, product image scales `1.04` (`duration-300 ease-out`) |
| **Focus Visible** | `ring-2 ring-ring ring-offset-2 ring-offset-background` on every interactive element (card link, Quick View, Shopee/TikTok CTAs) |
| **Active / Pressed** | `active:scale-[0.98]` tactile press feedback on buttons |
| **Loading** | `Skeleton` matching exact card geometry (`AspectRatio` square + 2 title bars + price bar + 2 CTA bars) to prevent CLS (`0.00`) |
| **Empty Filter State** | Centered icon + *"No accessories match your filters"* + active filter chips + single `"Reset All Filters"` `Button` |

---

## 5. Page Architecture & Layout Specifications

### 5.1 Global Navigation Header (Sticky, `h-16`)
- **Left**: Brand Wordmark (`CR7 MOTO`) + subtle subtitle badge (`Official Catalog`).
- **Center (Desktop)**: Top-level category links (`Lighting`, `Controls`, `Protection`, `Touring`, `All Catalog`).
- **Right**:
  - `Command` Search Button (`Search part or bike model...` + `⌘K` / `Ctrl+K` hint).
  - Official Store Quick Dropdown/Buttons (`Shopee Mall/Store ↗`, `TikTok Shop ↗`).
  - Light/Dark Theme Toggle (`Sun` / `Moon` icon button).
  - Mobile Hamburger (`Sheet` trigger on `<1024px`).
- **Strictly Omitted**: No login button, no wishlist complexity (optional local-only bookmarks only if needed later), and **no shopping cart icon**.

### 5.2 Home Page (`/`)
1. **Hero Showcase Banner**: Split layout (copy + primary CTA `"Browse Catalog"` + direct Official Shopee & TikTok Shop buttons on the left; high-impact dark showcase image of flagship LED/CNC accessory on the right).
2. **Official Marketplace Trust Strip**: 3–4 compact trust pillars (*100% Original Parts*, *Fast Dispatch via Shopee & TikTok Shop*, *Tested Beam & Fitment Specs*, *Official Store Warranty*).
3. **Shop by Category Grid**: 6 visual category cards with item counts and instant deep-links into filtered catalog views.
4. **Quick Bike-Model Filter Strip**: Horizontal scrollable pills (*Universal*, *Yamaha NMAX*, *Honda PCX*, *Honda Vario*, *Aerox*, *CRF / KLX*, *Sport 150–250cc*).
5. **Best Sellers Showcase**: 4-column desktop / 2-column mobile grid of top 8 accessories with direct Shopee & TikTok Shop buttons.
6. **Lighting / Feature Spotlight**: Dedicated visual block highlighting night-beam comparison or flagship CNC hardware.
7. **Footer**: Brand story, official Shopee & TikTok Shop store links, WhatsApp / CS consultation link, operating hours, and disclaimer (*"Prices and promos follow live Shopee & TikTok Shop listings"*).

### 5.3 Full Catalog Page (`/products`)
- **Top Bar**: Breadcrumb, total result count (`Showing 24 accessories`), mobile `"Filters"` `Sheet` trigger, and `Select` sort control.
- **Left Sidebar (Desktop `260px` sticky)**:
  - Category checkboxes / radio list
  - Motorcycle Compatibility (`ScrollArea` filter list)
  - Marketplace Availability (`All`, `Available on Shopee`, `Available on TikTok Shop`)
  - Badges / Features (`Waterproof IP67`, `Best Seller`, `New Arrival`)
  - Active filter pills bar with `"Clear all"` button
- **Main Product Grid**: Responsive 2–4 column catalog grid + Quick View `Dialog` trigger on each card.

### 5.4 Product Detail Page (`/products/[slug]`)
- **Left Column (`55%` desktop)**: `Carousel` gallery with thumbnail strip (Product shot, Light beam test, Installed on bike, Dimension diagram).
- **Right Column (`45%` desktop, sticky)**:
  - Category badge + Mono SKU (`CR7-C915`) + Stock status badge
  - Product H1 Title
  - Reference Price (`tabular-nums`) + subtle helper note: *"Final price, vouchers & shipping calculated at Shopee / TikTok Shop"*
  - **Primary Marketplace Action Box**: Large (`h-12`) high-contrast **Buy on Shopee ↗** and **Buy on TikTok Shop ↗** buttons
  - Compatibility Chips (`Fits: Universal, NMAX, PCX, Vario`)
  - Key Highlights (3–4 concise bullet points)
- **Below Fold**: `Tabs` / `Accordion` for **Technical Specifications Table**, **What's in the Box**, and **Installation / Fitment Notes**, followed by **"Related Accessories"** carousel.
- **Mobile Sticky Bottom Buy Bar (`<768px`)**: Fixed bottom bar (`pb-safe`) containing persistent **Shopee** and **TikTok Shop** buttons (`min-h-[44px]`) so riders can jump straight to purchase while scrolling specs.

### 5.5 Hidden Admin Console (`/admin/login` & `/admin`)
- **URL-Only Access Policy**: There are **zero** login links, icons, or admin buttons anywhere in the public `Navbar`, `Footer`, or catalog views. Store administrators access `/admin/login` (or `/admin`, which redirects unauthenticated requests to `/admin/login`) strictly via direct URL. Both routes emit `robots: noindex, nofollow`.
- **Authentication**: HMAC-SHA256 signed `HttpOnly` cookie session (`cr7_admin_session`) validated server-side in both `/admin` and every `/api/admin/products*` route handler. Credentials are configurable via `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and `ADMIN_SESSION_SECRET` (`.env.local`).
- **Admin CRUD Dashboard (`/admin`)**:
  - Dedicated standalone Admin Topbar (Storefront preview link, Theme toggle, Sign Out — hides public storefront Navbar/Footer via `StorefrontShell`).
  - 4 KPI Cards (`Total Catalog SKUs`, `Active / In Stock`, `Shopee Linked`, `TikTok Shop Linked`).
  - Responsive `shadcn/ui` `Table` (desktop) and stacked management cards (mobile) with live search, category/stock filters, instant `Switch` stock toggle, Insert/Edit `Dialog` (`ProductFormDialog`), and `AlertDialog` delete confirmation.
  - Persists live catalog changes to `data/catalog-store.json` and immediately revalidates the public storefront (`revalidateTag("catalog", "max")` + `revalidatePath`).

---

## 6. Responsive Design Framework

| Breakpoint | Width | Container Max-Width | Catalog Grid Columns | Filter Pattern | Product Card CTA Layout |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Mobile (Base)** | `320px – 639px` | `100%` (`px-4`) | `2 cols` (compact) or `1 col` toggle | `Sheet` Drawer (bottom/left) | Stacked full-width buttons (`gap-1.5`) or icon+short label |
| **Tablet (`sm`/`md`)** | `640px – 1023px` | `768px` (`px-6`) | `2–3 cols` (`gap-4`) | `Sheet` Drawer | 2-col split buttons |
| **Desktop (`lg`)** | `1024px – 1279px` | `1024px` (`px-6`) | `3 cols` (with `260px` sidebar) | Sticky Left Sidebar | 2-col split buttons |
| **Large (`xl`/`2xl`)** | `1280px+` | `1320px` (`px-8`) | `4 cols` (home) / `3–4 cols` (catalog) | Sticky Left Sidebar | 2-col split buttons |

---

## 7. Accessibility Standards (WCAG 2.1 Level AA)

### 7.1 Color Contrast & Visual Clarity
- **Normal Text**: `>= 4.5:1` contrast ratio verified across Light Mode and Dark Mode.
- **Large Text & UI Borders**: `>= 3:1` contrast ratio for headings, input borders, and icons.
- **Non-Color Indicators**: Never rely solely on color to communicate Shopee vs. TikTok Shop or stock status — always combine **brand icon + explicit text label** (`Shopee`, `TikTok Shop`, `Out of Stock`).

### 7.2 Keyboard Navigation & Focus Management
- Full tabbing through navbar, search, filter controls, product cards, and marketplace buttons.
- `shadcn/ui` `Dialog`, `Sheet`, and `Command` components automatically manage focus trapping and restore focus on `Escape`.
- Skip-to-content link (`Skip to product catalog`) as the first focusable element in `app/layout.tsx`.

### 7.3 Screen Reader Semantics
- External marketplace links must include descriptive `aria-label` attributes:
  ```tsx
  <Button asChild className="bg-shopee hover:bg-shopee-hover text-white">
    <a
      href={product.links.shopee}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Buy ${product.name} on Shopee (opens in a new tab)`}
    >
      <ShopeeIcon className="size-4 shrink-0" aria-hidden="true" />
      <span>Shopee</span>
      <ExternalLink className="size-3.5 shrink-0 opacity-80" aria-hidden="true" />
    </a>
  </Button>
  ```
- Product images must describe the accessory clearly (e.g., `"CR7 SQL 3-Eye LED Mini Driving Light mounted aluminum housing"`).

### 7.4 Touch Targets & Motion
- All primary mobile interactive elements (filter triggers, sticky bottom buy buttons, PDP marketplace CTAs, theme toggle) enforce a minimum **`44px × 44px`** hit target.
- Respect reduced motion preferences with Tailwind `motion-reduce:transition-none motion-reduce:hover:scale-100`.
- Layout supports browser zoom up to **200%** without horizontal overflow or clipped button labels.

---

## 8. Performance & Image Optimization Standards

- Use `next/image` with explicit `sizes` attributes (e.g., `sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"`) and modern `WebP`/`AVIF` formats.
- Mark only the Hero showcase image as `priority`; lazy-load catalog images below the fold.
- Use `AspectRatio` (`1/1`) wrappers on every product thumbnail to guarantee **zero Cumulative Layout Shift (`CLS = 0`)**.
- Keep catalog data statically typed or cached cleanly to work seamlessly with Next.js 16 (`cacheComponents: true`).

---

## 9. Developer Handoff & Implementation Guide

### 9.1 `shadcn/ui` Initialization Commands
Run from the workspace root (`c:\Junthau\Project\cr7`):

```bash
# 1. Initialize shadcn/ui (select Tailwind v4 + CSS variables + Neutral/Zinc base)
npx shadcn@latest init

# 2. Install core catalog UI primitives
npx shadcn@latest add button card badge input select tabs sheet dialog carousel command accordion skeleton breadcrumb aspect-ratio tooltip separator scroll-area
```

### 9.2 Recommended Folder Structure
```text
app/
├── globals.css                 # Tailwind v4 + shadcn/ui + Shopee/TikTok tokens
├── layout.tsx                  # Geist fonts, ThemeProvider, Navbar, Footer
├── page.tsx                    # Home showcase (Hero, Categories, Best Sellers)
└── products/
    ├── page.tsx                # Full filterable motorcycle accessories catalog
    └── [slug]/
        └── page.tsx            # Product detail page + sticky mobile buy bar
components/
├── ui/                         # shadcn/ui generated primitives
├── icons/
│   ├── shopee-icon.tsx         # Clean SVG brand mark
│   └── tiktok-shop-icon.tsx    # Clean SVG brand mark
├── layout/
│   ├── navbar.tsx              # Sticky header (no cart icon, official store links)
│   ├── footer.tsx              # Official links, CS contact, marketplace disclaimer
│   └── command-search.tsx      # Ctrl+K SKU / product / bike model search
└── catalog/
    ├── product-card.tsx        # Core card with dual Shopee & TikTok Shop CTAs
    ├── product-grid.tsx        # Responsive 2/3/4-column grid + empty/skeleton states
    ├── product-quick-view.tsx  # shadcn Dialog preview
    ├── marketplace-cta.tsx     # Reusable Shopee/TikTok link buttons (handles 1 or 2 links)
    └── filter-sidebar.tsx      # Desktop sidebar + Mobile Sheet filter controls
data/
├── categories.ts               # Motorcycle accessory category metadata
└── products.ts                 # Typed product catalog with Shopee & TikTok URLs
lib/
└── utils.ts                    # shadcn cn() utility + currency formatter
```

### 9.3 Design QA Pre-Launch Checklist
- [ ] All `shadcn/ui` tokens configured in both `:root` (Light) and `.dark` (Dark) in `app/globals.css`.
- [ ] Zero shopping cart / checkout UI remnants anywhere in header, cards, or footer.
- [ ] Every product card renders gracefully with **both** Shopee & TikTok links, **only one** link, or **out-of-stock** state.
- [ ] All outbound marketplace links open in a new tab with `rel="noopener noreferrer"` and descriptive `aria-label`.
- [ ] Mobile viewport (`375px`) verified: no overflowing button text, smooth `Sheet` filter drawer, sticky PDP buy bar clear of system safe areas.
- [ ] Contrast ratios verified (`>=4.5:1` for text/buttons, including Shopee CTA `#C83214` on white text).
- [ ] Keyboard navigation tested across `Command` search (`Ctrl+K`), filter controls, Quick View `Dialog`, and marketplace buttons.

---

**UI Designer**: Agency UI Designer  
**Design System Version**: 1.0  
**Target Project**: `cr7` (Next.js 16 + Tailwind CSS v4 + `shadcn/ui`)  
**Status**: Ready for Implementation
