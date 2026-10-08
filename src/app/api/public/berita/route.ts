import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await db
      .select({
        id: posts.id,
        title: posts.title,
        slug: posts.slug,
        excerpt: posts.excerpt,
        imageUrl: posts.imageUrl,
        category: posts.category,
        publishedAt: posts.publishedAt,
      })
      .from(posts)
      .where(eq(posts.isPublished, true))
      .orderBy(desc(posts.publishedAt))
      .limit(5);

    return NextResponse.json(
      {
        data: data.map((post) => ({
          ...post,
          url: `https://smpn17denpasar.sch.id/berita/${encodeURIComponent(post.slug)}`,
        })),
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=600, stale-while-revalidate=300",
        },
      },
    );
  } catch {
    return NextResponse.json(
      { error: "Gagal mengambil berita sekolah" },
      { status: 500 },
    );
  }
}
