"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Loader2 } from "lucide-react";
import ServiceCard, { MockService } from "@/components/ui/ServiceCard";

type RawSearchResult = {
  id: number;
  titre: string;
  categorie: { nom: string } | null;
  localisation: { ville: string; quartier: string | null } | null;
  images: { url_image: string; ordre: number | null }[];
  prestataire: { nom: string; prenom: string | null };
};

function mapToServiceCard(s: RawSearchResult): MockService {
  return {
    id: s.id,
    titre: s.titre,
    categorie: s.categorie?.nom ?? "Autre",
    ville: s.localisation?.ville ?? "",
    quartier: s.localisation?.quartier ?? "",
    image: s.images[0]?.url_image ?? "/placeholder-service.jpg",
    prestataire: `${s.prestataire.prenom ?? ""} ${s.prestataire.nom}`.trim(),
    noteMoyenne: null,
  };
}

export default function HomeSearch({ defaultServices }: { defaultServices: MockService[] }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MockService[] | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) {
      setResults(null);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data: RawSearchResult[] = await res.json();
      setResults(data.map(mapToServiceCard));
    } catch (err) {
      console.error(err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  function clearSearch() {
    setQuery("");
    setResults(null);
  }

  const displayed = results ?? defaultServices;
  const isSearching = results !== null;

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-8 flex max-w-lg flex-1 items-center overflow-hidden rounded-full bg-white pl-5 shadow-lg"
      >
        <Search className="h-4 w-4 shrink-0 text-[var(--ink)]/40" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un service (ex: plombier)"
          className="flex-1 bg-transparent px-3 py-3 text-sm text-[var(--ink)] outline-none placeholder:text-[var(--ink)]/40"
        />
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-1.5 whitespace-nowrap bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--brand-900)] transition hover:brightness-95 disabled:opacity-60"
        >
          {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          Rechercher
        </button>
      </form>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="font-[var(--font-display)] text-2xl font-semibold text-[var(--ink)]">
            {isSearching ? `Résultats pour « ${query} »` : "Services à proximité"}
          </h2>
          {isSearching ? (
            <button
              onClick={clearSearch}
              className="rounded-full border border-[var(--line)] px-4 py-2 text-sm font-medium text-[var(--ink)]/70 transition hover:border-[var(--accent)]"
            >
              Réinitialiser
            </button>
          ) : (
            <Link
              href="/services"
              className="rounded-full border border-[var(--line)] px-4 py-2 text-sm font-medium text-[var(--ink)]/70 transition hover:border-[var(--accent)]"
            >
              Voir tout
            </Link>
          )}
        </div>

        {displayed.length === 0 ? (
          <p className="rounded-xl border border-dashed border-[var(--line)] p-8 text-center text-sm text-[var(--ink)]/50">
            {isSearching ? "Aucun résultat pour cette recherche." : "Aucun service disponible pour l'instant."}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {displayed.map((service) => (
              <Link key={service.id} href={`/services/${service.id}`}>
                <ServiceCard service={service} />
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}