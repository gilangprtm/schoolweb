"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import MiniHeroBanner from "@/components/shared/MiniHeroBanner";
import FilterPills from "@/components/shared/FilterPills";
import ScrollReveal from "@/components/shared/ScrollReveal";
import Badge from "@/components/shared/Badge";
import ImageWithFallback from "@/components/shared/ImageWithFallback";
import EmptyState from "@/components/shared/EmptyState";
import { getFacilities } from "@/lib/actions/facilities";
import { getFacilityIcon, getFacilityCategoryLabel } from "@/lib/utils";
import type { Facility, FacilityCategory } from "@/types";

const CATEGORY_FILTERS = [
  { label: "Semua", value: "all" },
  { label: "📚 Akademik", value: "akademik" },
  { label: "⚽ Olahraga", value: "olahraga" },
  { label: "🎨 Seni", value: "seni" },
  { label: "🕌 Ibadah", value: "ibadah" },
  { label: "💻 Teknologi", value: "teknologi" },
  { label: "🏫 Lainnya", value: "lainnya" },
];

export default function FasilitasPage() {
  const [category, setCategory] = useState("all");
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFacilities({ limit: 100 })
      .then((res) => setFacilities(res.data as Facility[]))
      .catch(() => setFacilities([]))
      .finally(() => setLoading(false));
  }, []);

  let filtered = facilities;
  if (category !== "all") {
    filtered = filtered.filter((f) => f.category === category);
  }

  return (
    <>
      <MiniHeroBanner
        title="Fasilitas Sekolah"
        subtitle="Sarana dan prasarana modern yang mendukung kegiatan belajar mengajar"
        breadcrumb={[{ label: "Fasilitas" }]}
      />
      <section className="section-py bg-white">
        <div className="container-custom">
          <div className="mb-8">
            <FilterPills
              items={CATEGORY_FILTERS}
              activeItem={category}
              onChange={setCategory}
            />
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-2xl bg-neutral-100 animate-pulse aspect-[4/3]" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              title="Belum ada fasilitas"
              description="Fasilitas dalam kategori ini belum tersedia"
            />
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((facility, index) => (
                  <motion.div
                    key={facility.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.03 }}
                  >
                    <Link
                      href={`/fasilitas/${facility.slug}`}
                      className="group block bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow duration-300 hover:-translate-y-1 border border-neutral-100"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
                        <ImageWithFallback
                          src={facility.photoUrl}
                          alt={facility.name}
                          aspect="4/3"
                          rounded="rounded-none"
                          className="group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-3 left-3">
                          <Badge
                            label={`${getFacilityIcon(facility.category as FacilityCategory)} ${getFacilityCategoryLabel(facility.category as FacilityCategory)}`}
                            variant="outline"
                            className="bg-white/90 border-0"
                          />
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-heading font-semibold text-neutral-800 group-hover:text-primary transition-colors">
                          {facility.name}
                        </h3>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}
