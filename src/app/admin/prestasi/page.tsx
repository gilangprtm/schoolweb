"use client"

import { useState } from "react"
import Link from "next/link"
import { PageHeader } from "@/components/admin/PageHeader"
import { DataTable, type Column } from "@/components/admin/ui/DataTable"
import { Badge } from "@/components/admin/ui/Badge"
import { DeleteDialog } from "@/components/admin/DeleteDialog"
import { useToast } from "@/components/admin/ui/Toast"
import { Trophy, Pencil, Trash2, Star } from "lucide-react"

interface Achievement { id:number; title:string; category:string; level:string; champion:string; isFeatured:boolean; isPublished:boolean }

const catLabels: Record<string,string> = { student:"Siswa", teacher:"Guru", school:"Sekolah" }
const lvlLabels: Record<string,string> = { kecamatan:"Kecamatan", kabupaten:"Kabupaten", provinsi:"Provinsi", nasional:"Nasional", internasional:"Internasional" }
const champLabels: Record<string,string> = { "1":"Juara 1", "2":"Juara 2", "3":"Juara 3", harapan:"Harapan", peserta:"Peserta" }
const champVariant: Record<string,"success"|"warning"|"secondary"> = { "1":"success", "2":"warning", "3":"warning" }

const mock: Achievement[] = [
  { id:1, title:"Medali Emas OSN Matematika", category:"student", level:"nasional", champion:"1", isFeatured:true, isPublished:true },
  { id:2, title:"Juara 2 Lomba Debat", category:"student", level:"provinsi", champion:"2", isFeatured:true, isPublished:true },
  { id:3, title:"Sekolah Adiwiyata", category:"school", level:"nasional", champion:"1", isFeatured:false, isPublished:true },
  { id:4, title:"Guru Berprestasi Tingkat Kabupaten", category:"teacher", level:"kabupaten", champion:"1", isFeatured:false, isPublished:true },
  { id:5, title:"Lomba Cipta Puisi", category:"student", level:"kecamatan", champion:"3", isFeatured:false, isPublished:false },
]

export default function PrestasiPage() {
  const [deleteTarget, setDeleteTarget] = useState<Achievement | null>(null)
  const { toast } = useToast()

  const columns: Column<Achievement>[] = [
    { key: "title", label: "Judul", sortable: true },
    { key: "category", label: "Kategori", render: (a) => <Badge variant="info">{catLabels[a.category]}</Badge> },
    { key: "level", label: "Tingkat", render: (a) => <Badge variant="outline">{lvlLabels[a.level]}</Badge> },
    { key: "champion", label: "Juara", render: (a) => <Badge variant={champVariant[a.champion] || "secondary"}>{champLabels[a.champion]}</Badge> },
    { key: "isFeatured", label: "Featured", render: (a) => a.isFeatured ? <Star className="h-4 w-4 text-amber-500 fill-amber-500" /> : <Star className="h-4 w-4 text-neutral-300" /> },
    { key: "isPublished", label: "Status", render: (a) => <Badge variant={a.isPublished ? "success" : "warning"}>{a.isPublished ? "Terbit" : "Draft"}</Badge> },
    { key: "id", label: "Aksi", render: (a) => (
      <div className="flex gap-1"><Link href={`/admin/prestasi/${a.id}`} className="rounded p-1.5 text-neutral-400 hover:text-primary"><Pencil className="h-4 w-4" /></Link><button onClick={(e) => { e.stopPropagation(); setDeleteTarget(a) }} className="rounded p-1.5 text-neutral-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button></div>
    )},
  ]

  return (
    <div>
      <PageHeader title="Prestasi" breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Prestasi", href: "/admin/prestasi" }]} actionLabel="Tambah Prestasi" actionHref="/admin/prestasi/baru" />
      <DataTable columns={columns} data={mock} />
      <DeleteDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)} itemName={deleteTarget?.title ?? ""} onConfirm={() => { toast({ type: "success", title: "Data dihapus" }); setDeleteTarget(null) }} />
    </div>
  )
}
