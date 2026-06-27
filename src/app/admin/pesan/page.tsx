"use client"

import { useState } from "react"
import { PageHeader } from "@/components/admin/PageHeader"
import { Badge } from "@/components/admin/ui/Badge"
import { Mail, MailOpen, Trash2, ChevronDown, ChevronUp } from "lucide-react"

interface Message { id:number; name:string; email:string; phone:string; message:string; isRead:boolean; createdAt:string }

const mock: Message[] = [
  { id:1, name:"Budi Santoso", email:"budi@email.com", phone:"08123456789", message:"Saya ingin menanyakan tentang syarat pendaftaran siswa baru untuk tahun ajaran 2025/2026. Apakah ada tes masuk dan berapa biaya pendaftarannya?", isRead:false, createdAt:"2025-06-27" },
  { id:2, name:"Ani Rahmawati", email:"ani@email.com", phone:"", message:"Apakah sekolah menerima siswa pindahan dari luar kota? Anak saya kelas 2 SMP dan kami baru pindah ke daerah sini.", isRead:false, createdAt:"2025-06-26" },
  { id:3, name:"Hendra Gunawan", email:"hendra@email.com", phone:"087812345678", message:"Mohon informasi jadwal PPDB tahun ini. Kapan pendaftaran dibuka?", isRead:true, createdAt:"2025-06-25" },
]

export default function PesanPage() {
  const [expanded, setExpanded] = useState<number | null>(null)
  const [messages, setMessages] = useState(mock)

  const handleClick = (id: number) => {
    setExpanded(expanded === id ? null : id)
    setMessages(prev => prev.map(m => m.id === id ? { ...m, isRead: true } : m))
  }

  const unread = messages.filter(m => !m.isRead).length

  return (
    <div>
      <PageHeader title={`Pesan Masuk ${unread > 0 ? `(${unread})` : ""}`} breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Pesan Masuk", href: "/admin/pesan" }]} />

      {messages.length === 0 ? (
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
                <span className="text-xs text-neutral-400 shrink-0">{new Date(m.createdAt).toLocaleDateString("id-ID")}</span>
                {expanded === m.id ? <ChevronUp className="h-4 w-4 text-neutral-400 shrink-0" /> : <ChevronDown className="h-4 w-4 text-neutral-400 shrink-0" />}
              </button>
              {expanded === m.id && (
                <div className="border-t border-neutral-100 px-4 py-4 bg-neutral-50 space-y-2">
                  <div className="grid sm:grid-cols-2 gap-2 text-sm">
                    <div><span className="text-neutral-400">Nama:</span> <span className="text-neutral-700">{m.name}</span></div>
                    <div><span className="text-neutral-400">Email:</span> <span className="text-neutral-700">{m.email}</span></div>
                    {m.phone && <div><span className="text-neutral-400">Telepon:</span> <span className="text-neutral-700">{m.phone}</span></div>}
                    <div><span className="text-neutral-400">Tanggal:</span> <span className="text-neutral-700">{new Date(m.createdAt).toLocaleDateString("id-ID")}</span></div>
                  </div>
                  <div className="pt-2 border-t border-neutral-200">
                    <p className="text-sm text-neutral-700 whitespace-pre-wrap">{m.message}</p>
                  </div>
                  <button className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 pt-1"><Trash2 className="h-3 w-3" /> Hapus Pesan</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
