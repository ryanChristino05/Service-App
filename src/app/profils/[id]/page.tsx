import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Megaphone, Briefcase } from "lucide-react";
import { prisma } from "@/lib/prisma";

const annonceStatutStyles: Record<string, string> = {
  ACTIVE: "bg-[var(--accent-soft)] text-[var(--brand-900)]",
  EN_COURS: "bg-[var(--line)] text-[var(--ink)]",
  RESOLUE: "bg-green-100 text-green-700",
  EXPIREE: "bg-gray-100 text-gray-500",
};

const serviceStatutStyles: Record<string, string> = {
  VALIDE: "bg-green-100 text-green-700",
  EN_ATTENTE: "bg-[var(--accent-soft)] text-[var(--brand-900)]",
  REFUSE: "bg-red-100 text-red-700",
};

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const userId = Number(id);

  if (Number.isNaN(userId)) {
    notFound();
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      nom: true,
      prenom: true,
      email: true,
      telephone: true,
      bio: true,
      photo_profil: true,
      localisation: {
        select: {
          ville: true,
          quartier: true,
        },
      },
    },
  });

  if (!user) {
    notFound();
  }


  const [annonces, services] = await Promise.all([
    prisma.annonce.findMany({
      where: {
        demandeur_id: userId,
      },
      include: {
        categorie: true,
        localisation: true,
      },
      orderBy: {
        date_creation: "desc",
      },
    }),

    prisma.service.findMany({
      where: {
        prestataire_id: userId,
        statut: "VALIDE",
      },
      include: {
        categorie: true,
        localisation: true,
        images: {
          orderBy: {
            ordre: "asc",
          },
          take: 1,
        },
      },
      orderBy: {
        date_creation: "desc",
      },
    }),
  ]);


  const initials =
    `${user.prenom?.[0] ?? ""}${user.nom[0]}`.toUpperCase();


  return (
    <section className="mx-auto max-w-4xl px-6 py-16">


      {/* En-tête profil */}
      <div className="flex items-center gap-5 rounded-2xl border border-[var(--line)] bg-white p-6">

        {user.photo_profil ? (
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full ring-2 ring-white shadow">

            <Image
              src={user.photo_profil}
              alt={user.nom}
              fill
              className="object-cover"
            />

          </div>
        ) : (

          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-xl font-semibold text-white shadow">
            {initials}
          </div>

        )}



        <div>

          <h1 className="font-[var(--font-display)] text-2xl font-semibold text-[var(--ink)]">
            {user.prenom} {user.nom}
          </h1>



          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[var(--ink)]/60">


            {/* Email */}
            <a
              href={`mailto:${user.email}`}
              className="flex items-center gap-1.5 transition hover:text-[var(--accent)]"
            >
              <Mail className="h-3.5 w-3.5 text-[var(--ink)]/40" />
              {user.email}
            </a>



            {/* Téléphone */}
            {user.telephone && (
              <a
                href={`tel:${user.telephone}`}
                className="flex items-center gap-1.5 transition hover:text-[var(--accent)]"
              >
                <Phone className="h-3.5 w-3.5 text-[var(--ink)]/40" />
                {user.telephone}
              </a>
            )}



            {/* Localisation */}
            {user.localisation && (
              <span className="flex items-center gap-1.5">

                <MapPin className="h-3.5 w-3.5 text-[var(--ink)]/40" />

                {user.localisation.ville}

                {user.localisation.quartier
                  ? `, ${user.localisation.quartier}`
                  : ""}

              </span>
            )}


          </div>



          {user.bio && (
            <p className="mt-2 text-sm text-[var(--ink)]/70">
              {user.bio}
            </p>
          )}


        </div>


      </div>





      {/* Services publiés */}
      <div className="mt-10">

        <h2 className="mb-4 flex items-center gap-2 font-[var(--font-display)] text-xl font-semibold text-[var(--ink)]">

          <Briefcase className="h-5 w-5 text-[var(--accent)]" />

          Services proposés ({services.length})

        </h2>



        {services.length === 0 ? (

          <p className="rounded-xl border border-dashed border-[var(--line)] p-6 text-center text-sm text-[var(--ink)]/50">
            Aucun service publié pour l&apos;instant.
          </p>

        ) : (

          <div className="grid gap-4 sm:grid-cols-2">


            {services.map((s) => (

              <Link
                key={s.id}
                href={`/services/${s.id}`}
                className="flex items-center gap-4 rounded-xl border border-[var(--line)] bg-white p-4 transition hover:border-[var(--accent)]"
              >


                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[var(--line)]">

                  {s.images[0] && (

                    <Image
                      src={s.images[0].url_image}
                      alt={s.titre}
                      fill
                      className="object-cover"
                    />

                  )}

                </div>



                <div className="min-w-0 flex-1">

                  <span className="font-[var(--font-mono)] text-xs uppercase tracking-wider text-[var(--ink)]/40">
                    {s.categorie?.nom}
                  </span>


                  <h3 className="truncate font-medium text-[var(--ink)]">
                    {s.titre}
                  </h3>


                  <p className="truncate text-xs text-[var(--ink)]/50">

                    {s.localisation?.ville}

                    {s.localisation?.quartier
                      ? `, ${s.localisation.quartier}`
                      : ""}

                  </p>


                </div>



                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 font-[var(--font-mono)] text-[10px] uppercase tracking-wider ${serviceStatutStyles[s.statut]}`}
                >
                  {s.statut}
                </span>


              </Link>

            ))}


          </div>

        )}


      </div>





      {/* Annonces publiées */}
      <div className="mt-10">

        <h2 className="mb-4 flex items-center gap-2 font-[var(--font-display)] text-xl font-semibold text-[var(--ink)]">

          <Megaphone className="h-5 w-5 text-[var(--accent)]" />

          Annonces publiées ({annonces.length})

        </h2>



        {annonces.length === 0 ? (

          <p className="rounded-xl border border-dashed border-[var(--line)] p-6 text-center text-sm text-[var(--ink)]/50">
            Aucune annonce publiée pour l&apos;instant.
          </p>


        ) : (

          <div className="space-y-3">


            {annonces.map((a) => (

              <Link
                key={a.id}
                href={`/annonces/${a.id}`}
                className="flex items-center justify-between rounded-xl border border-[var(--line)] bg-white p-4 transition hover:border-[var(--accent)]"
              >


                <div className="min-w-0">

                  <span className="font-[var(--font-mono)] text-xs uppercase tracking-wider text-[var(--ink)]/40">
                    {a.categorie.nom}
                  </span>


                  <h3 className="truncate font-medium text-[var(--ink)]">
                    {a.titre}
                  </h3>


                  <p className="truncate text-xs text-[var(--ink)]/50">

                    {a.localisation.ville}

                    {a.localisation.quartier
                      ? `, ${a.localisation.quartier}`
                      : ""}

                  </p>


                </div>



                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 font-[var(--font-mono)] text-[10px] uppercase tracking-wider ${annonceStatutStyles[a.statut]}`}
                >
                  {a.statut}
                </span>


              </Link>

            ))}


          </div>

        )}


      </div>


    </section>
  );
}