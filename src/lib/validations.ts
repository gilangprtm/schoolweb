import { z } from "zod";

// ═══════════════════════════════════════════
// Posts
// ═══════════════════════════════════════════

export const PostSchema = z.object({
  title: z.string().min(1, "Judul wajib diisi"),
  slug: z.string().min(1, "Slug wajib diisi"),
  content: z.string().optional().default(""),
  excerpt: z.string().max(200, "Maksimal 200 karakter").optional().default(""),
  imageUrl: z.string().optional().default(""),
  category: z.enum(["news", "announcement"]).default("news"),
  isPublished: z.boolean().default(false),
  publishedAt: z.string().optional().default(""),
});

export const PostUpdateSchema = PostSchema.partial();

// ═══════════════════════════════════════════
// Staff
// ═══════════════════════════════════════════

export const StaffSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  slug: z.string().min(1, "Slug wajib diisi"),
  role: z.enum(["headmaster", "teacher", "staff"]).default("teacher"),
  subject: z.string().optional().default(""),
  photoUrl: z.string().optional().default(""),
  education: z.string().optional().default(""),
  bio: z.string().optional().default(""),
  email: z.string().email("Email tidak valid").optional().or(z.literal("")),
  phone: z.string().optional().default(""),
  sortOrder: z.coerce.number().int().default(0),
  isActive: z.boolean().default(true),
});

export const StaffUpdateSchema = StaffSchema.partial();

// ═══════════════════════════════════════════
// Achievements
// ═══════════════════════════════════════════

export const AchievementSchema = z.object({
  title: z.string().min(1, "Judul wajib diisi"),
  slug: z.string().min(1, "Slug wajib diisi"),
  description: z.string().optional().default(""),
  category: z.enum(["student", "teacher", "school"]).default("student"),
  level: z
    .enum(["kecamatan", "kabupaten", "provinsi", "nasional", "internasional"])
    .default("kabupaten"),
  champion: z.enum(["1", "2", "3", "harapan", "peserta"]).default("1"),
  organizer: z.string().optional().default(""),
  date: z.string().optional().default(""),
  imageUrl: z.string().optional().default(""),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(true),
});

export const AchievementUpdateSchema = AchievementSchema.partial();

// ═══════════════════════════════════════════
// Facilities
// ═══════════════════════════════════════════

export const FacilitySchema = z.object({
  name: z.string().min(1, "Nama fasilitas wajib diisi"),
  slug: z.string().min(1, "Slug wajib diisi"),
  description: z.string().optional().default(""),
  category: z
    .enum(["akademik", "olahraga", "seni", "ibadah", "teknologi", "lainnya"])
    .default("lainnya"),
  photoUrl: z.string().optional().default(""),
  isFeatured: z.boolean().default(false),
  sortOrder: z.coerce.number().int().default(0),
  isPublished: z.boolean().default(true),
});

export const FacilityUpdateSchema = FacilitySchema.partial();

// ═══════════════════════════════════════════
// Galleries
// ═══════════════════════════════════════════

export const GallerySchema = z.object({
  title: z.string().min(1, "Judul album wajib diisi"),
  description: z.string().optional().default(""),
  type: z.enum(["photo", "video"]).default("photo"),
});

export const GalleryUpdateSchema = GallerySchema.partial();

// ═══════════════════════════════════════════
// Pages
// ═══════════════════════════════════════════

export const PageUpdateSchema = z.object({
  title: z.string().min(1, "Judul wajib diisi").optional(),
  content: z.string().optional(),
});

// ═══════════════════════════════════════════
// Contacts
// ═══════════════════════════════════════════

export const ContactSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  email: z.string().email("Email tidak valid"),
  phone: z.string().optional().default(""),
  message: z.string().min(1, "Pesan wajib diisi"),
});

// ═══════════════════════════════════════════
// Settings
// ═══════════════════════════════════════════

export const SchoolIdentitySchema = z.object({
  schoolName: z.string().min(1),
  tagline: z.string().optional().default(""),
  address: z.string().optional().default(""),
  phone: z.string().optional().default(""),
  email: z.string().optional().default(""),
  jamOperasional: z.string().optional().default(""),
  akreditasi: z.string().optional().default(""),
  logo_url: z.string().optional().default(""),
  favicon_url: z.string().optional().default(""),
  googleMapsEmbedUrl: z.string().optional().default(""),
});

export const SocialMediaSchema = z.object({
  facebook: z.string().optional().default(""),
  instagram: z.string().optional().default(""),
  youtube: z.string().optional().default(""),
  tiktok: z.string().optional().default(""),
  twitter: z.string().optional().default(""),
});

// ═══════════════════════════════════════════
// Users
// ═══════════════════════════════════════════

export const CreateUserSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
  role: z.enum(["superadmin", "admin"]).default("admin"),
});

export const ChangePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Password lama wajib diisi"),
    newPassword: z.string().min(8, "Password baru minimal 8 karakter"),
    confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Password baru dan konfirmasi tidak cocok",
    path: ["confirmPassword"],
  });

// ═══════════════════════════════════════════
// Type exports (inferred from schemas)
// ═══════════════════════════════════════════

export type PostInput = z.infer<typeof PostSchema>;
export type PostUpdateInput = z.infer<typeof PostUpdateSchema>;
export type StaffInput = z.infer<typeof StaffSchema>;
export type StaffUpdateInput = z.infer<typeof StaffUpdateSchema>;
export type AchievementInput = z.infer<typeof AchievementSchema>;
export type AchievementUpdateInput = z.infer<typeof AchievementUpdateSchema>;
export type FacilityInput = z.infer<typeof FacilitySchema>;
export type FacilityUpdateInput = z.infer<typeof FacilityUpdateSchema>;
export type GalleryInput = z.infer<typeof GallerySchema>;
export type GalleryUpdateInput = z.infer<typeof GalleryUpdateSchema>;
export type PageUpdateInput = z.infer<typeof PageUpdateSchema>;
export type ContactInput = z.infer<typeof ContactSchema>;
export type SchoolIdentityInput = z.infer<typeof SchoolIdentitySchema>;
export type SocialMediaInput = z.infer<typeof SocialMediaSchema>;
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;
