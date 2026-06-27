"use client"

import { useState } from "react"
import { Link as LinkIcon, X, ExternalLink } from "lucide-react"

interface ImageUrlInputProps {
  value: string
  onChange: (url: string) => void
  label?: string
}

function convertGDriveUrl(url: string): string {
  // Extract file ID from various Google Drive URL formats
  const patterns = [
    /\/d\/([a-zA-Z0-9_-]+)/,           // /d/FILE_ID/
    /id=([a-zA-Z0-9_-]+)/,             // ?id=FILE_ID
    /\/file\/d\/([a-zA-Z0-9_-]+)/,     // /file/d/FILE_ID/
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return `https://drive.google.com/uc?export=view&id=${match[1]}`
  }
  return url // return as-is if not GDrive
}

function isValidImageUrl(url: string): boolean {
  const converted = convertGDriveUrl(url)
  return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(url)
    || converted.includes("drive.google.com/uc")
    || /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(converted)
    || /^https?:\/\/.+/i.test(url) // any https URL, assume it might be an image
}

export function ImageUrlInput({ value, onChange, label = "URL Gambar" }: ImageUrlInputProps) {
  const [inputValue, setInputValue] = useState(value)
  const [error, setError] = useState("")
  const [showPreview, setShowPreview] = useState(!!value)

  const displayUrl = convertGDriveUrl(value)

  const handleApply = () => {
    if (!inputValue.trim()) {
      setError("URL tidak boleh kosong")
      return
    }
    if (!isValidImageUrl(inputValue.trim())) {
      setError("URL gambar tidak valid. Pastikan format JPG, PNG, atau link Google Drive.")
      return
    }
    setError("")
    onChange(inputValue.trim())
    setShowPreview(true)
  }

  const handleClear = () => {
    setInputValue("")
    onChange("")
    setError("")
    setShowPreview(false)
  }

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-neutral-700">{label}</label>

      {/* Input + Apply button */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="url"
            value={inputValue}
            onChange={(e) => { setInputValue(e.target.value); setError("") }}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleApply())}
            placeholder="https://drive.google.com/file/d/... atau https://..."
            className="w-full h-10 pl-9 pr-3 rounded-md border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        <button type="button" onClick={handleApply}
          className="px-4 h-10 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors shrink-0">
          Pasang
        </button>
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}

      {/* Hint */}
      <div className="text-xs text-neutral-400 space-y-1">
        <p><strong>Google Drive:</strong> paste link share, otomatis dikonversi ke direct image.</p>
        <p><strong>Langsung:</strong> paste URL gambar (jpg, png, webp) dari mana saja.</p>
      </div>

      {/* Preview */}
      {showPreview && value && (
        <div className="relative">
          <div className="rounded-lg border border-neutral-200 overflow-hidden bg-neutral-50">
            <img
              src={displayUrl}
              alt="Preview"
              className="max-h-48 w-full object-contain"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
            />
          </div>
          <div className="flex items-center gap-3 mt-2">
            <a href={displayUrl} target="_blank" rel="noopener noreferrer"
              className="text-xs text-primary hover:underline flex items-center gap-1">
              <ExternalLink className="h-3 w-3" /> Buka di tab baru
            </a>
            <button onClick={handleClear}
              className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1">
              <X className="h-3 w-3" /> Hapus
            </button>
          </div>
          {value.includes("drive.google.com") && (
            <p className="text-xs text-neutral-400 mt-1">
              Link asli: <code className="text-xs bg-neutral-100 px-1 rounded">{value}</code>
            </p>
          )}
        </div>
      )}


    </div>
  )
}
