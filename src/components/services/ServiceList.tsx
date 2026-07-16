import ServiceCard from "./ServiceCard";

type Service = {
  id: number;
  titre: string;
  description: string | null;
  categorie: { nom: string };
  localisation: { ville: string };
  prestataire: { nom: string; prenom: string | null; photo_profil: string | null }
  images: { url_image: string }[];
  feedbacks: { note: number | null }[];
};

export default function ServiceList({ services }: { services: Service[] }) {
  if (services.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-neutral-300 py-16 text-center">
        <p className="text-sm font-medium text-neutral-700">Aucun service pour l'instant</p>
        <p className="mt-1 text-sm text-neutral-500">
          Les services publiés apparaîtront ici une fois validés.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => (
        <ServiceCard key={service.id} {...service} />
      ))}
    </div>
  );
}