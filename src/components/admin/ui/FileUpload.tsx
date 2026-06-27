"use client"

import { useState, useRef } from "react"
import { Upload, X, Image as ImageIcon } from "lucide-react"

interface FileUploadProps {
  value: string
  onChange: (url: string) => void
  accept?: string
  maxSize?: number
  label?: string
}

export function FileUpload({ value, onChange, accept = "image/*", maxSize = 5, label = "Upload Gambar" }: FileUploadProps) {
  const [dragOver, setDragOver] = useState(false)
  const [fileName, setFileName] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    if (maxSize && file.size > maxSize * 1024 * 1024) {
      alert(`Ukuran file maksimal ${maxSize}MB`)
      return
    }
    setFileName(file.name)
    const url = URL.createObjectURL(file)
    onChange(url)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-neutral-700">{label}</label>
      {value ? (
        <div className="relative inline-block">
          <img src={value} alt="Preview" className="h-32 w-32 rounded-lg object-cover border border-neutral-200" />
          <button
            onClick={() => { onChange(""); setFileName("") }}
            className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
          >
            <X className="h-3 w-3" />
          </button>
          {fileName && <p className="text-xs text-neutral-500 mt-1 truncate max-w-[128px]">{fileName}</p>}
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors ${
            dragOver ? "border-primary bg-primary/5" : "border-neutral-200 hover:border-neutral-300"
          }`}
        >
          {dragOver ? (
            <Upload className="h-8 w-8 text-primary mb-2" />
          ) : (
            <ImageIcon className="h-8 w-8 text-neutral-300 mb-2" />
          )}
          <p className="text-sm text-neutral-500">Klik atau drag file ke sini</p>
          <p className="text-xs text-neutral-400 mt-1">PNG, JPG, WebP (max {maxSize}MB)</p>
        </div>
      )}
      <input ref={inputRef} type="file" accept={accept} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }} className="hidden" />
    </div>
  )
}
