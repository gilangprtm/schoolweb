"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { facilities, facilityPhotos } from "@/lib/db/schema";
import { FacilitySchema, FacilityUpdateSchema } from "@/lib/validations";
import { auth } from "@/lib/auth";
import { eq, and, asc, count } from "drizzle-orm";
import { headers } from "next/headers";
import { deleteFile } from "@/lib/upload";

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

export async function getFacilities(filters?: {
  category?: string;
  page?: number;
  limit?: number;
}) {
  const conditions = [eq(facilities.isPublished, true)];

  if (filters?.category && filters.category !== "all") {
    conditions.push(eq(facilities.category, filters.category));
  }

  const where = and(...conditions);
  const limit = filters?.limit || 12;
  const page = filters?.page || 1;
  const offset = (page - 1) * limit;

  const [data, totalResult] = await Promise.all([
    db
      .select()
      .from(facilities)
      .where(where)
      .orderBy(asc(facilities.sortOrder))
      .limit(limit)
      .offset(offset),
    db
      .select({ value: count() })
      .from(facilities)
      .where(where),
  ]);

  return { data, total: totalResult[0]?.value ?? 0, page, limit };
}

export async function getFacilityBySlug(slug: string) {
  const result = await db
    .select()
    .from(facilities)
    .where(
      and(eq(facilities.slug, slug), eq(facilities.isPublished, true))
    )
    .limit(1);

  if (!result[0]) return null;

  const photos = await db
    .select()
    .from(facilityPhotos)
    .where(eq(facilityPhotos.facilityId, result[0].id))
    .orderBy(asc(facilityPhotos.sortOrder));

  return { ...result[0], photos };
}

export async function getFacilityById(id: number) {
  const result = await db
    .select()
    .from(facilities)
    .where(eq(facilities.id, id))
    .limit(1);

  if (!result[0]) return null;

  const photos = await db
    .select()
    .from(facilityPhotos)
    .where(eq(facilityPhotos.facilityId, id))
    .orderBy(asc(facilityPhotos.sortOrder));

  return { ...result[0], photos };
}

export async function getFeaturedFacilities(limit: number = 6) {
  return db
    .select()
    .from(facilities)
    .where(
      and(
        eq(facilities.isFeatured, true),
        eq(facilities.isPublished, true)
      )
    )
    .orderBy(asc(facilities.sortOrder))
    .limit(limit);
}

export async function getFacilityCount() {
  const result = await db
    .select({ value: count() })
    .from(facilities)
    .where(eq(facilities.isPublished, true));
  return result[0]?.value ?? 0;
}

// ── Admin Mutations ──

export async function createFacility(data: FormData) {
  await requireAuth();

  const raw = Object.fromEntries(data.entries());
  const parsed = FacilitySchema.parse({
    ...raw,
    isFeatured: raw.isFeatured === "true" || raw.isFeatured === "on",
    isPublished:
      raw.isPublished === "true" ||
      raw.isPublished === "on" ||
      raw.isPublished === undefined,
  });

  await db.insert(facilities).values(parsed);

  revalidatePath("/fasilitas");
  revalidatePath("/admin/fasilitas");
  revalidatePath("/");
  redirect("/admin/fasilitas");
}

export async function updateFacility(id: number, data: FormData) {
  await requireAuth();

  const raw = Object.fromEntries(data.entries());
  const parsed = FacilityUpdateSchema.parse({
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
    await db.update(facilities).set(updateData).where(eq(facilities.id, id));
  }

  revalidatePath("/fasilitas");
  revalidatePath("/admin/fasilitas");
  revalidatePath("/");
  redirect("/admin/fasilitas");
}

export async function deleteFacility(id: number) {
  await requireAuth();

  // Clean up photos from disk
  const photos = await db
    .select()
    .from(facilityPhotos)
    .where(eq(facilityPhotos.facilityId, id));

  for (const photo of photos) {
    await deleteFile(photo.url);
  }

  // DB cascade handles facility_photos deletion
  await db.delete(facilities).where(eq(facilities.id, id));

  revalidatePath("/fasilitas");
  revalidatePath("/admin/fasilitas");
  revalidatePath("/");
}

export async function addFacilityPhoto(facilityId: number, data: {
  filename: string;
  url: string;
  caption?: string;
  sortOrder?: number;
}) {
  await requireAuth();

  await db.insert(facilityPhotos).values({
    facilityId,
    filename: data.filename,
    url: data.url,
    caption: data.caption || "",
    sortOrder: data.sortOrder || 0,
  });

  revalidatePath("/fasilitas");
  revalidatePath("/admin/fasilitas");
}

export async function deleteFacilityPhoto(photoId: number) {
  await requireAuth();

  const photos_result = await db
    .select()
    .from(facilityPhotos)
    .where(eq(facilityPhotos.id, photoId))
    .limit(1);

  if (photos_result[0]) {
    await deleteFile(photos_result[0].url);
    await db.delete(facilityPhotos).where(eq(facilityPhotos.id, photoId));
  }

  revalidatePath("/fasilitas");
  revalidatePath("/admin/fasilitas");
}
