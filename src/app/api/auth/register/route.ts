import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const localisationSchema = z.object({
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
  ville: z.string().min(1, "La ville est requise."),
  quartier: z.string().optional(),
  adresse: z.string().optional(),
});

const registerSchema = z.object({
  nom: z.string().min(1, "Le nom est requis."),
  prenom: z.string().min(1, "Le prénom est requis."),
  email: z.string().email("Email invalide."),
  mot_de_passe: z.string().min(8, "Le mot de passe doit faire au moins 8 caractères."),
  localisation: localisationSchema,
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Corps de requête invalide." },
      { status: 400 }
    );
  }

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const { nom, prenom, email, mot_de_passe, localisation } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { message: "Un compte existe déjà avec cet email." },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(mot_de_passe, 12);

  const user = await prisma.$transaction(async (tx) => {
    const createdLocation = await tx.localisation.create({
      data: {
        latitude: localisation.latitude,
        longitude: localisation.longitude,
        ville: localisation.ville,
        quartier: localisation.quartier,
        adresse: localisation.adresse,
      },
    });

    return tx.user.create({
      data: {
        nom,
        prenom,
        email,
        mot_de_passe: passwordHash,
        localisation_id: createdLocation.id,
      },
      select: {
        id: true,
        nom: true,
        prenom: true,
        email: true,
      },
    });
  });

  return NextResponse.json(
    { message: "Compte créé avec succès.", user },
    { status: 201 }
  );
}