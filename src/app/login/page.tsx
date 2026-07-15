"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Email ou mot de passe incorrect.");
    } else {
      router.push("/");
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
            <h1 className="font-display text-3xl text-ink">Connexion</h1>
            <p className="mt-2 font-body text-sm text-ink/60">
              Ravi de vous revoir. Connectez-vous à votre compte.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5 bg-paper border border-line rounded-2xl p-6 sm:p-8 shadow-sm"
          >
            <div>
              <label htmlFor="email" className="block mb-1.5 font-body text-sm font-medium text-ink">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="vous@exemple.com"
                className="w-full font-body border border-line rounded-lg px-3 py-2.5 text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition"
              />
            </div>

            <div>
              <label htmlFor="password" className="block mb-1.5 font-body text-sm font-medium text-ink">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Entrez votre mot de passe"
                className="w-full font-body border border-line rounded-lg px-3 py-2.5 text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition"
              />
            </div>

            {error && (
              <p className="text-center font-body text-sm text-red-600">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full font-body font-semibold rounded-lg px-4 py-2.5 bg-accent text-brand-900 hover:bg-accent/90 active:bg-accent/80 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:ring-offset-2 focus:ring-offset-paper transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? "Connexion…" : "Se connecter"}
            </button>

            <p className="text-center font-body text-sm text-ink/60">
              Pas encore de compte ?{" "}
              <a href="/register" className="text-accent hover:underline font-medium">
                Créer un compte
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}