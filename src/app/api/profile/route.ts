import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";
import { CURRENT_USER_ID } from "@/lib/mock-session";

export async function GET() {
  const user = await prisma.user.findUnique({
    where: { id: CURRENT_USER_ID },
    include: { localisation: true },
  });

  if (!user) {
    return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PUT(request: Request) {
  const formData = await request.formData();

  const nom = formData.get("nom") as string | null;
  const prenom = formData.get("prenom") as string | null;
  const telephone = formData.get("telephone") as string | null;
  const bio = formData.get("bio") as string | null;
  const localisationIdRaw = formData.get("localisation_id") as string | null;
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
    const filename = `user-${CURRENT_USER_ID}-${Date.now()}.${ext}`;
    await writeFile(path.join(uploadDir, filename), buffer);

    photo_profil = `/uploads/avatars/${filename}`;
  }

  try {
    const user = await prisma.user.update({
      where: { id: CURRENT_USER_ID },
      data: {
        nom: nom.trim(),
        prenom: prenom?.trim() || null,
        telephone: telephone?.trim() || null,
        bio: bio?.trim() || null,
        ...(localisationIdRaw ? { localisation_id: Number(localisationIdRaw) } : {}),
        ...(photo_profil ? { photo_profil } : {}),
      },
      include: { localisation: true },
    });

    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: "Impossible de mettre à jour le profil" }, { status: 500 });
  }
}