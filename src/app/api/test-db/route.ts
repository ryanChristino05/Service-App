import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const users = await prisma.users.findMany();

    return Response.json(users);

  } catch (error) {
    console.error(error);

    return Response.json(
      {
        message: "Erreur connexion base de données"
      },
      {
        status: 500
      }
    );
  }
}