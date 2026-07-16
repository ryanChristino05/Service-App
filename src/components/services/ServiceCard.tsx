import Link from "next/link";
import { MapPin, Star } from "lucide-react";
import { getCategoryStyle } from "@/lib/category-colors";
import { getAverageRating } from "@/lib/rating";
type ServiceCardProps = {
  id: number;
  titre: string;
  description: string | null;
  categorie: { nom: string };
  localisation: { ville: string };
  prestataire: { nom: string; prenom: string | null; photo_profil: string | null };
  images: { url_image: string }[];
  feedbacks: { note: number | null }[];
};

function getInitials(nom: string, prenom: string | null) {
  const first = prenom?.[0] ?? nom[0];
  const second = prenom ? nom[0] : "";
  return (first + second).toUpperCase();
}



function CategoryBadge({ nom, overlay }: { nom: string; overlay: boolean }) {
  const style = getCategoryStyle(nom);
  return (
    <span
      className={`${overlay ? "absolute top-2 left-3" : "inline-block"} rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest shadow-sm`}
      style={{ backgroundColor: style.bg, color: style.text }}
    >
      {nom}
    </span>
  );
}

export default function ServiceCard({
  id,
  titre,
  description,
  categorie,
  localisation,
  prestataire,
  images,
  feedbacks,
}: ServiceCardProps) {
  const coverImage = images[0]?.url_image;
  const displayName = prestataire.prenom ? `${prestataire.prenom} ${prestataire.nom}` : prestataire.nom;
  const rating = getAverageRating(feedbacks);

  return (
    <Link
      href={`/services/${id}`}
      className="group block overflow-hidden rounded-lg border border-[#241F1A]/10 bg-white transition hover:-translate-y-0.5 hover:shadow-md"
    >
      {/* Image + badge en overlay — uniquement si une photo existe */}
      {coverImage && (
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={coverImage} alt={titre} className="h-40 w-full object-cover" />
          <CategoryBadge nom={categorie.nom} overlay />
        </div>
      )}

      <div className="p-4">
        {/* Badge dans le flux normal si pas d'image */}
        {!coverImage && (
          <div className="mb-2.5">
            <CategoryBadge nom={categorie.nom} overlay={false} />
          </div>
        )}

        <div className="flex items-center gap-2">
          {prestataire.photo_profil ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={prestataire.photo_profil}
              alt={displayName}
              className="h-6 w-6 shrink-0 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#6B5A4E] text-[9px] font-bold text-white">
              {getInitials(prestataire.nom, prestataire.prenom)}
            </div>
          )}
          <span className="text-xs text-[#241F1A]/60">{displayName}</span>
        </div>

        <h3 className="mt-1.5 text-base font-bold text-[#241F1A] group-hover:underline">
          {titre}
        </h3>

        {description && (
          <p className="mt-2 line-clamp-2 text-sm text-[#8A8478]">{description}</p>
        )}

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-[#241F1A]/50">
            <MapPin className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
            <span>{localisation.ville}</span>
          </div>

          {rating && (
            <div className="flex items-center gap-1 text-xs font-medium text-[#241F1A]/70">
              <Star className="h-3.5 w-3.5 fill-[#C68A1F] text-[#C68A1F]" />
              <span>{rating.avg}</span>
              <span className="text-[#241F1A]/40">({rating.count})</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}