import { z } from "zod";

// Sous-schéma réutilisable pour une localisation saisie par l'utilisateur.
// Utilisé uniquement quand le prestataire choisit une localisation différente
// de sa localisation par défaut (Option B : toujours une nouvelle ligne, jamais de FK partagée).
export const localisationInputSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  ville: z.string().min(1).max(191),
  quartier: z.string().max(191).optional(),
  adresse: z.string().max(191).optional(),
});

export const createServiceSchema = z.object({
  titre: z.string().min(3, "Le titre doit contenir au moins 3 caractères").max(255),
  description: z.string().max(5000).optional(),
  categorie_id: z.number().int().positive(),

  // Optionnel : si absent, le service layer copie la localisation par défaut
  // du prestataire (User.localisation). Si présent, une nouvelle ligne
  // Localisation est créée avec ces valeurs.
  localisation: localisationInputSchema.optional(),

  // AUCUN champ `statut` ni `prestataire_id` ici, volontairement.
  // Le statut est toujours forcé à EN_ATTENTE côté service layer.
  // Le prestataire_id est toujours dérivé de l'utilisateur authentifié,
  // jamais accepté depuis le body client — sinon n'importe qui pourrait
  // publier un service au nom d'un autre utilisateur ou bypasser la modération.
});

export const updateServiceSchema = z.object({
  titre: z.string().min(3).max(255).optional(),
  description: z.string().max(5000).optional(),
  categorie_id: z.number().int().positive().optional(),
  localisation: localisationInputSchema.optional(),
});

// Filtres pour la liste publique (recherche/consultation)
export const serviceQuerySchema = z.object({
  categorie_id: z.coerce.number().int().positive().optional(),
  ville: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(50).default(20),
});

export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
export type ServiceQueryInput = z.infer<typeof serviceQuerySchema>;
export const updateStatusSchema = z.object({
  statut: z.enum(["VALIDE", "REFUSE"]),
});
export const createFeedbackSchema = z
  .object({
    note: z.coerce.number().int().min(1).max(5).optional(),
    commentaire: z.string().max(1000).optional(),
  })
  .refine(
    (data) => data.note !== undefined || (data.commentaire && data.commentaire.trim().length > 0),
    { message: "Il faut au moins une note ou un commentaire" }
  );
