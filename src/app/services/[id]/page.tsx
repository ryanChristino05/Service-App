import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const serviceId = Number(id);

  if (Number.isNaN(serviceId)) {
    notFound();
  }

  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    include: {
      prestataire: true,
      categorie: true,
      localisation: true,
      images: { orderBy: { ordre: "asc" } },
    },
  });

  if (!service) {
    notFound();
  }

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      {/* Galerie */}
      {service.images.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-[2fr_1fr]">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[var(--line)] sm:row-span-2">
            <Image
              src={service.images[0].url_image}
              alt={service.titre}
              fill
              className="object-cover"
            />
          </div>
          {service.images.slice(1).map((img) => (
            <div
              key={img.id}
              className="relative hidden aspect-[4/3] overflow-hidden rounded-2xl bg-[var(--line)] sm:block"
            >
              <Image src={img.url_image} alt={service.titre} fill className="object-cover" />
            </div>
          ))}
        </div>
      )}

      <span className="mt-8 block font-[var(--font-mono)] text-xs uppercase tracking-wider text-[var(--accent)]">
        {service.categorie.nom}
      </span>

      <h1 className="mt-2 font-[var(--font-display)] text-2xl font-semibold text-[var(--ink)]">
        {service.titre}
      </h1>

      <p className="mt-2 text-sm text-[var(--ink)]/60">
        {service.localisation.ville}
        {service.localisation.quartier ? `, ${service.localisation.quartier}` : ""}
      </p>

      <p className="mt-6 whitespace-pre-line text-[var(--ink)]/80">{service.description}</p>

      <div className="mt-8 flex items-center gap-3 rounded-2xl border border-[var(--line)] p-5">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand-900)] text-lg font-semibold text-white">
          {service.prestataire.prenom?.[0]}
          {service.prestataire.nom[0]}
        </span>
        <div>
          <p className="font-medium text-[var(--ink)]">
            {service.prestataire.prenom} {service.prestataire.nom}
          </p>
          {service.prestataire.telephone && (
            <p className="text-sm text-[var(--ink)]/60">{service.prestataire.telephone}</p>
          )}
        </div>
      </div>
    </section>
  );
}