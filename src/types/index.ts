// ============================================
// TypeScript Interfaces — Website Profil Sekolah
// Maps to Drizzle ORM schema (camelCase keys)
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
  studentCount: string;
  establishedYear: string;
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
  content: string; // HTML
  updatedAt: string;
}

// ── Posts (Berita & Pengumuman) ──
export type PostCategory = "news" | "announcement";

export interface Post {
  id: number;
  title: string;
  slug: string;
  content: string; // HTML
  excerpt: string;
  imageUrl: string;
  category: PostCategory;
  isPublished: boolean;
  publishedAt: string; // ISO date string
}

// ── Staff (Guru & Staf) ──
export type StaffRole = "headmaster" | "teacher" | "staff";

export interface Staff {
  id: number;
  name: string;
  slug: string;
  role: StaffRole;
  subject?: string | null;
  photoUrl: string;
  education: string;
  bio: string;
  email: string | null;
  phone?: string | null;
  sortOrder: number;
  isActive: boolean;
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
  organizer: string | null;
  date: string | null; // YYYY-MM-DD
  imageUrl: string;
  isFeatured: boolean;
  isPublished: boolean;
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
  photoUrl: string;
  isFeatured: boolean;
  sortOrder: number;
  isPublished: boolean;
  photos?: FacilityPhoto[];
}

export interface FacilityPhoto {
  id: number;
  facilityId: number;
  filename: string;
  url: string;
  caption: string;
  sortOrder: number;
}

// ── Galleries ──
export type GalleryType = "photo" | "video";

export interface Gallery {
  id: number;
  title: string;
  description: string;
  type: GalleryType;
  media: Media[];
  createdAt: string;
}

export interface Media {
  id: number;
  galleryId: number;
  filename?: string | null;
  url: string;
  caption: string;
  sortOrder: number;
}

// ── Contacts ──
export interface ContactMessage {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

// ── Users (for admin dashboard) ──
export type UserRole = "superadmin" | "admin";

export interface User {
  id: string; // Better Auth uses UUID strings
  name: string;
  email: string;
  role: UserRole;
}
