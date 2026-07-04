"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard, FileText, Newspaper, Users, Trophy,
  Building2, Image, MessageSquare, Settings, ChevronLeft,
  ChevronRight, GraduationCap, Menu, X, LogOut, UserCog,
  PanelLeftClose, PanelLeft, Info,
} from "lucide-react"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/profil-sekolah", label: "Profil Sekolah", icon: Info },
  { href: "/admin/halaman", label: "Halaman", icon: FileText },
  { href: "/admin/berita", label: "Berita", icon: Newspaper },
  { href: "/admin/guru", label: "Guru & Staf", icon: Users },
  { href: "/admin/prestasi", label: "Prestasi", icon: Trophy },
  { href: "/admin/fasilitas", label: "Fasilitas", icon: Building2 },
  { href: "/admin/galeri", label: "Galeri", icon: Image },
  { href: "/admin/pesan", label: "Pesan Masuk", icon: MessageSquare },
  { href: "/admin/akun", label: "Akun", icon: UserCog },
  { href: "/admin/pengaturan", label: "Pengaturan", icon: Settings },
]

interface SidebarProps {
  collapsed: boolean
}

export function Sidebar({ collapsed }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const getRole = (): string => {
    if (typeof document === "undefined") return "admin"
    const match = document.cookie.match(/auth_token=fake-token-(\w+)/)
    return match?.[1] ?? "admin"
  }

  const role = getRole()
  const filteredNav = role === "admin" ? navItems : navItems.filter(item => item.href === "/admin")

  const handleLogout = () => {
    document.cookie = "auth_token=; path=/; max-age=0"
    router.push("/login")
  }

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin"
    return pathname.startsWith(href)
  }

  const sidebarContent = (
    <aside className={cn(
      "flex h-screen flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 ease-in-out",
      collapsed ? "w-[4.5rem]" : "w-64",
    )}>
      {/* Logo */}
      <div className={cn(
        "flex items-center border-b border-sidebar-border shrink-0 px-4",
        collapsed ? "h-16 justify-center" : "h-16 justify-between"
      )}>
        {!collapsed ? (
          <Link href="/" className="flex items-center gap-3 group">
            <img 
              src="/images/logo.png" 
              alt="SMPN 17 Logo" 
              className="w-9 h-9 rounded-lg object-cover" 
            />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-sidebar-foreground tracking-tight">SMPN 17</span>
              <span className="text-[10px] text-muted-foreground leading-none">Denpasar</span>
            </div>
          </Link>
        ) : (
          <Link href="/admin" className="w-9 h-9 rounded-lg flex items-center justify-center">
            <img 
              src="/images/logo.png" 
              alt="SMPN 17" 
              className="w-9 h-9 rounded-lg object-cover" 
            />
          </Link>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
        {!collapsed && (
          <div className="px-3 py-2">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">Menu</span>
          </div>
        )}
        {filteredNav.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center rounded-xl text-sm font-medium transition-all duration-200 relative group",
                collapsed ? "justify-center px-0 py-2.5 w-10 mx-auto" : "gap-3 px-3 py-2.5",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                  : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50",
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className={cn(
                "shrink-0 transition-colors duration-200",
                active ? "text-primary" : "text-muted-foreground group-hover:text-sidebar-foreground",
                "w-[18px] h-[18px]"
              )} />
              {!collapsed && <span className="">{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* User + Logout */}
      <div className={cn(
        "border-t border-sidebar-border shrink-0",
        collapsed ? "p-3 flex justify-center" : "p-4"
      )}>
        {!collapsed ? (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary ring-1 ring-primary/20">
              AG
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">Admin</p>
              <p className="text-[11px] text-muted-foreground truncate">Superadmin</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
              title="Keluar"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogout}
            className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary ring-1 ring-primary/20 hover:bg-destructive/10 hover:text-destructive hover:ring-destructive/20 transition-all duration-200"
            title="Keluar"
          >
            AG
          </button>
        )}
      </div>
    </aside>
  )

  return (
    <div className="hidden lg:block fixed left-0 top-0 z-40 h-screen">{sidebarContent}</div>
  )
}