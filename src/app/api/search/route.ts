// ═══════════════════════════════════════════
// Search API — GET /api/search?q=...&source=...&limit=...
// ═══════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { searchContent } from "@/lib/search";
import type { SearchSource } from "@/lib/search";

const VALID_SOURCES: SearchSource[] = [
  "all",
  "posts",
  "staff",
  "achievements",
  "facilities",
  "pages",
];

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = searchParams.get("q") || "";
  const sourceParam = searchParams.get("source") || "all";
  const limit = Math.min(parseInt(searchParams.get("limit") || "20", 10), 50);
  const offset = Math.max(parseInt(searchParams.get("offset") || "0", 10), 0);

  // Validate source
  const source = VALID_SOURCES.includes(sourceParam as SearchSource)
    ? (sourceParam as SearchSource)
    : "all";

  // Require at least 2 characters for search
  if (!query || query.trim().length < 2) {
    return NextResponse.json({
      success: true,
      data: { results: [], total: 0, query: "" },
      meta: { query, source, limit, offset },
    });
  }

  try {
    const data = await searchContent({ query: query.trim(), source, limit, offset });

    return NextResponse.json({
      success: true,
      data,
      meta: { query, source, limit, offset },
    });
  } catch (error) {
    console.error("[Search API] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Gagal melakukan pencarian. Silakan coba lagi.",
        data: { results: [], total: 0, query },
      },
      { status: 500 },
    );
  }
}

/**
 * POST search for longer queries or advanced filters.
 * Body: { query: string, source?: string, limit?: number, offset?: number }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const query = body.query || "";
    const sourceParam = body.source || "all";
    const limit = Math.min(body.limit || 20, 50);
    const offset = Math.max(body.offset || 0, 0);

    const source = VALID_SOURCES.includes(sourceParam as SearchSource)
      ? (sourceParam as SearchSource)
      : "all";

    if (!query || query.trim().length < 2) {
      return NextResponse.json({
        success: true,
        data: { results: [], total: 0, query: "" },
      });
    }

    const data = await searchContent({ query: query.trim(), source, limit, offset });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("[Search API] Error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal melakukan pencarian." },
      { status: 500 },
    );
  }
}
