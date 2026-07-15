"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

export type ViewMode = "standard" | "prestataire";

type ViewModeContextValue = {
  viewMode: ViewMode;
  loading: boolean;
  toggleViewMode: () => Promise<void>;
};

const ViewModeContext = createContext<ViewModeContextValue | null>(null);

export function ViewModeProvider({ children }: { children: React.ReactNode }) {
  const [viewMode, setViewMode] = useState<ViewMode>("standard");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/view-mode")
      .then((r) => r.json())
      .then((d) => setViewMode(d.mode))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const toggleViewMode = useCallback(async () => {
    const next: ViewMode = viewMode === "standard" ? "prestataire" : "standard";
    setViewMode(next); // met à jour partout instantanément, tous les consommateurs du contexte
    await fetch("/api/view-mode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: next }),
    });
  }, [viewMode]);

  return (
    <ViewModeContext.Provider value={{ viewMode, loading, toggleViewMode }}>
      {children}
    </ViewModeContext.Provider>
  );
}

export function useViewMode() {
  const ctx = useContext(ViewModeContext);
  if (!ctx) {
    throw new Error("useViewMode doit être utilisé à l'intérieur de <ViewModeProvider>");
  }
  return ctx;
}