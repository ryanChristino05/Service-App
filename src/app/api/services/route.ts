// app/api/services/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }
  const prestataireId = Number(session.user.id);

  try {
    const body = await req.json();
    const { titre, description, categorieId, categorieNom, localisation } = body;

    if (!titre) {
      return NextResponse.json({ error: "Titre requis" }, { status: 400 });
    }
    if (!categorieId && !categorieNom) {
      return NextResponse.json({ error: "Catégorie requise" }, { status: 400 });
    }
    if (
      !localisation?.ville ||
      localisation.latitude == null ||
      localisation.longitude == null
    ) {
      return NextResponse.json({ error: "Localisation requise" }, { status: 400 });
    }

    let finalCategorieId: number;

    if (categorieId) {
      finalCategorieId = categorieId;
    } else {
      const existing = await prisma.categorie.findFirst({
        where: { nom: categorieNom.trim() },
      });
      finalCategorieId = existing
        ? existing.id
        : (await prisma.categorie.create({ data: { nom: categorieNom.trim() } })).id;
    }

    const service = await prisma.$transaction(async (tx) => {
      const createdLocation = await tx.localisation.create({
        data: {
          latitude: localisation.latitude,
          longitude: localisation.longitude,
          ville: localisation.ville,
          quartier: localisation.quartier,
          adresse: localisation.adresse,
        },
      });

      return tx.service.create({
        data: {
          titre,
          description,
          prestataire_id: prestataireId,
          categorie_id: finalCategorieId,
          localisation_id: createdLocation.id,
        },
      });
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error("Erreur création service :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}