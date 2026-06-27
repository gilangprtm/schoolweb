# Dashboard Admin Plan — Website Profil Sekolah

> Rancangan implementasi dashboard admin. Dibangun di atas frontend publik yang sudah jadi. Semua spesifikasi mengacu pada [PRD.md](./PRD.md).

---

## 1. Overview

Dashboard admin adalah area terproteksi di `/admin` yang memungkinkan admin sekolah mengelola semua konten website. Dibangun dengan **Next.js App Router + Server Components + Server Actions** — tidak memerlukan REST API terpisah.

### Prinsip Desain

- **Server-first**: semua query database via Server Components + Drizzle ORM
- **Server Actions** untuk mutasi (create/update/delete)
- **revalidatePath()** setelah setiap mutasi agar halaman publik langsung update
- **Skeleton loading** + **toast notification** (sonner)
- **shadcn/ui** untuk konsistensi dengan frontend publik

---

## 2. Tech Stack Tambahan

| Komponen | Teknologi | Status |
|----------|-----------|--------|
| Database | PostgreSQL (Supabase free tier / Docker) | Perlu setup |
| ORM | Drizzle ORM | Perlu install |
| Auth | Better Auth + Drizzle adapter | Perlu install |
| Validasi | Zod | Perlu install |
| UI tambahan | dialog, table, dropdown-menu, toast, separator, avatar, label, select, switch, checkbox, sheet | Perlu install |
| Rich Text | TipTap | Perlu install |
| Upload | Local `/public/uploads/` | Perlu setup |

```bash
npm install drizzle-orm postgres better-auth zod
npm install -D drizzle-kit
npx shadcn@latest add dialog table dropdown-menu toast separator avatar label select switch checkbox sheet
```

---

## 3. Database Schema (11 tabel)

```
src/db/
  schema.ts       # Semua definisi tabel Drizzle
  index.ts        # DB connection
  migrations/     # Auto-generated
```

| Tabel | Kolom Utama |
|-------|------------|
| users | id, name, email, passwordHash, role (superadmin/admin) |
| pages | id, title, slug, content, updatedAt |
| posts | id, title, slug, content, excerpt, imageUrl, category, isPublished, publishedAt |
| staff | id, name, slug, role, subject, photoUrl, education, bio, email, phone, sortOrder, isActive |
| achievements | id, title, slug, description, category, level, champion, organizer, date, imageUrl, isFeatured, isPublished |
| facilities | id, name, slug, description, category, photoUrl, isFeatured, sortOrder, isPublished |
| facilityPhotos | id, facilityId (FK), filename, url, caption, sortOrder |
| galleries | id, title, description, type (photo/video) |
| media | id, galleryId (FK), filename, url, caption, sortOrder |
| contacts | id, name, email, phone, message, isRead |
| settings | id, key, value |

---

## 4. Authentication (Better Auth)

```
src/lib/auth.ts    # Better Auth config + Drizzle adapter
src/middleware.ts   # Proteksi semua route /admin/*
```

### Flow
1. Akses `/admin` → middleware cek session
2. No session → redirect `/admin/login`
3. Login: email + password → `signIn()`
4. Session di HTTP-only cookie
5. Role check: superadmin vs admin

### Halaman Login
Desain minimal: card centered, logo sekolah, form email + password, tombol "Masuk".

---

## 5. Admin Layout

```
src/app/admin/
  layout.tsx           # Sidebar + Header + Main (flex)
  page.tsx             # Dashboard overview

  login/page.tsx       # Login form

  berita/
    page.tsx           # List (tabel + pagination + filter)
    baru/page.tsx      # Form tambah
    [id]/page.tsx      # Form edit

  guru/
    page.tsx           # List
    baru/page.tsx      # Tambah
    [id]/page.tsx      # Edit

  prestasi/
    page.tsx, baru/page.tsx, [id]/page.tsx

  fasilitas/
    page.tsx, baru/page.tsx, [id]/page.tsx

  galeri/
    page.tsx           # Daftar album
    baru/page.tsx      # Tambah album (modal)
    [id]/page.tsx      # Isi album (upload/manage media)

  halaman/
    page.tsx           # Daftar halaman statis
    [id]/page.tsx      # Edit dengan TipTap editor

  pesan/
    page.tsx           # Daftar + detail pesan kontak

  pengaturan/
    page.tsx           # Identitas + sosmed + ubah password
```

### Layout Visual

```
+------------------+-----------------------------------+
| SIDEBAR (240px)  | HEADER: Breadcrumb + Avatar     |
|                  +-----------------------------------+
| Dashboard        |                                   |
| Halaman          |     MAIN CONTENT AREA            |
| Berita           |                                   |
| Guru & Staf      |                                   |
| Prestasi         |                                   |
| Fasilitas        |                                   |
| Galeri           |                                   |
| Pesan Masuk (3)  |                                   |
| Pengaturan       |                                   |
+------------------+-----------------------------------+
```

---

## 6. Fase Implementasi

### Fase 1: Database + Auth + Layout (prioritas tertinggi)

