"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { schoolProfile } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";

export interface SejarahItem {
  year: string;
  title: string;
  description: string;
}

async function requireAuth() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) throw new Error("Unauthorized");
  return session.user;
}

export async function getSchoolProfile() {
  const rows = await db.select().from(schoolProfile).limit(1);
  const row = rows[0];
  if (!row) return { visi: "", misi: [], sejarah: [] as SejarahItem[] };
  try {
    const misi = JSON.parse(row.misi);
    let sejarah: SejarahItem[] = [];
    try {
      const parsedSejarah = JSON.parse(row.sejarah);
      sejarah = Array.isArray(parsedSejarah) ? parsedSejarah : [];
    } catch {
      // Fallback if not JSON
      sejarah = [];
    }
    return { 
      visi: row.visi, 
      misi: Array.isArray(misi) ? misi : [], 
      sejarah 
    };
  } catch {
    return { visi: row.visi, misi: [], sejarah: [] as SejarahItem[] };
  }
}

export async function updateSchoolProfile(data: {
  visi: string;
  misi: string[];
  sejarah: SejarahItem[];
}) {
  await requireAuth();

  const rows = await db.select().from(schoolProfile).limit(1);
  const misiJson = JSON.stringify(data.misi);
  const sejarahJson = JSON.stringify(data.sejarah);

  if (rows.length === 0) {
    await db.insert(schoolProfile).values({
      visi: data.visi,
      misi: misiJson,
      sejarah: sejarahJson,
      updatedAt: new Date(),
    });
  } else {
    await db
      .update(schoolProfile)
      .set({
        visi: data.visi,
        misi: misiJson,
        sejarah: sejarahJson,
        updatedAt: new Date(),
      })
      .where(eq(schoolProfile.id, rows[0].id));
  }

  revalidatePath("/profil");
  revalidatePath("/admin/profil-sekolah");
}
