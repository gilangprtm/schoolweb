"use client";

// ═══════════════════════════════════════════
// Search Modal — Public site search component
// ═══════════════════════════════════════════

import { useState, useRef, useEffect, useCallback } from "react";
import { Search, X, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { SearchResult } from "@/lib/search";

interface SearchModalProps {
  /** Called when modal opens/closes */
  onOpenChange?: (open: boolean) => void;
}

export function SearchModal({ onOpenChange }: SearchModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const open = useCallback(() => {
    setIsOpen(true);
    onOpenChange?.(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [onOpenChange]);

  const close = useCallback(() => {
    setIsOpen(false);
    onOpenChange?.(false);
    setQuery("");
    setResults([]);
    setTotal(0);
    setError(null);
  }, [onOpenChange]);

  // Keyboard shortcut: Ctrl+K or Cmd+K to open
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        isOpen ? close() : open();
      }
      if (e.key === "Escape" && isOpen) {
        close();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, open, close]);

  // Click outside to close
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        close();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handler);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("mousedown", handler);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  // Debounced search
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      setTotal(0);
      setError(null);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(query.trim())}&limit=8`,
        );
        const json = await res.json();
        if (json.success) {
          setResults(json.data.results);
          setTotal(json.data.total);
        } else {
          setError(json.error || "Pencarian gagal");
        }
      } catch {
        setError("Gagal terhubung ke server");
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const sourceLabels: Record<string, { label: string; color: string }> = {
    posts: { label: "Berita", color: "bg-blue-100 text-blue-700" },
    staff: { label: "Guru/Staf", color: "bg-green-100 text-green-700" },
    achievements: { label: "Prestasi", color: "bg-amber-100 text-amber-700" },
    facilities: { label: "Fasilitas", color: "bg-purple-100 text-purple-700" },
    pages: { label: "Halaman", color: "bg-gray-100 text-gray-700" },
  };

  return (
    <>
      {/* Search trigger button */}
      <button
        onClick={open}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-500 bg-gray-100
                   rounded-lg hover:bg-gray-200 transition-colors border border-gray-200"
        aria-label="Cari (Ctrl+K)"
      >
        <Search className="w-4 h-4" />
        <span className="hidden sm:inline">Cari...</span>
        <kbd className="hidden sm:inline text-xs px-1.5 py-0.5 bg-white rounded border border-gray-300 text-gray-400">
          Ctrl+K
        </kbd>
      </button>

      {/* Search modal overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />

          {/* Modal */}
          <div
            ref={modalRef}
            className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl
                       border border-gray-200 overflow-hidden mx-4"
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200">
              <Search className="w-5 h-5 text-gray-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari berita, guru, prestasi, fasilitas..."
                className="flex-1 outline-none text-base text-gray-900 placeholder:text-gray-400"
                autoComplete="off"
                spellCheck={false}
              />
              {loading && (
                <Loader2 className="w-5 h-5 text-blue-500 animate-spin shrink-0" />
              )}
              {query && !loading && (
                <button
                  onClick={() => setQuery("")}
                  className="shrink-0 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Results */}
            <div className="max-h-[60vh] overflow-y-auto">
              {error && (
                <div className="px-4 py-8 text-center text-red-500 text-sm">
                  {error}
                </div>
              )}

              {!query && !loading && (
                <div className="px-4 py-8 text-center text-gray-400 text-sm">
                  Ketik untuk mencari konten sekolah...
                </div>
              )}

              {query && query.length < 2 && !loading && (
                <div className="px-4 py-8 text-center text-gray-400 text-sm">
                  Minimal 2 karakter untuk mencari
                </div>
              )}

              {query.length >= 2 && !loading && results.length === 0 && !error && (
                <div className="px-4 py-8 text-center text-gray-400 text-sm">
                  Tidak ada hasil untuk &quot;{query}&quot;
                </div>
              )}

              {results.length > 0 && (
                <div className="py-2">
                  {results.map((result) => {
                    const source = sourceLabels[result.source] || {
                      label: result.source,
                      color: "bg-gray-100 text-gray-700",
                    };
                    return (
                      <Link
                        key={result.id}
                        href={result.url}
                        onClick={close}
                        className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50
                                 transition-colors group"
                      >
                        {result.imageUrl ? (
                          <img
                            src={result.imageUrl}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover shrink-0 bg-gray-100"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-100 shrink-0 flex items-center justify-center">
                            <Search className="w-4 h-4 text-gray-400" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${source.color}`}
                            >
                              {source.label}
                            </span>
                            {result.subtitle && (
                              <span className="text-xs text-gray-400 truncate">
                                {result.subtitle}
                              </span>
                            )}
                          </div>
                          <p className="text-sm font-medium text-gray-900 mt-0.5 group-hover:text-blue-600 transition-colors truncate">
                            {result.title}
                          </p>
                          {result.excerpt && (
                            <p
                              className="text-xs text-gray-500 mt-0.5 line-clamp-1"
                              dangerouslySetInnerHTML={{
                                __html: result.excerpt.replace(
                                  /\*\*(.+?)\*\*/g,
                                  "<mark>$1</mark>",
                                ),
                              }}
                            />
                          )}
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 shrink-0 mt-1 transition-colors" />
                      </Link>
                    );
                  })}

                  {/* See all results link */}
                  {total > 8 && (
                    <Link
                      href={`/cari?q=${encodeURIComponent(query.trim())}`}
                      onClick={close}
                      className="block text-center text-sm text-blue-600 hover:text-blue-700
                               font-medium py-3 border-t border-gray-100 mt-1"
                    >
                      Lihat semua {total} hasil →
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center gap-3">
                <span>
                  <kbd className="px-1 py-0.5 bg-gray-100 rounded text-[10px]">↑↓</kbd> Navigasi
                </span>
                <span>
                  <kbd className="px-1 py-0.5 bg-gray-100 rounded text-[10px]">Enter</kbd> Buka
                </span>
                <span>
                  <kbd className="px-1 py-0.5 bg-gray-100 rounded text-[10px]">Esc</kbd> Tutup
                </span>
              </div>
              {results.length > 0 && (
                <span>{total} hasil</span>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
