"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/admin/PageHeader"
import { useToast } from "@/components/admin/ui/Toast"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"
import { getSchoolProfile, updateSchoolProfile } from "@/lib/actions/school-profile"
import type { SejarahItem } from "@/lib/actions/school-profile"

export default function ProfilSekolahPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [visi, setVisi] = useState("")
  const [misi, setMisi] = useState<string[]>([])
  const [sejarah, setSejarah] = useState<SejarahItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getSchoolProfile()
      .then((p) => {
        setVisi(p.visi)
        setMisi(p.misi.length > 0 ? p.misi : [""])
        setSejarah(Array.isArray(p.sejarah) && p.sejarah.length > 0 ? p.sejarah : ["" as any])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Misi helpers
  const addMisi = () => setMisi([...misi, ""])
  const removeMisi = (idx: number) => {
    if (misi.length <= 1) return
    setMisi(misi.filter((_, i) => i !== idx))
  }
  const updateMisi = (idx: number, val: string) => {
    const next = [...misi]
    next[idx] = val
    setMisi(next)
  }

  // Sejarah helpers
  const addSejarah = () => setSejarah([...sejarah, { year: "", title: "", description: "" }])
  const removeSejarah = (idx: number) => {
    if (sejarah.length <= 1) return
    setSejarah(sejarah.filter((_, i) => i !== idx))
  }
  const updateSejarah = (idx: number, field: keyof SejarahItem, val: string) => {
    const next = [...sejarah]
    next[idx] = { ...next[idx], [field]: val }
    setSejarah(next)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await updateSchoolProfile({
        visi,
        misi: misi.filter((m) => m.trim() !== ""),
        sejarah: sejarah.filter((s) => s.year.trim() !== "" && s.title.trim() !== ""),
      })
      toast({ type: "success", title: "Profil sekolah disimpan" })
      router.refresh()
    } catch {
      toast({ type: "error", title: "Gagal menyimpan" })
    } finally {
      setSaving(false)
    }
  }

  if (loading)
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 bg-muted animate-pulse rounded-xl" />
        ))}
      </div>
    )

  return (
    <div className="space-y-6">
      <PageHeader title="Profil Sekolah" breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Profil Sekolah", href: "#" }]} />
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
        {/* Visi */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
            <span className="inline-flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground text-xs font-bold">V</span>
            Visi
          </h2>
          <textarea
            value={visi}
            onChange={(e) => setVisi(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-ring/20 resize-none"
            placeholder="Tuliskan visi sekolah..."
          />
        </div>

        {/* Misi */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
              <span className="inline-flex size-7 items-center justify-center rounded-lg bg-secondary text-secondary-foreground text-xs font-bold">M</span>
              Misi
            </h2>
            <Button type="button" variant="outline" size="sm" onClick={addMisi}>
              <Plus className="size-4 mr-1" /> Tambah
            </Button>
          </div>
          <div className="space-y-3">
            {misi.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="inline-flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-bold shrink-0 mt-1">
                  {idx + 1}
                </span>
                <textarea
                  value={item}
                  onChange={(e) => updateMisi(idx, e.target.value)}
                  rows={2}
                  className="flex-1 rounded-lg border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-ring/20 resize-none"
                  placeholder={`Misi ke-${idx + 1}...`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="mt-1 text-muted-foreground hover:text-destructive shrink-0"
                  onClick={() => removeMisi(idx)}
                  disabled={misi.length <= 1}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Sejarah */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
              <span className="inline-flex size-7 items-center justify-center rounded-lg bg-accent text-accent-foreground text-xs font-bold">S</span>
              Sejarah
            </h2>
            <Button type="button" variant="outline" size="sm" onClick={addSejarah}>
              <Plus className="size-4 mr-1" /> Tambah Periode
            </Button>
          </div>
          <div className="space-y-4">
            {sejarah.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="inline-flex size-8 items-center justify-center rounded-lg bg-accent/10 text-accent-foreground text-xs font-bold shrink-0 mt-1">
                  {idx + 1}
                </span>
                <div className="flex-1 space-y-2">
                  {/* Year + Title row */}
                  <div className="flex gap-2">
                    <input
                      value={item.year}
                      onChange={(e) => updateSejarah(idx, "year", e.target.value)}
                      className="w-24 rounded-lg border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-ring/20"
                      placeholder="Tahun"
                    />
                    <input
                      value={item.title}
                      onChange={(e) => updateSejarah(idx, "title", e.target.value)}
                      className="flex-1 rounded-lg border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-ring/20"
                      placeholder="Judul periode"
                    />
                  </div>
                  {/* Description */}
                  <textarea
                    value={item.description}
                    onChange={(e) => updateSejarah(idx, "description", e.target.value)}
                    rows={3}
                    className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-ring/20 resize-none"
                    placeholder="Deskripsi periode..."
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="mt-1 text-muted-foreground hover:text-destructive shrink-0"
                  onClick={() => removeSejarah(idx)}
                  disabled={sejarah.length <= 1}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Batal
          </Button>
        </div>
      </form>
    </div>
  )
}
