"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ScrollReveal from "@/components/shared/ScrollReveal";
import { getPageBySlug } from "@/data/pages";

export default function ProfilTabs() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tab = searchParams.get("tab") || "visi-misi";

  const visiMisi = getPageBySlug("visi-misi");
  const sejarah = getPageBySlug("sejarah");

  const handleTabChange = (value: string) => {
    router.push(`/profil?tab=${value}`, { scroll: false });
  };

  return (
    <ScrollReveal>
      <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="w-full flex rounded-xl bg-neutral-100 p-1 mb-8">
          <TabsTrigger value="visi-misi" className="flex-1 rounded-lg text-sm">
            Visi & Misi
          </TabsTrigger>
          <TabsTrigger value="sejarah" className="flex-1 rounded-lg text-sm">
            Sejarah
          </TabsTrigger>
          <TabsTrigger value="struktur" className="flex-1 rounded-lg text-sm">
            Struktur Organisasi
          </TabsTrigger>
        </TabsList>

        <TabsContent value="visi-misi" className="mt-0">
          {visiMisi ? (
            <div
              className="prose-content"
              dangerouslySetInnerHTML={{ __html: visiMisi.content }}
            />
          ) : (
            <p className="text-neutral-500 text-center py-10">
              Konten belum tersedia.
            </p>
          )}
        </TabsContent>

        <TabsContent value="sejarah" className="mt-0">
          {sejarah ? (
            <div
              className="prose-content"
              dangerouslySetInnerHTML={{ __html: sejarah.content }}
            />
          ) : (
            <p className="text-neutral-500 text-center py-10">
              Konten belum tersedia.
            </p>
          )}
        </TabsContent>

        <TabsContent value="struktur" className="mt-0">
          <div className="flex items-center justify-center py-10">
            <div className="text-center bg-neutral-50 rounded-2xl p-10 max-w-lg">
              <div className="text-6xl mb-4">🏛️</div>
              <h3 className="font-heading font-semibold text-neutral-700 text-lg mb-2">
                Struktur Organisasi
              </h3>
              <p className="text-neutral-500 text-sm">
                Bagan struktur organisasi sekolah dapat diakses melalui
                dashboard admin atau menghubungi bagian tata usaha.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </ScrollReveal>
  );
}
