// components/ui/ServiceCard.tsx
import Image from "next/image";
import Badge from "./Badge";
import type { Prisma } from "@prisma/client";

export type ServiceWithRelations = Prisma.ServiceGetPayload<{
  include: {
    categorie: true;
    localisation: true;
    images: true;
    feedbacks: true;
    prestataire: true;
  };
}>;

export default function ServiceCard({ service }: { service: ServiceWithRelations }) {
  const cover = service.images[0];

  const notes = service.feedbacks
    .map((f) => f.note)
    .filter((n): n is number => typeof n === "number");
  const noteMoyenne =
    notes.length > 0 ? notes.reduce((sum, n) => sum + n, 0) / notes.length : null;

  return (
    <article className="group overflow-hidden rounded-2xl border border-[var(--line)] bg-white transition-shadow hover:shadow-lg">
      <div className="relative h-40 w-full overflow-hidden bg-[var(--accent-soft)]">
        {cover && (
          <Image
            src={cover.url_image}
            alt={service.titre}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
      </div>

      <div className="space-y-2 p-4">
        {service.categorie && <Badge>{service.categorie.nom}</Badge>}

        <h3 className="font-[var(--font-display)] text-lg font-semibold text-[var(--ink)]">
          {service.titre}
        </h3>

        <p className="text-sm text-[var(--ink)]/60">
          {service.prestataire.prenom} {service.prestataire.nom} ·{" "}
          {service.localisation?.quartier ? `${service.localisation.quartier}, ` : ""}
          {service.localisation?.ville}
        </p>

        <div className="flex items-center gap-1 pt-1 text-sm">
          {noteMoyenne ? (
            <>
              <span className="text-[var(--accent)]">★</span>
              <span className="font-medium">{noteMoyenne.toFixed(1)}</span>
            </>
          ) : (
            <span className="text-[var(--ink)]/40">Pas encore d&apos;avis</span>
          )}
        </div>
      </div>
    </article>
  );
}