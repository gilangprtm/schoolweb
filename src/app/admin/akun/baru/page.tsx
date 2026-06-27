"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/admin/PageHeader"
import { Select } from "@/components/admin/ui/Select"
import { useToast } from "@/components/admin/ui/Toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function AkunBaruPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<string>("guru")
  const [password, setPassword] = useState("")
  const [isActive, setIsActive] = useState(true)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({ type: "success", title: "Akun tersimpan" })
    router.push("/admin/akun")
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tambah Akun"
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Akun", href: "/admin/akun" },
          { label: "Tambah", href: "#" },
        ]}
      />

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        {/* Informasi Akun */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6 space-y-5">
          <h2 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider">
            Informasi Akun
          </h2>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">
              Nama <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Nama lengkap"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">
              Email <span className="text-red-500">*</span>
            </label>
            <Input
              type="email"
              placeholder="nama@sekolah.sch.id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">
                Role <span className="text-red-500">*</span>
              </label>
              <Select
                value={role}
                onChange={setRole}
                options={[
                  { value: "admin", label: "Admin" },
                  { value: "guru", label: "Guru" },
                  { value: "staff", label: "Staff" },
                ]}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">
                Password <span className="text-red-500">*</span>
              </label>
              <Input
                type="password"
                placeholder="Minimal 8 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* Pengaturan */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6 space-y-5">
          <h2 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider">
            Pengaturan
          </h2>

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
