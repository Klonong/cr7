# CR7 Racing — Frontend Architecture & Backend Integration Guide

This project is structured with clear layer boundaries so you can plug in a real database or external backend API without rewriting any React components or pages.

---

## 1. Directory Structure

```text
app/                            # Next.js 16 App Router pages & Route Handlers
├── api/
│   ├── products/route.ts       # Public GET /api/products
│   ├── categories/route.ts     # Public GET /api/categories
│   ├── motorcycles/route.ts    # Public GET /api/motorcycles
│   └── admin/
│       ├── login/route.ts      # POST /api/admin/login
│       ├── logout/route.ts     # POST /api/admin/logout
│       ├── upload/route.ts     # POST /api/admin/upload (Drag & Drop image upload to public/uploads)
│       ├── categories/
│       │   ├── route.ts        # GET, POST /api/admin/categories
│       │   └── [slug]/route.ts # PUT, DELETE /api/admin/categories/[slug]
│       ├── motorcycles/
│       │   ├── route.ts        # GET, POST /api/admin/motorcycles
│       │   └── [id]/route.ts   # DELETE /api/admin/motorcycles/[id]
│       ├── home/
│       │   ├── route.ts        # GET, PUT /api/admin/home (hero, sections, trust pillars)
│       │   └── highlights/
│       │       ├── route.ts    # POST /api/admin/home/highlights
│       │       └── [id]/route.ts # PUT, PATCH (active), DELETE highlight
│       └── products/
│           ├── route.ts        # GET, POST /api/admin/products
│           └── [id]/route.ts   # PUT, PATCH (stock), DELETE /api/admin/products/[id]
├── admin/
│   ├── page.tsx                # Protected Admin Dashboard Overview (KPIs, breakdown, alerts)
│   ├── products/page.tsx       # Protected Catalog Products CRUD Console (with Variants & Drag-Drop)
│   ├── categories/
│   │   ├── page.tsx            # Protected Categories Management Console (imageless)
│   │   └── new/page.tsx        # Dedicated Create New Category Page + Live Preview
│   ├── motorcycles/
│   │   ├── page.tsx            # Protected Motorcycle Compatibility Models Console
│   │   └── new/page.tsx        # Dedicated Add Motorcycle Page + Live Preview
│   ├── home/page.tsx           # Protected Home Content & Spotlight Carousel Highlights Console
│   └── login/page.tsx          # Hidden URL-only Admin Login (robots: noindex)
├── about/
│   └── page.tsx                # Tentang Kami page + YouTube Channel link & embedded video showcase
├── products/
│   ├── page.tsx                # Filterable public catalog
│   └── [slug]/page.tsx         # Product Detail Page + Variant selector + mobile sticky buy bar
├── page.tsx                    # Home Showcase (Hero, Categories, Motorcycles, Featured, Spotlight Carousel)
└── layout.tsx                  # Root layout + ThemeProvider + StorefrontShell + FloatingWhatsApp

types/                          # Single source of truth for TypeScript contracts
├── catalog.ts                  # Product, ProductVariant, ProductInput, Category, Motorcycle, Filters, Stats
└── api.ts                      # API response envelopes, UploadImageResponse & AdminSession

config/
└── store.ts                    # CR7 Racing store URLs, YouTube showcase videos, nav links, badges, image presets

data/                           # Static taxonomy & seed data (Bahasa Indonesia)
├── categories.ts               # Imageless categories & DEFAULT_MOTORCYCLES
├── products.ts                 # Default seed catalog with variants per product
├── home-defaults.ts            # Default Indonesian hero, trust pillars & 3 spotlight highlights
└── *-store.json                # Local JSON persistence (swappable for DB)

lib/
├── utils.ts                    # shadcn cn() utility
├── format.ts                   # formatPrice, getDiscountPercent, slugify, key/value & list parsers
├── catalog-filters.ts          # Pure filterProducts, sortProducts, getRelatedProducts, computeCatalogStats
├── validation/
│   ├── product.ts              # Isomorphic validateProductInput() including variants[]
│   ├── category.ts             # Isomorphic validateCategoryInput() (imageless)
│   ├── motorcycle.ts           # Isomorphic validateMotorcycleInput()
│   └── home.ts                 # Isomorphic validateHomeSettingsInput() & validateHighlightInput()
├── api/                        # Client-side HTTP layer (zero raw fetch() in UI components)
│   ├── client.ts               # Typed apiFetch<T>() + ApiClientError + getErrorMessage()
│   ├── catalog-api.ts          # fetchPublicProducts, create/update/toggleStock/delete
│   ├── category-api.ts         # fetchPublicCategories, create/update/delete
│   ├── motorcycle-api.ts       # fetchPublicMotorcycles, create/delete
│   ├── upload-api.ts           # uploadAdminImage() (FormData upload for ImageDropzone)
│   ├── home-api.ts             # saveHomeSettings, create/update/toggle/delete highlights
│   └── auth-api.ts             # loginAdmin, logoutAdmin
└── server/                     # Server-only backend integration boundary
    ├── catalog-repository.ts   # CatalogRepository interface (SWAP POINT #1)
    ├── json-catalog-repository.ts # Default JSON implementation
    ├── catalog-service.ts      # Next.js 16 "use cache" reads + revalidateCatalog()
    ├── category-repository.ts  # CategoryRepository interface (SWAP POINT #2)
    ├── category-service.ts     # Next.js 16 "use cache" reads + revalidateCategories()
    ├── motorcycle-repository.ts # MotorcycleRepository interface (SWAP POINT #3)
    ├── motorcycle-service.ts   # Next.js 16 "use cache" reads + revalidateMotorcycles()
    ├── home-repository.ts      # HomeRepository interface (SWAP POINT #4)
    ├── json-home-repository.ts # Default JSON home-content implementation
    ├── home-service.ts         # Next.js 16 "use cache" reads + revalidateHomeContent()
    └── admin-auth.ts           # Signed HttpOnly cookie auth + requireAdminApiSession() (SWAP POINT #5)

hooks/                          # ALL client-side state, effects, forms & API logic (organized by domain)
├── shared/
│   └── use-theme.ts            # Theme external store, DOM syncing, ThemeContext & useTheme()
├── layout/
│   ├── use-route-flags.ts      # StorefrontShell & FloatingWhatsApp route matching
│   ├── use-navbar.ts           # Mobile drawer state & live category sync
│   └── use-command-search.ts   # Ctrl+K shortcut, live catalog/category/motorcycle search & nav
├── about/
│   └── use-youtube-showcase.ts # Active YouTube showcase video selection
├── catalog/
│   ├── use-product-filters.ts  # Storefront catalog filtering & sorting
│   ├── use-catalog-browser.ts  # URL search param sync, filters, mobile sheet & quick-view state
│   ├── use-product-variant.ts  # Shared variant selection, active SKU/price/stock & image selection
│   ├── use-product-gallery.ts  # Embla carousel API & thumbnail selection
│   ├── use-product-card.ts     # Hover secondary image preview & card metadata derivation
│   ├── use-quick-view.ts       # Shared quick-view dialog state
│   └── use-spotlight-carousel.ts # Embla carousel, reduced-motion auto-advance & hover pause
└── admin/
    ├── use-admin-header.ts     # Active route detection & logout flow
    ├── use-admin-login.ts      # Login credentials, visibility toggle & submission
    ├── use-admin-catalog.ts    # Product CRUD, optimistic stock toggle, filters & modals
    ├── use-admin-categories.ts # Category CRUD, product counts, search & banners
    ├── use-admin-motorcycles.ts # Motorcycle CRUD, compatibility counts & banners
    ├── use-admin-home.ts       # Home settings draft state & Spotlight Highlights CRUD
    ├── use-product-form.ts     # Product create/edit form, variants editor & validation
    ├── use-category-form.ts    # Category create & edit form hooks
    ├── use-motorcycle-form.ts  # Motorcycle create form & duplicate validation
    ├── use-highlight-form.ts   # Highlight create/edit modal form & validation
    └── use-image-dropzone.ts   # Drag-and-drop file upload, keyboard access & preview state

components/                     # Purely presentational TSX components (zero inline state/effects)
├── ui/                         # shadcn/ui primitives (including Carousel)
├── providers/                  # ThemeProvider
├── shared/                     # BrandLogo, ThemeToggle, OfficialStoreLinks, FloatingWhatsApp
├── icons/                      # ShopeeIcon, TikTokShopIcon, YouTubeIcon, InstagramIcon, FacebookIcon, TikTokIcon, WhatsAppIcon
├── layout/                     # Navbar, Footer, CommandSearch, StorefrontShell
├── about/                      # YouTubeShowcase (channel CTA + interactive YouTube embed player)
├── catalog/                    # ProductCard, MarketplaceCta, ProductQuickView, ProductDetailPurchase, ProductGallery, CatalogBrowser, SpotlightCarousel
└── admin/                      # AdminHeader, AdminFeedbackBanner, AdminOverview, AdminLoginForm, AdminDashboard, ProductFormDialog, ImageDropzone, CategoriesManager, CategoryCreateView, CategoryEditDialog, MotorcyclesManager, MotorcycleCreateView, HomeSettingsManager, HighlightFormDialog
```

