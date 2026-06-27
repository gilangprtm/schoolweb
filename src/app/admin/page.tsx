"use client"

import { Card } from "@/components/ui/card"
import { StatCard } from "@/components/admin/StatCard"
import {
  FileText, Newspaper, Users, Trophy, Building2, Image,
  MessageSquare, ArrowRight, ArrowUpRight, Plus,
} from "lucide-react"
import Link from "next/link"

const stats = [
  { title: "Halaman Statis", value: "5", icon: FileText },
  { title: "Berita & Pengumuman", value: "12", icon: Newspaper },
  { title: "Guru & Staf", value: "24", icon: Users },
  { title: "Prestasi", value: "18", icon: Trophy },
  { title: "Fasilitas", value: "8", icon: Building2 },
  { title: "Album Galeri", value: "4", icon: Image },
  { title: "Pesan Belum Dibaca", value: "3", icon: MessageSquare },
]

const quickActions = [
  { label: "Tambah Berita", href: "/admin/berita/baru", icon: Newspaper, desc: "Posting berita atau pengumuman baru" },
  { label: "Tambah Prestasi", href: "/admin/prestasi/baru", icon: Trophy, desc: "Catat pencapaian siswa & guru" },
  { label: "Upload ke Galeri", href: "/admin/galeri/baru", icon: Image, desc: "Tambah album foto atau video" },
  { label: "Kelola Fasilitas", href: "/admin/fasilitas", icon: Building2, desc: "Update sarana & prasarana" },
]

const recentPosts = [
  { title: "Pengumuman PPDB 2025/2026", category: "Pengumuman", date: "25 Jun 2025", status: "published" },
  { title: "Prestasi Siswa di OSN 2025", category: "Berita", date: "20 Jun 2025", status: "published" },
  { title: "Jadwal Ujian Akhir Semester", category: "Pengumuman", date: "18 Jun 2025", status: "draft" },
  { title: "Kunjungan Industri ke PT. XYZ", category: "Berita", date: "15 Jun 2025", status: "published" },
]

const recentMessages = [
  { name: "Budi Santoso", email: "budi@email.com", preview: "Saya ingin menanyakan tentang syarat pendaftaran...", date: "Hari ini, 14:30" },
  { name: "Ani Rahmawati", email: "ani@email.com", preview: "Apakah sekolah menerima siswa pindahan?", date: "Kemarin, 09:15" },
]

const statusColor: Record<string, string> = { published: "bg-emerald-50 text-emerald-700 border-emerald-200", draft: "bg-amber-50 text-amber-700 border-amber-200" }
const catColor: Record<string, string> = { Berita: "bg-blue-50 text-blue-700 border-blue-200", Pengumuman: "bg-orange-50 text-orange-700 border-orange-200" }

function getRole(): string {
  if (typeof document === "undefined") return "admin"
  const match = document.cookie.match(/auth_token=fake-token-(\w+)/)
  return match?.[1] ?? "admin"
}

export default function AdminDashboard() {
  const role = getRole()

  if (role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-neutral-100 flex items-center justify-center">
            <Users className="w-8 h-8 text-neutral-300" />
          </div>
          <h1 className="text-xl font-semibold text-neutral-700">Dashboard {role === "guru" ? "Guru" : "Staff"}</h1>
          <p className="text-sm text-neutral-500 max-w-sm">Fitur untuk role ini sedang dalam pengembangan. Menu akan tersedia segera.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900" style={{ fontFamily: "Outfit, sans-serif" }}>Dashboard</h1>
        <p className="text-sm text-neutral-500 mt-1">Ringkasan aktivitas dan data website sekolah</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {stats.map(s => <StatCard key={s.title} {...s} />)}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left — Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Recent Posts */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-neutral-900" style={{ fontFamily: "Outfit, sans-serif" }}>Postingan Terbaru</h2>
              <Link href="/admin/berita" className="text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1 transition-colors">
                Lihat semua <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <Card className="divide-y divide-neutral-100 overflow-hidden">
              {recentPosts.map((p, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-4 hover:bg-neutral-50/50 transition-colors">
                  <div className="min-w-0 flex-1 mr-4">
                    <p className="text-sm font-medium text-neutral-800 truncate">{p.title}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium border ${catColor[p.category]}`}>{p.category}</span>
                      <span className="text-xs text-neutral-400">{p.date}</span>
                    </div>
                  </div>
                  <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium border shrink-0 ${statusColor[p.status]}`}>
                    {p.status === "published" ? "Terbit" : "Draft"}
                  </span>
                </div>
              ))}
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-lg font-semibold text-neutral-900 mb-4" style={{ fontFamily: "Outfit, sans-serif" }}>Aksi Cepat</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {quickActions.map(a => {
                const Icon = a.icon
                return (
                  <Link key={a.label} href={a.href}
                    className="group flex items-start gap-4 p-4 rounded-xl border border-neutral-200 hover:border-primary/20 hover:bg-primary/[0.02] transition-all">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-neutral-800 group-hover:text-primary transition-colors">{a.label}</p>
                      <p className="text-xs text-neutral-400 mt-0.5">{a.desc}</p>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-neutral-300 group-hover:text-primary shrink-0 mt-1 transition-colors" />
                  </Link>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right — Sidebar */}
        <div className="space-y-8">
          {/* Messages */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-neutral-900" style={{ fontFamily: "Outfit, sans-serif" }}>Pesan Terbaru</h2>
              <Link href="/admin/pesan" className="text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1 transition-colors">
                Lihat semua <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <Card className="divide-y divide-neutral-100 overflow-hidden">
              {recentMessages.map((m, i) => (
                <div key={i} className="px-5 py-4 hover:bg-neutral-50/50 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-neutral-800">{m.name}</p>
                    <span className="text-[11px] text-neutral-400 shrink-0">{m.date}</span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-1">{m.email}</p>
                  <p className="text-xs text-neutral-500 mt-2 line-clamp-2">{m.preview}</p>
                </div>
              ))}
            </Card>
          </div>

          {/* Help Card */}
          <Card className="p-5 border-0" style={{ background: "linear-gradient(135deg, #0B1121 0%, #1a2744 100%)" }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <Plus className="w-4 h-4 text-primary" />
              </div>
              <h3 className="font-semibold text-white" style={{ fontFamily: "Outfit, sans-serif" }}>Mulai dari mana?</h3>
            </div>
            <p className="text-sm text-white/60 mb-4">Klik "Tambah Berita" untuk memposting konten pertama, atau atur identitas sekolah di Pengaturan.</p>
            <Link href="/admin/berita/baru"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
              Tambah Berita <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Card>
        </div>
      </div>
    </div>
  )
}
