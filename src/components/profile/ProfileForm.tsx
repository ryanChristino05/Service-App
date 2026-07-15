"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LocalisationPicker from "@/localisation/LocalisationPicker";
import { LocalisationResult } from "@/hooks/useLocalisationSearch";

type User = {
  nom: string;
  prenom: string | null;
  telephone: string | null;
  bio: string | null;
  photo_profil: string | null;
  localisation_id: number;
};

export default function ProfileForm({
  user,
  onSuccess,
  onCancel,
}: {
  user: User;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const router = useRouter();

  const [nom, setNom] = useState(user.nom);
  const [prenom, setPrenom] = useState(user.prenom ?? "");
  const [telephone, setTelephone] = useState(user.telephone ?? "");
  const [bio, setBio] = useState(user.bio ?? "");
  const [localisation, setLocalisation] = useState<LocalisationResult | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(user.photo_profil);

  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const bioMaxLength = 240;

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setErrorMessage("");

    const formData = new FormData();
    formData.append("nom", nom);
    formData.append("prenom", prenom);
    formData.append("telephone", telephone);
    formData.append("bio", bio);
    if (localisation) {
      formData.append("localisation", JSON.stringify(localisation));
    }
    if (avatarFile) formData.append("avatar", avatarFile);

    try {
      const res = await fetch("/api/profile", { method: "PUT", body: formData });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Une erreur est survenue");
      }

      setStatus("success");
      router.refresh();
      onSuccess();
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Une erreur est survenue");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-[var(--line)] bg-white p-8 shadow-sm"
    >
      <div className="mb-8">
        <h2 className="font-[var(--font-display)] text-xl font-semibold text-[var(--ink)]">
          Modifier le profil
        </h2>
      </div>

      {/* Photo */}
      <div className="mb-8 flex items-center gap-4">
        <div className="h-16 w-16 overflow-hidden rounded-full bg-[var(--accent-soft)] ring-2 ring-white">
          {preview && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Aperçu avatar" className="h-full w-full object-cover" />
          )}
        </div>
        <div>
          <label className="inline-block cursor-pointer rounded-lg border border-[var(--line)] px-4 py-2 text-sm font-medium text-[var(--ink)] transition hover:border-[var(--accent)]">
            Changer la photo
            <input
              type="file"
              accept="image/png, image/jpeg, image/webp"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </label>
          <p className="mt-1.5 text-xs text-[var(--ink)]/40">JPG, PNG ou WEBP — 3 Mo max</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Section : Informations personnelles */}
        <div>
          <h3 className="mb-4 font-[var(--font-display)] text-sm font-semibold uppercase tracking-wide text-[var(--ink)]/70">
            Informations personnelles
          </h3>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block font-[var(--font-mono)] text-xs uppercase tracking-wider text-[var(--ink)]/50">
                Nom
              </span>
              <input
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                required
                className="w-full rounded-lg border border-[var(--line)] p-3 text-sm text-[var(--ink)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block font-[var(--font-mono)] text-xs uppercase tracking-wider text-[var(--ink)]/50">
                Prénom
              </span>
              <input
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                className="w-full rounded-lg border border-[var(--line)] p-3 text-sm text-[var(--ink)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
              />
            </label>
          </div>
        </div>

        {/* Section : Coordonnées */}
        <div className="border-t border-[var(--line)] pt-6">
          <h3 className="mb-4 font-[var(--font-display)] text-sm font-semibold uppercase tracking-wide text-[var(--ink)]/70">
            Coordonnées
          </h3>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block font-[var(--font-mono)] text-xs uppercase tracking-wider text-[var(--ink)]/50">
                Téléphone
              </span>
              <input
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                type="tel"
                placeholder="034 00 000 00"
                className="w-full rounded-lg border border-[var(--line)] p-3 text-sm text-[var(--ink)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
              />
            </label>

            <div>
              <span className="mb-1.5 block font-[var(--font-mono)] text-xs uppercase tracking-wider text-[var(--ink)]/50">
                Ville / adresse
              </span>
              <LocalisationPicker onChange={setLocalisation} />
              <p className="mt-1.5 text-xs text-[var(--ink)]/40">
                Laisse vide pour garder ta localisation actuelle.
              </p>
            </div>
          </div>
        </div>

        {/* Section : À propos */}
        <div className="border-t border-[var(--line)] pt-6">
          <h3 className="mb-4 font-[var(--font-display)] text-sm font-semibold uppercase tracking-wide text-[var(--ink)]/70">
            À propos
          </h3>
          <label className="block">
            <span className="mb-1.5 flex items-center justify-between font-[var(--font-mono)] text-xs uppercase tracking-wider text-[var(--ink)]/50">
              <span>Bio</span>
              <span>
                {bio.length}/{bioMaxLength}
              </span>
            </span>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value.slice(0, bioMaxLength))}
              rows={3}
              placeholder="Présentez-vous en quelques mots..."
              className="w-full resize-none rounded-lg border border-[var(--line)] p-3 text-sm text-[var(--ink)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
            />
          </label>
        </div>
      </div>

      {status === "error" && (
        <p className="mt-6 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">
          {errorMessage}
        </p>
      )}

      <div className="mt-8 flex items-center gap-3 border-t border-[var(--line)] pt-6">
        <button
          type="submit"
          disabled={status === "saving"}
          className="rounded-lg bg-[var(--brand-900)] px-6 py-3 text-sm font-medium text-white transition hover:bg-[var(--brand-700)] disabled:opacity-50"
        >
          {status === "saving" ? "Enregistrement..." : "Enregistrer"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={status === "saving"}
          className="rounded-lg px-6 py-3 text-sm font-medium text-[var(--ink)]/60 transition hover:bg-[var(--paper)] disabled:opacity-50"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}