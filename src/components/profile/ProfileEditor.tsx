"use client";

import { useState, useEffect } from "react";
import { Pencil, X, CheckCircle2 } from "lucide-react";
import ProfileCard from "./ProfileCard";
import ProfileForm from "./ProfileForm";
import ProfileSummary from "./ProfileSummary";

type Localisation = { id: number; ville: string; quartier: string | null };

export default function ProfileEditor({
  user,
  userForForm,
  localisations,
}: {
  user: any;
  userForForm: any;
  localisations: Localisation[];
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [visible, setVisible] = useState(true);

  function switchTo(editing: boolean) {
    setVisible(false);
    setTimeout(() => {
      setIsEditing(editing);
      setVisible(true);
    }, 150);
  }

  function handleSuccess() {
    switchTo(false);
    setShowToast(true);
  }

  useEffect(() => {
    if (!showToast) return;
    const t = setTimeout(() => setShowToast(false), 3000);
    return () => clearTimeout(t);
  }, [showToast]);

  return (
    <div className="grid gap-8 md:grid-cols-3">
      <div className="relative">
        <ProfileCard user={user} />
        <button
          onClick={() => switchTo(!isEditing)}
          aria-label={isEditing ? "Fermer l'édition" : "Modifier le profil"}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[var(--brand-900)] shadow-md ring-1 ring-black/5 transition hover:scale-105 hover:bg-[var(--accent-soft)]"
        >
          {isEditing ? <X className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
        </button>
      </div>

      <div className="md:col-span-2">
        <div
          className={`transition-all duration-150 ease-out ${
            visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
          }`}
        >
          {isEditing ? (
            // juste supprimer le prop localisations partout où ProfileForm est appelé
            <ProfileForm
              user={userForForm}
              onSuccess={handleSuccess}
              onCancel={() => switchTo(false)}
            />
          ) : (
            <ProfileSummary user={user} onEdit={() => switchTo(true)} />
          )}
        </div>
      </div>

      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-lg bg-[var(--brand-900)] px-4 py-3 text-sm text-white shadow-lg animate-[toastIn_0.25s_ease-out]">
          <CheckCircle2 className="h-4 w-4 text-[var(--accent)]" />
          Profil mis à jour avec succès.
        </div>
      )}
    </div>
  );
}