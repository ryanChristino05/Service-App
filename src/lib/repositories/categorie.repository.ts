import { prisma } from "@/lib/prisma";

export async function findAllCategories() {
  return prisma.categorie.findMany({
    orderBy: { nom: "asc" },
    select: { id: true, nom: true },
  });
}