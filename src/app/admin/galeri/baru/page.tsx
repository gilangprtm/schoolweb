"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/admin/PageHeader"
import { TextField, TextareaField, SelectField } from "@/components/admin/forms"
import { Button } from "@/components/ui/button"
import { createGallery } from "@/lib/actions/galleries"

const typeOptions = [
  { value: "photo", label: "Album Foto" },
  { value: "video", label: "Album Video" },
]

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
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-6">
        <div className="rounded-xl border border-border bg-card p-6 space-y-5">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Informasi Album</h2>

          <TextField label="Judul Album" value={title} onChange={setTitle} placeholder="Nama album" required />

          <TextareaField label="Deskripsi" value={description} onChange={setDescription} rows={2} />

          <SelectField label="Tipe" value={type} onChange={setType} options={typeOptions} />
        </div>
        <div className="flex items-center gap-3">
          <Button type="submit" disabled={loading}>{loading ? "Menyimpan..." : "Simpan"}</Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>Batal</Button>
        </div>
      </form>
    </div>
  )
}