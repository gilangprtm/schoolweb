# Frontend Landing Page Plan — Website Profil Sekolah

> Dokumen ini adalah rancangan lengkap untuk implementasi **halaman publik (frontend)** website profil sekolah. Dibuat berdasarkan [PRD.md](file:///d:/Project/schoolweb/PRD.md). Dokumen ini ditujukan untuk agent implementasi agar bisa langsung membangun frontend tanpa ambiguitas.

---

## 1. Tech Stack & Setup

| Komponen | Teknologi | Catatan |
|----------|-----------|---------|
| Framework | **Next.js 14+ (App Router)** | SSR/SSG, SEO-friendly |
| Styling | **Tailwind CSS v4** | Utility-first, mobile-first |
| UI Components | **shadcn/ui** | Komponen siap pakai, mudah dikustomisasi |
| Font | **Google Fonts — Inter** (body) + **Outfit** (heading) | Modern, clean, profesional |
| Icons | **Lucide React** | Sudah terintegrasi dengan shadcn/ui |
| Animation | **Framer Motion** | Micro-animations, scroll reveal, page transitions |
| Maps | **Google Maps Embed API** | Untuk halaman kontak |
| Lightbox | **yet-another-react-lightbox** | Untuk galeri foto |
| Rich Content | **HTML dari TipTap** (render saja, editor di admin) | Render konten dari database |

### Inisialisasi Project

```bash
npx -y create-next-app@latest ./ --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
npx -y shadcn@latest init
npm install framer-motion lucide-react yet-another-react-lightbox
```

---

## 2. Design System

### 2.1 Color Palette

Menggunakan skema warna **biru-hijau gelap** yang merepresentasikan pendidikan, kepercayaan, dan profesionalisme.

```
Primary       : hsl(210, 80%, 40%)   → #1565C0  (Biru utama — header, CTA, link)
Primary Dark  : hsl(210, 85%, 28%)   → #0D47A1  (Hover, active state)
Primary Light : hsl(210, 70%, 95%)   → #E3F2FD  (Background highlight)

Secondary     : hsl(160, 60%, 40%)   → #2E7D6F  (Aksen hijau — badge, ikon)
Secondary Dark: hsl(160, 65%, 30%)   → #1B5E4F

Accent        : hsl(35, 90%, 55%)    → #F59E0B  (Kuning emas — highlight, prestasi, CTA sekunder)

Neutral 50    : hsl(210, 15%, 97%)   → #F8FAFC  (Background utama)
Neutral 100   : hsl(210, 15%, 93%)   → #EEF2F7  (Card background)
Neutral 200   : hsl(210, 12%, 84%)   → #D1D9E0  (Border)
Neutral 500   : hsl(210, 10%, 50%)   → #6B7B8D  (Body text secondary)
Neutral 800   : hsl(210, 20%, 20%)   → #1E293B  (Body text primary)
Neutral 900   : hsl(210, 25%, 10%)   → #0F172A  (Heading, footer background)
```

### 2.2 Typography Scale

```
Display    : Outfit, 48-56px, font-weight 800, line-height 1.1
H1         : Outfit, 36-42px, font-weight 700, line-height 1.2
H2         : Outfit, 28-32px, font-weight 700, line-height 1.3
H3         : Outfit, 22-24px, font-weight 600, line-height 1.4
H4         : Outfit, 18-20px, font-weight 600, line-height 1.5
Body Large : Inter, 18px, font-weight 400, line-height 1.7
Body       : Inter, 16px, font-weight 400, line-height 1.6
Body Small : Inter, 14px, font-weight 400, line-height 1.5
Caption    : Inter, 12px, font-weight 500, line-height 1.4
```

### 2.3 Spacing & Layout

```
Container max-width : 1280px (xl breakpoint)
Section padding     : py-16 md:py-24 (vertikal), px-4 md:px-6 lg:px-8 (horizontal)
Card border-radius  : 12px (rounded-xl)
Card shadow         : shadow-md hover:shadow-lg (transisi 300ms)
Gap antar card      : gap-6 md:gap-8
```

### 2.4 Breakpoints (Tailwind Default)

```
sm  : 640px   (HP landscape)
md  : 768px   (Tablet)
lg  : 1024px  (Desktop kecil)
xl  : 1280px  (Desktop)
2xl : 1536px  (Desktop besar)
```

### 2.5 Micro-Animations

| Elemen | Animasi | Durasi |
|--------|---------|--------|
| Card hover | `scale(1.02)` + `shadow-lg` | 300ms ease |
| Section masuk viewport | Fade up (`translateY(20px)` → `0`) | 600ms ease-out |
| Navbar scroll | Background blur + shadow muncul | 200ms |
| Button hover | Background darken + `translateY(-1px)` | 200ms |
| Badge | Subtle pulse saat pertama muncul | 400ms |
| Image load | Skeleton shimmer → fade in | 500ms |
| Page transition | Fade in | 300ms |
| Filter active | Background pill slide | 250ms |

---

## 3. Struktur Halaman & Routing

```
/                        → Home (Landing Page)
/profil                  → Profil & Sejarah Sekolah
/berita                  → Daftar Berita & Pengumuman
/berita/[slug]           → Detail Berita/Pengumuman
/pendaftaran             → Info Pendaftaran (PPDB)
/galeri                  → Galeri Foto & Video
/fasilitas               → Daftar Fasilitas
/fasilitas/[slug]        → Detail Fasilitas
/prestasi                → Daftar Prestasi
/prestasi/[slug]         → Detail Prestasi
/guru-dan-staf           → Daftar Guru & Staf
/guru-dan-staf/[slug]    → Detail Guru/Staf
/kontak                  → Halaman Kontak
```

---

## 4. Komponen Global (Shared Components)

### 4.1 `<Navbar />`

**Posisi:** Sticky top, z-50

**State:**
- **Top of page:** Background transparan, teks putih (di atas hero)
- **Scrolled:** Background `white/95` + `backdrop-blur-xl` + `shadow-sm`, teks gelap

**Konten:**
```
┌─────────────────────────────────────────────────────────────────┐
│  [Logo + Nama Sekolah]          [Menu Items]         [CTA btn] │
│                                                                 │
│  Logo 40px tinggi               Beranda                        │
│  "SMP Negeri 1 ..."             Profil ▾ (dropdown)            │
│                                 Berita                          │
│                                 PPDB                            │
│                                 Galeri                          │
│                                 Kontak                          │
│                                           [Hubungi Kami →]      │
└─────────────────────────────────────────────────────────────────┘
```

**Dropdown "Profil"** berisi:
- Profil & Sejarah
- Guru & Staf
- Fasilitas
- Prestasi

**Mobile (< md):**
- Hamburger menu → slide-in drawer dari kanan
- Menu items vertikal, accordion untuk dropdown
- CTA button tetap tampil di bawah menu

---

### 4.2 `<Footer />`

**Layout:** 4 kolom (desktop), stack (mobile)

```
┌─────────────────────────────────────────────────────────────────┐
│  Background: Neutral 900 (#0F172A)  |  Teks: putih/abu terang  │
│                                                                 │
│  [Logo]                 TAUTAN         KONTAK        SOSIAL     │
│  Nama Sekolah           Beranda        Alamat        FB  IG     │
│  Tagline/Moto           Profil         Telepon       YT  TT     │
│                         Berita         Email                    │
│                         PPDB                                    │
│                         Galeri                                  │
│                         Kontak                                  │
│                                                                 │
│─────────────────────────────────────────────────────────────────│
│  © 2025 Nama Sekolah. Hak cipta dilindungi.                    │
└─────────────────────────────────────────────────────────────────┘
```

---

### 4.3 Komponen Reusable

| Komponen | Props | Keterangan |
|----------|-------|------------|
| `<SectionHeading />` | `title`, `subtitle`, `align` | Judul section + garis dekoratif bawah |
| `<Card />` | `image`, `title`, `description`, `badge`, `href` | Kartu generik untuk berita/prestasi/fasilitas |
| `<Badge />` | `label`, `variant` (`primary`/`secondary`/`accent`/`outline`) | Label kategori / status |
| `<CTAButton />` | `label`, `href`, `variant` (`primary`/`outline`/`ghost`) | Tombol aksi |
| `<Breadcrumb />` | `items: {label, href}[]` | Navigasi breadcrumb di halaman detail |
| `<Skeleton />` | `width`, `height`, `variant` | Loading placeholder shimmer |
| `<EmptyState />` | `icon`, `title`, `description` | Tampilan saat data kosong |
| `<FilterPills />` | `items`, `activeItem`, `onChange` | Filter kategori horizontal (pill/tab) |
| `<Pagination />` | `currentPage`, `totalPages`, `onPageChange` | Navigasi halaman |
| `<ImageWithFallback />` | `src`, `alt`, `fallback` | Gambar dengan fallback/skeleton |
| `<ScrollReveal />` | `children`, `delay`, `direction` | Wrapper Framer Motion untuk animasi masuk |
| `<StatsCounter />` | `value`, `label`, `icon` | Angka statistik dengan animasi count-up |
| `<TestimonialCard />` | `quote`, `name`, `role`, `photo` | (Opsional) Kutipan sambutan |

---

## 5. Halaman Detail per Route

---

### 5.1 Home — `/`

Halaman utama yang paling penting. Harus memberikan kesan pertama yang **WOW**, profesional, dan informatif.

#### Section 1: Hero

```
┌─────────────────────────────────────────────────────────────────┐
│  [Background: Foto sekolah full-width dengan dark overlay 50%] │
│                                                                 │
│          ★ Terakreditasi A                                      │
│                                                                 │
│      Selamat Datang di                                          │
│      SMP Negeri 1 [Nama Kota]                                   │
│                                                                 │
│      Mencetak Generasi Unggul, Berkarakter,                     │
│      dan Berprestasi                                            │
│                                                                 │
│      [Kenali Kami →]    [Daftar Sekarang]                       │
│                                                                 │
│  ┌─────────┬─────────┬─────────┬─────────┐                     │
│  │ 500+    │ 50+     │ 30+     │ 15+     │                     │
│  │ Siswa   │ Guru    │ Prestasi│ Tahun   │                     │
│  └─────────┴─────────┴─────────┴─────────┘                     │
└─────────────────────────────────────────────────────────────────┘
```

- **Background:** Foto gedung sekolah atau kegiatan siswa, full-width, `min-h-[85vh]`
- **Overlay:** Gradient gelap dari bawah (`bg-gradient-to-t from-black/70 via-black/30 to-transparent`)
- **Badge:** Akreditasi di atas judul (emas, pill shape)
- **Teks:** Putih, Display size, drop shadow tipis
- **CTA:** 2 tombol — Primary (link ke `/profil`) + Outline putih (link ke `/pendaftaran`)
- **Stats bar:** 4 angka statistik di bawah CTA, background semi-transparan, animasi count-up saat masuk viewport
- **Animasi:** Teks fade-up stagger (tiap elemen muncul berurutan 100ms delay)

#### Section 2: Sambutan Kepala Sekolah

```
┌─────────────────────────────────────────────────────────────────┐
│  Background: Putih / Neutral 50                                 │
│                                                                 │
│  ┌──────────────┐   Sambutan Kepala Sekolah                    │
│  │              │                                               │
│  │  Foto Kepsek │   "Pendidikan yang bermutu adalah fondasi    │
│  │  rounded     │   bagi kemajuan bangsa. Di sekolah ini,      │
│  │  240x300px   │   kami berkomitmen untuk..."                  │
│  │              │                                               │
│  │              │   — Drs. Ahmad Fauzi, M.Pd.                  │
│  │              │   Kepala Sekolah                              │
│  └──────────────┘                                               │
│                         [Baca Selengkapnya →]                   │
└─────────────────────────────────────────────────────────────────┘
```

- **Layout:** 2 kolom (foto kiri, teks kanan). Stack di mobile (foto atas, teks bawah)
- **Foto:** `rounded-2xl`, `object-cover`, `shadow-xl`
- **Kutipan:** Italic, font lebih besar (lg), dengan tanda kutip dekoratif besar (`"`) di atas
- **Link:** Mengarah ke halaman `/profil`
- **Animasi:** Foto slide-in dari kiri, teks slide-in dari kanan saat scroll

#### Section 3: Highlight Prestasi

```
┌─────────────────────────────────────────────────────────────────┐
│  Background: Primary Light (#E3F2FD) atau subtle gradient       │
│                                                                 │
│  🏆 Prestasi Membanggakan                                       │
│  "Siswa dan guru kami terus mengukir prestasi di berbagai       │
│  tingkat kompetisi"                                             │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │ 🥇       │  │ 🥈       │  │ 🥉       │  │ 🏅       │      │
│  │ Foto     │  │ Foto     │  │ Foto     │  │ Foto     │      │
│  │          │  │          │  │          │  │          │      │
│  │ Juara 1  │  │ Juara 2  │  │ Juara 3  │  │ Finalis  │      │
│  │ OSN MTK  │  │ Pencak   │  │ Futsal   │  │ Debat    │      │
│  │ ────     │  │ ────     │  │ ────     │  │ ────     │      │
│  │[Nasional]│  │[Provinsi]│  │[Kab/Kota]│  │[Nasional]│      │
│  │ [Siswa]  │  │ [Siswa]  │  │ [Siswa]  │  │ [Guru]   │      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
│                                                                 │
│                 [Lihat Semua Prestasi →]                        │
└─────────────────────────────────────────────────────────────────┘
```

- **Data:** Query `achievements` WHERE `is_featured = true` AND `is_published = true`, ORDER BY `level` DESC, `date` DESC, LIMIT 4 (desktop), 2 (mobile scroll horizontal)
- **Card:** Ikon juara besar di kiri atas, foto (jika ada), judul, 2 badge (level + kategori)
- **Responsif:** 4 kolom desktop, 2 kolom tablet, horizontal scroll mobile
- **CTA:** Link ke `/prestasi`
- **Animasi:** Cards fade-up stagger

#### Section 4: Berita & Pengumuman Terbaru

```
┌─────────────────────────────────────────────────────────────────┐
│  Background: Putih                                              │
│                                                                 │
│  📰 Berita & Pengumuman Terbaru                                 │
│                                                                 │
│  ┌─────────────────────────────┐  ┌────────────────┐           │
│  │                             │  │ [Foto kecil]   │           │
│  │   [Foto besar]              │  │ Judul berita 2 │           │
│  │                             │  │ excerpt...     │           │
│  │   [Badge: Berita]           │  │ 20 Jun 2025    │           │
│  │   Judul Berita Utama        │  ├────────────────┤           │
│  │   Excerpt teks singkat...   │  │ [Foto kecil]   │           │
│  │   20 Juni 2025              │  │ Judul berita 3 │           │
│  │                             │  │ excerpt...     │           │
│  └─────────────────────────────┘  │ 18 Jun 2025    │           │
│                                   ├────────────────┤           │
│                                   │ [Pengumuman]   │           │
│                                   │ Judul pengum.. │           │
│                                   │ 15 Jun 2025    │           │
│                                   └────────────────┘           │
│                                                                 │
│                  [Lihat Semua Berita →]                         │
└─────────────────────────────────────────────────────────────────┘
```

- **Layout:** Bento grid — 1 berita besar (featured, 60% lebar) + 3 berita kecil (40% lebar, stack vertikal)
- **Data:** Query `posts` WHERE `is_published = true`, ORDER BY `published_at` DESC, LIMIT 4
- **Badge warna:** Biru untuk Berita, Oranye untuk Pengumuman
- **Card hover:** Subtle scale + shadow
- **Mobile:** Stack vertikal semua card
- **CTA:** Link ke `/berita`

#### Section 5: Fasilitas Unggulan

```
┌─────────────────────────────────────────────────────────────────┐
│  Background: Neutral 50                                         │
│                                                                 │
│  🏫 Fasilitas Unggulan                                          │
│  "Sarana dan prasarana modern untuk mendukung proses belajar"   │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │ Foto     │  │ Foto     │  │ Foto     │  │ Foto     │      │
│  │ cover    │  │ cover    │  │ cover    │  │ cover    │      │
│  │          │  │          │  │          │  │          │      │
│  │ Lab Kom  │  │ Perpus   │  │ Lapangan │  │ Masjid   │      │
│  │[Teknlgi] │  │[Akademik]│  │[Olahraga]│  │ [Ibadah] │      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
│                                                                 │
│                [Lihat Semua Fasilitas →]                        │
└─────────────────────────────────────────────────────────────────┘
```

- **Data:** Query `facilities` WHERE `is_featured = true` AND `is_published = true`, ORDER BY `sort_order`, LIMIT 4-6
- **Card:** Foto cover aspect-ratio 4:3, nama, badge kategori (dengan ikon emoji)
- **Responsif:** 4 kolom desktop, 2 tablet, horizontal scroll mobile
- **Card hover:** Image zoom (`scale(1.05)` pada foto, `overflow-hidden` pada container)
- **Animasi:** Fade-up stagger

#### Section 6: Info Pendaftaran (PPDB) CTA

```
┌─────────────────────────────────────────────────────────────────┐
│  Background: Gradient Primary → Primary Dark                    │
│  Teks: Putih                                                    │
│                                                                 │
│          📝 Pendaftaran Siswa Baru (PPDB)                       │
│          Tahun Ajaran 2025/2026                                 │
│                                                                 │
│          Pendaftaran dibuka mulai 1 Juni — 30 Juni 2025         │
│                                                                 │
│          [Lihat Info Pendaftaran →]    [Hubungi Kami]            │
│                                                                 │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐                  │
│  │ 📋        │  │ 📅        │  │ 💰        │                  │
│  │ Syarat    │  │ Jadwal    │  │ Biaya     │                  │
│  │ Pendaft.  │  │ Kegiatan  │  │ Terjangkau│                  │
│  └───────────┘  └───────────┘  └───────────┘                  │
└─────────────────────────────────────────────────────────────────┘
```

- **Desain:** Full-width banner dengan gradient biru, teks putih, sangat menonjol
- **3 highlight:** Ikon besar + judul + 1 baris deskripsi (grid 3 kolom)
- **CTA:** Tombol putih outline + tombol secondary
- **Animasi:** Background subtle parallax atau pattern overlay animated

#### Section 7: Lokasi & Kontak Ringkas

```
┌─────────────────────────────────────────────────────────────────┐
│  Background: Putih                                              │
│                                                                 │
│  ┌─────────────────────────┐  📍 Lokasi Kami                   │
│  │                         │                                    │
│  │    [Google Maps Embed]  │  Jl. Pendidikan No. 1,            │
│  │    Rounded corners      │  Kec. ..., Kab. ...               │
│  │    Aspect 16:9          │  Jawa Barat 12345                  │
│  │                         │                                    │
│  │                         │  ☎️ (021) 123-4567                 │
│  └─────────────────────────┘  ✉️ info@sekolah.sch.id           │
│                                                                 │
│                               [Buka di Google Maps →]          │
│                               [Kirim Pesan →]                  │
└─────────────────────────────────────────────────────────────────┘
```

- **Layout:** 2 kolom (peta kiri, info kontak kanan)
- **Peta:** Google Maps embed, `rounded-xl`, aspect ratio 16:9
- **Link CTA:** Buka Google Maps (new tab) + link ke `/kontak`

---

### 5.2 Profil & Sejarah — `/profil`

```
┌─────────────────────────────────────────────────────────────────┐
│  [Hero kecil: Banner image + overlay]                          │
│  Breadcrumb: Beranda > Profil                                  │
│  H1: Profil Sekolah                                            │
│                                                                 │
│  ── Tab Navigation ──────────────────────────────────────────── │
│  [Visi & Misi]  [Sejarah]  [Struktur Organisasi]               │
│                                                                 │
│  Tab 1: Visi & Misi                                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  🎯 Visi                                                │   │
│  │  [Konten rich text dari database - tabel `pages`        │   │
│  │   WHERE slug = 'visi-misi']                             │   │
│  │                                                          │   │
│  │  🚀 Misi                                                │   │
│  │  1. ...                                                  │   │
│  │  2. ...                                                  │   │
│  │  3. ...                                                  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Tab 2: Sejarah                                                │
│  [Konten dari pages WHERE slug = 'sejarah']                    │
│  Timeline vertikal dengan tahun-tahun penting                  │
│                                                                 │
│  Tab 3: Struktur Organisasi                                    │
│  [Gambar/diagram dari pages WHERE slug = 'profil']             │
└─────────────────────────────────────────────────────────────────┘
```

- **Hero:** Mini banner (40vh), foto sekolah, overlay gelap, judul + breadcrumb
- **Tab:** shadcn `<Tabs />`, animasi transisi konten (fade)
- **Konten:** Render HTML dari TipTap (sanitized)
- **Mobile:** Tab menjadi accordion atau horizontal scroll pills

---

### 5.3 Berita & Pengumuman — `/berita`

```
┌─────────────────────────────────────────────────────────────────┐
│  [Mini Hero Banner]                                            │
│  Breadcrumb: Beranda > Berita & Pengumuman                     │
│  H1: Berita & Pengumuman                                       │
│                                                                 │
│  ── Filter Bar ──────────────────────────────────────────────── │
│  [Semua]  [Berita]  [Pengumuman]        🔍 [Cari berita...]    │
│                                                                 │
│  ── Grid (3 kolom) ─────────────────────────────────────────── │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                    │
│  │ Foto     │  │ Foto     │  │ Foto     │                    │
│  │          │  │          │  │          │                    │
│  │[Berita]  │  │[Pengum.] │  │[Berita]  │                    │
│  │ Judul    │  │ Judul    │  │ Judul    │                    │
│  │ Excerpt  │  │ Excerpt  │  │ Excerpt  │                    │
│  │ 📅 20/6  │  │ 📅 18/6  │  │ 📅 15/6  │                    │
│  └──────────┘  └──────────┘  └──────────┘                    │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                    │
│  │  ...     │  │  ...     │  │  ...     │                    │
│  └──────────┘  └──────────┘  └──────────┘                    │
│                                                                 │
│  [← Sebelumnya]  Halaman 1 dari 5  [Selanjutnya →]            │
└─────────────────────────────────────────────────────────────────┘
```

- **Filter:** `<FilterPills />` untuk kategori (Semua / Berita / Pengumuman)
- **Search:** Input dengan ikon 🔍, debounce 300ms
- **Grid:** 3 kolom (desktop), 2 (tablet), 1 (mobile)
- **Card:** Gambar unggulan (aspect 16:9), badge kategori, judul, excerpt (maks 2 baris, line-clamp), tanggal
- **Pagination:** 9 item per halaman (3×3 grid penuh)
- **Empty state:** Ilustrasi + "Belum ada berita"

---

### 5.4 Detail Berita — `/berita/[slug]`

```
┌─────────────────────────────────────────────────────────────────┐
│  Breadcrumb: Beranda > Berita > [Judul]                        │
│                                                                 │
│  [Badge: Berita / Pengumuman]                                  │
│  H1: Judul Berita Lengkap                                      │
│  📅 20 Juni 2025                                                │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  [Gambar Unggulan - full width, rounded, aspect 16:9]   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  [Konten artikel - rich text rendered]                          │
│  Max-width: 768px (untuk readability optimal)                  │
│  Prose styling (Tailwind @tailwindcss/typography)              │
│                                                                 │
│  ───────────────────────────────────────────────────────────── │
│  📰 Berita Lainnya                                             │
│  ┌──────┐  ┌──────┐  ┌──────┐                                │
│  │ Card │  │ Card │  │ Card │  (3 berita terbaru lain)        │
│  └──────┘  └──────┘  └──────┘                                │
└─────────────────────────────────────────────────────────────────┘
```

- **Layout:** Single column, centered, `max-w-3xl`
- **Prose:** Gunakan `@tailwindcss/typography` untuk styling konten rich text
- **Related posts:** 3 berita terbaru lainnya (exclude current) di bawah
- **SEO:** Meta title = judul berita, meta description = excerpt, OG image = gambar unggulan

---

### 5.5 Info Pendaftaran — `/pendaftaran`

```
┌─────────────────────────────────────────────────────────────────┐
│  [Hero Banner gradient + pattern]                              │
│  H1: Pendaftaran Siswa Baru (PPDB)                             │
│  Sub: Tahun Ajaran 2025/2026                                   │
│                                                                 │
│  ── Timeline / Steps ────────────────────────────────────────── │
│  Step 1 ──── Step 2 ──── Step 3 ──── Step 4                   │
│  Daftar      Verifikasi  Tes/Seleksi Pengumuman               │
│  Online      Berkas                   Hasil                    │
│                                                                 │
│  ── Info Cards (grid 2 kolom) ───────────────────────────────── │
│  ┌─────────────────┐  ┌─────────────────┐                     │
│  │ 📋 Syarat       │  │ 📅 Jadwal       │                     │
│  │ Pendaftaran     │  │ Penting         │                     │
│  │ - Fotokopi ...  │  │ 1 Jun - Daftar  │                     │
│  │ - Pas foto ...  │  │ 15 Jun - Tes    │                     │
│  │ - ...           │  │ 25 Jun - Pengum │                     │
│  └─────────────────┘  └─────────────────┘                     │
│  ┌─────────────────┐  ┌─────────────────┐                     │
│  │ 💰 Biaya        │  │ 📞 Kontak PPDB  │                     │
│  │ Pendaftaran     │  │                 │                     │
│  │ Rp ...          │  │ Telp: ...       │                     │
│  │                 │  │ WA: ...         │                     │
│  └─────────────────┘  └─────────────────┘                     │
│                                                                 │
│  ── Konten lengkap dari database ──────────────────────────── │
│  [Rich text content dari pages WHERE slug = 'pendaftaran']     │
│                                                                 │
│  ── CTA ────────────────────────────────────────────────────── │
│  [Daftar Sekarang / Link Formulir Eksternal →]                 │
│  [Hubungi Kami untuk Info Lebih Lanjut]                        │
└─────────────────────────────────────────────────────────────────┘
```

- **Timeline:** Horizontal steps indicator (4 langkah) dengan ikon dan label
- **Info cards:** 2×2 grid, ikon besar, konten ringkas
- **Konten:** Rich text dari database untuk informasi detail
- **CTA:** Tombol besar, warna kontras, bisa link ke Google Form atau halaman lain

---

### 5.6 Galeri — `/galeri`

```
┌─────────────────────────────────────────────────────────────────┐
│  [Mini Hero Banner]                                            │
│  H1: Galeri Foto & Video                                       │
│                                                                 │
│  ── Tab ─────────────────────────────────────────────────────── │
│  [📷 Foto]  [🎬 Video]                                         │
│                                                                 │
│  ── Tab Foto: Daftar Album ─────────────────────────────────── │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                    │
│  │ Cover    │  │ Cover    │  │ Cover    │                    │
│  │ Photo    │  │ Photo    │  │ Photo    │                    │
│  │          │  │          │  │          │                    │
│  │ Nama     │  │ Nama     │  │ Nama     │                    │
│  │ Album    │  │ Album    │  │ Album    │                    │
│  │ 12 foto  │  │ 8 foto   │  │ 20 foto  │                    │
│  └──────────┘  └──────────┘  └──────────┘                    │
│                                                                 │
│  [Klik album → modal/overlay grid foto → klik foto = lightbox]│
│                                                                 │
│  ── Tab Video ───────────────────────────────────────────────── │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                    │
│  │ YouTube  │  │ YouTube  │  │ YouTube  │                    │
│  │ Thumb    │  │ Thumb    │  │ Thumb    │                    │
│  │ ▶️       │  │ ▶️       │  │ ▶️       │                    │
│  │ Judul    │  │ Judul    │  │ Judul    │                    │
│  └──────────┘  └──────────┘  └──────────┘                    │
│  [Klik → play YouTube embed inline atau modal]                 │
└─────────────────────────────────────────────────────────────────┘
```

- **Tabs:** Foto vs Video (shadcn Tabs)
- **Album foto:** Grid card album, cover = foto pertama, count badge overlay
- **Klik album:** Expand/modal menampilkan grid semua foto → klik foto = lightbox (yet-another-react-lightbox)
- **Video:** Grid thumbnail YouTube, klik → inline embed atau modal YouTube player
- **Masonry layout** opsional untuk foto (jika ingin lebih menarik)

---

### 5.7 Fasilitas — `/fasilitas`

```
┌─────────────────────────────────────────────────────────────────┐
│  [Mini Hero Banner]                                            │
│  H1: Fasilitas Sekolah                                         │
│                                                                 │
│  ── Filter Pills ───────────────────────────────────────────── │
│  [Semua] [📚 Akademik] [⚽ Olahraga] [🎨 Seni]                │
│  [🕌 Ibadah] [💻 Teknologi] [🏫 Lainnya]                      │
│                                                                 │
│  ── Grid ────────────────────────────────────────────────────── │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                    │
│  │ Foto     │  │ Foto     │  │ Foto     │                    │
│  │ cover    │  │ cover    │  │ cover    │                    │
│  │          │  │          │  │          │                    │
│  │ Lab Komp │  │ Perpus   │  │ Lapangan │                    │
│  │[💻 Tekno]│  │[📚 Akad] │  │[⚽ Olrga]│                    │
│  └──────────┘  └──────────┘  └──────────┘                    │
│                                                                 │
│  [Animasi transisi saat filter berubah — layout animation]     │
└─────────────────────────────────────────────────────────────────┘
```

- **Filter:** Pill buttons horizontal, klik = filter client-side, Framer Motion layout animation saat item berubah
- **Grid:** 3 kolom (desktop), 2 (tablet), 1 (mobile)
- **Card:** Foto cover aspect 4:3, nama, badge kategori + ikon emoji
- **Card hover:** Foto zoom in, overlay gelap tipis muncul, nama slide up
- **Klik → detail** `/fasilitas/[slug]`

---

### 5.8 Detail Fasilitas — `/fasilitas/[slug]`

```
┌─────────────────────────────────────────────────────────────────┐
│  Breadcrumb: Beranda > Fasilitas > [Nama]                      │
│                                                                 │
│  [Foto Cover Full-Width, rounded, aspect 21:9]                 │
│                                                                 │
│  [Badge Kategori + Ikon]                                       │
│  H1: Nama Fasilitas                                            │
│                                                                 │
│  [Deskripsi lengkap — rich text / paragraf]                    │
│                                                                 │
│  ── Galeri Foto ─────────────────────────────────────────────── │
│  (Jika ada facility_photos)                                    │
│  ┌────┐  ┌────┐  ┌────┐  ┌────┐                              │
│  │Foto│  │Foto│  │Foto│  │Foto│                              │
│  │ 1  │  │ 2  │  │ 3  │  │ 4  │                              │
│  └────┘  └────┘  └────┘  └────┘                              │
│  [Klik = lightbox dengan navigasi prev/next]                   │
│                                                                 │
│  ── Fasilitas Lainnya ───────────────────────────────────────── │
│  ┌──────┐  ┌──────┐  ┌──────┐                                │
│  │ Card │  │ Card │  │ Card │                                │
│  └──────┘  └──────┘  └──────┘                                │
└─────────────────────────────────────────────────────────────────┘
```

---

### 5.9 Prestasi — `/prestasi`

```
┌─────────────────────────────────────────────────────────────────┐
│  [Mini Hero Banner]                                            │
│  H1: Prestasi                                                  │
│                                                                 │
│  ── Filter Horizontal ──────────────────────────────────────── │
│  Kategori: [Semua] [Siswa] [Guru] [Sekolah]                   │
│  Level:    [Semua] [Kecamatan] [Kabupaten] ... [Internasional] │
│  Tahun:    [Dropdown: 2025, 2024, 2023, ...]                   │
│                                                                 │
│  ── Grid (3 kolom) ─────────────────────────────────────────── │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                    │
│  │ Foto/    │  │ Foto/    │  │ Foto/    │                    │
│  │ Ikon 🥇  │  │ Ikon 🥈  │  │ Ikon 🏅  │                    │
│  │          │  │          │  │          │                    │
│  │ Judul    │  │ Judul    │  │ Judul    │                    │
│  │ Penylgr  │  │ Penylgr  │  │ Penylgr  │                    │
│  │[Nasional]│  │[Provinsi]│  │[Kab/Kota]│                    │
│  │ [Siswa]  │  │ [Guru]   │  │ [Sekolah]│                    │
│  │ Jun 2025 │  │ Mei 2025 │  │ Apr 2025 │                    │
│  └──────────┘  └──────────┘  └──────────┘                    │
│                                                                 │
│  [Pagination]                                                  │
└─────────────────────────────────────────────────────────────────┘
```

- **Filter:** 3 baris filter — kategori (pills), level (pills), tahun (dropdown)
- **Grid:** 3 kolom desktop, 1 mobile
- **Card:** Foto atau ikon juara besar sebagai fallback, judul, penyelenggara, 2 badge (level + kategori), tanggal (format "Januari 2025")
- **Pagination:** 9 per halaman

---

### 5.10 Detail Prestasi — `/prestasi/[slug]`

```
┌─────────────────────────────────────────────────────────────────┐
│  Breadcrumb: Beranda > Prestasi > [Judul]                      │
│                                                                 │
│  ┌────────────────────────┐  🥇 Juara 1                       │
│  │                        │                                    │
│  │  [Foto Besar]          │  H1: Judul Prestasi               │
│  │  atau Ikon Juara       │                                    │
│  │  jika tidak ada foto   │  📋 Kategori: Siswa               │
│  │                        │  📊 Tingkat: Nasional             │
│  │                        │  🏢 Penyelenggara: Kemendikbud    │
│  │                        │  📅 Tanggal: 20 Juni 2025         │
│  └────────────────────────┘                                    │
│                                                                 │
│  Deskripsi:                                                    │
│  [Rich text / paragraf deskripsi lengkap]                      │
│                                                                 │
│  ── Prestasi Lainnya ────────────────────────────────────────── │
│  [3 card prestasi terbaru lainnya]                             │
└─────────────────────────────────────────────────────────────────┘
```

---

### 5.11 Guru & Staf — `/guru-dan-staf`

```
┌─────────────────────────────────────────────────────────────────┐
│  [Mini Hero Banner]                                            │
│  H1: Guru & Staf Kami                                          │
│                                                                 │
│  ── Filter ──────────────────────────────────────────────────── │
│  [Semua] [Kepala Sekolah] [Guru] [Staf]                        │
│                                                                 │
│  ── Kepala Sekolah (selalu pertama) ─────────────────────────── │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  [Foto Besar]     Drs. Ahmad Fauzi, M.Pd.              │   │
│  │  rounded          Kepala Sekolah                        │   │
│  │  200×200          "Sambutan singkat..."                  │   │
│  │                   [Lihat Profil →]                      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ── Guru ────────────────────────────────────────────────────── │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐                      │
│  │ Foto │  │ Foto │  │ Foto │  │ Foto │                      │
│  │ bulat│  │ bulat│  │ bulat│  │ bulat│                      │
│  │ Nama │  │ Nama │  │ Nama │  │ Nama │                      │
│  │[Guru]│  │[Guru]│  │[Guru]│  │[Guru]│                      │
│  │ Mapel│  │ Mapel│  │ Mapel│  │ Mapel│                      │
│  └──────┘  └──────┘  └──────┘  └──────┘                      │
│                                                                 │
│  ── Staf ────────────────────────────────────────────────────── │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐                      │
│  │ Foto │  │ Foto │  │ Foto │  │ Foto │                      │
│  │ Nama │  │ Nama │  │ Nama │  │ Nama │                      │
│  │[Staf]│  │[Staf]│  │[Staf]│  │[Staf]│                      │
│  └──────┘  └──────┘  └──────┘  └──────┘                      │
└─────────────────────────────────────────────────────────────────┘
```

- **Urutan:** Kepala Sekolah → Guru → Staf, masing-masing diurutkan `sort_order`
- **Kepala Sekolah:** Card khusus lebih besar, layout horizontal (foto kiri, info kanan)
- **Guru & Staf:** Grid kartu 4 kolom (desktop), 2 (tablet), 1 (mobile)
- **Kartu:** Foto bulat (`rounded-full`, 120×120), nama, badge jabatan, mata pelajaran (guru saja)
- **Hover:** Scale up foto + shadow, overlay subtle
- **Klik → detail** `/guru-dan-staf/[slug]`
- **Filter:** Hanya tampilkan `is_active = true`

---

### 5.12 Detail Guru/Staf — `/guru-dan-staf/[slug]`

```
┌─────────────────────────────────────────────────────────────────┐
│  Breadcrumb: Beranda > Guru & Staf > [Nama]                   │
│                                                                 │
│  ┌──────────────┐   Nama Lengkap                               │
│  │              │   [Badge: Guru / Kepala Sekolah / Staf]      │
│  │  Foto        │   Mata Pelajaran (jika guru)                 │
│  │  Profil      │                                               │
│  │  240×300     │   📚 Riwayat Pendidikan:                     │
│  │  rounded-xl  │   • S1 Pendidikan Matematika, UNJ (2010)     │
│  │              │   • S2 Manajemen Pendidikan, UPI (2015)       │
│  └──────────────┘                                               │
│                                                                 │
│  📝 Biografi:                                                   │
│  [Bio lengkap - paragraf]                                      │
│                                                                 │
│  ✉️ Email: nama@sekolah.sch.id                                 │
│                                                                 │
│  ── Guru Lainnya ──────────────────────────────────────────── │
│  [4 card guru/staf lainnya]                                    │
└─────────────────────────────────────────────────────────────────┘
```

- **Layout:** 2 kolom (foto kiri, info kanan), stack di mobile
- **Telepon:** TIDAK ditampilkan ke publik (sesuai PRD: internal only)
- **Related:** 4 guru/staf lainnya dengan role sama

---

### 5.13 Kontak — `/kontak`

```
┌─────────────────────────────────────────────────────────────────┐
│  [Mini Hero Banner]                                            │
│  H1: Hubungi Kami                                              │
│                                                                 │
│  ── Layout 2 Kolom ──────────────────────────────────────────── │
│                                                                 │
│  ┌─── Info Kontak ──────┐  ┌─── Formulir Pesan ──────────┐    │
│  │                      │  │                              │    │
│  │  📍 Alamat           │  │  Nama Lengkap *              │    │
│  │  Jl. Pendidikan ...  │  │  [________________]          │    │
│  │                      │  │                              │    │
│  │  ☎️ Telepon          │  │  Email *                     │    │
│  │  (021) 123-4567      │  │  [________________]          │    │
│  │                      │  │                              │    │
│  │  ✉️ Email            │  │  No. Telepon                 │    │
│  │  info@sekolah.sch.id │  │  [________________]          │    │
│  │                      │  │                              │    │
│  │  🕐 Jam Operasional  │  │  Pesan *                     │    │
│  │  Senin-Jumat         │  │  [                    ]      │    │
│  │  07:00 — 15:00       │  │  [                    ]      │    │
│  │                      │  │  [                    ]      │    │
│  │  ── Sosial Media ──  │  │                              │    │
│  │  [FB] [IG] [YT] [TT]│  │  [Kirim Pesan →]             │    │
│  │                      │  │                              │    │
│  └──────────────────────┘  └──────────────────────────────┘    │
│                                                                 │
│  ── Google Maps (Full Width) ──────────────────────────────── │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                          │   │
│  │              [Google Maps Embed]                          │   │
│  │              Aspect 21:9 desktop, 16:9 mobile            │   │
│  │                                                          │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

- **Info kontak:** Card dengan ikon, data dari tabel `settings`
- **Social media:** Icon buttons, link dari `settings`
- **Form:** 4 field — nama (wajib), email (wajib), telepon (opsional), pesan (wajib, textarea)
- **Validasi:** Client-side (required, email format) + server-side
- **Submit:** POST ke API → simpan ke tabel `contacts` → toast sukses "Pesan Anda telah terkirim!"
- **Honeypot/reCAPTCHA:** Pertimbangkan anti-spam sederhana
- **Maps:** Full-width di bawah, `rounded-xl`, embed iframe

---

## 6. Struktur Folder (App Router)

```
src/
├── app/
│   ├── layout.tsx                 # Root layout (Navbar + Footer)
│   ├── page.tsx                   # Home (landing page)
│   ├── profil/
│   │   └── page.tsx               # Profil & Sejarah
│   ├── berita/
│   │   ├── page.tsx               # Daftar berita
│   │   └── [slug]/
│   │       └── page.tsx           # Detail berita
│   ├── pendaftaran/
│   │   └── page.tsx               # Info pendaftaran PPDB
│   ├── galeri/
│   │   └── page.tsx               # Galeri foto & video
│   ├── fasilitas/
│   │   ├── page.tsx               # Daftar fasilitas
│   │   └── [slug]/
│   │       └── page.tsx           # Detail fasilitas
│   ├── prestasi/
│   │   ├── page.tsx               # Daftar prestasi
│   │   └── [slug]/
│   │       └── page.tsx           # Detail prestasi
│   ├── guru-dan-staf/
│   │   ├── page.tsx               # Daftar guru & staf
│   │   └── [slug]/
│   │       └── page.tsx           # Detail guru/staf
│   ├── kontak/
│   │   └── page.tsx               # Halaman kontak
│   ├── globals.css                # Tailwind + custom CSS
│   └── not-found.tsx              # Custom 404 page
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── MobileMenu.tsx
│   │   └── Footer.tsx
│   ├── ui/                        # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── badge.tsx
│   │   ├── card.tsx
│   │   ├── tabs.tsx
│   │   ├── input.tsx
│   │   ├── textarea.tsx
│   │   └── ...
│   ├── shared/
│   │   ├── SectionHeading.tsx
│   │   ├── Breadcrumb.tsx
│   │   ├── CTAButton.tsx
│   │   ├── FilterPills.tsx
│   │   ├── Pagination.tsx
│   │   ├── ScrollReveal.tsx
│   │   ├── StatsCounter.tsx
│   │   ├── ImageWithFallback.tsx
│   │   ├── EmptyState.tsx
│   │   └── MiniHeroBanner.tsx
│   ├── home/
│   │   ├── HeroSection.tsx
│   │   ├── WelcomeSection.tsx      # Sambutan Kepsek
│   │   ├── AchievementHighlight.tsx
│   │   ├── NewsSection.tsx
│   │   ├── FacilityHighlight.tsx
│   │   ├── PPDBBanner.tsx
│   │   └── LocationSection.tsx
│   ├── berita/
│   │   ├── NewsCard.tsx
│   │   ├── NewsGrid.tsx
│   │   └── NewsFilter.tsx
│   ├── prestasi/
│   │   ├── AchievementCard.tsx
│   │   ├── AchievementGrid.tsx
│   │   └── AchievementFilter.tsx
│   ├── fasilitas/
│   │   ├── FacilityCard.tsx
│   │   ├── FacilityGrid.tsx
│   │   └── FacilityGallery.tsx
│   ├── guru/
│   │   ├── StaffCard.tsx
│   │   ├── StaffGrid.tsx
│   │   └── HeadmasterCard.tsx
│   ├── galeri/
│   │   ├── AlbumCard.tsx
│   │   ├── PhotoGrid.tsx
│   │   ├── VideoGrid.tsx
│   │   └── LightboxWrapper.tsx
│   └── kontak/
│       ├── ContactForm.tsx
│       ├── ContactInfo.tsx
│       └── MapEmbed.tsx
│
├── lib/
│   ├── db.ts                      # Drizzle ORM connection
│   ├── utils.ts                   # Helper functions (cn, formatDate, etc.)
│   └── constants.ts               # Color tokens, site metadata defaults
│
├── types/
│   └── index.ts                   # TypeScript interfaces untuk semua entity
│
└── public/
    ├── images/
    │   ├── hero-placeholder.jpg
    │   ├── logo.png
    │   └── og-default.jpg
    └── fonts/                     # (jika self-host font)
```

---

## 7. SEO & Meta Tags

Setiap halaman WAJIB memiliki metadata berikut (menggunakan Next.js `generateMetadata()`):

```typescript
// Contoh untuk halaman berita detail
export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  return {
    title: `${post.title} | Nama Sekolah`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.image_url || '/images/og-default.jpg'],
      type: 'article',
      publishedTime: post.published_at,
    },
  };
}
```

### Daftar Meta per Halaman

| Halaman | Title Pattern | Description |
|---------|--------------|-------------|
| Home | `Nama Sekolah — Tagline` | Deskripsi singkat sekolah |
| Profil | `Profil & Sejarah — Nama Sekolah` | Tentang visi, misi, sejarah sekolah |
| Berita | `Berita & Pengumuman — Nama Sekolah` | Kabar terbaru dari sekolah |
| Detail Berita | `{Judul Berita} — Nama Sekolah` | `{excerpt}` |
| Pendaftaran | `Pendaftaran Siswa Baru (PPDB) — Nama Sekolah` | Info pendaftaran, syarat, jadwal PPDB |
| Galeri | `Galeri Foto & Video — Nama Sekolah` | Dokumentasi kegiatan sekolah |
| Fasilitas | `Fasilitas Sekolah — Nama Sekolah` | Sarana dan prasarana sekolah |
| Detail Fasilitas | `{Nama Fasilitas} — Nama Sekolah` | `{deskripsi}` |
| Prestasi | `Prestasi — Nama Sekolah` | Pencapaian siswa, guru, dan sekolah |
| Guru & Staf | `Guru & Staf — Nama Sekolah` | Profil tenaga pendidik dan kependidikan |
| Kontak | `Hubungi Kami — Nama Sekolah` | Alamat, telepon, email, formulir kontak |

---

## 8. Responsif Checklist

Setiap halaman harus diuji pada breakpoint berikut:

| Breakpoint | Lebar | Target Device |
|------------|-------|---------------|
| Mobile S | 320px | iPhone SE |
| Mobile L | 390px | iPhone 14 |
| Tablet | 768px | iPad |
| Desktop | 1280px | Laptop |
| Desktop L | 1536px | Monitor besar |

### Aturan Responsif Utama

- **Navbar:** Full menu → hamburger di `< md`
- **Grid:** 4 col → 2 col → 1 col
- **Hero:** Padding dan font size berkurang proporsional
- **Side-by-side layout:** Stack vertikal di `< md`
- **Horizontal scroll:** Gunakan untuk card slider di mobile (dengan scroll indicator)
- **Peta Google Maps:** Aspect ratio berubah dari 21:9 (desktop) ke 16:9 (mobile)
- **Tabel:** Horizontal scroll wrapper di mobile
- **Font size:** Gunakan `clamp()` untuk fluid typography

---

## 9. Performance Guidelines

| Aspek | Strategi |
|-------|----------|
| **Images** | Next.js `<Image />` dengan `priority` di hero, lazy-load sisanya. Format WebP. Blur placeholder. |
| **Fonts** | `next/font/google` untuk Inter + Outfit — otomatis self-hosted, no layout shift |
| **SSR/SSG** | Halaman statis (profil, fasilitas list) → Static Generation. Halaman dinamis (berita, detail) → ISR (revalidate 60s) |
| **Bundle** | Dynamic import untuk komponen berat (lightbox, maps, framer-motion animations) |
| **CSS** | Tailwind purge unused classes |
| **Core Web Vitals** | Target LCP < 2.5s, FID < 100ms, CLS < 0.1 |

---

## 10. Aksesibilitas (a11y)

- Semua gambar memiliki `alt` text deskriptif
- Contrast ratio minimal 4.5:1 untuk teks
- Focus ring visible pada semua elemen interaktif
- Keyboard navigable (tab order logis)
- ARIA labels pada ikon tombol tanpa teks
- Skip-to-content link di awal halaman
- Semantic HTML: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`

