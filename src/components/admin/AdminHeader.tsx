"use client"

import { usePathname, useRouter } from "next/navigation"
import { ChevronRight, Home, Bell, LogOut, User } from "lucide-react"
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

export function AdminHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const [dropdownOpen, setDropdownOpen] = useState(false)

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
    <header className="flex h-14 items-center justify-between border-b border-neutral-200 bg-white px-4 lg:px-6">
      <nav className="flex items-center gap-1.5 text-sm text-neutral-500">
        {breadcrumbs.map((crumb, i) => (
          <div key={i} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-neutral-400" />}
            {i < breadcrumbs.length - 1 ? (
              <Link href={crumb.href} className="hover:text-neutral-800 transition-colors flex items-center gap-1">
                {i === 0 && <Home className="h-3.5 w-3.5" />}
                {crumb.label}
              </Link>
            ) : (
              <span className="font-medium text-neutral-800">{crumb.label}</span>
            )}
          </div>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <button className="relative rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div className="relative">
          <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-2 rounded-md p-1 hover:bg-neutral-100">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-white">AG</div>
            <span className="hidden sm:block text-sm font-medium text-neutral-800">Admin</span>
          </button>
          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
              <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded-lg border border-neutral-200 bg-white py-1 shadow-lg">
                <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-50">
                  <User className="h-4 w-4" /> Profil
                </button>
                <div className="border-t border-neutral-100 mt-1 pt-1">
                  <button onClick={handleLogout} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50">
                    <LogOut className="h-4 w-4" /> Keluar
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
