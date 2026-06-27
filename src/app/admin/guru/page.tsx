"use client"

import { useState } from "react"
import Link from "next/link"
import { PageHeader } from "@/components/admin/PageHeader"
import { DataTable, type Column } from "@/components/admin/ui/DataTable"
import { Badge } from "@/components/admin/ui/Badge"
import { DeleteDialog } from "@/components/admin/DeleteDialog"
import { EmptyState } from "@/components/admin/EmptyState"
import { useToast } from "@/components/admin/ui/Toast"
import { Users, Pencil, Trash2 } from "lucide-react"

interface Staff { id: number; name: string; role: string; subject?: string; photoUrl: string; isActive: boolean; education: string; bio: string; email: string; phone: string; slug: string; sortOrder: number }

const roleLabels: Record<string, string> = { headmaster: "Kepala Sekolah", teacher: "Guru", staff: "Staf" }
const roleVariant: Record<string, "info" | "success" | "secondary"> = { headmaster: "info", teacher: "success", staff: "secondary" }

const mockStaff: Staff[] = [
  { id:1, name:"Drs. Ahmad Fauzi, M.Pd.", role:"headmaster", photoUrl:"", isActive:true, education:"S2 Manajemen Pendidikan", bio:"", email:"kepsek@sekolah.sch.id", phone:"", slug:"ahmad-fauzi", sortOrder:1 },
  { id:2, name:"Sri Wahyuni, S.Pd.", role:"teacher", subject:"Matematika", photoUrl:"", isActive:true, education:"S1 Pendidikan Matematika", bio:"", email:"sri@sekolah.sch.id", phone:"", slug:"sri-wahyuni", sortOrder:2 },
  { id:3, name:"Budi Hartono, S.Pd.", role:"teacher", subject:"Bahasa Indonesia", photoUrl:"", isActive:true, education:"S1 Pendidikan Bahasa", bio:"", email:"budi@sekolah.sch.id", phone:"", slug:"budi-hartono", sortOrder:3 },
  { id:4, name:"Dewi Lestari, S.Kom.", role:"teacher", subject:"TIK", photoUrl:"", isActive:true, education:"S1 Teknik Informatika", bio:"", email:"dewi@sekolah.sch.id", phone:"", slug:"dewi-lestari", sortOrder:4 },
  { id:5, name:"Rina Anggraini", role:"staff", photoUrl:"", isActive:true, education:"", bio:"", email:"rina@sekolah.sch.id", phone:"", slug:"rina-anggraini", sortOrder:5 },
  { id:6, name:"Hendra Gunawan, S.Pd.", role:"teacher", subject:"IPA", photoUrl:"", isActive:false, education:"S1 Pendidikan IPA", bio:"", email:"hendra@sekolah.sch.id", phone:"", slug:"hendra-gunawan", sortOrder:6 },
]

export default function GuruPage() {
  const [filter, setFilter] = useState("all")
  const [deleteTarget, setDeleteTarget] = useState<Staff | null>(null)
  const { toast } = useToast()

  const filtered = mockStaff.filter(s => {
    if (filter !== "all" && s.role !== filter) return false
    return true
  })

  const columns: Column<Staff>[] = [
    { key: "photoUrl", label: "Foto", render: (s) => (
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-200 text-sm font-medium text-neutral-600">{s.name.charAt(0)}</div>
    )},
    { key: "name", label: "Nama", sortable: true },
    { key: "role", label: "Jabatan", render: (s) => <Badge variant={roleVariant[s.role]}>{roleLabels[s.role]}</Badge> },
    { key: "subject", label: "Mapel", render: (s) => s.subject || "-" },
    { key: "isActive", label: "Status", render: (s) => <Badge variant={s.isActive ? "success" : "secondary"}>{s.isActive ? "Aktif" : "Nonaktif"}</Badge> },
    { key: "id", label: "Aksi", render: (s) => (
      <div className="flex items-center gap-1">
        <Link href={`/admin/guru/${s.id}`} className="rounded p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-primary"><Pencil className="h-4 w-4" /></Link>
        <button onClick={(e) => { e.stopPropagation(); setDeleteTarget(s) }} className="rounded p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
      </div>
    )},
  ]

  return (
    <div>
      <PageHeader title="Guru & Staf" breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Guru & Staf", href: "/admin/guru" }]} actionLabel="Tambah" actionHref="/admin/guru/baru" />
      <div className="mb-4 flex gap-1">
        {[{v:"all",l:"Semua"},{v:"headmaster",l:"Kepala Sekolah"},{v:"teacher",l:"Guru"},{v:"staff",l:"Staf"}].map(f => (
          <button key={f.v} onClick={() => setFilter(f.v)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filter === f.v ? "bg-primary text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"}`}>{f.l}</button>
        ))}
      </div>
      {filtered.length > 0 ? <DataTable columns={columns} data={filtered} /> : <EmptyState icon={Users} title="Belum ada data" description="Tambahkan data guru atau staf" actionLabel="Tambah" actionHref="/admin/guru/baru" />}
      <DeleteDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)} itemName={deleteTarget?.name ?? ""} onConfirm={() => { toast({ type: "success", title: "Data dihapus" }); setDeleteTarget(null) }} />
    </div>
  )
}
