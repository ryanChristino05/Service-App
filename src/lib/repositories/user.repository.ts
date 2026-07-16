import { prisma } from "@/lib/prisma";

export async function findUserLocalisation(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      localisation: {
        select: {
          latitude: true,
          longitude: true,
          ville: true,
          quartier: true,
          adresse: true,
        },
      },
    },
  });

  if (!user?.localisation) return null;

  return {
    latitude: user.localisation.latitude.toNumber(),   // Decimal → number
    longitude: user.localisation.longitude.toNumber(), // Decimal → number
    ville: user.localisation.ville,
    quartier: user.localisation.quartier ?? undefined,
    adresse: user.localisation.adresse ?? undefined,
  };
}