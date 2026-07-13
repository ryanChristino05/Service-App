export type Role = "VISITEUR" | "STANDARD" | "PRESTATAIRE";

export const CURRENT_USER_ROLE: Role = "PRESTATAIRE"; // correspond à Paul (PRESTATAIRE) dans le seed

// TODO: remplacer par la vraie session utilisateur une fois l'auth branchée
export const CURRENT_USER_ID = 2; // correspond à Paul (PRESTATAIRE) dans le seed

export const CURRENT_USER = {
  name: "Rota Andriamanana",
  email: "rota@example.mg",
  initials: "RA",
};