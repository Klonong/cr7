import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  getAdminSession,
  revokeAdminSessions,
} from "@/lib/server/admin-auth";
import { logSecurityEvent } from "@/lib/server/audit-log";
import { getClientIp } from "@/lib/server/rate-limit";

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (session) {
    await revokeAdminSessions(session.userId);
    logSecurityEvent({
      event: "AUTH_LOGOUT",
      actor: session.username,
      ip: getClientIp(request),
    });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return response;
}
