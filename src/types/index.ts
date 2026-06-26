// ============================================
// TypeScript Interfaces — Website Profil Sekolah
// Maps to PostgreSQL schema defined in PRD.md
// ============================================

// ── Settings ──
export interface SiteSettings {
  schoolName: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  jamOperasional: string;
  akreditasi: string;
  logo_url: string;
  favicon_url: string;
  social: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    tiktok?: string;
    twitter?: string;
  };
  googleMapsEmbedUrl: string;
}

// ── Pages (static content) ──
export interface Page {
  id: number;
  title: string;
  slug: string;
  content: string; // HTML from TipTap editor
  updated_at: string;
}

// ── Posts (Berita & Pengumuman) ──
export type PostCategory = "news" | "announcement";

export interface Post {
  id: number;
  title: string;
  slug: string;
  content: string; // HTML from TipTap
  excerpt: string;
  image_url: string;
  category: PostCategory;
  is_published: boolean;
  published_at: string; // ISO date string
}

// ── Staff (Guru & Staf) ──
export type StaffRole = "headmaster" | "teacher" | "staff";

export interface Staff {
  id: number;
  name: string;
  slug: string;
  role: StaffRole;
  subject?: string; // Mata pelajaran (hanya untuk guru)
  photo_url: string;
  education: string;
  bio: string;
  email: string;
  phone?: string; // Internal, tidak ditampilkan publik
  sort_order: number;
  is_active: boolean;
}

// ── Achievements (Prestasi) ──
export type AchievementCategory = "student" | "teacher" | "school";
export type AchievementLevel =
  | "kecamatan"
  | "kabupaten"
  | "provinsi"
  | "nasional"
  | "internasional";
export type AchievementChampion = "1" | "2" | "3" | "harapan" | "peserta";

export interface Achievement {
  id: number;
  title: string;
  slug: string;
  description: string;
  category: AchievementCategory;
  level: AchievementLevel;
  champion: AchievementChampion;
  organizer: string;
  date: string; // YYYY-MM-DD
  image_url: string;
  is_featured: boolean;
  is_published: boolean;
}

// ── Facilities (Fasilitas) ──
export type FacilityCategory =
  | "akademik"
  | "olahraga"
  | "seni"
  | "ibadah"
  | "teknologi"
  | "lainnya";

export interface Facility {
  id: number;
  name: string;
  slug: string;
  description: string;
  category: FacilityCategory;
  photo_url: string;
  is_featured: boolean;
  sort_order: number;
  is_published: boolean;
  facility_photos?: FacilityPhoto[];
}

export interface FacilityPhoto {
  id: number;
  facility_id: number;
  filename: string;
  url: string;
  caption: string;
  sort_order: number;
}

// ── Galleries ──
export type GalleryType = "photo" | "video";

export interface Gallery {
  id: number;
  title: string;
  description: string;
  type: GalleryType;
  media: Media[];
  created_at: string;
}

export interface Media {
  id: number;
  gallery_id: number;
  filename?: string;
  url: string;
  caption: string;
  sort_order: number;
}

// ── Contacts ──
export interface ContactMessage {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

// ── Users (for admin dashboard, not used in frontend yet) ──
export type UserRole = "superadmin" | "admin";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}
