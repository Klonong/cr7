import { NextResponse } from "next/server";
import { requireAdminApiSession } from "@/lib/server/admin-auth";
import { logSecurityEvent } from "@/lib/server/audit-log";
import { motorcycleRepository } from "@/lib/server/motorcycle-repository";
import { revalidateMotorcycles } from "@/lib/server/motorcycle-service";
import { getClientIp } from "@/lib/server/rate-limit";

export async function DELETE(
  request: Request,
  context: RouteContext<"/api/admin/motorcycles/[id]">
) {
  const auth = await requireAdminApiSession({ request });
  if (auth.response) return auth.response;

  try {
    const { id } = await context.params;
    const deleted = await motorcycleRepository.delete(id);
    if (!deleted) {
      return NextResponse.json(
        { error: "Data motor tidak ditemukan." },
        { status: 404 }
      );
    }

    revalidateMotorcycles();

    logSecurityEvent({
      event: "ADMIN_MOTORCYCLE_MUTATION",
      actor: auth.session.username,
      ip: getClientIp(request),
      target: id,
      detail: "action=delete",
    });

    return NextResponse.json({ ok: true, id });
  } catch {
    return NextResponse.json(
      { error: "Gagal menghapus data motor." },
      { status: 500 }
    );
  }
}
