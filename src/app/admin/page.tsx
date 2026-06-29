"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { StatCard } from "@/components/admin/StatCard"
import {
  FileText, Newspaper, Users, Trophy, Building2, Image,
  MessageSquare, ArrowRight, ArrowUpRight, Plus,
} from "lucide-react"
import Link from "next/link"
import { getPostCount, getPosts } from "@/lib/actions/posts"
import { getStaffCount } from "@/lib/actions/staff"
import { getAchievementCount } from "@/lib/actions/achievements"
import { getFacilityCount } from "@/lib/actions/facilities"
import { getGalleryCount } from "@/lib/actions/galleries"
import { getUnreadCount, getContacts } from "@/lib/actions/contacts"
import { getAllPages } from "@/lib/actions/pages"
import type { Post } from "@/types"

const quickActions = [
  { label: "Tambah Berita", href: "/admin/berita/baru", icon: Newspaper, desc: "Posting berita atau pengumuman baru" },
  { label: "Tambah Prestasi", href: "/admin/prestasi/baru", icon: Trophy, desc: "Catat pencapaian siswa & guru" },
  { label: "Upload ke Galeri", href: "/admin/galeri/baru", icon: Image, desc: "Tambah album foto atau video" },
  { label: "Kelola Fasilitas", href: "/admin/fasilitas", icon: Building2, desc: "Update sarana & prasarana" },
]

const statusColor: Record<string, string> = { published: "bg-emerald-50 text-emerald-700 border-emerald-200", draft: "bg-amber-50 text-amber-700 border-amber-200" }
const catColor: Record<string, string> = { Berita: "bg-blue-50 text-blue-700 border-blue-200", Pengumuman: "bg-orange-50 text-orange-700 border-orange-200" }

import type { LucideIcon } from "lucide-react";

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
          <div className="h-8 w-40 bg-neutral-200 animate-pulse rounded mb-2" />
          <div className="h-4 w-64 bg-neutral-100 animate-pulse rounded" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-24 rounded-xl bg-neutral-100 animate-pulse" />
          ))}
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
              {recentPosts.length === 0 ? (
                <div className="px-5 py-8 text-center text-sm text-neutral-400">Belum ada postingan</div>
              ) : (
                recentPosts.map((p, i) => (
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
                ))
              )}
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
              {recentMessages.length === 0 ? (
                <div className="px-5 py-8 text-center text-sm text-neutral-400">Belum ada pesan</div>
              ) : (
                recentMessages.map((m, i) => (
                  <div key={i} className="px-5 py-4 hover:bg-neutral-50/50 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-neutral-800">{m.name}</p>
                      <span className="text-[11px] text-neutral-400 shrink-0">{m.date}</span>
                    </div>
                    <p className="text-xs text-neutral-400 mt-1">{m.email}</p>
                    <p className="text-xs text-neutral-500 mt-2 line-clamp-2">{m.preview}</p>
                  </div>
                ))
              )}
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
