"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatCard } from "@/components/admin/StatCard"
import {
  FileText, Newspaper, Users, Trophy, Building2, Image,
  MessageSquare, ArrowRight, ArrowUpRight, Plus,
  TrendingUp, Clock, Activity,
} from "lucide-react"
import Link from "next/link"
import { getPostCount, getPosts } from "@/lib/actions/posts"
import { getStaffCount } from "@/lib/actions/staff"
import { getAchievementCount } from "@/lib/actions/achievements"
import { getFacilityCount } from "@/lib/actions/facilities"
import { getGalleryCount } from "@/lib/actions/galleries"
import { getUnreadCount, getContacts } from "@/lib/actions/contacts"
import { getAllPages } from "@/lib/actions/pages"
import type { LucideIcon } from "lucide-react"

const quickActions = [
  { label: "Tambah Berita", href: "/admin/berita/baru", icon: Newspaper, desc: "Posting berita atau pengumuman baru", color: "bg-blue-500/10 text-blue-600" },
  { label: "Tambah Prestasi", href: "/admin/prestasi/baru", icon: Trophy, desc: "Catat pencapaian siswa & guru", color: "bg-amber-500/10 text-amber-600" },
  { label: "Upload ke Galeri", href: "/admin/galeri/baru", icon: Image, desc: "Tambah album foto atau video", color: "bg-violet-500/10 text-violet-600" },
  { label: "Kelola Fasilitas", href: "/admin/fasilitas", icon: Building2, desc: "Update sarana & prasarana", color: "bg-emerald-500/10 text-emerald-600" },
]

const statusColor: Record<string, string> = {
  published: "bg-emerald-50 text-emerald-700 border-emerald-200",
  draft: "bg-amber-50 text-amber-700 border-amber-200",
}
const catColor: Record<string, string> = {
  Berita: "bg-blue-50 text-blue-700 border-blue-200",
  Pengumuman: "bg-orange-50 text-orange-700 border-orange-200",
}

interface StatItem { title: string; value: string; icon: LucideIcon }

interface RecentPost {
  id: number
  title: string
  category: string
  date: string
  status: string
}

