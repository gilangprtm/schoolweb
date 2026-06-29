"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { contacts } from "@/lib/db/schema";
import { ContactSchema } from "@/lib/validations";
import { auth } from "@/lib/auth";
import { eq, desc, count, and } from "drizzle-orm";
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

// ── Public ──

export async function createContact(data: FormData) {
  const raw = Object.fromEntries(data.entries());
  const parsed = ContactSchema.parse(raw);

  await db.insert(contacts).values({
    name: parsed.name,
    email: parsed.email,
    phone: parsed.phone || null,
    message: parsed.message,
  });

  revalidatePath("/kontak");
}

// ── Admin Queries ──

export async function getContacts(filters?: {
  status?: "all" | "unread" | "read";
  page?: number;
  limit?: number;
}) {
  const conditions = [];

  if (filters?.status === "unread") {
    conditions.push(eq(contacts.isRead, false));
  } else if (filters?.status === "read") {
    conditions.push(eq(contacts.isRead, true));
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;
  const limit = filters?.limit || 10;
  const page = filters?.page || 1;
  const offset = (page - 1) * limit;

  const [data, totalResult] = await Promise.all([
    db
      .select()
      .from(contacts)
      .where(where)
      .orderBy(desc(contacts.createdAt))
      .limit(limit)
      .offset(offset),
    db
      .select({ value: count() })
      .from(contacts)
      .where(where),
  ]);

  return { data, total: totalResult[0]?.value ?? 0, page, limit };
}

export async function getContactById(id: number) {
  const result = await db
    .select()
    .from(contacts)
    .where(eq(contacts.id, id))
    .limit(1);
  return result[0] || null;
}

export async function getUnreadCount() {
  const result = await db
    .select({ value: count() })
    .from(contacts)
    .where(eq(contacts.isRead, false));
  return result[0]?.value ?? 0;
}

// ── Admin Mutations ──

export async function markAsRead(id: number) {
  await requireAuth();
  await db
    .update(contacts)
    .set({ isRead: true })
    .where(eq(contacts.id, id));
  revalidatePath("/admin/pesan");
}

export async function markAllAsRead() {
  await requireAuth();
  await db
    .update(contacts)
    .set({ isRead: true })
    .where(eq(contacts.isRead, false));
  revalidatePath("/admin/pesan");
}

export async function deleteContact(id: number) {
  await requireAuth();
  await db.delete(contacts).where(eq(contacts.id, id));
  revalidatePath("/admin/pesan");
}
