import MiniHeroBanner from "@/components/shared/MiniHeroBanner";
import NewsGrid from "@/components/berita/NewsGrid";

export default function BeritaPage() {
  return (
    <>
      <MiniHeroBanner
        title="Berita & Pengumuman"
        subtitle="Kabar dan informasi terkini dari SMP Negeri 17 Denpasar"
        breadcrumb={[{ label: "Berita" }]}
      />
      <NewsGrid />
    </>
  );
}
