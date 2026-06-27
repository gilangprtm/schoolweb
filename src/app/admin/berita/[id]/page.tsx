"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/admin/PageHeader"
import { Select } from "@/components/admin/ui/Select"
import { useToast } from "@/components/admin/ui/Toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function BeritaEditPage() {
  const router = useRouter()
  const { toast } = useToast()

  // Mock existing data — will be replaced by DB fetch
  const [title, setTitle] = useState("Pengumuman PPDB 2025/2026")
  const [slug, setSlug] = useState("ppdb-2025")
  const [category, setCategory] = useState("announcement")
  const [excerpt, setExcerpt] = useState("Informasi lengkap pendaftaran peserta didik baru tahun ajaran 2025/2026")
  const [content, setContent] = useState("Konten berita lengkap...")
  const [isPublished, setIsPublished] = useState(true)
  const [publishedAt, setPublishedAt] = useState("2025-06-25")
  const [imageUrl, setImageUrl] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({ type: "success", title: "Berita diperbarui", description: title })
    router.push("/admin/berita")
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Berita"
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Berita", href: "/admin/berita" },
          { label: "Edit", href: "#" },
        ]}
      />

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        {/* Informasi Berita */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6 space-y-5">
          <h2 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider">
            Informasi Berita
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium text-neutral-700">
                Judul <span className="text-red-500">*</span>
              </label>
              <Input
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">Slug</label>
              <Input
                value={slug}
                onChange={e => setSlug(e.target.value)}
              />
              <p className="text-xs text-neutral-400">Slug unik untuk URL berita</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">Kategori</label>
              <Select
                value={category}
                onChange={setCategory}
                options={[
                  { value: "news", label: "Berita" },
                  { value: "announcement", label: "Pengumuman" },
                ]}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">
              Ringkasan <span className="text-xs text-neutral-400">(maks 200 karakter)</span>
            </label>
            <textarea
              value={excerpt}
              onChange={e => setExcerpt(e.target.value.slice(0, 200))}
              rows={2}
              maxLength={200}
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            />
            <p className="text-xs text-neutral-400 text-right">{excerpt.length}/200</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">Link Gambar / Thumbnail</label>
            <Input
              placeholder="https://drive.google.com/file/d/..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
            <p className="text-xs text-neutral-400">
              Upload gambar ke Google Drive, lalu paste link di sini
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">Konten</label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={10}
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none font-mono"
            />
          </div>
        </div>

        {/* Pengaturan */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6 space-y-5">
          <h2 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider">
            Pengaturan
          </h2>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">Status</label>
              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  role="switch"
                  aria-checked={isPublished}
                  onClick={() => setIsPublished(!isPublished)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    isPublished ? "bg-emerald-500" : "bg-neutral-300"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ${
                      isPublished ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
                <span className="text-sm text-neutral-500">
                  {isPublished ? "Terbit" : "Draft"}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">Tanggal Publikasi</label>
              <Input
                type="date"
                value={publishedAt}
                onChange={e => setPublishedAt(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button type="submit">Simpan Perubahan</Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Batal
          </Button>
        </div>
      </form>
    </div>
  )
}
