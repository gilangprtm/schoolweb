"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/admin/PageHeader"
import { Select } from "@/components/admin/ui/Select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createStaff } from "@/lib/actions/staff"

export default function GuruBaruPage() {
  const router = useRouter()
  const [name, setName] = useState(""); const [role, setRole] = useState("teacher"); const [subject, setSubject] = useState("")
  const [photoId, setPhotoId] = useState(""); const [education, setEducation] = useState(""); const [bio, setBio] = useState("")
  const [email, setEmail] = useState(""); const [phone, setPhone] = useState(""); const [sortOrder, setSortOrder] = useState(10)
  const [isActive, setIsActive] = useState(true); const [loading, setLoading] = useState(false)
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true)
    try {
      const formData = new FormData()
      formData.append("name", name); formData.append("slug", slug); formData.append("role", role)
      if (subject) formData.append("subject", subject)
      formData.append("photoUrl", photoId ? `https://docs.google.com/uc?id=${photoId}` : ""); formData.append("education", education); formData.append("bio", bio)
      formData.append("email", email); formData.append("phone", phone)
      formData.append("sortOrder", String(sortOrder)); formData.append("isActive", String(isActive))
      await createStaff(formData)
    } catch {}
    router.push("/admin/guru"); router.refresh()
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Tambah Guru / Staf" breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Guru & Staf", href: "/admin/guru" }, { label: "Tambah", href: "#" }]} />
      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        <div className="rounded-xl border border-neutral-200 bg-white p-6 space-y-5">
          <h2 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider">Informasi</h2>
          <div className="space-y-2"><label className="text-sm font-medium text-neutral-700">Nama <span className="text-red-500">*</span></label><Input value={name} onChange={e => setName(e.target.value)} required /></div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2"><label className="text-sm font-medium text-neutral-700">Role</label><Select value={role} onChange={setRole} options={[{ value: "headmaster", label: "Kepala Sekolah" }, { value: "teacher", label: "Guru" }, { value: "staff", label: "Staf" }]} /></div>
            {role === "teacher" && <div className="space-y-2"><label className="text-sm font-medium text-neutral-700">Mata Pelajaran</label><Input value={subject} onChange={e => setSubject(e.target.value)} /></div>}
          </div>
          <div className="space-y-2"><label className="text-sm font-medium text-neutral-700">Foto Profil</label><Input placeholder="Google Docs ID..." value={photoId} onChange={e => setPhotoId(e.target.value)} />{photoId && <img src={`https://docs.google.com/uc?id=${photoId}`} alt="preview" className="w-full max-w-xs aspect-square object-cover rounded-lg border" />}</div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2"><label className="text-sm font-medium text-neutral-700">Email</label><Input type="email" value={email} onChange={e => setEmail(e.target.value)} /></div>
            <div className="space-y-2"><label className="text-sm font-medium text-neutral-700">Telepon</label><Input value={phone} onChange={e => setPhone(e.target.value)} /></div>
          </div>
          <div className="space-y-2"><label className="text-sm font-medium text-neutral-700">Pendidikan</label><textarea rows={2} value={education} onChange={e => setEducation(e.target.value)} className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" /></div>
          <div className="space-y-2"><label className="text-sm font-medium text-neutral-700">Biografi</label><textarea rows={3} value={bio} onChange={e => setBio(e.target.value)} className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" /></div>
          <div className="space-y-2"><label className="text-sm font-medium text-neutral-700">Urutan</label><Input type="number" value={sortOrder} onChange={e => setSortOrder(Number(e.target.value))} /></div>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-6 space-y-5">
          <h2 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider">Status</h2>
          <div className="flex items-center justify-between"><div><label className="text-sm font-medium text-neutral-700">Aktif</label></div><button type="button" role="switch" aria-checked={isActive} onClick={() => setIsActive(!isActive)} className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${isActive ? "bg-emerald-500" : "bg-neutral-300"}`}><span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${isActive ? "translate-x-5" : "translate-x-0"}`} /></button></div>
        </div>
        <div className="flex items-center gap-3"><Button type="submit" disabled={loading}>Simpan</Button><Button type="button" variant="outline" onClick={() => router.back()}>Batal</Button></div>
      </form>
    </div>
  )
}
