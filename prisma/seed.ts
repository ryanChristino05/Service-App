import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const adapter = new PrismaMariaDb({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "db_services",
  connectionLimit: 5,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  // 1. Localisations — doit être créé AVANT users (FK)
  await prisma.localisation.createMany({
    data: [
      { latitude: 18.8792, longitude: 47.5079, ville: "Antananarivo", quartier: "Analakely", adresse: "Rue Ratsimilaho, Analakely" },
      { latitude: 18.9137, longitude: 47.5361, ville: "Antananarivo", quartier: "Ivandry", adresse: "Lot II M 14 Ivandry" },
      { latitude: 18.9333, longitude: 47.5216, ville: "Antananarivo", quartier: "Andoharanofotsy", adresse: "Route Nationale 7, Andoharanofotsy" },
      { latitude: 19.8667, longitude: 47.0333, ville: "Antsirabe", quartier: "Centre-ville", adresse: "Avenue de l'Indépendance, Antsirabe" },
      { latitude: 18.15, longitude: 49.4, ville: "Toamasina", quartier: "Tanambao", adresse: "Boulevard Joffre, Tanambao" },
    ],
  });

  // 2. Catégories
  await prisma.categorie.createMany({
    data: [
      { nom: "Plomberie", description: "Installation, réparation et entretien de plomberie", icone: "Wrench" },
      { nom: "Éducation", description: "Cours particuliers et soutien scolaire", icone: "GraduationCap" },
      { nom: "Beauté", description: "Coiffure, esthétique et soins à domicile", icone: "Sparkles" },
      { nom: "Transport", description: "Chauffeurs et services de transport local", icone: "Car" },
    ],
  });

  // 3. Users
  await prisma.user.createMany({
    data: [
      {
        nom: "Rasoanaivo",
        prenom: "Jean",
        email: "jean.client@test.com",
        mot_de_passe: "password_test",
        role: "STANDARD",
        bio: "Client à la recherche de services",
        telephone: "0340000001",
        localisation_id: 1,
      },
      {
        nom: "Rakoto",
        prenom: "Paul",
        email: "paul.plombier@test.com",
        mot_de_passe: "password_test",
        role: "PRESTATAIRE",
        bio: "Prestataire de services",
        telephone: "0340000002",
        localisation_id: 2,
      },
    ],
  });

  // 4. Annonces — référence demandeur_id (user STANDARD), categorie_id, localisation_id
  await prisma.annonce.createMany({
    data: [
      {
        demandeur_id: 1,
        categorie_id: 1,
        localisation_id: 1,
        titre: "Fuite d'eau urgente dans la cuisine",
        description: "J'ai une fuite sous l'évier depuis ce matin, besoin d'un plombier rapidement.",
        statut: "ACTIVE",
        date_expiration: new Date("2026-08-15"),
      },
      {
        demandeur_id: 1,
        categorie_id: 2,
        localisation_id: 2,
        titre: "Cours de soutien en mathématiques niveau collège",
        description: "Recherche professeur pour cours particuliers, 2 fois par semaine.",
        statut: "EN_COURS",
        date_expiration: new Date("2026-09-01"),
      },
      {
        demandeur_id: 1,
        categorie_id: 3,
        localisation_id: 3,
        titre: "Coiffeuse à domicile pour un mariage",
        description: "Besoin d'une coiffeuse professionnelle pour un mariage le mois prochain.",
        statut: "RESOLUE",
        date_expiration: new Date("2026-07-20"),
      },
      {
        demandeur_id: 1,
        categorie_id: 4,
        localisation_id: 4,
        titre: "Chauffeur pour trajet Antsirabe - Antananarivo",
        description: "Recherche chauffeur disponible ce weekend, aller simple.",
        statut: "EXPIREE",
        date_expiration: new Date("2026-06-30"),
      },
    ],
  });
  // 5. Services — référence prestataire_id (user PRESTATAIRE), categorie_id, localisation_id
  // 5. Services — référence prestataire_id (user PRESTATAIRE), categorie_id, localisation_id
  const service1 = await prisma.service.create({
    data: {
      prestataire_id: 2,
      categorie_id: 1, // Plomberie
      localisation_id: 2, // Ivandry
      titre: "Réparation et installation de plomberie",
      description:
        "Plombier expérimenté, disponible pour dépannage rapide et installations neuves.",
      statut: "VALIDE",
    },
  });

  const service2 = await prisma.service.create({
    data: {
      prestataire_id: 2,
      categorie_id: 4, // Transport
      localisation_id: 2, // Ivandry
      titre: "Service de chauffeur privé",
      description: "Trajets urbains et interurbains, véhicule climatisé.",
      statut: "EN_ATTENTE",
    },
  });

  // 6. Images des services — référence service_id (dépend des services créés juste au-dessus)
  await prisma.serviceImage.createMany({
    data: [
      { service_id: service1.id, url_image: "https://picsum.photos/seed/plomberie1/600/400", ordre: 1 },
    { service_id: service1.id, url_image: "https://picsum.photos/seed/plomberie2/600/400", ordre: 2 },
    { service_id: service2.id, url_image: "https://picsum.photos/seed/transport1/600/400", ordre: 1 },
    ],
  });
}

main()
  .then(() => console.log("Seed terminé"))
  .catch(console.error)
  .finally(() => prisma.$disconnect());