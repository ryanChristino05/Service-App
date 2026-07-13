export type UserRole = 
  | "STANDARD"
  | "PRESTATAIRE";


export interface User {
  id: number;
  nom: string;
  prenom?: string;
  email: string;
  role: UserRole;
  photo_profil?: string | null;
  bio?: string | null;
  telephone?: string | null;
}