"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { PageHeader } from "@/components/admin/PageHeader"
import { useToast } from "@/components/admin/ui/Toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getPageById, updatePage } from "@/lib/actions/pages"

export default function HalamanEditPage() {
  const router = useRouter(); const params = useParams(); const id = Number(params.id)
  const { toast } = useToast()
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPageById(id).then(p => {
      if (p) { setTitle(p.title); setSlug(p.slug); setContent(p.content) }
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append("title", title); formData.append("content", content)
      await updatePage(id, formData)
    } catch {}
    router.push("/admin/halaman"); router.refresh()
  }

  if (loading) return <div className="space-y-6"><div className="h-8 w-40 bg-neutral-200 animate-pulse rounded" /><div className="h-96 bg-neutral-100 animate-pulse rounded-xl" /></div>

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Halaman" breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Halaman", href: "/admin/halaman" }, { label: title, href: "#" }]} />
      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        <div className="rounded-xl border border-neutral-200 bg-white p-6 space-y-5">
          <h2 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider">Detail Halaman</h2>
          <div className="space-y-2"><label className="text-sm font-medium text-neutral-700">Judul Halaman</label><Input value={title} onChange={e => setTitle(e.target.value)} disabled /></div>
          <div className="space-y-2"><label className="text-sm font-medium text-neutral-700">Slug</label><Input value={slug} disabled /></div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">Konten <span className="text-xs text-neutral-400">(HTML)</span></label>
            <textarea value={content} onChange={e => setContent(e.target.value)} rows={16} className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none font-mono" />
          </div>
        </div>
        <div className="flex items-center gap-3"><Button type="submit">Simpan Perubahan</Button><Button type="button" variant="outline" onClick={() => router.back()}>Batal</Button></div>
      </form>
    </div>
  )
}
