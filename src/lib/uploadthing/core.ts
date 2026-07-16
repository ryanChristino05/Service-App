import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { z } from "zod";
import * as serviceRepo from "@/lib/repositories/service.repository";
import * as imageRepo from "@/lib/repositories/image.repository";

const f = createUploadthing();

export const ourFileRouter = {
  serviceImageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 3 } })
    .input(z.object({ serviceId: z.number().int().positive() }))
    .middleware(async ({ input, req }) => {
      // Auth temporaire — même pattern que le reste de l'app, à remplacer
      // quand le module Auth existe (lire la vraie session au lieu du header)
      const userIdHeader = req.headers.get("x-user-id");
      const userId = Number(userIdHeader);
      if (!Number.isInteger(userId) || userId <= 0) {
        throw new UploadThingError("Authentification requise");
      }

      const ownerId = await serviceRepo.findServiceOwnerId(input.serviceId);
      if (ownerId === null) {
        throw new UploadThingError("Service introuvable");
      }
      if (ownerId !== userId) {
        throw new UploadThingError("Vous n'êtes pas autorisé à ajouter une image à ce service");
      }

      return { serviceId: input.serviceId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      await imageRepo.createServiceImage({
        service_id: metadata.serviceId,
        url_image: file.url,
      });
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;