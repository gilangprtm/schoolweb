"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/admin/PageHeader"
import { TextField, SelectField } from "@/components/admin/forms"
import { Button } from "@/components/ui/button"
import { createUser } from "@/lib/actions/users"

const roleOptions = [
  { value: "admin", label: "Admin" },
  { value: "superadmin", label: "Super Admin" },
]

export default function AkunBaruPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<string>("admin")
  const [password, setPassword] = useState("")
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
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
        <div className="rounded-xl border border-border bg-card p-6 space-y-5">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Informasi Akun</h2>

          <TextField label="Nama" value={name} onChange={setName} placeholder="Nama lengkap" required />
          <TextField label="Email" value={email} onChange={setEmail} type="email" placeholder="nama@sekolah.sch.id" required />

          <div className="grid sm:grid-cols-2 gap-4">
            <SelectField label="Role" value={role} onChange={setRole} options={roleOptions} required />
            <TextField label="Password" value={password} onChange={setPassword} type="password" placeholder="Minimal 8 karakter" required minLength={8} />
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