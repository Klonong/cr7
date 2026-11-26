import { NextResponse } from "next/server";
import { requireAdminApiSession } from "@/lib/server/admin-auth";
import { adminUserRepository } from "@/lib/server/admin-user-repository";
import { logSecurityEvent } from "@/lib/server/audit-log";
import { hashPassword } from "@/lib/server/password";
import { getClientIp } from "@/lib/server/rate-limit";
import { validateAdminUserCreate } from "@/lib/validation/admin-user";

export async function GET() {
  const auth = await requireAdminApiSession();
  if (auth.response) return auth.response;

  try {
    const users = await adminUserRepository.findAllPublic();
    return NextResponse.json({ users });
  } catch {
    return NextResponse.json(
      { error: "Gagal memuat daftar akun admin dari database." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const auth = await requireAdminApiSession({
    request,
    allowedRoles: ["SUPER_ADMIN"],
  });
  if (auth.response) return auth.response;

  try {
    const body = await request.json();
    const validated = validateAdminUserCreate(body);
    if (!validated.ok) {
      return NextResponse.json({ error: validated.error }, { status: 400 });
    }

    const passwordHash = await hashPassword(validated.data.password);
    const created = await adminUserRepository.create({
      username: validated.data.username,
      passwordHash,
      role: validated.data.role,
    });

    logSecurityEvent({
      event: "ADMIN_USER_MUTATION",
      actor: auth.session.username,
      ip: getClientIp(request),
      target: created.id,
      detail: `action=create username=${created.username} role=${created.role}`,
    });

    return NextResponse.json({ user: created }, { status: 201 });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Gagal menambahkan akun admin.";
    const status = message.includes("sudah terdaftar") ? 409 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
