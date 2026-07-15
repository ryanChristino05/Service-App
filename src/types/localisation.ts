export interface LocalisationResult {
  latitude: number;
  longitude: number;
  ville: string;
  quartier?: string;
  adresse?: string;
}

const MAX_FIELD_LENGTH = 191;

/** Tronque les champs texte pour respecter le schéma Zod / VarChar(191) en base. */
export function toLocalisationInput(result: LocalisationResult) {
  return {
    latitude: result.latitude,
    longitude: result.longitude,
    ville: result.ville.slice(0, MAX_FIELD_LENGTH),
    quartier: result.quartier?.slice(0, MAX_FIELD_LENGTH),
    adresse: result.adresse?.slice(0, MAX_FIELD_LENGTH),
  };
}