import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import ProfileEditor from "@/components/profile/ProfileEditor";
import type { User } from "@/generated/prisma/client";

export const metadata: Metadata = {
  title: "Mon profil | Local Services",
};

type UserForForm = Pick<
  User,
  "nom" | "prenom" | "telephone" | "bio" | "photo_profil" | "localisation_id"
>;

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const currentUserId = Number(session.user.id);

  const [user, localisations] = await Promise.all([
    prisma.user.findUnique({
      where: { id: currentUserId },
      select: {
        id: true,
        nom: true,
        prenom: true,
        email: true,
        telephone: true,
        bio: true,
        photo_profil: true,
        role: true,
        localisation_id: true,
        date_creation: true,
        date_modification: true,
        localisation: {
          select: { id: true, ville: true, quartier: true, adresse: true },
        },
      },
    }),
    prisma.localisation.findMany({
      select: { id: true, ville: true, quartier: true },
      orderBy: { ville: "asc" },
    }),
  ]);

  if (!user) {
    notFound();
  }

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
      <ProfileEditor user={user} userForForm={userForForm} localisations={localisations} />
    </section>
  );
}