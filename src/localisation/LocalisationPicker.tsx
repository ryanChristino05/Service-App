// src/components/localisation/LocalisationPicker.tsx
"use client";

import { useState } from "react";
import { useLocalisationSearch, LocalisationResult } from "@/hooks/useLocalisationSearch";
import dynamic from "next/dynamic";

const LocalisationMap = dynamic(() => import("./LocalisationMap"), {
  ssr: false,
  loading: () => <p>Chargement de la carte...</p>,
});

interface LocalisationPickerProps {
  onChange?: (localisation: LocalisationResult) => void;
}

export default function LocalisationPicker({ onChange }: LocalisationPickerProps) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<LocalisationResult | null>(null);
  const { results, isLoading } = useLocalisationSearch(query);

  function handleSelect(result: LocalisationResult) {
    setSelected(result);
    setQuery(result.adresse || result.ville);
    onChange?.(result);
  }

  function handleMapClick(lat: number, lng: number) {
    if (!selected) return;
    const updated = { ...selected, latitude: lat, longitude: lng };
    setSelected(updated);
    onChange?.(updated);
  }

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: "400px" }}>
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setSelected(null);
        }}
        placeholder="Rechercher une adresse..."
        style={{ width: "100%", padding: "8px", border: "1px solid #999", borderRadius: "4px" }}
      />

      {isLoading && <p>Recherche en cours...</p>}

      {results.length > 0 && !selected && (
        <ul
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            border: "1px solid #ccc",
            position: "absolute",
            width: "100%",
            background: "white",
            zIndex: 10,
          }}
        >
          {results.map((result, index) => (
            <li
              key={index}
              onClick={() => handleSelect(result)}
              style={{ padding: "8px", cursor: "pointer", borderBottom: "1px solid #eee" }}
            >
              {result.adresse || result.ville}
            </li>
          ))}
        </ul>
      )}

      {selected && (
        <div style={{ marginTop: "12px" }}>
          <p style={{ fontSize: "14px", color: "green" }}>
            Sélectionné : {selected.ville} ({selected.latitude.toFixed(5)}, {selected.longitude.toFixed(5)})
          </p>
          <LocalisationMap
            latitude={selected.latitude}
            longitude={selected.longitude}
            onPositionChange={handleMapClick}
          />
        </div>
      )}
    </div>
  );
}