"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/admin/PageHeader"
import { useToast } from "@/components/admin/ui/Toast"
import { Button } from "@/components/ui/button"
import { TextField, TextareaField, SelectField, SwitchField, DatePickerField } from "@/components/admin/forms"
import { createAchievement } from "@/lib/actions/achievements"

const categoryOptions = [
  { value: "student", label: "Siswa" },
  { value: "teacher", label: "Guru" },
  { value: "school", label: "Sekolah" },
]
const levelOptions = [
  { value: "kecamatan", label: "Kecamatan" },
  { value: "kabupaten", label: "Kabupaten" },
  { value: "provinsi", label: "Provinsi" },
  { value: "nasional", label: "Nasional" },
  { value: "internasional", label: "Internasional" },
]
const championOptions = [
  { value: "1", label: "Juara 1" },
  { value: "2", label: "Juara 2" },
  { value: "3", label: "Juara 3" },
  { value: "harapan", label: "Harapan" },
  { value: "peserta", label: "Peserta" },
]

export default function PrestasiBaruPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("student")
  const [level, setLevel] = useState("nasional")
  const [champion, setChampion] = useState("1")
  const [organizer, setOrganizer] = useState("")
  const [date, setDate] = useState("")
  const [description, setDescription] = useState("")
  const [imageId, setImageId] = useState("")
  const [isFeatured, setIsFeatured] = useState(false)
  const [isPublished, setIsPublished] = useState(true)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")

  const handleTitleChange = (val: string) => setTitle(val)

  const validate = (): boolean => {
    const errs: Record<string, string> = {}
    if (!title.trim()) errs.title = "Judul wajib diisi"
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("title", title)
      formData.append("slug", slug)
      formData.append("category", category)
      formData.append("level", level)
      formData.append("champion", champion)
      formData.append("organizer", organizer)
      formData.append("date", date)
      formData.append("description", description)
      formData.append("imageUrl", imageId ? `https://docs.google.com/uc?id=${imageId}` : "")
      formData.append("isFeatured", String(isFeatured))
      formData.append("isPublished", String(isPublished))
      await createAchievement(formData)
    } catch {}
    router.push("/admin/prestasi")
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Tambah Prestasi" breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Prestasi", href: "/admin/prestasi" }, { label: "Tambah", href: "#" }]} />
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
        <div className="rounded-xl border border-border bg-card p-6 space-y-5">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Informasi Prestasi</h2>

          <TextField
            label="Judul"
            value={title}
            onChange={handleTitleChange}
            placeholder="Judul prestasi"
            required
            error={errors.title}
          />

          <div className="grid sm:grid-cols-3 gap-4">
            <SelectField label="Kategori" value={category} onChange={setCategory} options={categoryOptions} />
            <SelectField label="Tingkat" value={level} onChange={setLevel} options={levelOptions} />
            <SelectField label="Juara" value={champion} onChange={setChampion} options={championOptions} />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <TextField label="Penyelenggara" value={organizer} onChange={setOrganizer} placeholder="Contoh: Kemendikbud" />
            <DatePickerField label="Tanggal" value={date} onChange={setDate} />
          </div>

          <TextareaField
            label="Deskripsi"
            value={description}
            onChange={setDescription}
            rows={3}
            placeholder="Deskripsi prestasi..."
          />

          <TextField
            label="Foto / Sertifikat"
            value={imageId}
            onChange={setImageId}
            placeholder="Google Docs ID..."
          />
          {imageId && <img src={`https://docs.google.com/uc?id=${imageId}`} alt="preview" className="w-full max-w-xs aspect-video object-cover rounded-lg border" />}
        </div>

        <div className="rounded-xl border border-border bg-card p-6 space-y-5">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Pengaturan</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <SwitchField
              label="Featured"
              checked={isFeatured}
              onChange={setIsFeatured}
              onLabel="Tampil di halaman utama"
              offLabel="Hanya di halaman prestasi"
            />
            <SwitchField
              label="Status Terbit"
              checked={isPublished}
              onChange={setIsPublished}
              onLabel="Terbit"
              offLabel="Draft"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={loading}>{loading ? "Menyimpan..." : "Simpan"}</Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>Batal</Button>
        </div>
      </form>
    </div>
  )
}