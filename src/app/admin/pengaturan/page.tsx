"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/admin/PageHeader"
import { useToast } from "@/components/admin/ui/Toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getAllSettings, updateSettings } from "@/lib/actions/settings"
import { changePassword } from "@/lib/actions/users"
import type { SiteSettings } from "@/types"

export default function PengaturanPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [schoolName, setSchoolName] = useState("")
  const [tagline, setTagline] = useState("")
  const [address, setAddress] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [jamOperasional, setJamOperasional] = useState("")
  const [akreditasi, setAkreditasi] = useState("")
  const [logoUrl, setLogoUrl] = useState("")
  const [faviconUrl, setFaviconUrl] = useState("")
  const [googleMapsUrl, setGoogleMapsUrl] = useState("")
  const [fb, setFb] = useState(""); const [ig, setIg] = useState(""); const [yt, setYt] = useState(""); const [tt, setTt] = useState(""); const [tw, setTw] = useState("")
  const [oldPass, setOldPass] = useState(""); const [newPass, setNewPass] = useState(""); const [confirmPass, setConfirmPass] = useState("")

  useEffect(() => {
    getAllSettings().then((s: SiteSettings) => {
      setSchoolName(s.schoolName || ""); setTagline(s.tagline || ""); setAddress(s.address || "")
      setPhone(s.phone || ""); setEmail(s.email || ""); setJamOperasional(s.jamOperasional || "")
      setAkreditasi(s.akreditasi || ""); setLogoUrl(s.logo_url || ""); setFaviconUrl(s.favicon_url || "")
      setGoogleMapsUrl(s.googleMapsEmbedUrl || "")
      setFb(s.social?.facebook || ""); setIg(s.social?.instagram || ""); setYt(s.social?.youtube || "")
      setTt(s.social?.tiktok || ""); setTw(s.social?.twitter || "")
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const handleSaveIdentitas = async () => {
    try {
      await updateSettings({ schoolName, tagline, address, phone, email, jamOperasional, akreditasi, logo_url: logoUrl, favicon_url: faviconUrl, googleMapsEmbedUrl: googleMapsUrl })
      toast({ type: "success", title: "Identitas sekolah disimpan" })
    } catch { toast({ type: "error", title: "Gagal menyimpan" }) }
  }

  const handleSaveSosmed = async () => {
    try {
      await updateSettings({ social_facebook: fb, social_instagram: ig, social_youtube: yt, social_tiktok: tt, social_twitter: tw })
      toast({ type: "success", title: "Media sosial disimpan" })
    } catch { toast({ type: "error", title: "Gagal menyimpan" }) }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPass !== confirmPass) { toast({ type: "error", title: "Password baru tidak cocok" }); return }
    try {
      const formData = new FormData()
      formData.append("oldPassword", oldPass); formData.append("newPassword", newPass); formData.append("confirmPassword", confirmPass)
      await changePassword(formData)
      toast({ type: "success", title: "Password berhasil diubah" })
      setOldPass(""); setNewPass(""); setConfirmPass("")
    } catch { toast({ type: "error", title: "Gagal mengubah password" }) }
  }

  if (loading) return <div className="space-y-6"><div className="h-8 w-40 bg-neutral-200 animate-pulse rounded" /><div className="h-96 bg-neutral-100 animate-pulse rounded-xl" /></div>

  return (
    <div className="space-y-6">
      <PageHeader title="Pengaturan" breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Pengaturan", href: "/admin/pengaturan" }]} />
      <Tabs defaultValue="identitas" className="w-full max-w-3xl">
        <TabsList className="w-full flex rounded-xl bg-neutral-100 p-1 mb-6">
          <TabsTrigger value="identitas" className="flex-1 rounded-lg text-sm">🏫 Identitas</TabsTrigger>
          <TabsTrigger value="sosmed" className="flex-1 rounded-lg text-sm">🌐 Sosmed</TabsTrigger>
          <TabsTrigger value="password" className="flex-1 rounded-lg text-sm">🔒 Password</TabsTrigger>
        </TabsList>
        <TabsContent value="identitas" className="mt-0 space-y-6">
          <div className="rounded-xl border border-neutral-200 bg-white p-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2 sm:col-span-2"><label className="text-sm font-medium text-neutral-700">Nama Sekolah</label><Input value={schoolName} onChange={e => setSchoolName(e.target.value)} /></div>
              <div className="space-y-2 sm:col-span-2"><label className="text-sm font-medium text-neutral-700">Tagline</label><Input value={tagline} onChange={e => setTagline(e.target.value)} /></div>
              <div className="space-y-2 sm:col-span-2"><label className="text-sm font-medium text-neutral-700">Alamat</label><Input value={address} onChange={e => setAddress(e.target.value)} /></div>
              <div className="space-y-2"><label className="text-sm font-medium text-neutral-700">Telepon</label><Input value={phone} onChange={e => setPhone(e.target.value)} /></div>
              <div className="space-y-2"><label className="text-sm font-medium text-neutral-700">Email</label><Input type="email" value={email} onChange={e => setEmail(e.target.value)} /></div>
              <div className="space-y-2"><label className="text-sm font-medium text-neutral-700">Jam Operasional</label><Input value={jamOperasional} onChange={e => setJamOperasional(e.target.value)} /></div>
              <div className="space-y-2"><label className="text-sm font-medium text-neutral-700">Akreditasi</label><Input value={akreditasi} onChange={e => setAkreditasi(e.target.value)} /></div>
              <div className="space-y-2"><label className="text-sm font-medium text-neutral-700">URL Logo</label><Input value={logoUrl} onChange={e => setLogoUrl(e.target.value)} /></div>
              <div className="space-y-2"><label className="text-sm font-medium text-neutral-700">URL Favicon</label><Input value={faviconUrl} onChange={e => setFaviconUrl(e.target.value)} /></div>
              <div className="space-y-2 sm:col-span-2"><label className="text-sm font-medium text-neutral-700">Google Maps Embed URL</label><Input value={googleMapsUrl} onChange={e => setGoogleMapsUrl(e.target.value)} /></div>
            </div>
          </div>
          <Button onClick={handleSaveIdentitas}>Simpan Identitas</Button>
        </TabsContent>
        <TabsContent value="sosmed" className="mt-0 space-y-6">
          <div className="rounded-xl border border-neutral-200 bg-white p-6 space-y-4">
            <div className="space-y-2"><label className="text-sm font-medium text-neutral-700">Facebook</label><Input value={fb} onChange={e => setFb(e.target.value)} placeholder="https://facebook.com/..." /></div>
            <div className="space-y-2"><label className="text-sm font-medium text-neutral-700">Instagram</label><Input value={ig} onChange={e => setIg(e.target.value)} placeholder="https://instagram.com/..." /></div>
            <div className="space-y-2"><label className="text-sm font-medium text-neutral-700">YouTube</label><Input value={yt} onChange={e => setYt(e.target.value)} placeholder="https://youtube.com/..." /></div>
            <div className="space-y-2"><label className="text-sm font-medium text-neutral-700">TikTok</label><Input value={tt} onChange={e => setTt(e.target.value)} placeholder="https://tiktok.com/..." /></div>
            <div className="space-y-2"><label className="text-sm font-medium text-neutral-700">Twitter / X</label><Input value={tw} onChange={e => setTw(e.target.value)} placeholder="https://x.com/..." /></div>
          </div>
          <Button onClick={handleSaveSosmed}>Simpan Media Sosial</Button>
        </TabsContent>
        <TabsContent value="password" className="mt-0">
          <form onSubmit={handleChangePassword} className="max-w-md space-y-6">
            <div className="rounded-xl border border-neutral-200 bg-white p-6 space-y-4">
              <div className="space-y-2"><label className="text-sm font-medium text-neutral-700">Password Lama</label><Input type="password" value={oldPass} onChange={e => setOldPass(e.target.value)} required /></div>
              <div className="space-y-2"><label className="text-sm font-medium text-neutral-700">Password Baru</label><Input type="password" value={newPass} onChange={e => setNewPass(e.target.value)} required minLength={8} /></div>
              <div className="space-y-2"><label className="text-sm font-medium text-neutral-700">Konfirmasi Password Baru</label><Input type="password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} required minLength={8} /></div>
            </div>
            <Button type="submit">Ubah Password</Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  )
}
