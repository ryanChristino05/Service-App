import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin,
  Phone,
  Star,
  Calendar,
  MessageSquare,
  ChevronLeft,
  User,
} from "lucide-react";
import * as serviceService from "@/lib/services/service.service";
import { ServiceNotFoundError } from "@/lib/services/service.service";
import { getCategoryStyle } from "@/lib/category-colors";
import { getAverageRating } from "@/lib/rating";
import ServiceGallery, { ServiceGalleryPlaceholder } from "@/components/services/ServiceGallery";
import FeedbackForm from "@/components/services/FeedbackForm";
import { auth } from "@/lib/auth";

type PageProps = { params: Promise<{ id: string }> };

function getInitials(nom: string, prenom: string | null) {
  const first = prenom?.[0] ?? nom[0];
  const second = prenom ? nom[0] : "";
  return (first + second).toUpperCase();
}

function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

function formatShortDate(date: Date | string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function StarRating({ note, size = "sm" }: { note: number; size?: "sm" | "md" }) {
  const iconClass = size === "md" ? "h-4 w-4" : "h-3 w-3";
  return (
    <span className="inline-flex items-center gap-px">
      {[1, 2, 3, 4, 5].map((value) => (
        <Star
          key={value}
          className={`${iconClass} ${
            value <= note ? "fill-[#C68A1F] text-[#C68A1F]" : "fill-none text-[#241F1A]/12"
          }`}
          strokeWidth={1.5}
        />
      ))}
    </span>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-widest text-[#241F1A]/40">
      {children}
    </p>
  );
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { id: idParam } = await params;
  const id = Number(idParam);

  if (!Number.isInteger(id) || id <= 0) {
    notFound();
  }

  let service;
  try {
    service = await serviceService.getServiceDetail(id);
  } catch (error) {
    if (error instanceof ServiceNotFoundError) {
      notFound();
    }
    throw error;
  }

  const session = await auth();
  const isOwner = session?.user ? Number(session.user.id) === service.prestataire.id : false;

  const categoryStyle = getCategoryStyle(service.categorie.nom);
  const displayName = service.prestataire.prenom
    ? `${service.prestataire.prenom} ${service.prestataire.nom}`
    : service.prestataire.nom;
  const rating = getAverageRating(service.feedbacks);

  return (
    <main className="min-h-screen bg-[#F6F4EF]">
      <div className="border-b border-[#241F1A]/8 bg-white">
        <div className="mx-auto flex max-w-6xl items-center px-4 py-3">
          <Link
            href="/services"
            className="inline-flex items-center gap-1 text-sm font-medium text-[#241F1A]/60 transition hover:text-[#241F1A]"
          >
            <ChevronLeft className="h-4 w-4" />
            Retour aux services
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 lg:py-10">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_380px] lg:items-start">
          {/* ── Colonne gauche — service ── */}
          <div className="overflow-hidden rounded-2xl border border-[#241F1A]/8 bg-white shadow-sm">
            <div className="p-6 lg:p-7">
              {/* En-tête : titre + évaluation globale */}
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <span
                    className="inline-block rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest"
                    style={{ backgroundColor: categoryStyle.bg, color: categoryStyle.text }}
                  >
                    {service.categorie.nom}
                  </span>
                  <h1 className="mt-2.5 text-2xl font-bold tracking-tight text-[#241F1A] lg:text-[1.65rem]">
                    {service.titre}
                  </h1>
                </div>

                {/* Évaluation globale — dans le même bloc */}
                <div className="shrink-0 rounded-xl border border-[#241F1A]/8 bg-[#F6F4EF]/60 px-4 py-3 text-center">
                  {rating ? (
                    <>
                      <div className="flex items-center justify-center gap-1.5">
                        <span className="text-2xl font-bold leading-none text-[#241F1A]">
                          {rating.avg}
                        </span>
                        <Star className="h-5 w-5 fill-[#C68A1F] text-[#C68A1F]" />
                      </div>
                      <StarRating note={Math.round(rating.avg)} size="md" />
                      <p className="mt-1 text-[10px] text-[#241F1A]/45">
                        {rating.count} note{rating.count > 1 ? "s" : ""} · {service.feedbacks.length}{" "}
                        avis
                      </p>
                    </>
                  ) : (
                    <>
                      <Star className="mx-auto h-5 w-5 text-[#241F1A]/20" />
                      <p className="mt-1 text-[10px] text-[#241F1A]/40">Pas encore noté</p>
                    </>
                  )}
                </div>
              </div>

              {/* Prestataire — cliquable vers son profil public */}
              <Link
                href={`/profils/${service.prestataire.id}`}
                className="mt-5 flex items-center gap-3 rounded-xl bg-[#F6F4EF]/70 px-4 py-3 transition hover:bg-[#F6F4EF]"
              >
                {service.prestataire.photo_profil ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={service.prestataire.photo_profil}
                    alt={displayName}
                    className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-white"
                  />
                ) : (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#6B5A4E] text-xs font-bold text-white ring-2 ring-white">
                    {getInitials(service.prestataire.nom, service.prestataire.prenom)}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[#241F1A]">{displayName}</p>
                  <p className="flex items-center gap-1 text-xs text-[#241F1A]/45">
                    <Calendar className="h-3 w-3" />
                    Publié le {formatDate(service.date_creation)}
                  </p>
                </div>
                {isOwner ? (
                  <div className="hidden items-center gap-1.5 rounded-lg border border-[var(--accent)] bg-[var(--accent-soft)] px-3 py-1.5 text-xs font-medium text-[var(--brand-900)] sm:flex">
                    Votre service
                  </div>
                ) : (
                  <div className="hidden items-center gap-1.5 rounded-lg border border-[#241F1A]/8 bg-white px-3 py-1.5 text-xs text-[#241F1A]/55 sm:flex">
                    <User className="h-3.5 w-3.5" />
                    Prestataire
                  </div>
                )}
              </Link>

              {/* Description */}
              {service.description && (
                <div className="mt-6">
                  <SectionLabel>Description</SectionLabel>
                  <p className="mt-2 text-sm leading-relaxed text-[#241F1A]/75">
                    {service.description}
                  </p>
                </div>
              )}

              {/* Image — sous la description */}
              <div className="mt-6">
                <SectionLabel>Photos</SectionLabel>
                <div className="mt-2">
                  {service.images.length > 0 ? (
                    <ServiceGallery images={service.images} alt={service.titre} compact />
                  ) : (
                    <ServiceGalleryPlaceholder />
                  )}
                </div>
              </div>

              {/* Contact */}
              <div className="mt-6">
                <SectionLabel>Informations</SectionLabel>
                <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  <div className="flex items-center gap-3 rounded-xl border border-[#241F1A]/8 px-4 py-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#2C6E8E]/10">
                      <MapPin className="h-4 w-4 text-[#2C6E8E]" strokeWidth={1.75} />
                    </div>
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-wide text-[#241F1A]/40">
                        Localisation
                      </p>
                      <p className="text-sm font-medium text-[#241F1A]">
                        {service.localisation.ville}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border border-[#241F1A]/8 px-4 py-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#2C6E8E]/10">
                      <Phone className="h-4 w-4 text-[#2C6E8E]" strokeWidth={1.75} />
                    </div>
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-wide text-[#241F1A]/40">
                        Téléphone
                      </p>
                      <p className="text-sm font-medium text-[#241F1A]">
                        {service.prestataire.telephone ?? "Non renseigné"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Colonne droite — avis unifiés (style Facebook) ── */}
          <aside className="lg:sticky lg:top-6">
            <div className="overflow-hidden rounded-2xl border border-[#241F1A]/8 bg-white shadow-sm">
              {/* En-tête */}
              <div className="flex items-center justify-between border-b border-[#241F1A]/6 px-5 py-4">
                <h2 className="flex items-center gap-2 text-sm font-bold text-[#241F1A]">
                  <MessageSquare className="h-4 w-4 text-[#241F1A]/35" />
                  Avis
                </h2>
                <span className="text-xs font-medium text-[#241F1A]/45">
                  {service.feedbacks.length} commentaire{service.feedbacks.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="border-b border-[#241F1A]/6 px-5 py-4">
                <FeedbackForm serviceId={service.id} />
              </div>

              {/* Liste des avis */}
              {service.feedbacks.length === 0 ? (
                <p className="px-5 py-6 text-center text-sm text-[#241F1A]/40">
                  Aucun avis pour l&apos;instant. Soyez le premier à commenter !
                </p>
              ) : (
                <ul className="max-h-[calc(100vh-12rem)] divide-y divide-[#241F1A]/5 overflow-y-auto">
                  {service.feedbacks.map((fb) => {
                    const authorName = fb.auteur.prenom
                      ? `${fb.auteur.prenom} ${fb.auteur.nom}`
                      : fb.auteur.nom;

                    return (
                      <li key={fb.id} className="px-5 py-3.5">
                        <div className="flex gap-2.5">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#6B5A4E] text-[9px] font-bold text-white">
                            {getInitials(fb.auteur.nom, fb.auteur.prenom)}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="inline-flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
                              <span className="text-[13px] font-semibold text-[#241F1A]">
                                {authorName}
                              </span>
                              {fb.note !== null && (
                                <span className="inline-flex items-center gap-0.5 text-[11px] font-medium text-[#C68A1F]">
                                  <Star className="h-3 w-3 fill-current" />
                                  {fb.note}/5
                                </span>
                              )}
                              <span className="text-[11px] text-[#241F1A]/35">·</span>
                              <span className="text-[11px] text-[#241F1A]/35">
                                {formatShortDate(fb.date_creation)}
                              </span>
                            </div>

                            {fb.commentaire ? (
                              <p className="mt-0.5 text-[13px] leading-snug text-[#241F1A]/80">
                                {fb.commentaire}
                              </p>
                            ) : (
                              fb.note !== null && (
                                <p className="mt-0.5 text-[12px] italic text-[#241F1A]/40">
                                  A noté sans commentaire
                                </p>
                              )
                            )}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}