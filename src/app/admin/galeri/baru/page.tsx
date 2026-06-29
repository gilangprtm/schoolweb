"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/admin/PageHeader"
import { Select } from "@/components/admin/ui/Select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createGallery } from "@/lib/actions/galleries"

export default function GaleriBaruPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [type, setType] = useState("photo")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true)
    try {
      const formData = new FormData()
      formData.append("title", title); formData.append("description", description); formData.append("type", type)
      await createGallery(formData)
    } catch {}
    router.push("/admin/galeri"); router.refresh()
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Tambah Album" breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Galeri", href: "/admin/galeri" }, { label: "Tambah", href: "#" }]} />
      <form onSubmit={handleSubmit} className="max-w-lg space-y-6">
        <div className="rounded-xl border border-neutral-200 bg-white p-6 space-y-5">
          <h2 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider">Informasi Album</h2>
          <div className="space-y-2"><label className="text-sm font-medium text-neutral-700">Judul Album <span className="text-red-500">*</span></label><Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Nama album" required /></div>
          <div className="space-y-2"><label className="text-sm font-medium text-neutral-700">Deskripsi</label><textarea rows={2} value={description} onChange={e => setDescription(e.target.value)} className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" /></div>
          <div className="space-y-2"><label className="text-sm font-medium text-neutral-700">Tipe</label><Select value={type} onChange={setType} options={[{ value: "photo", label: "Album Foto" }, { value: "video", label: "Album Video" }]} /></div>
        </div>
        <div className="flex items-center gap-3"><Button type="submit" disabled={loading}>Simpan</Button><Button type="button" variant="outline" onClick={() => router.back()}>Batal</Button></div>
      </form>
    </div>
  )
}
