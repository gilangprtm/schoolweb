"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { staff } from "@/lib/db/schema";
import { StaffSchema, StaffUpdateSchema } from "@/lib/validations";
import { auth } from "@/lib/auth";
import { eq, and, asc, count } from "drizzle-orm";
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

export async function getActiveStaff() {
  return db
    .select()
    .from(staff)
    .where(eq(staff.isActive, true))
    .orderBy(asc(staff.sortOrder));
}

export async function getStaffBySlug(slug: string) {
  const result = await db
    .select()
    .from(staff)
    .where(and(eq(staff.slug, slug), eq(staff.isActive, true)))
    .limit(1);
  return result[0] || null;
}

export async function getStaffById(id: number) {
  const result = await db.select().from(staff).where(eq(staff.id, id)).limit(1);
  return result[0] || null;
}

export async function getAllStaff(filters?: {
  role?: string;
  page?: number;
  limit?: number;
}) {
  const conditions = [];
  if (filters?.role) {
    conditions.push(eq(staff.role, filters.role));
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;
  const limit = filters?.limit || 50;
  const page = filters?.page || 1;
  const offset = (page - 1) * limit;

  const [data, totalResult] = await Promise.all([
    db
      .select()
      .from(staff)
      .where(where)
      .orderBy(asc(staff.sortOrder))
      .limit(limit)
      .offset(offset),
    db
      .select({ value: count() })
      .from(staff)
      .where(where),
  ]);

  return { data, total: totalResult[0]?.value ?? 0, page, limit };
}

export async function getStaffCount() {
  const result = await db
    .select({ value: count() })
    .from(staff)
    .where(eq(staff.isActive, true));
  return result[0]?.value ?? 0;
}

// ── Admin Mutations ──

export async function createStaff(data: FormData) {
  await requireAuth();

  const raw = Object.fromEntries(data.entries());
  const parsed = StaffSchema.parse({
    ...raw,
    isActive: raw.isActive === "true" || raw.isActive === "on",
  });

  await db.insert(staff).values(parsed);

  revalidatePath("/guru-dan-staf");
  revalidatePath("/admin/guru");
  redirect("/admin/guru");
}

export async function updateStaff(id: number, data: FormData) {
  await requireAuth();

  const raw = Object.fromEntries(data.entries());
  const parsed = StaffUpdateSchema.parse({
    ...raw,
    isActive:
      raw.isActive === "true" || raw.isActive === "on"
        ? true
        : raw.isActive === "false"
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
    await db.update(staff).set(updateData).where(eq(staff.id, id));
  }

  revalidatePath("/guru-dan-staf");
  revalidatePath("/admin/guru");
  redirect("/admin/guru");
}

export async function deleteStaff(id: number) {
  await requireAuth();
  await db.delete(staff).where(eq(staff.id, id));
  revalidatePath("/guru-dan-staf");
  revalidatePath("/admin/guru");
}
