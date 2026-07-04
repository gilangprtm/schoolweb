"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { PageHeader } from "@/components/admin/PageHeader"
import { TextField, SelectField } from "@/components/admin/forms"
import { Button } from "@/components/ui/button"
import { getUserById, updateUserRole } from "@/lib/actions/users"

const roleOptions = [
  { value: "admin", label: "Admin" },
  { value: "superadmin", label: "Super Admin" },
]

export default function AkunEditPage() {
  const router = useRouter(); const params = useParams(); const id = params.id as string
  const [name, setName] = useState(""); const [email, setEmail] = useState("")
  const [role, setRole] = useState<string>("admin"); const [loading, setLoading] = useState(true)

  useEffect(() => {
    getUserById(id).then(u => {
      if (u) { setName(u.name || ""); setEmail(u.email || ""); setRole(u.role || "admin") }
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateUserRole(id, role as "admin" | "superadmin")
    } catch {}
    router.push("/admin/akun"); router.refresh()
  }

  if (loading) return <div className="space-y-6"><div className="h-8 w-40 bg-neutral-200 animate-pulse rounded" /><div className="h-96 bg-neutral-100 animate-pulse rounded-xl" /></div>

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Akun" breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Akun", href: "/admin/akun" }, { label: name, href: "#" }]} />
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
        <div className="rounded-xl border border-border bg-card p-6 space-y-5">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Informasi Akun</h2>

          <TextField label="Nama" value={name} onChange={setName} disabled />
          <TextField label="Email" value={email} onChange={setEmail} type="email" disabled />

          <SelectField label="Role" value={role} onChange={setRole} options={roleOptions} />
        </div>
        <div className="flex items-center gap-3">
          <Button type="submit">Simpan Perubahan</Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>Batal</Button>
        </div>
      </form>
    </div>
  )
}