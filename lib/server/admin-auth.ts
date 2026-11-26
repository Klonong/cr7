import crypto from "crypto";
import { cookies } from "next/headers";
import { connection, NextResponse } from "next/server";
import type { AdminSession } from "@/types/api";

export const ADMIN_COOKIE_NAME = "cr7_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

/**
 * Swap verifyCredentials() with your real backend user/password check
 * (e.g., database lookup + bcrypt/argon2 or external auth provider).
 */
function getAdminUsername(): string {
  return process.env.ADMIN_USERNAME || "admin";
}

function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || "cr7admin2026";
}

function getSessionSecret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    "cr7-moto-local-dev-secret-change-in-production"
  );
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export async function verifyAdminCredentials(
  username: string,
  password: string
): Promise<boolean> {
  return (
    safeEqual(username.trim(), getAdminUsername()) &&
    safeEqual(password, getAdminPassword())
  );
}

function signPayload(payloadB64: string): string {
  return crypto
    .createHmac("sha256", getSessionSecret())
    .update(payloadB64)
    .digest("base64url");
}

export function createSessionToken(username: string): string {
  const payload = JSON.stringify({
    u: username,
    exp: Date.now() + SESSION_TTL_MS,
  });
  const payloadB64 = Buffer.from(payload, "utf8").toString("base64url");
  const sig = signPayload(payloadB64);
  return `${payloadB64}.${sig}`;
}

export function verifySessionToken(
  token: string | undefined | null
): AdminSession | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payloadB64, sig] = parts;
  const expectedSig = signPayload(payloadB64);
  if (!safeEqual(sig, expectedSig)) return null;

  try {
    const parsed = JSON.parse(
      Buffer.from(payloadB64, "base64url").toString("utf8")
    ) as { u?: string; exp?: number };

    if (!parsed.u || !parsed.exp || Date.now() > parsed.exp) {
      return null;
    }
    return { username: parsed.u };
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<AdminSession | null> {
  await connection();
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export async function requireAdminApiSession(): Promise<
  { session: AdminSession; response?: never } | { session?: never; response: NextResponse }
> {
  const session = await getAdminSession();
  if (!session) {
    return {
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  return { session };
}

export function getSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  };
}
