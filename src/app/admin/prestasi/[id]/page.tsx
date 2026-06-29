"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { PageHeader } from "@/components/admin/PageHeader"
import { Select } from "@/components/admin/ui/Select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getAchievementById, updateAchievement } from "@/lib/actions/achievements"

export default function PrestasiEditPage() {
  const router = useRouter()
  const params = useParams()
  const id = Number(params.id)
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("student")
  const [level, setLevel] = useState("nasional")
  const [champion, setChampion] = useState("1")
  const [organizer, setOrganizer] = useState("")
  const [date, setDate] = useState("")
  const [description, setDescription] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [imageId, setImageId] = useState("")
  const [isFeatured, setIsFeatured] = useState(false)
  const [isPublished, setIsPublished] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAchievementById(id).then(a => {
      if (a) {
        setTitle(a.title); setCategory(a.category); setLevel(a.level)
        setChampion(a.champion); setOrganizer(a.organizer ?? "")
        setDate(a.date ?? ""); setDescription(a.description)
        setImageId((a.imageUrl || "").match(/[?&]id=([^&]+)/)?.[1] || (a.imageUrl || "").match(/\/d\/([^/]+)/)?.[1] || a.imageUrl); setIsFeatured(a.isFeatured); setIsPublished(a.isPublished)
      }
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [id])

  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("title", title); formData.append("slug", slug)
      formData.append("category", category); formData.append("level", level)
      formData.append("champion", champion); formData.append("organizer", organizer)
      formData.append("date", date); formData.append("description", description)
      formData.append("imageUrl", imageId ? `https://docs.google.com/uc?id=${imageId}` : "")
      formData.append("isFeatured", String(isFeatured)); formData.append("isPublished", String(isPublished))
      await updateAchievement(id, formData)
    } catch {}
    router.push("/admin/prestasi"); router.refresh()
  }

  if (loading) return <div className="space-y-6"><div className="h-8 w-40 bg-neutral-200 animate-pulse rounded" /><div className="h-96 bg-neutral-100 animate-pulse rounded-xl" /></div>

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Prestasi" breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Prestasi", href: "/admin/prestasi" }, { label: "Edit", href: "#" }]} />
      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        <div className="rounded-xl border border-neutral-200 bg-white p-6 space-y-5">
          <h2 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider">Informasi Prestasi</h2>
          <div className="space-y-2"><label className="text-sm font-medium text-neutral-700">Judul <span className="text-red-500">*</span></label><Input value={title} onChange={e => setTitle(e.target.value)} required /></div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-2"><label className="text-sm font-medium text-neutral-700">Kategori</label><Select value={category} onChange={setCategory} options={[{ value: "student", label: "Siswa" }, { value: "teacher", label: "Guru" }, { value: "school", label: "Sekolah" }]} /></div>
            <div className="space-y-2"><label className="text-sm font-medium text-neutral-700">Tingkat</label><Select value={level} onChange={setLevel} options={[{ value: "kecamatan", label: "Kecamatan" }, { value: "kabupaten", label: "Kabupaten" }, { value: "provinsi", label: "Provinsi" }, { value: "nasional", label: "Nasional" }, { value: "internasional", label: "Internasional" }]} /></div>
            <div className="space-y-2"><label className="text-sm font-medium text-neutral-700">Juara</label><Select value={champion} onChange={setChampion} options={[{ value: "1", label: "Juara 1" }, { value: "2", label: "Juara 2" }, { value: "3", label: "Juara 3" }, { value: "harapan", label: "Harapan" }, { value: "peserta", label: "Peserta" }]} /></div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2"><label className="text-sm font-medium text-neutral-700">Penyelenggara</label><Input value={organizer} onChange={e => setOrganizer(e.target.value)} /></div>
            <div className="space-y-2"><label className="text-sm font-medium text-neutral-700">Tanggal</label><Input type="date" value={date} onChange={e => setDate(e.target.value)} /></div>
          </div>
          <div className="space-y-2"><label className="text-sm font-medium text-neutral-700">Deskripsi</label><textarea rows={3} value={description} onChange={e => setDescription(e.target.value)} className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" /></div>
          <div className="space-y-2"><label className="text-sm font-medium text-neutral-700">Foto / Sertifikat</label><Input placeholder="Google Docs ID..." value={imageId} onChange={e => setImageId(e.target.value)} />{imageId && <img src={`https://docs.google.com/uc?id=${imageId}`} alt="preview" className="w-full max-w-xs aspect-video object-cover rounded-lg border" />}</div>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-6 space-y-5">
          <h2 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider">Pengaturan</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2"><label className="text-sm font-medium text-neutral-700">Featured</label><div className="flex items-center gap-3 pt-1"><button type="button" role="switch" aria-checked={isFeatured} onClick={() => setIsFeatured(!isFeatured)} className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${isFeatured ? "bg-primary" : "bg-neutral-300"}`}><span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${isFeatured ? "translate-x-5" : "translate-x-0"}`} /></button><span className="text-sm text-neutral-500">{isFeatured ? "Tampil di halaman utama" : "Hanya di halaman prestasi"}</span></div></div>
            <div className="space-y-2"><label className="text-sm font-medium text-neutral-700">Status Terbit</label><div className="flex items-center gap-3 pt-1"><button type="button" role="switch" aria-checked={isPublished} onClick={() => setIsPublished(!isPublished)} className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${isPublished ? "bg-emerald-500" : "bg-neutral-300"}`}><span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${isPublished ? "translate-x-5" : "translate-x-0"}`} /></button><span className="text-sm text-neutral-500">{isPublished ? "Terbit" : "Draft"}</span></div></div>
          </div>
        </div>
        <div className="flex items-center gap-3"><Button type="submit">Simpan Perubahan</Button><Button type="button" variant="outline" onClick={() => router.back()}>Batal</Button></div>
      </form>
    </div>
  )
}
