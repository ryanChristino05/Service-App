import type { Prisma } from '@/generated/prisma/client';

export function buildServiceSearchWhere({
  query,
  categorieId,
}: {
  query?: string | null;
  categorieId?: number;
}) {
  const normalizedQuery = query?.trim() ?? '';
  const where: Prisma.ServiceWhereInput = {
    statut: 'VALIDE',
  };

  if (categorieId) {
    where.categorie_id = categorieId;
  }

  if (normalizedQuery) {
    where.OR = [
      { titre: { contains: normalizedQuery } },
      { description: { contains: normalizedQuery } },
      { categorie: { nom: { contains: normalizedQuery } } },
      { localisation: { ville: { contains: normalizedQuery } } },
      { localisation: { quartier: { contains: normalizedQuery } } },
    ];
  }

  return where;
}
