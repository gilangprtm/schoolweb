import { notFound } from "next/navigation";
import { CalendarDays, ArrowLeft } from "lucide-react";
import Link from "next/link";
import ScrollReveal from "@/components/shared/ScrollReveal";
import Breadcrumb from "@/components/shared/Breadcrumb";
import Badge from "@/components/shared/Badge";
import ImageWithFallback from "@/components/shared/ImageWithFallback";
import { getPostBySlug, getLatestPosts } from "@/lib/actions/posts";
import { formatDate } from "@/lib/utils";

export default async function BeritaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = (await getLatestPosts(5)).filter(
    (rp) => rp.id !== post.id
  ).slice(0, 3);

  return (
    <article>
      {/* Hero */}
      <section className="relative min-h-[35vh] md:min-h-[40vh] flex items-end bg-neutral-900">
        <div className="absolute inset-0">
          <ImageWithFallback
            src={post.imageUrl}
            alt={post.title}
            fill
            rounded="rounded-none"
            className="opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/40" />
        </div>
        <div className="container-custom relative z-10 py-16 pt-28">
          <Breadcrumb
            items={[
              { label: "Berita", href: "/berita" },
              { label: post.title },
            ]}
            className="text-white/70 mb-3"
          />
          <Badge
            label={post.category === "news" ? "Berita" : "Pengumuman"}
            variant={post.category === "news" ? "primary" : "warning"}
          />
          <h1 className="font-heading text-2xl md:text-4xl font-bold text-white mt-3 mb-3 leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center gap-2 text-white/70 text-sm">
            <CalendarDays className="size-4" />
            {formatDate(post.publishedAt)}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section-py bg-white">
        <div className="container-custom max-w-3xl">
          <ScrollReveal>
            <div
              className="prose-content"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </ScrollReveal>

          {/* Back link */}
          <div className="mt-10 pt-6 border-t border-neutral-200">
            <Link
              href="/berita"
              className="inline-flex items-center gap-2 text-primary hover:text-primary-700 text-sm font-medium transition-colors"
            >
              <ArrowLeft className="size-4" />
              Kembali ke Berita
            </Link>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="section-py bg-neutral-50 -mt-8">
          <div className="container-custom">
            <h2 className="font-heading text-2xl font-bold text-neutral-800 mb-8 text-left">
              Berita Lainnya
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl mx-auto">
              {relatedPosts.map((rp, i) => (
                <ScrollReveal key={rp.id} delay={i * 0.1}>
                  <Link
                    href={`/berita/${rp.slug}`}
                    className="group block bg-white rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <div className="relative aspect-video overflow-hidden bg-neutral-100">
                      <ImageWithFallback
                        src={rp.imageUrl}
                        alt={rp.title}
                        aspect="16/9"
                        rounded="rounded-none"
                        className="group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-heading font-semibold text-neutral-800 text-sm line-clamp-2 group-hover:text-primary transition-colors">
                        {rp.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-neutral-400 text-xs mt-2">
                        <CalendarDays className="size-3" />
                        {formatDate(rp.publishedAt)}
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
