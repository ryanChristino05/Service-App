import Link from "next/link";
import { prisma } from "@/lib/prisma";

const statutStyles: Record<string, string> = {
  ACTIVE: "bg-[var(--accent-soft)] text-[var(--brand-900)]",
  EN_COURS: "bg-[var(--line)] text-[var(--ink)]",
  RESOLUE: "bg-green-100 text-green-700",
  EXPIREE: "bg-gray-100 text-gray-500",
};

const statutLabels: Record<string, string> = {
  ACTIVE: "Active",
  EN_COURS: "En cours",
  RESOLUE: "Résolue",
  EXPIREE: "Expirée",
};

export default async function AnnoncesPage() {
const annonces = await prisma.annonce.findMany({
  where: {
    statut: { notIn: ["RESOLUE","EXPIREE"] },
  },
  include: {
    demandeur: {
      select: { id: true, nom: true, prenom: true, email: true },
    },
    categorie: true,
    localisation: true,
  },
  orderBy: { date_creation: "desc" },
});

  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <span className="font-[var(--font-mono)] text-xs uppercase tracking-wider text-[var(--ink)]/50">
        {annonces.length} annonce{annonces.length > 1 ? "s" : ""}
      </span>
      <h1 className="mt-2 font-[var(--font-display)] text-3xl font-semibold text-[var(--ink)]">
        Annonces
      </h1>

      <div className="mt-8 space-y-4">
        {annonces.map((a) => (
          <Link
            key={a.id}
            href={`/annonces/${a.id}`}
            className="block rounded-xl border border-[var(--line)] bg-white p-5 transition hover:border-[var(--accent)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-medium text-[var(--ink)]">{a.titre}</h2>
                <p className="mt-1 text-sm text-[var(--ink)]/60">
                  {a.categorie.nom} · {a.localisation.ville}
                  {a.localisation.quartier ? ` (${a.localisation.quartier})` : ""}
                </p>
                <p className="mt-1 text-xs text-[var(--ink)]/40">
                  Par {a.demandeur.prenom} {a.demandeur.nom}
                </p>
              </div>

            
            </div>
          </Link>
        ))}

        {annonces.length === 0 && (
          <p className="rounded-xl border border-dashed border-[var(--line)] p-8 text-center text-sm text-[var(--ink)]/50">
            Aucune annonce pour le moment.
          </p>
        )}
      </div>
    </section>
  );
}