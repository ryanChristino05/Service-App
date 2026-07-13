// app/api/annonces/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { titre, description, email, categorieId, categorieNom, localisationId } = body;

    if (!titre || !email) {
      return NextResponse.json({ error: "Titre et email requis" }, { status: 400 });
    }
    if (!categorieId && !categorieNom) {
      return NextResponse.json({ error: "Catégorie requise" }, { status: 400 });
    }

    // TODO: adapter à ton schéma User — ici on suppose que l'utilisateur existe déjà
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    }

    // TODO: localisation_id n'est pas dans ton formulaire actuel mais est obligatoire dans le schéma
    if (!localisationId) {
      return NextResponse.json({ error: "Localisation requise" }, { status: 400 });
    }

    let finalCategorieId: number;

    if (categorieId) {
      finalCategorieId = categorieId;
    } else {
      // findFirst + create (pas atomique, mais fonctionne sans contrainte unique sur `nom`)
      const existing = await prisma.categorie.findFirst({
        where: { nom:categorieNom.trim() },
      });
      finalCategorieId = existing
        ? existing.id
        : (await prisma.categorie.create({ data: { nom: categorieNom.trim() } })).id;
    }

    const annonce = await prisma.annonce.create({
      data: {
        titre,
        description,
        demandeur_id: user.id,
        categorie_id: finalCategorieId,
        localisation_id: localisationId,
      },
    });

    return NextResponse.json(annonce, { status: 201 });
  } catch (error) {
    console.error("Erreur création annonce :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}