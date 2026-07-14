import { prisma } from "@/lib/prisma";

export interface CategorieResult {
  id: number;
  description: string | null;
  nom: string ;
}

export async function returnCategorie(): Promise<CategorieResult[]> {
  try {
    const categories = await prisma.categorie.findMany({
      select: {
        id: true,
        nom: true,
        description: true,
      },
      orderBy: {
        nom: "asc",
      },
    });

    return categories;
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories :", error);
    return [];
  }
}