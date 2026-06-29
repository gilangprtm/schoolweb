"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/admin/PageHeader"
import { Select } from "@/components/admin/ui/Select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createFacility } from "@/lib/actions/facilities"

export default function FasilitasBaruPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [category, setCategory] = useState("akademik")
  const [sortOrder, setSortOrder] = useState(1)
  const [description, setDescription] = useState("")
  const [photoId, setPhotoId] = useState("")
  const [isFeatured, setIsFeatured] = useState(false)
  const [isPublished, setIsPublished] = useState(true)
  const [loading, setLoading] = useState(false)

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true)
    try {
      const formData = new FormData()
      formData.append("name", name); formData.append("slug", slug); formData.append("category", category)
      formData.append("description", description); formData.append("photoUrl", photoId ? `https://docs.google.com/uc?id=${photoId}` : "")
      formData.append("sortOrder", String(sortOrder))
      formData.append("isFeatured", String(isFeatured)); formData.append("isPublished", String(isPublished))
      await createFacility(formData)
    } catch {}
    router.push("/admin/fasilitas"); router.refresh()
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Tambah Fasilitas" breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Fasilitas", href: "/admin/fasilitas" }, { label: "Tambah", href: "#" }]} />
      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        <div className="rounded-xl border border-neutral-200 bg-white p-6 space-y-5">
          <h2 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider">Informasi Fasilitas</h2>
          <div className="space-y-2"><label className="text-sm font-medium text-neutral-700">Nama Fasilitas <span className="text-red-500">*</span></label><Input value={name} onChange={e => setName(e.target.value)} placeholder="Contoh: Laboratorium Komputer" required /></div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2"><label className="text-sm font-medium text-neutral-700">Kategori</label><Select value={category} onChange={setCategory} options={[{ value: "akademik", label: "Akademik" }, { value: "olahraga", label: "Olahraga" }, { value: "seni", label: "Seni" }, { value: "ibadah", label: "Ibadah" }, { value: "teknologi", label: "Teknologi" }, { value: "lainnya", label: "Lainnya" }]} /></div>
            <div className="space-y-2"><label className="text-sm font-medium text-neutral-700">Urutan Tampil</label><Input type="number" value={sortOrder} onChange={e => setSortOrder(Number(e.target.value))} min={1} /></div>
          </div>
          <div className="space-y-2"><label className="text-sm font-medium text-neutral-700">Deskripsi</label><textarea rows={3} value={description} onChange={e => setDescription(e.target.value)} className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" placeholder="Deskripsi fasilitas..." /></div>
          <div className="space-y-2"><label className="text-sm font-medium text-neutral-700">Foto Cover</label><Input placeholder="Google Docs ID..." value={photoId} onChange={e => setPhotoId(e.target.value)} />{photoId && <img src={`https://docs.google.com/uc?id=${photoId}`} alt="preview" className="w-full max-w-xs aspect-video object-cover rounded-lg border" />}</div>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-6 space-y-5">
          <h2 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider">Pengaturan</h2>
          <div className="space-y-5">
            <div className="flex items-center justify-between"><div><label className="text-sm font-medium text-neutral-700">Featured</label><p className="text-xs text-neutral-400">Tampilkan di halaman utama</p></div><button type="button" role="switch" aria-checked={isFeatured} onClick={() => setIsFeatured(!isFeatured)} className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${isFeatured ? "bg-primary" : "bg-neutral-300"}`}><span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${isFeatured ? "translate-x-5" : "translate-x-0"}`} /></button></div>
            <div className="flex items-center justify-between"><div><label className="text-sm font-medium text-neutral-700">Terbit</label><p className="text-xs text-neutral-400">Publikasikan di website</p></div><button type="button" role="switch" aria-checked={isPublished} onClick={() => setIsPublished(!isPublished)} className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${isPublished ? "bg-emerald-500" : "bg-neutral-300"}`}><span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${isPublished ? "translate-x-5" : "translate-x-0"}`} /></button></div>
          </div>
        </div>
        <div className="flex items-center gap-3"><Button type="submit" disabled={loading}>Simpan</Button><Button type="button" variant="outline" onClick={() => router.back()}>Batal</Button></div>
      </form>
    </div>
  )
}
