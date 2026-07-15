import type { LocalisationResult } from "@/types/localisation";

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search";
const USER_AGENT = "EseraApp/1.0 (projet academique L3 - contact: ton-email@exemple.com)";

let lastCallTimestamp = 0;
const MIN_INTERVAL_MS = 1100;

async function throttle() {
  const now = Date.now();
  const elapsed = now - lastCallTimestamp;
  if (elapsed < MIN_INTERVAL_MS) {
    await new Promise((resolve) => setTimeout(resolve, MIN_INTERVAL_MS - elapsed));
  }
  lastCallTimestamp = Date.now();
}

export interface NominatimAddress {
  city?: string;
  town?: string;
  village?: string;
  suburb?: string;
  neighbourhood?: string;
}

export interface NominatimItem {
  lat: string;
  lon: string;
  display_name: string;
  address?: NominatimAddress;
}

export async function searchAddress(query: string): Promise<LocalisationResult[]> {
  if (!query || query.trim().length === 0) return [];

  await throttle();

  const url = new URL(NOMINATIM_BASE_URL);
  url.searchParams.set("q", query);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("limit", "5");

  const response = await fetch(url.toString(), {
    headers: { "User-Agent": USER_AGENT },
  });

  if (!response.ok) {
    throw new Error(`Nominatim a répondu avec le statut ${response.status}`);
  }

  const data = (await response.json()) as NominatimItem[];

  return data.map((item) => ({
    latitude: parseFloat(item.lat),
    longitude: parseFloat(item.lon),
    ville:
      item.address?.city ||
      item.address?.town ||
      item.address?.village ||
      item.display_name.split(",")[0],
    quartier: item.address?.suburb || item.address?.neighbourhood || undefined,
    adresse: item.display_name,
  }));
}