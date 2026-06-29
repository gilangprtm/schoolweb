"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/admin/PageHeader"
import { DataTable, type Column } from "@/components/admin/ui/DataTable"
import { Badge } from "@/components/admin/ui/Badge"
import { DeleteDialog } from "@/components/admin/DeleteDialog"
import { useToast } from "@/components/admin/ui/Toast"
import { UserCog, Pencil, Trash2, Search } from "lucide-react"
import { getUsers, deleteUser } from "@/lib/actions/users"

interface Akun { id: string; name: string; email: string; role: string }

const roleLabels: Record<string, string> = { superadmin: "Super Admin", admin: "Admin" }
const roleVariant: Record<string, "success" | "info"> = { superadmin: "success", admin: "info" }

export default function AkunPage() {
  const router = useRouter()
  const [filter, setFilter] = useState("all")
  const [search, setSearch] = useState("")
  const [deleteTarget, setDeleteTarget] = useState<Akun | null>(null)
  const [akun, setAkun] = useState<Akun[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    getUsers().then(setAkun).catch(() => setAkun([])).finally(() => setLoading(false))
  }, [])

  const filtered = akun.filter(a => {
    if (filter !== "all" && a.role !== filter) return false
    if (search) { const q = search.toLowerCase(); if (!a.name.toLowerCase().includes(q) && !a.email.toLowerCase().includes(q)) return false }
    return true
  })

  const handleDelete = async () => {
    if (!deleteTarget) return
    try { await deleteUser(deleteTarget.id); setAkun(prev => prev.filter(a => a.id !== deleteTarget.id)); toast({ type: "success", title: "Akun dihapus" }) }
    catch { toast({ type: "error", title: "Gagal menghapus akun" }) }
    setDeleteTarget(null)
  }

  const columns: Column<Akun>[] = [
    { key: "name", label: "Nama", sortable: true },
    { key: "email", label: "Email" },
    { key: "role", label: "Role", render: (a) => <Badge variant={roleVariant[a.role] || "info"}>{roleLabels[a.role] || a.role}</Badge> },
    { key: "id", label: "Aksi", render: (a) => (<div className="flex gap-1"><Link href={`/admin/akun/${a.id}`} className="rounded p-1.5 text-neutral-400 hover:text-primary"><Pencil className="h-4 w-4" /></Link><button onClick={() => setDeleteTarget(a)} className="rounded p-1.5 text-neutral-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button></div>)},
  ]

  return (
    <div>
      <PageHeader title="Akun" breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Akun", href: "/admin/akun" }]} actionLabel="Tambah Akun" actionHref="/admin/akun/baru" />
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1">{[{ v:"all", l:"Semua" },{ v:"superadmin", l:"Super Admin" },{ v:"admin", l:"Admin" }].map(f => (<button key={f.v} onClick={() => setFilter(f.v)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filter === f.v ? "bg-primary text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"}`}>{f.l}</button>))}</div>
        <div className="relative w-full sm:w-64"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" /><input type="text" placeholder="Cari nama atau email..." value={search} onChange={e => setSearch(e.target.value)} className="w-full rounded-lg border border-neutral-200 bg-white py-2 pl-10 pr-3 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/20" /></div>
      </div>
      {loading ? <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-12 bg-neutral-100 animate-pulse rounded-lg" />)}</div> : <DataTable columns={columns} data={filtered} onRowClick={(a) => router.push(`/admin/akun/${a.id}`)} />}
      <DeleteDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)} itemName={deleteTarget?.name ?? ""} onConfirm={handleDelete} />
    </div>
  )
}
