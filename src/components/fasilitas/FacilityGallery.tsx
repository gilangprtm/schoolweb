"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { FacilityPhoto } from "@/types";

interface FacilityGalleryProps {
  photos: FacilityPhoto[];
}

export default function FacilityGallery({ photos }: FacilityGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<FacilityPhoto | null>(null);

  if (photos.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo) => (
          <button
            key={photo.id}
            onClick={() => setSelectedPhoto(photo)}
            className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <Image
              src={photo.url}
              alt={photo.caption || "Foto fasilitas"}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            {photo.caption && (
              <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-xs">{photo.caption}</p>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Simple Lightbox */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-4 right-4 size-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors text-xl"
          >
            ✕
          </button>
          <div
            className="relative w-full max-w-4xl aspect-[4/3]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selectedPhoto.url}
              alt={selectedPhoto.caption || "Foto fasilitas"}
              fill
              className="object-contain rounded-lg"
              sizes="90vw"
            />
          </div>
          {selectedPhoto.caption && (
            <p className="absolute bottom-6 text-white/80 text-sm text-center max-w-lg">
              {selectedPhoto.caption}
            </p>
          )}
        </div>
      )}
    </>
  );
}
