"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/admin/PageHeader"
import { DataTable, type Column } from "@/components/admin/ui/DataTable"
import { Badge } from "@/components/admin/ui/Badge"
import { DeleteDialog } from "@/components/admin/DeleteDialog"
import { EmptyState } from "@/components/admin/EmptyState"
import { useToast } from "@/components/admin/ui/Toast"
import { UserCog, Pencil, Trash2, Search } from "lucide-react"

interface Akun {
  id: number
  name: string
  email: string
  role: "admin" | "guru" | "staff"
  isActive: boolean
  createdAt: string
}

const roleLabels: Record<string, string> = {
  admin: "Admin",
  guru: "Guru",
  staff: "Staff",
}

const roleVariant: Record<string, "success" | "info" | "warning"> = {
  admin: "success",
  guru: "info",
  staff: "warning",
}

const mockAkun: Akun[] = [
  { id: 1, name: "Administrator", email: "admin@sekolah.sch.id", role: "admin", isActive: true, createdAt: "2025-01-01" },
  { id: 2, name: "Budi Santoso, S.Pd.", email: "guru@sekolah.sch.id", role: "guru", isActive: true, createdAt: "2025-06-01" },
  { id: 3, name: "Ani Rahmawati", email: "staff@sekolah.sch.id", role: "staff", isActive: true, createdAt: "2025-06-15" },
  { id: 4, name: "Drs. Ahmad Fauzi", email: "ahmad.guru@sekolah.sch.id", role: "guru", isActive: false, createdAt: "2025-03-10" },
]

export default function AkunPage() {
  const router = useRouter()
  const [filter, setFilter] = useState("all")
  const [search, setSearch] = useState("")
  const [deleteTarget, setDeleteTarget] = useState<Akun | null>(null)
  const { toast } = useToast()

  const filtered = mockAkun.filter((a) => {
    if (filter !== "all" && a.role !== filter) return false
    if (search) {
      const q = search.toLowerCase()
      if (!a.name.toLowerCase().includes(q) && !a.email.toLowerCase().includes(q)) return false
    }
    return true
  })

  const columns: Column<Akun>[] = [
    { key: "name", label: "Nama", sortable: true },
    { key: "email", label: "Email" },
    {
      key: "role",
      label: "Role",
      render: (a) => <Badge variant={roleVariant[a.role]}>{roleLabels[a.role]}</Badge>,
    },
    {
      key: "isActive",
      label: "Status",
      render: (a) => (
        <Badge variant={a.isActive ? "success" : "secondary"}>
          {a.isActive ? "Aktif" : "Nonaktif"}
        </Badge>
      ),
    },
    { key: "createdAt", label: "Tanggal Dibuat", sortable: true },
    {
      key: "id",
      label: "Aksi",
      render: (a) => (
        <div className="flex items-center gap-1">
          <Link
            href={`/admin/akun/${a.id}`}
            className="rounded p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-primary"
          >
            <Pencil className="h-4 w-4" />
          </Link>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setDeleteTarget(a)
            }}
            className="rounded p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Akun"
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Akun", href: "/admin/akun" },
        ]}
        actionLabel="Tambah Akun"
        actionHref="/admin/akun/baru"
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1">
          {[
            { v: "all", l: "Semua" },
            { v: "admin", l: "Admin" },
            { v: "guru", l: "Guru" },
            { v: "staff", l: "Staff" },
          ].map((f) => (
            <button
              key={f.v}
              onClick={() => setFilter(f.v)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                filter === f.v
                  ? "bg-primary text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              {f.l}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Cari nama atau email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-neutral-200 bg-white py-2 pl-10 pr-3 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {filtered.length > 0 ? (
        <DataTable
          columns={columns}
          data={filtered}
          onRowClick={(a) => router.push(`/admin/akun/${a.id}`)}
        />
      ) : (
        <EmptyState
          icon={UserCog}
          title="Belum ada data"
          description="Tambahkan akun pengguna baru"
          actionLabel="Tambah Akun"
          actionHref="/admin/akun/baru"
        />
      )}

      <DeleteDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
        itemName={deleteTarget?.name ?? ""}
        onConfirm={() => {
          toast({ type: "success", title: "Akun dihapus" })
          setDeleteTarget(null)
        }}
      />
    </div>
  )
}
