"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { PageHeader } from "@/components/admin/PageHeader"
import { Pencil } from "lucide-react"
import { getAllPages } from "@/lib/actions/pages"
import type { Page } from "@/types"

export default function HalamanPage() {
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllPages().then((p) => setPages(p.map(item => ({ ...item, updatedAt: String(item.updatedAt) })) as Page[])).catch(() => setPages([])).finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <PageHeader title="Halaman Statis" breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Halaman", href: "/admin/halaman" }]} />
      {loading ? (
        <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-12 bg-neutral-100 animate-pulse rounded-lg" />)}</div>
      ) : (
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
      )}
    </div>
  )
}
