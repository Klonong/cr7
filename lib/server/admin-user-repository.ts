import { prismaAdminUserRepository } from "@/lib/server/prisma-admin-user-repository";
import type { AdminUserRepository } from "@/interface/repository";

export const adminUserRepository: AdminUserRepository =
  prismaAdminUserRepository;
