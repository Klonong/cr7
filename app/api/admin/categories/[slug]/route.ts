import { NextResponse } from "next/server";
import { requireAdminApiSession } from "@/lib/server/admin-auth";
import { logSecurityEvent } from "@/lib/server/audit-log";
import { categoryRepository } from "@/lib/server/category-repository";
import { revalidateCategories } from "@/lib/server/category-service";
import { getClientIp } from "@/lib/server/rate-limit";
import { validateCategoryInput } from "@/lib/validation/category";

export async function PUT(
  request: Request,
  context: RouteContext<"/api/admin/categories/[slug]">
) {
  const auth = await requireAdminApiSession({ request });
  if (auth.response) return auth.response;

  try {
    const { slug } = await context.params;
    const body = await request.json();
    const validated = validateCategoryInput({ ...body, slug });
    if (!validated.ok) {
      return NextResponse.json({ error: validated.error }, { status: 400 });
    }

    const updated = await categoryRepository.update(slug, validated.data);
    if (!updated) {
      return NextResponse.json(
        { error: "Kategori tidak ditemukan." },
        { status: 404 }
      );
    }

    revalidateCategories();

    logSecurityEvent({
      event: "ADMIN_CATEGORY_MUTATION",
      actor: auth.session.username,
      ip: getClientIp(request),
      target: slug,
      detail: "action=update",
    });

    return NextResponse.json({ category: updated });
  } catch {
    return NextResponse.json(
      { error: "Gagal memperbarui kategori." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: RouteContext<"/api/admin/categories/[slug]">
) {
  const auth = await requireAdminApiSession({ request });
  if (auth.response) return auth.response;

  try {
    const { slug } = await context.params;
    const assignedCount = await categoryRepository.countProducts(slug);

    if (assignedCount > 0) {
      return NextResponse.json(
        {
          error: `Kategori tidak dapat dihapus karena masih dipakai oleh ${assignedCount} produk. Pindahkan atau hapus produk terlebih dahulu.`,
        },
        { status: 409 }
      );
    }

    const deleted = await categoryRepository.delete(slug);
    if (!deleted) {
      return NextResponse.json(
        { error: "Kategori tidak ditemukan." },
        { status: 404 }
      );
    }

    revalidateCategories();

    logSecurityEvent({
      event: "ADMIN_CATEGORY_MUTATION",
      actor: auth.session.username,
      ip: getClientIp(request),
      target: slug,
      detail: "action=delete",
    });

    return NextResponse.json({ ok: true, id: slug });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Gagal menghapus kategori.";
    const status = message.includes("masih digunakan") ? 409 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
