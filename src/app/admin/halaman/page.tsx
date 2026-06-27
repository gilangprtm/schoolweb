"use client"

import Link from "next/link"
import { PageHeader } from "@/components/admin/PageHeader"
import { Pencil } from "lucide-react"

const pages = [
  { id:1, title:"Profil Sekolah", slug:"profil", updatedAt:"2025-06-20" },
  { id:2, title:"Sejarah", slug:"sejarah", updatedAt:"2025-06-18" },
  { id:3, title:"Visi & Misi", slug:"visi-misi", updatedAt:"2025-06-15" },
  { id:4, title:"Kontak", slug:"kontak", updatedAt:"2025-06-10" },
  { id:5, title:"Pendaftaran", slug:"pendaftaran", updatedAt:"2025-05-01" },
]

export default function HalamanPage() {
  return (
    <div>
      <PageHeader title="Halaman Statis" breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Halaman", href: "/admin/halaman" }]} />
      <div className="rounded-lg border border-neutral-200 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-neutral-200 bg-neutral-50"><th className="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">Judul</th><th className="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">Slug</th><th className="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">Terakhir Diperbarui</th><th className="px-4 py-3 text-left text-xs font-semibold uppercase text-neutral-500">Aksi</th></tr></thead>
          <tbody className="divide-y divide-neutral-100">
            {pages.map(p => (
              <tr key={p.id} className="hover:bg-neutral-50">
                <td className="px-4 py-3 font-medium text-neutral-800">{p.title}</td>
                <td className="px-4 py-3 text-neutral-500 font-mono text-xs">/{p.slug}</td>
                <td className="px-4 py-3 text-neutral-500">{new Date(p.updatedAt).toLocaleDateString("id-ID")}</td>
                <td className="px-4 py-3"><Link href={`/admin/halaman/${p.id}`} className="inline-flex items-center gap-1 text-sm text-primary hover:underline"><Pencil className="h-3.5 w-3.5" /> Edit</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
