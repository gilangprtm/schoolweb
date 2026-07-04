"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { PageHeader } from "@/components/admin/PageHeader"
import { useToast } from "@/components/admin/ui/Toast"
import { Button } from "@/components/ui/button"
import { getPageById, updatePage } from "@/lib/actions/pages"

export default function HalamanEditPage() {
  const router = useRouter()
  const params = useParams()
  const id = Number(params.id)
  const { toast } = useToast()
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPageById(id)
      .then((p) => {
        if (p) {
          setTitle(p.title)
          setSlug(p.slug)
          setContent(p.content)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append("title", title)
      formData.append("content", content)
      await updatePage(id, formData)
      toast({ type: "success", title: "Berhasil", description: "Halaman berhasil diperbarui" })
    } catch {
      toast({ type: "error", title: "Gagal", description: "Gagal memperbarui halaman" })
    }
    router.push("/admin/halaman")
    router.refresh()
  }

  if (loading)
    return (
      <div className="space-y-6">
        <div className="h-8 w-40 bg-muted animate-pulse rounded" />
        <div className="h-96 bg-muted animate-pulse rounded-xl" />
      </div>
    )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Halaman"
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Halaman", href: "/admin/halaman" },
          { label: title, href: "#" },
        ]}
      />
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
        <div className="rounded-xl border border-border bg-card p-6 space-y-5">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
            Detail Halaman
          </h2>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Judul Halaman</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled
              className="flex h-10 w-full rounded-lg border border-input bg-muted/50 px-3 py-2 text-sm opacity-60 cursor-not-allowed"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Slug</label>
            <input
              type="text"
              value={slug}
              disabled
              className="flex h-10 w-full rounded-lg border border-input bg-muted/50 px-3 py-2 text-sm opacity-60 cursor-not-allowed font-mono text-xs"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Konten <span className="text-xs text-muted-foreground/60">(HTML)</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={20}
              className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-ring/20 resize-none font-mono"
              placeholder="Tulis konten halaman di sini..."
            />
          </div>
        </div>
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
