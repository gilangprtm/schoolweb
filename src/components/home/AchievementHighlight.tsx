import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal";
import SectionHeading from "@/components/shared/SectionHeading";
import Badge from "@/components/shared/Badge";
import ImageWithFallback from "@/components/shared/ImageWithFallback";
import EmptyState from "@/components/shared/EmptyState";
import { getFeaturedAchievements } from "@/data/achievements";
import { getChampionEmoji, formatLevel, truncate } from "@/lib/utils";

export default function AchievementHighlight() {
  const achievements = getFeaturedAchievements().slice(0, 4);

  return (
    <section className="section-py bg-primary-light">
      <div className="container-custom">
        <ScrollReveal>
          <SectionHeading
            title="Prestasi Membanggakan"
            subtitle="Siswa dan guru kami terus mengukir prestasi di berbagai tingkat kompetisi"
          />
        </ScrollReveal>

        {achievements.length === 0 ? (
          <EmptyState
            title="Belum ada prestasi"
            description="Prestasi terbaru akan ditampilkan di sini"
            action={{ label: "Lihat Semua Prestasi", href: "/prestasi" }}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {achievements.map((achievement, index) => (
              <ScrollReveal key={achievement.id} delay={index * 0.1}>
                <Link
                  href={`/prestasi/${achievement.slug}`}
                  className="group block bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative aspect-[4/3] bg-neutral-100 overflow-hidden">
                    <span className="absolute top-3 left-3 z-10 text-4xl drop-shadow-md">
                      {getChampionEmoji(achievement.champion)}
                    </span>
                    {achievement.image_url ? (
                      <ImageWithFallback
                        src={achievement.image_url}
                        alt={achievement.title}
                        aspect="4/3"
                        rounded="rounded-none"
                        className="group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-6xl">
                        🏆
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-heading font-semibold text-neutral-800 text-sm mb-2 line-clamp-2 min-h-[2.5rem]">
                      {achievement.title}
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      <Badge
                        label={formatLevel(achievement.level)}
                        variant={
                          achievement.level === "nasional" ||
                          achievement.level === "internasional"
                            ? "accent"
                            : "primary"
                        }
                      />
                      <Badge
                        label={
                          achievement.category === "student"
                            ? "Siswa"
                            : achievement.category === "teacher"
                            ? "Guru"
                            : "Sekolah"
                        }
                        variant="secondary"
                      />
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        )}

        <ScrollReveal delay={0.2}>
          <div className="text-center mt-10">
            <Link
              href="/prestasi"
              className="inline-flex items-center gap-2 text-primary hover:text-primary-700 font-medium transition-colors"
            >
              Lihat Semua Prestasi
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
