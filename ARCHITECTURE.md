# CR7 MOTO — Frontend Architecture & Backend Integration Guide

This project is structured with clear layer boundaries so you can plug in a real database or external backend API without rewriting any React components or pages.

---

## 1. Directory Structure

```text
app/                            # Next.js 16 App Router pages & Route Handlers
├── api/
│   ├── products/route.ts       # Public GET /api/products
│   └── admin/
│       ├── login/route.ts      # POST /api/admin/login
│       ├── logout/route.ts     # POST /api/admin/logout
│       └── products/
│           ├── route.ts        # GET, POST /api/admin/products
│           └── [id]/route.ts   # PUT, PATCH (stock), DELETE /api/admin/products/[id]
├── admin/
│   ├── page.tsx                # Protected CRUD Console (redirects to /admin/login)
│   └── login/page.tsx          # Hidden URL-only Admin Login (robots: noindex)
├── products/
│   ├── page.tsx                # Filterable public catalog
│   └── [slug]/page.tsx         # Product Detail Page + mobile sticky buy bar
├── page.tsx                    # Home Showcase
└── layout.tsx                  # Root layout + ThemeProvider + StorefrontShell

types/                          # Single source of truth for TypeScript contracts
├── catalog.ts                  # Product, ProductInput, Category, Filters, Stats
└── api.ts                      # API response envelopes & AdminSession

config/
└── store.ts                    # Store URLs, nav links, badges, image presets

data/                           # Static taxonomy & seed data
├── categories.ts               # Motorcycle accessory categories & bike models
├── products.ts                 # Default seed catalog
└── catalog-store.json          # Local JSON persistence (swappable for DB)

lib/
├── utils.ts                    # shadcn cn() utility
├── format.ts                   # formatPrice, getDiscountPercent, slugify, key/value & list parsers
├── catalog-filters.ts          # Pure filterProducts, sortProducts, getRelatedProducts, computeCatalogStats
├── validation/
│   └── product.ts              # Isomorphic validateProductInput() (used on client & server)
├── api/                        # Client-side HTTP layer (zero raw fetch() in UI components)
│   ├── client.ts               # Typed apiFetch<T>() + ApiClientError + getErrorMessage()
│   ├── catalog-api.ts          # fetchPublicProducts, create/update/toggleStock/delete
│   └── auth-api.ts             # loginAdmin, logoutAdmin
└── server/                     # Server-only backend integration boundary
    ├── catalog-repository.ts   # CatalogRepository interface (SWAP POINT #1)
    ├── json-catalog-repository.ts # Default JSON implementation
    ├── catalog-service.ts      # Next.js 16 "use cache" reads + revalidateCatalog()
    └── admin-auth.ts           # Signed HttpOnly cookie auth + requireAdminApiSession() (SWAP POINT #2)

hooks/                          # Reusable stateful React hooks
├── use-product-filters.ts      # Storefront catalog filtering & sorting
└── use-admin-catalog.ts        # Admin CRUD state, optimistic stock toggle & KPI stats

components/
├── ui/                         # shadcn/ui primitives
├── shared/                     # BrandLogo, ThemeToggle, OfficialStoreLinks
├── icons/                      # ShopeeIcon, TikTokShopIcon
├── layout/                     # Navbar, Footer, CommandSearch, StorefrontShell
├── catalog/                    # ProductCard, MarketplaceCta, ProductQuickView, ProductGallery, CatalogBrowser
└── admin/                      # AdminLoginForm, AdminDashboard, ProductFormDialog
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
