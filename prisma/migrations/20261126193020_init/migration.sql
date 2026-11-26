-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('ADMIN', 'SUPER_ADMIN');

-- CreateTable
CREATE TABLE "admin_users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "AdminRole" NOT NULL DEFAULT 'ADMIN',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "token_version" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "short_name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("slug")
);

-- CreateTable
CREATE TABLE "motorcycles" (
    "id" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "motorcycles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category_slug" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "original_price" INTEGER,
    "currency" TEXT NOT NULL DEFAULT 'IDR',
    "images" JSONB NOT NULL,
    "short_specs" TEXT[],
    "full_specs" JSONB NOT NULL,
    "in_the_box" TEXT[],
    "fitment_notes" TEXT NOT NULL DEFAULT '',
    "compatibility" TEXT[],
    "badges" TEXT[],
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "in_stock" BOOLEAN NOT NULL DEFAULT true,
    "shopee_url" TEXT,
    "tiktok_shop_url" TEXT,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_variants" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sku" TEXT,
    "price" INTEGER,
    "in_stock" BOOLEAN NOT NULL DEFAULT true,
    "color_hex" TEXT,
    "shopee_url" TEXT,
    "tiktok_shop_url" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "product_variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "home_settings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "hero" JSONB NOT NULL,
    "sections" JSONB NOT NULL,
    "trust_pillars" JSONB NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "home_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "home_highlights" (
    "id" TEXT NOT NULL,
    "badge" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "bullets" TEXT[],
    "image_url" TEXT NOT NULL,
    "image_alt" TEXT NOT NULL,
    "cta_label" TEXT NOT NULL,
    "cta_href" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "home_highlights_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_username_key" ON "admin_users"("username");

-- CreateIndex
CREATE INDEX "admin_users_username_is_active_idx" ON "admin_users"("username", "is_active");

-- CreateIndex
CREATE INDEX "categories_sort_order_idx" ON "categories"("sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "motorcycles_name_key" ON "motorcycles"("name");

-- CreateIndex
CREATE INDEX "motorcycles_brand_idx" ON "motorcycles"("brand");

-- CreateIndex
CREATE INDEX "motorcycles_type_idx" ON "motorcycles"("type");

-- CreateIndex
CREATE INDEX "motorcycles_sort_order_idx" ON "motorcycles"("sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "products_slug_key" ON "products"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "products_sku_key" ON "products"("sku");

-- CreateIndex
CREATE INDEX "products_category_slug_idx" ON "products"("category_slug");

-- CreateIndex
CREATE INDEX "products_featured_in_stock_idx" ON "products"("featured", "in_stock");

-- CreateIndex
CREATE INDEX "products_in_stock_created_at_idx" ON "products"("in_stock", "created_at");

-- CreateIndex
CREATE INDEX "product_variants_product_id_sort_order_idx" ON "product_variants"("product_id", "sort_order");

-- CreateIndex
CREATE INDEX "home_highlights_active_sort_order_idx" ON "home_highlights"("active", "sort_order");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_category_slug_fkey" FOREIGN KEY ("category_slug") REFERENCES "categories"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
