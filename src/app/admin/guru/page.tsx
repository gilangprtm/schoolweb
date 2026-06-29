"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { PageHeader } from "@/components/admin/PageHeader"
import { DataTable, type Column } from "@/components/admin/ui/DataTable"
import { Badge } from "@/components/admin/ui/Badge"
import { DeleteDialog } from "@/components/admin/DeleteDialog"
import { useToast } from "@/components/admin/ui/Toast"
import { Users, Pencil, Trash2 } from "lucide-react"
import { getAllStaff, deleteStaff } from "@/lib/actions/staff"
import type { Staff } from "@/types"

const roleLabels: Record<string, string> = { headmaster: "Kepala Sekolah", teacher: "Guru", staff: "Staf" }
const roleVariant: Record<string, "info" | "success" | "secondary"> = { headmaster: "info", teacher: "success", staff: "secondary" }

export default function GuruPage() {
  const [filter, setFilter] = useState("all")
  const [deleteTarget, setDeleteTarget] = useState<Staff | null>(null)
  const [staff, setStaff] = useState<Staff[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    getAllStaff({ limit: 500 })
      .then((res) => setStaff(res.data as Staff[]))
      .catch(() => setStaff([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === "all" ? staff : staff.filter(s => s.role === filter)

  const handleDelete = async () => {
    if (!deleteTarget) return
    try { await deleteStaff(deleteTarget.id); setStaff(prev => prev.filter(s => s.id !== deleteTarget.id)); toast({ type: "success", title: "Data dihapus" }) }
    catch { toast({ type: "error", title: "Gagal menghapus data" }) }
    setDeleteTarget(null)
  }

  const columns: Column<Staff>[] = [
    { key: "name", label: "Nama", sortable: true },
    { key: "role", label: "Role", render: (s) => <Badge variant={roleVariant[s.role] || "secondary"}>{roleLabels[s.role]}</Badge> },
    { key: "subject", label: "Mata Pelajaran", render: (s) => <span className="text-sm text-neutral-600">{s.subject || "-"}</span> },
    { key: "isActive", label: "Status", render: (s) => <Badge variant={s.isActive ? "success" : "warning"}>{s.isActive ? "Aktif" : "Nonaktif"}</Badge> },
    { key: "id", label: "Aksi", render: (s) => (<div className="flex gap-1"><Link href={`/admin/guru/${s.id}`} className="rounded p-1.5 text-neutral-400 hover:text-primary"><Pencil className="h-4 w-4" /></Link><button onClick={() => setDeleteTarget(s)} className="rounded p-1.5 text-neutral-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button></div>)},
  ]

  return (
    <div>
      <PageHeader title="Guru & Staf" breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Guru & Staf", href: "/admin/guru" }]} actionLabel="Tambah" actionHref="/admin/guru/baru" />
      <div className="flex gap-2 mb-4">
        {["all", "headmaster", "teacher", "staff"].map(r => (
          <button key={r} onClick={() => setFilter(r)} className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${filter === r ? "bg-primary text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"}`}>
            {r === "all" ? "Semua" : roleLabels[r]}
          </button>
        ))}
      </div>
      {loading ? <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-12 bg-neutral-100 animate-pulse rounded-lg" />)}</div> : <DataTable columns={columns} data={filtered} />}
      <DeleteDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)} itemName={deleteTarget?.name ?? ""} onConfirm={handleDelete} />
    </div>
  )
}
