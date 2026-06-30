-- =============================================
-- SEED DATA untuk SMP Negeri 17 Denpasar
-- Jalanin: psql -h tepji0kn9cd339vpuypd95nd -U postgres -d schoolweb -f seed.sql
-- =============================================

-- Settings
INSERT INTO settings (key, value) VALUES
  ('schoolName', 'SMP Negeri 17 Denpasar'),
  ('tagline', 'Mencetak Generasi Unggul, Berkarakter, dan Berprestasi'),
  ('address', 'Jl. Nagasari, Penatih, Kec. Denpasar Tim., Kota Denpasar, Bali'),
  ('phone', '(021) 123-4567'),
  ('email', 'info@smpn17denpasar.sch.id'),
  ('jamOperasional', 'Senin - Kamis: 07.00 - 14.00, Jumat: 07.00 - 12.00, Sabtu & Minggu: Libur'),
  ('akreditasi', 'A'),
  ('logo_url', '/images/logo.png'),
  ('favicon_url', '/favicon.ico'),
  ('social_facebook', 'https://facebook.com/smpn17denpasar'),
  ('social_instagram', 'https://instagram.com/smpn17denpasar'),
  ('social_youtube', 'https://youtube.com/@smpn17denpasar'),
  ('social_tiktok', 'https://tiktok.com/@smpn17denpasar'),
  ('googleMapsEmbedUrl', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3944.0!2d115.2433862!3d-8.6120328!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd23f7ed46ca9f9%3A0xbed134b1c5c5efef!2sSMP%20Negeri%2017%20Denpasar!5e0!3m2!1sid!2sid!4v1')
ON CONFLICT (key) DO NOTHING;

-- Posts/Berita
INSERT INTO posts (title, slug, content, excerpt, image_url, category, is_published, published_at) VALUES
('Workshop Implementasi Kurikulum Merdeka', 'workshop-implementasi-kurikulum-merdeka', '<p>Workshop implementasi Kurikulum Merdeka untuk seluruh guru.</p>', 'SMP Negeri 17 Denpasar sukses menggelar workshop Kurikulum Merdeka.', 'https://placehold.co/1200x630/1565C0/FFFFFF?text=Workshop', 'news', true, '2025-06-16 08:00:00'),
('Pengumuman Libur Semester Genap 2024/2025', 'pengumuman-libur-semester-genap-2025', '<p>Jadwal libur semester genap dan pembagian rapor.</p>', 'Informasi jadwal libur semester genap.', 'https://placehold.co/1200x630/0D47A1/FFFFFF?text=Libur+Semester', 'announcement', true, '2025-06-20 10:00:00'),
('Siswa Raih Juara 1 OSN Matematika Nasional', 'siswa-raih-juara-1-osn-matematika-nasional', '<p>Putri Rahmawati meraih Juara 1 OSN Matematika tingkat nasional.</p>', 'Putri Rahmawati meraih Juara 1 OSN Matematika.', 'https://placehold.co/1200x630/F59E0B/FFFFFF?text=Juara+1+OSN', 'news', true, '2025-06-14 14:00:00'),
('Peringatan Hardiknas 2025', 'peringatan-hari-pendidikan-nasional-2025', '<p>Upacara bendera dan rangkaian kegiatan Hardiknas.</p>', 'Peringatan Hari Pendidikan Nasional 2025.', 'https://placehold.co/1200x630/2E7D6F/FFFFFF?text=Hardiknas', 'news', true, '2025-05-02 10:00:00'),
('Pengumuman SPMB 2025/2026', 'pengumuman-spmb-2025-2026', '<p>Pendaftaran SPMB dibuka 1-30 Juni 2025.</p>', 'Informasi SPMB tahun ajaran 2025/2026.', 'https://placehold.co/1200x630/1565C0/FFFFFF?text=SPMB+2025/2026', 'announcement', true, '2025-06-01 07:00:00'),
('Tim Futsal Juara 2 Tingkat Provinsi', 'tim-futsal-juara-2-provinsi', '<p>Tim futsal meraih Juara 2 Kejuaraan Futsal Pelajar Provinsi Bali.</p>', 'Tim futsal SMPN 17 Denpasar juara 2 provinsi.', 'https://placehold.co/1200x630/2E7D6F/FFFFFF?text=Futsal+Juara+2', 'news', true, '2025-05-25 16:00:00')
ON CONFLICT (slug) DO NOTHING;

-- Pages
INSERT INTO pages (title, slug, content) VALUES
('Visi & Misi', 'visi-misi', '<h2>Visi</h2><p>Terwujudnya peserta didik yang unggul.</p><h2>Misi</h2><ol><li>Mewujudkan pembelajaran berkualitas</li><li>Mengembangkan potensi peserta didik</li><li>Menanamkan nilai karakter</li></ol>'),
('Sejarah', 'sejarah', '<h2>Sejarah</h2><p>Berdiri pada 1 Juli 1980.</p>'),
('Kontak', 'kontak', '<h2>Hubungi Kami</h2><p>Silakan hubungi melalui formulir kontak.</p>')
ON CONFLICT (slug) DO NOTHING;

-- Staff / Guru
INSERT INTO staff (name, slug, role, subject, photo_url, bio, sort_order, is_active) VALUES
('Drs. Ahmad Fauzi, M.Pd.', 'ahmad-fauzi', 'headmaster', NULL, 'https://placehold.co/400x400/1565C0/FFFFFF?text=AF', 'Kepala Sekolah', 1, true),
('Sri Wahyuni, S.Pd.', 'sri-wahyuni', 'teacher', 'Matematika', 'https://placehold.co/400x400/2E7D6F/FFFFFF?text=SW', 'Guru Matematika', 2, true),
('Rudi Hartono, S.Pd.', 'rudi-hartono', 'teacher', 'Penjas', 'https://placehold.co/400x400/0D47A1/FFFFFF?text=RH', 'Guru Penjas', 3, true),
('Dewi Kusumawardani, S.Pd., M.Pd.', 'dewi-kusumawardani', 'teacher', 'Bahasa Indonesia', 'https://placehold.co/400x400/1565C0/FFFFFF?text=DK', 'Guru Bahasa Indonesia', 4, true),
('Asep Gunawan, S.Pd.', 'asep-gunawan', 'teacher', 'IPA', 'https://placehold.co/400x400/2E7D6F/FFFFFF?text=AG', 'Guru IPA', 5, true),
('Nurhasanah, S.Pd.', 'nurhasanah', 'teacher', 'Bahasa Inggris', 'https://placehold.co/400x400/F59E0B/FFFFFF?text=NH', 'Guru Bahasa Inggris', 6, true)
ON CONFLICT (slug) DO NOTHING;

-- Achievements/Prestasi
INSERT INTO achievements (title, slug, description, category, level, champion, organizer, date, image_url, is_featured, is_published) VALUES
('Juara 1 OSN Matematika Nasional', 'juara-1-osn-matematika-nasional', 'Putri Rahmawati meraih Juara 1 OSN Matematika.', 'student', 'nasional', '1', 'Kemendikbudristek', '2025-06-14', 'https://placehold.co/800x600/F59E0B/FFFFFF?text=Juara+1+OSN', true, true),
('Juara 2 Futsal Pelajar Provinsi', 'juara-2-futsal-provinsi', 'Tim futsal meraih Juara 2 tingkat Provinsi Bali.', 'student', 'provinsi', '2', 'Dispora Bali', '2025-05-24', 'https://placehold.co/800x600/2E7D6F/FFFFFF?text=Juara+2+Futsal', true, true),
('Guru Berprestasi Provinsi', 'guru-berprestasi-provinsi', 'Guru Berprestasi Tingkat Provinsi Bali.', 'teacher', 'provinsi', '1', 'Dinas Pendidikan Bali', '2025-05-10', 'https://placehold.co/800x600/F59E0B/FFFFFF?text=Guru+Berprestasi', true, true),
('Akreditasi A', 'akreditasi-a-ban-sm', 'Akreditasi A (Unggul) dari BAN-SM.', 'school', 'nasional', '1', 'BAN-SM', '2024-11-15', 'https://placehold.co/800x600/F59E0B/FFFFFF?text=Akreditasi+A', true, true)
ON CONFLICT (slug) DO NOTHING;

-- Facilities
INSERT INTO facilities (name, slug, description, category, photo_url, is_featured, sort_order, is_published) VALUES
('Laboratorium Komputer', 'laboratorium-komputer', 'Lab komputer 40 PC all-in-one.', 'teknologi', 'https://placehold.co/1200x600/1565C0/FFFFFF?text=Lab+Komputer', true, 1, true),
('Perpustakaan Digital', 'perpustakaan-digital', 'Perpustakaan 5.000+ buku.', 'akademik', 'https://placehold.co/1200x600/2E7D6F/FFFFFF?text=Perpustakaan', true, 2, true),
('Lapangan Basket & Futsal', 'lapangan-basket-futsal', 'Lapangan multifungsi standar nasional.', 'olahraga', 'https://placehold.co/1200x600/0D47A1/FFFFFF?text=Lapangan', true, 3, true),
('Laboratorium IPA Terpadu', 'laboratorium-ipa-terpadu', 'Lab IPA peralatan lengkap.', 'akademik', 'https://placehold.co/1200x600/1565C0/FFFFFF?text=Lab+IPA', true, 4, true),
('Masjid Al-Ilmi', 'masjid-al-ilmi', 'Masjid kapasitas 300 jamaah.', 'ibadah', 'https://placehold.co/1200x600/2E7D6F/FFFFFF?text=Masjid', true, 6, true)
ON CONFLICT (slug) DO NOTHING;
