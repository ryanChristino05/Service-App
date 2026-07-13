import type { MockService } from "@/components/ui/ServiceCard";

export const mockServices: MockService[] = [
  {
    id: 1,
    titre: "Réparation plomberie à domicile",
    categorie: "Plomberie",
    ville: "Antananarivo",
    quartier: "Analakely",
    image: "https://images.unsplash.com/photo-1607472829760-a1c0a3d6b1e1?w=600",
    prestataire: "Rakoto J.",
    noteMoyenne: 4.6,
  },
  {
    id: 2,
    titre: "Cours particuliers de mathématiques",
    categorie: "Éducation",
    ville: "Antananarivo",
    quartier: "Ankorondrano",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600",
    prestataire: "Miora R.",
    noteMoyenne: 4.9,
  },
  {
    id: 3,
    titre: "Coiffure et soins à domicile",
    categorie: "Beauté",
    ville: "Antananarivo",
    quartier: "Ivandry",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600",
    prestataire: "Hery N.",
    noteMoyenne: null,
  },
];