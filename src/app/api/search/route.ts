import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request:any) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";

  if (!q.trim()) {
    return NextResponse.json([]);
  }

  const services = await prisma.service.findMany({
    where: {
      statut: "VALIDE", // n'affiche que les services validés — enlève cette ligne si tu veux tout afficher
      OR: [
        { titre: { contains: q } },
        { description: { contains: q } },
        { categorie: { nom: { contains: q } } },
        { localisation: { ville: { contains: q } } },
        { localisation: { quartier: { contains: q } } },
      ],
    },
    include: {
      categorie: true,
      localisation: true,
      images: true,
      prestataire: {
        select: { id: true, nom: true, prenom: true, email: true, photo_profil: true },
      },
    },
    orderBy: { date_creation: "desc" },
    take: 20,
  });

  return NextResponse.json(services);
}