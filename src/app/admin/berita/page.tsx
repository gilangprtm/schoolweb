"use client"

import { useState } from "react"
import Link from "next/link"
import { PageHeader } from "@/components/admin/PageHeader"
import { DataTable, type Column } from "@/components/admin/ui/DataTable"
import { Badge } from "@/components/admin/ui/Badge"
import { DeleteDialog } from "@/components/admin/DeleteDialog"
import { EmptyState } from "@/components/admin/EmptyState"
import { useToast } from "@/components/admin/ui/Toast"
import { Newspaper, Pencil, Trash2 } from "lucide-react"

interface Post {
  id: number; title: string; category: "news" | "announcement"
  isPublished: boolean; publishedAt: string; slug: string
  excerpt: string; content: string; imageUrl: string
}

const mockPosts: Post[] = [
  { id:1, title:"Pengumuman PPDB 2025/2026", category:"announcement", isPublished:true, publishedAt:"2025-06-25", slug:"ppdb-2025", excerpt:"Informasi lengkap pendaftaran peserta didik baru...", content:"", imageUrl:"" },
  { id:2, title:"Prestasi Siswa di OSN 2025", category:"news", isPublished:true, publishedAt:"2025-06-20", slug:"prestasi-osn-2025", excerpt:"Siswa meraih medali emas...", content:"", imageUrl:"" },
  { id:3, title:"Jadwal Ujian Akhir Semester", category:"announcement", isPublished:false, publishedAt:"2025-06-18", slug:"jadwal-uas", excerpt:"Ujian akhir semester ganjil...", content:"", imageUrl:"" },
  { id:4, title:"Kunjungan Industri ke PT. XYZ", category:"news", isPublished:true, publishedAt:"2025-06-15", slug:"kunjungan-industri", excerpt:"Siswa kelas XI melakukan kunjungan...", content:"", imageUrl:"" },
  { id:5, title:"Workshop Guru Kreatif", category:"news", isPublished:true, publishedAt:"2025-06-10", slug:"workshop-guru", excerpt:"Pelatihan metode pembelajaran...", content:"", imageUrl:"" },
  { id:6, title:"Libur Semester Ganjil", category:"announcement", isPublished:true, publishedAt:"2025-06-01", slug:"libur-semester", excerpt:"Pengumuman jadwal libur...", content:"", imageUrl:"" },
  { id:7, title:"Lomba Cerdas Cermat", category:"news", isPublished:true, publishedAt:"2025-05-28", slug:"lomba-cerdas-cermat", excerpt:"Tim sekolah meraih juara...", content:"", imageUrl:"" },
  { id:8, title:"Rapat Orang Tua Siswa", category:"announcement", isPublished:false, publishedAt:"2025-05-20", slug:"rapat-ortu", excerpt:"Undangan rapat orang tua...", content:"", imageUrl:"" },
]

const catBadge: Record<string, "info" | "warning"> = { news: "info", announcement: "warning" }

export default function BeritaPage() {
  const [filter, setFilter] = useState<"all" | "news" | "announcement">("all")
  const [search, setSearch] = useState("")
  const [deleteTarget, setDeleteTarget] = useState<Post | null>(null)
  const { toast } = useToast()

  const filtered = mockPosts.filter(p => {
    if (filter !== "all" && p.category !== filter) return false
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const handleDelete = () => {
    toast({ type: "success", title: "Berita dihapus", description: `"${deleteTarget?.title}" telah dihapus` })
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
        <Link href={`/admin/berita/${p.id}`} className="rounded p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-primary"><Pencil className="h-4 w-4" /></Link>
        <button onClick={(e) => { e.stopPropagation(); setDeleteTarget(p) }} className="rounded p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
      </div>
    )},
  ]

  return (
    <div>
      <PageHeader title="Berita & Pengumuman" breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Berita", href: "/admin/berita" }]} actionLabel="Tambah Berita" actionHref="/admin/berita/baru" />

      <div className="mb-4 flex flex-col sm:flex-row gap-3">
        <div className="flex gap-1">
          {(["all","news","announcement"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filter === f ? "bg-primary text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"}`}>
              {f === "all" ? "Semua" : f === "news" ? "Berita" : "Pengumuman"}
            </button>
          ))}
        </div>
        <input type="text" placeholder="Cari judul..." value={search} onChange={e => setSearch(e.target.value)}
          className="h-9 rounded-md border border-neutral-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 sm:ml-auto sm:w-64" />
      </div>

      {filtered.length > 0 ? (
        <DataTable columns={columns} data={filtered} />
      ) : (
        <EmptyState icon={Newspaper} title="Belum ada berita" description="Tambahkan berita atau pengumuman pertama" actionLabel="Tambah Berita" actionHref="/admin/berita/baru" />
      )}

      <DeleteDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)} itemName={deleteTarget?.title ?? ""} onConfirm={handleDelete} />
    </div>
  )
}
