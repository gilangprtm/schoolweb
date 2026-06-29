"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";
import MiniHeroBanner from "@/components/shared/MiniHeroBanner";
import FilterPills from "@/components/shared/FilterPills";
import ScrollReveal from "@/components/shared/ScrollReveal";
import Pagination from "@/components/shared/Pagination";
import Badge from "@/components/shared/Badge";
import ImageWithFallback from "@/components/shared/ImageWithFallback";
import EmptyState from "@/components/shared/EmptyState";
import { getAchievements } from "@/lib/actions/achievements";
import {
  getChampionEmoji,
  formatLevel,
  formatDate,
  getLevelBadgeColor,
} from "@/lib/utils";
import type { Achievement, AchievementChampion, AchievementLevel } from "@/types";

const CATEGORY_FILTERS = [
  { label: "Semua", value: "all" },
  { label: "Siswa", value: "student" },
  { label: "Guru", value: "teacher" },
  { label: "Sekolah", value: "school" },
];

const LEVEL_FILTERS = [
  { label: "Semua", value: "all" },
  { label: "Internasional", value: "internasional" },
  { label: "Nasional", value: "nasional" },
  { label: "Provinsi", value: "provinsi" },
  { label: "Kabupaten", value: "kabupaten" },
  { label: "Kecamatan", value: "kecamatan" },
];

const ITEMS_PER_PAGE = 9;

export default function PrestasiPage() {
  const [category, setCategory] = useState("all");
  const [level, setLevel] = useState("all");
  const [year, setYear] = useState("all");
  const [page, setPage] = useState(1);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAchievements({ limit: 500 })
      .then((res) => setAchievements(res.data as Achievement[]))
      .catch(() => setAchievements([]))
      .finally(() => setLoading(false));
  }, []);

  let filtered = achievements;
  if (category !== "all") filtered = filtered.filter((a) => a.category === category);
  if (level !== "all") filtered = filtered.filter((a) => a.level === level);
  if (year !== "all") filtered = filtered.filter((a) => a.date?.startsWith(year));

  const years = [
    "all",
    ...new Set(filtered.map((a) => a.date?.slice(0, 4)).filter(Boolean)),
  ].sort((a, b) => (a === "all" ? -1 : (b ?? "").localeCompare(a ?? "")));

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <>
      <MiniHeroBanner
        title="Prestasi"
        subtitle="Pencapaian gemilang siswa, guru, dan sekolah kami di berbagai tingkat"
        breadcrumb={[{ label: "Prestasi" }]}
      />
      <section className="section-py bg-white">
        <div className="container-custom">
          {/* Filters */}
          <div className="space-y-3 mb-8">
            <FilterPills
              items={CATEGORY_FILTERS}
              activeItem={category}
              onChange={(v) => { setCategory(v); setPage(1); }}
            />
            <FilterPills
              items={LEVEL_FILTERS}
              activeItem={level}
              onChange={(v) => { setLevel(v); setPage(1); }}
            />
            <select
              value={year}
              onChange={(e) => { setYear(e.target.value); setPage(1); }}
              className="px-4 py-2 rounded-full border border-neutral-200 text-sm bg-white text-neutral-700"
            >
              <option value="all">Semua Tahun</option>
              {years.filter(y => y !== "all").map((y) => (
                <option key={y} value={y!}>{y}</option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-2xl bg-neutral-100 animate-pulse aspect-video" />
              ))}
            </div>
          ) : paged.length === 0 ? (
            <EmptyState
              title="Tidak ditemukan"
              description="Belum ada prestasi yang sesuai dengan filter"
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {paged.map((achievement, index) => (
                <ScrollReveal key={achievement.id} delay={index * 0.05}>
                  <Link
                    href={`/prestasi/${achievement.slug}`}
                    className="group block bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 border border-neutral-100 h-full flex flex-col"
                  >
                    <div className="relative aspect-video bg-neutral-100 overflow-hidden flex items-center justify-center">
                      {achievement.imageUrl ? (
                        <ImageWithFallback
                          src={achievement.imageUrl}
                          alt={achievement.title}
                          aspect="16/9"
                          rounded="rounded-none"
                          className="group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <span className="text-6xl">
                          {getChampionEmoji(achievement.champion as AchievementChampion)}
                        </span>
                      )}
                      <div className="absolute top-2 left-2">
                        <span className="text-2xl">
                          {getChampionEmoji(achievement.champion as AchievementChampion)}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="font-heading font-semibold text-neutral-800 text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {achievement.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-neutral-500 text-xs mb-2">
                        <MapPin className="size-3" />
                        {achievement.organizer}
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        <Badge
                          label={formatLevel(achievement.level as AchievementLevel)}
                          variant="outline"
                          className={getLevelBadgeColor(achievement.level as AchievementLevel)}
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
                      <div className="flex items-center gap-1.5 text-neutral-400 text-xs mt-auto">
                        <CalendarDays className="size-3" />
                        {formatDate(achievement.date ?? "")}
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          )}

          <div className="mt-10">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </div>
      </section>
    </>
  );
}
