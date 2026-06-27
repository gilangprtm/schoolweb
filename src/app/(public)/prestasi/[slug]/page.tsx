import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal";
import Breadcrumb from "@/components/shared/Breadcrumb";
import Badge from "@/components/shared/Badge";
import ImageWithFallback from "@/components/shared/ImageWithFallback";
import { getAchievementBySlug, getPublishedAchievements } from "@/data/achievements";
import { getChampionEmoji, formatLevel, formatDate, getLevelBadgeColor } from "@/lib/utils";

export default async function AchievementDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const achievement = getAchievementBySlug(slug);

  if (!achievement) {
    notFound();
  }

  const related = getPublishedAchievements()
    .filter((a) => a.id !== achievement.id)
    .slice(0, 3);

  return (
    <article>
      <section className="relative min-h-[30vh] flex items-end bg-neutral-900">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-800 to-primary-900" />
        <div className="container-custom relative z-10 py-14 pt-24">
          <Breadcrumb
            items={[{ label: "Prestasi", href: "/prestasi" }, { label: achievement.title }]}
            className="text-white/70 mb-3"
          />
          <span className="inline-block text-5xl mb-4">
            {getChampionEmoji(achievement.champion)}
          </span>
          <h1 className="font-heading text-2xl md:text-4xl font-bold text-white mb-3 leading-tight">
            {achievement.title}
          </h1>
          <div className="flex flex-wrap gap-2">
            <Badge
              label={formatLevel(achievement.level)}
              variant="outline"
              className="bg-white/20 text-white border-white/20"
            />
            <Badge
              label={achievement.category === "student" ? "Siswa" : achievement.category === "teacher" ? "Guru" : "Sekolah"}
              variant="outline"
              className="bg-white/20 text-white border-white/20"
            />
          </div>
        </div>
      </section>

      <section className="section-py bg-white">
        <div className="container-custom max-w-3xl">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Photo */}
            <div className="md:col-span-1">
              {achievement.image_url ? (
                <ImageWithFallback
                  src={achievement.image_url}
                  alt={achievement.title}
                  aspect="3/4"
                  rounded="rounded-2xl"
                  className="shadow-lg"
                />
              ) : (
                <div className="aspect-[3/4] rounded-2xl bg-neutral-100 flex items-center justify-center text-7xl">
                  {getChampionEmoji(achievement.champion)}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="md:col-span-2 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <InfoBox label="Kategori" value={
                  achievement.category === "student" ? "Siswa" : achievement.category === "teacher" ? "Guru" : "Sekolah"
                } />
                <InfoBox label="Tingkat" value={formatLevel(achievement.level)} />
                <InfoBox label="Peringkat" value={getChampionEmoji(achievement.champion) + " " + achievement.champion === "1" ? "Juara 1" : achievement.champion} />
                <InfoBox label="Tanggal" value={formatDate(achievement.date)} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-1">Penyelenggara</h4>
                <p className="text-neutral-800">{achievement.organizer}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <ScrollReveal>
            <div className="prose-content">{achievement.description}</div>
          </ScrollReveal>

          <div className="mt-10 pt-6 border-t border-neutral-200">
            <Link href="/prestasi" className="inline-flex items-center gap-2 text-primary hover:text-primary-700 text-sm font-medium transition-colors">
              <ArrowLeft className="size-4" />
              Kembali ke Prestasi
            </Link>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section-py bg-neutral-50 -mt-8">
          <div className="container-custom">
            <h2 className="font-heading text-2xl font-bold text-neutral-800 mb-8 text-left">Prestasi Lainnya</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl mx-auto">
              {related.map((r, i) => (
                <ScrollReveal key={r.id} delay={i * 0.1}>
                  <Link href={`/prestasi/${r.slug}`} className="group block bg-white rounded-xl p-4 shadow-card hover:shadow-card-hover transition-all">
                    <span className="text-3xl">{getChampionEmoji(r.champion)}</span>
                    <h3 className="font-heading font-semibold text-neutral-800 text-sm mt-2 line-clamp-2 group-hover:text-primary transition-colors">{r.title}</h3>
                    <Badge label={formatLevel(r.level)} variant="outline" className={getLevelBadgeColor(r.level) + " mt-2"} />
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-neutral-50 rounded-xl p-3">
      <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-0.5">{label}</h4>
      <p className="text-neutral-800 font-medium">{value}</p>
    </div>
  );
}
