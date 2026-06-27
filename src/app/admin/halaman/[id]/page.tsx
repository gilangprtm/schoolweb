"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/admin/PageHeader"
import { useToast } from "@/components/admin/ui/Toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function HalamanEditPage() {
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({ type: "success", title: "Halaman diperbarui" })
    router.push("/admin/halaman")
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Halaman"
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Halaman", href: "/admin/halaman" },
          { label: "Profil Sekolah", href: "#" },
        ]}
      />

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        <div className="rounded-xl border border-neutral-200 bg-white p-6 space-y-5">
          <h2 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider">
            Detail Halaman
          </h2>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">Judul Halaman</label>
            <Input defaultValue="Profil Sekolah" disabled />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">Slug</label>
            <Input defaultValue="profil" disabled />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">
              Konten <span className="text-xs text-neutral-400">(Rich Text Editor — TipTap)</span>
            </label>
            <textarea
              defaultValue="<h2>Profil Sekolah</h2><p>Selamat datang di website resmi sekolah kami...</p>"
              rows={16}
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none font-mono"
            />
          </div>
        </div>

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
