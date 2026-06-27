"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard, FileText, Newspaper, Users, Trophy,
  Building2, Image, MessageSquare, Settings, ChevronLeft,
  ChevronRight, GraduationCap, Menu, X, LogOut, UserCog,
} from "lucide-react"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/halaman", label: "Halaman", icon: FileText },
  { href: "/admin/berita", label: "Berita", icon: Newspaper },
  { href: "/admin/guru", label: "Guru & Staf", icon: Users },
  { href: "/admin/prestasi", label: "Prestasi", icon: Trophy },
  { href: "/admin/fasilitas", label: "Fasilitas", icon: Building2 },
  { href: "/admin/galeri", label: "Galeri", icon: Image },
  { href: "/admin/pesan", label: "Pesan Masuk", icon: MessageSquare, badge: 3 },
  { href: "/admin/akun", label: "Akun", icon: UserCog },
  { href: "/admin/pengaturan", label: "Pengaturan", icon: Settings },
]

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

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
      "flex h-screen flex-col transition-all duration-300",
      collapsed ? "w-16" : "w-60",
    )}
    style={{ backgroundColor: "#0B1121" }}
    >
      {/* Logo */}
      <div className={cn("flex items-center border-b border-white/[0.06] px-4", collapsed ? "h-14 justify-center" : "h-16 justify-between")}>
        {!collapsed ? (
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary" />
            </div>
            <span className="text-base font-semibold text-white tracking-tight" style={{ fontFamily: "Outfit, sans-serif" }}>SMPN 17</span>
          </Link>
        ) : (
          <Link href="/admin" className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-primary" />
          </Link>
        )}
        <button onClick={onToggle}
          className="hidden lg:flex items-center justify-center w-7 h-7 rounded-md text-white/30 hover:text-white/70 hover:bg-white/[0.06] transition-colors">
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        {filteredNav.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          return (
            <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center rounded-lg text-sm font-medium transition-all duration-150 relative group",
                collapsed ? "justify-center px-0 py-2.5 w-10 mx-auto" : "gap-3 px-3 py-2.5",
                active
                  ? "bg-primary/15 text-primary"
                  : "text-white/50 hover:text-white/80 hover:bg-white/[0.04]",
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className={cn("shrink-0 transition-colors", active ? "text-primary" : "text-white/30 group-hover:text-white/60", collapsed ? "w-5 h-5" : "w-5 h-5")} />
              {!collapsed && <span className="truncate">{item.label}</span>}
              {item.badge && (
                <span className={cn(
                  "rounded-full bg-red-500 text-white font-bold",
                  collapsed ? "absolute -top-0.5 -right-0.5 w-2 h-2" : "ml-auto px-2 py-0.5 text-[10px] leading-none"
                )}>
                  {!collapsed && item.badge}
                </span>
              )}
              {active && !collapsed && <div className="absolute right-2 top-1/2 -translate-y-1/2 w-1 h-5 rounded-full bg-primary" />}
            </Link>
          )
        })}
      </nav>

      {/* User + Logout */}
      <div className={cn("border-t border-white/[0.06]", collapsed ? "p-2 flex justify-center" : "p-4")}>
        {!collapsed ? (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-sm font-medium text-white ring-2 ring-white/5">AG</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Admin</p>
              <p className="text-xs text-white/40 truncate">Superadmin</p>
            </div>
            <button onClick={handleLogout} className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-sm font-medium text-white ring-2 ring-white/5">AG</div>
        )}
      </div>
    </aside>
  )

  return (
    <>
      <button onClick={() => setMobileOpen(true)} className="fixed top-3 left-3 z-30 lg:hidden rounded-lg p-2 text-white"
        style={{ backgroundColor: "#0B1121" }}>
        <Menu className="w-5 h-5" />
      </button>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full">{sidebarContent}</div>
        </div>
      )}

      <div className="hidden lg:block fixed left-0 top-0 z-40 h-screen">{sidebarContent}</div>
    </>
  )
}
