import { NextResponse } from "next/server";
import { requireAdminApiSession } from "@/lib/server/admin-auth";
import { categoryRepository } from "@/lib/server/category-repository";
import { revalidateCategories } from "@/lib/server/category-service";
import { validateCategoryInput } from "@/lib/validation/category";

export async function GET() {
  const auth = await requireAdminApiSession();
  if (auth.response) return auth.response;

  const categories = await categoryRepository.findAll();
  return NextResponse.json({ categories });
}

export async function POST(request: Request) {
  const auth = await requireAdminApiSession();
  if (auth.response) return auth.response;

  try {
    const body = await request.json();
    const validated = validateCategoryInput(body);
    if (!validated.ok) {
      return NextResponse.json({ error: validated.error }, { status: 400 });
    }

    const created = await categoryRepository.create(validated.data);
    revalidateCategories();
    return NextResponse.json({ category: created }, { status: 201 });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to create category.";
    const status = message.includes("already exists") ? 409 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
