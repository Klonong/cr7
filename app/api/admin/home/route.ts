import { NextResponse } from "next/server";
import { requireAdminApiSession } from "@/lib/server/admin-auth";
import { homeRepository } from "@/lib/server/home-repository";
import { revalidateHomeContent } from "@/lib/server/home-service";
import { validateHomeSettingsInput } from "@/lib/validation/home";

export async function GET() {
  const auth = await requireAdminApiSession();
  if (auth.response) return auth.response;

  const content = await homeRepository.getContent();
  return NextResponse.json({ content });
}

export async function PUT(request: Request) {
  const auth = await requireAdminApiSession();
  if (auth.response) return auth.response;

  try {
    const body = await request.json();
    const validated = validateHomeSettingsInput(body);
    if (!validated.ok) {
      return NextResponse.json({ error: validated.error }, { status: 400 });
    }

    const content = await homeRepository.updateSettings(validated.data);
    revalidateHomeContent();
    return NextResponse.json({ content });
  } catch {
    return NextResponse.json(
      { error: "Failed to save home settings." },
      { status: 500 }
    );
  }
}
