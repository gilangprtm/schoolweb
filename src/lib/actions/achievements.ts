"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { achievements } from "@/lib/db/schema";
import {
  AchievementSchema,
  AchievementUpdateSchema,
} from "@/lib/validations";
import { auth } from "@/lib/auth";
import { eq, and, desc, count, gte } from "drizzle-orm";
import { headers } from "next/headers";

async function requireAuth() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session.user;
}

// ── Public Queries ──

export async function getAchievements(filters?: {
  category?: string;
  level?: string;
  year?: string;
  page?: number;
  limit?: number;
}) {
  const conditions = [];

  conditions.push(eq(achievements.isPublished, true));

  if (filters?.category && filters.category !== "all") {
    conditions.push(eq(achievements.category, filters.category));
  }
  if (filters?.level && filters.level !== "all") {
    conditions.push(eq(achievements.level, filters.level));
  }
  if (filters?.year) {
    const year = parseInt(filters.year);
    conditions.push(
      gte(
        achievements.date,
        `${year}-01-01`
      )
    );
  }

  const where = and(...conditions);
  const limit = filters?.limit || 9;
  const page = filters?.page || 1;
  const offset = (page - 1) * limit;

  const [data, totalResult] = await Promise.all([
    db
      .select()
      .from(achievements)
      .where(where)
      .orderBy(desc(achievements.date))
      .limit(limit)
      .offset(offset),
    db
      .select({ value: count() })
      .from(achievements)
      .where(where),
  ]);

  return { data, total: totalResult[0]?.value ?? 0, page, limit };
}

export async function getAchievementBySlug(slug: string) {
  const result = await db
    .select()
    .from(achievements)
    .where(
      and(eq(achievements.slug, slug), eq(achievements.isPublished, true))
    )
    .limit(1);
  return result[0] || null;
}

export async function getAchievementById(id: number) {
  const result = await db
    .select()
    .from(achievements)
    .where(eq(achievements.id, id))
    .limit(1);
  return result[0] || null;
}

export async function getFeaturedAchievements(limit: number = 6) {
  return db
    .select()
    .from(achievements)
    .where(
      and(
        eq(achievements.isFeatured, true),
        eq(achievements.isPublished, true)
      )
    )
    .orderBy(desc(achievements.date))
    .limit(limit);
}

export async function getAchievementCount() {
  const result = await db
    .select({ value: count() })
    .from(achievements)
    .where(eq(achievements.isPublished, true));
  return result[0]?.value ?? 0;
}

// ── Admin Mutations ──

export async function createAchievement(data: FormData) {
  await requireAuth();

  const raw = Object.fromEntries(data.entries());
  const parsed = AchievementSchema.parse({
    ...raw,
    isFeatured:
      raw.isFeatured === "true" || raw.isFeatured === "on",
    isPublished:
      raw.isPublished === "true" ||
      raw.isPublished === "on" ||
      raw.isPublished === undefined,
  });

  await db.insert(achievements).values({
    ...parsed,
    date: parsed.date || undefined,
  });

  revalidatePath("/prestasi");
  revalidatePath("/admin/prestasi");
  revalidatePath("/");
  redirect("/admin/prestasi");
}

export async function updateAchievement(id: number, data: FormData) {
  await requireAuth();

  const raw = Object.fromEntries(data.entries());
  const parsed = AchievementUpdateSchema.parse({
    ...raw,
    isFeatured:
      raw.isFeatured === "true" || raw.isFeatured === "on"
        ? true
        : raw.isFeatured === "false"
          ? false
          : undefined,
    isPublished:
      raw.isPublished === "true" || raw.isPublished === "on"
        ? true
        : raw.isPublished === "false"
          ? false
          : undefined,
  });

  const updateData: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(parsed)) {
    if (value !== undefined) {
      updateData[key] = value;
    }
  }

  if (Object.keys(updateData).length > 0) {
    await db
      .update(achievements)
      .set(updateData)
      .where(eq(achievements.id, id));
  }

  revalidatePath("/prestasi");
  revalidatePath("/admin/prestasi");
  revalidatePath("/");
  redirect("/admin/prestasi");
}

export async function deleteAchievement(id: number) {
  await requireAuth();
  await db.delete(achievements).where(eq(achievements.id, id));
  revalidatePath("/prestasi");
  revalidatePath("/admin/prestasi");
  revalidatePath("/");
}
