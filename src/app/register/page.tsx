"use client";

import LocalisationPicker from "@/localisation/LocalisationPicker";
import { LocalisationResult } from "@/hooks/useLocalisationSearch";
import { useState } from "react";
import { useRouter } from "next/navigation";
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!localisation) {
      alert("Veuillez sélectionner une localisation.");
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
        alert("Succès !");
        router.push("/login");
      } else {
        alert("Erreur : " + data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Impossible de contacter le serveur.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      {/* Bandeau de marque */}
      <div className="bg-brand-900 py-4">
        <div className="max-w-md mx-auto px-4 flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-accent" />
          <span className="font-body text-sm font-medium tracking-wide text-paper/90">
            Trouvez un service près de chez vous
          </span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="font-display text-3xl text-ink">Créer un compte</h1>
            <p className="mt-2 font-body text-sm text-ink/60">
              Rejoignez la communauté et publiez votre premier service.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5 bg-paper border border-line rounded-2xl p-6 sm:p-8 shadow-sm"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1.5 font-body text-sm font-medium text-ink">
                  Nom
                </label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  className="w-full font-body border border-line rounded-lg px-3 py-2.5 text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition"
                />
              </div>

              <div>
                <label className="block mb-1.5 font-body text-sm font-medium text-ink">
                  Prénom
                </label>
                <input
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  className="w-full font-body border border-line rounded-lg px-3 py-2.5 text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1.5 font-body text-sm font-medium text-ink">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full font-body border border-line rounded-lg px-3 py-2.5 text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition"
              />
            </div>

            <div>
              <label className="block mb-1.5 font-body text-sm font-medium text-ink">
                Mot de passe
              </label>
              <input
                type="password"
                name="mot_de_passe"
                value={formData.mot_de_passe}
                onChange={handleChange}
                className="w-full font-body border border-line rounded-lg px-3 py-2.5 text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition"
              />
            </div>

            <div>
              <label className="block mb-1.5 font-body text-sm font-medium text-ink">
                Localisation
              </label>
              <LocalisationPicker onChange={setLocalisation} />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full font-body font-semibold rounded-lg px-4 py-2.5 bg-accent text-brand-900 hover:bg-accent/90 active:bg-accent/80 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:ring-offset-2 focus:ring-offset-paper transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {submitting ? "Envoi en cours…" : "Créer mon compte"}
            </button>

            <p className="text-center font-body text-sm text-ink/60">
              Déjà un compte ?{" "}
              <a href="/login" className="text-accent hover:underline font-medium">
                Se connecter
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}