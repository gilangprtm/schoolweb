"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { PageHeader } from "@/components/admin/PageHeader"
import { Badge } from "@/components/admin/ui/Badge"
import { DeleteDialog } from "@/components/admin/DeleteDialog"
import { useToast } from "@/components/admin/ui/Toast"
import { Image, Video } from "lucide-react"
import { getGalleries, deleteGallery } from "@/lib/actions/galleries"
import type { Gallery } from "@/types"

export default function GaleriPage() {
  const [deleteTarget, setDeleteTarget] = useState<Gallery | null>(null)
  const [galleries, setGalleries] = useState<Gallery[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    getGalleries().then((g) => setGalleries(g.map(item => ({ ...item, type: item.type as Gallery["type"], createdAt: String(item.createdAt) })))).catch(() => setGalleries([])).finally(() => setLoading(false))
  }, [])

  const handleDelete = async () => {
    if (!deleteTarget) return
    try { await deleteGallery(deleteTarget.id); setGalleries(prev => prev.filter(g => g.id !== deleteTarget.id)); toast({ type: "success", title: "Album dihapus" }) }
    catch { toast({ type: "error", title: "Gagal menghapus album" }) }
    setDeleteTarget(null)
  }

  if (loading) return <div><PageHeader title="Galeri" breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Galeri", href: "/admin/galeri" }]} actionLabel="Tambah Album" actionHref="/admin/galeri/baru" /><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{Array.from({length:4}).map((_,i)=><div key={i} className="h-48 bg-neutral-100 animate-pulse rounded-lg" />)}</div></div>

  return (
    <div>
      <PageHeader title="Galeri" breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Galeri", href: "/admin/galeri" }]} actionLabel="Tambah Album" actionHref="/admin/galeri/baru" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {galleries.map(a => (
          <div key={a.id} className="rounded-lg border border-neutral-200 bg-white overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-40 bg-neutral-100 flex items-center justify-center">
              {a.type === "photo" ? <Image className="h-12 w-12 text-neutral-300" /> : <Video className="h-12 w-12 text-neutral-300" />}
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div><h3 className="font-semibold text-neutral-800 text-sm">{a.title}</h3><p className="text-xs text-neutral-500 mt-0.5">{a.media?.length || 0} media</p></div>
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
      <DeleteDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)} itemName={deleteTarget?.title ?? ""} onConfirm={handleDelete} />
    </div>
  )
}
