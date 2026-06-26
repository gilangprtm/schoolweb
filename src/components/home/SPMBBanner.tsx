import { ClipboardCheck, CalendarCheck, Banknote } from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal";
import SectionHeading from "@/components/shared/SectionHeading";
import CTAButton from "@/components/shared/CTAButton";

const HIGHLIGHTS = [
  {
    icon: ClipboardCheck,
    title: "Syarat Pendaftaran",
    description: "Transparan, jelas, dan mudah dipenuhi",
  },
  {
    icon: CalendarCheck,
    title: "Jadwal Kegiatan",
    description: "Dibuka 1 Juni — 30 Juni 2025",
  },
  {
    icon: Banknote,
    title: "Biaya Terjangkau",
    description: "Pendaftaran gratis tanpa pungutan",
  },
];

export default function SPMBBanner() {
  return (
    <section className="section-py bg-gradient-to-br from-primary via-primary-600 to-primary-800 relative overflow-hidden">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.05)_0%,transparent_60%)]" />

      <div className="container-custom relative z-10">
        <ScrollReveal>
          <SectionHeading
            title="Pendaftaran Siswa Baru (SPMB)"
            subtitle="Tahun Ajaran 2025/2026 — Pendaftaran dibuka mulai 1 Juni hingga 30 Juni 2025"
            light
          />
        </ScrollReveal>

        {/* Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl mx-auto mb-10">
          {HIGHLIGHTS.map((item, index) => (
            <ScrollReveal key={item.title} delay={index * 0.1}>
              <div className="text-center">
                <div className="size-14 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-3">
                  <item.icon className="size-7 text-white" />
                </div>
                <h4 className="font-heading font-semibold text-white text-sm mb-1">
                  {item.title}
                </h4>
                <p className="text-white/70 text-sm">{item.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* CTAs */}
        <ScrollReveal delay={0.3}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <CTAButton
              label="Daftar Sekarang (SPMB)"
              href="https://denpasar.spmb.id/"
              variant="outline"
              size="lg"
              showArrow
            />
            <CTAButton
              label="Hubungi Kami"
              href="/kontak"
              variant="primary"
              size="lg"
              className="bg-white text-primary hover:bg-neutral-100 shadow-lg shadow-white/20"
            />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
