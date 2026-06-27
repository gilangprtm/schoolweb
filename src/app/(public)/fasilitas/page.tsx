"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import MiniHeroBanner from "@/components/shared/MiniHeroBanner";
import FilterPills from "@/components/shared/FilterPills";
import ScrollReveal from "@/components/shared/ScrollReveal";
import Badge from "@/components/shared/Badge";
import ImageWithFallback from "@/components/shared/ImageWithFallback";
import EmptyState from "@/components/shared/EmptyState";
import { getPublishedFacilities } from "@/data/facilities";
import { getFacilityIcon, getFacilityCategoryLabel } from "@/lib/utils";
import type { FacilityCategory } from "@/types";

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

  let facilities = getPublishedFacilities();
  if (category !== "all") {
    facilities = facilities.filter((f) => f.category === category);
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

          {facilities.length === 0 ? (
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
                {facilities.map((facility, index) => (
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
                          src={facility.photo_url}
                          alt={facility.name}
                          aspect="4/3"
                          rounded="rounded-none"
                          className="group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-3 left-3">
                          <Badge
                            label={`${getFacilityIcon(facility.category)} ${getFacilityCategoryLabel(facility.category)}`}
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
