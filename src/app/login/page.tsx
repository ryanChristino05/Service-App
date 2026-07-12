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
      router.push("/dashboard");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <form onSubmit={handleSubmit} className="space-y-5 border rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-center">Connexion</h2>

        <div>
          <label htmlFor="email" className="block mb-2 font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Entrez votre email"
            className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="password" className="block mb-2 font-medium">
            Mot de passe
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Entrez votre mot de passe"
            className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {error && <p className="text-red-600 text-sm text-center">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-blue-600 text-white py-2 hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
}