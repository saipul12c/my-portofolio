-- ==============================================================================
-- 📦 SEED DATA: BLOG POSTS BAGIAN 1 (Artikel 1 - 5 dari 25)
-- ==============================================================================
-- File: 02_blog_posts_part1.sql
-- ==============================================================================

-- Artikel #1: Tips Fotografi untuk Pemula: Panduan Lengkap dari Nol
INSERT INTO public.blog_posts (
  id, slug, url, title, meta_title, meta_description, excerpt, content,
  author, author_avatar, author_bio, author_link, date, updated_at, status,
  thumbnail, image_full, cover_video, category, tags, labels, keywords,
  read_time, word_count, reading_level, views, likes, shares, rating, total_ratings,
  featured, series, source, language, translations, canonical_url,
  gallery, related_posts
) VALUES (
  '1',
  'tips-fotografi-pemula',
  '/blog/tips-fotografi-pemula',
  'Tips Fotografi untuk Pemula: Panduan Lengkap dari Nol',
  'Panduan Fotografi Pemula | Belajar Kamera dari Nol',
  'Pelajari dasar-dasar fotografi mulai dari pengaturan kamera, komposisi, dan pencahayaan agar hasil jepretanmu tampak profesional.',
  'Pelajari dasar-dasar fotografi mulai dari pengaturan kamera, komposisi, hingga pencahayaan untuk menghasilkan foto profesional.',
  'Fotografi bukan hanya tentang menekan tombol shutter — tetapi seni menangkap cahaya dan momen dengan makna. Untuk menghasilkan foto yang menarik, kamu perlu memahami tiga pilar utama fotografi: **aperture**, **shutter speed**, dan **ISO**, yang disebut juga sebagai *exposure triangle*.

### 1. Aperture (Bukaan Lensa)
Aperture menentukan seberapa banyak cahaya yang masuk ke sensor kamera. Semakin kecil angka f/ (misalnya f/1.8), semakin besar bukaan dan semakin kabur latar belakang (efek bokeh). Gunakan aperture besar untuk foto potret, dan aperture kecil (f/8 ke atas) untuk foto landscape agar semuanya tampak tajam.

### 2. Shutter Speed (Kecepatan Rana)
Shutter speed mengatur berapa lama sensor kamera terbuka untuk menangkap cahaya. Semakin cepat (1/1000 detik), semakin beku gerakan objek. Gunakan kecepatan tinggi untuk olahraga dan hewan, atau kecepatan lambat untuk foto malam atau efek gerak (*motion blur*).

### 3. ISO (Sensitivitas Sensor)
ISO mengatur sensitivitas kamera terhadap cahaya. Nilai ISO rendah (100–400) cocok untuk kondisi terang, sementara ISO tinggi (1600 ke atas) membantu di tempat gelap, meski dapat menimbulkan noise. Kuncinya: gunakan ISO serendah mungkin dengan hasil tetap terang.

### 4. Komposisi dan Perspektif
Selain pengaturan teknis, komposisi menentukan seberapa kuat pesan visual foto. Gunakan prinsip *Rule of Thirds* untuk menempatkan subjek di titik kuat visual. Bereksperimenlah dengan *leading lines*, *symmetry*, dan *negative space* untuk menambah kedalaman dan keseimbangan.

### 5. Pencahayaan dan Waktu Pemotretan
Cahaya adalah elemen paling penting. Gunakan *golden hour* (sekitar pukul 6 pagi atau 5 sore) untuk cahaya hangat alami. Hindari sinar tengah hari yang terlalu keras. Jika perlu, gunakan reflektor atau lampu tambahan untuk hasil yang lebih lembut.

### 6. Latihan dan Evaluasi
Fotografi adalah proses tanpa akhir. Cobalah berbagai mode kamera — *Manual*, *Aperture Priority*, dan *Shutter Priority* — untuk memahami efeknya. Analisis hasil jepretanmu, pelajari kesalahan, dan terus eksplorasi.

### Kesimpulan
Dengan memahami dasar-dasar ini, kamu tidak hanya mengambil foto, tapi juga menciptakan karya visual yang bercerita dan menggugah emosi.',
  'Raka Pratama',
  '/images/authors/raka.jpg',
  'Fotografer freelance dan pengajar fotografi dasar di komunitas seni visual Jakarta.',
  '/authors/raka-pratama',
  '2025-10-10',
  '2025-10-15',
  'published',
  '/images/blog1.jpg',
  '/images/blog1-large.jpg',
  '',
  'Fotografi',
  '["fotografi","kamera","pemula","tutorial","exposure"]'::jsonb,
  '[]'::jsonb,
  '["fotografi","kamera","pemula","tutorial","exposure"]'::jsonb,
  '7 menit',
  1275,
  'mudah',
  1568,
  345,
  94,
  4.8,
  1,
  TRUE,
  'Fotografi Dasar',
  'Blog Pribadi',
  'id',
  '{"en":"beginner-photography-tips"}'::jsonb,
  'https://syaiful-mukmin.netlify.app/blog/tips-fotografi-pemula',
  '["/images/blog1-1.jpg","/images/blog1-2.jpg"]'::jsonb,
  '["mengenal-ui-ux-design","strategi-branding-di-media-sosial"]'::jsonb
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

-- Artikel #2: Cara Efektif Mengelola Proyek Digital di Era Modern
INSERT INTO public.blog_posts (
  id, slug, url, title, meta_title, meta_description, excerpt, content,
  author, author_avatar, author_bio, author_link, date, updated_at, status,
  thumbnail, image_full, cover_video, category, tags, labels, keywords,
  read_time, word_count, reading_level, views, likes, shares, rating, total_ratings,
  featured, series, source, language, translations, canonical_url,
  gallery, related_posts
) VALUES (
  '2',
  'cara-mengelola-proyek-digital',
  '/blog/cara-mengelola-proyek-digital',
  'Cara Efektif Mengelola Proyek Digital di Era Modern',
  'Manajemen Proyek Digital Efektif | Strategi Kolaborasi Modern',
  'Pelajari cara mengelola proyek digital secara efisien dengan tools kolaboratif, komunikasi efektif, dan perencanaan yang adaptif.',
  'Manajemen proyek digital membutuhkan komunikasi efektif, kolaborasi lintas tim, dan pemanfaatan tools modern untuk hasil maksimal.',
  'Dalam dunia kerja modern, proyek digital menuntut adaptabilitas tinggi dan kolaborasi lintas disiplin. Mengelola proyek secara efektif berarti menggabungkan teknologi, strategi, dan kepemimpinan.

### 1. Tetapkan Tujuan dan Ruang Lingkup yang Jelas
Setiap proyek harus dimulai dengan definisi yang jelas tentang hasil akhir, batas waktu, dan tanggung jawab tim. Dokumen *scope of work* membantu semua pihak memiliki persepsi yang sama.

### 2. Gunakan Tools Kolaboratif
Manfaatkan alat seperti **Notion**, **Trello**, atau **Asana** untuk mengatur tugas dan komunikasi. Integrasikan dengan Slack atau Google Workspace agar koordinasi lintas tim berjalan lancar.

### 3. Terapkan Metode Agile atau Scrum
Gunakan *sprint planning* dan *daily stand-up* untuk menjaga ritme kerja. Dengan metode ini, tim bisa menyesuaikan prioritas dan merespons perubahan dengan cepat.

### 4. Komunikasi Transparan dan Rutin
Pertemuan mingguan atau laporan kemajuan digital membantu menjaga kejelasan progres. Gunakan dashboard untuk menampilkan status proyek secara visual.

### 5. Evaluasi dan Retrospektif
Setelah proyek selesai, lakukan evaluasi untuk mengidentifikasi keberhasilan dan area perbaikan. Dokumentasikan pembelajaran agar bisa diterapkan di proyek berikutnya.

Dengan pendekatan yang disiplin dan alat yang tepat, manajemen proyek digital dapat berjalan efisien, transparan, dan menghasilkan dampak nyata bagi tim maupun klien.',
  'Tim Kreatif',
  '/images/authors/team.jpg',
  'Tim kreatif dari StudioTech yang berfokus pada pengembangan produk digital dan strategi manajemen proyek inovatif.',
  '/authors/tim-kreatif',
  '2025-09-28',
  '2025-10-15',
  'published',
  '/images/blog2.jpg',
  '/images/blog2-large.jpg',
  NULL,
  'Manajemen Proyek',
  '["manajemen","digital","kolaborasi","tim","produktivitas"]'::jsonb,
  '[]'::jsonb,
  '["manajemen","proyek","digital","kolaborasi","tim"]'::jsonb,
  '6 menit',
  1180,
  'menengah',
  2185,
  421,
  102,
  4.7,
  1,
  FALSE,
  'Digital Productivity',
  'StudioTech Blog',
  'id',
  '{"en":"managing-digital-projects"}'::jsonb,
  'https://syaiful-mukmin.netlify.app/blog/cara-mengelola-proyek-digital',
  '["/images/blog2-1.jpg"]'::jsonb,
  '["strategi-branding-di-media-sosial"]'::jsonb
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

-- Artikel #3: Mengenal UI/UX Design: Kunci Sukses Produk Digital
INSERT INTO public.blog_posts (
  id, slug, url, title, meta_title, meta_description, excerpt, content,
  author, author_avatar, author_bio, author_link, date, updated_at, status,
  thumbnail, image_full, cover_video, category, tags, labels, keywords,
  read_time, word_count, reading_level, views, likes, shares, rating, total_ratings,
  featured, series, source, language, translations, canonical_url,
  gallery, related_posts
) VALUES (
  '3',
  'mengenal-ui-ux-design',
  '/blog/mengenal-ui-ux-design',
  'Mengenal UI/UX Design: Kunci Sukses Produk Digital',
  'Pengenalan UI/UX Design | Membangun Pengalaman Pengguna',
  'UI/UX design berperan penting dalam kesuksesan produk digital. Pelajari riset pengguna, wireframe, prototipe, dan pengujian desain.',
  'UI/UX design bukan sekadar tampilan, melainkan keseluruhan pengalaman pengguna. Pelajari konsep, riset, dan pengujian desain produk digital.',
  'UI (User Interface) dan UX (User Experience) adalah dua elemen utama dalam membangun produk digital yang sukses. UI berfokus pada tampilan visual dan interaksi, sementara UX memastikan pengguna merasa nyaman dan tujuan mereka tercapai.

### 1. Riset Pengguna (User Research)
Langkah pertama dalam UX adalah memahami kebutuhan dan perilaku pengguna. Gunakan survei, wawancara, atau observasi untuk mengetahui masalah nyata yang mereka hadapi.

### 2. Pembuatan Wireframe dan Prototipe
Gunakan tools seperti **Figma** atau **Adobe XD** untuk membuat struktur halaman (wireframe) dan simulasi interaksi (prototipe). Tahapan ini membantu tim memahami alur sebelum desain final.

### 3. Uji Desain dengan Pengguna
Lakukan *usability testing* untuk melihat apakah pengguna dapat menyelesaikan tugas tanpa kebingungan. Kumpulkan umpan balik dan iterasi desain hingga optimal.

### 4. Kolaborasi Lintas Tim
Desainer, developer, dan product manager harus bekerja selaras agar hasil akhir sesuai kebutuhan bisnis dan pengguna.

### Kesimpulan
Desain UI/UX bukan hanya soal estetika, tapi tentang menciptakan pengalaman yang menyenangkan, efisien, dan bermakna bagi pengguna.',
  'Nadia Kurnia',
  '/images/authors/nadia.jpg',
  'UI/UX Designer berpengalaman dengan 5 tahun di bidang riset pengguna dan desain produk digital.',
  '/authors/nadia-kurnia',
  '2025-08-15',
  '2025-08-20',
  'published',
  '/images/blog3.jpg',
  '/images/blog3-large.jpg',
  NULL,
  'Desain Digital',
  '["UI","UX","rancang antarmuka","pengalaman pengguna","prototipe"]'::jsonb,
  '[]'::jsonb,
  '["UI","UX","desain","pengalaman pengguna","prototipe"]'::jsonb,
  '8 menit',
  1390,
  'menengah',
  1940,
  312,
  74,
  4.7,
  1,
  FALSE,
  'Desain Produk Digital',
  'Digital Studio Magazine',
  'id',
  '{"en":"understanding-ui-ux-design"}'::jsonb,
  'https://syaiful-mukmin.netlify.app/blog/mengenal-ui-ux-design',
  '["/images/blog3-1.jpg","/images/blog3-2.jpg"]'::jsonb,
  '["cara-mengelola-proyek-digital"]'::jsonb
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

-- Artikel #4: Strategi Branding di Media Sosial untuk Meningkatkan Engagement
INSERT INTO public.blog_posts (
  id, slug, url, title, meta_title, meta_description, excerpt, content,
  author, author_avatar, author_bio, author_link, date, updated_at, status,
  thumbnail, image_full, cover_video, category, tags, labels, keywords,
  read_time, word_count, reading_level, views, likes, shares, rating, total_ratings,
  featured, series, source, language, translations, canonical_url,
  gallery, related_posts
) VALUES (
  '4',
  'strategi-branding-di-media-sosial',
  '/blog/strategi-branding-di-media-sosial',
  'Strategi Branding di Media Sosial untuk Meningkatkan Engagement',
  'Strategi Branding Media Sosial | Bangun Engagement Bisnis',
  'Pelajari cara meningkatkan brand awareness dan engagement melalui strategi konten, interaksi, dan analitik media sosial.',
  'Media sosial menjadi alat utama membangun brand awareness. Pelajari strategi efektif untuk meningkatkan engagement dan loyalitas pelanggan.',
  'Branding di media sosial bukan hanya tentang desain visual yang menarik, tetapi tentang membangun kepercayaan dan hubungan emosional dengan audiens.

### 1. Tentukan Identitas Merek yang Konsisten
Gunakan warna, tone of voice, dan gaya visual yang sama di setiap platform agar audiens mudah mengenali identitas brand-mu.

### 2. Fokus pada Nilai, Bukan Hanya Produk
Ceritakan kisah, nilai, atau inspirasi di balik brand. Audiens cenderung lebih terhubung dengan merek yang memiliki kepribadian dan misi yang jelas.

### 3. Gunakan Konten Interaktif
Konten seperti polling, kuis, video pendek, atau sesi live bisa meningkatkan interaksi. Konsistensi dan kreativitas adalah kunci.

### 4. Analisis Performa
Gunakan insight dari Instagram, TikTok, atau X (Twitter) untuk mengukur efektivitas strategi. Evaluasi engagement rate dan sesuaikan konten berdasarkan data.

### 5. Kolaborasi dengan Influencer
Kerja sama dengan kreator yang relevan dapat memperluas jangkauan audiens dan meningkatkan kredibilitas brand.

### Kesimpulan
Strategi branding di media sosial adalah perjalanan membangun kepercayaan jangka panjang. Dengan konten yang autentik, konsisten, dan bernilai, bisnismu bisa tumbuh bersama komunitasnya.',
  'Anisa Putri',
  '/images/authors/anisa.jpg',
  'Digital marketing specialist yang fokus pada strategi brand dan konten kreatif untuk berbagai bisnis lokal.',
  '/authors/anisa-putri',
  '2025-07-05',
  '2025-07-07',
  'published',
  '/images/blog4.jpg',
  '/images/blog4-large.jpg',
  NULL,
  'Marketing',
  '["branding","media sosial","strategi","bisnis","engagement"]'::jsonb,
  '[]'::jsonb,
  '["branding","media sosial","strategi","bisnis","engagement"]'::jsonb,
  '9 menit',
  1475,
  'mudah',
  2498,
  552,
  120,
  4.9,
  1,
  TRUE,
  'Digital Marketing',
  'Marketing Insight Blog',
  'id',
  '{"en":"social-media-branding-strategy"}'::jsonb,
  'https://syaiful-mukmin.netlify.app/blog/strategi-branding-di-media-sosial',
  '["/images/blog4-1.jpg"]'::jsonb,
  '["cara-mengelola-proyek-digital"]'::jsonb
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

-- Artikel #5: Peran Guru di Era Digital: Transformasi Metode Mengajar
INSERT INTO public.blog_posts (
  id, slug, url, title, meta_title, meta_description, excerpt, content,
  author, author_avatar, author_bio, author_link, date, updated_at, status,
  thumbnail, image_full, cover_video, category, tags, labels, keywords,
  read_time, word_count, reading_level, views, likes, shares, rating, total_ratings,
  featured, series, source, language, translations, canonical_url,
  gallery, related_posts
) VALUES (
  '5',
  'peran-guru-era-digital',
  '/blog/peran-guru-era-digital',
  'Peran Guru di Era Digital: Transformasi Metode Mengajar',
  'Transformasi Peran Guru | Mengajar di Era Digital',
  'Bagaimana guru beradaptasi dengan teknologi digital untuk menciptakan pengalaman belajar yang lebih interaktif dan relevan bagi siswa.',
  'Guru modern dituntut untuk mengintegrasikan teknologi dalam pembelajaran. Simak strategi adaptasi dan tools yang dapat digunakan.',
  'Di era digital, peran guru mengalami transformasi signifikan dari sumber pengetahuan utama menjadi fasilitator yang memandu siswa mengeksplorasi informasi secara mandiri.

### 1. Guru sebagai Fasilitator Digital
Guru tidak lagi sekadar menyampaikan materi, tetapi mengarahkan siswa untuk belajar melalui platform digital seperti LMS, video interaktif, dan simulasi online.

### 2. Pemanfaatan Tools Edukasi
Tools seperti **Google Classroom**, **Quizizz**, dan **Khan Academy** membantu guru membuat materi yang lebih menarik dan memantau perkembangan siswa secara real-time.

### 3. Pengembangan Literasi Digital
Guru perlu mengajarkan siswa cara menggunakan teknologi secara bijak, termasuk evaluasi kredibilitas informasi dan keamanan digital.

### 4. Kolaborasi Lintas Sekolah
Teknologi memungkinkan guru berkolaborasi dengan pendidik lain secara global untuk berbagi sumber belajar dan metode inovatif.

### 5. Tantangan dan Solusi
Tantangan seperti kesenjangan akses teknologi dapat diatasi dengan strategi hybrid learning dan pemanfaatan konten offline.

Dengan adaptasi yang tepat, guru dapat menciptakan lingkungan belajar yang lebih dinamis, interaktif, dan sesuai kebutuhan siswa zaman sekarang.',
  'Syaiful Mukmin',
  '/images/authors/syaiful.jpg',
  'Pengajar dan penulis aktif di blog pendidikan dengan fokus pada inovasi metode pembelajaran dan teknologi pendidikan.',
  '/authors/syaiful-mukmin',
  '2025-11-05',
  '2025-11-10',
  'published',
  '/images/blog5.jpg',
  '/images/blog5-large.jpg',
  '',
  'Pendidikan',
  '["guru","pendidikan","digital","teknologi","pembelajaran"]'::jsonb,
  '[]'::jsonb,
  '["guru","pendidikan","era digital","teknologi pendidikan","pembelajaran"]'::jsonb,
  '8 menit',
  1350,
  'menengah',
  1890,
  320,
  85,
  4.7,
  1,
  TRUE,
  'Guru Modern',
  'Blog Pendidikan',
  'id',
  '{"en":"teacher-role-digital-era"}'::jsonb,
  'https://syaiful-mukmin.netlify.app/blog/peran-guru-era-digital',
  '["/images/blog5-1.jpg","/images/blog5-2.jpg"]'::jsonb,
  '["game-edukasi-anak","strategi-belajar-efektif"]'::jsonb
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

