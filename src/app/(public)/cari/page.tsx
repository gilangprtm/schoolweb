// ═══════════════════════════════════════════
// Search Page — Full search results page
// Route: /cari?q=...
// ═══════════════════════════════════════════

import { Metadata } from "next";
import { searchContent } from "@/lib/search";
import type { SearchResult } from "@/lib/search";
import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Pencarian — SMPN 17 Denpasar",
  description: "Cari konten di website SMPN 17 Denpasar",
};

const sourceLabels: Record<string, { label: string; color: string }> = {
  posts: { label: "Berita", color: "bg-blue-100 text-blue-700" },
  staff: { label: "Guru/Staf", color: "bg-green-100 text-green-700" },
  achievements: { label: "Prestasi", color: "bg-amber-100 text-amber-700" },
  facilities: { label: "Fasilitas", color: "bg-purple-100 text-purple-700" },
  pages: { label: "Halaman", color: "bg-gray-100 text-gray-700" },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; source?: string }>;
}) {
  const { q, source } = await searchParams;
  const query = q || "";
  let results: SearchResult[] = [];
  let total = 0;

  if (query.trim().length >= 2) {
    try {
      const data = await searchContent({
        query: query.trim(),
        source: (source as SearchResult["source"]) || "all",
        limit: 50,
      });
      results = data.results;
      total = data.total;
    } catch {
      // Search failed — show empty state
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Hasil Pencarian
          </h1>
          <p className="text-gray-500">
            {query.trim().length >= 2
              ? `${total} hasil untuk "${query}"`
              : "Ketik minimal 2 karakter untuk mencari"}
          </p>
        </div>

        {/* Search form */}
        <form className="mb-8" method="GET" action="/cari">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="Cari berita, guru, prestasi, fasilitas..."
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300
                         text-gray-900 placeholder:text-gray-400 focus:outline-none
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium
                       hover:bg-blue-700 transition-colors"
            >
              Cari
            </button>
          </div>
        </form>

        {/* Results list */}
        {results.length > 0 && (
          <div className="space-y-4">
            {results.map((result) => {
              const source = sourceLabels[result.source] || {
                label: result.source,
                color: "bg-gray-100 text-gray-700",
              };
              return (
                <Link
                  key={result.id}
                  href={result.url}
                  className="block bg-white rounded-lg border border-gray-200 p-4
                           hover:shadow-md hover:border-blue-200 transition-all group"
                >
                  <div className="flex items-start gap-4">
                    {result.imageUrl && (
                      <img
                        src={result.imageUrl}
                        alt=""
                        className="w-20 h-20 rounded-lg object-cover shrink-0 bg-gray-100"
                        loading="lazy"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${source.color}`}
                        >
                          {source.label}
                        </span>
                        {result.subtitle && (
                          <span className="text-xs text-gray-400">
                            {result.subtitle}
                          </span>
                        )}
                      </div>
                      <h2 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {result.title}
                      </h2>
                      {result.excerpt && (
                        <p
                          className="text-sm text-gray-500 mt-1 line-clamp-2"
                          dangerouslySetInnerHTML={{
                            __html: result.excerpt.replace(
                              /\*\*(.+?)\*\*/g,
                              "<mark class='bg-yellow-100 rounded px-0.5'>$1</mark>",
                            ),
                          }}
                        />
                      )}
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 shrink-0 mt-2 transition-colors" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Empty state */}
        {query.trim().length >= 2 && results.length === 0 && (
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">
              Tidak ada hasil untuk &quot;{query}&quot;
            </p>
            <p className="text-gray-400 text-sm">
              Coba kata kunci lain atau periksa ejaan
            </p>
          </div>
        )}

        {/* Initial state */}
        {query.trim().length < 2 && (
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Ketik sesuatu untuk memulai pencarian</p>
          </div>
        )}
      </div>
    </div>
  );
}
