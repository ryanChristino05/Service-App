import Link from "next/link";
import { redirect } from "next/navigation";
import { Search } from "lucide-react";
import Button from "@/components/ui/Button";
import ServiceCard, { MockService } from "@/components/ui/ServiceCard";
import AnnonceModalTrigger from "@/components/ui/AnnonceModalTrigger";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export default async function Home() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const rawServices = await prisma.service.findMany({
    where: { statut: "VALIDE" },
    include: {
      categorie: true,
      localisation: { select: { ville: true, quartier: true } },
      prestataire: { select: { nom: true, prenom: true } },
      images: { orderBy: { ordre: "asc" }, take: 1 },
      feedbacks: { select: { note: true } },
    },
    orderBy: { date_creation: "desc" },
    take: 6,
  });

  const services: MockService[] = rawServices.map((s) => {
    const notes = s.feedbacks.map((f) => f.note).filter((n): n is number => typeof n === "number");
    const noteMoyenne = notes.length > 0 ? notes.reduce((a, b) => a + b, 0) / notes.length : null;

    return {
      id: s.id,
      titre: s.titre,
      categorie: s.categorie?.nom ?? "Autre",
      ville: s.localisation?.ville ?? "",
      quartier: s.localisation?.quartier ?? "",
      image: s.images[0]?.url_image ?? "/placeholder-service.jpg",
      prestataire: `${s.prestataire.prenom ?? ""} ${s.prestataire.nom}`.trim(),
      noteMoyenne,
    };
  });

  return (
    <div>
      {/* Hero */}
      <section className="bg-[var(--brand-900)] px-6 py-16 text-center text-white">
        <h1 className="mx-auto max-w-2xl font-[var(--font-display)] text-4xl font-semibold sm:text-5xl">
          Trouvez un service près de chez vous
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-white/70">
          Plombiers, professeurs, coiffeurs... des prestataires de confiance dans votre quartier.
        </p>

        <div className="mx-auto mt-8 flex max-w-lg items-center gap-3">
          <form className="flex flex-1 items-center overflow-hidden rounded-full bg-white pl-5 shadow-lg">
            <Search className="h-4 w-4 shrink-0 text-[var(--ink)]/40" />
            <input
              type="text"
              placeholder="Rechercher un service (ex: plombier)"
              className="flex-1 bg-transparent px-3 py-3 text-sm text-[var(--ink)] outline-none placeholder:text-[var(--ink)]/40"
            />
            <button
              type="submit"
              className="whitespace-nowrap bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--brand-900)] transition hover:brightness-95"
            >
              Rechercher
            </button>
          </form>

          <AnnonceModalTrigger userEmail={session.user.email ?? null} />
        </div>

        <p className="mt-3 text-xs text-white/50">
          Besoin de quelque chose ? Publiez une annonce en quelques secondes.
        </p>
      </section>

      {/* Services à proximité */}
      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="font-[var(--font-display)] text-2xl font-semibold text-[var(--ink)]">
            Services à proximité
          </h2>
          <Button href="/services" variant="secondary">
            Voir tout
          </Button>
        </div>

        {services.length === 0 ? (
          <p className="rounded-xl border border-dashed border-[var(--line)] p-8 text-center text-sm text-[var(--ink)]/50">
            Aucun service disponible pour l&apos;instant.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Link key={service.id} href={`/services/${service.id}`}>
                <ServiceCard service={service} />
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}