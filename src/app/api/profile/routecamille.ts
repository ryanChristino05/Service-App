import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// TODO: remplacer par la vraie récupération de session (NextAuth, JWT, etc.)
function getCurrentUserId(): number {
  return 1; // valeur temporaire pour le dev
}

export async function GET() {
  try {
    const userId = getCurrentUserId();

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { localisation: true },
    });

    if (!user) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    }

    // On ne renvoie jamais le mot de passe au client
    const { mot_de_passe, ...safeUser } = user;

    return NextResponse.json(safeUser);
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la récupération" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const userId = getCurrentUserId();
    const body = await request.json();
    const { nom, prenom, telephone, bio } = body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        nom,
        prenom,
        telephone,
        bio,
      },
    });

    const { mot_de_passe, ...safeUser } = updatedUser;
    return NextResponse.json(safeUser);
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 });
  }
}