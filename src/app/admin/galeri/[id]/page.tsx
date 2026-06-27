"use client"

import { useState } from "react"
import { PageHeader } from "@/components/admin/PageHeader"
import { useToast } from "@/components/admin/ui/Toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Plus, Trash2 } from "lucide-react"

export default function GaleriDetailPage() {
  const { toast } = useToast()
  const albumType = "photo"
  const [title, setTitle] = useState("Kegiatan Upacara")
  const [coverUrl, setCoverUrl] = useState("")
  const [photoUrl, setPhotoUrl] = useState("")
  const [photos, setPhotos] = useState<string[]>(["","","","","",""])
  const [videos, setVideos] = useState<{ url: string; thumbnail: string }[]>([{ url: "https://youtube.com/watch?v=xxxx", thumbnail: "" }, { url: "", thumbnail: "" }])

  const addPhoto = () => {
    if (!photoUrl.trim()) return
    setPhotos([...photos, photoUrl])
    setPhotoUrl("")
  }

  const removePhoto = (i: number) => setPhotos(photos.filter((_, idx) => idx !== i))

  const handleSave = () => { toast({ type: "success", title: "Album disimpan" }) }

  return (
    <div>
      <PageHeader title={`Isi Album: ${title}`} breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Galeri", href: "/admin/galeri" }, { label: title, href: "#" }]} />

      <div className="max-w-2xl space-y-6">
        <div className="rounded-lg border border-neutral-200 bg-white p-6 space-y-4">
          <div className="space-y-2"><label className="text-sm font-medium text-neutral-700">Judul Album <span className="text-red-500">*</span></label><Input value={title} onChange={(e) => setTitle(e.target.value)} required /></div>
          <div className="space-y-2"><label className="text-sm font-medium text-neutral-700">Link Cover Album</label><Input placeholder="https://drive.google.com/file/d/..." value={coverUrl} onChange={(e) => setCoverUrl(e.target.value)} /></div>
        </div>

        {albumType === "photo" ? (
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input placeholder="https://drive.google.com/file/d/..." value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addPhoto())} />
              <Button type="button" onClick={addPhoto}><Plus className="h-4 w-4 mr-1" /> Tambah</Button>
            </div>
            {photos.length > 0 ? (
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {photos.map((url, i) => (
                  <div key={i} className="relative group aspect-square rounded-lg bg-neutral-100 overflow-hidden">
                    {url ? (
                      <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><span className="text-xs text-neutral-400">Kosong</span></div>
                    )}
                    <button onClick={() => removePhoto(i)} className="absolute top-1 right-1 rounded-full bg-red-500 p-0.5 text-white opacity-0 group-hover:opacity-100 transition-opacity"><X className="h-3 w-3" /></button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-neutral-500 text-center py-8">Belum ada foto. Tambahkan link foto di atas.</p>
            )}
          </div>
        ) : (
          <div className="space-y-4 max-w-lg">
            {videos.map((v, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="w-32 shrink-0 space-y-1">
                  <label className="text-xs text-neutral-500">Thumbnail</label>
                  <Input placeholder="Link thumbnail" value={v.thumbnail} onChange={(e) => { const nv = [...videos]; nv[i].thumbnail = e.target.value; setVideos(nv) }} />
                </div>
                <div className="flex-1 space-y-2">
                  <label className="text-xs text-neutral-500">URL YouTube</label>
                  <Input placeholder="https://youtube.com/watch?v=..." value={v.url} onChange={(e) => { const nv = [...videos]; nv[i].url = e.target.value; setVideos(nv) }} />
                  <button onClick={() => setVideos(videos.filter((_, idx) => idx !== i))} className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"><Trash2 className="h-3 w-3" /> Hapus</button>
                </div>
              </div>
            ))}
            <button onClick={() => setVideos([...videos, { url: "", thumbnail: "" }])} className="flex items-center gap-1 text-sm text-primary hover:underline"><Plus className="h-4 w-4" /> Tambah Video</button>
          </div>
        )}

        <Button onClick={handleSave}>Simpan Perubahan</Button>
      </div>
    </div>
  )
}
