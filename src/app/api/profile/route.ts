import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const userSelect = {
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
} as const;

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }
  const currentUserId = Number(session.user.id);

  const user = await prisma.user.findUnique({
    where: { id: currentUserId },
    select: userSelect,
  });

  if (!user) {
    return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }
  const currentUserId = Number(session.user.id);

  const formData = await request.formData();

  const nom = formData.get("nom") as string | null;
  const prenom = formData.get("prenom") as string | null;
  const telephone = formData.get("telephone") as string | null;
  const bio = formData.get("bio") as string | null;
  const localisationRaw = formData.get("localisation") as string | null;
  const avatar = formData.get("avatar") as File | null;

  if (!nom || nom.trim() === "") {
    return NextResponse.json({ error: "Le nom est obligatoire" }, { status: 400 });
  }

  let photo_profil: string | undefined;

  if (avatar && avatar.size > 0) {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(avatar.type)) {
      return NextResponse.json({ error: "Format d'image non supporté (jpg, png, webp uniquement)" }, { status: 400 });
    }
    if (avatar.size > 3 * 1024 * 1024) {
      return NextResponse.json({ error: "Image trop lourde (3 Mo max)" }, { status: 400 });
    }

    const bytes = await avatar.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public", "uploads", "avatars");
    await mkdir(uploadDir, { recursive: true });

    const ext = avatar.type === "image/png" ? "png" : avatar.type === "image/webp" ? "webp" : "jpg";
    const filename = `user-${currentUserId}-${Date.now()}.${ext}`;
    await writeFile(path.join(uploadDir, filename), buffer);

    photo_profil = `/uploads/avatars/${filename}`;
  }

  let newLocalisationId: number | undefined;

  if (localisationRaw) {
    try {
      const loc = JSON.parse(localisationRaw) as {
        latitude: number;
        longitude: number;
        ville: string;
        quartier?: string;
        adresse?: string;
      };

      const created = await prisma.localisation.create({
        data: {
          latitude: loc.latitude,
          longitude: loc.longitude,
          ville: loc.ville,
          quartier: loc.quartier || null,
          adresse: loc.adresse || null,
        },
      });

      newLocalisationId = created.id;
    } catch {
      return NextResponse.json({ error: "Localisation invalide" }, { status: 400 });
    }
  }

  try {
    const user = await prisma.user.update({
      where: { id: currentUserId },
      data: {
        nom: nom.trim(),
        prenom: prenom?.trim() || null,
        telephone: telephone?.trim() || null,
        bio: bio?.trim() || null,
        ...(newLocalisationId ? { localisation_id: newLocalisationId } : {}),
        ...(photo_profil ? { photo_profil } : {}),
      },
      select: userSelect,
    });

    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: "Impossible de mettre à jour le profil" }, { status: 500 });
  }
}