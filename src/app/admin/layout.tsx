"use client"

import { useState } from "react"
import { Sidebar } from "@/components/admin/Sidebar"
import { ToastProvider } from "@/components/admin/ui/Toast"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)

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
