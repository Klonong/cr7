import { Prisma, PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  __cr7Prisma?: PrismaClient;
};

export const prisma: PrismaClient =
  globalForPrisma.__cr7Prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.__cr7Prisma = prisma;
}

export function isPrismaConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL && process.env.DATABASE_URL.trim());
}

/**
 * Detects connection / schema-not-yet-migrated errors so static prerenders
 * can fall back gracefully to seed defaults before the first migration runs.
 */
export function isDatabaseUnavailableError(error: unknown): boolean {
  if (error instanceof Prisma.PrismaClientInitializationError) return true;
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // P1001: Can't reach DB server, P1002: Timed out, P1003: DB does not exist,
    // P2021: Table does not exist, P2022: Column does not exist
    return ["P1001", "P1002", "P1003", "P2021", "P2022"].includes(error.code);
  }
  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    return (
      msg.includes("can't reach database server") ||
      msg.includes("econnrefused") ||
      msg.includes("does not exist") ||
      msg.includes("authentication failed")
    );
  }
  return false;
}
