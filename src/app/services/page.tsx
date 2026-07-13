import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

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

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ categorie?: string }>;
}) {
  const { categorie } = await searchParams;
  const categorieId = categorie ? Number(categorie) : undefined;

  const [categories, services, total] = await Promise.all([
    prisma.categorie.findMany({
      include: { _count: { select: { services: true } } },
      orderBy: { nom: "asc" },
    }),
    prisma.service.findMany({
      where: categorieId ? { categorie_id: categorieId } : undefined,
      include: {
        prestataire: true,
        categorie: true,
        localisation: true,
        images: { orderBy: { ordre: "asc" } },
      },
      orderBy: { date_creation: "desc" },
    }),
    prisma.service.count(),
  ]);

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <span className="font-[var(--font-mono)] text-xs uppercase tracking-wider text-[var(--ink)]/50">
        {services.length} service{services.length > 1 ? "s" : ""}
      </span>
      <h1 className="mt-2 font-[var(--font-display)] text-3xl font-semibold text-[var(--ink)]">
        Services
      </h1>

      {/* Filtres par catégorie */}
      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href="/services"
          className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
            !categorieId
              ? "border-[var(--brand-900)] bg-[var(--brand-900)] text-white"
              : "border-[var(--line)] text-[var(--ink)] hover:border-[var(--accent)]"
          }`}
        >
          Tous ({total})
        </Link>
        {categories.map((c) => {
          const active = categorieId === c.id;
          return (
            <Link
              key={c.id}
              href={`/services?categorie=${c.id}`}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                active
                  ? "border-[var(--brand-900)] bg-[var(--brand-900)] text-white"
                  : "border-[var(--line)] text-[var(--ink)] hover:border-[var(--accent)]"
              }`}
            >
              {c.nom} ({c._count.services})
            </Link>
          );
        })}
      </div>

      {/* Grille des services */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => {
          const cover = s.images[0];
          return (
            <Link
              key={s.id}
              href={`/services/${s.id}`}
              className="group overflow-hidden rounded-2xl border border-[var(--line)] bg-white transition hover:border-[var(--accent)]"
            >
              <div className="relative aspect-[4/3] w-full bg-[var(--line)]">
                {cover && (
                  <Image
                    src={cover.url_image}
                    alt={s.titre}
                    fill
                    className="object-cover transition group-hover:scale-105"
                  />
                )}
                <span
                  className={`absolute right-3 top-3 rounded-full px-3 py-1 font-[var(--font-mono)] text-xs uppercase tracking-wider ${statutStyles[s.statut]}`}
                >
                  {statutLabels[s.statut]}
                </span>
              </div>

              <div className="p-4">
                <span className="font-[var(--font-mono)] text-xs uppercase tracking-wider text-[var(--accent)]">
                  {s.categorie.nom}
                </span>
                <h2 className="mt-1 font-medium text-[var(--ink)]">{s.titre}</h2>
                <p className="mt-1 text-sm text-[var(--ink)]/60">
                  {s.localisation.ville}
                  {s.localisation.quartier ? `, ${s.localisation.quartier}` : ""}
                </p>
                <p className="mt-2 text-xs text-[var(--ink)]/40">
                  Par {s.prestataire.prenom} {s.prestataire.nom}
                </p>
              </div>
            </Link>
          );
        })}

        {services.length === 0 && (
          <p className="col-span-full rounded-xl border border-dashed border-[var(--line)] p-8 text-center text-sm text-[var(--ink)]/50">
            Aucun service dans cette catégorie.
          </p>
        )}
      </div>
    </section>
  );
}