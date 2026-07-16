import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import {ServiceStatus } from "@/generated/prisma/enums";

// ============================================================
// Types internes au repository — ce que la couche service lui passe
// ============================================================

export type CreateServiceData = {
  titre: string;
  description?: string;
  prestataire_id: number;
  categorie_id: number;
  localisation_id: number; // déjà résolue par le service layer (copie ou nouvelle ligne)
  statut: ServiceStatus; // toujours EN_ATTENTE en pratique, mais le repo reste agnostique
};

export type UpdateServiceData = Partial<{
  titre: string;
  description: string;
  categorie_id: number;
  localisation_id: number;
}>;

export type ServiceFilters = {
  categorie_id?: number;
  ville?: string;
  statut?: ServiceStatus; // le repo ne décide jamais qui a le droit de filtrer par statut, c'est au service layer
  prestataire_id?: number;
};

export type PaginationParams = {
  page: number;
  pageSize: number;
};

// ============================================================
// Requêtes
// ============================================================

/**
 * Crée un service. Ne fait aucune vérification métier (statut forcé,
 * ownership, etc.) — c'est la responsabilité de service.service.ts.
 */
export async function createService(data: CreateServiceData) {
  return prisma.service.create({
    data,
    include: {
      localisation: true,
      categorie: true,
      images: true,
    },
  });
}

/**
 * Liste paginée des services selon des filtres. Ne décide pas quels
 * statuts sont visibles pour qui — le service layer construit `filters`
 * en fonction de l'utilisateur courant avant d'appeler cette fonction.
 */
export async function findManyServices(
  filters: ServiceFilters,
  pagination: PaginationParams
) {
  const where: Prisma.ServiceWhereInput = {
    ...(filters.categorie_id && { categorie_id: filters.categorie_id }),
    ...(filters.statut && { statut: filters.statut }),
    ...(filters.prestataire_id && { prestataire_id: filters.prestataire_id }),
    ...(filters.ville && {
      localisation: { ville: { equals: filters.ville } },
    }),
  };

  const skip = (pagination.page - 1) * pagination.pageSize;

  const [services, total] = await Promise.all([
    prisma.service.findMany({
      where,
      skip,
      take: pagination.pageSize,
      orderBy: { date_creation: "desc" },
  include: {
  localisation: true,
  categorie: true,
  images: { orderBy: { ordre: "asc" } },
  prestataire: {
    select: { id: true, nom: true, prenom: true, photo_profil: true },
  },
  feedbacks: {
    select: {
      note: true,
      commentaire: true,
      auteur: {
        select: { nom: true, prenom: true },
      },
    },
  },
},
    }),
    prisma.service.count({ where }),
  ]);

  return {
    services,
    total,
    page: pagination.page,
    pageSize: pagination.pageSize,
    totalPages: Math.ceil(total / pagination.pageSize),
  };
}

/**
 * Détail d'un service par ID. Renvoie null si absent — c'est au service
 * layer / route handler de transformer ça en 404.
 */
export async function findServiceById(id: number) {
  return prisma.service.findUnique({
    where: { id },
    include: {
      localisation: true,
      categorie: true,
      images: { orderBy: { ordre: "asc" } },
      prestataire: {
        select: { id: true, nom: true, prenom: true, photo_profil: true, telephone: true },
      },
      feedbacks: {
        include: {
          auteur: { select: { id: true, nom: true, prenom: true } },
        },
        orderBy: { date_creation: "desc" },
      },
    },
  });
}

/**
 * Nécessaire pour les vérifications d'ownership dans le service layer
 * (éviter de charger toutes les relations juste pour vérifier un propriétaire).
 */
export async function findServiceOwnerId(id: number): Promise<number | null> {
  const service = await prisma.service.findUnique({
    where: { id },
    select: { prestataire_id: true },
  });
  return service?.prestataire_id ?? null;
}

export async function updateService(id: number, data: UpdateServiceData) {
  return prisma.service.update({
    where: { id },
    data,
    include: {
      localisation: true,
      categorie: true,
      images: true,
    },
  });
}

export async function updateServiceStatus(id: number, statut: ServiceStatus) {
  return prisma.service.update({
    where: { id },
    data: { statut },
  });
}

export async function deleteService(id: number) {
  // onDelete: Cascade sur ServiceImage et Feedback gère la suppression
  // des lignes liées en base — mais PAS les fichiers physiques d'images
  // sur le service de stockage cloud, à gérer en amont dans le service layer.
  return prisma.service.delete({ where: { id } });
}