"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { PageHeader } from "@/components/admin/PageHeader"
import { DataTable, type Column } from "@/components/admin/ui/DataTable"
import { Badge } from "@/components/admin/ui/Badge"
import { DeleteDialog } from "@/components/admin/DeleteDialog"
import { useToast } from "@/components/admin/ui/Toast"
import { Building2, Pencil, Trash2, Star } from "lucide-react"
import { getFacilities, deleteFacility } from "@/lib/actions/facilities"
import type { Facility } from "@/types"

const catLabels: Record<string,string> = { akademik:"Akademik", olahraga:"Olahraga", seni:"Seni", ibadah:"Ibadah", teknologi:"Teknologi", lainnya:"Lainnya" }

export default function FasilitasPage() {
  const [deleteTarget, setDeleteTarget] = useState<Facility | null>(null)
  const [facilities, setFacilities] = useState<Facility[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    getFacilities({ limit: 100 })
      .then((res) => setFacilities(res.data as Facility[]))
      .catch(() => setFacilities([]))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async () => {
    if (!deleteTarget) return
    try { await deleteFacility(deleteTarget.id); setFacilities(prev => prev.filter(f => f.id !== deleteTarget.id)); toast({ type: "success", title: "Data dihapus" }) }
    catch { toast({ type: "error", title: "Gagal menghapus data" }) }
    setDeleteTarget(null)
  }

  const columns: Column<Facility>[] = [
    { key: "name", label: "Nama", sortable: true },
    { key: "category", label: "Kategori", render: (f) => <Badge variant="info">{catLabels[f.category]}</Badge> },
    { key: "isFeatured", label: "Featured", render: (f) => f.isFeatured ? <Star className="h-4 w-4 text-amber-500 fill-amber-500" /> : <Star className="h-4 w-4 text-neutral-300" /> },
    { key: "sortOrder", label: "Urutan" },
    { key: "isPublished", label: "Status", render: (f) => <Badge variant={f.isPublished ? "success" : "warning"}>{f.isPublished ? "Terbit" : "Draft"}</Badge> },
    { key: "id", label: "Aksi", render: (f) => (<div className="flex gap-1"><Link href={`/admin/fasilitas/${f.id}`} className="rounded p-1.5 text-neutral-400 hover:text-primary"><Pencil className="h-4 w-4" /></Link><button onClick={() => setDeleteTarget(f)} className="rounded p-1.5 text-neutral-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button></div>)},
  ]

  return (
    <div>
      <PageHeader title="Fasilitas" breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Fasilitas", href: "/admin/fasilitas" }]} actionLabel="Tambah Fasilitas" actionHref="/admin/fasilitas/baru" />
      {loading ? <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-12 bg-neutral-100 animate-pulse rounded-lg" />)}</div> : <DataTable columns={columns} data={facilities} />}
      <DeleteDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)} itemName={deleteTarget?.name ?? ""} onConfirm={handleDelete} />
    </div>
  )
}
