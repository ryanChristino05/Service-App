import { prisma } from "@/lib/prisma";

export type CreateLocalisationData = {
  latitude: number;
  longitude: number;
  ville: string;
  quartier?: string | null;
  adresse?: string | null;
};

export async function createLocalisation(data: CreateLocalisationData) {
  return prisma.localisation.create({ data });
}