import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CURRENT_USER_ID } from "@/lib/mock-session";
import ProfileCard from "@/components/profile/ProfileCard";
import ProfileForm from "@/components/profile/ProfileForm";
import type { User } from "@/generated/prisma/client";

export const metadata: Metadata = {
  title: "Mon profil | Local Services",
};
type UserForForm = Pick<
  User,
  "nom" | "prenom" | "telephone" | "bio" | "photo_profil" | "localisation_id"
>;
export default async function ProfilePage() {
  const [user, localisations] = await Promise.all([
    prisma.user.findUnique({
      where: { id: CURRENT_USER_ID },
      include: { localisation: true }, // OK ici : va vers ProfileCard (Server Component)
    }),
    prisma.localisation.findMany({
      select: { id: true, ville: true, quartier: true },
      orderBy: { ville: "asc" },
    }),
  ]);

  if (!user) {
    notFound();
  }

  // Version "plate", sans Decimal ni relation, pour le Client Component
  // Version "plate", sans Decimal ni relation, pour le Client Component
const userForForm: UserForForm = {
  nom: user.nom,
  prenom: user.prenom,
  telephone: user.telephone,
  bio: user.bio,
  photo_profil: user.photo_profil,
  localisation_id: user.localisation_id,
};

  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="mb-8 font-[var(--font-display)] text-3xl font-semibold text-[var(--ink)]">
        Mon profil
      </h1>

      <div className="grid gap-8 md:grid-cols-3">
        <div>
          <ProfileCard user={user} />
        </div>

        <div className="md:col-span-2">
          <ProfileForm user={userForForm} localisations={localisations} />
        </div>
      </div>
    </section>
  );
}