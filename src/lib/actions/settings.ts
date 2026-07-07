"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { settings } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import type { SiteSettings } from "@/types";

async function requireSuperAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  if (session.user.role !== "superadmin") {
    throw new Error("Forbidden: superadmin only");
  }
  return session.user;
}

// ── Public ──

/**
 * Get all settings as a key-value map.
 * Does NOT require auth — used by public pages.
 */
export async function getAllSettings(): Promise<SiteSettings> {
  const rows = await db.select().from(settings);

  const map: Record<string, string> = {};
  for (const row of rows) {
    map[row.key] = row.value;
  }

  return {
    schoolName: map.schoolName || "SMP Negeri 17 Denpasar",
    tagline: map.tagline || "",
    address: map.address || "",
    phone: map.phone || "",
    email: map.email || "",
    jamOperasional: map.jamOperasional || "",
    akreditasi: map.akreditasi || "",
    logo_url: map.logo_url || "",
    favicon_url: map.favicon_url || "",
    studentCount: map.studentCount || "500",
    establishedYear: map.establishedYear || "15",
    social: {
      facebook: map.social_facebook || "",
      instagram: map.social_instagram || "",
      youtube: map.social_youtube || "",
      tiktok: map.social_tiktok || "",
      twitter: map.social_twitter || "",
    },
    googleMapsEmbedUrl: map.googleMapsEmbedUrl || "",
  };
}

// ── Admin Mutations (superadmin only) ──

export async function updateSettings(updates: Partial<Record<string, string>>) {
  await requireSuperAdmin();

  // Validate limits for studentCount and establishedYear if provided
  if (updates.studentCount && updates.studentCount.length > 5) updates.studentCount = updates.studentCount.substring(0, 5);
  if (updates.establishedYear && updates.establishedYear.length > 4) updates.establishedYear = updates.establishedYear.substring(0, 4);

  const entries = Object.entries(updates);
  for (const [key, value] of Object.entries(updates)) {
    const existing = await db
      .select()
      .from(settings)
      .where(eq(settings.key, key))
      .limit(1);

    if (existing[0]) {
      await db
        .update(settings)
        .set({ value })
        .where(eq(settings.key, key));
    } else {
      await db.insert(settings).values({ key, value });
    }
  }

  revalidatePath("/");
  revalidatePath("/admin/pengaturan");
}
