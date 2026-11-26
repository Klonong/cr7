import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/server/prisma";
import type {
  AdminRole,
  AdminUserPublic,
  AdminUserRecord,
} from "@/interface/api";
import type { AdminUserRepository } from "@/interface/repository";

function mapAdminUser(row: {
  id: string;
  username: string;
  passwordHash: string;
  role: string;
  isActive: boolean;
  tokenVersion: number;
  createdAt: Date;
  updatedAt: Date;
}): AdminUserRecord {
  return {
    id: row.id,
    username: row.username,
    passwordHash: row.passwordHash,
    role: (row.role === "SUPER_ADMIN" ? "SUPER_ADMIN" : "ADMIN") as AdminRole,
    isActive: row.isActive,
    tokenVersion: row.tokenVersion,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function mapAdminUserPublic(row: {
  id: string;
  username: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}): AdminUserPublic {
  return {
    id: row.id,
    username: row.username,
    role: (row.role === "SUPER_ADMIN" ? "SUPER_ADMIN" : "ADMIN") as AdminRole,
    isActive: row.isActive,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export const prismaAdminUserRepository: AdminUserRepository = {
  async findAllPublic(): Promise<AdminUserPublic[]> {
    const rows = await prisma.adminUser.findMany({
      select: {
        id: true,
        username: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: [{ createdAt: "asc" }],
    });
    return rows.map(mapAdminUserPublic);
  },

  async findByUsername(username: string): Promise<AdminUserRecord | null> {
    const normalized = username.trim().toLowerCase();
    if (!normalized) return null;
    const row = await prisma.adminUser.findUnique({
      where: { username: normalized },
    });
    return row ? mapAdminUser(row) : null;
  },

  async findById(id: string): Promise<AdminUserRecord | null> {
    const row = await prisma.adminUser.findUnique({ where: { id } });
    return row ? mapAdminUser(row) : null;
  },

  async countActiveSuperAdmins(): Promise<number> {
    return prisma.adminUser.count({
      where: { role: "SUPER_ADMIN", isActive: true },
    });
  },

  async create(input): Promise<AdminUserPublic> {
    const username = input.username.trim().toLowerCase();
    try {
      const created = await prisma.adminUser.create({
        data: {
          username,
          passwordHash: input.passwordHash,
          role: input.role,
          isActive: true,
        },
        select: {
          id: true,
          username: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      return mapAdminUserPublic(created);
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002"
      ) {
        throw new Error(`Username "${username}" sudah terdaftar.`);
      }
      throw err;
    }
  },

  async update(id, input): Promise<AdminUserPublic | null> {
    try {
      const updated = await prisma.adminUser.update({
        where: { id },
        data: {
          ...(input.passwordHash ? { passwordHash: input.passwordHash } : {}),
          ...(input.role ? { role: input.role } : {}),
          ...(typeof input.isActive === "boolean"
            ? { isActive: input.isActive }
            : {}),
          ...(input.bumpTokenVersion
            ? { tokenVersion: { increment: 1 } }
            : {}),
        },
        select: {
          id: true,
          username: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      return mapAdminUserPublic(updated);
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2025"
      ) {
        return null;
      }
      throw err;
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.adminUser.delete({ where: { id } });
      return true;
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2025"
      ) {
        return false;
      }
      throw err;
    }
  },

  async ensureDefaultAdmin(
    username: string,
    passwordHash: string
  ): Promise<AdminUserRecord> {
    const normalized = username.trim().toLowerCase();
    const row = await prisma.adminUser.upsert({
      where: { username: normalized },
      update: {},
      create: {
        username: normalized,
        passwordHash,
        role: "SUPER_ADMIN",
        isActive: true,
      },
    });
    return mapAdminUser(row);
  },

  async incrementTokenVersion(id: string): Promise<void> {
    await prisma.adminUser.updateMany({
      where: { id },
      data: { tokenVersion: { increment: 1 } },
    });
  },
};
