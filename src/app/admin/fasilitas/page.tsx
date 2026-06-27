"use client"

import { useState } from "react"
import Link from "next/link"
import { PageHeader } from "@/components/admin/PageHeader"
import { DataTable, type Column } from "@/components/admin/ui/DataTable"
import { Badge } from "@/components/admin/ui/Badge"
import { DeleteDialog } from "@/components/admin/DeleteDialog"
import { useToast } from "@/components/admin/ui/Toast"
import { Building2, Pencil, Trash2, Star } from "lucide-react"

interface Facility { id:number; name:string; category:string; isFeatured:boolean; sortOrder:number; isPublished:boolean }

const catLabels: Record<string,string> = { akademik:"Akademik", olahraga:"Olahraga", seni:"Seni", ibadah:"Ibadah", teknologi:"Teknologi", lainnya:"Lainnya" }

const mock: Facility[] = [
  { id:1, name:"Laboratorium Komputer", category:"teknologi", isFeatured:true, sortOrder:1, isPublished:true },
  { id:2, name:"Perpustakaan", category:"akademik", isFeatured:true, sortOrder:2, isPublished:true },
  { id:3, name:"Lapangan Basket", category:"olahraga", isFeatured:false, sortOrder:3, isPublished:true },
  { id:4, name:"Mushola", category:"ibadah", isFeatured:false, sortOrder:4, isPublished:true },
  { id:5, name:"Ruang Seni", category:"seni", isFeatured:false, sortOrder:5, isPublished:false },
]

export default function FasilitasPage() {
  const [deleteTarget, setDeleteTarget] = useState<Facility | null>(null)
  const { toast } = useToast()

  const columns: Column<Facility>[] = [
    { key: "name", label: "Nama", sortable: true },
    { key: "category", label: "Kategori", render: (f) => <Badge variant="info">{catLabels[f.category]}</Badge> },
    { key: "isFeatured", label: "Featured", render: (f) => f.isFeatured ? <Star className="h-4 w-4 text-amber-500 fill-amber-500" /> : <Star className="h-4 w-4 text-neutral-300" /> },
    { key: "sortOrder", label: "Urutan" },
    { key: "isPublished", label: "Status", render: (f) => <Badge variant={f.isPublished ? "success" : "warning"}>{f.isPublished ? "Terbit" : "Draft"}</Badge> },
    { key: "id", label: "Aksi", render: (f) => (
      <div className="flex gap-1"><Link href={`/admin/fasilitas/${f.id}`} className="rounded p-1.5 text-neutral-400 hover:text-primary"><Pencil className="h-4 w-4" /></Link><button onClick={(e) => { e.stopPropagation(); setDeleteTarget(f) }} className="rounded p-1.5 text-neutral-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button></div>
    )},
  ]

  return (
    <div>
      <PageHeader title="Fasilitas" breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Fasilitas", href: "/admin/fasilitas" }]} actionLabel="Tambah Fasilitas" actionHref="/admin/fasilitas/baru" />
      <DataTable columns={columns} data={mock} />
      <DeleteDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)} itemName={deleteTarget?.name ?? ""} onConfirm={() => { toast({ type: "success", title: "Data dihapus" }); setDeleteTarget(null) }} />
    </div>
  )
}
