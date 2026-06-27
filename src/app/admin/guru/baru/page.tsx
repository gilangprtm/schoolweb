"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/admin/PageHeader"
import { Select } from "@/components/admin/ui/Select"
import { useToast } from "@/components/admin/ui/Toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function GuruBaruPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [role, setRole] = useState("teacher")
  const [fileUrl, setFileUrl] = useState("")
  const [isActive, setIsActive] = useState(true)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({ type: "success", title: "Data disimpan" })
    router.push("/admin/guru")
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tambah Guru & Staf"
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Guru & Staf", href: "/admin/guru" },
          { label: "Tambah", href: "#" },
        ]}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informasi Utama */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6 space-y-5">
          <h2 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider">
            Informasi Utama
          </h2>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">
              Nama <span className="text-red-500">*</span>
            </label>
            <Input placeholder="Nama lengkap" required />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">Jabatan</label>
              <Select
                value={role}
                onChange={setRole}
                options={[
                  { value: "headmaster", label: "Kepala Sekolah" },
                  { value: "teacher", label: "Guru" },
                  { value: "staff", label: "Staf" },
                ]}
              />
            </div>

            {role === "teacher" && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">Mata Pelajaran</label>
                <Input placeholder="Contoh: Matematika" />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">Foto Profil</label>
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

        {/* Detail */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6 space-y-5">
          <h2 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider">
            Detail
          </h2>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">Riwayat Pendidikan</label>
            <textarea
              rows={3}
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              placeholder="S1 Pendidikan..., UNJ (2010)"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">Biografi</label>
            <textarea
              rows={4}
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              placeholder="Biografi singkat..."
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">Email</label>
              <Input type="email" placeholder="nama@sekolah.sch.id" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">Telepon</label>
              <Input placeholder="0812..." />
            </div>
          </div>
        </div>

        {/* Pengaturan */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6 space-y-5">
          <h2 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider">
            Pengaturan
          </h2>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">Urutan Tampil</label>
              <Input type="number" defaultValue={1} min={1} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">Status Aktif</label>
              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  role="switch"
                  aria-checked={isActive}
                  onClick={() => setIsActive(!isActive)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    isActive ? "bg-emerald-500" : "bg-neutral-300"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ${
                      isActive ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
                <span className="text-sm text-neutral-500">
                  {isActive ? "Aktif" : "Nonaktif"}
                </span>
              </div>
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
