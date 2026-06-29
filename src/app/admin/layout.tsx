"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Sidebar } from "@/components/admin/Sidebar"
import { ToastProvider } from "@/components/admin/ui/Toast"
import { authClient } from "@/lib/auth-client"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const [checking, setChecking] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    authClient.getSession().then(({ data }) => {
      if (!data?.session) {
        router.push("/login")
      } else {
        setChecking(false)
      }
    }).catch(() => {
      router.push("/login")
    })
  }, [router])

  if (checking) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-neutral-50">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
        <div
          className="flex flex-col min-h-screen transition-all duration-300"
          style={{ marginLeft: collapsed ? "4rem" : "15rem" }}
        >
          <main className="flex-1 p-6 md:p-8 lg:p-10">{children}</main>
        </div>
      </div>
    </ToastProvider>
  )
}
