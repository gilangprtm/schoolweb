"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { PageHeader } from "@/components/admin/PageHeader"
import { TextField, SelectField, SwitchField, RichTextEditor } from "@/components/admin/forms"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Plus } from "lucide-react"
import { getFacilityById, updateFacility, addFacilityPhoto, deleteFacilityPhoto } from "@/lib/actions/facilities"
import { getGoogleDriveImageUrl } from "@/lib/utils"
import ImagePreview from "@/components/admin/ImagePreview"
import { useToast } from "@/components/admin/ui/Toast"
import type { FacilityPhoto } from "@/types"

const categoryOptions = [
  { value: "akademik", label: "Akademik" },
  { value: "olahraga", label: "Olahraga" },
  { value: "seni", label: "Seni" },
  { value: "ibadah", label: "Ibadah" },
  { value: "teknologi", label: "Teknologi" },
  { value: "lainnya", label: "Lainnya" },
]

export default function FasilitasEditPage() {
  const router = useRouter(); const params = useParams(); const id = Number(params.id)
  const { toast } = useToast()
  const [name, setName] = useState(""); const [category, setCategory] = useState("akademik")
  const [sortOrder, setSortOrder] = useState(1); const [description, setDescription] = useState("")
  const [photoId, setPhotoId] = useState(""); const [isFeatured, setIsFeatured] = useState(false)
  const [isPublished, setIsPublished] = useState(true); const [loading, setLoading] = useState(true)
  const [photos, setPhotos] = useState<FacilityPhoto[]>([])
  const [galleryPhotoId, setGalleryPhotoId] = useState("")
  const [galleryCaption, setGalleryCaption] = useState("")
  const [galleryLoading, setGalleryLoading] = useState(false)

  useEffect(() => {
    getFacilityById(id).then(f => {
      if (f) { setName(f.name); setCategory(f.category); setSortOrder(f.sortOrder); setDescription(f.description); const match = (f.photoUrl || "").match(/[?&]id=([^&]+)/) || (f.photoUrl || "").match(/\/d\/([^/]+)/); setPhotoId(match ? match[1] : f.photoUrl); setIsFeatured(f.isFeatured); setIsPublished(f.isPublished); setPhotos(f.photos || []) }
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [id])

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")

  const handleAddPhoto = async () => {
    const value = galleryPhotoId.trim()
    if (!value || galleryLoading) return
    setGalleryLoading(true)
    try {
      await addFacilityPhoto(id, {
        filename: value,
        url: getGoogleDriveImageUrl(value),
        caption: galleryCaption.trim() || undefined,
        sortOrder: photos.length,
      })
      const updated = await getFacilityById(id)
      if (updated) setPhotos(updated.photos || [])
      setGalleryPhotoId("")
      setGalleryCaption("")
      toast({ type: "success", title: "Foto fasilitas ditambahkan" })
    } catch {
      toast({ type: "error", title: "Gagal menambah foto" })
    } finally {
      setGalleryLoading(false)
    }
  }

  const handleDeletePhoto = async (photoId: number) => {
    try {
      await deleteFacilityPhoto(photoId)
      setPhotos(prev => prev.filter(photo => photo.id !== photoId))
      toast({ type: "success", title: "Foto dihapus" })
    } catch {
      toast({ type: "error", title: "Gagal menghapus foto" })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true)
    try {
      const formData = new FormData()
      formData.append("name", name); formData.append("slug", slug); formData.append("category", category)
      formData.append("description", description); formData.append("photoUrl", photoId ? `https://docs.google.com/uc?id=${photoId}` : "")
      formData.append("sortOrder", String(sortOrder))
      formData.append("isFeatured", String(isFeatured)); formData.append("isPublished", String(isPublished))
      await updateFacility(id, formData)
    } catch {}
    router.push("/admin/fasilitas"); router.refresh()
  }

  if (loading) return <div className="space-y-6"><div className="h-8 w-40 bg-neutral-200 animate-pulse rounded" /><div className="h-96 bg-neutral-100 animate-pulse rounded-xl" /></div>

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Fasilitas" breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Fasilitas", href: "/admin/fasilitas" }, { label: "Edit", href: "#" }]} />
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
        <div className="rounded-xl border border-border bg-card p-6 space-y-5">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Informasi Fasilitas</h2>

          <TextField label="Nama Fasilitas" value={name} onChange={setName} required />

          <div className="grid sm:grid-cols-2 gap-4">
            <SelectField label="Kategori" value={category} onChange={setCategory} options={categoryOptions} />
            <TextField label="Urutan Tampil" value={String(sortOrder)} onChange={(v) => setSortOrder(Number(v))} type="number" min={1} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Deskripsi</label>
            <RichTextEditor
              value={description}
              onChange={setDescription}
              placeholder="Deskripsi fasilitas..."
            />
          </div>

          <TextField label="Foto Cover" value={photoId} onChange={setPhotoId} placeholder="Google Docs ID atau URL..." />
          {photoId && <ImagePreview src={photoId} alt="preview" aspect="video" />}
        </div>

        <div className="rounded-xl border border-border bg-card p-6 space-y-5">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Pengaturan</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <SwitchField label="Featured" checked={isFeatured} onChange={setIsFeatured} onLabel="Tampil di halaman utama" offLabel="Hanya di halaman fasilitas" />
            <SwitchField label="Status Terbit" checked={isPublished} onChange={setIsPublished} onLabel="Terbit" offLabel="Draft" />
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 space-y-5">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Galeri Foto Fasilitas</h2>
          <p className="text-sm text-neutral-500">Foto tambahan yang tampil di halaman detail fasilitas. Foto Cover di atas adalah gambar utama.</p>
          <div className="flex flex-wrap gap-2">
            <Input
              placeholder="Google Docs ID atau URL"
              value={galleryPhotoId}
              onChange={e => setGalleryPhotoId(e.target.value)}
              className="flex-1 min-w-52"
            />
            <Input
              placeholder="Caption (opsional)"
              value={galleryCaption}
              onChange={e => setGalleryCaption(e.target.value)}
              className="w-44"
            />
            <Button type="button" onClick={handleAddPhoto} disabled={galleryLoading}>
              <Plus className="h-4 w-4 mr-1" />
              {galleryLoading ? "Menambah..." : "Tambah"}
            </Button>
          </div>
          {galleryPhotoId && (
            <ImagePreview src={galleryPhotoId} alt="Preview foto galeri" aspect="video" />
          )}
          {photos.length > 0 ? (
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {photos.map(photo => (
                <div key={photo.id} className="relative group aspect-square rounded-lg bg-neutral-100 overflow-hidden">
                  <ImagePreview src={photo.url} alt={photo.caption || "Foto fasilitas"} aspect="square" className="!max-w-none !w-full !h-full !aspect-auto" imgClassName="!aspect-auto" />
                  <button
                    type="button"
                    onClick={() => handleDeletePhoto(photo.id)}
                    className="absolute top-1 right-1 rounded-full bg-red-500 p-0.5 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Hapus foto"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-neutral-500 text-center py-8">Belum ada foto galeri.</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={loading}>{loading ? "Menyimpan..." : "Simpan Perubahan"}</Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>Batal</Button>
        </div>
      </form>
    </div>
  )
}