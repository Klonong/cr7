import { NextResponse } from "next/server";
import { requireAdminApiSession } from "@/lib/server/admin-auth";
import { motorcycleRepository } from "@/lib/server/motorcycle-repository";
import { revalidateMotorcycles } from "@/lib/server/motorcycle-service";

export async function DELETE(
  _request: Request,
  context: RouteContext<"/api/admin/motorcycles/[id]">
) {
  const auth = await requireAdminApiSession();
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
    return NextResponse.json({ ok: true, id });
  } catch {
    return NextResponse.json(
      { error: "Gagal menghapus data motor." },
      { status: 500 }
    );
  }
}
