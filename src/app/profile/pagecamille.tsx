import { prisma } from "@/lib/prisma";
import Link from "next/link";

// TODO: remplacer par la vraie récupération de session
const CURRENT_USER_ID = 1;

export default async function ProfilePage() {
  const user = await prisma.user.findUnique({
    where: { id: CURRENT_USER_ID },
    include: { localisation: true },
  });

  if (!user) {
    return <p>Utilisateur introuvable.</p>;
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Mon profil</h1>

      {user.photo_profil && (
        <img
          src={user.photo_profil}
          alt="Photo de profil"
          className="w-24 h-24 rounded-full mb-4 object-cover"
        />
      )}

      <div className="space-y-2">
        <p><strong>Nom :</strong> {user.nom}</p>
        <p><strong>Prénom :</strong> {user.prenom ?? "-"}</p>
        <p><strong>Email :</strong> {user.email}</p>
        <p><strong>Téléphone :</strong> {user.telephone ?? "-"}</p>
        <p><strong>Bio :</strong> {user.bio ?? "-"}</p>
        <p><strong>Rôle :</strong> {user.role}</p>
        <p><strong>Localisation :</strong> {user.localisation.ville}</p>
      </div>

      <Link
        href="/profile/edit"
        className="inline-block mt-6 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Modifier les informations
      </Link>
    </div>
  );
}