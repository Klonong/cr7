# CR7 Racing — Full-Stack Architecture (Next.js 16 + Prisma PostgreSQL + JWT)

This project implements a complete full-stack architecture using **Prisma ORM (PostgreSQL)**, **RFC 7519 HS256 JWT Authentication (`jose`)**, centralized TypeScript contracts in `interface/`, domain-organized client hooks in `hooks/`, and pure presentational TSX components in `components/`.

---

## 1. Directory Structure

```text
prisma/
├── schema.prisma               # Normalized PostgreSQL schema (AdminUser, Category, Motorcycle, Product, ProductVariant, HomeSettings, HomeHighlight)
└── seed.ts                     # Idempotent seed script for AdminUser, Categories, Motorcycles, Products + Variants & Home Content

interface/                      # Single source of truth for ALL TypeScript interfaces
├── catalog.ts                  # Product, ProductVariant, Category, Motorcycle, Filters, Stats & Breakdown
├── home.ts                     # HomeHeroSettings, HomeSectionSettings, HomeTrustPillar, HomeHighlight, HomeContent
├── api.ts                      # API response envelopes, AdminSession, AdminJwtPayload, AdminUserRecord
├── repository.ts               # CatalogRepository, CategoryRepository, MotorcycleRepository, HomeRepository, AdminUserRepository
├── hooks.ts                    # AdminFeedback, VariantDraft, ThemeContextValue, UseProductFiltersOptions
└── index.ts                    # Barrel export

app/                            # Next.js 16 App Router pages & Route Handlers
├── api/
│   ├── products/route.ts       # Public GET /api/products
│   ├── categories/route.ts     # Public GET /api/categories
│   ├── motorcycles/route.ts    # Public GET /api/motorcycles
│   └── admin/
│       ├── login/route.ts      # POST /api/admin/login (100% PostgreSQL AdminUser auth, rate-limited, HS256 JWT + SameSite=Strict HttpOnly cookie)
│       ├── logout/route.ts     # POST /api/admin/logout (bumps tokenVersion in PostgreSQL + clears JWT cookie)
│       ├── me/route.ts         # GET /api/admin/me (verifies JWT + PostgreSQL isActive/tokenVersion)
│       ├── users/              # GET, POST /api/admin/users & PATCH, DELETE /[id] (DB Admin Account Management, RBAC SUPER_ADMIN)
│       ├── upload/route.ts     # POST /api/admin/upload (JWT-protected raster-only upload with magic-byte check)
│       ├── categories/         # GET, POST /api/admin/categories & PUT, DELETE /[slug]
│       ├── motorcycles/        # GET, POST /api/admin/motorcycles & DELETE /[id]
│       ├── home/               # GET, PUT /api/admin/home & highlights CRUD
│       └── products/           # GET, POST /api/admin/products & PUT, PATCH, DELETE /[id]
├── admin/                      # Protected Admin Suite (/admin, /products, /categories, /motorcycles, /home, /users)
├── about/page.tsx              # Tentang Kami + YouTube showcase
├── products/                   # Filterable catalog & PDP with Variant selector
└── page.tsx                    # Home Showcase + Spotlight Carousel

lib/server/                     # Server-only Prisma persistence & JWT security layer
├── prisma.ts                   # Global PrismaClient singleton + graceful unavailability detection
├── password.ts                 # OWASP scrypt password hashing + timingSafeEqual verification
├── admin-auth.ts               # HS256 JWT sign/verify (`jose`), HttpOnly cookie + Bearer header support
├── prisma-admin-user-repository.ts / admin-user-repository.ts
├── prisma-catalog-repository.ts    / catalog-repository.ts    / catalog-service.ts
├── prisma-category-repository.ts   / category-repository.ts   / category-service.ts
├── prisma-motorcycle-repository.ts / motorcycle-repository.ts / motorcycle-service.ts
└── prisma-home-repository.ts       / home-repository.ts       / home-service.ts

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
    ├── use-admin-users.ts      # PostgreSQL AdminUser CRUD, password reset, role & active toggles
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
└── admin/                      # AdminHeader, AdminFeedbackBanner, AdminOverview, AdminLoginForm, AdminDashboard, ProductFormDialog, ImageDropzone, CategoriesManager, CategoryCreateView, CategoryEditDialog, MotorcyclesManager, MotorcycleCreateView, HomeSettingsManager, HighlightFormDialog, AdminUsersManager
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
