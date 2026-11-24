import { NextResponse } from "next/server";
import { requireAdminApiSession } from "@/lib/server/admin-auth";
import { catalogRepository } from "@/lib/server/catalog-repository";
import { revalidateCatalog } from "@/lib/server/catalog-service";
import { validateProductInput } from "@/lib/validation/product";

export async function PUT(
  request: Request,
  context: RouteContext<"/api/admin/products/[id]">
) {
  const auth = await requireAdminApiSession();
  if (auth.response) return auth.response;

  try {
    const { id } = await context.params;
    const body = await request.json();
    const validated = validateProductInput(body);
    if (!validated.ok) {
      return NextResponse.json({ error: validated.error }, { status: 400 });
    }

    const updated = await catalogRepository.update(id, validated.data);
    if (!updated) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    revalidateCatalog(updated.slug);
    return NextResponse.json({ product: updated });
  } catch {
    return NextResponse.json(
      { error: "Failed to update product." },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  context: RouteContext<"/api/admin/products/[id]">
) {
  const auth = await requireAdminApiSession();
  if (auth.response) return auth.response;

  try {
    const { id } = await context.params;
    const body = (await request.json()) as { inStock?: unknown };
    if (typeof body.inStock !== "boolean") {
      return NextResponse.json(
        { error: "Boolean inStock field is required." },
        { status: 400 }
      );
    }

    const updated = await catalogRepository.updateStock(id, body.inStock);
    if (!updated) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    revalidateCatalog(updated.slug);
    return NextResponse.json({ product: updated });
  } catch {
    return NextResponse.json(
      { error: "Failed to update stock status." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  context: RouteContext<"/api/admin/products/[id]">
) {
  const auth = await requireAdminApiSession();
  if (auth.response) return auth.response;

  try {
    const { id } = await context.params;
    const deleted = await catalogRepository.delete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    revalidateCatalog();
    return NextResponse.json({ ok: true, id });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete product." },
      { status: 500 }
    );
  }
}
