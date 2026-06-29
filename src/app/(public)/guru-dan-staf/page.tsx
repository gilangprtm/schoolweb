"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Mail, ArrowRight } from "lucide-react";
import MiniHeroBanner from "@/components/shared/MiniHeroBanner";
import FilterPills from "@/components/shared/FilterPills";
import ScrollReveal from "@/components/shared/ScrollReveal";
import Badge from "@/components/shared/Badge";
import ImageWithFallback from "@/components/shared/ImageWithFallback";
import EmptyState from "@/components/shared/EmptyState";
import { getActiveStaff } from "@/lib/actions/staff";
import type { Staff } from "@/types";

const ROLE_FILTERS = [
  { label: "Semua", value: "all" },
  { label: "Kepala Sekolah", value: "headmaster" },
  { label: "Guru", value: "teacher" },
  { label: "Staf", value: "staff" },
];

export default function GuruStaffPage() {
  const [role, setRole] = useState("all");
  const [allStaff, setAllStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getActiveStaff()
      .then((s) => setAllStaff(s as Staff[]))
      .catch(() => setAllStaff([]))
      .finally(() => setLoading(false));
  }, []);

  const headmaster = allStaff.find((s) => s.role === "headmaster");
  const filteredStaff = role === "all" ? allStaff : allStaff.filter((s) => s.role === role);
  const teachers = filteredStaff.filter((s) => s.role === "teacher");
  const staffList = filteredStaff.filter((s) => s.role === "staff");
  const showHeadmaster = role === "all" || role === "headmaster";

  return (
    <>
      <MiniHeroBanner
        title="Guru & Staf Kami"
        subtitle="Tim pendidik dan tenaga kependidikan profesional yang berdedikasi"
        breadcrumb={[{ label: "Guru & Staf" }]}
      />
      <section className="section-py bg-white">
        <div className="container-custom">
          <div className="mb-8">
            <FilterPills items={ROLE_FILTERS} activeItem={role} onChange={setRole} />
          </div>

          {loading ? (
            <div className="space-y-8">
              <div className="h-48 rounded-2xl bg-neutral-100 animate-pulse" />
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="rounded-2xl bg-neutral-100 animate-pulse h-64" />
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Headmaster */}
              {showHeadmaster && headmaster && (
                <ScrollReveal className="mb-12">
                  <Link
                    href={`/guru-dan-staf/${headmaster.slug}`}
                    className="group block bg-gradient-to-br from-primary-light to-white rounded-2xl p-6 md:p-8 shadow-card hover:shadow-card-hover transition-all duration-300 max-w-3xl"
                  >
                    <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                      <div className="size-32 md:size-40 rounded-full overflow-hidden shrink-0 shadow-lg">
                        <ImageWithFallback
                          src={headmaster.photoUrl}
                          alt={headmaster.name}
                          aspect="1/1"
                          rounded="rounded-full"
                        />
                      </div>
                      <div className="text-center sm:text-left">
                        <Badge label="Kepala Sekolah" variant="primary" />
                        <h3 className="font-heading font-bold text-xl md:text-2xl text-neutral-800 mt-2 mb-1 group-hover:text-primary transition-colors">
                          {headmaster.name}
                        </h3>
                        <blockquote className="text-neutral-600 italic text-sm mb-3 line-clamp-2">
                          &ldquo;{headmaster.bio.slice(0, 150)}...&rdquo;
                        </blockquote>
                        {headmaster.email && (
                          <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-neutral-400 mb-3">
                            <Mail className="size-3" />
                            {headmaster.email}
                          </div>
                        )}
                        <span className="inline-flex items-center gap-1 text-primary text-sm font-medium">
                          Lihat Profil <ArrowRight className="size-3.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              )}

              {/* Teachers */}
              {teachers.length > 0 && (
                <>
                  <h2 className="font-heading text-xl font-bold text-neutral-800 mb-6">
                    Guru
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
                    {teachers.map((person, index) => (
                      <ScrollReveal key={person.id} delay={index * 0.05}>
                        <StaffCard person={person} />
                      </ScrollReveal>
                    ))}
                  </div>
                </>
              )}

              {/* Staff */}
              {staffList.length > 0 && (
                <>
                  <h2 className="font-heading text-xl font-bold text-neutral-800 mb-6">Staf</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {staffList.map((person, index) => (
                      <ScrollReveal key={person.id} delay={index * 0.05}>
                        <StaffCard person={person} />
                      </ScrollReveal>
                    ))}
                  </div>
                </>
              )}

              {filteredStaff.length === 0 && (
                <EmptyState title="Tidak ada data" description="Belum ada data untuk kategori ini" />
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}

function StaffCard({ person }: { person: Staff }) {
  return (
    <Link
      href={`/guru-dan-staf/${person.slug}`}
      className="group block text-center bg-white rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 border border-neutral-100"
    >
      <div className="size-24 md:size-28 rounded-full overflow-hidden mx-auto mb-3 shadow-md group-hover:scale-105 transition-transform duration-300">
        <ImageWithFallback
          src={person.photoUrl}
          alt={person.name}
          aspect="1/1"
          rounded="rounded-full"
        />
      </div>
      <h3 className="font-heading font-semibold text-neutral-800 text-sm mb-1 group-hover:text-primary transition-colors line-clamp-2">
        {person.name}
      </h3>
      <Badge
        label={person.role === "headmaster" ? "Kepala Sekolah" : person.role === "teacher" ? "Guru" : "Staf"}
        variant={person.role === "headmaster" ? "accent" : person.role === "teacher" ? "primary" : "secondary"}
      />
      {person.subject && (
        <p className="text-neutral-500 text-xs mt-1.5">{person.subject}</p>
      )}
    </Link>
  );
}
