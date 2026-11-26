import { NextResponse } from "next/server";
import { requireAdminApiSession } from "@/lib/server/admin-auth";
import { catalogRepository } from "@/lib/server/catalog-repository";
import { categoryRepository } from "@/lib/server/category-repository";
import { revalidateCategories } from "@/lib/server/category-service";
import { validateCategoryInput } from "@/lib/validation/category";

export async function PUT(
  request: Request,
  context: RouteContext<"/api/admin/categories/[slug]">
) {
  const auth = await requireAdminApiSession();
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
        { error: "Category not found." },
        { status: 404 }
      );
    }

    revalidateCategories();
    return NextResponse.json({ category: updated });
  } catch {
    return NextResponse.json(
      { error: "Failed to update category." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  context: RouteContext<"/api/admin/categories/[slug]">
) {
  const auth = await requireAdminApiSession();
  if (auth.response) return auth.response;

  try {
    const { slug } = await context.params;
    const products = await catalogRepository.findAll();
    const assignedCount = products.filter((p) => p.category === slug).length;

    if (assignedCount > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete this category because ${assignedCount} ${assignedCount === 1 ? "product is" : "products are"} still assigned to it. Reassign or remove those products first.`,
        },
        { status: 409 }
      );
    }

    const deleted = await categoryRepository.delete(slug);
    if (!deleted) {
      return NextResponse.json(
        { error: "Category not found." },
        { status: 404 }
      );
    }

    revalidateCategories();
    return NextResponse.json({ ok: true, id: slug });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete category." },
      { status: 500 }
    );
  }
}