interface RecentMessage {
  name: string
  email: string
  preview: string
  date: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<StatItem[]>([])
  const [recentPosts, setRecentPosts] = useState<RecentPost[]>([])
  const [recentMessages, setRecentMessages] = useState<RecentMessage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getPostCount(),
      getStaffCount(),
      getAchievementCount(),
      getFacilityCount(),
      getGalleryCount(),
      getUnreadCount(),
      getAllPages(),
      getPosts({ limit: 5 }),
      getContacts({ limit: 3 }),
    ])
      .then(([postC, staffC, achC, facC, galC, unreadC, pages, postsRes, contactsRes]) => {
        setStats([
          { title: "Halaman Statis", value: String(pages.length), icon: FileText },
          { title: "Berita & Pengumuman", value: String(postC), icon: Newspaper },
          { title: "Guru & Staf", value: String(staffC), icon: Users },
          { title: "Prestasi", value: String(achC), icon: Trophy },
          { title: "Fasilitas", value: String(facC), icon: Building2 },
          { title: "Album Galeri", value: String(galC), icon: Image },
          { title: "Pesan Belum Dibaca", value: String(unreadC), icon: MessageSquare },
        ])

        setRecentPosts(
          (postsRes.data).map((p) => ({
            id: p.id as number,
            title: p.title as string,
            category: (p.category === "news" ? "Berita" : "Pengumuman"),
            date: new Date(String(p.publishedAt)).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
            status: p.isPublished ? "published" : "draft",
          }))
        )

        setRecentMessages(
          (contactsRes.data).map((m) => ({
            name: m.name as string,
            email: m.email as string,
            preview: (m.message as string).slice(0, 80) + ((m.message as string).length > 80 ? "..." : ""),
            date: new Date(String(m.createdAt)).toLocaleDateString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }),
          }))
        )
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <div className="h-8 w-48 bg-muted animate-pulse rounded-lg mb-2" />
          <div className="h-4 w-72 bg-muted/60 animate-pulse rounded-lg" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-[88px] rounded-2xl bg-muted/50 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-5 h-5 text-primary" />
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Dashboard</h1>
          </div>
          <p className="text-sm text-muted-foreground">Ringkasan aktivitas dan data website sekolah</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-lg">
          <Clock className="w-3.5 h-3.5" />
          <span>{new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {stats.map(s => <StatCard key={s.title} {...s} />)}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left — Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Posts */}
          <Card>
            <CardHeader className="flex-row items-center justify-between border-b pb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <CardTitle className="text-base">Postingan Terbaru</CardTitle>
              </div>
              <Link href="/admin/berita" className="text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1 transition-colors">
                Lihat semua <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {recentPosts.length === 0 ? (
                <div className="px-5 py-12 text-center text-sm text-muted-foreground">Belum ada postingan</div>
              ) : (
                <div className="divide-y divide-border">
                  {recentPosts.map((p, i) => (
                    <Link
                      key={i}
                      href={`/admin/berita/${p.id}`}
                      className="flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors group"
                    >
                      <div className="min-w-0 flex-1 mr-4">
                        <p className="text-sm font-medium text-card-foreground truncate group-hover:text-primary transition-colors">
                          {p.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium border ${catColor[p.category]}`}>
                            {p.category}
                          </span>
                          <span className="text-xs text-muted-foreground">{p.date}</span>
                        </div>
                      </div>
                      <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium border shrink-0 ${statusColor[p.status]}`}>
                        {p.status === "published" ? "Terbit" : "Draft"}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div>
            <h2 className="text-base font-semibold text-foreground mb-4">Aksi Cepat</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {quickActions.map(a => {
                const Icon = a.icon
                return (
                  <Link
                    key={a.label}
                    href={a.href}
                    className="group flex items-start gap-4 p-4 rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-sm transition-all duration-200"
                  >
                    <div className={`w-10 h-10 rounded-xl ${a.color} flex items-center justify-center shrink-0 transition-transform group-hover:scale-105`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-card-foreground group-hover:text-primary transition-colors">{a.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{a.desc}</p>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary shrink-0 mt-1 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right — Sidebar */}
        <div className="space-y-6">
          {/* Messages */}
          <Card>
            <CardHeader className="flex-row items-center justify-between border-b pb-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary" />
                <CardTitle className="text-base">Pesan Terbaru</CardTitle>
              </div>
              <Link href="/admin/pesan" className="text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1 transition-colors">
                Semua <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {recentMessages.length === 0 ? (
                <div className="px-5 py-12 text-center text-sm text-muted-foreground">Belum ada pesan</div>
              ) : (
                <div className="divide-y divide-border">
                  {recentMessages.map((m, i) => (
                    <div key={i} className="px-5 py-4 hover:bg-muted/30 transition-colors">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <span className="text-[10px] font-bold text-primary">{m.name.charAt(0).toUpperCase()}</span>
                          </div>
                          <p className="text-sm font-medium text-card-foreground">{m.name}</p>
                        </div>
                        <span className="text-[10px] text-muted-foreground shrink-0 mt-1">{m.date}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 ml-9">{m.email}</p>
                      <p className="text-xs text-foreground/70 mt-2 ml-9 line-clamp-2">{m.preview}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Help Card */}
          <Card className="border-0 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary" />
            <CardContent className="relative z-10 p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <Plus className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-semibold text-white text-sm">Mulai dari mana?</h3>
              </div>
              <p className="text-sm text-white/75 mb-4 leading-relaxed">
                Klik &quot;Tambah Berita&quot; untuk memposting konten pertama, atau atur identitas sekolah di Pengaturan.
              </p>
              <Link
                href="/admin/berita/baru"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-white bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors"
              >
                Tambah Berita <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
