"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "@/lib/nav-links";
import { CURRENT_USER_ROLE } from "@/lib/mock-session";

function BrushUnderline() {
  return (
    <svg
      viewBox="0 0 100 12"
      className="absolute -bottom-2 left-1/2 h-3 w-[80%] -translate-x-1/2 text-[var(--accent)]"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M2 8C20 4 40 3 50 4.5C60 6 80 7 98 5"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export default function Navbar({
  onNavigate,
  className = "",
}: {
  onNavigate?: () => void;
  className?: string;
}) {
  const pathname = usePathname();

  const visibleLinks = navLinks.filter(
    (link) => !link.roles || link.roles.includes(CURRENT_USER_ROLE)
  );

  return (
    <ul className={`flex items-center gap-1 ${className}`}>
      {visibleLinks.map(({ href, label }) => {
        const isActive = pathname === href;
        return (
          <li key={href} className="relative">
            <Link
              href={href}
              onClick={onNavigate}
              aria-current={isActive ? "page" : undefined}
              className={`relative block rounded-full px-4 py-2 text-sm tracking-wide transition-colors duration-200 ${
                isActive
                  ? "font-semibold text-white"
                  : "font-medium text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              {label}
            </Link>
            {isActive && <BrushUnderline />}
          </li>
        );
      })}
    </ul>
  );
}