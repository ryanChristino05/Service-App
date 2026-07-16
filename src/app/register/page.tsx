"use client";

import LocalisationPicker from "@/localisation/LocalisationPicker";
import { LocalisationResult } from "@/hooks/useLocalisationSearch";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft,MapPin, User, Mail, Lock } from "lucide-react";
import Link from "next/link";
export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    mot_de_passe: "",
  });
  const [localisation, setLocalisation] = useState<LocalisationResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!localisation) {
      setError("Veuillez sélectionner une localisation.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, localisation }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/login");
      } else {
        setError(data.message ?? "Une erreur est survenue.");
      }
    } catch (err) {
      console.error(err);
      setError("Impossible de contacter le serveur.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[var(--paper)]">
      <div className="px-4 pt-4">
    <Link
      href="/"
      className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--ink)]/60 transition hover:text-[var(--accent)]"
    >
      <ArrowLeft className="h-4 w-4" />
      Retour à l&apos;accueil
    </Link>
  </div>

      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="font-[var(--font-display)] text-3xl font-semibold text-[var(--ink)]">
              Créer un compte
            </h1>
            <p className="mt-2 text-sm text-[var(--ink)]/60">
              Rejoignez la communauté et publiez votre premier service.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5 rounded-2xl border border-[var(--line)] bg-white p-6 shadow-sm sm:p-8"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-[var(--ink)]">
                  <User className="h-3.5 w-3.5 text-[var(--accent)]" />
                  Nom
                </label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-[var(--line)] px-3 py-2.5 text-[var(--ink)] placeholder:text-[var(--ink)]/40 outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-[var(--ink)]">
                  Prénom
                </label>
                <input
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-[var(--line)] px-3 py-2.5 text-[var(--ink)] placeholder:text-[var(--ink)]/40 outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-[var(--ink)]">
                <Mail className="h-3.5 w-3.5 text-[var(--accent)]" />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-[var(--line)] px-3 py-2.5 text-[var(--ink)] placeholder:text-[var(--ink)]/40 outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
              />
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-[var(--ink)]">
                <Lock className="h-3.5 w-3.5 text-[var(--accent)]" />
                Mot de passe
              </label>
              <input
                type="password"
                name="mot_de_passe"
                value={formData.mot_de_passe}
                onChange={handleChange}
                required
                minLength={8}
                className="w-full rounded-lg border border-[var(--line)] px-3 py-2.5 text-[var(--ink)] placeholder:text-[var(--ink)]/40 outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
              />
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-[var(--ink)]">
                <MapPin className="h-3.5 w-3.5 text-[var(--accent)]" />
                Localisation
              </label>
              <LocalisationPicker onChange={setLocalisation} />
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full cursor-pointer rounded-lg bg-[var(--accent)] px-4 py-2.5 font-semibold text-[var(--brand-900)] transition hover:brightness-95 active:brightness-90 focus:outline-none focus:ring-2 focus:ring-[var(--accent-soft)] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Envoi en cours…" : "Créer mon compte"}
            </button>

            <p className="text-center text-sm text-[var(--ink)]/60">
              Déjà un compte ?{" "}
              <a href="/login" className="font-medium text-[var(--accent)] hover:underline">
                Se connecter
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}