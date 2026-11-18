-- ==============================================================================
-- 📦 SEED DATA: BLOG POSTS BAGIAN 2 (Artikel 6 - 10 dari 25)
-- ==============================================================================
-- File: 03_blog_posts_part2.sql
-- ==============================================================================

-- Artikel #6: Game Edukasi untuk Anak: Belajar Sambil Bermain
INSERT INTO public.blog_posts (
  id, slug, url, title, meta_title, meta_description, excerpt, content,
  author, author_avatar, author_bio, author_link, date, updated_at, status,
  thumbnail, image_full, cover_video, category, tags, labels, keywords,
  read_time, word_count, reading_level, views, likes, shares, rating, total_ratings,
  featured, series, source, language, translations, canonical_url,
  gallery, related_posts
) VALUES (
  '6',
  'game-edukasi-anak',
  '/blog/game-edukasi-anak',
  'Game Edukasi untuk Anak: Belajar Sambil Bermain',
  'Rekomendasi Game Edukasi | Belajar Menyenangkan untuk Anak',
  'Game edukasi dapat meningkatkan minat belajar anak. Temukan rekomendasi game yang mengasah logika, bahasa, dan kreativitas.',
  'Game edukasi menggabungkan unsur fun dan learning. Berikut rekomendasi game yang cocok untuk perkembangan anak usia dini.',
  'Game edukasi adalah solusi menarik untuk membuat anak antusias belajar. Dengan pendekatan bermain, konsep seperti matematika, bahasa, dan sains dapat diserap lebih mudah.

### 1. Game untuk Logika dan Matematika
**DragonBox Numbers** dan **Monster Math** mengajarkan operasi matematika melalui petualangan interaktif yang menyenangkan.

### 2. Game Pengenalan Bahasa
**Duolingo ABC** dan **Endless Alphabet** membantu anak mengenal huruf, kosakata, dan struktur kalimat dengan animasi menarik.

### 3. Game Sains dan Eksplorasi
**Toca Lab** dan **NASA App** memungkinkan anak bereksperimen virtual dengan konsep sains dasar seperti kimia dan astronomi.

### 4. Batasan dan Panduan Orang Tua
Meski bermanfaat, orang tua perlu mengatur durasi bermain dan memilih game sesuai usia. Diskusikan konten game dengan anak untuk memaksimalkan pembelajaran.

### 5. Game Lokal yang Menginspirasi
Developer Indonesia seperti **Educa Studio** menghadirkan game seperti **MarBel** yang mengajarkan budaya dan keterampilan dasar.

Dengan memilih game yang tepat, orang tua dan guru dapat memanfaatkan teknologi untuk menumbuhkan kecintaan belajar sejak dini.',
  'Syaiful Mukmin',
  '/images/authors/syaiful.jpg',
  'Pengajar dan penulis aktif di blog pendidikan dengan fokus pada inovasi metode pembelajaran dan teknologi pendidikan.',
  '/authors/syaiful-mukmin',
  '2025-11-12',
  '2025-11-15',
  'published',
  '/images/blog6.jpg',
  '/images/blog6-large.jpg',
  '',
  'Game',
  '["game edukasi","anak","belajar","permainan","pendidikan"]'::jsonb,
  '[]'::jsonb,
  '["game edukasi","anak","belajar","permainan","pendidikan"]'::jsonb,
  '6 menit',
  1100,
  'mudah',
  2250,
  410,
  120,
  4.8,
  1,
  TRUE,
  'Edukasi Digital',
  'Blog Pendidikan',
  'id',
  '{"en":"educational-games-for-kids"}'::jsonb,
  'https://syaiful-mukmin.netlify.app/blog/game-edukasi-anak',
  '["/images/blog6-1.jpg"]'::jsonb,
  '["peran-guru-era-digital","teknologi-virtual-classroom"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET
  url = EXCLUDED.url,
  title = EXCLUDED.title,
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  author = EXCLUDED.author,
  author_avatar = EXCLUDED.author_avatar,
  author_bio = EXCLUDED.author_bio,
  author_link = EXCLUDED.author_link,
  thumbnail = EXCLUDED.thumbnail,
  image_full = EXCLUDED.image_full,
  cover_video = EXCLUDED.cover_video,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  labels = EXCLUDED.labels,
  keywords = EXCLUDED.keywords,
  read_time = EXCLUDED.read_time,
  word_count = EXCLUDED.word_count,
  reading_level = EXCLUDED.reading_level,
  views = EXCLUDED.views,
  likes = EXCLUDED.likes,
  shares = EXCLUDED.shares,
  rating = EXCLUDED.rating,
  total_ratings = EXCLUDED.total_ratings,
  featured = EXCLUDED.featured,
  series = EXCLUDED.series,
  source = EXCLUDED.source,
  language = EXCLUDED.language,
  translations = EXCLUDED.translations,
  canonical_url = EXCLUDED.canonical_url,
  gallery = EXCLUDED.gallery,
  related_posts = EXCLUDED.related_posts,
  updated_at = NOW();

-- Artikel #7: 5 Strategi Belajar Efektif untuk Siswa
INSERT INTO public.blog_posts (
  id, slug, url, title, meta_title, meta_description, excerpt, content,
  author, author_avatar, author_bio, author_link, date, updated_at, status,
  thumbnail, image_full, cover_video, category, tags, labels, keywords,
  read_time, word_count, reading_level, views, likes, shares, rating, total_ratings,
  featured, series, source, language, translations, canonical_url,
  gallery, related_posts
) VALUES (
  '7',
  'strategi-belajar-efektif',
  '/blog/strategi-belajar-efektif',
  '5 Strategi Belajar Efektif untuk Siswa',
  'Tips Belajar Efektif | Meningkatkan Daya Ingat dan Pemahaman',
  'Belajar bukan sekadar menghafal. Terapkan strategi seperti spaced repetition dan active recall untuk hasil yang optimal.',
  'Belajar efektif membutuhkan metode yang tepat. Simak strategi berdasarkan riset neurosains untuk meningkatkan retensi memori.',
  'Banyak siswa belajar dengan cara yang tidak optimal, seperti sistem kebut semalam. Berikut strategi berbasis riset yang dapat meningkatkan efektivitas belajar.

### 1. Spaced Repetition
Mengulang materi dengan interval waktu yang semakin panjang terbukti meningkatkan retensi memori jangka panjang. Gunakan apps seperti **Anki** untuk menerapkannya.

### 2. Active Recall
Alih-alih membaca ulang, coba tutup buku dan tulis atau ucapkan kembali konsep yang telah dipelajari. Ini melatih otak mengakses informasi secara aktif.

### 3. Interleaving Practice
Campurkan berbagai topik dalam satu sesi belajar (misalnya matematika, lalu bahasa, lalu sains) untuk meningkatkan kemampuan berpikir fleksibel.

### 4. Feynman Technique
Jelaskan konsep yang sulit dengan bahasa sederhana seolah-olah mengajar orang lain. Ini membantu mengidentifikasi celah pemahaman.

### 5. Pengaturan Lingkungan Belajar
Ciptakan ruang belajar bebas gangguan, gunakan teknik Pomodoro (25 menit fokus, 5 menit istirahat), dan pastikan istirahat yang cukup.

Dengan menerapkan strategi ini, proses belajar menjadi lebih efisien, menyenangkan, dan hasilnya lebih tahan lama.',
  'Syaiful Mukmin',
  '/images/authors/syaiful.jpg',
  'Pengajar dan penulis aktif di blog pendidikan dengan fokus pada inovasi metode pembelajaran dan teknologi pendidikan.',
  '/authors/syaiful-mukmin',
  '2025-11-18',
  '2025-11-20',
  'published',
  '/images/blog7.jpg',
  '/images/blog7-large.jpg',
  '',
  'Pendidikan',
  '["belajar","strategi","siswa","pendidikan","motivasi"]'::jsonb,
  '[]'::jsonb,
  '["belajar","strategi","siswa","pendidikan","motivasi"]'::jsonb,
  '7 menit',
  1250,
  'mudah',
  1950,
  380,
  95,
  4.6,
  1,
  FALSE,
  'Tips Belajar',
  'Blog Pendidikan',
  'id',
  '{"en":"effective-learning-strategies"}'::jsonb,
  'https://syaiful-mukmin.netlify.app/blog/strategi-belajar-efektif',
  '[]'::jsonb,
  '["peran-guru-era-digital","game-edukasi-anak"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET
  url = EXCLUDED.url,
  title = EXCLUDED.title,
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  author = EXCLUDED.author,
  author_avatar = EXCLUDED.author_avatar,
  author_bio = EXCLUDED.author_bio,
  author_link = EXCLUDED.author_link,
  thumbnail = EXCLUDED.thumbnail,
  image_full = EXCLUDED.image_full,
  cover_video = EXCLUDED.cover_video,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  labels = EXCLUDED.labels,
  keywords = EXCLUDED.keywords,
  read_time = EXCLUDED.read_time,
  word_count = EXCLUDED.word_count,
  reading_level = EXCLUDED.reading_level,
  views = EXCLUDED.views,
  likes = EXCLUDED.likes,
  shares = EXCLUDED.shares,
  rating = EXCLUDED.rating,
  total_ratings = EXCLUDED.total_ratings,
  featured = EXCLUDED.featured,
  series = EXCLUDED.series,
  source = EXCLUDED.source,
  language = EXCLUDED.language,
  translations = EXCLUDED.translations,
  canonical_url = EXCLUDED.canonical_url,
  gallery = EXCLUDED.gallery,
  related_posts = EXCLUDED.related_posts,
  updated_at = NOW();

-- Artikel #8: Rise of Indonesian Games: Potensi dan Tantangan
INSERT INTO public.blog_posts (
  id, slug, url, title, meta_title, meta_description, excerpt, content,
  author, author_avatar, author_bio, author_link, date, updated_at, status,
  thumbnail, image_full, cover_video, category, tags, labels, keywords,
  read_time, word_count, reading_level, views, likes, shares, rating, total_ratings,
  featured, series, source, language, translations, canonical_url,
  gallery, related_posts
) VALUES (
  '8',
  'game-buatan-indonesia',
  '/blog/game-buatan-indonesia',
  'Rise of Indonesian Games: Potensi dan Tantangan',
  'Game Buatan Indonesia | Potensi Industri Kreatif Lokal',
  'Industri game Indonesia semakin berkembang dengan karya-karya inspiratif. Simak potensi dan tantangan yang dihadapi developer lokal.',
  'Developer game Indonesia mulai mencuri perhatian global dengan karya yang mengangkat budaya lokal. Apa saja tantangannya?',
  'Dalam beberapa tahun terakhir, game buatan Indonesia seperti **DreadOut**, **Coffee Talk**, dan **A Space for the Unbound** berhasil meraih pengakuan internasional.

### 1. Keunikan Cerita dan Budaya
Kekuatan utama game Indonesia adalah narasi yang kuat dan pengintegrasian elemen budaya (misalnya mitologi, suasana kota lokal) yang membedakannya dari produk global.

### 2. Dukungan Komunitas dan Event
Event seperti **Indonesia Game Developer Exchange (IGDX)** dan game jam lokal memfasilitasi kolaborasi dan pembelajaran antar developer.

### 3. Tantangan Pendanaan dan Pasar
Akses pendanaan yang terbatas dan dominasi game asing di pasar Indonesia menjadi hambatan utama. Namun, platform seperti **Steam** dan **Nintendo eShop** membuka peluang ekspor.

### 4. Peran Edukasi Game Development
Lembaga kursus dan kampus mulai menawarkan program game development, mencetak talenta muda yang siap berkontribusi di industri.

### 5. Masa Depan Industri Game Indonesia
Dengan dukungan pemerintah, peningkatan skill developer, dan ekspansi pasar, industri game Indonesia berpotensi menjadi salah satu penopang ekonomi kreatif nasional.

Game Indonesia bukan sekadar produk hiburan, tetapi juga medium untuk bercerita dan melestarikan budaya.',
  'Syaiful Mukmin',
  '/images/authors/syaiful.jpg',
  'Pengajar dan penulis aktif di blog pendidikan dengan fokus pada inovasi metode pembelajaran dan teknologi pendidikan.',
  '/authors/syaiful-mukmin',
  '2025-11-25',
  '2025-11-28',
  'published',
  '/images/blog8.jpg',
  '/images/blog8-large.jpg',
  '',
  'Game',
  '["game Indonesia","developer lokal","industri kreatif","teknologi","game dev"]'::jsonb,
  '[]'::jsonb,
  '["game Indonesia","developer lokal","industri kreatif","teknologi","game dev"]'::jsonb,
  '9 menit',
  1550,
  'menengah',
  2100,
  390,
  110,
  4.8,
  1,
  TRUE,
  'Industri Kreatif',
  'Blog Teknologi & Pendidikan',
  'id',
  '{"en":"indonesian-game-industry"}'::jsonb,
  'https://syaiful-mukmin.netlify.app/blog/game-buatan-indonesia',
  '["/images/blog8-1.jpg","/images/blog8-2.jpg"]'::jsonb,
  '["game-edukasi-anak","teknologi-virtual-classroom"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET
  url = EXCLUDED.url,
  title = EXCLUDED.title,
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  author = EXCLUDED.author,
  author_avatar = EXCLUDED.author_avatar,
  author_bio = EXCLUDED.author_bio,
  author_link = EXCLUDED.author_link,
  thumbnail = EXCLUDED.thumbnail,
  image_full = EXCLUDED.image_full,
  cover_video = EXCLUDED.cover_video,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  labels = EXCLUDED.labels,
  keywords = EXCLUDED.keywords,
  read_time = EXCLUDED.read_time,
  word_count = EXCLUDED.word_count,
  reading_level = EXCLUDED.reading_level,
  views = EXCLUDED.views,
  likes = EXCLUDED.likes,
  shares = EXCLUDED.shares,
  rating = EXCLUDED.rating,
  total_ratings = EXCLUDED.total_ratings,
  featured = EXCLUDED.featured,
  series = EXCLUDED.series,
  source = EXCLUDED.source,
  language = EXCLUDED.language,
  translations = EXCLUDED.translations,
  canonical_url = EXCLUDED.canonical_url,
  gallery = EXCLUDED.gallery,
  related_posts = EXCLUDED.related_posts,
  updated_at = NOW();

-- Artikel #9: Virtual Classroom: Solusi Pembelajaran Jarak Jauh
INSERT INTO public.blog_posts (
  id, slug, url, title, meta_title, meta_description, excerpt, content,
  author, author_avatar, author_bio, author_link, date, updated_at, status,
  thumbnail, image_full, cover_video, category, tags, labels, keywords,
  read_time, word_count, reading_level, views, likes, shares, rating, total_ratings,
  featured, series, source, language, translations, canonical_url,
  gallery, related_posts
) VALUES (
  '9',
  'teknologi-virtual-classroom',
  '/blog/teknologi-virtual-classroom',
  'Virtual Classroom: Solusi Pembelajaran Jarak Jauh',
  'Teknologi Virtual Classroom | Belajar dari Rumah yang Interaktif',
  'Virtual classroom memungkinkan interaksi guru-siswa secara real-time. Pelajari tools dan strategi untuk mengoptimalkan penggunaannya.',
  'Virtual classroom menjadi tren setelah pandemi. Bagaimana memanfaatkannya untuk menciptakan pengalaman belajar yang engaging?',
  'Virtual classroom adalah platform digital yang meniru kelas fisik dengan fitur seperti video conference, papan tulis digital, dan breakout rooms.

### 1. Platform Populer
**Google Meet**, **Zoom**, dan **Microsoft Teams** adalah tools yang umum digunakan. Masing-masing memiliki kelebihan seperti integrasi dengan suite produktivitas.

### 2. Strategi Mengajar yang Interaktif
Gunakan fitur polling, quizes live (misalnya **Kahoot**), dan sesi diskusi dalam kelompok kecil (breakout rooms) untuk menjaga engagement siswa.

### 3. Tantangan dan Solusi
Kendala seperti koneksi internet yang lambat dapat diatasi dengan menyediakan materi offline dan merekam sesi untuk diakses ulang.

### 4. Pelatihan untuk Guru
Guru perlu dilatih untuk menguasai tools dan teknik mengajar virtual, termasuk manajemen kelas online dan penilaian digital.

### 5. Masa Depan Hybrid Learning
Virtual classroom kemungkinan akan tetap digunakan sebagai pendukung pembelajaran hybrid, menggabungkan kelebihan online dan offline.

Dengan persiapan yang matang, virtual classroom dapat menjadi sarana pembelajaran yang efektif dan inklusif.',
  'Syaiful Mukmin',
  '/images/authors/syaiful.jpg',
  'Pengajar dan penulis aktif di blog pendidikan dengan fokus pada inovasi metode pembelajaran dan teknologi pendidikan.',
  '/authors/syaiful-mukmin',
  '2025-12-02',
  '2025-12-05',
  'published',
  '/images/blog9.jpg',
  '/images/blog9-large.jpg',
  '',
  'Pendidikan',
  '["virtual classroom","pembelajaran jarak jauh","teknologi pendidikan","online learning","zoom"]'::jsonb,
  '[]'::jsonb,
  '["virtual classroom","pembelajaran jarak jauh","teknologi pendidikan","online learning","zoom"]'::jsonb,
  '8 menit',
  1400,
  'menengah',
  1780,
  310,
  80,
  4.5,
  1,
  FALSE,
  'Edukasi Digital',
  'Blog Pendidikan',
  'id',
  '{"en":"virtual-classroom-technology"}'::jsonb,
  'https://syaiful-mukmin.netlify.app/blog/teknologi-virtual-classroom',
  '["/images/blog9-1.jpg"]'::jsonb,
  '["peran-guru-era-digital","strategi-belajar-efektif"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET
  url = EXCLUDED.url,
  title = EXCLUDED.title,
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  author = EXCLUDED.author,
  author_avatar = EXCLUDED.author_avatar,
  author_bio = EXCLUDED.author_bio,
  author_link = EXCLUDED.author_link,
  thumbnail = EXCLUDED.thumbnail,
  image_full = EXCLUDED.image_full,
  cover_video = EXCLUDED.cover_video,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  labels = EXCLUDED.labels,
  keywords = EXCLUDED.keywords,
  read_time = EXCLUDED.read_time,
  word_count = EXCLUDED.word_count,
  reading_level = EXCLUDED.reading_level,
  views = EXCLUDED.views,
  likes = EXCLUDED.likes,
  shares = EXCLUDED.shares,
  rating = EXCLUDED.rating,
  total_ratings = EXCLUDED.total_ratings,
  featured = EXCLUDED.featured,
  series = EXCLUDED.series,
  source = EXCLUDED.source,
  language = EXCLUDED.language,
  translations = EXCLUDED.translations,
  canonical_url = EXCLUDED.canonical_url,
  gallery = EXCLUDED.gallery,
  related_posts = EXCLUDED.related_posts,
  updated_at = NOW();

-- Artikel #10: Dampak Game terhadap Kesehatan Mental: Baik atau Buruk?
INSERT INTO public.blog_posts (
  id, slug, url, title, meta_title, meta_description, excerpt, content,
  author, author_avatar, author_bio, author_link, date, updated_at, status,
  thumbnail, image_full, cover_video, category, tags, labels, keywords,
  read_time, word_count, reading_level, views, likes, shares, rating, total_ratings,
  featured, series, source, language, translations, canonical_url,
  gallery, related_posts
) VALUES (
  '10',
  'game-dan-kesehatan-mental',
  '/blog/game-dan-kesehatan-mental',
  'Dampak Game terhadap Kesehatan Mental: Baik atau Buruk?',
  'Game dan Kesehatan Mental | Analisis Dampak Positif & Negatif',
  'Game dapat memberikan manfaat relaksasi, tetapi juga berisiko menyebabkan adiksi. Bagaimana menyeimbangkannya?',
  'Game memiliki dua sisi: sebagai alat relaksasi dan potensi adiksi. Temukan panduan untuk bermain game secara sehat.',
  'Hubungan antara game dan kesehatan mental kompleks. Di satu sisi, game dapat mengurangi stres; di sisi lain, bermain berlebihan bisa memicu masalah.

### 1. Manfaat Positif Game
- **Relaksasi dan Pelarian Sehat**: Game dengan cerita atau visual menenangkan dapat menjadi pelepas stres.
- **Peningkatan Kognitif**: Game strategi seperti puzzle atau RPG dapat melatih problem-solving dan memori.
- **Koneksi Sosial**: Multiplayer game memungkinkan interaksi dengan teman, terutama bagi mereka yang sulit bersosialisasi offline.

### 2. Risiko dan Dampak Negatif
- **Adiksi Game**: Terlalu lama bermain dapat mengganggu produktivitas dan pola tidur.
- **Isolasi Sosial**: Jika tidak seimbang, game dapat mengurangi waktu untuk interaksi dunia nyata.
- **Konten Kekerasan**: Beberapa game mungkin memengaruhi emosi, terutama pada anak-anak.

### 3. Tips Bermain Game Sehat
- Tetapkan batas waktu (misal 1-2 jam/hari).
- Pilih game yang sesuai usia dan nilai edukasinya.
- Selingi dengan aktivitas fisik dan sosial offline.

### 4. Peran Orang Tua dan Guru
Orang tua perlu memahami rating game dan berdiskusi dengan anak tentang konten yang dikonsumsi. Guru dapat mengintegrasikan game edukasi di sekolah.

Game adalah alat netral; dampaknya tergantung pada bagaimana kita menggunakannya. Dengan kesadaran dan kontrol diri, game dapat menjadi hiburan yang bermanfaat.',
  'Syaiful Mukmin',
  '/images/authors/syaiful.jpg',
  'Pengajar dan penulis aktif di blog pendidikan dengan fokus pada inovasi metode pembelajaran dan teknologi pendidikan.',
  '/authors/syaiful-mukmin',
  '2025-12-08',
  '2025-12-12',
  'published',
  '/images/blog10.jpg',
  '/images/blog10-large.jpg',
  '',
  'Game',
  '["game","kesehatan mental","adiksi","relaksasi","psikologi"]'::jsonb,
  '[]'::jsonb,
  '["game","kesehatan mental","adiksi","relaksasi","psikologi"]'::jsonb,
  '10 menit',
  1650,
  'menengah',
  2450,
  420,
  130,
  4.7,
  1,
  TRUE,
  'Game dan Psikologi',
  'Blog Pendidikan & Kesehatan',
  'id',
  '{"en":"games-mental-health-impact"}'::jsonb,
  'https://syaiful-mukmin.netlify.app/blog/game-dan-kesehatan-mental',
  '["/images/blog10-1.jpg","/images/blog10-2.jpg"]'::jsonb,
  '["game-edukasi-anak","game-buatan-indonesia"]'::jsonb
) ON CONFLICT (slug) DO UPDATE SET
  url = EXCLUDED.url,
  title = EXCLUDED.title,
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  author = EXCLUDED.author,
  author_avatar = EXCLUDED.author_avatar,
  author_bio = EXCLUDED.author_bio,
  author_link = EXCLUDED.author_link,
  thumbnail = EXCLUDED.thumbnail,
  image_full = EXCLUDED.image_full,
  cover_video = EXCLUDED.cover_video,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  labels = EXCLUDED.labels,
  keywords = EXCLUDED.keywords,
  read_time = EXCLUDED.read_time,
  word_count = EXCLUDED.word_count,
  reading_level = EXCLUDED.reading_level,
  views = EXCLUDED.views,
  likes = EXCLUDED.likes,
  shares = EXCLUDED.shares,
  rating = EXCLUDED.rating,
  total_ratings = EXCLUDED.total_ratings,
  featured = EXCLUDED.featured,
  series = EXCLUDED.series,
  source = EXCLUDED.source,
  language = EXCLUDED.language,
  translations = EXCLUDED.translations,
  canonical_url = EXCLUDED.canonical_url,
  gallery = EXCLUDED.gallery,
  related_posts = EXCLUDED.related_posts,
  updated_at = NOW();

