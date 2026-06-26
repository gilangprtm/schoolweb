import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal";
import SectionHeading from "@/components/shared/SectionHeading";
import ImageWithFallback from "@/components/shared/ImageWithFallback";
import { getHeadmaster } from "@/data/staff";

export default function WelcomeSection() {
  const headmaster = getHeadmaster();

  if (!headmaster) return null;

  const quote =
    headmaster.bio.slice(0, 200) + (headmaster.bio.length > 200 ? "..." : "");

  return (
    <section className="section-py bg-white">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center max-w-5xl mx-auto">
          {/* Photo */}
          <ScrollReveal direction="left">
            <div className="relative mx-auto md:mx-0 max-w-xs md:max-w-full">
              <div className="relative z-10">
                <ImageWithFallback
                  src={headmaster.photo_url}
                  alt={headmaster.name}
                  aspect="3/4"
                  rounded="rounded-2xl"
                  className="shadow-2xl"
                  width={400}
                  height={533}
                />
              </div>
              {/* Decorative element behind */}
              <div className="absolute -top-4 -left-4 w-full h-full rounded-2xl bg-primary/10 -z-10" />
            </div>
          </ScrollReveal>

          {/* Text */}
          <ScrollReveal direction="right" delay={0.1}>
            <SectionHeading
              title="Sambutan Kepala Sekolah"
              align="left"
            />

            {/* Decorative quote mark */}
            <div className="text-7xl font-serif text-primary/20 leading-none mb-2 select-none">
              &ldquo;
            </div>

            <blockquote className="text-lg text-neutral-600 italic leading-relaxed mb-5 -mt-4">
              {quote}
            </blockquote>

            <div className="border-l-4 border-primary pl-4 mb-5">
              <p className="font-heading font-bold text-neutral-800 text-lg">
                {headmaster.name}
              </p>
              <p className="text-sm text-neutral-500">Kepala Sekolah</p>
            </div>

            <Link
              href="/profil"
              className="inline-flex items-center gap-2 text-primary hover:text-primary-700 font-medium transition-colors text-sm"
            >
              Baca Selengkapnya
              <ArrowRight className="size-4" />
            </Link>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
