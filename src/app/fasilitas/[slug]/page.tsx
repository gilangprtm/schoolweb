import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal";
import Breadcrumb from "@/components/shared/Breadcrumb";
import Badge from "@/components/shared/Badge";
import ImageWithFallback from "@/components/shared/ImageWithFallback";
import FacilityGallery from "@/components/fasilitas/FacilityGallery";
import { getFacilityBySlug, getPublishedFacilities } from "@/data/facilities";
import { getFacilityIcon, getFacilityCategoryLabel } from "@/lib/utils";

export default async function FacilityDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const facility = getFacilityBySlug(slug);

  if (!facility) {
    notFound();
  }

  const relatedFacilities = getPublishedFacilities()
    .filter((f) => f.category === facility.category && f.id !== facility.id)
    .slice(0, 3);

  return (
    <article>
      {/* Hero */}
      <section className="relative min-h-[30vh] md:min-h-[35vh] flex items-end bg-neutral-900">
        <div className="absolute inset-0">
          <ImageWithFallback
            src={facility.photo_url}
            alt={facility.name}
            fill
            rounded="rounded-none"
            className="opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/40" />
        </div>
        <div className="container-custom relative z-10 py-14 pt-24">
          <Breadcrumb
            items={[
              { label: "Fasilitas", href: "/fasilitas" },
              { label: facility.name },
            ]}
            className="text-white/70 mb-3"
          />
          <Badge
            label={`${getFacilityIcon(facility.category)} ${getFacilityCategoryLabel(facility.category)}`}
            variant="outline"
            className="bg-white/20 text-white border-white/20 mb-3"
          />
          <h1 className="font-heading text-2xl md:text-4xl font-bold text-white leading-tight">
            {facility.name}
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="section-py bg-white">
        <div className="container-custom max-w-3xl">
          <ScrollReveal>
            <div className="prose-content">
              {facility.description.split("\n").map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </ScrollReveal>

          {/* Photo Gallery */}
          {facility.facility_photos && facility.facility_photos.length > 0 && (
            <div className="mt-12 pt-8 border-t border-neutral-200">
              <h2 className="font-heading text-xl font-bold text-neutral-800 mb-6">
                Galeri Foto
              </h2>
              <FacilityGallery photos={facility.facility_photos} />
            </div>
          )}

          <div className="mt-10 pt-6 border-t border-neutral-200">
            <Link
              href="/fasilitas"
              className="inline-flex items-center gap-2 text-primary hover:text-primary-700 text-sm font-medium transition-colors"
            >
              <ArrowLeft className="size-4" />
              Kembali ke Fasilitas
            </Link>
          </div>
        </div>
      </section>

      {/* Related */}
      {relatedFacilities.length > 0 && (
        <section className="section-py bg-neutral-50 -mt-8">
          <div className="container-custom">
            <h2 className="font-heading text-2xl font-bold text-neutral-800 mb-8 text-left">
              Fasilitas Lainnya
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl mx-auto">
              {relatedFacilities.map((rf, i) => (
                <ScrollReveal key={rf.id} delay={i * 0.1}>
                  <Link
                    href={`/fasilitas/${rf.slug}`}
                    className="group block bg-white rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
                      <ImageWithFallback
                        src={rf.photo_url}
                        alt={rf.name}
                        aspect="4/3"
                        rounded="rounded-none"
                        className="group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute bottom-2 left-2">
                        <Badge
                          label={`${getFacilityIcon(rf.category)} ${getFacilityCategoryLabel(rf.category)}`}
                          variant="outline"
                          className="bg-white/90 border-0 text-xs"
                        />
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="font-heading font-semibold text-neutral-800 text-sm">
                        {rf.name}
                      </h3>
                    </div>
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
