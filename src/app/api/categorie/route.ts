// app/api/categorie/route.ts
import { NextResponse } from "next/server";
import { returnCategorie } from "@/hooks/categorie";

export async function GET() {
  const categories = await returnCategorie();
  return NextResponse.json(categories);
}