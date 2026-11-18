# 🚀 Supabase Database Schema & Seed untuk Blog System (my-porto)

Dokumentasi dan panduan eksekusi file SQL untuk seluruh sistem blog portofolio.
Semua data artikel blog, metrik (views, likes, shares, ratings), bookmark, dan komentar telah dimigrasikan secara rapi dan modular ke dalam folder ini.

---

## 📁 Struktur File SQL

Folder ini dibagi menjadi beberapa file terpisah agar mudah dieksekusi di **Supabase SQL Editor** tanpa risiko query timeout atau payload limit:

| File | Keterangan |
|------|------------|
| `01_blog_schema_and_functions.sql` | Definisi tabel (`blog_posts`, `blog_comments`, `blog_likes`, `blog_bookmarks`, `blog_ratings`), indexing, fungsi RPC atomik, konfigurasi Realtime, dan Row Level Security (RLS). |
| `02_blog_posts_part1.sql` | Data artikel #1 s/d #5 (Tips Fotografi, Proyek Digital, UI/UX, Branding Media Sosial, Guru Era Digital). |
| `03_blog_posts_part2.sql` | Data artikel #6 s/d #10 (Game Edukasi Anak, Strategi Belajar, Game Indonesia, Virtual Classroom, Game & Mental). |
| `04_blog_posts_part3.sql` | Data artikel #11 s/d #15 (Kreativitas Guru, Esports, Pendidikan Karakter, Game-Based Learning, Revolusi Pendidikan). |
| `05_blog_posts_part4.sql` | Data artikel #16 s/d #20 (Psikologi Game, Profesi Guru Masa Depan, Game Dev Edukasi, Kurikulum Abad 21, Etika Teknologi). |
| `06_blog_posts_part5.sql` | Data artikel #21 s/d #25 (Neurosains Game, Inklusivitas, Game & Kreativitas, Assessment Abad 21, Filosofi Pendidikan). |
| `07_blog_comments.sql` | Seed data untuk seluruh komentar artikel (43 komentar awal) dengan key idempotency (`ON CONFLICT`). |
| `08_blog_posts_pagelaran_seni.sql` | Data artikel #26 s/d #35 (10 Artikel Seri Pagelaran Seni 2024 UIN Antasari Angkatan 22: Teater & Dramaturgi, Koreografi Tari Kolosal, Manajemen Event Kampus, Komposisi Musik & Vokal, Dokumentasi Visual & Fotografi Panggung, Dampak Sosial & Pembentukan Karakter, Tata Panggung & Dekorasi Artistik, Busana & Tata Rias Tradisi Banjar, Strategi Promosi & Media Sosial, serta Suara Pemain & Refleksi Batin Aktor). Lengkap dengan integrasi video teaser/rekaman, foto inline di markdown, dan gallery album. |

---

## 🛠️ Langkah-langkah Menjalankan di Supabase

1. Buka dashboard proyek Anda di [https://supabase.com](https://supabase.com)
2. Masuk ke menu **SQL Editor** di bilah kiri.
3. Klik tombol **New Query**.
4. Eksekusi file secara berurutan:
   - **Langkah 1**: Salin isi `01_blog_schema_and_functions.sql` lalu klik **Run**. Pastikan tabel, indeks, RPC functions, dan RLS berhasil dibuat.
   - **Langkah 2**: Salin dan jalankan berurutan:
     - `02_blog_posts_part1.sql` -> Klik **Run**
     - `03_blog_posts_part2.sql` -> Klik **Run**
     - `04_blog_posts_part3.sql` -> Klik **Run**
     - `05_blog_posts_part4.sql` -> Klik **Run**
     - `06_blog_posts_part5.sql` -> Klik **Run**
     - `08_blog_posts_pagelaran_seni.sql` -> Klik **Run** (10 Artikel Lengkap Pagelaran Seni 2024 beserta integrasi foto & video)
   - **Langkah 3**: Salin isi `07_blog_comments.sql` lalu klik **Run** untuk memasukkan komentar awal.

---

## ⚡ Fitur Dinamis yang Disediakan

1. **Atomic RPC Functions**:
   - `increment_blog_views(target_slug)`: Menambah jumlah pembaca tanpa race condition.
   - `increment_blog_likes(target_slug)`: Menambah suka.
   - `decrement_blog_likes(target_slug)`: Mengurangi suka saat user membatalkan suka.
   - `increment_blog_shares(target_slug)`: Menambah statistik share saat link artikel disalin/dibagikan.
   - `submit_blog_rating(target_slug, user_device_id, score)`: Mengkalkulasi rata-rata rating (1-5) dan total penilai secara dinamis.

2. **Dukungan Anonim & Terautentikasi**:
   - Pengunjung tanpa login tetap dapat memberi like, menyimpan bookmark, memberi rating, dan berkomentar dengan identifikasi perangkat (`device_id`).
   - Komentar baru langsung tersimpan ke Supabase & disinkronkan ke UI via Supabase Realtime.

3. **Fallback Offline Penuh**:
   - Seluruh fungsi frontend tetap berjalan dinamis di browser (menggunakan `localStorage` dan `data.json` lokal) jika koneksi Supabase terputus.
