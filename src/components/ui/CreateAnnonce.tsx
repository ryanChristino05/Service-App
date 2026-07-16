// components/CreateAnnonce.tsx
"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import type { CategorieResult } from "@/hooks/Categorie";
import type { LocalisationResult } from "@/hooks/useLocalisationSearch";
import LocalisationPicker from "@/localisation/LocalisationPicker";

interface CreateAnnonceProps {
  userEmail: string;
  onSuccess?: () => void;
}

export default function CreateAnnonce({ userEmail, onSuccess }: CreateAnnonceProps) {
  const [formData, setFormData] = useState({ titre: "", description: "" });
  const [categories, setCategories] = useState<CategorieResult[]>([]);
  const [categorieInput, setCategorieInput] = useState("");
  const [selectedCategorieId, setSelectedCategorieId] = useState<number | null>(null);
  const [localisation, setLocalisation] = useState<LocalisationResult | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localisationPickerKey, setLocalisationPickerKey] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/categorie")
      .then((res) => {
        if (!res.ok) throw new Error("Erreur serveur");
        return res.json();
      })
      .then(setCategories)
      .catch(() => setError("Impossible de charger les catégories"));
  }, []);

  const filteredCategories = useMemo(() => {
    if (!categorieInput.trim()) return categories;
    return categories.filter((c) =>
      c.nom.toLowerCase().includes(categorieInput.toLowerCase())
    );
  }, [categorieInput, categories]);

  const exactMatch = categories.some(
    (c) => c.nom.toLowerCase() === categorieInput.trim().toLowerCase()
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSelectCategorie(cat: CategorieResult) {
    setCategorieInput(cat.nom);
    setSelectedCategorieId(cat.id);
    setShowDropdown(false);
  }

  function handleCategorieInputChange(value: string) {
    setCategorieInput(value);
    setSelectedCategorieId(null);
    setShowDropdown(true);
  }

  function resetForm() {
    setFormData({ titre: "", description: "" });
    setCategorieInput("");
    setSelectedCategorieId(null);
    setLocalisation(null);
    setShowDropdown(false);
    setLocalisationPickerKey((key) => key + 1);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!categorieInput.trim()) {
      setError("Merci de choisir ou créer une catégorie.");
      return;
    }
    if (!localisation) {
      setError("Veuillez sélectionner une localisation.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        titre: formData.titre,
        description: formData.description,
        email: userEmail,
        categorieId: selectedCategorieId,
        categorieNom: selectedCategorieId ? undefined : categorieInput.trim(),
        localisation,
      };

      const res = await fetch("/api/annonce", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const contentType = res.headers.get("content-type");
      const data = contentType?.includes("application/json") ? await res.json() : null;

      if (!res.ok) {
        throw new Error(data?.error || `Erreur lors de la création (${res.status})`);
      }

      resetForm();
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md text-[var(--ink)]">
      <div>
        <label className="block text-sm font-medium mb-1 text-[var(--ink)]">Titre</label>
        <input
          name="titre"
          value={formData.titre}
          onChange={handleChange}
          required
          className="w-full border border-[var(--line)] rounded px-3 py-2 text-[var(--ink)] placeholder:text-[var(--ink)]/40 bg-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-[var(--ink)]">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border border-[var(--line)] rounded px-3 py-2 text-[var(--ink)] placeholder:text-[var(--ink)]/40 bg-white"
        />
      </div>

      <div ref={wrapperRef} className="relative">
        <label className="block text-sm font-medium mb-1 text-[var(--ink)]">Catégorie</label>
        <input
          type="text"
          value={categorieInput}
          onChange={(e) => handleCategorieInputChange(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          placeholder="Choisir ou créer une catégorie"
          className="w-full border border-[var(--line)] rounded px-3 py-2 text-[var(--ink)] placeholder:text-[var(--ink)]/40 bg-white"
        />

        {showDropdown && (
          <ul className="absolute z-10 bg-white border border-[var(--line)] rounded w-full mt-1 max-h-48 overflow-auto shadow text-[var(--ink)]">
            {filteredCategories.map((cat) => (
              <li
                key={cat.id}
                onClick={() => handleSelectCategorie(cat)}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              >
                {cat.nom}
              </li>
            ))}

            {categorieInput.trim() && !exactMatch && (
              <li
                onClick={() => setShowDropdown(false)}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-blue-600"
              >
                + Créer « {categorieInput.trim()} »
              </li>
            )}
          </ul>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-[var(--ink)]">Localisation</label>
        <LocalisationPicker key={localisationPickerKey} onChange={setLocalisation} />
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="bg-blue-600 text-white rounded px-4 py-2 disabled:opacity-50"
      >
        {submitting ? "Envoi..." : "Créer l'annonce"}
      </button>
    </form>
  );
}