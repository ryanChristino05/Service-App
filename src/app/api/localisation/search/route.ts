import { NextRequest, NextResponse } from "next/server";
import { searchAddress } from "@/lib/nominatim/client";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q");

  if (!query || query.trim().length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const results = await searchAddress(query);
    return NextResponse.json({ results });
  } catch (error) {
    console.error("Erreur recherche Nominatim:", error);
    return NextResponse.json(
      { error: "Impossible de contacter le service de géocodage" },
      { status: 502 }
    );
  }
}