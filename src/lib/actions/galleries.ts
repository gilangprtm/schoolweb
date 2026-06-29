"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { galleries, media } from "@/lib/db/schema";
import { GallerySchema, GalleryUpdateSchema } from "@/lib/validations";
import { auth } from "@/lib/auth";
import { eq, asc, count } from "drizzle-orm";
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

export async function getGalleries() {
  const allGalleries = await db
    .select()
    .from(galleries)
    .orderBy(galleries.createdAt);

  // Fetch media for each gallery
  const result = [];
  for (const gallery of allGalleries) {
    const mediaItems = await db
      .select()
      .from(media)
      .where(eq(media.galleryId, gallery.id))
      .orderBy(asc(media.sortOrder));
    result.push({ ...gallery, media: mediaItems });
  }

  return result;
}

export async function getGalleryById(id: number) {
  const result = await db
    .select()
    .from(galleries)
    .where(eq(galleries.id, id))
    .limit(1);

  if (!result[0]) return null;

  const mediaItems = await db
    .select()
    .from(media)
    .where(eq(media.galleryId, id))
    .orderBy(asc(media.sortOrder));

  return { ...result[0], media: mediaItems };
}

export async function getGalleryCount() {
  const result = await db
    .select({ value: count() })
    .from(galleries);
  return result[0]?.value ?? 0;
}

// ── Admin Mutations ──

export async function createGallery(data: FormData) {
  await requireAuth();

  const raw = Object.fromEntries(data.entries());
  const parsed = GallerySchema.parse(raw);

  await db.insert(galleries).values(parsed);

  revalidatePath("/galeri");
  revalidatePath("/admin/galeri");
  redirect("/admin/galeri");
}

export async function updateGallery(id: number, data: FormData) {
  await requireAuth();

  const raw = Object.fromEntries(data.entries());
  const parsed = GalleryUpdateSchema.parse(raw);

  const updateData: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(parsed)) {
    if (value !== undefined) {
      updateData[key] = value;
    }
  }

  if (Object.keys(updateData).length > 0) {
    await db.update(galleries).set(updateData).where(eq(galleries.id, id));
  }

  revalidatePath("/galeri");
  revalidatePath("/admin/galeri");
}

export async function deleteGallery(id: number) {
  await requireAuth();

  // Clean up media files from disk
  const mediaItems = await db
    .select()
    .from(media)
    .where(eq(media.galleryId, id));

  for (const item of mediaItems) {
    await deleteFile(item.url);
  }

  // DB cascade handles media deletion
  await db.delete(galleries).where(eq(galleries.id, id));

  revalidatePath("/galeri");
  revalidatePath("/admin/galeri");
}

export async function addMediaToGallery(
  galleryId: number,
  fileData: { filename: string; url: string; caption?: string }
) {
  await requireAuth();

  // Get current max sort order
  const currentMax = await db
    .select({ maxOrder: media.sortOrder })
    .from(media)
    .where(eq(media.galleryId, galleryId));

  const maxOrder = currentMax[0]?.maxOrder ?? 0;

  await db.insert(media).values({
    galleryId,
    filename: fileData.filename,
    url: fileData.url,
    caption: fileData.caption || "",
    sortOrder: maxOrder + 1,
  });

  revalidatePath("/galeri");
  revalidatePath("/admin/galeri");
}

export async function addVideoToGallery(
  galleryId: number,
  youtubeUrl: string,
  caption?: string
) {
  await requireAuth();

  const currentMax = await db
    .select({ maxOrder: media.sortOrder })
    .from(media)
    .where(eq(media.galleryId, galleryId));

  const maxOrder = currentMax[0]?.maxOrder ?? 0;

  await db.insert(media).values({
    galleryId,
    url: youtubeUrl,
    caption: caption || "",
    sortOrder: maxOrder + 1,
  });

  revalidatePath("/galeri");
  revalidatePath("/admin/galeri");
}

export async function updateMediaCaption(mediaId: number, caption: string) {
  await requireAuth();
  await db.update(media).set({ caption }).where(eq(media.id, mediaId));
  revalidatePath("/galeri");
  revalidatePath("/admin/galeri");
}

export async function updateMediaSortOrder(
  mediaId: number,
  sortOrder: number
) {
  await requireAuth();
  await db.update(media).set({ sortOrder }).where(eq(media.id, mediaId));
  revalidatePath("/galeri");
  revalidatePath("/admin/galeri");
}

export async function deleteMedia(mediaId: number) {
  await requireAuth();

  const mediaItem = await db
    .select()
    .from(media)
    .where(eq(media.id, mediaId))
    .limit(1);

  if (mediaItem[0]) {
    await deleteFile(mediaItem[0].url);
    await db.delete(media).where(eq(media.id, mediaId));
  }

  revalidatePath("/galeri");
  revalidatePath("/admin/galeri");
}
