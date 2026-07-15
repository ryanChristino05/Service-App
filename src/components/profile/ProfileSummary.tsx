"use client";

import { Pencil, Phone, MapPin, FileText } from "lucide-react";

type User = {
  telephone: string | null;
  bio: string | null;
  localisation: { ville: string; quartier: string | null };
};

export default function ProfileSummary({
  user,
  onEdit,
}: {
  user: User;
  onEdit: () => void;
}) {
  return (
    <div className="rounded-2xl border border-[var(--line)] bg-white p-8 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-[var(--font-display)] text-xl font-semibold text-[var(--ink)]">
          Informations
        </h2>
        <button
          onClick={onEdit}
          className="flex items-center gap-1.5 rounded-lg border border-[var(--line)] px-4 py-2 text-sm font-medium text-[var(--ink)] transition hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]/30"
        >
          <Pencil className="h-3.5 w-3.5" />
          Modifier
        </button>
      </div>

      <div className="space-y-5">
        <div className="border-t border-[var(--line)] pt-5">
          <span className="mb-1.5 flex items-center gap-1.5 font-[var(--font-mono)] text-xs uppercase tracking-wider text-[var(--ink)]/50">
            <FileText className="h-3.5 w-3.5" />
            Bio
          </span>
          <p className="text-sm leading-relaxed text-[var(--ink)]">
            {user.bio || (
              <span className="italic text-[var(--ink)]/40">
                Aucune bio renseignée pour le moment.
              </span>
            )}
          </p>
        </div>

        <div className="grid gap-5 border-t border-[var(--line)] pt-5 sm:grid-cols-2">
          <div>
            <span className="mb-1.5 flex items-center gap-1.5 font-[var(--font-mono)] text-xs uppercase tracking-wider text-[var(--ink)]/50">
              <Phone className="h-3.5 w-3.5" />
              Téléphone
            </span>
            <p className="text-sm text-[var(--ink)]">
              {user.telephone || (
                <span className="italic text-[var(--ink)]/40">Non renseigné</span>
              )}
            </p>
          </div>

          <div>
            <span className="mb-1.5 flex items-center gap-1.5 font-[var(--font-mono)] text-xs uppercase tracking-wider text-[var(--ink)]/50">
              <MapPin className="h-3.5 w-3.5" />
              Ville
            </span>
            <p className="text-sm text-[var(--ink)]">
              {user.localisation.ville}
              {user.localisation.quartier ? ` (${user.localisation.quartier})` : ""}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}