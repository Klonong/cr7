import { NextResponse } from "next/server";
import { requireAdminApiSession } from "@/lib/server/admin-auth";

export async function GET() {
  const auth = await requireAdminApiSession();
  if (auth.response) return auth.response;

  return NextResponse.json({
    authenticated: true,
    session: auth.session,
  });
}
