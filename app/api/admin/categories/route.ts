import { NextResponse } from "next/server";
import { requireAdminApiSession } from "@/lib/server/admin-auth";
import { logSecurityEvent } from "@/lib/server/audit-log";
import { categoryRepository } from "@/lib/server/category-repository";
import { revalidateCategories } from "@/lib/server/category-service";
import { getClientIp } from "@/lib/server/rate-limit";
import { validateCategoryInput } from "@/lib/validation/category";

export async function GET() {
  const auth = await requireAdminApiSession();
  if (auth.response) return auth.response;

  const categories = await categoryRepository.findAll();
  return NextResponse.json({ categories });
}

export async function POST(request: Request) {
  const auth = await requireAdminApiSession({ request });
  if (auth.response) return auth.response;

  try {
    const body = await request.json();
    const validated = validateCategoryInput(body);
    if (!validated.ok) {
      return NextResponse.json({ error: validated.error }, { status: 400 });
    }

    const created = await categoryRepository.create(validated.data);
    revalidateCategories();

    logSecurityEvent({
      event: "ADMIN_CATEGORY_MUTATION",
      actor: auth.session.username,
      ip: getClientIp(request),
      target: created.slug,
      detail: "action=create",
    });

    return NextResponse.json({ category: created }, { status: 201 });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Gagal membuat kategori baru.";
    const status = message.includes("sudah terdaftar") ? 409 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
