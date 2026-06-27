"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/admin/PageHeader"
import { Select } from "@/components/admin/ui/Select"
import { useToast } from "@/components/admin/ui/Toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function PrestasiBaruPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isFeatured, setIsFeatured] = useState(false)
  const [isPublished, setIsPublished] = useState(true)
  const [fileUrl, setFileUrl] = useState("")

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); toast({ type: "success", title: "Prestasi diperbarui" }); router.push("/admin/prestasi") }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Prestasi"
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Prestasi", href: "/admin/prestasi" },
          { label: "Edit", href: "#" },
        ]}
      />

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        {/* Informasi Prestasi */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6 space-y-5">
          <h2 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider">
            Informasi Prestasi
          </h2>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">
              Judul <span className="text-red-500">*</span>
            </label>
            <Input placeholder="Judul prestasi" required />
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">Kategori</label>
              <Select value="student" onChange={() => {}} options={[
                { value: "student", label: "Siswa" },
                { value: "teacher", label: "Guru" },
                { value: "school", label: "Sekolah" },
              ]} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">Tingkat</label>
              <Select value="nasional" onChange={() => {}} options={[
                { value: "kecamatan", label: "Kecamatan" },
                { value: "kabupaten", label: "Kabupaten" },
                { value: "provinsi", label: "Provinsi" },
                { value: "nasional", label: "Nasional" },
                { value: "internasional", label: "Internasional" },
              ]} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">Juara</label>
              <Select value="1" onChange={() => {}} options={[
                { value: "1", label: "Juara 1" },
                { value: "2", label: "Juara 2" },
                { value: "3", label: "Juara 3" },
                { value: "harapan", label: "Harapan" },
                { value: "peserta", label: "Peserta" },
              ]} />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">Penyelenggara</label>
              <Input placeholder="Contoh: Kemendikbud" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">Tanggal</label>
              <Input type="date" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">Deskripsi</label>
            <textarea
              rows={3}
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">Foto / Sertifikat</label>
            <Input
              placeholder="https://drive.google.com/file/d/..."
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
            />
            <p className="text-xs text-neutral-400">
              Upload file ke Google Drive, lalu paste link di sini
            </p>
          </div>
        </div>

        {/* Pengaturan */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6 space-y-5">
          <h2 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider">
            Pengaturan
          </h2>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">Featured</label>
              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  role="switch"
                  aria-checked={isFeatured}
                  onClick={() => setIsFeatured(!isFeatured)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    isFeatured ? "bg-primary" : "bg-neutral-300"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ${
                      isFeatured ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
                <span className="text-sm text-neutral-500">
                  {isFeatured ? "Tampil di halaman utama" : "Hanya di halaman prestasi"}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">Status Terbit</label>
              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  role="switch"
                  aria-checked={isPublished}
                  onClick={() => setIsPublished(!isPublished)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    isPublished ? "bg-emerald-500" : "bg-neutral-300"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ${
                      isPublished ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
                <span className="text-sm text-neutral-500">
                  {isPublished ? "Terbit" : "Draft"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
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