---

## 2. How to Plug In Your Real Backend

### Option A — Full-Stack Next.js (PostgreSQL / MySQL / Prisma / Drizzle / Supabase)
1. **Swap Catalog Persistence** (`1 file`):
   - Create `lib/server/db-catalog-repository.ts` implementing `CatalogRepository` (`findAll`, `findBySlug`, `create`, `update`, `updateStock`, `delete`).
   - Update the single export in `lib/server/catalog-repository.ts`:
     ```ts
     export const catalogRepository: CatalogRepository = dbCatalogRepository;
     ```
2. **Swap Admin Authentication** (`1 function`):
   - Replace `verifyAdminCredentials()` in `lib/server/admin-auth.ts` with your database admin lookup + `bcrypt` / `argon2` hash verification (or your auth provider).
3. All Server Components, Next.js 16 `cacheTag("catalog")` caching, API routes, and Admin UI work automatically without modification.

### Option B — Separate External Backend (Express / NestJS / Go / Laravel / FastAPI)
1. Set `NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com` in `.env.local`.
2. Update endpoint paths or auth headers in `lib/api/client.ts`, `lib/api/catalog-api.ts`, and `lib/api/auth-api.ts`.
3. Implement `CatalogRepository` in `lib/server/catalog-repository.ts` to call your backend's server-side endpoints so SSR / Server Components stay fast and cached.

