// ═══════════════════════════════════════════
// PostgreSQL Full-Text Search — kb93 + kb82 implementation
// ═══════════════════════════════════════════

import { db, schema } from "@/lib/db";
import { sql, ilike, or, eq, desc, and } from "drizzle-orm";
import { posts, staff, achievements, facilities, pages } from "@/lib/db/schema";

export type SearchSource = "posts" | "staff" | "achievements" | "facilities" | "pages" | "all";

export interface SearchResult {
  /** Unique result identifier */
  id: string;
  /** Source type */
  source: SearchSource;
  /** Display title */
  title: string;
  /** Matching excerpt (max 300 chars with highlighting markers) */
  excerpt: string;
  /** URL path to the detail page */
  url: string;
  /** Optional image URL */
  imageUrl?: string;
  /** Relevance score (0-1, higher = better match) */
  score: number;
  /** Additional context (e.g., "Kepala Sekolah" for staff, "Juara 1" for achievements) */
  subtitle?: string;
}

export interface SearchOptions {
  query: string;
  source?: SearchSource;
  limit?: number;
  offset?: number;
  /** Minimum relevance score threshold (0-1) */
  minScore?: number;
}

/**
 * Normalize and prepare query for PostgreSQL full-text search.
 * Converts user query to tsquery-compatible format.
 *
 * Strategy:
 * - Split query into terms
 * - Join with `&` (AND) for precision, fallback to `|` (OR) for recall
 * - Prefix-match each term with `:*` for partial word matching
 */
function toTsQuery(query: string): string {
  const cleaned = query
    .replace(/[^\w\s]/g, " ")    // Remove special chars
    .replace(/\s+/g, " ")         // Normalize whitespace
    .trim();

  if (!cleaned) return "";

  const terms = cleaned.split(/\s+/).filter((t) => t.length > 0);

  // Short queries: OR for recall. Longer queries: AND for precision.
  const operator = terms.length <= 2 ? " | " : " & ";

  return terms.map((t) => `${t}:*`).join(operator);
}

/**
 * Calculate a simple relevance score based on match type.
 * For production, use ts_rank() or a reranker model.
 */
function computeScore(
  query: string,
  title: string,
  content: string,
  exactMatch: boolean,
): number {
  const q = query.toLowerCase();
  const t = title.toLowerCase();
  const c = content.toLowerCase();

  // Exact title match = highest score
  if (t === q) return 1.0;
  // Title starts with query
  if (t.startsWith(q)) return 0.9;
  // Title contains query
  if (t.includes(q)) return 0.8;
  // Content contains exact phrase
  if (c.includes(q)) return 0.6;
  // Individual term matches
  const terms = q.split(/\s+/);
  const titleMatches = terms.filter((term) => t.includes(term)).length;
  const contentMatches = terms.filter((term) => c.includes(term)).length;
  const totalTerms = terms.length;
  if (totalTerms === 0) return 0;
  const score = (titleMatches * 2 + contentMatches) / (totalTerms * 3);
  return Math.round(score * 100) / 100;
}

/**
 * Generate excerpt with the matching term highlighted.
 * Uses ** markers (can be replaced with <mark> in UI).
 */
function generateExcerpt(content: string, query: string, maxLen = 300): string {
  if (!content) return "";

  const q = query.toLowerCase();
  const c = content.toLowerCase();
  const idx = c.indexOf(q);

  if (idx === -1) {
    // Try individual terms
    const terms = q.split(/\s+/);
    let bestIdx = -1;
    for (const term of terms) {
      const i = c.indexOf(term);
      if (i !== -1 && (bestIdx === -1 || i < bestIdx)) {
        bestIdx = i;
      }
    }
    if (bestIdx === -1) {
      return content.slice(0, maxLen) + (content.length > maxLen ? "..." : "");
    }
    const start = Math.max(0, bestIdx - 60);
    const end = Math.min(content.length, bestIdx + maxLen);
    let excerpt = content.slice(start, end);
    if (start > 0) excerpt = "..." + excerpt;
    if (end < content.length) excerpt = excerpt + "...";
    // Highlight
    for (const term of terms) {
      const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
      excerpt = excerpt.replace(regex, "**$1**");
    }
    return excerpt;
  }

  const start = Math.max(0, idx - 60);
  const end = Math.min(content.length, idx + maxLen);
  let excerpt = content.slice(start, end);
  if (start > 0) excerpt = "..." + excerpt;
  if (end < content.length) excerpt = excerpt + "...";

  // Highlight all term occurrences
  const terms = q.split(/\s+/);
  for (const term of terms) {
    const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    excerpt = excerpt.replace(regex, "**$1**");
  }

  return excerpt;
}

