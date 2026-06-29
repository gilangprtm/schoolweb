"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { PostSchema, PostUpdateSchema } from "@/lib/validations";
import { auth } from "@/lib/auth";
import { eq, and, ilike, desc, count } from "drizzle-orm";
import { headers } from "next/headers";

// ── Auth Helper ──

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

export async function getPosts(filters?: {
  category?: "news" | "announcement";
  search?: string;
  status?: "published" | "draft" | "all";
  page?: number;
  limit?: number;
}) {
  const conditions = [];

  if (filters?.category) {
    conditions.push(eq(posts.category, filters.category));
  }

  if (filters?.status === "published") {
    conditions.push(eq(posts.isPublished, true));
  } else if (filters?.status === "draft") {
    conditions.push(eq(posts.isPublished, false));
  }

  if (filters?.search) {
    conditions.push(ilike(posts.title, `%${filters.search}%`));
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;
  const limit = filters?.limit || 10;
  const page = filters?.page || 1;
  const offset = (page - 1) * limit;

  const [data, totalResult] = await Promise.all([
    db
      .select()
      .from(posts)
      .where(where)
      .orderBy(desc(posts.publishedAt))
      .limit(limit)
      .offset(offset),
    db
      .select({ value: count() })
      .from(posts)
      .where(where),
  ]);

  return {
    data,
    total: totalResult[0]?.value ?? 0,
    page,
    limit,
  };
}

export async function getPostById(id: number) {
  const result = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
  return result[0] || null;
}

export async function getPostBySlug(slug: string) {
  const result = await db
    .select()
    .from(posts)
    .where(and(eq(posts.slug, slug), eq(posts.isPublished, true)))
    .limit(1);
  return result[0] || null;
}

export async function getLatestPosts(limit: number = 3) {
  return db
    .select()
    .from(posts)
    .where(eq(posts.isPublished, true))
    .orderBy(desc(posts.publishedAt))
    .limit(limit);
}

export async function getPostCount() {
  const result = await db
    .select({ value: count() })
    .from(posts)
    .where(eq(posts.isPublished, true));
  return result[0]?.value ?? 0;
}

// ── Admin Mutations ──

export async function createPost(data: FormData) {
  const user = await requireAuth();

  const raw = Object.fromEntries(data.entries());
  const parsed = PostSchema.parse({
    ...raw,
    isPublished: raw.isPublished === "true" || raw.isPublished === "on",
  });

  await db.insert(posts).values({
    ...parsed,
    publishedAt: parsed.publishedAt
      ? new Date(parsed.publishedAt)
      : new Date(),
  });

  revalidatePath("/berita");
  revalidatePath("/admin/berita");
  revalidatePath("/");
  redirect("/admin/berita");
}

export async function updatePost(id: number, data: FormData) {
  await requireAuth();

  const raw = Object.fromEntries(data.entries());
  const parsed = PostUpdateSchema.parse({
    ...raw,
    isPublished:
      raw.isPublished === "true" || raw.isPublished === "on"
        ? true
        : raw.isPublished === "false"
          ? false
          : undefined,
  });

  // Remove undefined values
  const updateData: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(parsed)) {
    if (value !== undefined) {
      if (key === "publishedAt" && value) {
        updateData[key] = new Date(value as string);
      } else {
        updateData[key] = value;
      }
    }
  }

  if (Object.keys(updateData).length > 0) {
    await db.update(posts).set(updateData).where(eq(posts.id, id));
  }

  revalidatePath("/berita");
  revalidatePath("/admin/berita");
  revalidatePath("/");
  redirect("/admin/berita");
}

export async function deletePost(id: number) {
  await requireAuth();
  await db.delete(posts).where(eq(posts.id, id));
  revalidatePath("/berita");
  revalidatePath("/admin/berita");
  revalidatePath("/");
}
