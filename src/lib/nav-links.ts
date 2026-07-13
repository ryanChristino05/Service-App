import type { Role } from "./mock-session";

export const navLinks: { href: string; label: string; roles?: Role[] }[] = [
  { href: "/", label: "Accueil" },
  { href: "/services", label: "Services" },
  { href: "/annonces", label: "Annonces" },
  { href: "/dashboard", label: "Dashboard", roles: ["PRESTATAIRE"] },
];