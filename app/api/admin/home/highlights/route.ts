import { NextResponse } from "next/server";
import { requireAdminApiSession } from "@/lib/server/admin-auth";
import { logSecurityEvent } from "@/lib/server/audit-log";
import { homeRepository } from "@/lib/server/home-repository";
import { revalidateHomeContent } from "@/lib/server/home-service";
import { getClientIp } from "@/lib/server/rate-limit";
import { validateHighlightInput } from "@/lib/validation/home";

export async function POST(request: Request) {
  const auth = await requireAdminApiSession({ request });
  if (auth.response) return auth.response;

  try {
    const body = await request.json();
    const validated = validateHighlightInput(body);
    if (!validated.ok) {
      return NextResponse.json({ error: validated.error }, { status: 400 });
    }

    const highlight = await homeRepository.createHighlight(validated.data);
    revalidateHomeContent();

    logSecurityEvent({
      event: "ADMIN_HOME_MUTATION",
      actor: auth.session.username,
      ip: getClientIp(request),
      target: highlight.id,
      detail: "action=create_highlight",
    });

    return NextResponse.json({ highlight }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Gagal membuat sorotan baru." },
      { status: 500 }
    );
  }
}
