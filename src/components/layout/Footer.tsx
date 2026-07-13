import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { CURRENT_USER_ROLE } from "@/lib/mock-session";

const categories = [
  { label: "Plomberie", slug: "plomberie" },
  { label: "Éducation", slug: "education" },
  { label: "Beauté", slug: "beaute" },
  { label: "Transport", slug: "transport" },
];

const socials = [
  {
    label: "Facebook",
    href: "https://facebook.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12Z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
      </svg>
    ),
  },
];

export default function Footer() {
  const isPrestataire = CURRENT_USER_ROLE === "PRESTATAIRE";

  return (
    <footer className="border-t-2 border-[var(--accent)] bg-[var(--brand-900)] text-white/70">
      {/* Bannière CTA — masquée si l'utilisateur est déjà prestataire */}
      {!isPrestataire && (
        <div className="border-b border-white/10">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 sm:flex-row">
            <p className="text-sm text-white">
              Vous êtes prestataire ?{" "}
              <span className="text-white/60">Faites-vous connaître dès aujourd'hui.</span>
            </p>
            <Link
              href="/devenir-prestataire"
              className="rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-medium text-[var(--brand-900)] transition hover:opacity-90"
            >
              Devenir prestataire
            </Link>
          </div>
        </div>
      )}

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-12 sm:grid-cols-2 md:grid-cols-4">
        {/* Marque */}
        <div>
          <span className="font-[var(--font-display)] text-lg font-semibold text-white">
            Local Services
          </span>
          <p className="mt-3 text-sm leading-relaxed">
            Trouvez un prestataire de confiance près de chez vous, ou faites-vous connaître.
          </p>
          <div className="mt-4 flex gap-3">
            {socials.map(({ icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-[var(--accent)] hover:text-[var(--brand-900)]"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

        {/* Catégories */}
        <div>
          <h3 className="mb-3 font-[var(--font-mono)] text-xs uppercase tracking-wider text-white/50">
            Catégories
          </h3>
          <ul className="space-y-2 text-sm">
            {categories.map(({ label, slug }) => (
              <li key={slug}>
                <Link
                  href={`/categories/${slug}`}
                  className="transition hover:text-[var(--accent)]"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-3 font-[var(--font-mono)] text-xs uppercase tracking-wider text-white/50">
            Contact
          </h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0 text-white/40" />
              Antananarivo, Madagascar
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-white/40" />
              <a href="tel:+261340000000" className="hover:text-[var(--accent)]">
                +261 34 00 000 00
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-white/40" />
              <a href="mailto:contact@localservices.mg" className="hover:text-[var(--accent)]">
                contact@localservices.mg
              </a>
            </li>
          </ul>
        </div>

        {/* Langue */}
        <div>
          <h3 className="mb-3 font-[var(--font-mono)] text-xs uppercase tracking-wider text-white/50">
            Langue
          </h3>
          <div className="flex gap-2 text-sm">
            <button className="rounded-full bg-white/10 px-3 py-1 transition hover:bg-[var(--accent)] hover:text-[var(--brand-900)]">
              FR
            </button>
            <button className="rounded-full bg-white/10 px-3 py-1 transition hover:bg-[var(--accent)] hover:text-[var(--brand-900)]">
              MG
            </button>
          </div>
        </div>
      </div>

      {/* Bas de page */}
      <div className="border-t border-white/10 px-6 py-4">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-xs sm:flex-row">
          <span>© 2026 Local Services — Tous droits réservés</span>
          <div className="flex gap-4">
            <Link href="/mentions-legales" className="hover:text-[var(--accent)]">
              Mentions légales
            </Link>
            <Link href="/confidentialite" className="hover:text-[var(--accent)]">
              Confidentialité
            </Link>
            <Link href="/cgu" className="hover:text-[var(--accent)]">
              CGU
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}