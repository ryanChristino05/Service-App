"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { User, Settings, LogOut, ChevronDown, Repeat } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

type ViewMode = "standard" | "prestataire";

export default function ProfileMenu() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("standard");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  useEffect(() => {
    fetch("/api/view-mode")
      .then((r) => r.json())
      .then((d) => setViewMode(d.mode))
      .catch(() => {});
  }, []);

  async function toggleViewMode() {
    const next: ViewMode = viewMode === "standard" ? "prestataire" : "standard";
    setViewMode(next);
    await fetch("/api/view-mode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: next }),
    });
    router.refresh();
  }

  // Debug temporaire — à retirer une fois que ça marche
  console.log("STATUS:", status, "SESSION:", session);

  if (status === "loading") {
    return (
      <div className="h-8 w-8 animate-pulse rounded-full bg-white/10" />
    );
  }

  if (!session?.user) return null;

  const nom = (session.user as any).nom ?? "";
  const prenom = (session.user as any).prenom ?? "";
  const fullName = [prenom, nom].filter(Boolean).join(" ") || session.user.email;
  const initials =
    (prenom?.[0] ?? "") + (nom?.[0] ?? "") ||
    session.user.email?.[0]?.toUpperCase() ||
    "?";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 py-1 pl-1 pr-3 text-sm text-white transition hover:border-[var(--accent)]"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent)] text-xs font-semibold text-[var(--brand-900)]">
          {initials}
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-white/60 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--paper)] py-1 text-[var(--ink)] shadow-lg"
        >
          <div className="border-b border-[var(--line)] px-4 py-3">
            <p className="text-sm font-medium">{fullName}</p>
            <p className="truncate text-xs text-[var(--ink)]/60">{session.user.email}</p>
          </div>

          <Link
            href="/profile"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm transition hover:bg-[var(--accent-soft)]"
          >
            <User className="h-4 w-4 text-[var(--ink)]/50" />
            Mon profil
          </Link>

          <button
            role="menuitem"
            onClick={toggleViewMode}
            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm transition hover:bg-[var(--accent-soft)]"
          >
            <Repeat className="h-4 w-4 text-[var(--ink)]/50" />
            {viewMode === "standard" ? "Switch en tant que prestataire" : "Switch visiteur"}
          </button>

          <button
            role="menuitem"
            onClick={() => {
              setOpen(false);
              signOut({ callbackUrl: "/login" });
            }}
            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-red-600 transition hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            Déconnexion
          </button>
        </div>
      )}
    </div>
  );
}