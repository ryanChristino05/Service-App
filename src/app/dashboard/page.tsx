// app/dashboard/page.tsx
import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import LogoutButton from "@/components/ui/LogoutButton";

const statutStyles: Record<string, string> = {
  VALIDE: "bg-green-100 text-green-700",
  EN_ATTENTE: "bg-[var(--accent-soft)] text-[var(--brand-900)]",
  REFUSE: "bg-red-100 text-red-700",
};

const statutLabels: Record<string, string> = {
  VALIDE: "Validé",
  EN_ATTENTE: "En attente",
  REFUSE: "Refusé",
};

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = Number(session.user.id);

  const prestataire = await prisma.user.findUnique({
    where: { id: userId },
    include: { localisation: true },
  });

  if (!prestataire) return null;

  const services = await prisma.service.findMany({
    where: { prestataire_id: userId },
    include: {
      categorie: true,
      localisation: true,
      images: { orderBy: { ordre: "asc" } },
      feedbacks: true,
    },
    orderBy: { date_creation: "desc" },
  });

  const valides = services.filter((s) => s.statut === "VALIDE").length;
  const enAttente = services.filter((s) => s.statut === "EN_ATTENTE").length;

  const allNotes = services.flatMap((s) =>
    s.feedbacks.map((f) => f.note).filter((n): n is number => typeof n === "number")
  );

  const moyenne =
    allNotes.length > 0
      ? (allNotes.reduce((sum, n) => sum + n, 0) / allNotes.length).toFixed(1)
      : null;

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      {/* En-tête profil */}
      <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-[var(--line)] bg-white p-6 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--brand-900)] text-lg font-semibold text-white">
            {prestataire.prenom?.[0]}
            {prestataire.nom?.[0]}
          </span>
          <div>
            <h1 className="font-[var(--font-display)] text-xl font-semibold text-[var(--ink)]">
              {prestataire.prenom} {prestataire.nom}
            </h1>
            <p className="text-sm text-[var(--ink)]/60">
              {prestataire.localisation?.ville}
              {prestataire.localisation?.quartier ? `, ${prestataire.localisation.quartier}` : ""}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/nouveau"
            className="flex items-center gap-2 rounded-full bg-[var(--brand-900)] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[var(--brand-700)]"
          >
            <Plus className="h-4 w-4" />
            Ajouter un service
          </Link>
          <LogoutButton />
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-[var(--line)] bg-white p-5">
          <p className="font-[var(--font-display)] text-2xl font-semibold text-[var(--ink)]">
            {services.length}
          </p>
          <p className="mt-1 font-[var(--font-mono)] text-xs uppercase tracking-wider text-[var(--ink)]/50">
            Services
          </p>
        </div>
        <div className="rounded-2xl border border-[var(--line)] bg-white p-5">
          <p className="font-[var(--font-display)] text-2xl font-semibold text-green-600">
            {valides}
          </p>
          <p className="mt-1 font-[var(--font-mono)] text-xs uppercase tracking-wider text-[var(--ink)]/50">
            Validés
          </p>
        </div>
        <div className="rounded-2xl border border-[var(--line)] bg-white p-5">
          <p className="font-[var(--font-display)] text-2xl font-semibold text-[var(--accent)]">
            {enAttente}
          </p>
          <p className="mt-1 font-[var(--font-mono)] text-xs uppercase tracking-wider text-[var(--ink)]/50">
            En attente
          </p>
        </div>
        <div className="rounded-2xl border border-[var(--line)] bg-white p-5">
          <p className="font-[var(--font-display)] text-2xl font-semibold text-[var(--ink)]">
            {moyenne ?? "—"}
          </p>
          <p className="mt-1 font-[var(--font-mono)] text-xs uppercase tracking-wider text-[var(--ink)]/50">
            Note moyenne
          </p>
        </div>
      </div>

      {/* Liste des services */}
      <h2 className="mt-10 font-[var(--font-display)] text-xl font-semibold text-[var(--ink)]">
        Mes services
      </h2>

      <div className="mt-4 space-y-4">
        {services.map((s) => {
          const cover = s.images[0];
          return (
            <div
              key={s.id}
              className="flex items-center gap-4 rounded-2xl border border-[var(--line)] bg-white p-4"
            >
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[var(--line)]">
                {cover && (
                  <Image src={cover.url_image} alt={s.titre} fill className="object-cover" />
                )}
              </div>

              <div className="flex-1">
                <span className="font-[var(--font-mono)] text-xs uppercase tracking-wider text-[var(--ink)]/40">
                  {s.categorie?.nom}
                </span>
                <h3 className="font-medium text-[var(--ink)]">{s.titre}</h3>
                <p className="mt-0.5 text-sm text-[var(--ink)]/60">
                  {s.localisation?.ville}
                  {s.localisation?.quartier ? `, ${s.localisation.quartier}` : ""}
                </p>
              </div>

              <span
                className={`shrink-0 rounded-full px-3 py-1 font-[var(--font-mono)] text-xs uppercase tracking-wider ${statutStyles[s.statut]}`}
              >
                {statutLabels[s.statut]}
              </span>

              {s.statut === "VALIDE" && (
                <Link
                  href={`/services/${s.id}`}
                  className="shrink-0 rounded-full border border-[var(--line)] px-4 py-1.5 text-sm text-[var(--ink)] transition hover:border-[var(--accent)]"
                >
                  Voir
                </Link>
              )}
            </div>
          );
        })}

        {services.length === 0 && (
          <p className="rounded-xl border border-dashed border-[var(--line)] p-8 text-center text-sm text-[var(--ink)]/50">
            Tu n&apos;as encore publié aucun service.
          </p>
        )}
      </div>
    </section>
  );
}