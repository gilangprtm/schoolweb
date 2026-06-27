"use client"

import { AlertTriangle } from "lucide-react"

interface DeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  itemName: string
  onConfirm: () => void
}

export function DeleteDialog({ open, onOpenChange, itemName, onConfirm }: DeleteDialogProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-neutral-900/50 backdrop-blur-sm" onClick={() => onOpenChange(false)} />
      <div className="relative z-10 mx-4 w-full max-w-md rounded-xl border border-neutral-200 bg-white p-6 shadow-xl">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>
        <h2 className="text-center text-lg font-bold text-neutral-900" style={{ fontFamily: "Outfit, sans-serif" }}>Konfirmasi Hapus</h2>
        <p className="mt-2 text-center text-sm text-neutral-600">
          Yakin ingin menghapus <span className="font-semibold text-neutral-800">"{itemName}"</span>? Tindakan ini tidak bisa diubah.
        </p>
        <div className="mt-6 flex gap-3">
          <button onClick={() => onOpenChange(false)} className="flex-1 rounded-md border border-neutral-300 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50">
            Batal
          </button>
          <button onClick={onConfirm} className="flex-1 rounded-md bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700">
            Hapus
          </button>
        </div>
      </div>
    </div>
  )
}
