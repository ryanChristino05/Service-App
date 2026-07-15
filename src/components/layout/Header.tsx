"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Navbar from "./Navbar";
import ProfileMenu from "./ProfileMenu";
import { signOut } from "next-auth/react";

function LogoMark() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true">
      <path
        d="M15 2C8.9 2 4 6.9 4 13c0 8 11 15 11 15s11-7 11-15c0-6.1-4.9-11-11-11Z"
        fill="var(--accent)"
      />
      <circle cx="15" cy="13" r="4.5" fill="var(--brand-900)" />
    </svg>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Ferme au clic en dehors du menu mobile
  useEffect(() => {
    if (!open) return;

    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
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

  // Bloque le scroll du body quand le menu est ouvert
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header ref={menuRef} className="sticky top-0 z-50 bg-[var(--brand-900)] shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <LogoMark />
          <span className="font-[var(--font-display)] text-xl font-semibold text-white">
            Local Services
          </span>
        </Link>

        {/* Nav desktop + profil */}
    <div className="hidden items-center gap-8 md:flex">
    <Navbar className="flex items-center gap-8" />
    <ProfileMenu />
    </div>
    
        {/* Burger mobile */}
        <button
          onClick={() => setOpen(!open)}
          className="flex flex-col gap-1.5 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] md:hidden"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
        >
          <span className={`h-0.5 w-6 bg-white transition-transform ${open ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`h-0.5 w-6 bg-white transition-opacity ${open ? "opacity-0" : ""}`} />
          <span className={`h-0.5 w-6 bg-white transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </div>

      {/* Menu mobile */}
{open && (
  <div className="border-t border-white/10 px-6 pb-5 md:hidden">
    <Navbar onNavigate={() => setOpen(false)} className="flex flex-col gap-4 pt-4" />

    <div className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-4">
      <Link
        href="/profile"
        onClick={() => setOpen(false)}
        className="text-sm font-medium text-white/70 hover:text-white"
      >
        Mon profil
      </Link>
      
      <button
        onClick={() => {
          setOpen(false);
          signOut({ callbackUrl: "/login" });
        }}
        className="text-left text-sm font-medium text-red-300 hover:text-red-200"
      >
        Déconnexion
</button>
    </div>
  </div>
)}
    </header>
  );
}