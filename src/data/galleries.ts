import type { Gallery } from "@/types";

export const galleries: Gallery[] = [
  {
    id: 1,
    title: "Workshop Kurikulum Merdeka 2025",
    description:
      "Dokumentasi kegiatan workshop implementasi Kurikulum Merdeka untuk guru mata pelajaran SMPN 17 Denpasar.",
    type: "photo",
    created_at: "2025-06-16T08:00:00Z",
    media: [
      {
        id: 1,
        gallery_id: 1,
        filename: "workshop-1.jpg",
        url: "https://placehold.co/1200x800/1565C0/FFFFFF?text=Workshop+Kurikulum+1",
        caption: "Pembukaan workshop oleh Kepala Sekolah",
        sort_order: 1,
      },
      {
        id: 2,
        gallery_id: 1,
        filename: "workshop-2.jpg",
        url: "https://placehold.co/1200x800/0D47A1/FFFFFF?text=Workshop+Kurikulum+2",
        caption: "Sesi penyusunan modul ajar",
        sort_order: 2,
      },
      {
        id: 3,
        gallery_id: 1,
        filename: "workshop-3.jpg",
        url: "https://placehold.co/1200x800/2E7D6F/FFFFFF?text=Workshop+Kurikulum+3",
        caption: "Presentasi hasil diskusi kelompok",
        sort_order: 3,
      },
      {
        id: 4,
        gallery_id: 1,
        filename: "workshop-4.jpg",
        url: "https://placehold.co/1200x800/F59E0B/FFFFFF?text=Workshop+Kurikulum+4",
        caption: "Foto bersama peserta workshop",
        sort_order: 4,
      },
    ],
  },
  {
    id: 2,
    title: "Peringatan Hari Pendidikan Nasional 2025",
    description:
      "Rangkaian kegiatan peringatan Hardiknas di SMP Negeri 17 Denpasar.",
    type: "photo",
    created_at: "2025-05-02T10:00:00Z",
    media: [
      {
        id: 5,
        gallery_id: 2,
        filename: "hardiknas-1.jpg",
        url: "https://placehold.co/1200x800/1565C0/FFFFFF?text=Hardiknas+1",
        caption: "Upacara bendera Hari Pendidikan Nasional",
        sort_order: 1,
      },
      {
        id: 6,
        gallery_id: 2,
        filename: "hardiknas-2.jpg",
        url: "https://placehold.co/1200x800/2E7D6F/FFFFFF?text=Hardiknas+2",
        caption: "Pameran karya inovasi siswa",
        sort_order: 2,
      },
      {
        id: 7,
        gallery_id: 2,
        filename: "hardiknas-3.jpg",
        url: "https://placehold.co/1200x800/F59E0B/FFFFFF?text=Hardiknas+3",
        caption: "Pentas seni dan budaya",
        sort_order: 3,
      },
      {
        id: 8,
        gallery_id: 2,
        filename: "hardiknas-4.jpg",
        url: "https://placehold.co/1200x800/0D47A1/FFFFFF?text=Hardiknas+4",
        caption: "Penghargaan siswa berprestasi",
        sort_order: 4,
      },
    ],
  },
  {
    id: 3,
    title: "Turnamen Futsal Antar Kelas 2025",
    description:
      "Keseruan turnamen futsal antar kelas yang memperebutkan piala bergilir Kepala Sekolah.",
    type: "photo",
    created_at: "2025-03-10T14:00:00Z",
    media: [
      {
        id: 9,
        gallery_id: 3,
        filename: "futsal-1.jpg",
        url: "https://placehold.co/1200x800/0D47A1/FFFFFF?text=Futsal+1",
        caption: "Pertandingan pembuka turnamen",
        sort_order: 1,
      },
      {
        id: 10,
        gallery_id: 3,
        filename: "futsal-2.jpg",
        url: "https://placehold.co/1200x800/1565C0/FFFFFF?text=Futsal+2",
        caption: "Aksi pemain di lapangan",
        sort_order: 2,
      },
      {
        id: 11,
        gallery_id: 3,
        filename: "futsal-3.jpg",
        url: "https://placehold.co/1200x800/2E7D6F/FFFFFF?text=Futsal+3",
        caption: "Penyerahan piala kepada juara",
        sort_order: 3,
      },
    ],
  },
  {
    id: 4,
    title: "Video Profil Sekolah",
    description:
      "Video profil resmi SMP Negeri 17 Denpasar — mengenal lebih dekat lingkungan, fasilitas, dan kegiatan sekolah.",
    type: "video",
    created_at: "2025-04-01T09:00:00Z",
    media: [
      {
        id: 12,
        gallery_id: 4,
        filename: "",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        caption: "Video Profil SMP Negeri 17 Denpasar",
        sort_order: 1,
      },
    ],
  },
  {
    id: 5,
    title: "Dokumentasi Kegiatan Ekstrakurikuler",
    description:
      "Kumpulan video kegiatan ekstrakurikuler: pramuka, paskibra, tari tradisional, dan marching band.",
    type: "video",
    created_at: "2025-03-20T10:00:00Z",
    media: [
      {
        id: 13,
        gallery_id: 5,
        filename: "",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        caption: "Penampilan Tari Tradisional di acara sekolah",
        sort_order: 1,
      },
      {
        id: 14,
        gallery_id: 5,
        filename: "",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        caption: "Latihan gabungan Pramuka",
        sort_order: 2,
      },
    ],
  },
];

export function getGalleriesByType(type: "photo" | "video"): Gallery[] {
  return galleries.filter((g) => g.type === type);
}

export function getGalleryById(id: number): Gallery | undefined {
  return galleries.find((g) => g.id === id);
}
