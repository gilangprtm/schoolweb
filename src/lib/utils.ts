import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type {
  AchievementChampion,
  AchievementLevel,
  FacilityCategory,
} from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ── Date Formatting ──

/**
 * Format ISO date string to Indonesian locale display
 * e.g., "2025-06-20" → "20 Juni 2025"
 */
export function formatDate(
  dateStr: string | Date,
  options?: Intl.DateTimeFormatOptions
): string {
  const date = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...options,
  });
}

/**
 * Format to "Bulan Tahun" (e.g., "Juni 2025")
 */
export function formatMonthYear(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });
}

// ── Achievement Helpers ──

export function formatLevel(level: AchievementLevel): string {
  const map: Record<AchievementLevel, string> = {
    kecamatan: "Kecamatan",
    kabupaten: "Kabupaten/Kota",
    provinsi: "Provinsi",
    nasional: "Nasional",
    internasional: "Internasional",
  };
  return map[level];
}

export function formatChampion(champion: AchievementChampion): string {
  const map: Record<AchievementChampion, string> = {
    "1": "Juara 1",
    "2": "Juara 2",
    "3": "Juara 3",
    harapan: "Harapan",
    peserta: "Peserta",
  };
  return map[champion];
}

export function getChampionEmoji(champion: AchievementChampion): string {
  const map: Record<AchievementChampion, string> = {
    "1": "🥇",
    "2": "🥈",
    "3": "🥉",
    harapan: "🏅",
    peserta: "🎖️",
  };
  return map[champion];
}

export function getLevelBadgeColor(level: AchievementLevel): string {
  const map: Record<AchievementLevel, string> = {
    internasional: "bg-amber-100 text-amber-800 border-amber-200",
    nasional: "bg-red-100 text-red-800 border-red-200",
    provinsi: "bg-blue-100 text-blue-800 border-blue-200",
    kabupaten: "bg-green-100 text-green-800 border-green-200",
    kecamatan: "bg-neutral-100 text-neutral-800 border-neutral-200",
  };
  return map[level];
}

// ── Facility Helpers ──

export function getFacilityIcon(category: FacilityCategory): string {
  const map: Record<FacilityCategory, string> = {
    akademik: "📚",
    olahraga: "⚽",
    seni: "🎨",
    ibadah: "🕌",
    teknologi: "💻",
    lainnya: "🏫",
  };
  return map[category];
}

export function getFacilityCategoryLabel(category: FacilityCategory): string {
  const map: Record<FacilityCategory, string> = {
    akademik: "Akademik",
    olahraga: "Olahraga",
    seni: "Seni",
    ibadah: "Ibadah",
    teknologi: "Teknologi",
    lainnya: "Lainnya",
  };
  return map[category];
}

// ── Slug Generator ──

/**
 * Generate URL-friendly slug from a string
 * e.g., "Drs. Ahmad Fauzi, M.Pd." → "ahmad-fauzi"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // remove non-alphanumeric except spaces/hyphens
    .replace(/[\s]+/g, "-") // replace spaces with hyphens
    .replace(/-+/g, "-") // collapse multiple hyphens
    .replace(/^-+|-+$/g, ""); // trim hyphens
}

// ── Misc ──

/**
 * Truncate text to a max length with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

