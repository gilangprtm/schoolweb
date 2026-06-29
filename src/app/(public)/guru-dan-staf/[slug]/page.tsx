import { notFound } from "next/navigation";
import Link from "next/link";
import { Mail, ArrowLeft, GraduationCap } from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal";
import Breadcrumb from "@/components/shared/Breadcrumb";
import Badge from "@/components/shared/Badge";
import ImageWithFallback from "@/components/shared/ImageWithFallback";
import { getStaffBySlug, getActiveStaff } from "@/lib/actions/staff";

export default async function StaffDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const person = await getStaffBySlug(slug);

  if (!person) {
    notFound();
  }

  const allStaff = await getActiveStaff();
  const related = allStaff
    .filter((r) => r.role === person.role && r.id !== person.id)
    .slice(0, 4);

  const roleLabel =
    person.role === "headmaster"
      ? "Kepala Sekolah"
      : person.role === "teacher"
      ? "Guru"
      : "Staf";

  return (
    <article>
      <section className="relative min-h-[25vh] flex items-end bg-neutral-900">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-700 to-primary-900" />
        <div className="container-custom relative z-10 py-12 pt-24">
          <Breadcrumb
            items={[{ label: "Guru & Staf", href: "/guru-dan-staf" }, { label: person.name }]}
            className="text-white/70 mb-3"
          />
        </div>
      </section>

      <section className="section-py bg-white">
        <div className="container-custom max-w-3xl">
          <div className="bg-white rounded-2xl shadow-card p-6 md:p-8 relative z-10">
            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
              {/* Photo */}
              <div className="size-36 md:size-44 rounded-2xl overflow-hidden shrink-0 shadow-lg">
                <ImageWithFallback src={person.photoUrl} alt={person.name} aspect="1/1" rounded="rounded-2xl" />
              </div>

              {/* Info */}
              <div className="text-center sm:text-left flex-1">
                <Badge
                  label={roleLabel}
                  variant={
                    person.role === "headmaster" ? "accent" : person.role === "teacher" ? "primary" : "secondary"
                  }
                />
                <h1 className="font-heading font-bold text-2xl md:text-3xl text-neutral-800 mt-2 mb-1">
                  {person.name}
                </h1>
                {person.subject && (
                  <p className="text-neutral-500 font-medium mb-3">{person.subject}</p>
                )}
                {person.email && (
                  <a
                    href={`mailto:${person.email}`}
                    className="inline-flex items-center gap-2 text-primary hover:text-primary-700 text-sm transition-colors"
                  >
                    <Mail className="size-4" />
                    {person.email}
                  </a>
                )}
              </div>
            </div>
          </div>

          <ScrollReveal className="mt-8 space-y-8">
            {/* Education */}
            {person.education && (
              <div>
                <h2 className="flex items-center gap-2 font-heading font-bold text-lg text-neutral-800 mb-3">
                  <GraduationCap className="size-5 text-primary" />
                  Riwayat Pendidikan
                </h2>
                <ul className="space-y-2">
                  {person.education.split("\n").map((edu, i) => (
                    <li key={i} className="flex items-start gap-2 text-neutral-600">
                      <span className="size-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      {edu.trim()}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Bio */}
            {person.bio && (
              <div>
                <h2 className="font-heading font-bold text-lg text-neutral-800 mb-3">Biografi</h2>
                <p className="text-neutral-600 leading-relaxed">{person.bio}</p>
              </div>
            )}
          </ScrollReveal>

          <div className="mt-10 pt-6 border-t border-neutral-200">
            <Link href="/guru-dan-staf" className="inline-flex items-center gap-2 text-primary hover:text-primary-700 text-sm font-medium transition-colors">
              <ArrowLeft className="size-4" />
              Kembali ke Guru & Staf
            </Link>
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="section-py bg-neutral-50 -mt-8">
          <div className="container-custom">
            <h2 className="font-heading text-2xl font-bold text-neutral-800 mb-8 text-left">
              {roleLabel} Lainnya
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {related.map((r, i) => (
                <ScrollReveal key={r.id} delay={i * 0.1}>
                  <Link
                    href={`/guru-dan-staf/${r.slug}`}
                    className="group block text-center bg-white rounded-2xl p-4 shadow-card hover:shadow-card-hover transition-all hover:-translate-y-1"
                  >
                    <div className="size-20 rounded-full overflow-hidden mx-auto mb-2">
                      <ImageWithFallback src={r.photoUrl} alt={r.name} aspect="1/1" rounded="rounded-full" />
                    </div>
                    <h3 className="font-heading font-semibold text-neutral-800 text-xs group-hover:text-primary transition-colors line-clamp-2">
                      {r.name}
                    </h3>
                    {r.subject && <p className="text-neutral-500 text-xs mt-0.5">{r.subject}</p>}
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
