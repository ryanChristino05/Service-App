"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { ArrowLeft,Mail, Lock } from "lucide-react";
import Link from "next/link";

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
              Connexion
            </h1>
            <p className="mt-2 text-sm text-[var(--ink)]/60">
              Ravi de vous revoir. Connectez-vous à votre compte.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5 rounded-2xl border border-[var(--line)] bg-white p-6 shadow-sm sm:p-8"
          >
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-[var(--ink)]"
              >
                <Mail className="h-3.5 w-3.5 text-[var(--accent)]" />
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="vous@exemple.com"
                className="w-full rounded-lg border border-[var(--line)] px-3 py-2.5 text-[var(--ink)] placeholder:text-[var(--ink)]/40 outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-[var(--ink)]"
              >
                <Lock className="h-3.5 w-3.5 text-[var(--accent)]" />
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Entrez votre mot de passe"
                className="w-full rounded-lg border border-[var(--line)] px-3 py-2.5 text-[var(--ink)] placeholder:text-[var(--ink)]/40 outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
              />
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 px-4 py-2.5 text-center text-sm text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer rounded-lg bg-[var(--accent)] px-4 py-2.5 font-semibold text-[var(--brand-900)] transition hover:brightness-95 active:brightness-90 focus:outline-none focus:ring-2 focus:ring-[var(--accent-soft)] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Connexion…" : "Se connecter"}
            </button>

            <p className="text-center text-sm text-[var(--ink)]/60">
              Pas encore de compte ?{" "}
              <a href="/register" className="font-medium text-[var(--accent)] hover:underline">
                Créer un compte
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}