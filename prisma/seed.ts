import { Prisma, PrismaClient } from "@prisma/client";
import {
  SEED_CATEGORIES,
  SEED_HOME_CONTENT,
  SEED_MOTORCYCLES,
  SEED_PRODUCTS,
} from "./seed-data";
import { hashPassword } from "../lib/server/password";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding CR7 Racing PostgreSQL database...");

  // 1. Default Super Admin User (strictly in PostgreSQL admin_users)
  const adminUsername = (
    process.env.ADMIN_SEED_USERNAME ||
    process.env.ADMIN_USERNAME ||
    "admin"
  )
    .trim()
    .toLowerCase();
  const adminPassword =
    process.env.ADMIN_SEED_PASSWORD ||
    process.env.ADMIN_PASSWORD ||
    "cr7admin2026";

  const passwordHash = await hashPassword(adminPassword);

  await prisma.adminUser.upsert({
    where: { username: adminUsername },
    update: {},
    create: {
      username: adminUsername,
      passwordHash,
      role: "SUPER_ADMIN",
      isActive: true,
    },
  });
  console.log(`✓ Admin user ready in database: ${adminUsername}`);

  // 2. Imageless Categories
  for (let i = 0; i < SEED_CATEGORIES.length; i++) {
    const cat = SEED_CATEGORIES[i];
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        shortName: cat.shortName,
        description: cat.description,
        sortOrder: i,
      },
      create: {
        slug: cat.slug,
        name: cat.name,
        shortName: cat.shortName,
        description: cat.description,
        sortOrder: i,
      },
    });
  }
  console.log(`✓ Seeded ${SEED_CATEGORIES.length} categories`);

  // 3. Motorcycles
  for (let i = 0; i < SEED_MOTORCYCLES.length; i++) {
    const moto = SEED_MOTORCYCLES[i];
    await prisma.motorcycle.upsert({
      where: { name: moto.name },
      update: {
        brand: moto.brand,
        model: moto.model,
        type: moto.type,
        sortOrder: i,
      },
      create: {
        id: moto.id,
        brand: moto.brand,
        model: moto.model,
        name: moto.name,
        type: moto.type,
        sortOrder: i,
      },
    });
  }
  console.log(`✓ Seeded ${SEED_MOTORCYCLES.length} motorcycles`);

  // 4. Seed 10 CR7 Racing Products + Variants
  for (const prod of SEED_PRODUCTS) {
    const existing = await prisma.product.findUnique({
      where: { slug: prod.slug },
    });

    if (existing) {
      await prisma.product.update({
        where: { id: existing.id },
        data: {
          name: prod.name,
          categorySlug: prod.category,
          price: prod.price,
          originalPrice: prod.originalPrice ?? null,
          currency: prod.currency,
          images: prod.images as unknown as Prisma.InputJsonValue,
          shortSpecs: prod.shortSpecs,
          fullSpecs: prod.fullSpecs as unknown as Prisma.InputJsonValue,
          inTheBox: prod.inTheBox,
          fitmentNotes: prod.fitmentNotes,
          compatibility: prod.compatibility,
          badges: prod.badges ?? [],
          featured: Boolean(prod.featured),
          inStock: prod.inStock,
          shopeeUrl: prod.links.shopee ?? null,
          tiktokShopUrl: prod.links.tiktokShop ?? null,
          description: prod.description,
          variants: {
            deleteMany: {},
            create: prod.variants.map((v, idx) => ({
              id: v.id,
              name: v.name,
              sku: v.sku ?? null,
              price: v.price ?? null,
              inStock: v.inStock,
              colorHex: v.colorHex ?? null,
              shopeeUrl: v.shopeeUrl ?? null,
              tiktokShopUrl: v.tiktokShopUrl ?? null,
              sortOrder: idx,
            })),
          },
        },
      });
    } else {
      await prisma.product.create({
        data: {
          id: prod.id,
          slug: prod.slug,
          sku: prod.sku,
          name: prod.name,
          categorySlug: prod.category,
          price: prod.price,
          originalPrice: prod.originalPrice ?? null,
          currency: prod.currency,
          images: prod.images as unknown as Prisma.InputJsonValue,
          shortSpecs: prod.shortSpecs,
          fullSpecs: prod.fullSpecs as unknown as Prisma.InputJsonValue,
          inTheBox: prod.inTheBox,
          fitmentNotes: prod.fitmentNotes,
          compatibility: prod.compatibility,
          badges: prod.badges ?? [],
          featured: Boolean(prod.featured),
          inStock: prod.inStock,
          shopeeUrl: prod.links.shopee ?? null,
          tiktokShopUrl: prod.links.tiktokShop ?? null,
          description: prod.description,
          variants: {
            create: prod.variants.map((v, idx) => ({
              id: v.id,
              name: v.name,
              sku: v.sku ?? null,
              price: v.price ?? null,
              inStock: v.inStock,
              colorHex: v.colorHex ?? null,
              shopeeUrl: v.shopeeUrl ?? null,
              tiktokShopUrl: v.tiktokShopUrl ?? null,
              sortOrder: idx,
            })),
          },
        },
      });
    }
  }
  console.log(`✓ Seeded ${SEED_PRODUCTS.length} products with variants`);

  // 5. Home Settings Singleton
  await prisma.homeSettings.upsert({
    where: { id: "default" },
    update: {
      hero: SEED_HOME_CONTENT.hero as unknown as Prisma.InputJsonValue,
      sections: SEED_HOME_CONTENT.sections as unknown as Prisma.InputJsonValue,
      trustPillars:
        SEED_HOME_CONTENT.trustPillars as unknown as Prisma.InputJsonValue,
    },
    create: {
      id: "default",
      hero: SEED_HOME_CONTENT.hero as unknown as Prisma.InputJsonValue,
      sections: SEED_HOME_CONTENT.sections as unknown as Prisma.InputJsonValue,
      trustPillars:
        SEED_HOME_CONTENT.trustPillars as unknown as Prisma.InputJsonValue,
    },
  });

  // 6. Home Spotlight Highlights
  for (let i = 0; i < SEED_HOME_CONTENT.highlights.length; i++) {
    const hl = SEED_HOME_CONTENT.highlights[i];
    await prisma.homeHighlight.upsert({
      where: { id: hl.id },
      update: {
        badge: hl.badge,
        title: hl.title,
        description: hl.description,
        bullets: hl.bullets,
        imageUrl: hl.imageUrl,
        imageAlt: hl.imageAlt,
        ctaLabel: hl.ctaLabel,
        ctaHref: hl.ctaHref,
        active: hl.active,
        sortOrder: i,
      },
      create: {
        id: hl.id,
        badge: hl.badge,
        title: hl.title,
        description: hl.description,
        bullets: hl.bullets,
        imageUrl: hl.imageUrl,
        imageAlt: hl.imageAlt,
        ctaLabel: hl.ctaLabel,
        ctaHref: hl.ctaHref,
        active: hl.active,
        sortOrder: i,
      },
    });
  }
  console.log(
    `✓ Seeded HomeSettings & ${SEED_HOME_CONTENT.highlights.length} spotlight highlights`
  );
}

main()
  .catch((err) => {
    console.error("Failed to seed database:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
