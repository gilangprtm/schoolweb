"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, CalendarDays } from "lucide-react";
import { Input } from "@/components/ui/input";
import ScrollReveal from "@/components/shared/ScrollReveal";
import FilterPills from "@/components/shared/FilterPills";
import Pagination from "@/components/shared/Pagination";
import Badge from "@/components/shared/Badge";
import ImageWithFallback from "@/components/shared/ImageWithFallback";
import EmptyState from "@/components/shared/EmptyState";
import { getPosts } from "@/lib/actions/posts";
import { formatDate, truncate } from "@/lib/utils";
import type { Post, PostCategory } from "@/types";

const CATEGORY_FILTERS = [
  { label: "Semua", value: "all" },
  { label: "Berita", value: "news" },
  { label: "Pengumuman", value: "announcement" },
];

const ITEMS_PER_PAGE = 9;

export default function NewsGrid() {
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPosts({ status: "published", limit: 500 })
      .then((res) => setPosts(res.data.map((p: Record<string, unknown>) => ({ ...p, publishedAt: String(p.publishedAt), category: p.category as Post["category"] })) as Post[]))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  let filtered = posts;
  if (category !== "all") {
    filtered = filtered.filter((p) => p.category === (category as PostCategory));
  }
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q)
    );
  }

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedPosts = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <section className="section-py bg-white">
      <div className="container-custom">
        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8">
          <FilterPills
            items={CATEGORY_FILTERS}
            activeItem={category}
            onChange={(v) => {
              setCategory(v);
              setPage(1);
            }}
          />
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
            <Input
              type="text"
              placeholder="Cari berita..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-9 rounded-xl"
            />
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-neutral-100 animate-pulse aspect-[4/3]" />
            ))}
          </div>
        ) : paginatedPosts.length === 0 ? (
          <EmptyState
            title="Tidak ditemukan"
            description={
              search
                ? "Tidak ada berita yang sesuai dengan pencarian"
                : "Belum ada berita dalam kategori ini"
            }
            action={{ label: "Lihat Semua Berita", href: "/berita" }}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginatedPosts.map((post, index) => (
              <ScrollReveal key={post.id} delay={index * 0.05}>
                <Link
                  href={`/berita/${post.slug}`}
                  className="group block bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 border border-neutral-100 h-full flex flex-col"
                >
                  <div className="relative aspect-video overflow-hidden bg-neutral-100">
                    <ImageWithFallback
                      src={post.imageUrl}
                      alt={post.title}
                      aspect="16/9"
                      rounded="rounded-none"
                      className="group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge
                        label={
                          post.category === "news" ? "Berita" : "Pengumuman"
                        }
                        variant={
                          post.category === "news" ? "primary" : "warning"
                        }
                      />
                    </div>
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-heading font-bold text-neutral-800 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-neutral-500 text-sm mb-3 line-clamp-2 flex-1">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-1.5 text-neutral-400 text-xs mt-auto">
                      <CalendarDays className="size-3.5" />
                      {formatDate(post.publishedAt)}
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="mt-10">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </div>
    </section>
  );
}
