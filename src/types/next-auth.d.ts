import { UserRole } from "@prisma/client";

declare module "next-auth" {
  interface User {
    id: string;
    nom: string;
    prenom: string | null;
    role: UserRole;
  }

  interface Session {
    user: {
      id: string;
      nom: string;
      prenom: string | null;
      role: UserRole;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    nom: string;
    prenom: string | null;
    role: UserRole;
  }
}