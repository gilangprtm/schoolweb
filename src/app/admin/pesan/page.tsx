"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/admin/PageHeader"
import { Badge } from "@/components/admin/ui/Badge"
import { Mail, MailOpen, Trash2, ChevronDown, ChevronUp } from "lucide-react"
import { useToast } from "@/components/admin/ui/Toast"
import { getContacts, markAsRead, deleteContact } from "@/lib/actions/contacts"

interface Message {
  id: number; name: string; email: string; phone: string | null; message: string; isRead: boolean; createdAt: Date
}

export default function PesanPage() {
  const [expanded, setExpanded] = useState<number | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    getContacts({ limit: 500 })
      .then(res => setMessages(res.data as Message[]))
      .catch(() => setMessages([]))
      .finally(() => setLoading(false))
  }, [])

  const handleClick = async (id: number) => {
    setExpanded(expanded === id ? null : id)
    if (!messages.find(m => m.id === id)?.isRead) {
      try {
        await markAsRead(id)
        setMessages(prev => prev.map(m => m.id === id ? { ...m, isRead: true } : m))
      } catch {}
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteContact(id)
      setMessages(prev => prev.filter(m => m.id !== id))
      toast({ type: "success", title: "Pesan dihapus" })
    } catch {
      toast({ type: "error", title: "Gagal menghapus pesan" })
    }
  }

  const unread = messages.filter(m => !m.isRead).length

  return (
    <div>
      <PageHeader title={`Pesan Masuk ${unread > 0 ? `(${unread})` : ""}`} breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Pesan Masuk", href: "/admin/pesan" }]} />

      {loading ? (
        <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-16 bg-neutral-100 animate-pulse rounded-lg" />)}</div>
      ) : messages.length === 0 ? (
        <div className="text-center py-16 text-neutral-500">Belum ada pesan masuk</div>
      ) : (
        <div className="space-y-2">
          {messages.map(m => (
            <div key={m.id} className="rounded-lg border border-neutral-200 bg-white overflow-hidden">
              <button onClick={() => handleClick(m.id)} className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-neutral-50 transition-colors">
                <div className="shrink-0">{m.isRead ? <MailOpen className="h-5 w-5 text-neutral-300" /> : <Mail className="h-5 w-5 text-primary" />}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2"><span className={`text-sm ${m.isRead ? "text-neutral-600" : "font-semibold text-neutral-800"}`}>{m.name}</span><span className="text-xs text-neutral-400">{m.email}</span></div>
                  <p className="text-xs text-neutral-500 truncate">{m.message.slice(0, 60)}...</p>
                </div>
                <span className="text-xs text-neutral-400 shrink-0">{m.createdAt.toLocaleDateString("id-ID")}</span>
                {expanded === m.id ? <ChevronUp className="h-4 w-4 text-neutral-400 shrink-0" /> : <ChevronDown className="h-4 w-4 text-neutral-400 shrink-0" />}
              </button>
              {expanded === m.id && (
                <div className="border-t border-neutral-100 px-4 py-4 bg-neutral-50 space-y-2">
                  <div className="grid sm:grid-cols-2 gap-2 text-sm">
                    <div><span className="text-neutral-400">Nama:</span> <span className="text-neutral-700">{m.name}</span></div>
                    <div><span className="text-neutral-400">Email:</span> <span className="text-neutral-700">{m.email}</span></div>
                    {m.phone && <div><span className="text-neutral-400">Telepon:</span> <span className="text-neutral-700">{m.phone}</span></div>}
                    <div><span className="text-neutral-400">Tanggal:</span> <span className="text-neutral-700">{m.createdAt.toLocaleDateString("id-ID")}</span></div>
                  </div>
                  <div className="pt-2 border-t border-neutral-200">
                    <p className="text-sm text-neutral-700 whitespace-pre-wrap">{m.message}</p>
                  </div>
                  <button onClick={() => handleDelete(m.id)} className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 pt-1"><Trash2 className="h-3 w-3" /> Hapus Pesan</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
