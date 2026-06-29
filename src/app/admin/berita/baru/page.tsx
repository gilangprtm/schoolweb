"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/admin/PageHeader"
import { Select } from "@/components/admin/ui/Select"
import { useToast } from "@/components/admin/ui/Toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createPost } from "@/lib/actions/posts"

export default function BeritaBaruPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [category, setCategory] = useState("news")
  const [excerpt, setExcerpt] = useState("")
  const [content, setContent] = useState("")
  const [isPublished, setIsPublished] = useState(true)
  const [publishedAt, setPublishedAt] = useState(new Date().toISOString().split("T")[0])
  const [imageUrl, setImageUrl] = useState("")
  const [imageId, setImageId] = useState("")
  const [loading, setLoading] = useState(false)

  const handleTitleChange = (val: string) => {
    setTitle(val)
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("title", title)
      formData.append("slug", slug)
      formData.append("category", category)
      formData.append("excerpt", excerpt)
      formData.append("content", content)
      formData.append("imageUrl", imageId ? `https://docs.google.com/uc?id=${imageId}` : "")
      formData.append("isPublished", String(isPublished))
      formData.append("publishedAt", publishedAt)
      await createPost(formData)
    } catch {
      // redirect() in server action throws — we navigate client-side
    }
    router.push("/admin/berita")
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tambah Berita"
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Berita", href: "/admin/berita" },
          { label: "Tambah", href: "/admin/berita/baru" },
        ]}
      />

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        <div className="rounded-xl border border-neutral-200 bg-white p-6 space-y-5">
          <h2 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider">Informasi Berita</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium text-neutral-700">Judul <span className="text-red-500">*</span></label>
              <Input value={title} onChange={e => handleTitleChange(e.target.value)} placeholder="Judul berita" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">Slug</label>
              <Input value={slug} onChange={e => setSlug(e.target.value)} placeholder="slug-otomatis" />
              <p className="text-xs text-neutral-400">Slug otomatis dari judul</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">Kategori</label>
              <Select value={category} onChange={setCategory} options={[{ value: "news", label: "Berita" }, { value: "announcement", label: "Pengumuman" }]} />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">Ringkasan <span className="text-xs text-neutral-400">(maks 200 karakter)</span></label>
            <textarea value={excerpt} onChange={e => setExcerpt(e.target.value.slice(0, 200))} rows={2} maxLength={200} className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" placeholder="Ringkasan singkat berita..." />
            <p className="text-xs text-neutral-400 text-right">{excerpt.length}/200</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">Gambar / Thumbnail</label>
            <div className="flex gap-2">
              <Input
                placeholder="Google Docs ID (contoh: 1lEBtdYtwN0t32j...)"
                value={imageId}
                onChange={(e) => setImageId(e.target.value)}
                className="flex-1"
              />
              <a
                href="https://drive.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-2 text-xs text-primary hover:text-primary-700 font-medium shrink-0"
              >
                Cari ID
              </a>
            </div>
            <p className="text-xs text-neutral-400">Masukkan ID gambar dari Google Drive. Contoh: <code className="bg-neutral-100 px-1 rounded">1lEBtdYtwN0t32j...</code></p>
            {imageId && (
              <div className="relative w-full max-w-xs aspect-video rounded-lg overflow-hidden border border-neutral-200 bg-neutral-50 mt-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://docs.google.com/uc?id=${imageId}`}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                    (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
                  }}
                />
                <div className="hidden absolute inset-0 flex items-center justify-center text-xs text-red-500">
                  Gagal memuat gambar — periksa ID
                </div>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">Konten</label>
            <textarea value={content} onChange={e => setContent(e.target.value)} rows={10} className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none font-mono" placeholder="Tulis konten berita di sini..." />
          </div>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-6 space-y-5">
          <h2 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider">Pengaturan</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">Status</label>
              <div className="flex items-center gap-3 pt-1">
                <button type="button" role="switch" aria-checked={isPublished} onClick={() => setIsPublished(!isPublished)} className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 ${isPublished ? "bg-emerald-500" : "bg-neutral-300"}`}>
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ${isPublished ? "translate-x-5" : "translate-x-0"}`} />
                </button>
                <span className="text-sm text-neutral-500">{isPublished ? "Terbit" : "Draft"}</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">Tanggal Publikasi</label>
              <Input type="date" value={publishedAt} onChange={e => setPublishedAt(e.target.value)} />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button type="submit" disabled={loading}>{loading ? "Menyimpan..." : "Simpan Berita"}</Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>Batal</Button>
        </div>
      </form>
    </div>
  )
}
