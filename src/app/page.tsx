import { redirect } from "next/navigation";
import AnnonceModalTrigger from "@/components/ui/AnnonceModalTrigger";
import HomeSearch from "@/components/ui/HomeSearch";
import { MockService } from "@/components/ui/ServiceCard";
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

  const defaultServices: MockService[] = rawServices.map((s) => {
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

        <div className="mx-auto flex max-w-lg items-center gap-3">
          {/* La barre de recherche fait partie de HomeSearch, mais on garde le bouton publier ici, à côté */}
        </div>

        <p className="mt-3 text-xs text-white/50">
          Besoin de quelque chose ? Publiez une annonce en quelques secondes.
        </p>
      </section>

      <HomeSearch defaultServices={defaultServices} />
    </div>
  );
}