/**
 * Strip HTML tags for plain text search indexing.
 */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&[^;]+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// ═══════════════════════════════════════════
// Per-source search functions
// ═══════════════════════════════════════════

async function searchPosts(
  query: string,
  limit: number,
  minScore: number,
): Promise<SearchResult[]> {
  const results = await db
    .select({
      id: posts.id,
      title: posts.title,
      content: posts.content,
      excerpt: posts.excerpt,
      imageUrl: posts.imageUrl,
      category: posts.category,
      slug: posts.slug,
    })
    .from(posts)
    .where(
      and(
        eq(posts.isPublished, true),
        or(
          ilike(posts.title, `%${query}%`),
          ilike(posts.content, `%${query}%`),
          ilike(posts.excerpt, `%${query}%`),
        )!
      )
    )
    .orderBy(desc(posts.publishedAt))
    .limit(limit);

  return results
    .map((r) => ({
      id: `posts:${r.id}`,
      source: "posts" as SearchSource,
      title: r.title,
      excerpt: generateExcerpt(stripHtml(r.content || r.excerpt), query),
      url: `/berita/${r.slug}`,
      imageUrl: r.imageUrl || undefined,
      score: computeScore(query, r.title, stripHtml(r.content), false),
      subtitle: r.category === "news" ? "Berita" : "Pengumuman",
    }))
    .filter((r) => r.score >= minScore);
}

async function searchStaff(
  query: string,
  limit: number,
  minScore: number,
): Promise<SearchResult[]> {
  const results = await db
    .select({
      id: staff.id,
      name: staff.name,
      role: staff.role,
      subject: staff.subject,
      bio: staff.bio,
      photoUrl: staff.photoUrl,
      slug: staff.slug,
    })
    .from(staff)
    .where(
      and(
        eq(staff.isActive, true),
        or(
          ilike(staff.name, `%${query}%`),
          ilike(staff.bio, `%${query}%`),
          ilike(staff.subject!, `%${query}%`),
        )!
      )
    )
    .limit(limit);

  return results
    .map((r) => ({
      id: `staff:${r.id}`,
      source: "staff" as SearchSource,
      title: r.name,
      excerpt: generateExcerpt(r.bio || "", query),
      url: `/guru-dan-staf/${r.slug}`,
      imageUrl: r.photoUrl || undefined,
      score: computeScore(query, r.name, r.bio || "", false),
      subtitle: r.role === "headmaster"
        ? "Kepala Sekolah"
        : r.role === "teacher"
          ? `Guru ${r.subject || ""}`
          : "Staf",
    }))
    .filter((r) => r.score >= minScore);
}

async function searchAchievements(
  query: string,
  limit: number,
  minScore: number,
): Promise<SearchResult[]> {
  const results = await db
    .select({
      id: achievements.id,
      title: achievements.title,
      description: achievements.description,
      level: achievements.level,
      champion: achievements.champion,
      imageUrl: achievements.imageUrl,
      slug: achievements.slug,
    })
    .from(achievements)
    .where(
      and(
        eq(achievements.isPublished, true),
        or(
          ilike(achievements.title, `%${query}%`),
          ilike(achievements.description, `%${query}%`),
        )!
      )
    )
    .limit(limit);

  const championLabels: Record<string, string> = {
    "1": "Juara 1",
    "2": "Juara 2",
    "3": "Juara 3",
    harapan: "Harapan",
    peserta: "Peserta",
  };

  return results
    .map((r) => ({
      id: `achievements:${r.id}`,
      source: "achievements" as SearchSource,
      title: r.title,
      excerpt: generateExcerpt(r.description || "", query),
      url: `/prestasi/${r.slug}`,
      imageUrl: r.imageUrl || undefined,
      score: computeScore(query, r.title, r.description || "", false),
      subtitle: `${championLabels[r.champion] || ""} — Tingkat ${r.level}`,
    }))
    .filter((r) => r.score >= minScore);
}

