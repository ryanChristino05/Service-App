import { notFound } from "next/navigation";
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

export default async function AnnonceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const annonceId = Number(id);

  if (Number.isNaN(annonceId)) {
    notFound();
  }

  const annonce = await prisma.annonce.findUnique({
    where: { id: annonceId },
    include: {
      demandeur: true,
      categorie: true,
      localisation: true,
    },
  });

  if (!annonce) {
    notFound();
  }

  return (
    <section className="mx-auto max-w-2xl px-6 py-16">
      <div className="flex items-center justify-between">
        <span className="font-[var(--font-mono)] text-xs uppercase tracking-wider text-[var(--ink)]/50">
          {annonce.categorie.nom}
        </span>
        <span
          className={`rounded-full px-3 py-1 font-[var(--font-mono)] text-xs uppercase tracking-wider ${statutStyles[annonce.statut]}`}
        >
          {statutLabels[annonce.statut]}
        </span>
      </div>

      <h1 className="mt-2 font-[var(--font-display)] text-2xl font-semibold text-[var(--ink)]">
        {annonce.titre}
      </h1>

      <p className="mt-2 text-sm text-[var(--ink)]/60">
        {annonce.localisation.ville}
        {annonce.localisation.quartier ? `, ${annonce.localisation.quartier}` : ""}
        {" · "}Publiée par {annonce.demandeur.prenom} {annonce.demandeur.nom}
      </p>

      <p className="mt-6 whitespace-pre-line text-[var(--ink)]/80">
        {annonce.description}
      </p>

      {annonce.date_expiration && (
        <p className="mt-6 border-t border-[var(--line)] pt-4 text-xs text-[var(--ink)]/40">
          Expire le{" "}
          {annonce.date_expiration.toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      )}
    </section>
  );
}