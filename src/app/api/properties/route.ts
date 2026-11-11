import { NextResponse, type NextRequest } from "next/server";
import { parsePropertyFilters } from "@/lib/property-filters";
import { listProperties } from "@/repositories/properties";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const transaction = request.nextUrl.searchParams.get("transaction");
  if (transaction !== "sale" && transaction !== "rent") {
    return NextResponse.json({ error: "Choose sale or rent property results." }, { status: 400 });
  }
  try {
    const filters = parsePropertyFilters(request.nextUrl.searchParams);
    return NextResponse.json(await listProperties(transaction, filters));
  } catch {
    return NextResponse.json({ error: "Property search is temporarily unavailable. Please try again." }, { status: 503 });
  }
}
