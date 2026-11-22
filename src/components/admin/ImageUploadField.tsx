"use client";

import { useRef, useState } from "react";
import { Upload } from "lucide-react";

export default function ImageUploadField({ onUploaded }: { onUploaded: (url: string) => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return <div className="flex flex-col items-start gap-2 text-sm">
    <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" disabled={busy} className="sr-only" aria-label="Pilih gambar untuk diunggah" onChange={async (event) => {
      const input = event.currentTarget;
      const file = input.files?.[0]; if (!file) return;
      setBusy(true); setError(""); setSuccess(false);
      try {
        const data = new FormData(); data.set("file", file);
        const response = await fetch("/api/admin/image-upload", { method: "POST", body: data });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Upload gagal");
        onUploaded(result.url);
        setSuccess(true);
      } catch (reason) { setError(reason instanceof Error ? reason.message : "Upload gagal"); }
      finally { setBusy(false); input.value = ""; }
    }} />
    <button type="button" onClick={() => inputRef.current?.click()} disabled={busy} aria-busy={busy} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">
      <Upload aria-hidden="true" className="size-4" />
      {busy ? "Mengunggah…" : "Pilih gambar"}
    </button>
    <p className="text-xs text-muted-foreground">JPG, PNG, atau WebP; maks. 5 MB. Anda juga bisa menggunakan tautan atau ID Google Drive di kolom yang tersedia.</p>
    {busy && <span role="status" className="text-xs text-muted-foreground">Mengunggah gambar…</span>}
    {success && <span role="status" className="text-xs text-green-700">Gambar berhasil diunggah.</span>}
    {error && <span role="alert" className="text-xs text-destructive">{error}</span>}
  </div>;
}
