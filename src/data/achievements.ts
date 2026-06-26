import type { Achievement } from "@/types";

export const achievements: Achievement[] = [
  {
    id: 1,
    title: "Juara 1 OSN Matematika Tingkat Nasional",
    slug: "juara-1-osn-matematika-nasional",
    description:
      "Putri Rahmawati, siswi kelas 9A, meraih Juara 1 dalam Olimpiade Sains Nasional bidang Matematika yang diselenggarakan di Jakarta. Kompetisi ini diikuti oleh 150 peserta dari seluruh provinsi di Indonesia.",
    category: "student",
    level: "nasional",
    champion: "1",
    organizer: "Kemendikbudristek",
    date: "2025-06-14",
    image_url: "https://placehold.co/800x600/F59E0B/FFFFFF?text=Juara+1+OSN",
    is_featured: true,
    is_published: true,
  },
  {
    id: 2,
    title: "Juara 2 Futsal Pelajar Tingkat Provinsi",
    slug: "juara-2-futsal-provinsi",
    description:
      "Tim futsal SMP Negeri 17 Denpasar berhasil meraih Juara 2 dalam Kejuaraan Futsal Pelajar Tingkat Provinsi Bali setelah mengalahkan tim-tim kuat dari berbagai kota.",
    category: "student",
    level: "provinsi",
    champion: "2",
    organizer: "Dispora Bali",
    date: "2025-05-24",
    image_url: "https://placehold.co/800x600/2E7D6F/FFFFFF?text=Juara+2+Futsal",
    is_featured: true,
    is_published: true,
  },
  {
    id: 3,
    title: "Juara 3 Debat Bahasa Inggris Tingkat Kabupaten",
    slug: "juara-3-debat-bahasa-inggris-kabupaten",
    description:
      "Tim debat Bahasa Inggris SMPN 17 Denpasar meraih Juara 3 dalam kompetisi debat Bahasa Inggris tingkat Kota Denpasar.",
    category: "student",
    level: "kabupaten",
    champion: "3",
    organizer: "MGMP Bahasa Inggris Denpasar",
    date: "2025-04-28",
    image_url: "https://placehold.co/800x600/1565C0/FFFFFF?text=Juara+3+Debat",
    is_featured: false,
    is_published: true,
  },
  {
    id: 4,
    title: "Guru Berprestasi Tingkat Provinsi",
    slug: "guru-berprestasi-provinsi",
    description:
      "Sri Wahyuni, S.Pd., guru Matematika SMPN 17 Denpasar, dinobatkan sebagai Guru Berprestasi Tingkat Provinsi Bali atas inovasinya dalam pembelajaran Matematika berbasis teknologi.",
    category: "teacher",
    level: "provinsi",
    champion: "1",
    organizer: "Dinas Pendidikan Provinsi Bali",
    date: "2025-05-10",
    image_url: "https://placehold.co/800x600/F59E0B/FFFFFF?text=Guru+Berprestasi",
    is_featured: true,
    is_published: true,
  },
  {
    id: 5,
    title: "Finalis Lomba Robotik Nasional",
    slug: "finalis-robotik-nasional",
    description:
      "Klub robotik SMPN 17 Denpasar berhasil menjadi finalis dalam Lomba Robotik Pelajar Tingkat Nasional dengan robot pendeteksi banjir berbasis IoT.",
    category: "student",
    level: "nasional",
    champion: "peserta",
    organizer: "Kemendikbudristek",
    date: "2025-03-15",
    image_url: "https://placehold.co/800x600/0D47A1/FFFFFF?text=Finalis+Robotik",
    is_featured: true,
    is_published: true,
  },
  {
    id: 6,
    title: "Sekolah Adiwiyata Tingkat Kabupaten",
    slug: "sekolah-adiwiyata-kabupaten",
    description:
      "SMP Negeri 17 Denpasar menerima penghargaan sebagai Sekolah Adiwiyata tingkat Kota Denpasar atas komitmennya dalam mewujudkan lingkungan sekolah yang bersih, hijau, dan berkelanjutan.",
    category: "school",
    level: "kabupaten",
    champion: "1",
    organizer: "DLH Kota Denpasar",
    date: "2025-02-20",
    image_url: "https://placehold.co/800x600/2E7D6F/FFFFFF?text=Sekolah+Adiwiyata",
    is_featured: false,
    is_published: true,
  },
  {
    id: 7,
    title: "Juara 1 Lomba Cipta Puisi Tingkat Kecamatan",
    slug: "juara-1-cipta-puisi-kecamatan",
    description:
      "Siswa kelas 8B meraih Juara 1 dalam Lomba Cipta Puisi tingkat Kecamatan Denpasar Timur dalam rangka Bulan Bahasa.",
    category: "student",
    level: "kecamatan",
    champion: "1",
    organizer: "KKG Kecamatan Denpasar Timur",
    date: "2025-01-18",
    image_url: "",
    is_featured: false,
    is_published: true,
  },
  {
    id: 8,
    title: "Akreditasi A dari BAN-SM",
    slug: "akreditasi-a-ban-sm",
    description:
      "SMP Negeri 17 Denpasar berhasil mempertahankan predikat Akreditasi A (Unggul) dari Badan Akreditasi Nasional Sekolah/Madrasah (BAN-SM) dengan nilai sangat memuaskan.",
    category: "school",
    level: "nasional",
    champion: "1",
    organizer: "BAN-SM",
    date: "2024-11-15",
    image_url: "https://placehold.co/800x600/F59E0B/FFFFFF?text=Akreditasi+A",
    is_featured: true,
    is_published: true,
  },
  {
    id: 9,
    title: "Juara Harapan Lomba KIR Tingkat Provinsi",
    slug: "harapan-kir-provinsi",
    description:
      "Kelompok Karya Ilmiah Remaja SMPN 17 Denpasar meraih Juara Harapan dalam lomba KIR tingkat Provinsi dengan penelitian tentang pemanfaatan limbah plastik sebagai bahan campuran aspal.",
    category: "student",
    level: "provinsi",
    champion: "harapan",
    organizer: "Dinas Pendidikan Provinsi Bali",
    date: "2024-10-20",
    image_url: "https://placehold.co/800x600/1565C0/FFFFFF?text=Harapan+KIR",
    is_featured: false,
    is_published: true,
  },
];

export function getPublishedAchievements(): Achievement[] {
  return achievements
    .filter((a) => a.is_published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getFeaturedAchievements(): Achievement[] {
  return getPublishedAchievements()
    .filter((a) => a.is_featured)
    .sort((a, b) => {
      // Sort by level priority then date
      const levelOrder = [
        "internasional",
        "nasional",
        "provinsi",
        "kabupaten",
        "kecamatan",
      ];
      const levelA = levelOrder.indexOf(a.level);
      const levelB = levelOrder.indexOf(b.level);
      if (levelA !== levelB) return levelA - levelB;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
}

export function getAchievementBySlug(
  slug: string
): Achievement | undefined {
  return achievements.find((a) => a.slug === slug && a.is_published);
}
