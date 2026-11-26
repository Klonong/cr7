import crypto from "crypto";
import { SignJWT, jwtVerify } from "jose";
import { cookies, headers } from "next/headers";
import { connection, NextResponse } from "next/server";
import { adminUserRepository } from "@/lib/server/admin-user-repository";
import { logSecurityEvent } from "@/lib/server/audit-log";
import { verifyPassword } from "@/lib/server/password";
import {
  isDatabaseUnavailableError,
  isPrismaConfigured,
} from "@/lib/server/prisma";
import { getClientIp } from "@/lib/server/rate-limit";
import type { AdminJwtPayload, AdminRole, AdminSession } from "@/interface/api";

export const ADMIN_COOKIE_NAME = "cr7_admin_token";

const JWT_ISSUER = "cr7-racing";
const JWT_AUDIENCE = "cr7-racing-admin";
const DEFAULT_TTL_SECONDS = 60 * 60 * 2; // 2 hours
const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

const DEV_EPHEMERAL_SECRET = crypto.randomBytes(32).toString("hex");

function getJwtSecretBytes(): Uint8Array {
  const secret = process.env.JWT_SECRET?.trim();
  const isProd = process.env.NODE_ENV === "production";

  if (!secret || secret.length < 32) {
    if (isProd) {
      throw new Error(
        "FATAL: JWT_SECRET environment variable must be configured (>= 32 characters) in production."
      );
    }
    return new TextEncoder().encode(secret || DEV_EPHEMERAL_SECRET);
  }

  return new TextEncoder().encode(secret);
}

function getJwtTtlSeconds(): number {
  const raw = (process.env.JWT_EXPIRES_IN || "2h").trim().toLowerCase();
  const match = raw.match(/^(\d+)([smhd])?$/);
  if (!match) return DEFAULT_TTL_SECONDS;
  const amount = Number(match[1]);
  const unit = match[2] || "s";
  if (!Number.isFinite(amount) || amount <= 0) return DEFAULT_TTL_SECONDS;
  const seconds =
    unit === "m"
      ? amount * 60
      : unit === "h"
        ? amount * 3600
        : unit === "d"
          ? amount * 86400
          : amount;
  return Math.min(seconds, 86400);
}

/**
 * Signs an RFC 7519 HS256 JWT containing database AdminUser identity, role, and tokenVersion.
 */
export async function signAdminJwt(
  session: AdminSession
): Promise<{ token: string; expiresAt: string; maxAge: number }> {
  const maxAge = getJwtTtlSeconds();
  const expiresAt = new Date(Date.now() + maxAge * 1000).toISOString();

  const token = await new SignJWT({
    username: session.username,
    role: session.role,
    ver: session.tokenVersion,
  })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject(session.userId)
    .setIssuer(JWT_ISSUER)
    .setAudience(JWT_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(`${maxAge}s`)
    .sign(getJwtSecretBytes());

  return { token, expiresAt, maxAge };
}

/**
 * Verifies HS256 JWT signature, issuer, audience, expiry, AND checks
 * PostgreSQL `admin_users` (`isActive` + `tokenVersion`) on every request.
 */
export async function verifyAdminJwt(
  token: string | undefined | null
): Promise<AdminSession | null> {
  if (!token || !isPrismaConfigured()) return null;

  try {
    const { payload } = await jwtVerify(token, getJwtSecretBytes(), {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
      algorithms: ["HS256"],
    });

    const claims = payload as unknown as Partial<AdminJwtPayload>;
    if (!claims.sub || !claims.username || typeof claims.ver !== "number") {
      return null;
    }

    const user = await adminUserRepository.findById(String(claims.sub));
    if (!user || !user.isActive || user.tokenVersion !== claims.ver) {
      return null;
    }

    return {
      userId: user.id,
      username: user.username,
      role: user.role,
      tokenVersion: user.tokenVersion,
    };
  } catch {
    return null;
  }
}

/**
 * Authenticates admin strictly against PostgreSQL `admin_users` table (zero .env bypass).
 * Throws a clear DatabaseNotReady error if PostgreSQL hasn't been migrated yet.
 */
export async function authenticateAdmin(
  username: string,
  password: string
): Promise<AdminSession | null> {
  const normalizedUsername = username.trim().toLowerCase();
  if (!normalizedUsername || !password) return null;

  if (!isPrismaConfigured()) {
    throw new Error("DATABASE_NOT_READY");
  }

  try {
    const user = await adminUserRepository.findByUsername(normalizedUsername);
    if (!user || !user.isActive) return null;

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) return null;

    return {
      userId: user.id,
      username: user.username,
      role: user.role,
      tokenVersion: user.tokenVersion,
    };
  } catch (err) {
    if (isDatabaseUnavailableError(err)) {
      throw new Error("DATABASE_NOT_READY");
    }
    throw err;
  }
}

