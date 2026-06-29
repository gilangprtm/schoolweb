"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { PageHeader } from "@/components/admin/PageHeader"
import { Select } from "@/components/admin/ui/Select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getUserById, updateUserRole } from "@/lib/actions/users"

export default function AkunEditPage() {
  const router = useRouter(); const params = useParams(); const id = params.id as string
  const [name, setName] = useState(""); const [email, setEmail] = useState("")
  const [role, setRole] = useState<"superadmin" | "admin">("admin"); const [loading, setLoading] = useState(true)

  useEffect(() => {
    getUserById(id).then(u => {
      if (u) { setName(u.name || ""); setEmail(u.email || ""); setRole((u.role as "superadmin" | "admin") || "admin") }
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateUserRole(id, role)
    } catch {}
    router.push("/admin/akun"); router.refresh()
  }

  if (loading) return <div className="space-y-6"><div className="h-8 w-40 bg-neutral-200 animate-pulse rounded" /><div className="h-96 bg-neutral-100 animate-pulse rounded-xl" /></div>

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Akun" breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Akun", href: "/admin/akun" }, { label: name, href: "#" }]} />
      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        <div className="rounded-xl border border-neutral-200 bg-white p-6 space-y-5">
          <h2 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider">Informasi Akun</h2>
          <div className="space-y-2"><label className="text-sm font-medium text-neutral-700">Nama</label><Input value={name} disabled /></div>
          <div className="space-y-2"><label className="text-sm font-medium text-neutral-700">Email</label><Input type="email" value={email} disabled /></div>
          <div className="space-y-2"><label className="text-sm font-medium text-neutral-700">Role</label><Select value={role} onChange={(v) => setRole(v as "superadmin" | "admin")} options={[{ value: "admin", label: "Admin" }, { value: "superadmin", label: "Super Admin" }]} /></div>
        </div>
        <div className="flex items-center gap-3"><Button type="submit">Simpan Perubahan</Button><Button type="button" variant="outline" onClick={() => router.back()}>Batal</Button></div>
      </form>
    </div>
  )
}
