// components/ui/ServiceModalTrigger.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import CreateService from "@/components/ui/CreateService";

interface ServiceModalTriggerProps {
  userEmail: string | null;
}

export default function ServiceModalTrigger({ userEmail }: ServiceModalTriggerProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  function handleClick() {
    if (!userEmail) {
      router.push("/login");
      return;
    }
    setOpen(true);
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        title="Publier un service"
        className="group flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] shadow-lg transition hover:brightness-95"
      >
        <Plus className="h-5 w-5 text-[var(--brand-900)] transition group-hover:rotate-90" />
      </button>

      {open && userEmail && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 text-[var(--ink)]/40 hover:text-[var(--ink)]"
              aria-label="Fermer"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="mb-4 font-[var(--font-display)] text-xl font-semibold text-[var(--ink)]">
              Publier un service
            </h2>

            <CreateService onSuccess={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}