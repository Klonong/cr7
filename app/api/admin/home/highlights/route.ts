import { NextResponse } from "next/server";
import { requireAdminApiSession } from "@/lib/server/admin-auth";
import { homeRepository } from "@/lib/server/home-repository";
import { revalidateHomeContent } from "@/lib/server/home-service";
import { validateHighlightInput } from "@/lib/validation/home";

export async function POST(request: Request) {
  const auth = await requireAdminApiSession();
  if (auth.response) return auth.response;

  try {
    const body = await request.json();
    const validated = validateHighlightInput(body);
    if (!validated.ok) {
      return NextResponse.json({ error: validated.error }, { status: 400 });
    }

    const highlight = await homeRepository.createHighlight(validated.data);
    revalidateHomeContent();
    return NextResponse.json({ highlight }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create highlight." },
      { status: 500 }
    );
  }
}
