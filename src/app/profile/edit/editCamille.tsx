"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditProfilePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    telephone: "",
    bio: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        setForm({
          nom: data.nom ?? "",
          prenom: data.prenom ?? "",
          telephone: data.telephone ?? "",
          bio: data.bio ?? "",
        });
        setLoading(false);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setSaving(false);

    if (res.ok) {
      router.push("/profile");
    } else {
      alert("Erreur lors de la mise à jour");
    }
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Modifier les informations</h1>

      <div>
        <label className="block mb-1">Nom</label>
        <input
          name="nom"
          value={form.nom}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block mb-1">Prénom</label>
        <input
          name="prenom"
          value={form.prenom}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block mb-1">Téléphone</label>
        <input
          name="telephone"
          value={form.telephone}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block mb-1">Bio</label>
        <textarea
          name="bio"
          value={form.bio}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        {saving ? "Enregistrement..." : "Enregistrer"}
      </button>
    </form>
  );
}