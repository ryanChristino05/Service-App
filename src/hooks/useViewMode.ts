"use client";

import { useCallback, useEffect, useState } from "react";

export type ViewMode = "standard" | "prestataire";

export function useViewMode() {
  const [viewMode, setViewModeState] = useState<ViewMode>("standard");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/view-mode")
      .then((r) => r.json())
      .then((d) => setViewModeState(d.mode))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const toggleViewMode = useCallback(async () => {
    const next: ViewMode = viewMode === "standard" ? "prestataire" : "standard";
    setViewModeState(next); // optimiste
    await fetch("/api/view-mode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: next }),
    });
    return next;
  }, [viewMode]);

  return { viewMode, loading, toggleViewMode };
}