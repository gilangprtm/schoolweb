import type { Facility } from "@/types";

export const facilities: Facility[] = [
  {
    id: 1,
    name: "Laboratorium Komputer",
    slug: "laboratorium-komputer",
    description:
      "Laboratorium komputer modern dengan 40 unit PC all-in-one terbaru, koneksi internet fiber optik, dan software pembelajaran terkini. Setiap siswa dapat mengakses komputer pribadi selama pelajaran Informatika. Lab ini juga digunakan untuk kegiatan ekstrakurikuler robotik, desain grafis, dan coding club.",
    category: "teknologi",
    photo_url:
      "https://placehold.co/1200x600/1565C0/FFFFFF?text=Lab+Komputer",
    is_featured: true,
    sort_order: 1,
    is_published: true,
    facility_photos: [
      {
        id: 1,
        facility_id: 1,
        filename: "lab-kom-1.jpg",
        url: "https://placehold.co/800x600/1565C0/FFFFFF?text=Lab+Kom+1",
        caption: "Ruang utama laboratorium komputer",
        sort_order: 1,
      },
      {
        id: 2,
        facility_id: 1,
        filename: "lab-kom-2.jpg",
        url: "https://placehold.co/800x600/0D47A1/FFFFFF?text=Lab+Kom+2",
        caption: "Siswa sedang belajar pemrograman",
        sort_order: 2,
      },
    ],
  },
  {
    id: 2,
    name: "Perpustakaan Digital",
    slug: "perpustakaan-digital",
    description:
      "Perpustakaan dengan koleksi 5.000+ buku cetak dan akses ke perpustakaan digital nasional. Dilengkapi ruang baca yang nyaman, area diskusi, komputer pencarian katalog, dan pojok literasi. Program Gerakan Literasi Sekolah (GLS) rutin diselenggarakan di sini setiap pagi sebelum jam pelajaran dimulai.",
    category: "akademik",
    photo_url:
      "https://placehold.co/1200x600/2E7D6F/FFFFFF?text=Perpustakaan",
    is_featured: true,
    sort_order: 2,
    is_published: true,
    facility_photos: [],
  },
  {
    id: 3,
    name: "Lapangan Basket & Futsal",
    slug: "lapangan-basket-futsal",
    description:
      "Lapangan olahraga multifungsi yang dapat digunakan untuk basket, futsal, dan badminton. Permukaan menggunakan rumput sintetis standar nasional dengan drainase yang baik. Dilengkapi tribun penonton, pencahayaan untuk sore/malam hari, dan area pemanasan. Lapangan ini menjadi pusat kegiatan olahraga dan tempat pembinaan atlet muda berbakat.",
    category: "olahraga",
    photo_url: "https://placehold.co/1200x600/0D47A1/FFFFFF?text=Lapangan+Olahraga",
    is_featured: true,
    sort_order: 3,
    is_published: true,
    facility_photos: [
      {
        id: 3,
        facility_id: 3,
        filename: "lapangan-1.jpg",
        url: "https://placehold.co/800x600/0D47A1/FFFFFF?text=Lapangan+1",
        caption: "Lapangan basket & futsal multifungsi",
        sort_order: 1,
      },
    ],
  },
  {
    id: 4,
    name: "Laboratorium IPA Terpadu",
    slug: "laboratorium-ipa-terpadu",
    description:
      "Laboratorium IPA terpadu yang dilengkapi peralatan praktikum Biologi dan Fisika yang lengkap. Tersedia mikroskop digital, torso anatomi, alat peraga fisika, lemari asam, dan meja praktikum individual untuk setiap siswa. Lab ini mendukung pembelajaran berbasis eksperimen dan penelitian ilmiah sederhana.",
    category: "akademik",
    photo_url: "https://placehold.co/1200x600/1565C0/FFFFFF?text=Lab+IPA",
    is_featured: true,
    sort_order: 4,
    is_published: true,
    facility_photos: [],
  },
  {
    id: 5,
    name: "Ruang Seni & Musik",
    slug: "ruang-seni-musik",
    description:
      "Ruang seni dan musik dengan peralatan lengkap termasuk alat musik tradisional (angklung, gamelan mini) dan modern (gitar, keyboard, drum akustik). Dilengkapi studio rekaman sederhana untuk proyek multimedia siswa. Ruangan ini menjadi tempat berkumpulnya bakat-bakat seni sekolah dan tempat latihan rutin ekstrakurikuler seni.",
    category: "seni",
    photo_url: "https://placehold.co/1200x600/F59E0B/FFFFFF?text=Ruang+Seni",
    is_featured: false,
    sort_order: 5,
    is_published: true,
    facility_photos: [],
  },
  {
    id: 6,
    name: "Masjid Al-Ilmi",
    slug: "masjid-al-ilmi",
    description:
      "Masjid sekolah yang bersih dan nyaman dengan kapasitas 300 jamaah. Digunakan untuk kegiatan ibadah harian, sholat Jumat, pesantren kilat Ramadhan, dan kegiatan keagamaan lainnya. Dilengkapi tempat wudhu yang bersih, AC, dan perpustakaan khusus buku-buku keislaman. Masjid ini juga terbuka untuk masyarakat sekitar.",
    category: "ibadah",
    photo_url: "https://placehold.co/1200x600/2E7D6F/FFFFFF?text=Masjid+Al-Ilmi",
    is_featured: true,
    sort_order: 6,
    is_published: true,
    facility_photos: [
      {
        id: 4,
        facility_id: 6,
        filename: "masjid-1.jpg",
        url: "https://placehold.co/800x600/2E7D6F/FFFFFF?text=Masjid+Al-Ilmi+1",
        caption: "Interior Masjid Al-Ilmi",
        sort_order: 1,
      },
    ],
  },
  {
    id: 7,
    name: "Kantin Sehat",
    slug: "kantin-sehat",
    description:
      "Kantin sekolah yang menyajikan makanan dan minuman sehat, higienis, dan terjangkau. Menu bervariasi setiap hari dengan bahan-bahan segar. Kantin ini juga menjadi sarana edukasi pola makan sehat bagi siswa dan telah mendapatkan sertifikat Kantin Sehat dari Dinas Kesehatan Kota Denpasar.",
    category: "lainnya",
    photo_url: "https://placehold.co/1200x600/1565C0/FFFFFF?text=Kantin+Sehat",
    is_featured: false,
    sort_order: 7,
    is_published: true,
    facility_photos: [],
  },
  {
    id: 8,
    name: "Unit Kesehatan Sekolah (UKS)",
    slug: "unit-kesehatan-sekolah",
    description:
      "UKS dengan ruang perawatan yang dilengkapi tempat tidur, obat-obatan dasar, alat P3K lengkap, dan alat pengukur kesehatan (timbangan, tensimeter, termometer). Petugas UKS siap melayani siswa yang mengalami gangguan kesehatan selama jam sekolah. Program pemeriksaan kesehatan rutin bekerjasama dengan Puskesmas setempat.",
    category: "lainnya",
    photo_url: "https://placehold.co/1200x600/0D47A1/FFFFFF?text=UKS",
    is_featured: false,
    sort_order: 8,
    is_published: true,
    facility_photos: [],
  },
];

export function getPublishedFacilities(): Facility[] {
  return facilities
    .filter((f) => f.is_published)
    .sort((a, b) => a.sort_order - b.sort_order);
}

export function getFeaturedFacilities(): Facility[] {
  return getPublishedFacilities()
    .filter((f) => f.is_featured)
    .sort((a, b) => a.sort_order - b.sort_order);
}

export function getFacilityBySlug(slug: string): Facility | undefined {
  return facilities.find((f) => f.slug === slug && f.is_published);
}