---

## 11. Data Flow (Frontend ↔ Database)

Semua data diambil melalui **Server Components** Next.js langsung dari database via Drizzle ORM (tanpa REST API terpisah untuk halaman publik):

```
[Server Component] → [Drizzle ORM] → [PostgreSQL]
                   ↓
           [Render HTML + Stream ke Client]
```

### Query per Halaman

| Halaman | Query |
|---------|-------|
| Home | `posts` (4 terbaru), `achievements` (featured, 4), `facilities` (featured, 6), `staff` (headmaster, 1), `settings` (semua) |
| Profil | `pages` (slug: visi-misi, sejarah, profil) |
| Berita List | `posts` (paginated, filterable) |
| Berita Detail | `posts` (by slug) + 3 related posts |
| Pendaftaran | `pages` (slug: pendaftaran) |
| Galeri | `galleries` (all) + `media` (per gallery) |
| Fasilitas List | `facilities` (all published, ordered) |
| Fasilitas Detail | `facilities` (by slug) + `facility_photos` |
| Prestasi List | `achievements` (paginated, filterable) |
| Prestasi Detail | `achievements` (by slug) + 3 related |
| Guru List | `staff` (all active, ordered) |
| Guru Detail | `staff` (by slug) + 4 related |
| Kontak | `settings` (alamat, telp, email, socmed) |

