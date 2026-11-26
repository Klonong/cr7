import { NextResponse } from "next/server";
import { requireAdminApiSession } from "@/lib/server/admin-auth";
import { logSecurityEvent } from "@/lib/server/audit-log";
import { catalogRepository } from "@/lib/server/catalog-repository";
import { revalidateCatalog } from "@/lib/server/catalog-service";
import { categoryRepository } from "@/lib/server/category-repository";
import { getClientIp } from "@/lib/server/rate-limit";
import { deleteR2ObjectByUrl, isR2Configured } from "@/lib/server/r2-storage";
import { validateProductInput } from "@/lib/validation/product";

async function cleanupUnusedR2Images(candidateUrls: string[]) {
  if (!isR2Configured() || candidateUrls.length === 0) return;
  const remainingProducts = await catalogRepository.findAll();
  const stillReferenced = new Set<string>();
  for (const prod of remainingProducts) {
    for (const img of prod.images) {
      stillReferenced.add(img.url);
    }
  }
  const orphans = [...new Set(candidateUrls)].filter(
    (url) => !stillReferenced.has(url)
  );
  if (orphans.length > 0) {
    await Promise.allSettled(orphans.map((url) => deleteR2ObjectByUrl(url)));
  }
}

export async function PUT(
  request: Request,
  context: RouteContext<"/api/admin/products/[id]">
) {
  const auth = await requireAdminApiSession({ request });
  if (auth.response) return auth.response;

  try {
    const { id } = await context.params;
    const previous = await catalogRepository.findById(id);
    if (!previous) {
      return NextResponse.json(
        { error: "Produk tidak ditemukan." },
        { status: 404 }
      );
    }

    const body = await request.json();
    const categories = await categoryRepository.findAll();
    const validated = validateProductInput(
      body,
      categories.map((c) => c.slug)
    );
    if (!validated.ok) {
      return NextResponse.json({ error: validated.error }, { status: 400 });
    }

    const updated = await catalogRepository.update(id, validated.data);
    if (!updated) {
      return NextResponse.json(
        { error: "Produk tidak ditemukan." },
        { status: 404 }
      );
    }

    revalidateCatalog(updated.slug);
    if (previous.slug !== updated.slug) {
      revalidateCatalog(previous.slug);
    }

    const updatedUrls = new Set(updated.images.map((i) => i.url));
    const removedUrls = previous.images
      .map((i) => i.url)
      .filter((url) => !updatedUrls.has(url));
    await cleanupUnusedR2Images(removedUrls);

    logSecurityEvent({
      event: "ADMIN_PRODUCT_MUTATION",
      actor: auth.session.username,
      ip: getClientIp(request),
      target: updated.id,
      detail: `action=update sku=${updated.sku}`,
    });

    return NextResponse.json({ product: updated });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Gagal memperbarui produk.";
    const status = message.includes("sudah digunakan") ? 409 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function PATCH(
  request: Request,
  context: RouteContext<"/api/admin/products/[id]">
) {
  const auth = await requireAdminApiSession({ request });
  if (auth.response) return auth.response;

  try {
    const { id } = await context.params;
    const body = (await request.json()) as { inStock?: unknown };
    if (typeof body.inStock !== "boolean") {
      return NextResponse.json(
        { error: "Field inStock harus berupa boolean." },
        { status: 400 }
      );
    }

    const updated = await catalogRepository.updateStock(id, body.inStock);
    if (!updated) {
      return NextResponse.json(
        { error: "Produk tidak ditemukan." },
        { status: 404 }
      );
    }

    revalidateCatalog(updated.slug);

    logSecurityEvent({
      event: "ADMIN_PRODUCT_MUTATION",
      actor: auth.session.username,
      ip: getClientIp(request),
      target: updated.id,
      detail: `action=stock inStock=${updated.inStock}`,
    });

    return NextResponse.json({ product: updated });
  } catch {
    return NextResponse.json(
      { error: "Gagal memperbarui status stok." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: RouteContext<"/api/admin/products/[id]">
) {
  const auth = await requireAdminApiSession({ request });
  if (auth.response) return auth.response;

  try {
    const { id } = await context.params;
    const existing = await catalogRepository.findById(id);
    if (!existing) {
      return NextResponse.json(
        { error: "Produk tidak ditemukan." },
        { status: 404 }
      );
    }

    const deleted = await catalogRepository.delete(id);
    if (!deleted) {
      return NextResponse.json(
        { error: "Produk tidak ditemukan." },
        { status: 404 }
      );
    }

    revalidateCatalog(existing.slug);
    await cleanupUnusedR2Images(existing.images.map((i) => i.url));

    logSecurityEvent({
      event: "ADMIN_PRODUCT_MUTATION",
      actor: auth.session.username,
      ip: getClientIp(request),
      target: id,
      detail: `action=delete sku=${existing.sku}`,
    });

    return NextResponse.json({ ok: true, id });
  } catch {
    return NextResponse.json(
      { error: "Gagal menghapus produk." },
      { status: 500 }
    );
  }
}
