import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  authenticateAdmin,
  getSessionCookieOptions,
  signAdminJwt,
} from "@/lib/server/admin-auth";
import { logSecurityEvent } from "@/lib/server/audit-log";
import {
  checkRateLimit,
  getClientIp,
  resetRateLimit,
} from "@/lib/server/rate-limit";

const LOGIN_MAX_ATTEMPTS = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export async function POST(request: Request) {
  const ip = getClientIp(request);

  try {
    const body = (await request.json()) as {
      username?: unknown;
      password?: unknown;
    };

    const username =
      typeof body.username === "string" ? body.username.trim().slice(0, 64) : "";
    const password =
      typeof body.password === "string" ? body.password.slice(0, 128) : "";

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username dan password wajib diisi." },
        { status: 400 }
      );
    }

    const rateKey = `login:${ip}:${username.toLowerCase()}`;
    const rate = checkRateLimit(rateKey, LOGIN_MAX_ATTEMPTS, LOGIN_WINDOW_MS);
    if (!rate.allowed) {
      logSecurityEvent({
        event: "AUTH_LOGIN_RATE_LIMITED",
        actor: username.toLowerCase(),
        ip,
        detail: `retryAfter=${rate.retryAfterSeconds}s`,
      });
      return NextResponse.json(
        {
          error:
            "Terlalu banyak percobaan login gagal. Coba kembali dalam beberapa menit.",
        },
        {
          status: 429,
          headers: { "Retry-After": String(rate.retryAfterSeconds) },
        }
      );
    }

    const session = await authenticateAdmin(username, password);
    if (!session) {
      logSecurityEvent({
        event: "AUTH_LOGIN_FAILED",
        actor: username.toLowerCase(),
        ip,
      });
      return NextResponse.json(
        { error: "Username atau password salah." },
        { status: 401 }
      );
    }

    resetRateLimit(rateKey);
    const { token, expiresAt, maxAge } = await signAdminJwt(session);

    logSecurityEvent({
      event: "AUTH_LOGIN_SUCCESS",
      actor: session.username,
      ip,
      detail: `role=${session.role}`,
    });

    const response = NextResponse.json({
      ok: true,
      username: session.username,
      role: session.role,
      expiresAt,
    });
    response.cookies.set(
      ADMIN_COOKIE_NAME,
      token,
      getSessionCookieOptions(maxAge)
    );
    return response;
  } catch (err) {
    if (err instanceof Error && err.message === "DATABASE_NOT_READY") {
      return NextResponse.json(
        {
          error:
            "Database akun admin belum siap. Jalankan migrasi & seed PostgreSQL terlebih dahulu.",
        },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: "Gagal memproses permintaan login." },
      { status: 500 }
    );
  }
}
