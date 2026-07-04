"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { PageHeader } from "@/components/admin/PageHeader"
import { DataTable, type Column } from "@/components/admin/ui/DataTable"
import { Badge } from "@/components/admin/ui/Badge"
import { DeleteDialog } from "@/components/admin/DeleteDialog"
import { EmptyState } from "@/components/admin/EmptyState"
import { useToast } from "@/components/admin/ui/Toast"
import { Newspaper, Pencil, Trash2 } from "lucide-react"
import { getPosts, deletePost } from "@/lib/actions/posts"
import type { Post } from "@/types"

const catBadge: Record<string, "info" | "warning"> = { news: "info", announcement: "warning" }

export default function BeritaPage() {
  const [filter, setFilter] = useState<"all" | "news" | "announcement">("all")
  const [search, setSearch] = useState("")
  const [deleteTarget, setDeleteTarget] = useState<Post | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    getPosts({ status: "all", limit: 500 })
      .then((res) => setPosts(res.data.map((p: Record<string, unknown>) => ({ ...p, publishedAt: String(p.publishedAt), category: p.category as Post["category"] })) as Post[]))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = posts.filter(p => {
    if (filter !== "all" && p.category !== filter) return false
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deletePost(deleteTarget.id)
      setPosts(prev => prev.filter(p => p.id !== deleteTarget.id))
      toast({ type: "success", title: "Berita dihapus", description: `"${deleteTarget.title}" telah dihapus` })
    } catch {
      toast({ type: "error", title: "Gagal menghapus berita" })
    }
    setDeleteTarget(null)
  }

  const columns: Column<Post>[] = [
    { key: "title", label: "Judul", sortable: true },
    { key: "category", label: "Kategori", render: (p) => (
      <Badge variant={catBadge[p.category]}>{p.category === "news" ? "Berita" : "Pengumuman"}</Badge>
    )},
    { key: "isPublished", label: "Status", render: (p) => (
      <Badge variant={p.isPublished ? "success" : "warning"}>{p.isPublished ? "Terbit" : "Draft"}</Badge>
    )},
    { key: "publishedAt", label: "Tanggal", render: (p) => new Date(p.publishedAt).toLocaleDateString("id-ID") },
    { key: "id", label: "Aksi", render: (p) => (
      <div className="flex items-center gap-1">
        <Link href={`/admin/berita/${p.id}`} className="rounded p-1.5 text-neutral-400 hover:bg-muted hover:text-primary"><Pencil className="h-4 w-4" /></Link>
        <button onClick={() => setDeleteTarget(p)} className="rounded p-1.5 text-neutral-400 hover:bg-muted hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
      </div>
    )},
  ]

  return (
    <div>
      <PageHeader title="Berita & Pengumuman" breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Berita", href: "/admin/berita" }]} actionLabel="Tambah Berita" actionHref="/admin/berita/baru" />
      {loading ? (
        <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-12 bg-muted animate-pulse rounded-lg" />)}</div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={Newspaper} title="Belum ada postingan" description="Mulai dengan menambahkan berita atau pengumuman pertama" actionLabel="Tambah Berita" actionHref="/admin/berita/baru" />
      ) : (
        <DataTable columns={columns} data={filtered} />
      )}
      <DeleteDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)} itemName={deleteTarget?.title ?? ""} onConfirm={handleDelete} />
    </div>
  )
}
