import { NextResponse } from "next/server";
import { requireAdminApiSession } from "@/lib/server/admin-auth";
import { logSecurityEvent } from "@/lib/server/audit-log";
import { homeRepository } from "@/lib/server/home-repository";
import { revalidateHomeContent } from "@/lib/server/home-service";
import { getClientIp } from "@/lib/server/rate-limit";
import { validateHomeSettingsInput } from "@/lib/validation/home";

export async function GET() {
  const auth = await requireAdminApiSession();
  if (auth.response) return auth.response;

  const content = await homeRepository.getContent();
  return NextResponse.json({ content });
}

export async function PUT(request: Request) {
  const auth = await requireAdminApiSession({ request });
  if (auth.response) return auth.response;

  try {
    const body = await request.json();
    const validated = validateHomeSettingsInput(body);
    if (!validated.ok) {
      return NextResponse.json({ error: validated.error }, { status: 400 });
    }

    const content = await homeRepository.updateSettings(validated.data);
    revalidateHomeContent();

    logSecurityEvent({
      event: "ADMIN_HOME_MUTATION",
      actor: auth.session.username,
      ip: getClientIp(request),
      target: "home_settings",
      detail: "action=update_settings",
    });

    return NextResponse.json({ content });
  } catch {
    return NextResponse.json(
      { error: "Gagal menyimpan pengaturan beranda." },
      { status: 500 }
    );
  }
}
