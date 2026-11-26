import { NextResponse } from "next/server";
import { requireAdminApiSession } from "@/lib/server/admin-auth";
import { homeRepository } from "@/lib/server/home-repository";
import { revalidateHomeContent } from "@/lib/server/home-service";
import { validateHighlightInput } from "@/lib/validation/home";

export async function PUT(
  request: Request,
  context: RouteContext<"/api/admin/home/highlights/[id]">
) {
  const auth = await requireAdminApiSession();
  if (auth.response) return auth.response;

  try {
    const { id } = await context.params;
    const body = await request.json();
    const validated = validateHighlightInput(body);
    if (!validated.ok) {
      return NextResponse.json({ error: validated.error }, { status: 400 });
    }

    const highlight = await homeRepository.updateHighlight(id, validated.data);
    if (!highlight) {
      return NextResponse.json(
        { error: "Highlight not found." },
        { status: 404 }
      );
    }

    revalidateHomeContent();
    return NextResponse.json({ highlight });
  } catch {
    return NextResponse.json(
      { error: "Failed to update highlight." },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  context: RouteContext<"/api/admin/home/highlights/[id]">
) {
  const auth = await requireAdminApiSession();
  if (auth.response) return auth.response;

  try {
    const { id } = await context.params;
    const body = (await request.json()) as { active?: unknown };
    if (typeof body.active !== "boolean") {
      return NextResponse.json(
        { error: "Boolean active field is required." },
        { status: 400 }
      );
    }

    const highlight = await homeRepository.toggleHighlight(id, body.active);
    if (!highlight) {
      return NextResponse.json(
        { error: "Highlight not found." },
        { status: 404 }
      );
    }

    revalidateHomeContent();
    return NextResponse.json({ highlight });
  } catch {
    return NextResponse.json(
      { error: "Failed to update highlight visibility." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  context: RouteContext<"/api/admin/home/highlights/[id]">
) {
  const auth = await requireAdminApiSession();
  if (auth.response) return auth.response;

  try {
    const { id } = await context.params;
    const deleted = await homeRepository.deleteHighlight(id);
    if (!deleted) {
      return NextResponse.json(
        { error: "Highlight not found." },
        { status: 404 }
      );
    }

    revalidateHomeContent();
    return NextResponse.json({ ok: true, id });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete highlight." },
      { status: 500 }
    );
  }
}
