import Link from "next/link";
import { Mail } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import AnnonceOwnerActions from "@/components/profile/AnnonceOwnerActions";

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
  const session = await auth();
  const currentUserId = session?.user ? Number(session.user.id) : null;

  const annonces = await prisma.annonce.findMany({
    where: {
      statut: { notIn: ["RESOLUE", "EXPIREE"] },
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
       {annonces.map((a) => {
  const isOwner = currentUserId === a.demandeur.id;

  return (
    <div
      key={a.id}
      className="rounded-xl border border-[var(--line)] bg-white p-5 transition hover:border-[var(--accent)]"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <Link href={`/annonces/${a.id}`}>
            <h2 className="font-medium text-[var(--ink)]">{a.titre}</h2>
            <p className="mt-1 text-sm text-[var(--ink)]/60">
              {a.categorie.nom} · {a.localisation.ville}
              {a.localisation.quartier ? ` (${a.localisation.quartier})` : ""}
            </p>
          </Link>
          <p className="mt-1 text-xs text-[var(--ink)]/40">
            Par{" "}
            <Link
              href={`/profils/${a.demandeur.id}`}
              className="underline decoration-[var(--accent)] decoration-2 underline-offset-2 hover:text-[var(--accent)]"
            >
              {a.demandeur.prenom} {a.demandeur.nom}
            </Link>
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          
          {isOwner && (
            <AnnonceOwnerActions
              annonce={{
                id: a.id,
                titre: a.titre,
                description: a.description,
                statut: a.statut,
              }}
            />
          )}
        </div>
      </div>

        <a
        href={`mailto:${a.demandeur.email}`}
        className="mt-3 flex items-center gap-1.5 border-t border-[var(--line)] pt-3 text-xs text-[var(--ink)]/60 transition hover:text-[var(--accent)]"
      >
        <Mail className="h-3.5 w-3.5 text-[var(--ink)]/40" />
        {a.demandeur.email}
      </a>
    </div>
  );
})}

        {annonces.length === 0 && (
          <p className="rounded-xl border border-dashed border-[var(--line)] p-8 text-center text-sm text-[var(--ink)]/50">
            Aucune annonce pour le moment.
          </p>
        )}
      </div>
    </section>
  );
}