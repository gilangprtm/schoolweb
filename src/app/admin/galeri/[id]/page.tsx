"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { PageHeader } from "@/components/admin/PageHeader"
import { TextField, TextareaField, SelectField } from "@/components/admin/forms"
import { useToast } from "@/components/admin/ui/Toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Plus, Trash2 } from "lucide-react"
import { getGalleryById, updateGallery, deleteMedia, addMediaToGallery, addVideoToGallery } from "@/lib/actions/galleries"
import type { Gallery, Media } from "@/types"

const typeOptions = [
  { value: "photo", label: "Album Foto" },
  { value: "video", label: "Album Video" },
]

export default function GaleriDetailPage() {
  const params = useParams(); const id = Number(params.id); const router = useRouter()
  const { toast } = useToast()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [type, setType] = useState<string>("photo")
  const [mediaItems, setMediaItems] = useState<Media[]>([])
  const [photoUrl, setPhotoUrl] = useState("")
  const [photoId, setPhotoId] = useState("")
  const [photoCaption, setPhotoCaption] = useState("")
  const [videoUrl, setVideoUrl] = useState("")
  const [videoCaption, setVideoCaption] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getGalleryById(id).then(g => {
      if (g) { setTitle(g.title); setDescription(g.description); setType(g.type as string); setMediaItems(g.media || []) }
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [id])

  const handleSave = async () => {
    try {
      const formData = new FormData()
      formData.append("title", title); formData.append("description", description)
      await updateGallery(id, formData)
      toast({ type: "success", title: "Album disimpan" })
    } catch { toast({ type: "error", title: "Gagal menyimpan" }) }
  }

  const handleAddPhoto = async () => {
    if (!photoId.trim()) return
    try {
      const url = `https://docs.google.com/uc?id=${photoId}`
      await addMediaToGallery(id, { filename: photoId, url, caption: photoCaption || undefined })
      const updated = await getGalleryById(id)
      if (updated) setMediaItems(updated.media || [])
      setPhotoId(""); setPhotoCaption("")
      toast({ type: "success", title: "Foto ditambahkan" })
    } catch { toast({ type: "error", title: "Gagal menambah foto" }) }
  }

  const handleAddVideo = async () => {
    if (!videoUrl.trim()) return
    try {
      await addVideoToGallery(id, videoUrl, videoCaption || undefined)
      const updated = await getGalleryById(id)
      if (updated) setMediaItems(updated.media || [])
      setVideoUrl(""); setVideoCaption("")
      toast({ type: "success", title: "Video ditambahkan" })
    } catch { toast({ type: "error", title: "Gagal menambah video" }) }
  }

  const handleDeleteMedia = async (mediaId: number) => {
    try {
      await deleteMedia(mediaId)
      setMediaItems(prev => prev.filter(m => m.id !== mediaId))
      toast({ type: "success", title: "Media dihapus" })
    } catch { toast({ type: "error", title: "Gagal menghapus media" }) }
  }

  if (loading) return <div className="space-y-6"><div className="h-8 w-40 bg-neutral-200 animate-pulse rounded" /><div className="h-96 bg-neutral-100 animate-pulse rounded-xl" /></div>

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <PageHeader title={`Isi Album: ${title}`} breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Galeri", href: "/admin/galeri" }, { label: title, href: "#" }]} />
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="rounded-xl border border-border bg-card p-6 space-y-5">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Informasi Album</h2>

          <TextField label="Judul Album" value={title} onChange={setTitle} required />

          <TextareaField label="Deskripsi" value={description} onChange={setDescription} rows={2} />

          <SelectField label="Tipe" value={type} onChange={setType} options={typeOptions} />
        </div>

        {type === "photo" ? (
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input placeholder="Google Docs ID" value={photoId} onChange={e => setPhotoId(e.target.value)} className="flex-1" />
              <Input placeholder="Caption" value={photoCaption} onChange={e => setPhotoCaption(e.target.value)} className="w-40" />
              <Button type="button" onClick={handleAddPhoto}><Plus className="h-4 w-4 mr-1" /> Tambah</Button>
            </div>
            {photoId && (
              <img src={`https://docs.google.com/uc?id=${photoId}`} alt="Preview" className="w-full max-w-xs aspect-video object-cover rounded-lg border" />
            )}
            {mediaItems.length > 0 ? (
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {mediaItems.map(m => (
                  <div key={m.id} className="relative group aspect-square rounded-lg bg-neutral-100 overflow-hidden">
                    {m.url ? <img src={m.url} alt={m.caption || "Foto"} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><span className="text-xs text-neutral-400">Kosong</span></div>}
                    <button onClick={() => handleDeleteMedia(m.id)} className="absolute top-1 right-1 rounded-full bg-red-500 p-0.5 text-white opacity-0 group-hover:opacity-100 transition-opacity"><X className="h-3 w-3" /></button>
                  </div>
                ))}
              </div>
            ) : <p className="text-sm text-neutral-500 text-center py-8">Belum ada foto.</p>}
          </div>
        ) : (
          <div className="space-y-4 max-w-lg">
            <div className="flex gap-2">
              <Input placeholder="URL YouTube embed" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} />
              <Input placeholder="Caption" value={videoCaption} onChange={e => setVideoCaption(e.target.value)} className="w-40" />
              <Button type="button" onClick={handleAddVideo}><Plus className="h-4 w-4 mr-1" /> Tambah</Button>
            </div>
            {mediaItems.map(m => (
              <div key={m.id} className="flex gap-3 items-center p-2 rounded-lg border border-neutral-100">
                <span className="text-xs text-neutral-500 flex-1 truncate">{m.url}</span>
                <button onClick={() => handleDeleteMedia(m.id)} className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"><Trash2 className="h-3 w-3" /></button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-3">
          <Button onClick={handleSave}>Simpan Perubahan</Button>
          <Button type="button" variant="outline" onClick={() => router.push("/admin/galeri")}>Kembali</Button>
        </div>
      </div>
    </div>
  )
}