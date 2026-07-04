"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/admin/Sidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ToastProvider } from "@/components/admin/ui/Toast";
import { authClient } from "@/lib/auth-client";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    authClient
      .getSession()
      .then(({ data }) => {
        if (!data?.session) {
          router.push("/login");
        } else {
          setChecking(false);
        }
      })
      .catch(() => {
        router.push("/login");
      });
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-background">
        <Sidebar collapsed={collapsed} />
        <div
          className="flex flex-col min-h-screen transition-all duration-300 ease-in-out"
          style={{ marginLeft: collapsed ? "4.5rem" : "16rem" }}
        >
          <AdminHeader
            collapsed={collapsed}
            onToggleCollapse={() => setCollapsed(!collapsed)}
          />
          <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
}
