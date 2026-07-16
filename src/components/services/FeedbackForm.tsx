"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Star } from "lucide-react";

type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success" }
  | { status: "error"; message: string };

const RATING_LABELS: Record<number, string> = {
  1: "Médiocre",
  2: "Passable",
  3: "Correct",
  4: "Bien",
  5: "Excellent",
};

export default function FeedbackForm({ serviceId }: { serviceId: number }) {
  const { data: session, status } = useSession();
  const [note, setNote] = useState<number | null>(null);
  const [commentaire, setCommentaire] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>({ status: "idle" });

  const canSubmit = note !== null || commentaire.trim().length > 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitState({ status: "submitting" });
    try {
      const res = await fetch(`/api/services/${serviceId}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          note: note ?? undefined,
          commentaire: commentaire.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setSubmitState({ status: "error", message: data.error ?? "Une erreur est survenue" });
        return;
      }

      setSubmitState({ status: "success" });
      setNote(null);
      setCommentaire("");
    } catch {
      setSubmitState({ status: "error", message: "Impossible de contacter le serveur" });
    }
  }

  if (status === "loading") {
    return <div className="h-16 animate-pulse rounded-2xl bg-[var(--line)]/30" />;
  }

  if (!session?.user) {
    return (
      <p className="rounded-xl bg-[var(--paper)] px-4 py-3 text-sm text-[var(--ink)]/60">
        <a href="/login" className="font-medium text-[var(--accent)] hover:underline">
          Connectez-vous
        </a>{" "}
        pour laisser un avis.
      </p>
    );
  }

  if (submitState.status === "success") {
    return (
      <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
        Merci ! Actualisez la page pour voir votre avis.
      </p>
    );
  }

  const initials = `${session.user.email?.[0] ?? "?"}`.toUpperCase();

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--brand-900)] text-xs font-bold text-white">
          {initials}
        </div>

        <div className="min-w-0 flex-1">
          <textarea
            rows={2}
            value={commentaire}
            onChange={(e) => setCommentaire(e.target.value)}
            placeholder="Écrire un avis..."
            className="w-full resize-none rounded-2xl border border-[var(--line)] bg-[var(--paper)] px-3.5 py-2.5 text-sm leading-snug text-[var(--ink)] placeholder:text-[var(--ink)]/40 outline-none transition focus:border-[var(--accent)] focus:bg-white focus:ring-2 focus:ring-[var(--accent-soft)]"
          />

          <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setNote(note === value ? null : value)}
                  aria-label={`${value} étoile${value > 1 ? "s" : ""}`}
                  className="rounded p-0.5 transition hover:scale-110"
                >
                  <Star
                    className={`h-5 w-5 ${
                      note !== null && value <= note
                        ? "fill-[var(--accent)] text-[var(--accent)]"
                        : "fill-none text-[var(--ink)]/20"
                    }`}
                    strokeWidth={1.5}
                  />
                </button>
              ))}
              {note !== null && (
                <span className="ml-1 text-[11px] text-[var(--ink)]/50">{RATING_LABELS[note]}</span>
              )}
            </div>

            <button
              type="submit"
              disabled={!canSubmit || submitState.status === "submitting"}
              className="rounded-lg bg-[var(--brand-900)] px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-[var(--brand-700)] disabled:opacity-40"
            >
              {submitState.status === "submitting" ? "..." : "Publier"}
            </button>
          </div>

          {submitState.status === "error" && (
            <p className="mt-1.5 text-xs text-red-600">{submitState.message}</p>
          )}
        </div>
      </div>
    </form>
  );
}