/**
 * Revokes all active JWTs for the given database admin user by incrementing `tokenVersion`.
 */
export async function revokeAdminSessions(userId: string): Promise<void> {
  if (!userId || !isPrismaConfigured()) return;
  try {
    await adminUserRepository.incrementTokenVersion(userId);
  } catch (err) {
    if (!isDatabaseUnavailableError(err)) {
      throw err;
    }
  }
}

function isValidCsrfOrigin(request: Request): boolean {
  if (!MUTATING_METHODS.has(request.method.toUpperCase())) return true;

  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
    return true;
  }

  const origin = request.headers.get("origin");
  const host =
    request.headers.get("x-forwarded-host") || request.headers.get("host");

  if (!origin || !host) {
    return !origin;
  }

  try {
    const parsedOrigin = new URL(origin);
    return parsedOrigin.host.toLowerCase() === host.toLowerCase();
  } catch {
    return false;
  }
}

export async function getAdminSession(): Promise<AdminSession | null> {
  await connection();

  const headerStore = await headers();
  const authHeader = headerStore.get("authorization");
  if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
    const bearerToken = authHeader.slice(7).trim();
    const fromHeader = await verifyAdminJwt(bearerToken);
    if (fromHeader) return fromHeader;
  }

  const cookieStore = await cookies();
  const cookieToken = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return verifyAdminJwt(cookieToken);
}

export async function requireAdminApiSession(options?: {
  request?: Request;
  allowedRoles?: AdminRole[];
}): Promise<
  | { session: AdminSession; response?: never }
  | { session?: never; response: NextResponse }
> {
  if (options?.request && !isValidCsrfOrigin(options.request)) {
    logSecurityEvent({
      event: "CSRF_ORIGIN_BLOCKED",
      ip: getClientIp(options.request),
      detail: `${options.request.method} ${new URL(options.request.url).pathname}`,
    });
    return {
      response: NextResponse.json(
        { error: "Permintaan ditolak (Origin tidak valid)." },
        { status: 403 }
      ),
    };
  }

  const session = await getAdminSession();
  if (!session) {
    return {
      response: NextResponse.json(
        { error: "Sesi tidak valid atau telah berakhir. Silakan login kembali." },
        { status: 401 }
      ),
    };
  }

  if (
    options?.allowedRoles &&
    options.allowedRoles.length > 0 &&
    !options.allowedRoles.includes(session.role)
  ) {
    logSecurityEvent({
      event: "AUTH_FORBIDDEN_ROLE",
      actor: session.username,
      ip: options.request ? getClientIp(options.request) : undefined,
      detail: `role=${session.role}`,
    });
    return {
      response: NextResponse.json(
        { error: "Anda tidak memiliki izin untuk aksi ini." },
        { status: 403 }
      ),
    };
  }

  return { session };
}

export function getSessionCookieOptions(maxAge = getJwtTtlSeconds()) {
  return {
    httpOnly: true,
    sameSite: "strict" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  };
}
