"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/admin/PageHeader"
import { Select } from "@/components/admin/ui/Select"
import { useToast } from "@/components/admin/ui/Toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function GaleriBaruPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [imageUrl, setImageUrl] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({ type: "success", title: "Album dibuat" })
    router.push("/admin/galeri")
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tambah Album"
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Galeri", href: "/admin/galeri" },
          { label: "Tambah", href: "#" },
        ]}
      />

      <form onSubmit={handleSubmit} className="max-w-lg space-y-6">
        <div className="rounded-xl border border-neutral-200 bg-white p-6 space-y-5">
          <h2 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider">
            Informasi Album
          </h2>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">
              Judul Album <span className="text-red-500">*</span>
            </label>
            <Input placeholder="Nama album" required />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">Deskripsi</label>
            <textarea
              rows={2}
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">Link Cover Album</label>
            <Input
              placeholder="https://drive.google.com/file/d/..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
            <p className="text-xs text-neutral-400">
              Upload cover ke Google Drive, lalu paste link di sini
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">Tipe</label>
            <Select
              value="photo"
              onChange={() => {}}
              options={[
                { value: "photo", label: "Album Foto" },
                { value: "video", label: "Album Video" },
              ]}
            />
          </div>
        </div>

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
