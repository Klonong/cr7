import { NextResponse } from "next/server";
import { requireAdminApiSession } from "@/lib/server/admin-auth";
import { logSecurityEvent } from "@/lib/server/audit-log";
import { catalogRepository } from "@/lib/server/catalog-repository";
import { revalidateCatalog } from "@/lib/server/catalog-service";
import { categoryRepository } from "@/lib/server/category-repository";
import { getClientIp } from "@/lib/server/rate-limit";
import { validateProductInput } from "@/lib/validation/product";

export async function GET() {
  const auth = await requireAdminApiSession();
  if (auth.response) return auth.response;

  const products = await catalogRepository.findAll();
  return NextResponse.json({ products });
}

export async function POST(request: Request) {
  const auth = await requireAdminApiSession({ request });
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

    logSecurityEvent({
      event: "ADMIN_PRODUCT_MUTATION",
      actor: auth.session.username,
      ip: getClientIp(request),
      target: created.id,
      detail: `action=create sku=${created.sku}`,
    });

    return NextResponse.json({ product: created }, { status: 201 });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Gagal menambahkan produk.";
    const status = message.includes("sudah terdaftar") ? 409 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
