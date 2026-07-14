// src/hooks/useLocalisationSearch.ts
"use client";

import { useState, useEffect } from "react";

export interface LocalisationResult {
  latitude: number;
  longitude: number;
  ville: string;
  quartier?: string;
  adresse?: string;
}

export function useLocalisationSearch(query: string, delayMs = 400) {
  const [results, setResults] = useState<LocalisationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/localisation/search?q=${encodeURIComponent(query)}`
        );
        const data = await response.json();
        setResults(data.results || []);
      } catch (error) {
        console.error("Erreur recherche localisation:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, delayMs);

    return () => clearTimeout(timeoutId);
  }, [query, delayMs]);

  return { results, isLoading };
}