import * as serviceRepo from "@/lib/repositories/service.repository";
import * as userRepo from "@/lib/repositories/user.repository";
import * as localisationRepo from "@/lib/repositories/localisation.repository";
import * as imageRepo from "@/lib/repositories/image.repository";
import { ServiceStatus } from "@/generated/prisma/enums";
import { assertIsAdmin } from "@/lib/temp-auth/get-current-user";
import * as feedbackRepo from "@/lib/repositories/feedback.repository";

import type {
  CreateServiceInput,
  UpdateServiceInput,
  ServiceQueryInput,
} from "@/lib/validations/service.schema";

// ============================================================
// Erreurs métier explicites — le route handler les traduit en codes HTTP
// ============================================================

export class ServiceNotFoundError extends Error {
  constructor() {
    super("Service introuvable");
    this.name = "ServiceNotFoundError";
  }
}
export class DuplicateFeedbackError extends Error {
  constructor() {
    super("Vous avez déjà laissé un avis sur ce service");
    this.name = "DuplicateFeedbackError";
  }
}
export class ForbiddenServiceActionError extends Error {
  constructor() {
    super("Vous n'êtes pas autorisé à modifier ce service");
    this.name = "ForbiddenServiceActionError";
  }
}

export class LocalisationRequiredError extends Error {
  constructor() {
    super("Aucune localisation fournie et aucune localisation par défaut disponible pour cet utilisateur");
    this.name = "LocalisationRequiredError";
  }
}

// ============================================================
// Création
// ============================================================

/**
 * Crée un service pour un prestataire donné.
 * - Le statut est TOUJOURS forcé à EN_ATTENTE, jamais accepté depuis l'input.
 * - Si aucune localisation n'est fournie, on copie celle du prestataire
 *   (Option B : nouvelle ligne Localisation, jamais de FK partagée).
 */
export async function createService(prestataireId: number, input: CreateServiceInput) {
  let localisationData = input.localisation;

  if (!localisationData) {
    const defaultLocalisation = await userRepo.findUserLocalisation(prestataireId);
    if (!defaultLocalisation) {
      throw new LocalisationRequiredError();
    }
    localisationData = defaultLocalisation;
  }

  const localisation = await localisationRepo.createLocalisation(localisationData);

  return serviceRepo.createService({
    titre: input.titre,
    description: input.description,
    prestataire_id: prestataireId,
    categorie_id: input.categorie_id,
    localisation_id: localisation.id,
    statut: ServiceStatus.EN_ATTENTE, // forcé, non négociable, jamais depuis input
  });
}

// ============================================================
// Lecture
// ============================================================

/**
 * Liste publique des services — un visiteur ne voit QUE les services VALIDE.
 * currentUserId est optionnel : s'il est fourni, on peut envisager plus tard
 * d'inclure aussi les propres services EN_ATTENTE/REFUSE de l'utilisateur
 * (à activer explicitement si le besoin produit se confirme — pas fait
 * par défaut pour rester conservateur sur la visibilité).
 */
export async function listPublicServices(query: ServiceQueryInput) {
  return serviceRepo.findManyServices(
    {
      categorie_id: query.categorie_id,
      ville: query.ville,
      statut: ServiceStatus.VALIDE, // jamais négociable depuis l'extérieur
    },
    { page: query.page, pageSize: query.pageSize }
  );
}

/**
 * Services d'un prestataire donné, tous statuts confondus (pour son propre
 * tableau de bord). L'appelant (route handler) doit garantir que
 * `prestataireId` correspond bien à l'utilisateur authentifié.
 */
export async function listOwnServices(prestataireId: number, query: ServiceQueryInput) {
  return serviceRepo.findManyServices(
    { categorie_id: query.categorie_id, ville: query.ville, prestataire_id: prestataireId },
    { page: query.page, pageSize: query.pageSize }
  );
}

export async function getServiceDetail(id: number) {
  const service = await serviceRepo.findServiceById(id);
  if (!service) throw new ServiceNotFoundError();
  return service;
}

// ============================================================
// Modification / suppression — avec vérification d'ownership
// ============================================================

async function assertOwnership(serviceId: number, userId: number) {
  const ownerId = await serviceRepo.findServiceOwnerId(serviceId);
  if (ownerId === null) throw new ServiceNotFoundError();
  if (ownerId !== userId) throw new ForbiddenServiceActionError();
}

export async function updateService(
  serviceId: number,
  userId: number,
  input: UpdateServiceInput
) {
  await assertOwnership(serviceId, userId);

  let localisation_id: number | undefined;
  if (input.localisation) {
    const nouvelleLocalisation = await localisationRepo.createLocalisation(input.localisation);
    localisation_id = nouvelleLocalisation.id;
  }

  return serviceRepo.updateService(serviceId, {
    titre: input.titre,
    description: input.description,
    categorie_id: input.categorie_id,
    ...(localisation_id && { localisation_id }),
  });
}

export async function deleteService(serviceId: number, userId: number) {
  await assertOwnership(serviceId, userId);
  // NOTE: la suppression des fichiers physiques (Cloudinary/UploadThing)
  // doit être faite ICI, avant l'appel repo, une fois le fournisseur
  // d'upload choisi. Sinon fichiers orphelins non supprimés.
  return serviceRepo.deleteService(serviceId);
}

export async function deleteServiceImage(imageId: number, userId: number) {
  const image = await imageRepo.findImageWithOwner(imageId);
  if (!image) throw new ServiceNotFoundError();
  if (image.service.prestataire_id !== userId) throw new ForbiddenServiceActionError();

  return imageRepo.deleteServiceImage(imageId);
}
export async function moderateService(
  serviceId: number,
  adminUserId: number,
  statut: "VALIDE" | "REFUSE"
) {
  assertIsAdmin(adminUserId);

  const service = await serviceRepo.findServiceOwnerId(serviceId);
  if (service === null) throw new ServiceNotFoundError();

  return serviceRepo.updateServiceStatus(serviceId, statut);
}

export async function listPendingServices(adminUserId: number, query: ServiceQueryInput) {
  assertIsAdmin(adminUserId);

  return serviceRepo.findManyServices(
    { statut: "EN_ATTENTE" },
    { page: query.page, pageSize: query.pageSize }
  );
}

export async function submitFeedback(
  serviceId: number,
  auteurId: number,
  data: { note?: number; commentaire?: string }
) {
  const service = await serviceRepo.findServiceOwnerId(serviceId);
  if (service === null) throw new ServiceNotFoundError();

  const existing = await feedbackRepo.findExistingFeedback(serviceId, auteurId);
  if (existing) throw new DuplicateFeedbackError();

  return feedbackRepo.createFeedback({
    service_id: serviceId,
    auteur_id: auteurId,
    note: data.note,
    commentaire: data.commentaire,
  });
}