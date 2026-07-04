"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/admin/PageHeader"
import { Button } from "@/components/ui/button"
import { TextField, TextareaField, SelectField, SwitchField } from "@/components/admin/forms"
import { createStaff } from "@/lib/actions/staff"

const roleOptions = [
  { value: "headmaster", label: "Kepala Sekolah" },
  { value: "teacher", label: "Guru" },
  { value: "staff", label: "Staf" },
]

export default function GuruBaruPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [role, setRole] = useState("teacher")
  const [subject, setSubject] = useState("")
  const [photoId, setPhotoId] = useState("")
  const [education, setEducation] = useState("")
  const [bio, setBio] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [sortOrder, setSortOrder] = useState("10")
  const [isActive, setIsActive] = useState(true)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")

  const validate = (): boolean => {
    const errs: Record<string, string> = {}
    if (!name.trim()) errs.name = "Nama wajib diisi"
    if (role === "teacher" && !subject.trim()) errs.subject = "Mata pelajaran wajib diisi untuk guru"
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Format email tidak valid"
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("name", name)
      formData.append("slug", slug)
      formData.append("role", role)
      if (subject) formData.append("subject", subject)
      formData.append("photoUrl", photoId ? `https://docs.google.com/uc?id=${photoId}` : "")
      formData.append("education", education)
      formData.append("bio", bio)
      formData.append("email", email)
      formData.append("phone", phone)
      formData.append("sortOrder", String(sortOrder))
      formData.append("isActive", String(isActive))
      await createStaff(formData)
    } catch {
      // redirect() in server action throws
    }
    router.push("/admin/guru")
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tambah Guru / Staf"
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Guru & Staf", href: "/admin/guru" },
          { label: "Tambah", href: "#" },
        ]}
      />
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
        <div className="rounded-xl border border-border bg-card p-6 space-y-5">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
            Informasi Personal
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <TextField
                label="Nama Lengkap"
                value={name}
                onChange={setName}
                placeholder="Masukkan nama lengkap dengan gelar"
                required
                error={errors.name}
              />
            </div>
            <SelectField
              label="Jabatan"
              value={role}
              onChange={setRole}
              options={roleOptions}
            />
            {role === "teacher" && (
              <TextField
                label="Mata Pelajaran"
                value={subject}
                onChange={setSubject}
                placeholder="Contoh: Matematika"
                required
                error={errors.subject}
              />
            )}
          </div>

          <TextField
            label="Foto Profil"
            value={photoId}
            onChange={setPhotoId}
            placeholder="Google Docs ID..."
            description="Masukkan ID gambar dari Google Drive"
          />
          {photoId && (
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-neutral-200 mx-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://docs.google.com/uc?id=${photoId}`}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <TextField
              label="Email"
              value={email}
              onChange={setEmail}
              type="email"
              placeholder="email@sekolah.sch.id"
              error={errors.email}
            />
            <TextField
              label="Telepon"
              value={phone}
              onChange={setPhone}
              type="tel"
              placeholder="08xxxxxxxxxx"
            />
          </div>

          <TextareaField
            label="Riwayat Pendidikan"
            value={education}
            onChange={setEducation}
            rows={2}
            placeholder="S1 Pendidikan Matematika, UNJ (2010)"
          />

          <TextareaField
            label="Biografi"
            value={bio}
            onChange={setBio}
            rows={3}
            placeholder="Riwayat singkat dan pengalaman..."
          />
        </div>

          <div className="rounded-xl border border-border bg-card p-6 space-y-5">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Pengaturan
            </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <SwitchField
              label="Status Aktif"
              checked={isActive}
              onChange={setIsActive}
              onLabel="Aktif"
              offLabel="Nonaktif"
              description="Nonaktifkan jika guru/staf sudah tidak bertugas"
            />
            <TextField
              label="Urutan Tampil"
              value={sortOrder}
              onChange={setSortOrder}
              type="number"
              description="Semakin kecil, semakin atas posisinya"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={loading}>
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Menyimpan...
              </span>
            ) : (
              "Simpan"
            )}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Batal
          </Button>
        </div>
      </form>
    </div>
  )
}