---

## 3. Reusable Functions & Hooks Quick Reference

| Module | Reusable Exports | Used By |
| :--- | :--- | :--- |
| `lib/format.ts` | `formatPrice`, `getDiscountPercent`, `slugify`, `parseKeyValueLines`, `serializeKeyValueLines`, `parseCsvList`, `parseNewlineList` | Cards, Quick View, PDP, Admin Form, Repository |
| `lib/catalog-filters.ts` | `filterProducts`, `sortProducts`, `getFeaturedProducts`, `getRelatedProducts`, `computeCatalogStats` | Home, Catalog Hook, PDP, Admin Hook |
| `lib/validation/product.ts` | `validateProductInput`, `isSafeHttpUrl` | Product Form (client) & Admin API Routes (server) |
| `lib/api/catalog-api.ts` | `fetchPublicProducts`, `createCatalogProduct`, `updateCatalogProduct`, `setCatalogProductStock`, `deleteCatalogProduct` | Command Search, Product Form, Admin Hook |
| `lib/api/auth-api.ts` | `loginAdmin`, `logoutAdmin` | Admin Login Form, Admin Dashboard |
| `hooks/use-product-filters.ts` | `useProductFilters` | `CatalogBrowser` |
| `hooks/use-admin-catalog.ts` | `useAdminCatalog` | `AdminDashboard` |
| `components/shared/*` | `BrandLogo`, `ThemeToggle`, `OfficialStoreLinks` | Navbar, Footer, Home Hero, Admin Header, Admin Login |
