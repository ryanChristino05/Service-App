// src/components/localisation/LocalisationMap.tsx
"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
// @ts-ignore
import "leaflet/dist/leaflet.css";

// Correctif standard : les icônes par défaut de Leaflet ne se chargent pas
// correctement avec le bundler de Next.js. On les redéfinit explicitement.
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface LocalisationMapProps {
  latitude: number;
  longitude: number;
  onPositionChange: (lat: number, lng: number) => void;
}

function ClickHandler({
  onPositionChange,
}: {
  onPositionChange: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onPositionChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function LocalisationMap({
  latitude,
  longitude,
  onPositionChange,
}: LocalisationMapProps) {
  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={13}
      style={{ height: "300px", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[latitude, longitude]} icon={defaultIcon} />
      <ClickHandler onPositionChange={onPositionChange} />
    </MapContainer>
  );
}