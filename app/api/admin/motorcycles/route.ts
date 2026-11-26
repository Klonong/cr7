import { NextResponse } from "next/server";
import { requireAdminApiSession } from "@/lib/server/admin-auth";
import { motorcycleRepository } from "@/lib/server/motorcycle-repository";
import { revalidateMotorcycles } from "@/lib/server/motorcycle-service";
import { validateMotorcycleInput } from "@/lib/validation/motorcycle";

export async function GET() {
  const auth = await requireAdminApiSession();
  if (auth.response) return auth.response;

  const motorcycles = await motorcycleRepository.findAll();
  return NextResponse.json({ motorcycles });
}

export async function POST(request: Request) {
  const auth = await requireAdminApiSession();
  if (auth.response) return auth.response;

  try {
    const body = await request.json();
    const validated = validateMotorcycleInput(body);
    if (!validated.ok) {
      return NextResponse.json({ error: validated.error }, { status: 400 });
    }

    const motorcycle = await motorcycleRepository.create(validated.data);
    revalidateMotorcycles();
    return NextResponse.json({ motorcycle }, { status: 201 });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Gagal menambahkan motor.";
    const status = message.includes("sudah terdaftar") ? 409 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
