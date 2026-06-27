"use client"

import { useState } from "react"
import Link from "next/link"
import { PageHeader } from "@/components/admin/PageHeader"
import { Badge } from "@/components/admin/ui/Badge"
import { DeleteDialog } from "@/components/admin/DeleteDialog"
import { useToast } from "@/components/admin/ui/Toast"
import { Image, Video, Pencil, Trash2 } from "lucide-react"

interface Album { id:number; title:string; description:string; type:"photo"|"video"; createdAt:string; mediaCount:number }

const mock: Album[] = [
  { id:1, title:"Kegiatan Upacara", description:"Dokumentasi upacara bendera", type:"photo", createdAt:"2025-06-20", mediaCount:12 },
  { id:2, title:"Pentas Seni 2025", description:"Video pentas seni akhir tahun", type:"video", createdAt:"2025-06-15", mediaCount:5 },
  { id:3, title:"Study Tour", description:"Foto kegiatan study tour", type:"photo", createdAt:"2025-05-10", mediaCount:24 },
  { id:4, title:"Profil Sekolah", description:"Video profil resmi sekolah", type:"video", createdAt:"2025-04-01", mediaCount:1 },
]

export default function GaleriPage() {
  const [deleteTarget, setDeleteTarget] = useState<Album | null>(null)
  const { toast } = useToast()

  return (
    <div>
      <PageHeader title="Galeri" breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Galeri", href: "/admin/galeri" }]} actionLabel="Tambah Album" actionHref="/admin/galeri/baru" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mock.map(a => (
          <div key={a.id} className="rounded-lg border border-neutral-200 bg-white overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-40 bg-neutral-100 flex items-center justify-center">
              {a.type === "photo" ? <Image className="h-12 w-12 text-neutral-300" /> : <Video className="h-12 w-12 text-neutral-300" />}
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div><h3 className="font-semibold text-neutral-800 text-sm">{a.title}</h3><p className="text-xs text-neutral-500 mt-0.5">{a.mediaCount} media</p></div>
                <Badge variant={a.type === "photo" ? "info" : "warning"}>{a.type === "photo" ? "Foto" : "Video"}</Badge>
              </div>
              <div className="flex gap-1 mt-3 pt-3 border-t border-neutral-100">
                <Link href={`/admin/galeri/${a.id}`} className="flex-1 text-center text-xs text-primary hover:bg-primary/5 rounded py-1.5">Buka</Link>
                <button onClick={() => setDeleteTarget(a)} className="flex-1 text-center text-xs text-red-600 hover:bg-red-50 rounded py-1.5">Hapus</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <DeleteDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)} itemName={deleteTarget?.title ?? ""} onConfirm={() => { toast({ type: "success", title: "Album dihapus" }); setDeleteTarget(null) }} />
    </div>
  )
}
