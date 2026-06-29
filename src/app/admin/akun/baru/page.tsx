"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/admin/PageHeader"
import { Select } from "@/components/admin/ui/Select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createUser } from "@/lib/actions/users"

export default function AkunBaruPage() {
  const router = useRouter()
  const [name, setName] = useState(""); const [email, setEmail] = useState("")
  const [role, setRole] = useState<string>("admin"); const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true)
    try {
      const formData = new FormData()
      formData.append("name", name); formData.append("email", email)
      formData.append("role", role); formData.append("password", password)
      await createUser(formData)
    } catch {}
    router.push("/admin/akun"); router.refresh()
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Tambah Akun" breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Akun", href: "/admin/akun" }, { label: "Tambah", href: "#" }]} />
      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        <div className="rounded-xl border border-neutral-200 bg-white p-6 space-y-5">
          <h2 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider">Informasi Akun</h2>
          <div className="space-y-2"><label className="text-sm font-medium text-neutral-700">Nama <span className="text-red-500">*</span></label><Input placeholder="Nama lengkap" value={name} onChange={e => setName(e.target.value)} required /></div>
          <div className="space-y-2"><label className="text-sm font-medium text-neutral-700">Email <span className="text-red-500">*</span></label><Input type="email" placeholder="nama@sekolah.sch.id" value={email} onChange={e => setEmail(e.target.value)} required /></div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2"><label className="text-sm font-medium text-neutral-700">Role <span className="text-red-500">*</span></label><Select value={role} onChange={setRole} options={[{ value: "admin", label: "Admin" }, { value: "superadmin", label: "Super Admin" }]} /></div>
            <div className="space-y-2"><label className="text-sm font-medium text-neutral-700">Password <span className="text-red-500">*</span></label><Input type="password" placeholder="Minimal 8 karakter" value={password} onChange={e => setPassword(e.target.value)} required /></div>
          </div>
        </div>
        <div className="flex items-center gap-3"><Button type="submit" disabled={loading}>Simpan</Button><Button type="button" variant="outline" onClick={() => router.back()}>Batal</Button></div>
      </form>
    </div>
  )
}
