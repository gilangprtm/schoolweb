"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { CreateUserSchema, ChangePasswordSchema } from "@/lib/validations";
import { auth } from "@/lib/auth";
import { eq, count } from "drizzle-orm";
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

// ── Queries ──

export async function getUsers() {
  await requireAuth();
  return db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(users.createdAt);
}

export async function getUserById(id: string) {
  await requireAuth();
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result[0] || null;
}

export async function getCurrentUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) return null;

  const result = await db
    .select()
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);
  return result[0] || null;
}

export async function getUserCount() {
  const result = await db.select({ value: count() }).from(users);
  return result[0]?.value ?? 0;
}

// ── Mutations ──

export async function createUser(data: FormData) {
  await requireSuperAdmin();

  const raw = Object.fromEntries(data.entries());
  const parsed = CreateUserSchema.parse(raw);

  // Use Better Auth's signUp
  await auth.api.signUpEmail({
    body: {
      name: parsed.name,
      email: parsed.email,
      password: parsed.password,
    },
  });

  // Set role after creation
  const userRecord = await db
    .select()
    .from(users)
    .where(eq(users.email, parsed.email))
    .limit(1);

  if (userRecord[0]) {
    await db
      .update(users)
      .set({ role: parsed.role })
      .where(eq(users.id, userRecord[0].id));
  }

  revalidatePath("/admin/akun");
  redirect("/admin/akun");
}

export async function updateUserRole(id: string, role: "superadmin" | "admin") {
  await requireSuperAdmin();

  await db.update(users).set({ role }).where(eq(users.id, id));

  revalidatePath("/admin/akun");
}

export async function deleteUser(id: string) {
  const currentUser = await requireSuperAdmin();

  // Can't delete self
  if (currentUser.id === id) {
    throw new Error("Tidak bisa menghapus akun sendiri");
  }

  await db.delete(users).where(eq(users.id, id));

  revalidatePath("/admin/akun");
}

export async function changePassword(data: FormData) {
  const user = await requireAuth();

  const raw = Object.fromEntries(data.entries());
  const parsed = ChangePasswordSchema.parse(raw);

  // Use Better Auth to change password
  await auth.api.changePassword({
    body: {
      currentPassword: parsed.oldPassword,
      newPassword: parsed.newPassword,
      revokeOtherSessions: false,
    },
  });

  revalidatePath("/admin/pengaturan");
}
