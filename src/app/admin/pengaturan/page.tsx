"use client"

import { useState } from "react"
import { PageHeader } from "@/components/admin/PageHeader"
import { useToast } from "@/components/admin/ui/Toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PengaturanPage() {
  const { toast } = useToast()
  const [logoUrl, setLogoUrl] = useState("")
  const [faviconUrl, setFaviconUrl] = useState("")

  const handleSave = (section: string) => {
    toast({ type: "success", title: `${section} disimpan` })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pengaturan"
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Pengaturan", href: "/admin/pengaturan" },
        ]}
      />

      <Tabs defaultValue="identitas" className="max-w-3xl">
        <TabsList className="mb-6">
          <TabsTrigger value="identitas">Identitas Sekolah</TabsTrigger>
          <TabsTrigger value="sosmed">Media Sosial</TabsTrigger>
          <TabsTrigger value="password">Ubah Password</TabsTrigger>
        </TabsList>

        <TabsContent value="identitas">
          <div className="rounded-xl border border-neutral-200 bg-white p-6 space-y-5">
            <h2 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider">
              Identitas Sekolah
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-medium text-neutral-700">Nama Sekolah</label>
                <Input defaultValue="SMK Negeri 1 Contoh" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-medium text-neutral-700">Tagline / Moto</label>
                <Input defaultValue="Unggul dalam Prestasi, Santun dalam Budi Pekerti" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">Alamat</label>
              <textarea
                rows={2}
                defaultValue="Jl. Pendidikan No. 123, Kecamatan Contoh, Kota Contoh"
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">Telepon</label>
                <Input defaultValue="(021) 123-4567" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">Email</label>
                <Input defaultValue="info@sekolah.sch.id" />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">Logo Sekolah (PNG/SVG)</label>
                <Input
                  placeholder="https://drive.google.com/file/d/..."
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                />
                <p className="text-xs text-neutral-400">
                  Upload logo ke Google Drive, lalu paste link di sini
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">Favicon (32x32px)</label>
                <Input
                  placeholder="https://drive.google.com/file/d/..."
                  value={faviconUrl}
                  onChange={(e) => setFaviconUrl(e.target.value)}
                />
                <p className="text-xs text-neutral-400">
                  Upload favicon ke Google Drive, lalu paste link di sini
                </p>
              </div>
            </div>

            <Button onClick={() => handleSave("Identitas sekolah")}>Simpan</Button>
          </div>
        </TabsContent>

        <TabsContent value="sosmed">
          <div className="rounded-xl border border-neutral-200 bg-white p-6 space-y-5">
            <h2 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider">
              Media Sosial
            </h2>

            {[
              { label: "Facebook", placeholder: "https://facebook.com/sekolah" },
              { label: "Instagram", placeholder: "https://instagram.com/sekolah" },
              { label: "YouTube", placeholder: "https://youtube.com/@sekolah" },
              { label: "TikTok", placeholder: "https://tiktok.com/@sekolah" },
              { label: "Twitter / X", placeholder: "https://x.com/sekolah" },
            ].map((s) => (
              <div key={s.label} className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">{s.label}</label>
                <Input placeholder={s.placeholder} />
              </div>
            ))}

            <Button onClick={() => handleSave("Media sosial")}>Simpan</Button>
          </div>
        </TabsContent>

        <TabsContent value="password">
          <div className="rounded-xl border border-neutral-200 bg-white p-6 space-y-5 max-w-md">
            <h2 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider">
              Ubah Password
            </h2>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">Password Lama</label>
              <Input type="password" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">Password Baru</label>
              <Input type="password" placeholder="Minimal 8 karakter" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">Konfirmasi Password Baru</label>
              <Input type="password" />
            </div>

            <Button onClick={() => handleSave("Password")}>Ubah Password</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
