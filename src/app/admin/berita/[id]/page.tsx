"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { PageHeader } from "@/components/admin/PageHeader"
import { useToast } from "@/components/admin/ui/Toast"
import { Button } from "@/components/ui/button"
import { TextField, TextareaField, SelectField, SwitchField, DatePickerField } from "@/components/admin/forms"
import { getPostById, updatePost } from "@/lib/actions/posts"

const categoryOptions = [
  { value: "news", label: "Berita" },
  { value: "announcement", label: "Pengumuman" },
]

export default function BeritaEditPage() {
  const router = useRouter()
  const params = useParams()
  const id = Number(params.id)
  const { toast } = useToast()

  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [category, setCategory] = useState("news")
  const [excerpt, setExcerpt] = useState("")
  const [content, setContent] = useState("")
  const [isPublished, setIsPublished] = useState(true)
  const [publishedAt, setPublishedAt] = useState("")
  const [imageId, setImageId] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    getPostById(id).then(post => {
      if (post) {
        setTitle(post.title)
        setSlug(post.slug)
        setCategory(post.category)
        setExcerpt(post.excerpt)
        setContent(post.content)
        setIsPublished(post.isPublished)
        setPublishedAt(post.publishedAt ? new Date(post.publishedAt).toISOString().split("T")[0] : "")
        const url = post.imageUrl || ""
        const match = url.match(/[?&]id=([^&]+)/) || url.match(/\/d\/([^/]+)/)
        setImageId(match ? match[1] : url)
      }
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [id])

  const handleTitleChange = (val: string) => {
    setTitle(val)
    if (!slug || slug === title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""))
    }
  }

  const validate = (): boolean => {
    const errs: Record<string, string> = {}
    if (!title.trim()) errs.title = "Judul wajib diisi"
    if (!slug.trim()) errs.slug = "Slug wajib diisi"
    if (!content.trim()) errs.content = "Konten wajib diisi"
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
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
      await updatePost(id, formData)
    } catch {
      // redirect() in server action
    }
    router.push("/admin/berita")
    router.refresh()
  }

  if (loading) {
    return <div className="space-y-6"><div className="h-8 w-40 bg-muted animate-pulse rounded" /><div className="h-96 bg-muted animate-pulse rounded-xl" /></div>
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Berita" breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Berita", href: "/admin/berita" }, { label: "Edit", href: "#" }]} />

      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
        <div className="rounded-xl border border-border bg-card p-6 space-y-5">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Informasi Berita</h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <TextField
                label="Judul"
                value={title}
                onChange={handleTitleChange}
                placeholder="Judul berita"
                required
                error={errors.title}
              />
            </div>
            <TextField
              label="Slug"
              value={slug}
              onChange={setSlug}
              placeholder="slug-otomatis"
              description="Slug otomatis dari judul"
              error={errors.slug}
            />
            <SelectField
              label="Kategori"
              value={category}
              onChange={setCategory}
              options={categoryOptions}
            />
          </div>

          <TextareaField
            label="Ringkasan"
            value={excerpt}
            onChange={setExcerpt}
            maxLength={200}
            rows={2}
            showCount
            placeholder="Ringkasan singkat berita..."
            description="Maksimal 200 karakter"
          />

          <TextField
            label="Gambar / Thumbnail"
            value={imageId}
            onChange={setImageId}
            placeholder="Google Docs ID (contoh: 1lEBtdYtwN0t32j...)"
            description={
              <>
                Masukkan ID gambar dari Google Drive.{" "}
                <a
                  href="https://drive.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 underline underline-offset-2"
                >
                  Cari ID
                </a>
              </>
            }
          />
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

          <TextareaField
            label="Konten"
            value={content}
            onChange={setContent}
            rows={10}
            placeholder="Tulis konten berita di sini..."
            error={errors.content}
          />
        </div>

        <div className="rounded-xl border border-border bg-card p-6 space-y-5">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Pengaturan</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <SwitchField
              label="Status"
              checked={isPublished}
              onChange={setIsPublished}
              onLabel="Terbit"
              offLabel="Draft"
              description="Status publikasi berita"
            />
            <DatePickerField
              label="Tanggal Publikasi"
              value={publishedAt}
              onChange={setPublishedAt}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Menyimpan...
              </span>
            ) : (
              "Simpan Perubahan"
            )}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>Batal</Button>
        </div>
      </form>
    </div>
  )
}
