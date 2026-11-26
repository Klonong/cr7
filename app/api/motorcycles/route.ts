import { NextResponse } from "next/server";
import { getCatalogMotorcycles } from "@/lib/server/motorcycle-service";

export async function GET() {
  const motorcycles = await getCatalogMotorcycles();
  return NextResponse.json({ motorcycles });
}
