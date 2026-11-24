import { NextResponse } from "next/server";
import { getCatalogProducts } from "@/lib/server/catalog-service";

export async function GET() {
  const products = await getCatalogProducts();
  return NextResponse.json({ products });
}
