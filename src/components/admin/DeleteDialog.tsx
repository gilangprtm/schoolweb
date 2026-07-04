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
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => onOpenChange(false)} />
      <div className="relative z-10 mx-4 w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10">
          <AlertTriangle className="h-6 w-6 text-destructive" />
        </div>
        <h2 className="text-center text-lg font-bold text-card-foreground">Konfirmasi Hapus</h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Yakin ingin menghapus <span className="font-semibold text-foreground">&quot;{itemName}&quot;</span>? Tindakan ini tidak bisa diubah.
        </p>
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => onOpenChange(false)}
            className="flex-1 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-lg bg-destructive px-4 py-2.5 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 transition-colors"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  )
}
