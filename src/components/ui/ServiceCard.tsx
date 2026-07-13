import Image from "next/image";
import Badge from "./Badge";

export type MockService = {
  id: number;
  titre: string;
  categorie: string;
  ville: string;
  quartier: string;
  image: string;
  prestataire: string;
  noteMoyenne: number | null;
};

export default function ServiceCard({ service }: { service: MockService }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-[var(--line)] bg-white transition-shadow hover:shadow-lg">
      <div className="relative h-40 w-full overflow-hidden bg-[var(--accent-soft)]">
        <Image
          src={service.image}
          alt={service.titre}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="space-y-2 p-4">
        <Badge>{service.categorie}</Badge>

        <h3 className="font-[var(--font-display)] text-lg font-semibold text-[var(--ink)]">
          {service.titre}
        </h3>

        <p className="text-sm text-[var(--ink)]/60">
          {service.prestataire} · {service.quartier}, {service.ville}
        </p>

        <div className="flex items-center gap-1 pt-1 text-sm">
          {service.noteMoyenne ? (
            <>
              <span className="text-[var(--accent)]">★</span>
              <span className="font-medium">{service.noteMoyenne.toFixed(1)}</span>
            </>
          ) : (
            <span className="text-[var(--ink)]/40">Pas encore d'avis</span>
          )}
        </div>
      </div>
    </article>
  );
}