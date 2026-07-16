// src/lib/prisma.ts (ou équivalent)
import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client"; // ajuste le chemin selon ton `output` dans schema.prisma

const adapter = new PrismaMariaDb({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "", // vide, cohérent avec ton .env actuel (pas de password)
  database: "db_services",
  connectionLimit: 5,
});

export const prisma = new PrismaClient({ adapter });