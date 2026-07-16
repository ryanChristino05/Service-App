"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { getAverageRating } from "@/lib/rating";

type Service = {
  id: number;
  titre: string;
  statut: "EN_ATTENTE" | "VALIDE" | "REFUSE";
  categorie: { nom: string };
  localisation: { ville: string };
  feedbacks: {
    note: number | null;
    commentaire: string | null;
    auteur: { nom: string; prenom: string | null };
  }[];
};

const STATUT_STYLES: Record<Service["statut"], string> = {
  EN_ATTENTE: "bg-amber-50 text-amber-700 border border-amber-100",
  VALIDE: "bg-teal-50 text-teal-700 border border-teal-100",
  REFUSE: "bg-red-50 text-red-700 border border-red-100",
};

export default function MesServicesPage() {
  const { status: sessionStatus } = useSession();
  const [services, setServices] = useState<Service[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [expandedServices, setExpandedServices] = useState<number[]>([]);

  async function handleDelete(serviceId: number) {
    if (!confirm("Supprimer ce service définitivement ?")) return;

    setDeletingId(serviceId);
    try {
      const res = await fetch(`/api/services/${serviceId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setServices((prev) => prev?.filter((s) => s.id !== serviceId) ?? null);
      } else {
        const data = await res.json();
        alert(data.error ?? "Suppression impossible");
      }
    } catch {
      alert("Impossible de contacter le serveur");
    } finally {
      setDeletingId(null);
    }
  }

  function toggleFeedback(serviceId: number) {
    setExpandedServices((prev) =>
      prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId]
    );
  }

  useEffect(() => {
    if (sessionStatus !== "authenticated") return;

    let cancelled = false;
    setServices(null);
    setError(null);

    fetch("/api/services/mine")
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data.error) {
          setError(data.error);
        } else {
          setServices(data.services);
        }
      })
      .catch(() => !cancelled && setError("Impossible de contacter le serveur"));

    return () => {
      cancelled = true;
    };
  }, [sessionStatus]);

  if (sessionStatus === "loading") {
    return (
      <main className="min-h-screen bg-[#F6F4EF] px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-3xl border border-[#241F1A]/10 bg-white p-8 text-sm text-[#241F1A]/70 shadow-sm">
            Chargement...
          </div>
        </div>
      </main>
    );
  }

  if (sessionStatus === "unauthenticated") {
    return (
      <main className="min-h-screen bg-[#F6F4EF] px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-3xl border border-[#241F1A]/10 bg-white p-8 text-center shadow-sm">
            <p className="text-sm font-semibold text-[#241F1A]">Connexion requise</p>
            <p className="mt-2 text-sm text-[#241F1A]/60">
              Connectez-vous pour voir et gérer vos services.
            </p>
            <Link
              href="/login"
              className="mt-4 inline-flex rounded-full bg-teal-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-teal-800"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F6F4EF] px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-3xl border border-[#241F1A]/10 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-medium tracking-wide text-teal-700 uppercase">Esera</p>
          <h1 className="mt-1 text-3xl font-bold text-[#241F1A]">Mes services</h1>
          <p className="mt-2 max-w-2xl text-sm text-[#241F1A]/70">
            Retrouvez tous les services publiés sous votre compte. Gérez-les directement depuis cette page avec les actions modifier et supprimer.
          </p>
        </div>

        <div className="mt-8 grid gap-4">
          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              {error}
            </div>
          )}

          {services === null && !error && (
            <div className="rounded-2xl border border-[#241F1A]/10 bg-white p-8 text-sm text-[#241F1A]/70 shadow-sm">
              Chargement...
            </div>
          )}

          {services?.length === 0 && (
            <div className="rounded-3xl border border-dashed border-[#241F1A]/15 bg-white p-10 text-center shadow-sm">
              <p className="text-sm font-semibold text-[#241F1A]">Aucun service publié pour l'instant</p>
              <p className="mt-2 text-sm text-[#241F1A]/60">
                Les services publiés s'afficheront ici dès qu'ils seront disponibles.
              </p>
              <Link
                href="/services/nouveau"
                className="mt-4 inline-flex rounded-full bg-teal-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-teal-800"
              >
                Publier un service
              </Link>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            {services?.map((service) => (
              <article
                key={service.id}
                className="overflow-hidden rounded-3xl border border-[#241F1A]/10 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-widest ${STATUT_STYLES[service.statut]}`}
                    >
                      {service.statut.replace("_", " ")}
                    </span>
                    <span className="text-xs uppercase tracking-[0.18em] text-[#241F1A]/45">
                      {service.categorie.nom}
                    </span>
                  </div>

                  <div className="mt-4 text-lg font-semibold text-[#241F1A]">
                    {service.titre}
                  </div>

                  {service.feedbacks.length > 0 && (
                    <p className="mt-3 line-clamp-2 text-sm text-[#241F1A]/70">
                      {service.feedbacks.find((fb) => fb.commentaire)?.commentaire ?? "Aucun avis écrit pour ce service."}
                    </p>
                  )}

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm">
                    <p className="text-[#241F1A]/60">{service.localisation.ville}</p>
                    <div className="inline-flex items-center gap-2 rounded-full bg-[#F6F4EF]/90 px-3 py-1 text-xs font-medium text-[#241F1A]/80">
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-teal-100 text-teal-700">
                        ★
                      </span>
                      <span>{getAverageRating(service.feedbacks)?.avg ?? "—"}</span>
                      <span className="text-[#241F1A]/40">({service.feedbacks.filter((fb) => fb.note !== null).length} avis)</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-[#241F1A]/10 bg-[#F6F4EF]/80 px-5 py-4 sm:px-6">
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={`/services/${service.id}/modifier`}
                      className="inline-flex rounded-full border border-[#241F1A]/10 bg-white px-4 py-2 text-sm font-medium text-[#241F1A] transition hover:border-teal-300 hover:text-teal-700"
                    >
                      Modifier
                    </Link>
                    <button
                      type="button"
                      onClick={() => toggleFeedback(service.id)}
                      className="inline-flex rounded-full border border-[#241F1A]/10 bg-white px-4 py-2 text-sm font-medium text-[#241F1A] transition hover:border-teal-300 hover:text-teal-700"
                    >
                      {expandedServices.includes(service.id) ? "Masquer les avis" : `Voir les avis (${service.feedbacks.length})`}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(service.id)}
                      disabled={deletingId === service.id}
                      className="inline-flex rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:opacity-50"
                    >
                      {deletingId === service.id ? "Suppression…" : "Supprimer"}
                    </button>
                  </div>
                </div>
                {expandedServices.includes(service.id) && (
                  <div className="border-t border-[#241F1A]/10 bg-[#F6F4EF]/80 px-5 py-4 sm:px-6">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <span className="text-sm font-semibold text-[#241F1A]">Avis du service</span>
                      <span className="text-xs uppercase tracking-[0.14em] text-[#241F1A]/45">
                        {service.feedbacks.length} avis
                      </span>
                    </div>

                    {service.feedbacks.length === 0 ? (
                      <p className="text-sm text-[#241F1A]/60">Aucun avis disponible pour ce service.</p>
                    ) : (
                      <ul className="space-y-3">
                        {service.feedbacks.map((fb, index) => {
                          const authorName = fb.auteur.prenom
                            ? `${fb.auteur.prenom} ${fb.auteur.nom}`
                            : fb.auteur.nom;
                          return (
                            <li key={`${service.id}-${index}`} className="rounded-3xl border border-[#241F1A]/10 bg-white p-4 shadow-sm">
                              <div className="flex items-start gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#6B5A4E] text-[10px] font-bold uppercase text-white">
                                  {authorName.split(" ").map((part) => part[0]).slice(0, 2).join("")}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex flex-wrap items-center justify-between gap-2">
                                    <span className="text-sm font-semibold text-[#241F1A]">{authorName}</span>
                                    {fb.note !== null ? (
                                      <span className="inline-flex items-center gap-1 rounded-full bg-[#F6F4EF] px-2 py-1 text-[11px] font-semibold text-[#C68A1F]">
                                        ★ {fb.note}/5
                                      </span>
                                    ) : (
                                      <span className="text-[11px] text-[#241F1A]/50">Sans note</span>
                                    )}
                                  </div>
                                  <p className="mt-2 text-sm leading-relaxed text-[#241F1A]/75">
                                    {fb.commentaire ?? "A noté sans commentaire."}
                                  </p>
                                </div>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}