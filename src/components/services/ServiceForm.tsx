"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useUploadThing } from "@/lib/uploadthing/client";
import LocalisationPicker from "@/components/localisation/LocalisationPicker";
import type { LocalisationResult } from "@/types/localisation";
import { toLocalisationInput } from "@/types/localisation";

const MAX_PHOTOS = 3;

const formSchema = z.object({
  titre: z.string().min(3, "Le titre doit contenir au moins 3 caractères").max(255),
  description: z.string().max(5000).optional(),
  categorie_id: z.coerce.number().int().positive("Choisis une catégorie"),
  userId: z.coerce.number().int().positive("Indique un ID utilisateur valide"),
});

type SubmitState =
  | { status: "idle" }
  | { status: "creating" }
  | { status: "uploading" }
  | { status: "success"; serviceId: number }
  | { status: "error"; message: string };

type Categorie = { id: number; nom: string };

export default function ServiceForm({ categories }: { categories: Categorie[] }) {
  const [submitState, setSubmitState] = useState<SubmitState>({ status: "idle" });
  const currentUserIdRef = useRef(1);
  const [photoSlots, setPhotoSlots] = useState<(File | null)[]>([null, null, null]);
  const [previewUrls, setPreviewUrls] = useState<(string | null)[]>([null, null, null]);
  const [localisation, setLocalisation] = useState<LocalisationResult | null>(null);
  const [localisationError, setLocalisationError] = useState<string | null>(null);
  const [pickerKey, setPickerKey] = useState(0);

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => url && URL.revokeObjectURL(url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<z.input<typeof formSchema>, unknown, z.output<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { userId: 1, categorie_id: undefined },
  });

  const selectedCategoryId = watch("categorie_id");

  const { startUpload } = useUploadThing("serviceImageUploader", {
    headers: () => ({ "x-user-id": String(currentUserIdRef.current) }),
    onUploadError: (error) => {
      setSubmitState({ status: "error", message: `Service créé, mais échec de l'upload : ${error.message}` });
    },
  });

  function handleSlotChange(index: number, file: File | null) {
    setPhotoSlots((prev) => {
      const next = [...prev];
      next[index] = file;
      return next;
    });
    setPreviewUrls((prev) => {
      const next = [...prev];
      if (next[index]) URL.revokeObjectURL(next[index] as string);
      next[index] = file ? URL.createObjectURL(file) : null;
      return next;
    });
  }

  async function onSubmit(values: z.output<typeof formSchema>) {
    if (!localisation) {
      setLocalisationError("Choisis une localisation pour ton service");
      return;
    }
    setLocalisationError(null);
    setSubmitState({ status: "creating" });

    try {
      const res = await fetch("/api/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": String(values.userId),
        },
        body: JSON.stringify({
          titre: values.titre,
          description: values.description,
          categorie_id: values.categorie_id,
          localisation: toLocalisationInput(localisation),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setSubmitState({ status: "error", message: data.error ?? "Une erreur est survenue" });
        return;
      }

      const filesToUpload = photoSlots.filter((f): f is File => f !== null);

      if (filesToUpload.length > 0) {
        currentUserIdRef.current = values.userId;
        setSubmitState({ status: "uploading" });
        await startUpload(filesToUpload, { serviceId: data.id });
      }

      setSubmitState({ status: "success", serviceId: data.id });
      setPhotoSlots([null, null, null]);
      previewUrls.forEach((url) => url && URL.revokeObjectURL(url));
      setPreviewUrls([null, null, null]);
      setLocalisation(null);
      setLocalisationError(null);
      setPickerKey((k) => k + 1);
      reset({ userId: values.userId, titre: "", description: "", categorie_id: undefined });
    } catch {
      setSubmitState({ status: "error", message: "Impossible de contacter le serveur" });
    }
  }

  const isBusy = submitState.status === "creating" || submitState.status === "uploading";
  const selectedPhotosCount = photoSlots.filter(Boolean).length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="space-y-4">
          <span className="inline-flex rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-teal-700">
            Nouveau service
          </span>
          <div className="space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Publier une prestation professionnelle</h1>
            <p className="max-w-2xl text-sm leading-6 text-slate-600">
              Remplis ce formulaire pour créer une fiche claire et attractive. Un bon titre, une description complète et des photos qualité augmentent la confiance des clients.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto mt-8 grid max-w-3xl gap-8">
        <section className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
          <div className="mb-6 space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-700">Informations générales</p>
            <h2 className="text-xl font-semibold text-slate-950">Détails du service</h2>
            <p className="text-sm leading-6 text-slate-600">
              Ces informations seront visibles sur la page publique du service. Sois précis et utilise un ton professionnel.
            </p>
          </div>

          <div className="grid gap-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <label htmlFor="titre" className="block text-sm font-medium text-slate-900">
                Titre du service
              </label>
              <input
                id="titre"
                type="text"
                placeholder="Ex. Réparation plomberie à domicile"
                autoComplete="off"
                {...register("titre")}
                className="mt-3 block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
              />
              {errors.titre && <p className="mt-2 text-sm text-red-600">{errors.titre.message}</p>}
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-900">Catégorie</label>
                  <p className="mt-1 text-sm text-slate-600">Choisis la catégorie qui correspond le mieux à ton service.</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-600">
                  {selectedCategoryId ? "Sélectionnée" : "Requise"}
                </span>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {categories.map((cat) => {
                  const isSelected = Number(selectedCategoryId) === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setValue("categorie_id", cat.id, { shouldValidate: true })}
                      className={`rounded-3xl border px-4 py-3 text-left transition ${
                        isSelected
                          ? "border-teal-600 bg-teal-600 text-white shadow-sm"
                          : "border-slate-200 bg-white text-slate-800 hover:border-teal-300 hover:bg-teal-50"
                      }`}
                    >
                      <span className="block text-sm font-semibold">{cat.nom}</span>
                    </button>
                  );
                })}
              </div>

              {errors.categorie_id && <p className="mt-3 text-sm text-red-600">{errors.categorie_id.message}</p>}
              <input {...register("categorie_id")} type="hidden" />
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <label htmlFor="description" className="block text-sm font-medium text-slate-900">
                Description détaillée
              </label>
              <textarea
                id="description"
                rows={6}
                placeholder="Décris ton offre, les prestations incluses, tes compétences et les avantages pour le client."
                {...register("description")}
                className="mt-3 block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
              />
              {errors.description && <p className="mt-2 text-sm text-red-600">{errors.description.message}</p>}
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-900">Localisation</label>
                  <p className="mt-1 text-sm text-slate-600">
                    Indique où se déroule ton service. Recherche une adresse puis ajuste la position sur la carte si besoin.
                  </p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-600">
                  {localisation ? "Sélectionnée" : "Requise"}
                </span>
              </div>
              <div className="mt-4">
                <LocalisationPicker
                  key={pickerKey}
                  onChange={(value) => {
                    setLocalisation(value);
                    if (value) setLocalisationError(null);
                  }}
                />
              </div>
              {localisationError && (
                <p className="mt-3 text-sm text-red-600">{localisationError}</p>
              )}
            </div>
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-700">Visuels</p>
              <h2 className="text-xl font-semibold text-slate-950">Ajouter des photos</h2>
            </div>
            <p className="text-sm text-slate-600">{selectedPhotosCount}/{MAX_PHOTOS} images sélectionnées</p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm text-slate-600">Fais simple : des photos nettes et représentatives du service rendent ta fiche plus crédible.</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {photoSlots.map((_, index) => (
                <PhotoSlot
                  key={index}
                  previewUrl={previewUrls[index]}
                  onChange={(f) => handleSlotChange(index, f)}
                />
              ))}
            </div>
          </div>

          <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-600">
            <p className="font-semibold text-slate-800">Astuce</p>
            <p className="mt-2">Choisis des photos lumineuses et avec un cadre clair. Les images qui montrent le service ou le résultat font meilleure impression.</p>
          </div>
        </section>

        <div className="grid gap-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <label htmlFor="userId" className="block text-sm font-medium text-slate-900">
              ID utilisateur (temporaire)
            </label>
            <p className="mt-1 text-sm text-slate-600">Ce champ est utilisé pour les tests actuels. Il sera remplacé par l&apos;authentification utilisateur plus tard.</p>
            <input
              id="userId"
              type="number"
              {...register("userId")}
              className="mt-3 w-36 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
            />
            {errors.userId && <p className="mt-2 text-sm text-red-600">{errors.userId.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isBusy}
            className="inline-flex items-center justify-center rounded-3xl bg-teal-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-500/10 transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitState.status === "creating" && "Création du service..."}
            {submitState.status === "uploading" && "Téléversement des photos..."}
            {!isBusy && "Publier le service"}
          </button>

          {submitState.status === "success" && (
            <div className="rounded-3xl border border-teal-200 bg-teal-50 p-5 text-sm text-teal-900">
              <p className="font-semibold">Service publié avec succès.</p>
              <p className="mt-2">ID du service créé : {submitState.serviceId}. Il sera visible après validation.</p>
            </div>
          )}

          {submitState.status === "error" && (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-5 text-sm text-red-900">
              <p className="font-semibold">Erreur</p>
              <p className="mt-2">{submitState.message}</p>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

function PhotoSlot({
  previewUrl,
  onChange,
}: {
  previewUrl: string | null;
  onChange: (file: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-dashed border-slate-300 bg-slate-100 p-2 transition hover:border-teal-300 hover:bg-white">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        className="hidden"
      />

      {previewUrl ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={previewUrl} alt="Aperçu" className="h-32 w-full rounded-3xl object-cover" />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/80 text-sm text-white transition hover:bg-slate-900"
            aria-label="Retirer la photo"
          >
            ×
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex h-32 w-full flex-col items-center justify-center gap-2 rounded-3xl text-slate-500 transition hover:bg-slate-100 hover:text-teal-600"
        >
          <span className="text-2xl">+</span>
          <span className="text-xs font-medium uppercase tracking-[0.24em]">Ajouter une photo</span>
        </button>
      )}
    </div>
  );
}
