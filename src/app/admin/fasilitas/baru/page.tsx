"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/admin/PageHeader"
import { Select } from "@/components/admin/ui/Select"
import { useToast } from "@/components/admin/ui/Toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function FasilitasBaruPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isFeatured, setIsFeatured] = useState(false)
  const [isPublished, setIsPublished] = useState(true)
  const [fileUrl, setFileUrl] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({ type: "success", title: "Fasilitas disimpan" })
    router.push("/admin/fasilitas")
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tambah Fasilitas"
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Fasilitas", href: "/admin/fasilitas" },
          { label: "Tambah", href: "#" },
        ]}
      />

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        {/* Informasi Fasilitas */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6 space-y-5">
          <h2 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider">
            Informasi Fasilitas
          </h2>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">
              Nama Fasilitas <span className="text-red-500">*</span>
            </label>
            <Input placeholder="Contoh: Laboratorium Komputer" required />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">Kategori</label>
              <Select
                value="akademik"
                onChange={() => {}}
                options={[
                  { value: "akademik", label: "Akademik" },
                  { value: "olahraga", label: "Olahraga" },
                  { value: "seni", label: "Seni" },
                  { value: "ibadah", label: "Ibadah" },
                  { value: "teknologi", label: "Teknologi" },
                  { value: "lainnya", label: "Lainnya" },
                ]}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">Urutan Tampil</label>
              <Input type="number" defaultValue={1} min={1} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">Deskripsi</label>
            <textarea
              rows={3}
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              placeholder="Deskripsi fasilitas..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">Foto Cover</label>
            <Input
              placeholder="https://drive.google.com/file/d/..."
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
            />
            <p className="text-xs text-neutral-400">
              Upload foto ke Google Drive, lalu paste link di sini
            </p>
          </div>
        </div>

        {/* Pengaturan */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6 space-y-5">
          <h2 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider">
            Pengaturan
          </h2>

          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-neutral-700">Featured</label>
                <p className="text-xs text-neutral-400">Tampilkan di halaman utama</p>
              </div>
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
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-neutral-700">Terbit</label>
                <p className="text-xs text-neutral-400">Publikasikan di website</p>
              </div>
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
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button type="submit">Simpan</Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Batal
          </Button>
        </div>
      </form>
    </div>
  )
}
