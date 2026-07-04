import { Target, Flag, MapPin, Building2 } from "lucide-react";
import MiniHeroBanner from "@/components/shared/MiniHeroBanner";
import ScrollReveal from "@/components/shared/ScrollReveal";
import { getSchoolProfile } from "@/lib/actions/school-profile";

export default async function ProfilPage() {
  const profile = await getSchoolProfile();

  return (
    <>
      <MiniHeroBanner
        title="Profil Sekolah"
        subtitle="Mengenal lebih dekat SMP Negeri 17 Denpasar"
        breadcrumb={[{ label: "Profil" }]}
      />

      {/* ── Visi ── */}
      <section className="section-py bg-white">
        <div className="container-custom max-w-4xl">
          <ScrollReveal>
            <div className="relative bg-gradient-to-br from-primary-50 via-primary-50/50 to-white rounded-3xl p-8 md:p-12 border border-primary-100/50">
              {/* Decorative quote */}
              <div className="absolute -top-6 left-6 md:left-10 text-8xl font-serif text-primary/10 select-none leading-none">
                &ldquo;
              </div>
              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="size-10 rounded-xl bg-primary flex items-center justify-center">
                    <Target className="size-5 text-white" />
                  </div>
                  <h2 className="font-heading text-2xl md:text-3xl font-bold text-neutral-900">
                    Visi
                  </h2>
                </div>
                <blockquote className="text-lg md:text-xl text-neutral-700 font-medium leading-relaxed italic border-l-4 border-primary pl-6 py-2">
                  {profile.visi ||
                    "Terwujudnya peserta didik yang unggul dalam prestasi, berkarakter mulia, berwawasan lingkungan, dan mampu bersaing di era global."}
                </blockquote>
              </div>
            </div>
          </ScrollReveal>

          {/* ── Misi ── */}
          <ScrollReveal delay={0.1}>
            <div className="mt-12">
              <div className="flex items-center gap-3 mb-8">
                <div className="size-10 rounded-xl bg-secondary flex items-center justify-center">
                  <Flag className="size-5 text-white" />
                </div>
                <h2 className="font-heading text-2xl md:text-3xl font-bold text-neutral-900">
                  Misi
                </h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {(profile.misi.length > 0
                  ? profile.misi
                  : [
                      "Mewujudkan pembelajaran berkualitas yang inovatif, kreatif, dan menyenangkan berbasis teknologi informasi dan komunikasi.",
                      "Mengembangkan potensi peserta didik secara optimal melalui kegiatan akademik dan non-akademik yang terprogram.",
                      "Menanamkan nilai-nilai karakter dan budi pekerti luhur melalui pembiasaan, keteladanan, dan budaya sekolah.",
                      "Menciptakan lingkungan sekolah yang bersih, hijau, aman, dan nyaman sebagai sumber belajar.",
                      "Meningkatkan kompetensi pendidik dan tenaga kependidikan secara berkelanjutan melalui pelatihan dan pengembangan profesional.",
                      "Membangun kemitraan dengan orang tua, masyarakat, dan berbagai pemangku kepentingan untuk mendukung kemajuan sekolah.",
                      "Mengembangkan budaya literasi dan numerasi di seluruh warga sekolah.",
                      "Membekali peserta didik dengan keterampilan abad 21: berpikir kritis, kreativitas, kolaborasi, dan komunikasi.",
                    ]
                ).map((item, i) => (
                  <div
                    key={i}
                    className="group flex gap-4 bg-neutral-50 hover:bg-white rounded-2xl p-5 border border-neutral-100 hover:border-primary-100 hover:shadow-card transition-all duration-300"
                  >
                    <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-heading font-bold text-lg shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                      {i + 1}
                    </div>
                    <p className="text-neutral-600 text-sm leading-relaxed pt-1">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Sejarah ── */}
      <section className="section-py bg-neutral-50">
        <div className="container-custom max-w-4xl">
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-10">
              <div className="size-10 rounded-xl bg-primary flex items-center justify-center">
                <MapPin className="size-5 text-white" />
              </div>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-neutral-900">
                Sejarah
              </h2>
            </div>
          </ScrollReveal>

          <div className="relative">
            {/* Vertical timeline line */}
            <div className="absolute left-[18px] md:left-[22px] top-0 bottom-0 w-0.5 bg-primary/15" />

            {(profile.sejarah.length > 0
              ? profile.sejarah
              : [
                  {
                    year: "1980",
                    title: "Periode Perintisan",
                    description:
                      "SMP Negeri 17 Denpasar berdiri pada 1 Juli 1980 berdasarkan SK Menteri Pendidikan dan Kebudayaan RI. Di awal berdirinya, sekolah hanya memiliki 3 ruang kelas dengan 120 siswa dan 8 tenaga pendidik. Kepala sekolah pertama adalah Drs. H. M. Yusuf. Meski fasilitas masih minim, semangat belajar siswa dan dedikasi guru menjadi modal utama membangun fondasi pendidikan di sekolah ini.",
                  },
                  {
                    year: "1990",
                    title: "Periode Pengembangan",
                    description:
                      "Memasuki dekade 90-an, sekolah mengalami perkembangan pesat. Ruang kelas bertambah menjadi 12, dilengkapi laboratorium IPA dan perpustakaan. Jumlah siswa meningkat menjadi 400 orang. Pada periode ini sekolah mulai meraih prestasi di tingkat kabupaten, khususnya di bidang olahraga dan pramuka. Program ekstrakurikuler mulai dirintis.",
                  },
                  {
                    year: "2005",
                    title: "Periode Modernisasi",
                    description:
                      "Era modernisasi ditandai dengan pembangunan gedung bertingkat, laboratorium komputer, masjid, dan berbagai fasilitas pendukung. Kurikulum Berbasis Kompetensi (KBK) dan KTSP diterapkan. Sekolah meraih akreditasi A untuk pertama kalinya pada tahun 2010. Prestasi siswa mulai merambah ke tingkat provinsi dan nasional di berbagai bidang.",
                  },
                  {
                    year: "2020",
                    title: "Periode Transformasi Digital",
                    description:
                      "Pandemi COVID-19 mendorong digitalisasi total. Sekolah menyiapkan infrastruktur e-learning, merancang kurikulum hybrid, dan membangun budaya digital. Setelah pandemi, sekolah melanjutkan inovasi dengan AI, robotika, dan pembelajaran adaptif berbasis teknologi.",
                  },
                ]
            ).map((item, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className="relative flex gap-4 md:gap-6 mb-16 last:mb-4">
                  {/* Year marker */}
                  <div className="relative z-10 shrink-0">
                    <div className="w-9 h-9 md:w-11 md:h-11 rounded-full bg-primary text-white flex items-center justify-center font-heading font-bold text-xs md:text-sm shadow-md">
                      {item.year}
                    </div>
                  </div>
                  {/* Content card */}
                  <div className="flex-1 bg-white rounded-2xl p-5 md:p-6 border border-neutral-100 shadow-sm hover:shadow-card transition-shadow duration-300">
                    <h3 className="font-heading font-bold text-base md:text-lg text-neutral-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-neutral-600 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Struktur Organisasi ── */}
      <section className="section-py bg-white">
        <div className="container-custom max-w-4xl">
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-10">
              <div className="size-10 rounded-xl bg-primary flex items-center justify-center">
                <Building2 className="size-5 text-white" />
              </div>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-neutral-900">
                Struktur Organisasi
              </h2>
            </div>
          </ScrollReveal>

          {/* ── Org Chart ── */}
          <div className="flex flex-col items-center">
            {/* Kepala Sekolah */}
            <ScrollReveal>
              <OrgNode
                label="Kepala Sekolah"
                subtitle="Drs. Ahmad Fauzi, M.Pd."
                variant="primary"
              />
            </ScrollReveal>

            {/* Vertical line */}
            <div className="w-px h-8 bg-primary/30" />

            {/* Divider bar */}
            <div className="flex items-center w-full max-w-2xl">
              <div className="flex-1 h-px bg-primary/20" />
            </div>

            {/* Wakasek row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 w-full max-w-4xl mt-2">
              {WAKASEK.map((item, i) => (
                <ScrollReveal key={i} delay={i * 0.06}>
                  <OrgNode label={item} variant="secondary" compact />
                </ScrollReveal>
              ))}
            </div>

            {/* Divider */}
            <div className="flex items-center w-full max-w-2xl mt-3">
              <div className="flex-1 h-px bg-secondary/20" />
            </div>
            <div className="w-px h-6 bg-secondary/20" />

            {/* Guru & Pegawai row */}
            <div className="grid grid-cols-2 gap-3 w-full max-w-md">
              <ScrollReveal delay={0.3}>
                <OrgNode label="Guru" variant="outline" />
              </ScrollReveal>
              <ScrollReveal delay={0.35}>
                <OrgNode label="Pegawai / Staf TU" variant="outline" />
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

const WAKASEK = [
  "Waka Kurikulum",
  "Waka Kesiswaan",
  "Waka Sarpras",
  "Waka Humas",
  "Kepala TU",
];

function OrgNode({
  label,
  subtitle,
  variant = "primary",
  compact = false,
}: {
  label: string;
  subtitle?: string;
  variant?: "primary" | "secondary" | "outline";
  compact?: boolean;
}) {
  const base =
    "relative text-center rounded-2xl border transition-all duration-300 hover:-translate-y-0.5";

  const variants = {
    primary:
      "bg-gradient-to-br from-primary to-primary-700 text-white border-primary-600 shadow-lg shadow-primary/20 px-8 py-5",
    secondary:
      "bg-gradient-to-br from-secondary to-secondary-700 text-white border-secondary-500 shadow-md shadow-secondary/15 px-4 py-3.5",
    outline:
      "bg-white text-neutral-800 border-neutral-200 hover:border-primary-200 hover:shadow-card px-5 py-4",
  };

  return (
    <div className={[base, variants[variant]].join(" ")}>
      <div
        className={
          compact
            ? "font-heading font-semibold text-sm leading-tight"
            : "font-heading font-bold text-base md:text-lg leading-tight"
        }
      >
        {label}
      </div>
      {subtitle && <div className="mt-1 opacity-80 text-xs">{subtitle}</div>}
    </div>
  );
}
