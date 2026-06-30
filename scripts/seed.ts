/**
 * Database seed script.
 *
 * Run with: npx tsx scripts/seed.ts
 * Requires DATABASE_URL in .env
 */


import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "../src/lib/db/schema";
import { scrypt, randomBytes } from "node:crypto";
import { randomUUID } from "crypto";

/**
 * Hash password using scrypt — same algorithm and format as Better Auth.
 * Better Auth stores passwords as `salt:key` where both are hex-encoded.
 * Config: N=16384, r=16, p=1, dkLen=64 (matches @better-auth/utils).
 */
function generateKey(password: string, salt: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(
      password.normalize("NFKC"),
      salt,
      64,
      { N: 16384, r: 16, p: 1, maxmem: 128 * 16384 * 16 * 2 },
      (err, key) => {
        if (err) reject(err);
        else resolve(key);
      },
    );
  });
}

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const key = await generateKey(password, salt);
  return `${salt}:${key.toString("hex")}`;
}

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL is not set. Create a .env file first.");
  process.exit(1);
}

async function main() {
  const client = postgres(databaseUrl as string, { prepare: false });
  const db = drizzle(client, { schema });

  console.log("🌱 Seeding database...\n");

  // ═══════════════════════════════════════════
  // 1. Users (superadmin)
  // ═══════════════════════════════════════════
  console.log("📝 Creating users...");

  const superadminId = randomUUID();
  const passwordHash = await hashPassword("admin123");

  // Check if superadmin already exists
  const existing = await db
    .select()
    .from(schema.users)
    .where(
      (await import("drizzle-orm")).eq(
        schema.users.email,
        "admin@sekolah.sch.id"
      )
    )
    .limit(1);

  if (existing.length === 0) {
    await db.insert(schema.users).values({
      id: superadminId,
      name: "Super Admin",
      email: "admin@sekolah.sch.id",
      emailVerified: true,
      role: "superadmin",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Insert account record for password auth
    await db.insert(schema.accounts).values({
      id: randomUUID(),
      accountId: superadminId,
      providerId: "credential",
      userId: superadminId,
      password: passwordHash,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log("  ✅ superadmin created (admin@sekolah.sch.id / admin123)");
  } else {
    console.log("  ⏭️  superadmin already exists, skipping");
  }

  // ═══════════════════════════════════════════
  // 2. Settings
  // ═══════════════════════════════════════════
  console.log("\n⚙️  Creating settings...");

  const settingsData: Record<string, string> = {
    schoolName: "SMP Negeri 17 Denpasar",
    tagline: "Mencetak Generasi Unggul, Berkarakter, dan Berprestasi",
    address: "Jl. Nagasari, Penatih, Kec. Denpasar Tim., Kota Denpasar, Bali",
    phone: "(021) 123-4567",
    email: "info@smpn17denpasar.sch.id",
    jamOperasional:
      "Senin - Kamis: 07.00 - 14.00, Jumat: 07.00 - 12.00, Sabtu & Minggu: Libur",
    akreditasi: "A",
    logo_url: "/images/logo.png",
    favicon_url: "/favicon.ico",
    social_facebook: "https://facebook.com/smpn17denpasar",
    social_instagram: "https://instagram.com/smpn17denpasar",
    social_youtube: "https://youtube.com/@smpn17denpasar",
    social_tiktok: "https://tiktok.com/@smpn17denpasar",
    googleMapsEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3944.0!2d115.2433862!3d-8.6120328!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd23f7ed46ca9f9%3A0xbed134b1c5c5efef!2sSMP%20Negeri%2017%20Denpasar!5e0!3m2!1sid!2sid!4v1",
  };

  for (const [key, value] of Object.entries(settingsData)) {
    const existingSetting = await db
      .select()
      .from(schema.settings)
      .where(
        (await import("drizzle-orm")).eq(schema.settings.key, key)
      )
      .limit(1);

    if (existingSetting.length === 0) {
      await db.insert(schema.settings).values({ key, value });
    }
  }
  console.log(`  ✅ ${Object.keys(settingsData).length} settings created`);

  // ═══════════════════════════════════════════
  // 3. Pages
  // ═══════════════════════════════════════════
  console.log("\n📄 Creating pages...");

  const pagesData = [
    {
      title: "Visi & Misi",
      slug: "visi-misi",
      content: `<h2>🎯 Visi</h2>
<blockquote>"Terwujudnya peserta didik yang unggul dalam prestasi, berkarakter mulia, berwawasan lingkungan, dan mampu bersaing di era global."</blockquote>

<h2>🚀 Misi</h2>
<ol>
<li><strong>Mewujudkan pembelajaran berkualitas</strong> yang inovatif, kreatif, dan menyenangkan berbasis teknologi informasi dan komunikasi.</li>
<li><strong>Mengembangkan potensi peserta didik</strong> secara optimal melalui kegiatan akademik dan non-akademik yang terprogram.</li>
<li><strong>Menanamkan nilai-nilai karakter</strong> dan budi pekerti luhur melalui pembiasaan, keteladanan, dan budaya sekolah.</li>
<li><strong>Menciptakan lingkungan sekolah</strong> yang bersih, hijau, aman, dan nyaman sebagai sumber belajar.</li>
<li><strong>Meningkatkan kompetensi pendidik</strong> dan tenaga kependidikan secara berkelanjutan melalui pelatihan dan pengembangan profesional.</li>
<li><strong>Membangun kemitraan</strong> dengan orang tua, masyarakat, dan berbagai pemangku kepentingan untuk mendukung kemajuan sekolah.</li>
<li><strong>Mengembangkan budaya literasi</strong> dan numerasi di seluruh warga sekolah.</li>
<li><strong>Membekali peserta didik</strong> dengan keterampilan abad 21: berpikir kritis, kreativitas, kolaborasi, dan komunikasi.</li>
</ol>`,
    },
    {
      title: "Sejarah",
      slug: "sejarah",
      content: `<h2>📜 Sejarah SMP Negeri 17 Denpasar</h2>
<p>SMP Negeri 17 Denpasar berdiri pada tanggal <strong>1 Juli 1980</strong> berdasarkan Surat Keputusan Menteri Pendidikan dan Kebudayaan Republik Indonesia.</p>
<p>Sekolah ini telah melalui 4 periode: Perintisan (1980-1990), Pengembangan (1990-2005), Modernisasi (2005-2020), dan Transformasi Digital (2020-sekarang).</p>
<p>SMP Negeri 17 Denpasar terus berkomitmen untuk menjadi sekolah unggulan yang melahirkan generasi cerdas, berkarakter, dan siap menghadapi tantangan masa depan.</p>`,
    },
    {
      title: "Pendaftaran (PPDB)",
      slug: "pendaftaran",
      content: `<h2>📝 Informasi Pendaftaran Peserta Didik Baru (PPDB)</h2>
<p>SMP Negeri 17 Denpasar membuka pendaftaran siswa baru untuk tahun ajaran 2025/2026.</p>
<p>Pendaftaran melalui jalur Zonasi, Prestasi, Afirmasi, dan Perpindahan Orang Tua.</p>
<p>Informasi lengkap tersedia di portal SPMB Denpasar.</p>`,
    },
    {
      title: "Kontak",
      slug: "kontak",
      content: `<h2>Hubungi Kami</h2>
<p>Silakan hubungi kami melalui formulir kontak atau kunjungi langsung sekolah kami.</p>`,
    },
    {
      title: "Profil",
      slug: "profil",
      content: `<h2>Tentang SMP Negeri 17 Denpasar</h2>
<p>SMP Negeri 17 Denpasar adalah sekolah menengah pertama negeri yang berlokasi di Kota Denpasar, Bali. Kami berkomitmen untuk mencetak generasi unggul, berkarakter, dan berprestasi.</p>`,
    },
  ];

  for (const page of pagesData) {
    const existingPage = await db
      .select()
      .from(schema.pages)
      .where(
        (await import("drizzle-orm")).eq(schema.pages.slug, page.slug)
      )
      .limit(1);

    if (existingPage.length === 0) {
      await db.insert(schema.pages).values({
        ...page,
        updatedAt: new Date(),
      });
    }
  }
  console.log(`  ✅ ${pagesData.length} pages created`);

  // ═══════════════════════════════════════════
  // 4. Posts
  // ═══════════════════════════════════════════
  console.log("\n📰 Creating posts...");

  const postsData = [
    {
      title: "Workshop Implementasi Kurikulum Merdeka untuk Guru Mapel",
      slug: "workshop-implementasi-kurikulum-merdeka",
      content: `<p>SMP Negeri 17 Denpasar sukses menyelenggarakan workshop implementasi Kurikulum Merdeka untuk seluruh guru mata pelajaran pada 15-16 Juni 2025.</p>`,
      excerpt: "SMP Negeri 17 Denpasar sukses menggelar workshop Kurikulum Merdeka selama dua hari dengan narasumber dari Dinas Pendidikan.",
      imageUrl: "https://placehold.co/1200x630/1565C0/FFFFFF?text=Workshop+Kurikulum+Merdeka",
      category: "news",
      isPublished: true,
      publishedAt: new Date("2025-06-16T08:00:00Z"),
    },
    {
      title: "Pengumuman Libur Semester Genap Tahun Ajaran 2024/2025",
      slug: "pengumuman-libur-semester-genap-2025",
      content: `<p>Berdasarkan kalender pendidikan tahun ajaran 2024/2025, berikut jadwal libur semester genap: Pembagian rapor 25 Juni 2025, Libur semester 26 Juni — 14 Juli 2025, Hari pertama masuk 15 Juli 2025.</p>`,
      excerpt: "Informasi lengkap jadwal libur semester genap, pembagian rapor, dan hari pertama masuk semester baru.",
      imageUrl: "https://placehold.co/1200x630/0D47A1/FFFFFF?text=Libur+Semester",
      category: "announcement",
      isPublished: true,
      publishedAt: new Date("2025-06-20T10:00:00Z"),
    },
    {
      title: "Siswa SMPN 17 Denpasar Raih Juara 1 OSN Matematika Tingkat Nasional",
      slug: "siswa-raih-juara-1-osn-matematika-nasional",
      content: `<p>Prestasi membanggakan kembali ditorehkan oleh siswa SMP Negeri 17 Denpasar. Ananda Putri Rahmawati, siswi kelas 9A, berhasil meraih Juara 1 Olimpiade Sains Nasional (OSN) bidang Matematika tingkat nasional.</p>`,
      excerpt: "Putri Rahmawati, siswi kelas 9A, berhasil meraih Juara 1 OSN Matematika mengungguli 150 peserta dari seluruh Indonesia.",
      imageUrl: "https://placehold.co/1200x630/F59E0B/FFFFFF?text=Juara+1+OSN+Matematika",
      category: "news",
      isPublished: true,
      publishedAt: new Date("2025-06-14T14:00:00Z"),
    },
    {
      title: "Peringatan Hari Pendidikan Nasional 2025",
      slug: "peringatan-hari-pendidikan-nasional-2025",
      excerpt: "SMP Negeri 17 Denpasar menggelar upacara bendera dan rangkaian acara edukatif dalam rangka memperingati Hari Pendidikan Nasional 2025.",
      content: `<p>Rangkaian kegiatan meliputi upacara bendera, pameran karya siswa, pentas seni, dan penghargaan siswa berprestasi.</p>`,
      imageUrl: "https://placehold.co/1200x630/2E7D6F/FFFFFF?text=Hari+Pendidikan+Nasional",
      category: "news",
      isPublished: true,
      publishedAt: new Date("2025-05-02T10:00:00Z"),
    },
    {
      title: "Pengumuman Penerimaan Siswa Baru (SPMB) Tahun Ajaran 2025/2026",
      slug: "pengumuman-spmb-2025-2026",
      excerpt: "Pendaftaran SPMB SMP Negeri 17 Denpasar dibuka mulai 1 Juni hingga 30 Juni 2025. Simak syarat dan alur pendaftarannya.",
      content: `<p>Pendaftaran dibuka 1 Juni — 30 Juni 2025 melalui jalur Zonasi, Prestasi, Afirmasi, dan Perpindahan Orang Tua.</p>`,
      imageUrl: "https://placehold.co/1200x630/1565C0/FFFFFF?text=SPMB+2025/2026",
      category: "announcement",
      isPublished: true,
      publishedAt: new Date("2025-06-01T07:00:00Z"),
    },
    {
      title: "Tim Futsal SMPN 17 Denpasar Juara 2 Tingkat Provinsi",
      slug: "tim-futsal-juara-2-provinsi",
      excerpt: "Tim futsal SMPN 17 Denpasar berhasil membawa pulang gelar Juara 2 setelah pertandingan sengit di Kejuaraan Futsal Pelajar Tingkat Provinsi Bali.",
      content: `<p>Tim futsal SMP Negeri 17 Denpasar berhasil meraih Juara 2 dalam Kejuaraan Futsal Pelajar Tingkat Provinsi Bali.</p>`,
      imageUrl: "https://placehold.co/1200x630/2E7D6F/FFFFFF?text=Juara+2+Futsal+Provinsi",
      category: "news",
      isPublished: true,
      publishedAt: new Date("2025-05-25T16:00:00Z"),
    },
    {
      title: "Kegiatan Pesantren Kilat Ramadhan 1446 H",
      slug: "kegiatan-pesantren-kilat-ramadhan-1446h",
      excerpt: "Selama bulan Ramadhan, SMPN 17 Denpasar menyelenggarakan pesantren kilat untuk memperdalam ilmu agama dan membentuk karakter islami siswa.",
      content: `<p>Kegiatan berlangsung selama 5 hari dengan berbagai materi keislaman, tadarus Al-Quran, dan buka puasa bersama.</p>`,
      imageUrl: "https://placehold.co/1200x630/1565C0/FFFFFF?text=Pesantren+Kilat",
      category: "news",
      isPublished: true,
      publishedAt: new Date("2025-03-20T09:00:00Z"),
    },
    {
      title: "Ujian Akhir Semester Genap 2024/2025",
      slug: "ujian-akhir-semester-genap-2025",
      excerpt: "Informasi jadwal dan ketentuan Ujian Akhir Semester (UAS) Genap Tahun Ajaran 2024/2025 bagi seluruh siswa.",
      content: `<p>UAS Genap akan diselenggarakan pada 9-18 Juni 2025.</p>`,
      imageUrl: "https://placehold.co/1200x630/0D47A1/FFFFFF?text=UAS+Genap+2025",
      category: "announcement",
      isPublished: true,
      publishedAt: new Date("2025-06-05T08:00:00Z"),
    },
    {
      title: "Kunjungan Studi Banding SMPN 2 Bandung",
      slug: "kunjungan-studi-banding-smpn-2-bandung",
      excerpt: "SMPN 17 Denpasar menerima kunjungan studi banding dari SMPN 2 Bandung dalam rangka berbagi praktik baik pengelolaan sekolah.",
      content: `<p>Kunjungan ini bertujuan untuk saling berbagi praktik baik dalam implementasi Kurikulum Merdeka dan program literasi.</p>`,
      imageUrl: "https://placehold.co/1200x630/F59E0B/FFFFFF?text=Studi+Banding",
      category: "news",
      isPublished: true,
      publishedAt: new Date("2025-04-12T12:00:00Z"),
    },
  ];

  for (const post of postsData) {
    const existingPost = await db
      .select()
      .from(schema.posts)
      .where(
        (await import("drizzle-orm")).eq(schema.posts.slug, post.slug)
      )
      .limit(1);

    if (existingPost.length === 0) {
      await db.insert(schema.posts).values(post as typeof schema.posts.$inferInsert);
    }
  }
  console.log(`  ✅ ${postsData.length} posts created`);

  // ═══════════════════════════════════════════
  // 5. Staff
  // ═══════════════════════════════════════════
  console.log("\n👨‍🏫 Creating staff...");

  const staffData = [
    { name: "Drs. Ahmad Fauzi, M.Pd.", slug: "ahmad-fauzi", role: "headmaster", subject: null, photoUrl: "https://placehold.co/400x400/1565C0/FFFFFF?text=AF", education: "S1 Pendidikan Matematika, Universitas Negeri Jakarta (1998)\nS2 Manajemen Pendidikan, Universitas Pendidikan Indonesia (2010)", bio: "Drs. Ahmad Fauzi, M.Pd. telah mengabdi di dunia pendidikan selama lebih dari 25 tahun. Sebelum menjabat sebagai Kepala SMP Negeri 17 Denpasar pada tahun 2020, beliau pernah menjadi guru Matematika dan Wakil Kepala Sekolah bidang Kurikulum.", email: "ahmad.fauzi@smpn17denpasar.sch.id", phone: "0812-3456-7801", sortOrder: 1, isActive: true },
    { name: "Sri Wahyuni, S.Pd.", slug: "sri-wahyuni", role: "teacher", subject: "Matematika", photoUrl: "https://placehold.co/400x400/2E7D6F/FFFFFF?text=SW", education: "S1 Pendidikan Matematika, Universitas Negeri Yogyakarta (2005)", bio: "Sri Wahyuni, S.Pd. adalah guru Matematika yang telah mengajar di SMP Negeri 17 Denpasar sejak tahun 2008. Beliau dikenal sebagai pembimbing OSN Matematika yang sukses.", email: "sri.wahyuni@smpn17denpasar.sch.id", phone: "0812-3456-7802", sortOrder: 2, isActive: true },
    { name: "Rudi Hartono, S.Pd.", slug: "rudi-hartono", role: "teacher", subject: "Pendidikan Jasmani", photoUrl: "https://placehold.co/400x400/0D47A1/FFFFFF?text=RH", education: "S1 Pendidikan Jasmani dan Kesehatan, Universitas Negeri Jakarta (2006)", bio: "Rudi Hartono, S.Pd. adalah guru Pendidikan Jasmani yang energik. Selain mengajar, beliau juga melatih tim futsal dan basket sekolah.", email: "rudi.hartono@smpn17denpasar.sch.id", phone: "0812-3456-7803", sortOrder: 3, isActive: true },
    { name: "Dewi Kusumawardani, S.Pd., M.Pd.", slug: "dewi-kusumawardani", role: "teacher", subject: "Bahasa Indonesia", photoUrl: "https://placehold.co/400x400/1565C0/FFFFFF?text=DK", education: "S1 Pendidikan Bahasa dan Sastra Indonesia, Universitas Padjadjaran (2007)\nS2 Pendidikan Bahasa, Universitas Negeri Jakarta (2015)", bio: "Dewi Kusumawardani, S.Pd., M.Pd. adalah guru Bahasa Indonesia yang juga menjabat sebagai Wakil Kepala Sekolah Bidang Kurikulum.", email: "dewi.kusumawardani@smpn17denpasar.sch.id", phone: "0812-3456-7804", sortOrder: 4, isActive: true },
    { name: "Asep Gunawan, S.Pd.", slug: "asep-gunawan", role: "teacher", subject: "IPA - Biologi", photoUrl: "https://placehold.co/400x400/2E7D6F/FFFFFF?text=AG", education: "S1 Pendidikan Biologi, Universitas Pendidikan Indonesia (2009)", bio: "Asep Gunawan, S.Pd. adalah guru IPA Biologi yang inovatif. Beliau menginisiasi program Green School di sekolah.", email: "asep.gunawan@smpn17denpasar.sch.id", phone: "0812-3456-7805", sortOrder: 5, isActive: true },
    { name: "Nurhasanah, S.Pd.", slug: "nurhasanah", role: "teacher", subject: "Bahasa Inggris", photoUrl: "https://placehold.co/400x400/F59E0B/FFFFFF?text=NH", education: "S1 Pendidikan Bahasa Inggris, Universitas Negeri Semarang (2010)", bio: "Nurhasanah, S.Pd. adalah guru Bahasa Inggris yang energik. Beliau rutin menyelenggarakan English Club setiap Selasa.", email: "nurhasanah@smpn17denpasar.sch.id", phone: "0812-3456-7806", sortOrder: 6, isActive: true },
    { name: "Hendra Setiawan, S.Kom.", slug: "hendra-setiawan", role: "teacher", subject: "Informatika / TIK", photoUrl: "https://placehold.co/400x400/0D47A1/FFFFFF?text=HS", education: "S1 Ilmu Komputer, Universitas Gunadarma (2012)", bio: "Hendra Setiawan, S.Kom. adalah guru Informatika yang kreatif. Beliau mengelola laboratorium komputer dan klub robotik.", email: "hendra.setiawan@smpn17denpasar.sch.id", phone: "0812-3456-7807", sortOrder: 7, isActive: true },
    { name: "Ratna Dewi, S.Pd.", slug: "ratna-dewi", role: "teacher", subject: "IPS", photoUrl: "https://placehold.co/400x400/1565C0/FFFFFF?text=RD", education: "S1 Pendidikan Geografi, Universitas Negeri Makassar (2011)", bio: "Ratna Dewi, S.Pd. adalah guru IPS yang mengembangkan metode pembelajaran berbasis proyek.", email: "ratna.dewi@smpn17denpasar.sch.id", phone: "0812-3456-7808", sortOrder: 8, isActive: true },
    { name: "Drs. Slamet Riyadi", slug: "slamet-riyadi", role: "teacher", subject: "Pendidikan Agama Islam", photoUrl: "https://placehold.co/400x400/2E7D6F/FFFFFF?text=SR", education: "S1 Pendidikan Agama Islam, IAIN Syarif Hidayatullah (1999)", bio: "Drs. Slamet Riyadi adalah guru PAI yang juga menjabat sebagai Wakil Kepala Sekolah Bidang Kesiswaan.", email: "slamet.riyadi@smpn17denpasar.sch.id", phone: "0812-3456-7809", sortOrder: 9, isActive: true },
    { name: "Fitriani, S.E.", slug: "fitriani", role: "staff", subject: null, photoUrl: "https://placehold.co/400x400/F59E0B/FFFFFF?text=FT", education: "S1 Akuntansi, Universitas Widyatama (2013)", bio: "Fitriani, S.E. adalah staf tata usaha yang bertanggung jawab atas administrasi keuangan sekolah.", email: "fitriani@smpn17denpasar.sch.id", phone: "0812-3456-7810", sortOrder: 10, isActive: true },
    { name: "Bambang Supriyanto, A.Md.", slug: "bambang-supriyanto", role: "staff", subject: null, photoUrl: "https://placehold.co/400x400/0D47A1/FFFFFF?text=BS", education: "D3 Perpustakaan, Universitas Indonesia (2008)", bio: "Bambang Supriyanto, A.Md. adalah pustakawan sekolah dengan koleksi 5.000+ buku dan sistem katalog digital.", email: "bambang.supriyanto@smpn17denpasar.sch.id", phone: "0812-3456-7811", sortOrder: 11, isActive: true },
  ];

  for (const s of staffData) {
    const existing = await db
      .select()
      .from(schema.staff)
      .where(
        (await import("drizzle-orm")).eq(schema.staff.slug, s.slug)
      )
      .limit(1);

    if (existing.length === 0) {
      await db.insert(schema.staff).values(s as typeof schema.staff.$inferInsert);
    }
  }
  console.log(`  ✅ ${staffData.length} staff created`);

  // ═══════════════════════════════════════════
  // 6. Achievements
  // ═══════════════════════════════════════════
  console.log("\n🏆 Creating achievements...");

  const achievementsData = [
    { title: "Juara 1 OSN Matematika Tingkat Nasional", slug: "juara-1-osn-matematika-nasional", description: "Putri Rahmawati meraih Juara 1 OSN Matematika tingkat nasional.", category: "student", level: "nasional", champion: "1", organizer: "Kemendikbudristek", date: "2025-06-14", imageUrl: "https://placehold.co/800x600/F59E0B/FFFFFF?text=Juara+1+OSN", isFeatured: true, isPublished: true },
    { title: "Juara 2 Futsal Pelajar Tingkat Provinsi", slug: "juara-2-futsal-provinsi", description: "Tim futsal meraih Juara 2 Kejuaraan Futsal Pelajar Tingkat Provinsi Bali.", category: "student", level: "provinsi", champion: "2", organizer: "Dispora Bali", date: "2025-05-24", imageUrl: "https://placehold.co/800x600/2E7D6F/FFFFFF?text=Juara+2+Futsal", isFeatured: true, isPublished: true },
    { title: "Juara 3 Debat Bahasa Inggris Tingkat Kabupaten", slug: "juara-3-debat-bahasa-inggris-kabupaten", description: "Tim debat Bahasa Inggris meraih Juara 3 tingkat Kota Denpasar.", category: "student", level: "kabupaten", champion: "3", organizer: "MGMP Bahasa Inggris Denpasar", date: "2025-04-28", imageUrl: "https://placehold.co/800x600/1565C0/FFFFFF?text=Juara+3+Debat", isFeatured: false, isPublished: true },
    { title: "Guru Berprestasi Tingkat Provinsi", slug: "guru-berprestasi-provinsi", description: "Sri Wahyuni, S.Pd. dinobatkan sebagai Guru Berprestasi Tingkat Provinsi Bali.", category: "teacher", level: "provinsi", champion: "1", organizer: "Dinas Pendidikan Provinsi Bali", date: "2025-05-10", imageUrl: "https://placehold.co/800x600/F59E0B/FFFFFF?text=Guru+Berprestasi", isFeatured: true, isPublished: true },
    { title: "Finalis Lomba Robotik Nasional", slug: "finalis-robotik-nasional", description: "Klub robotik menjadi finalis Lomba Robotik Pelajar Tingkat Nasional.", category: "student", level: "nasional", champion: "peserta", organizer: "Kemendikbudristek", date: "2025-03-15", imageUrl: "https://placehold.co/800x600/0D47A1/FFFFFF?text=Finalis+Robotik", isFeatured: true, isPublished: true },
    { title: "Sekolah Adiwiyata Tingkat Kabupaten", slug: "sekolah-adiwiyata-kabupaten", description: "Menerima penghargaan Sekolah Adiwiyata tingkat Kota Denpasar.", category: "school", level: "kabupaten", champion: "1", organizer: "DLH Kota Denpasar", date: "2025-02-20", imageUrl: "https://placehold.co/800x600/2E7D6F/FFFFFF?text=Sekolah+Adiwiyata", isFeatured: false, isPublished: true },
    { title: "Juara 1 Lomba Cipta Puisi Tingkat Kecamatan", slug: "juara-1-cipta-puisi-kecamatan", description: "Siswa kelas 8B meraih Juara 1 Lomba Cipta Puisi tingkat Kecamatan Denpasar Timur.", category: "student", level: "kecamatan", champion: "1", organizer: "KKG Denpasar Timur", date: "2025-01-18", imageUrl: "", isFeatured: false, isPublished: true },
    { title: "Akreditasi A dari BAN-SM", slug: "akreditasi-a-ban-sm", description: "Berhasil mempertahankan predikat Akreditasi A (Unggul) dari BAN-SM.", category: "school", level: "nasional", champion: "1", organizer: "BAN-SM", date: "2024-11-15", imageUrl: "https://placehold.co/800x600/F59E0B/FFFFFF?text=Akreditasi+A", isFeatured: true, isPublished: true },
    { title: "Juara Harapan Lomba KIR Tingkat Provinsi", slug: "harapan-kir-provinsi", description: "Kelompok KIR meraih Juara Harapan tingkat Provinsi.", category: "student", level: "provinsi", champion: "harapan", organizer: "Dinas Pendidikan Provinsi Bali", date: "2024-10-20", imageUrl: "https://placehold.co/800x600/1565C0/FFFFFF?text=Harapan+KIR", isFeatured: false, isPublished: true },
  ];

  for (const a of achievementsData) {
    const existing = await db
      .select()
      .from(schema.achievements)
      .where(
        (await import("drizzle-orm")).eq(schema.achievements.slug, a.slug)
      )
      .limit(1);

    if (existing.length === 0) {
      await db.insert(schema.achievements).values(a as typeof schema.achievements.$inferInsert);
    }
  }
  console.log(`  ✅ ${achievementsData.length} achievements created`);

  // ═══════════════════════════════════════════
  // 7. Facilities
  // ═══════════════════════════════════════════
  console.log("\n🏫 Creating facilities...");

  const facilitiesData = [
    { name: "Laboratorium Komputer", slug: "laboratorium-komputer", description: "Lab komputer modern dengan 40 unit PC all-in-one, internet fiber optik, dan software pembelajaran terkini.", category: "teknologi", photoUrl: "https://placehold.co/1200x600/1565C0/FFFFFF?text=Lab+Komputer", isFeatured: true, sortOrder: 1 },
    { name: "Perpustakaan Digital", slug: "perpustakaan-digital", description: "Perpustakaan dengan 5.000+ buku dan akses perpustakaan digital nasional.", category: "akademik", photoUrl: "https://placehold.co/1200x600/2E7D6F/FFFFFF?text=Perpustakaan", isFeatured: true, sortOrder: 2 },
    { name: "Lapangan Basket & Futsal", slug: "lapangan-basket-futsal", description: "Lapangan multifungsi standar nasional dengan rumput sintetis dan tribun penonton.", category: "olahraga", photoUrl: "https://placehold.co/1200x600/0D47A1/FFFFFF?text=Lapangan+Olahraga", isFeatured: true, sortOrder: 3 },
    { name: "Laboratorium IPA Terpadu", slug: "laboratorium-ipa-terpadu", description: "Lab IPA dengan peralatan Biologi dan Fisika lengkap, mikroskop digital, dan meja praktikum individual.", category: "akademik", photoUrl: "https://placehold.co/1200x600/1565C0/FFFFFF?text=Lab+IPA", isFeatured: true, sortOrder: 4 },
    { name: "Ruang Seni & Musik", slug: "ruang-seni-musik", description: "Ruang seni dan musik lengkap dengan alat musik tradisional dan modern.", category: "seni", photoUrl: "https://placehold.co/1200x600/F59E0B/FFFFFF?text=Ruang+Seni", isFeatured: false, sortOrder: 5 },
    { name: "Masjid Al-Ilmi", slug: "masjid-al-ilmi", description: "Masjid sekolah bersih dan nyaman dengan kapasitas 300 jamaah.", category: "ibadah", photoUrl: "https://placehold.co/1200x600/2E7D6F/FFFFFF?text=Masjid+Al-Ilmi", isFeatured: true, sortOrder: 6 },
    { name: "Kantin Sehat", slug: "kantin-sehat", description: "Kantin sehat dan higienis dengan menu bervariasi.", category: "lainnya", photoUrl: "https://placehold.co/1200x600/1565C0/FFFFFF?text=Kantin+Sehat", isFeatured: false, sortOrder: 7 },
    { name: "Unit Kesehatan Sekolah (UKS)", slug: "unit-kesehatan-sekolah", description: "UKS dengan tempat tidur, obat-obatan dasar, dan alat P3K lengkap.", category: "lainnya", photoUrl: "https://placehold.co/1200x600/0D47A1/FFFFFF?text=UKS", isFeatured: false, sortOrder: 8 },
  ];

  for (const f of facilitiesData) {
    const existing = await db
      .select()
      .from(schema.facilities)
      .where(
        (await import("drizzle-orm")).eq(schema.facilities.slug, f.slug)
      )
      .limit(1);

    if (existing.length === 0) {
      await db.insert(schema.facilities).values(f as typeof schema.facilities.$inferInsert);
    }
  }
  console.log(`  ✅ ${facilitiesData.length} facilities created`);

  // ═══════════════════════════════════════════
  // 8. Galleries
  // ═══════════════════════════════════════════
  console.log("\n🖼️  Creating galleries...");

  const galleriesData = [
    {
      title: "Workshop Kurikulum Merdeka 2025",
      description: "Dokumentasi kegiatan workshop implementasi Kurikulum Merdeka.",
      type: "photo",
      media: [
        { filename: "workshop-1.jpg", url: "https://placehold.co/1200x800/1565C0/FFFFFF?text=Workshop+1", caption: "Pembukaan workshop", sortOrder: 1 },
        { filename: "workshop-2.jpg", url: "https://placehold.co/1200x800/0D47A1/FFFFFF?text=Workshop+2", caption: "Sesi penyusunan modul ajar", sortOrder: 2 },
        { filename: "workshop-3.jpg", url: "https://placehold.co/1200x800/2E7D6F/FFFFFF?text=Workshop+3", caption: "Presentasi hasil diskusi", sortOrder: 3 },
        { filename: "workshop-4.jpg", url: "https://placehold.co/1200x800/F59E0B/FFFFFF?text=Workshop+4", caption: "Foto bersama peserta", sortOrder: 4 },
      ],
    },
    {
      title: "Peringatan Hari Pendidikan Nasional 2025",
      description: "Rangkaian kegiatan peringatan Hardiknas di SMP Negeri 17 Denpasar.",
      type: "photo",
      media: [
        { filename: "hardiknas-1.jpg", url: "https://placehold.co/1200x800/1565C0/FFFFFF?text=Hardiknas+1", caption: "Upacara bendera", sortOrder: 1 },
        { filename: "hardiknas-2.jpg", url: "https://placehold.co/1200x800/2E7D6F/FFFFFF?text=Hardiknas+2", caption: "Pameran karya siswa", sortOrder: 2 },
        { filename: "hardiknas-3.jpg", url: "https://placehold.co/1200x800/F59E0B/FFFFFF?text=Hardiknas+3", caption: "Pentas seni", sortOrder: 3 },
        { filename: "hardiknas-4.jpg", url: "https://placehold.co/1200x800/0D47A1/FFFFFF?text=Hardiknas+4", caption: "Penghargaan siswa", sortOrder: 4 },
      ],
    },
    {
      title: "Turnamen Futsal Antar Kelas 2025",
      description: "Keseruan turnamen futsal antar kelas.",
      type: "photo",
      media: [
        { filename: "futsal-1.jpg", url: "https://placehold.co/1200x800/0D47A1/FFFFFF?text=Futsal+1", caption: "Pertandingan pembuka", sortOrder: 1 },
        { filename: "futsal-2.jpg", url: "https://placehold.co/1200x800/1565C0/FFFFFF?text=Futsal+2", caption: "Aksi pemain", sortOrder: 2 },
        { filename: "futsal-3.jpg", url: "https://placehold.co/1200x800/2E7D6F/FFFFFF?text=Futsal+3", caption: "Penyerahan piala", sortOrder: 3 },
      ],
    },
    {
      title: "Video Profil Sekolah",
      description: "Video profil resmi SMP Negeri 17 Denpasar.",
      type: "video",
      media: [
        { filename: "", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", caption: "Video Profil SMP Negeri 17 Denpasar", sortOrder: 1 },
      ],
    },
    {
      title: "Dokumentasi Kegiatan Ekstrakurikuler",
      description: "Video kegiatan ekstrakurikuler: pramuka, paskibra, tari, dan marching band.",
      type: "video",
      media: [
        { filename: "", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", caption: "Tari Tradisional", sortOrder: 1 },
        { filename: "", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", caption: "Latihan Pramuka", sortOrder: 2 },
      ],
    },
  ];

  for (const g of galleriesData) {
    const existing = await db
      .select()
      .from(schema.galleries)
      .where(
        (await import("drizzle-orm")).eq(schema.galleries.title, g.title)
      )
      .limit(1);

    if (existing.length === 0) {
      const { media: mediaItems, ...galleryData } = g;
      const inserted = await db
        .insert(schema.galleries)
        .values(galleryData)
        .returning({ id: schema.galleries.id });

      if (inserted[0] && mediaItems.length > 0) {
        for (const m of mediaItems) {
          await db.insert(schema.media).values({
            galleryId: inserted[0].id,
            ...m,
          });
        }
      }
    }
  }
  console.log(`  ✅ ${galleriesData.length} galleries created`);

  // ═══════════════════════════════════════════
  // Done
  // ═══════════════════════════════════════════
  console.log("\n🎉 Database seeded successfully!");
  console.log("   Login: admin@sekolah.sch.id / admin123\n");

  await client.end();
}

main().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
