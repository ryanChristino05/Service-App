import { prisma } from "@/lib/prisma";

export async function createFeedback(data: {
  service_id: number;
  auteur_id: number;
  note?: number;
  commentaire?: string;
}) {
  return prisma.feedback.create({ data });
}

export async function findExistingFeedback(serviceId: number, auteurId: number) {
  return prisma.feedback.findUnique({
    where: { service_id_auteur_id: { service_id: serviceId, auteur_id: auteurId } },
  });
}