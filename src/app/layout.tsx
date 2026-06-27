import type { Metadata } from "next"
import { inter, outfit } from "@/lib/fonts"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "SMP Negeri 17 Denpasar — Mencetak Generasi Unggul, Berkarakter, dan Berprestasi",
    template: "%s — SMP Negeri 17 Denpasar",
  },
  description:
    "Website resmi SMP Negeri 17 Denpasar. Temukan informasi profil sekolah, berita terbaru, prestasi, pendaftaran siswa baru (SPMB), galeri kegiatan, dan kontak kami.",
  keywords: [
    "SMP Negeri 17 Denpasar", "sekolah menengah pertama", "SPMB",
    "prestasi sekolah", "pendaftaran siswa baru",
  ],
  openGraph: {
    type: "website", locale: "id_ID", siteName: "SMP Negeri 17 Denpasar",
    title: "SMP Negeri 17 Denpasar — Mencetak Generasi Unggul, Berkarakter, dan Berprestasi",
    description: "Website resmi SMP Negeri 17 Denpasar.",
    images: [{ url: "/images/og-default.jpg", width: 1200, height: 630 }],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", type: "image/png", sizes: "96x96" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    other: [{ rel: "manifest", url: "/site.webmanifest" }],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${inter.variable} ${outfit.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
