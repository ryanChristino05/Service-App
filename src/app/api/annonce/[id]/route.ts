import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { id } = await params;
  const annonceId = Number(id);
  if (Number.isNaN(annonceId)) {
    return NextResponse.json({ error: "ID invalide" }, { status: 400 });
  }

  const annonce = await prisma.annonce.findUnique({ where: { id: annonceId } });
  if (!annonce) {
    return NextResponse.json({ error: "Annonce introuvable" }, { status: 404 });
  }
  if (annonce.demandeur_id !== Number(session.user.id)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const body = await req.json();
  const { titre, description, statut } = body as {
    titre?: string;
    description?: string;
    statut?: "ACTIVE" | "EN_COURS" | "RESOLUE" | "EXPIREE";
  };

  const validStatuts = ["ACTIVE", "EN_COURS", "RESOLUE", "EXPIREE"];
  if (statut && !validStatuts.includes(statut)) {
    return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
  }

  try {
    const updated = await prisma.annonce.update({
      where: { id: annonceId },
      data: {
        ...(titre !== undefined ? { titre: titre.trim() } : {}),
        ...(description !== undefined ? { description: description.trim() } : {}),
        ...(statut !== undefined ? { statut } : {}),
      },
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Échec de la mise à jour" }, { status: 500 });
  }
}