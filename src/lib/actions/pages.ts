"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { pages } from "@/lib/db/schema";
import { PageUpdateSchema } from "@/lib/validations";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
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

export async function getPageBySlug(slug: string) {
  const result = await db
    .select()
    .from(pages)
    .where(eq(pages.slug, slug))
    .limit(1);
  return result[0] || null;
}

export async function getAllPages() {
  return db.select().from(pages).orderBy(pages.title);
}

export async function getPageById(id: number) {
  const result = await db
    .select()
    .from(pages)
    .where(eq(pages.id, id))
    .limit(1);
  return result[0] || null;
}

// ── Admin Mutations ──

export async function updatePage(id: number, data: FormData) {
  await requireAuth();

  const raw = Object.fromEntries(data.entries());
  const parsed = PageUpdateSchema.parse(raw);

  const updateData: Record<string, unknown> = { updatedAt: new Date() };
  for (const [key, value] of Object.entries(parsed)) {
    if (value !== undefined) {
      updateData[key] = value;
    }
  }

  await db.update(pages).set(updateData).where(eq(pages.id, id));

  const page = await db.select().from(pages).where(eq(pages.id, id)).limit(1);

  revalidatePath("/profil");
  revalidatePath("/admin/halaman");
  if (page[0]) {
    revalidatePath(`/${page[0].slug}`);
  }
  redirect("/admin/halaman");
}
