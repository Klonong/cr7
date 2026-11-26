import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  getSessionCookieOptions,
  requireAdminApiSession,
  signAdminJwt,
} from "@/lib/server/admin-auth";
import { adminUserRepository } from "@/lib/server/admin-user-repository";
import { logSecurityEvent } from "@/lib/server/audit-log";
import { hashPassword } from "@/lib/server/password";
import { getClientIp } from "@/lib/server/rate-limit";
import { validateAdminUserUpdate } from "@/lib/validation/admin-user";

export async function PATCH(
  request: Request,
  context: RouteContext<"/api/admin/users/[id]">
) {
  const auth = await requireAdminApiSession({ request });
  if (auth.response) return auth.response;

  try {
    const { id } = await context.params;
    const isSelf = auth.session.userId === id;
    const isSuperAdmin = auth.session.role === "SUPER_ADMIN";

    const body = await request.json();
    const validated = validateAdminUserUpdate(body);
    if (!validated.ok) {
      return NextResponse.json({ error: validated.error }, { status: 400 });
    }

    const data = validated.data;

    // Regular ADMIN may only change their own password
    if (!isSuperAdmin) {
      if (!isSelf || data.role !== undefined || data.isActive !== undefined) {
        return NextResponse.json(
          { error: "Hanya Super Admin yang dapat mengelola akun admin lain." },
          { status: 403 }
        );
      }
    }

    const target = await adminUserRepository.findById(id);
    if (!target) {
      return NextResponse.json(
        { error: "Akun admin tidak ditemukan." },
        { status: 404 }
      );
    }

    // Prevent locking out self or removing the last active SUPER_ADMIN
    if (isSelf && data.isActive === false) {
      return NextResponse.json(
        { error: "Anda tidak dapat menonaktifkan akun Anda sendiri." },
        { status: 400 }
      );
    }

    const wouldLoseSuperAdmin =
      target.role === "SUPER_ADMIN" &&
      target.isActive &&
      (data.isActive === false || data.role === "ADMIN");

    if (wouldLoseSuperAdmin) {
      const superAdminCount = await adminUserRepository.countActiveSuperAdmins();
      if (superAdminCount <= 1) {
        return NextResponse.json(
          {
            error:
              "Minimal harus ada 1 akun Super Admin yang aktif di database.",
          },
          { status: 409 }
        );
      }
    }

    const passwordHash = data.password
      ? await hashPassword(data.password)
      : undefined;

    // Revoke active JWTs whenever password, role, or active status changes.
    // When updating own password/role, immediately reissue a fresh JWT cookie so this session stays active.
    const shouldRevoke =
      Boolean(passwordHash) ||
      data.isActive === false ||
      (data.role !== undefined && data.role !== target.role);

    const updated = await adminUserRepository.update(id, {
      passwordHash,
      role: data.role,
      isActive: data.isActive,
      bumpTokenVersion: shouldRevoke,
    });

    if (!updated) {
      return NextResponse.json(
        { error: "Akun admin tidak ditemukan." },
        { status: 404 }
      );
    }

    logSecurityEvent({
      event: "ADMIN_USER_MUTATION",
      actor: auth.session.username,
      ip: getClientIp(request),
      target: id,
      detail: `action=update targetUser=${updated.username}`,
    });

    const response = NextResponse.json({ user: updated });

    if (isSelf && shouldRevoke && updated.isActive) {
      const refreshed = await adminUserRepository.findById(id);
      if (refreshed && refreshed.isActive) {
        const { token, maxAge } = await signAdminJwt({
          userId: refreshed.id,
          username: refreshed.username,
          role: refreshed.role,
          tokenVersion: refreshed.tokenVersion,
        });
        response.cookies.set(
          ADMIN_COOKIE_NAME,
          token,
          getSessionCookieOptions(maxAge)
        );
      }
    }

    return response;
  } catch {
    return NextResponse.json(
      { error: "Gagal memperbarui akun admin." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: RouteContext<"/api/admin/users/[id]">
) {
  const auth = await requireAdminApiSession({
    request,
    allowedRoles: ["SUPER_ADMIN"],
  });
  if (auth.response) return auth.response;

  try {
    const { id } = await context.params;
    if (auth.session.userId === id) {
      return NextResponse.json(
        { error: "Anda tidak dapat menghapus akun Anda sendiri." },
        { status: 400 }
      );
    }

    const target = await adminUserRepository.findById(id);
    if (!target) {
      return NextResponse.json(
        { error: "Akun admin tidak ditemukan." },
        { status: 404 }
      );
    }

    if (target.role === "SUPER_ADMIN" && target.isActive) {
      const superAdminCount = await adminUserRepository.countActiveSuperAdmins();
      if (superAdminCount <= 1) {
        return NextResponse.json(
          { error: "Tidak dapat menghapus satu-satunya Super Admin aktif." },
          { status: 409 }
        );
      }
    }

    await adminUserRepository.delete(id);

    logSecurityEvent({
      event: "ADMIN_USER_MUTATION",
      actor: auth.session.username,
      ip: getClientIp(request),
      target: id,
      detail: `action=delete targetUser=${target.username}`,
    });

    return NextResponse.json({ ok: true, id });
  } catch {
    return NextResponse.json(
      { error: "Gagal menghapus akun admin." },
      { status: 500 }
    );
  }
}
