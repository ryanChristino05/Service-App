"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, CheckCircle2, X } from "lucide-react";

type Annonce = {
  id: number;
  titre: string;
  description: string | null;
  statut: string;
};

export default function AnnonceOwnerActions({ annonce }: { annonce: Annonce }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [titre, setTitre] = useState(annonce.titre);
  const [description, setDescription] = useState(annonce.description ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function updateAnnonce(data: Partial<{ titre: string; description: string; statut: string }>) {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/annonce/${annonce.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => null);
        throw new Error(d?.error ?? "Erreur lors de la mise à jour");
      }
      router.refresh();
      setEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="flex shrink-0 items-center gap-2"
      onClick={(e) => e.stopPropagation()}
    >
      {annonce.statut !== "RESOLUE" && (
        <button
          type="button"
          onClick={() => updateAnnonce({ statut: "RESOLUE" })}
          disabled={saving}
          title="Marquer comme résolue"
          className="flex h-8 w-8 items-center justify-center rounded-full text-green-600 transition hover:bg-green-50 disabled:opacity-50"
        >
          <CheckCircle2 className="h-4 w-4" />
        </button>
      )}

      <button
        type="button"
        onClick={() => setEditing(true)}
        title="Modifier"
        className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--ink)]/60 transition hover:bg-[var(--accent-soft)]"
      >
        <Pencil className="h-4 w-4" />
      </button>

      {editing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={() => setEditing(false)}
        >
          <div
            className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="absolute right-4 top-4 text-[var(--ink)]/40 hover:text-[var(--ink)]"
              aria-label="Fermer"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="mb-4 font-[var(--font-display)] text-lg font-semibold text-[var(--ink)]">
              Modifier l&apos;annonce
            </h2>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-[var(--ink)]">Titre</label>
                <input
                  value={titre}
                  onChange={(e) => setTitre(e.target.value)}
                  className="w-full rounded-lg border border-[var(--line)] px-3 py-2 text-sm text-[var(--ink)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-[var(--ink)]">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full rounded-lg border border-[var(--line)] px-3 py-2 text-sm text-[var(--ink)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                type="button"
                onClick={() => updateAnnonce({ titre, description })}
                disabled={saving}
                className="w-full rounded-lg bg-[var(--brand-900)] py-2.5 text-sm font-medium text-white transition hover:bg-[var(--brand-700)] disabled:opacity-50"
              >
                {saving ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}