"use client";

import Image from "next/image";
import { Users, GraduationCap, Trophy, Building2 } from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal";
import StatsCounter from "@/components/shared/StatsCounter";
import CTAButton from "@/components/shared/CTAButton";
import { siteSettings } from "@/data/settings";
import { getActiveStaff } from "@/data/staff";
import { getPublishedAchievements } from "@/data/achievements";

export default function HeroSection() {
  const staffCount = getActiveStaff().length;
  const achievementCount = getPublishedAchievements().length;

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-neutral-900">
        <Image
          src="/images/hero-background.png"
          alt="Gedung SMP Negeri 17 Denpasar"
          fill
          className="object-cover opacity-50"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />
      </div>

      {/* Content */}
      <div className="container-custom relative z-10 text-center pt-20">
        <ScrollReveal delay={0.1}>
          <p className="text-white/80 text-base md:text-lg mb-2 font-medium">
            Selamat Datang di
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-5 leading-tight tracking-tight drop-shadow-lg">
            {siteSettings.schoolName}
          </h1>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
            {siteSettings.tagline}
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.25}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14">
            <CTAButton
              label="Kenali Kami"
              href="/profil"
              variant="primary"
              size="lg"
              showArrow
            />
            <CTAButton
              label="Daftar Sekarang"
              href="https://denpasar.spmb.id/"
              variant="outline"
              size="lg"
            />
          </div>
        </ScrollReveal>

        {/* Stats */}
        <ScrollReveal delay={0.35}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <StatsCounter
              value={500}
              suffix="+"
              label="Siswa Aktif"
              icon={Users}
            />
            <StatsCounter
              value={staffCount}
              suffix="+"
              label="Guru & Staf"
              icon={GraduationCap}
            />
            <StatsCounter
              value={achievementCount}
              suffix="+"
              label="Prestasi"
              icon={Trophy}
            />
            <StatsCounter
              value={15}
              suffix="+"
              label="Tahun Berdiri"
              icon={Building2}
            />
          </div>
        </ScrollReveal>

        {/* Scroll indicator */}
        <ScrollReveal delay={0.5}>
          <div className="mt-14 flex justify-center">
            <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1.5">
              <div className="w-1.5 h-2.5 rounded-full bg-white/50 animate-bounce" />
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
