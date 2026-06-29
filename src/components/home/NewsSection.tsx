import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import ScrollReveal from "@/components/shared/ScrollReveal";
import SectionHeading from "@/components/shared/SectionHeading";
import Badge from "@/components/shared/Badge";
import ImageWithFallback from "@/components/shared/ImageWithFallback";
import EmptyState from "@/components/shared/EmptyState";
import { getLatestPosts } from "@/lib/actions/posts";
import { formatDate, truncate } from "@/lib/utils";

export default async function NewsSection() {
  const latestPosts = await getLatestPosts(4);
  const featured = latestPosts[0];
  const sidePosts = latestPosts.slice(1, 4);

  return (
    <section className="section-py bg-white">
      <div className="container-custom">
        <ScrollReveal>
          <SectionHeading
            title="Berita & Pengumuman Terbaru"
            subtitle="Kabar dan informasi terkini dari SMP Negeri 17 Denpasar"
          />
        </ScrollReveal>

        {latestPosts.length === 0 ? (
          <EmptyState
            title="Belum ada berita"
            description="Berita dan pengumuman terbaru akan ditampilkan di sini"
            action={{ label: "Lihat Semua Berita", href: "/berita" }}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {/* Featured Post (spans 2 cols) */}
            {featured && (
              <ScrollReveal className="lg:col-span-2">
                <Link
                  href={`/berita/${featured.slug}`}
                  className="group block bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-0.5 h-full"
                >
                  <div className="relative aspect-video overflow-hidden bg-neutral-100">
                    <ImageWithFallback
                      src={featured.imageUrl}
                      alt={featured.title}
                      aspect="16/9"
                      rounded="rounded-none"
                      className="group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge
                        label={featured.category === "news" ? "Berita" : "Pengumuman"}
                        variant={featured.category === "news" ? "primary" : "warning"}
                      />
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-heading font-bold text-neutral-800 text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {featured.title}
                    </h3>
                    <p className="text-neutral-500 text-sm mb-3 line-clamp-2">
                      {featured.excerpt}
                    </p>
                    <div className="flex items-center gap-1.5 text-neutral-400 text-xs">
                      <CalendarDays className="size-3.5" />
                      {formatDate(featured.publishedAt)}
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            )}

            {/* Side Posts */}
            <ScrollReveal delay={0.1} className="flex flex-col gap-4">
              {sidePosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/berita/${post.slug}`}
                  className="group flex gap-4 bg-white rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-0.5 p-3"
                >
                  <div className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-neutral-100">
                    <ImageWithFallback
                      src={post.imageUrl}
                      alt={post.title}
                      aspect="1/1"
                      rounded="rounded-lg"
                      className="group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Badge
                      label={post.category === "news" ? "Berita" : "Pengumuman"}
                      variant={post.category === "news" ? "primary" : "warning"}
                    />
                    <h4 className="font-heading font-semibold text-neutral-800 text-sm mt-1.5 mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h4>
                    <div className="flex items-center gap-1.5 text-neutral-400 text-xs">
                      <CalendarDays className="size-3" />
                      {formatDate(post.publishedAt)}
                    </div>
                  </div>
                </Link>
              ))}
            </ScrollReveal>
          </div>
        )}

        <ScrollReveal delay={0.2}>
          <div className="text-center mt-10">
            <Link
              href="/berita"
              className="inline-flex items-center gap-2 text-primary hover:text-primary-700 font-medium transition-colors"
            >
              Lihat Semua Berita
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
