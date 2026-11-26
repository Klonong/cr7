import { NextResponse } from "next/server";
import { requireAdminApiSession } from "@/lib/server/admin-auth";
import { catalogRepository } from "@/lib/server/catalog-repository";
import { revalidateCatalog } from "@/lib/server/catalog-service";
import { categoryRepository } from "@/lib/server/category-repository";
import { validateProductInput } from "@/lib/validation/product";

export async function GET() {
  const auth = await requireAdminApiSession();
  if (auth.response) return auth.response;

  const products = await catalogRepository.findAll();
  return NextResponse.json({ products });
}

export async function POST(request: Request) {
  const auth = await requireAdminApiSession();
  if (auth.response) return auth.response;

  try {
    const body = await request.json();
    const categories = await categoryRepository.findAll();
    const validated = validateProductInput(
      body,
      categories.map((c) => c.slug)
    );
    if (!validated.ok) {
      return NextResponse.json({ error: validated.error }, { status: 400 });
    }

    const created = await catalogRepository.create(validated.data);
    revalidateCatalog(created.slug);

    return NextResponse.json({ product: created }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create product." },
      { status: 500 }
    );
  }
}
