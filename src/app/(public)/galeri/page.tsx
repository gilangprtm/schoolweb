"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import MiniHeroBanner from "@/components/shared/MiniHeroBanner";
import ScrollReveal from "@/components/shared/ScrollReveal";
import ImageWithFallback from "@/components/shared/ImageWithFallback";
import EmptyState from "@/components/shared/EmptyState";
import { getGalleries } from "@/lib/actions/galleries";
import type { Gallery, Media } from "@/types";

export default function GaleriPage() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getGalleries()
      .then((g) => setGalleries(g.map((item) => ({ ...item, type: item.type as Gallery["type"], createdAt: String(item.createdAt) }))))
      .catch(() => setGalleries([]))
      .finally(() => setLoading(false));
  }, []);

  const photoAlbums = galleries.filter((g) => g.type === "photo");
  const videoAlbums = galleries.filter((g) => g.type === "video");

  return (
    <>
      <MiniHeroBanner
        title="Galeri Foto & Video"
        subtitle="Dokumentasi kegiatan dan momen berharga di SMP Negeri 17 Denpasar"
        breadcrumb={[{ label: "Galeri" }]}
      />

      <section className="section-py bg-white">
        <div className="container-custom">
          <Tabs defaultValue="foto" className="w-full">
            <TabsList className="w-full max-w-xs flex rounded-xl bg-neutral-100 p-1 mb-10">
              <TabsTrigger value="foto" className="flex-1 rounded-lg text-sm">📷 Foto</TabsTrigger>
              <TabsTrigger value="video" className="flex-1 rounded-lg text-sm">🎬 Video</TabsTrigger>
            </TabsList>

            {/* Photo Albums */}
            <TabsContent value="foto" className="mt-0">
              {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="rounded-xl bg-neutral-100 animate-pulse aspect-[4/3]" />
                  ))}
                </div>
              ) : photoAlbums.length === 0 ? (
                <EmptyState title="Belum ada album foto" />
              ) : (
                <div className="space-y-12">
                  {photoAlbums.map((album, albumIndex) => (
                    <ScrollReveal key={album.id} delay={albumIndex * 0.1}>
                      <PhotoAlbum album={album} />
                    </ScrollReveal>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Video Albums */}
            <TabsContent value="video" className="mt-0">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="rounded-2xl p-4 bg-neutral-100 animate-pulse">
                      <div className="h-5 w-2/3 bg-neutral-200 rounded mb-3" />
                      <div className="aspect-video rounded-xl bg-neutral-200" />
                    </div>
                  ))}
                </div>
              ) : videoAlbums.length === 0 ? (
                <EmptyState title="Belum ada video" />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {videoAlbums.map((album) => (
                    <ScrollReveal key={album.id}>
                      <div className="bg-white rounded-2xl shadow-card border border-neutral-100 p-4">
                        <h3 className="font-heading font-semibold text-neutral-800 mb-3">{album.title}</h3>
                        <p className="text-neutral-500 text-xs mb-4">{album.description}</p>
                        <div className="space-y-3">
                          {album.media.map((video) => (
                            <VideoItem key={video.id} video={video} />
                          ))}
                        </div>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </>
  );
}

function PhotoAlbum({ album }: { album: Gallery }) {
  const [selectedPhoto, setSelectedPhoto] = useState<Media | null>(null);

  return (
    <div>
      <h3 className="font-heading font-bold text-xl text-neutral-800 mb-1">{album.title}</h3>
      <p className="text-neutral-500 text-sm mb-4">{album.description}</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {album.media.map((photo) => (
          <button
            key={photo.id}
            onClick={() => setSelectedPhoto(photo)}
            className="relative aspect-[4/3] rounded-xl overflow-hidden bg-neutral-100 group focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <Image
              src={photo.url}
              alt={photo.caption || `Foto ${photo.sortOrder}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            {photo.caption && (
              <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-xs truncate">{photo.caption}</p>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4" onClick={() => setSelectedPhoto(null)}>
          <button onClick={() => setSelectedPhoto(null)} className="absolute top-4 right-4 size-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors text-xl">
            ✕
          </button>
          <div className="relative w-full max-w-5xl aspect-[4/3]" onClick={(e) => e.stopPropagation()}>
            <Image src={selectedPhoto.url} alt={selectedPhoto.caption || "Foto"} fill className="object-contain rounded-lg" sizes="90vw" />
          </div>
          {selectedPhoto.caption && (
            <p className="absolute bottom-6 text-white/80 text-sm text-center max-w-lg">{selectedPhoto.caption}</p>
          )}
        </div>
      )}
    </div>
  );
}

function VideoItem({ video }: { video: Media }) {
  const [playing, setPlaying] = useState(false);

  // Extract YouTube video ID for thumbnail
  const getYouTubeId = (url: string) => {
    const match = url.match(/embed\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  };
  const youtubeId = getYouTubeId(video.url);
  const thumbnailUrl = youtubeId
    ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
    : "";

  if (playing) {
    return (
      <div className="aspect-video rounded-xl overflow-hidden bg-black">
        <iframe
          src={`${video.url}?autoplay=1`}
          width="100%"
          height="100%"
          allow="autoplay; encrypted-media"
          allowFullScreen
          className="w-full h-full"
          title={video.caption}
        />
      </div>
    );
  }

  return (
    <button
      onClick={() => setPlaying(true)}
      className="relative aspect-video rounded-xl overflow-hidden bg-neutral-100 group w-full focus:outline-none focus:ring-2 focus:ring-primary"
    >
      {thumbnailUrl && (
        <Image src={thumbnailUrl} alt={video.caption} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
      )}
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
        <div className="size-12 rounded-full bg-white/90 group-hover:bg-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
          <Play className="size-5 text-primary ml-0.5" />
        </div>
      </div>
      <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
        <p className="text-white text-xs truncate">{video.caption}</p>
      </div>
    </button>
  );
}