---

## 12. Catatan Implementasi

> [!IMPORTANT]
> **Prioritas utama:** Halaman Home harus selesai dan terlihat stunning terlebih dahulu. Home adalah kesan pertama pengunjung.

> [!TIP]
> Gunakan **dummy data** realistis (bukan "Lorem ipsum") saat development. Contoh: nama guru, judul berita, nama fasilitas yang nyata — agar desain terasa hidup.

> [!NOTE]
> Formulir kontak (`/kontak`) membutuhkan **Server Action** Next.js untuk handle POST ke database. Ini satu-satunya halaman publik yang menulis data.

> [!WARNING]
> Jangan hardcode data sekolah (nama, alamat, telepon). Semua ambil dari tabel `settings` agar bisa diubah admin via dashboard.

### Urutan Implementasi yang Disarankan

1. **Setup project** — Next.js, Tailwind, shadcn/ui, font, Framer Motion
2. **Design system** — `globals.css` (color tokens, typography, base styles)
3. **Layout global** — `<Navbar />` + `<Footer />` di root layout
4. **Home page** — Semua 7 section (fokus desain dan animasi di sini)
5. **Shared components** — SectionHeading, Card, Badge, Breadcrumb, dll
6. **Halaman list** — Berita, Fasilitas, Prestasi, Guru
7. **Halaman detail** — Berita/[slug], Fasilitas/[slug], dll
8. **Halaman statis** — Profil, Pendaftaran, Kontak (+ formulir)
9. **Galeri** — Lightbox, album, video embed
10. **Polish** — Animasi, responsif, SEO meta, 404, loading states