1. Setup PostgreSQL (Supabase free tier atau Docker)
2. Install Drizzle ORM + definisi schema
3. Generate & push migration
4. Install & konfigurasi Better Auth
5. Seed user superadmin
6. Middleware proteksi `/admin/*`
7. Halaman login
8. Admin layout (sidebar + header)
9. Dashboard overview (stat cards + quick actions)

### Fase 2: CRUD Berita

- Tabel list: Judul, Kategori (badge), Status (badge), Tanggal, Aksi
- Form tambah/edit: judul, slug auto, kategori, excerpt, konten TipTap, upload gambar, status toggle, tanggal
- Server Actions: createPost, updatePost, deletePost
- Delete dengan modal konfirmasi

### Fase 3: CRUD Guru & Staf

- Tabel: Foto (thumbnail), Nama, Role (badge), Mapel, Status, Aksi
- Form: nama, role, subject, foto upload, education, bio, email, phone, sort order, status
- Kepsek selalu diurutkan pertama

### Fase 4: CRUD Prestasi

- Tabel: Judul, Kategori, Level (badge), Juara (badge), Featured, Status, Aksi
- Form: judul, kategori, level, juara, penyelenggara, tanggal, deskripsi, foto, featured toggle

### Fase 5: CRUD Fasilitas + Galeri

**Fasilitas:**
- List, tambah, edit
- Multi-foto via facility_photos

**Galeri:**
- Daftar album (card grid)
- Tambah album (modal)
- Isi album: upload foto (drag-drop multi-file) atau input URL YouTube
- Atur urutan, edit caption, hapus

### Fase 6: Halaman + Pesan + Pengaturan

**Halaman statis:**
- 5 halaman: profil, sejarah, visi-misi, kontak, pendaftaran
- Edit dengan TipTap rich text editor
- Tidak bisa tambah/hapus halaman

**Pesan masuk:**
- Tabel: Nama, Email, Cuplikan, Status (dibaca/belum), Tanggal
- Klik baris = detail pesan + auto tandai dibaca
- Badge jumlah belum dibaca di sidebar

**Pengaturan:**
- Identitas sekolah (nama, tagline, alamat, telp, email, logo, favicon)
- Media sosial (FB, IG, YT, TikTok, X)
- Ubah password

### Fase 7: Polish + Migrasi Data

- Ganti data static `src/data/*.ts` → query database
- `revalidatePath()` setelah setiap mutasi
- Toast notifikasi sukses/gagal
- Loading skeletons
- Empty states
- Responsif sidebar (collapse di mobile)
- Error handling

---

## 7. Komponen Dashboard (reusable)

```
src/components/admin/
  Sidebar.tsx           # Nav + logo + user info
  AdminHeader.tsx       # Breadcrumb + avatar dropdown
  DataTable.tsx         # Tabel dengan sort, pagination
  DeleteDialog.tsx      # Modal konfirmasi hapus
  PageHeader.tsx        # Judul + breadcrumb + action button
  StatCard.tsx          # Kartu statistik (dashboard)
  FileUpload.tsx        # Upload foto + preview
  PostForm.tsx          # Form berita (shared tambah/edit)
  StaffForm.tsx         # Form guru/staf
  AchievementForm.tsx   # Form prestasi
  FacilityForm.tsx      # Form fasilitas
  MediaManager.tsx      # Grid foto/video di galeri
```

---

## 8. Server Actions Pattern

Setiap modul CRUD pakai pattern yang sama:

```typescript
// src/actions/posts.ts
'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/db'
import { posts } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

const PostSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  content: z.string(),
  category: z.enum(['news', 'announcement']),
  isPublished: z.boolean(),
  // ...
})

export async function createPost(formData: FormData) {
  const session = await auth()
  if (!session) throw new Error('Unauthorized')
  const data = PostSchema.parse(Object.fromEntries(formData))
  await db.insert(posts).values(data)
  revalidatePath('/berita')
  revalidatePath('/')
  redirect('/admin/berita')
}

export async function updatePost(id: number, formData: FormData) { /* ... */ }
export async function deletePost(id: number) { /* ... */ }
```

---

## 9. Estimasi Waktu

| Fase | Isi | Estimasi |
|------|-----|----------|
| 1 | Database + Auth + Layout | 3-4 jam |
| 2 | CRUD Berita | 2-3 jam |
| 3 | CRUD Guru & Staf | 1-2 jam |
| 4 | CRUD Prestasi | 1-2 jam |
| 5 | CRUD Fasilitas + Galeri | 2-3 jam |
| 6 | Halaman + Pesan + Pengaturan | 2-3 jam |
| 7 | Polish + Migrasi Data | 1-2 jam |
| **TOTAL** | | **12-19 jam** |

---

## 10. Sebelum Mulai — Checklist

- [ ] PostgreSQL siap (Supabase free tier atau Docker local)
- [ ] `DATABASE_URL` di `.env.local`
- [ ] `BETTER_AUTH_SECRET` di `.env.local` (generate: `openssl rand -hex 32`)
- [ ] Install: `drizzle-orm`, `better-auth`, `zod`, `drizzle-kit`
- [ ] Install shadcn: dialog, table, dropdown-menu, toast, separator, avatar, label, select, switch, checkbox, sheet
- [ ] Install: `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-image`
