import { NextResponse } from "next/server";
import { requireAdminApiSession } from "@/lib/server/admin-auth";
import { logSecurityEvent } from "@/lib/server/audit-log";
import { homeRepository } from "@/lib/server/home-repository";
import { revalidateHomeContent } from "@/lib/server/home-service";
import { getClientIp } from "@/lib/server/rate-limit";
import { validateHighlightInput } from "@/lib/validation/home";

export async function PUT(
  request: Request,
  context: RouteContext<"/api/admin/home/highlights/[id]">
) {
  const auth = await requireAdminApiSession({ request });
  if (auth.response) return auth.response;

  try {
    const { id } = await context.params;
    const body = await request.json();
    const validated = validateHighlightInput(body);
    if (!validated.ok) {
      return NextResponse.json({ error: validated.error }, { status: 400 });
    }

    const highlight = await homeRepository.updateHighlight(id, validated.data);
    if (!highlight) {
      return NextResponse.json(
        { error: "Sorotan tidak ditemukan." },
        { status: 404 }
      );
    }

    revalidateHomeContent();

    logSecurityEvent({
      event: "ADMIN_HOME_MUTATION",
      actor: auth.session.username,
      ip: getClientIp(request),
      target: id,
      detail: "action=update_highlight",
    });

    return NextResponse.json({ highlight });
  } catch {
    return NextResponse.json(
      { error: "Gagal memperbarui sorotan." },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  context: RouteContext<"/api/admin/home/highlights/[id]">
) {
  const auth = await requireAdminApiSession({ request });
  if (auth.response) return auth.response;

  try {
    const { id } = await context.params;
    const body = (await request.json()) as { active?: unknown };
    if (typeof body.active !== "boolean") {
      return NextResponse.json(
        { error: "Field active harus berupa boolean." },
        { status: 400 }
      );
    }

    const highlight = await homeRepository.toggleHighlight(id, body.active);
    if (!highlight) {
      return NextResponse.json(
        { error: "Sorotan tidak ditemukan." },
        { status: 404 }
      );
    }

    revalidateHomeContent();

    logSecurityEvent({
      event: "ADMIN_HOME_MUTATION",
      actor: auth.session.username,
      ip: getClientIp(request),
      target: id,
      detail: `action=toggle_highlight active=${highlight.active}`,
    });

    return NextResponse.json({ highlight });
  } catch {
    return NextResponse.json(
      { error: "Gagal memperbarui visibilitas sorotan." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: RouteContext<"/api/admin/home/highlights/[id]">
) {
  const auth = await requireAdminApiSession({ request });
  if (auth.response) return auth.response;

  try {
    const { id } = await context.params;
    const deleted = await homeRepository.deleteHighlight(id);
    if (!deleted) {
      return NextResponse.json(
        { error: "Sorotan tidak ditemukan." },
        { status: 404 }
      );
    }

    revalidateHomeContent();

    logSecurityEvent({
      event: "ADMIN_HOME_MUTATION",
      actor: auth.session.username,
      ip: getClientIp(request),
      target: id,
      detail: "action=delete_highlight",
    });

    return NextResponse.json({ ok: true, id });
  } catch {
    return NextResponse.json(
      { error: "Gagal menghapus sorotan." },
      { status: 500 }
    );
  }
}
