// Extraction de l'utilisateur courant via la session NextAuth réelle.

import { auth } from "@/lib/auth";

export class UnauthorizedError extends Error {
  constructor() {
    super("Authentification requise");
    this.name = "UnauthorizedError";
  }
}

export async function getCurrentUserId(request: Request): Promise<number> {
  const session = await auth();
  if (!session?.user) throw new UnauthorizedError();

  const userId = Number(session.user.id);
  if (!Number.isInteger(userId) || userId <= 0) throw new UnauthorizedError();

  return userId;
}

export class ForbiddenAdminError extends Error {
  constructor() {
    super("Accès réservé aux modérateurs");
    this.name = "ForbiddenAdminError";
  }
}

// ⚠️ TEMPORAIRE — liste d'IDs en variable d'environnement, en attendant
// un vrai rôle ADMIN dans UserRole (décision différée par l'équipe).
export function assertIsAdmin(userId: number) {
  const adminIds = (process.env.ADMIN_USER_IDS ?? "")
    .split(",")
    .map((id) => Number(id.trim()))
    .filter(Boolean);

  if (!adminIds.includes(userId)) {
    throw new ForbiddenAdminError();
  }
}