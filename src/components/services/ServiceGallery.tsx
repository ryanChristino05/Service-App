"use client";

import { useState } from "react";
import { ImageIcon } from "lucide-react";

type ServiceGalleryProps = {
  images: { id: number; url_image: string }[];
  alt: string;
  compact?: boolean;
};

export default function ServiceGallery({ images, alt, compact = false }: ServiceGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) return null;

  const active = images[activeIndex];

  return (
    <div className={compact ? "mt-0" : "mt-5"}>
      <div
        className={`relative overflow-hidden rounded-xl border border-[#241F1A]/8 bg-[#F6F4EF] ${
          compact ? "h-44" : "aspect-[4/3]"
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={active.url_image}
          alt={alt}
          className={`h-full w-full ${compact ? "object-contain p-3" : "object-cover"}`}
        />
        {images.length > 1 && (
          <span className="absolute bottom-2 right-2 rounded-md bg-[#241F1A]/70 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
            {activeIndex + 1} / {images.length}
          </span>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-2 flex gap-1.5 overflow-x-auto pb-0.5">
          {images.map((img, index) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Voir l'image ${index + 1}`}
              className={`h-11 w-11 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                index === activeIndex
                  ? "border-[#241F1A] ring-1 ring-[#241F1A]/20"
                  : "border-transparent opacity-50 hover:opacity-100"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url_image} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function ServiceGalleryPlaceholder() {
  return (
    <div className="flex h-44 items-center justify-center rounded-xl border border-dashed border-[#241F1A]/15 bg-[#F6F4EF]/60">
      <div className="flex flex-col items-center gap-1.5 text-[#241F1A]/30">
        <ImageIcon className="h-6 w-6" strokeWidth={1.5} />
        <span className="text-xs">Aucune image</span>
      </div>
    </div>
  );
}
