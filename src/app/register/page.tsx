"use client";

import { useState } from "react";

export default function Register() {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    mot_de_passe: "",
    localisation_id: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      console.log(data);

      if (response.ok) {
        alert("Succès !");
      } else {
        alert("Erreur : " + data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Impossible de contacter le serveur.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1 font-medium">Nom</label>
          <input
            type="text"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Prénom</label>
          <input
            type="text"
            name="prenom"
            value={formData.prenom}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Mot de passe</label>
          <input
            type="password"
            name="mot_de_passe"
            value={formData.mot_de_passe}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Localisation ID</label>
          <input
            type="text"
            name="localisation_id"
            value={formData.localisation_id}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="border rounded px-4 py-2 cursor-pointer"
        >
          Envoyer
        </button>
      </form>
    </div>
  );
}
