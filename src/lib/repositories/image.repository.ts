import { prisma } from "@/lib/prisma";

export async function createServiceImage(data: { service_id: number; url_image: string }) {
  // ordre = position après la dernière image existante du service
  const lastImage = await prisma.serviceImage.findFirst({
    where: { service_id: data.service_id },
    orderBy: { ordre: "desc" },
  });
  const ordre = (lastImage?.ordre ?? 0) + 1;

  return prisma.serviceImage.create({
    data: { ...data, ordre },
  });
}
export async function findImageWithOwner(imageId: number) {
  return prisma.serviceImage.findUnique({
    where: { id: imageId },
    select: {
      id: true,
      service: { select: { prestataire_id: true } },
    },
  });
}

export async function deleteServiceImage(imageId: number) {
  return prisma.serviceImage.delete({ where: { id: imageId } });
}