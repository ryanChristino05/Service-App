import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const store = await cookies();
  const mode = store.get("view-mode")?.value ?? "standard";
  return NextResponse.json({ mode });
}

export async function POST(req: NextRequest) {
  const { mode } = await req.json();
  if (mode !== "standard" && mode !== "prestataire") {
    return NextResponse.json({ error: "mode invalide" }, { status: 400 });
  }
  const store = await cookies();
  store.set("view-mode", mode, {
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 jours
    sameSite: "lax",
  });
  return NextResponse.json({ mode });
}