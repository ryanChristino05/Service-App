"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Mail, Briefcase, Megaphone, BadgeCheck } from "lucide-react";
import { useViewMode } from "@/context/ViewModeContext";

type User = {
  id: number;
  nom: string;
  prenom: string | null;
  email: string;
  role: string;
  photo_profil: string | null;
  localisation: { ville: string; quartier: string | null };
};

const roleLabels: Record<string, string> = {
  STANDARD: "Client",
  PRESTATAIRE: "Prestataire",
};

export default function ProfileCard({ user }: { user: User }) {
  const { viewMode } = useViewMode();
  const initials = `${user.prenom?.[0] ?? ""}${user.nom[0]}`.toUpperCase();
  const isPrestataire = viewMode === "prestataire";

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-white shadow-sm">
      {/* Bannière dégradée */}
      <div className="relative h-24 bg-gradient-to-br from-[var(--brand-900)] to-[var(--brand-700)]">
        <div className="absolute -bottom-12 left-8">
          {user.photo_profil ? (
            <div className="relative h-24 w-24 overflow-hidden rounded-full ring-4 ring-white shadow-lg">
              <Image src={user.photo_profil} alt={user.nom} fill className="object-cover" />
            </div>
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[var(--accent)] text-2xl font-semibold text-white ring-4 ring-white shadow-lg">
              {initials}
            </div>
          )}
        </div>
      </div>

      {/* Corps */}
      <div className="px-8 pb-8 pt-16">
        <div className="flex items-center gap-2">
          <h2 className="font-[var(--font-display)] text-2xl font-semibold text-[var(--ink)]">
            {user.prenom} {user.nom}
          </h2>
          {isPrestataire && (
            <BadgeCheck className="h-5 w-5 shrink-0 text-[var(--accent)]" aria-label="Prestataire vérifié" />
          )}
        </div>

        <span className="mt-2 inline-block rounded-full bg-[var(--accent-soft)] px-3 py-0.5 font-[var(--font-mono)] text-xs uppercase tracking-wider text-[var(--brand-900)]">
          {roleLabels[user.role] ?? user.role}
        </span>

        <div className="mt-5 space-y-2.5 border-t border-[var(--line)] pt-5">
          <div className="flex items-center gap-2 text-sm text-[var(--ink)]/60">
            <Mail className="h-4 w-4 shrink-0 text-[var(--ink)]/40" />
            <span className="truncate">{user.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-[var(--ink)]/60">
            <MapPin className="h-4 w-4 shrink-0 text-[var(--ink)]/40" />
            {user.localisation.ville}
            {user.localisation.quartier ? ` (${user.localisation.quartier})` : ""}
          </div>
        </div>

        {isPrestataire ? (
          <Link
            href="/dashboard"
            className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-[var(--brand-900)] py-2.5 text-sm font-medium text-white transition hover:bg-[var(--brand-700)]"
          >
            <Briefcase className="h-4 w-4" />
            Voir mes services
          </Link>
        ) : (
          <Link
            href={`/profils/${user.id}`}
            className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-[var(--brand-900)] py-2.5 text-sm font-medium text-white transition hover:bg-[var(--brand-700)]"
          >
            <Megaphone className="h-4 w-4" />
            Voir mes annonces
          </Link>
        )}
      </div>
    </div>
  );
}