async function searchFacilities(
  query: string,
  limit: number,
  minScore: number,
): Promise<SearchResult[]> {
  const results = await db
    .select({
      id: facilities.id,
      name: facilities.name,
      description: facilities.description,
      category: facilities.category,
      photoUrl: facilities.photoUrl,
      slug: facilities.slug,
    })
    .from(facilities)
    .where(
      and(
        eq(facilities.isPublished, true),
        or(
          ilike(facilities.name, `%${query}%`),
          ilike(facilities.description, `%${query}%`),
        )!
      )
    )
    .limit(limit);

  const categoryLabels: Record<string, string> = {
    akademik: "Fasilitas Akademik",
    olahraga: "Fasilitas Olahraga",
    seni: "Fasilitas Seni",
    ibadah: "Fasilitas Ibadah",
    teknologi: "Fasilitas Teknologi",
    lainnya: "Fasilitas",
  };

  return results
    .map((r) => ({
      id: `facilities:${r.id}`,
      source: "facilities" as SearchSource,
      title: r.name,
      excerpt: generateExcerpt(r.description || "", query),
      url: `/fasilitas/${r.slug}`,
      imageUrl: r.photoUrl || undefined,
      score: computeScore(query, r.name, r.description || "", false),
      subtitle: categoryLabels[r.category] || "Fasilitas",
    }))
    .filter((r) => r.score >= minScore);
}

async function searchPages(
  query: string,
  limit: number,
  minScore: number,
): Promise<SearchResult[]> {
  const results = await db
    .select({
      id: pages.id,
      title: pages.title,
      content: pages.content,
      slug: pages.slug,
    })
    .from(pages)
    .where(
      or(
        ilike(pages.title, `%${query}%`),
        ilike(pages.content, `%${query}%`),
      )!
    )
    .limit(limit);

  return results
    .map((r) => ({
      id: `pages:${r.id}`,
      source: "pages" as SearchSource,
      title: r.title,
      excerpt: generateExcerpt(stripHtml(r.content), query),
      url: `/profil`,
      score: computeScore(query, r.title, stripHtml(r.content), false),
      subtitle: "Halaman Profil",
    }))
    .filter((r) => r.score >= minScore);
}

// ═══════════════════════════════════════════
// Main search entry point
// ═══════════════════════════════════════════

/**
 * Search across all content types in SchoolWeb.
 *
 * Uses PostgreSQL ILIKE for text matching (always available, no extension needed).
 * For production with >1000 records, consider:
 * 1. Adding tsvector column + GIN index (enable pg_trgm extension)
 * 2. Adding vector embeddings (enable pgvector extension)
 * 3. Adding a dedicated search index (Meilisearch/Typesense)
 *
 * @example
 * const results = await searchContent({ query: "laboratorium komputer" });
 * // Returns posts, facilities, achievements matching the query
 */
export async function searchContent(
  options: SearchOptions,
): Promise<{ results: SearchResult[]; total: number; query: string }> {
  const {
    query,
    source = "all",
    limit = 20,
    offset = 0,
    minScore = 0.1,
  } = options;

  if (!query || query.trim().length === 0) {
    return { results: [], total: 0, query: "" };
  }

  const trimmedQuery = query.trim();

  // Execute searches in parallel for all relevant sources
  const searches: Promise<SearchResult[]>[] = [];

  if (source === "all" || source === "posts") {
    searches.push(searchPosts(trimmedQuery, limit, minScore));
  }
  if (source === "all" || source === "staff") {
    searches.push(searchStaff(trimmedQuery, limit, minScore));
  }
  if (source === "all" || source === "achievements") {
    searches.push(searchAchievements(trimmedQuery, limit, minScore));
  }
  if (source === "all" || source === "facilities") {
    searches.push(searchFacilities(trimmedQuery, limit, minScore));
  }
  if (source === "all" || source === "pages") {
    searches.push(searchPages(trimmedQuery, limit, minScore));
  }

  const allResults = (await Promise.all(searches)).flat();

  // Sort by relevance score descending
  allResults.sort((a, b) => b.score - a.score);

  const total = allResults.length;
  const paginated = allResults.slice(offset, offset + limit);

  return {
    results: paginated,
    total,
    query: trimmedQuery,
  };
}

/**
 * Quick search — returns top 5 results across all sources.
 * Use for autocomplete / search-as-you-type.
 */
export async function quickSearch(query: string): Promise<SearchResult[]> {
  if (!query || query.trim().length < 2) return [];
  const { results } = await searchContent({ query: query.trim(), limit: 5 });
  return results;
}
