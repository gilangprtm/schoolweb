"use client"

import { usePathname, useRouter } from "next/navigation"
import { ChevronRight, Home, Bell, LogOut, User, PanelLeft, PanelLeftClose } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const pathLabels: Record<string, string> = {
  "": "Dashboard",
  "berita": "Berita & Pengumuman",
  "guru": "Guru & Staf",
  "prestasi": "Prestasi",
  "fasilitas": "Fasilitas",
  "galeri": "Galeri",
  "halaman": "Halaman Statis",
  "pesan": "Pesan Masuk",
  "akun": "Akun",
  "pengaturan": "Pengaturan",
  "baru": "Tambah Baru",
  "login": "Login",
}

interface AdminHeaderProps {
  collapsed: boolean
  onToggleCollapse: () => void
}

export function AdminHeader({ collapsed, onToggleCollapse }: AdminHeaderProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    document.cookie = "auth_token=; path=/; max-age=0"
    router.push("/login")
  }

  const segments = pathname.replace("/admin/", "").split("/").filter(Boolean)
  const breadcrumbs = [{ label: "Home", href: "/admin" }]
  let currentPath = "/admin"
  for (const seg of segments) {
    currentPath += "/" + seg
    breadcrumbs.push({ label: pathLabels[seg] || seg, href: currentPath })
  }

  if (breadcrumbs.length === 1) breadcrumbs.push({ label: "Dashboard", href: "/admin" })

  return (
      <header className="flex h-16 items-center justify-between border-b border-sidebar-border bg-sidebar px-4 lg:px-6 sticky top-0 z-40">
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleCollapse}
          className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200"
          title={collapsed ? "Perluas sidebar" : "Ciutkan sidebar"}
        >
          {collapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </button>
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
          {breadcrumbs.map((crumb, i) => (
            <div key={i} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40" />}
              {i < breadcrumbs.length - 1 ? (
                <Link href={crumb.href} className="hover:text-foreground transition-colors flex items-center gap-1">
                  {i === 0 && <Home className="h-3.5 w-3.5" />}
                  {crumb.label}
                </Link>
              ) : (
                <span className="font-medium text-foreground">{crumb.label}</span>
              )}
            </div>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-2">
        <button className="relative rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive ring-2 ring-card" />
        </button>
      </div>
    </header>
  )
}