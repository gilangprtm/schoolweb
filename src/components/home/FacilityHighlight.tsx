import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal";
import SectionHeading from "@/components/shared/SectionHeading";
import Badge from "@/components/shared/Badge";
import ImageWithFallback from "@/components/shared/ImageWithFallback";
import EmptyState from "@/components/shared/EmptyState";
import { getFeaturedFacilities } from "@/data/facilities";
import { getFacilityIcon, getFacilityCategoryLabel } from "@/lib/utils";

export default function FacilityHighlight() {
  const facilities = getFeaturedFacilities().slice(0, 6);

  return (
    <section className="section-py bg-neutral-50">
      <div className="container-custom">
        <ScrollReveal>
          <SectionHeading
            title="Fasilitas Unggulan"
            subtitle="Sarana dan prasarana modern untuk mendukung proses belajar yang optimal"
          />
        </ScrollReveal>

        {facilities.length === 0 ? (
          <EmptyState
            title="Belum ada fasilitas"
            description="Fasilitas unggulan akan ditampilkan di sini"
            action={{ label: "Lihat Semua Fasilitas", href: "/fasilitas" }}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {facilities.map((facility, index) => (
              <ScrollReveal key={facility.id} delay={index * 0.1}>
                <Link
                  href={`/fasilitas/${facility.slug}`}
                  className="group block bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
                    <ImageWithFallback
                      src={facility.photo_url}
                      alt={facility.name}
                      aspect="4/3"
                      rounded="rounded-none"
                      className="group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Gradient overlay at bottom */}
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <Badge
                        label={`${getFacilityIcon(facility.category)} ${getFacilityCategoryLabel(facility.category)}`}
                        variant="outline"
                        className="bg-white/90 border-0"
                      />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-heading font-semibold text-neutral-800 text-sm group-hover:text-primary transition-colors">
                      {facility.name}
                    </h3>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        )}

        <ScrollReveal delay={0.2}>
          <div className="text-center mt-10">
            <Link
              href="/fasilitas"
              className="inline-flex items-center gap-2 text-primary hover:text-primary-700 font-medium transition-colors"
            >
              Lihat Semua Fasilitas
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
