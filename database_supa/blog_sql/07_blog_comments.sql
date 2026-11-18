-- ==============================================================================
-- 💬 SEED DATA: KOMENTAR ARTIKEL BLOG
-- ==============================================================================
-- File: 07_blog_comments.sql
-- ==============================================================================

-- Komentar untuk artikel: "Tips Fotografi untuk Pemula: Panduan Lengkap dari Nol" (tips-fotografi-pemula)
INSERT INTO public.blog_comments (comment_id, post_slug, name, message, created_at)
VALUES (
  'cmt-001',
  'tips-fotografi-pemula',
  'Andi Saputra',
  'Artikelnya sangat membantu! Sekarang saya lebih paham cara menggunakan aperture dan shutter speed.',
  '2025-10-11'
) ON CONFLICT (comment_id) DO UPDATE SET
  name = EXCLUDED.name,
  message = EXCLUDED.message,
  created_at = EXCLUDED.created_at;
INSERT INTO public.blog_comments (comment_id, post_slug, name, message, created_at)
VALUES (
  'cmt-002',
  'tips-fotografi-pemula',
  'Melisa',
  'Suka banget dengan penjelasan tentang golden hour! Terima kasih ilmunya 🙌',
  '2025-10-12'
) ON CONFLICT (comment_id) DO UPDATE SET
  name = EXCLUDED.name,
  message = EXCLUDED.message,
  created_at = EXCLUDED.created_at;

-- Komentar untuk artikel: "Cara Efektif Mengelola Proyek Digital di Era Modern" (cara-mengelola-proyek-digital)
INSERT INTO public.blog_comments (comment_id, post_slug, name, message, created_at)
VALUES (
  'cmt-003',
  'cara-mengelola-proyek-digital',
  'Yoga Mahendra',
  'Artikel yang bagus! Saya langsung mencoba pakai Notion untuk tim saya.',
  '2025-09-30'
) ON CONFLICT (comment_id) DO UPDATE SET
  name = EXCLUDED.name,
  message = EXCLUDED.message,
  created_at = EXCLUDED.created_at;

-- Komentar untuk artikel: "Strategi Branding di Media Sosial untuk Meningkatkan Engagement" (strategi-branding-di-media-sosial)
INSERT INTO public.blog_comments (comment_id, post_slug, name, message, created_at)
VALUES (
  'cmt-004',
  'strategi-branding-di-media-sosial',
  'Rafi Ardian',
  'Strateginya bisa langsung saya terapkan di akun bisnis saya. Terima kasih!',
  '2025-07-06'
) ON CONFLICT (comment_id) DO UPDATE SET
  name = EXCLUDED.name,
  message = EXCLUDED.message,
  created_at = EXCLUDED.created_at;

-- Komentar untuk artikel: "Peran Guru di Era Digital: Transformasi Metode Mengajar" (peran-guru-era-digital)
INSERT INTO public.blog_comments (comment_id, post_slug, name, message, created_at)
VALUES (
  'cmt-005',
  'peran-guru-era-digital',
  'Dewi Sartika',
  'Sangat relevan dengan kondisi mengajar saat ini. Terima kasih tips tools-nya!',
  '2025-11-06'
) ON CONFLICT (comment_id) DO UPDATE SET
  name = EXCLUDED.name,
  message = EXCLUDED.message,
  created_at = EXCLUDED.created_at;

-- Komentar untuk artikel: "Game Edukasi untuk Anak: Belajar Sambil Bermain" (game-edukasi-anak)
INSERT INTO public.blog_comments (comment_id, post_slug, name, message, created_at)
VALUES (
  'cmt-006',
  'game-edukasi-anak',
  'Rina Wijaya',
  'Anak saya jadi suka belajar matematika setelah main DragonBox. Terima kasih rekomendasinya!',
  '2025-11-13'
) ON CONFLICT (comment_id) DO UPDATE SET
  name = EXCLUDED.name,
  message = EXCLUDED.message,
  created_at = EXCLUDED.created_at;

-- Komentar untuk artikel: "Rise of Indonesian Games: Potensi dan Tantangan" (game-buatan-indonesia)
INSERT INTO public.blog_comments (comment_id, post_slug, name, message, created_at)
VALUES (
  'cmt-007',
  'game-buatan-indonesia',
  'Ahmad Fauzi',
  'Bangga dengan karya anak bangsa! Semoga makin banyak developer yang terjun.',
  '2025-11-26'
) ON CONFLICT (comment_id) DO UPDATE SET
  name = EXCLUDED.name,
  message = EXCLUDED.message,
  created_at = EXCLUDED.created_at;

-- Komentar untuk artikel: "Dampak Game terhadap Kesehatan Mental: Baik atau Buruk?" (game-dan-kesehatan-mental)
INSERT INTO public.blog_comments (comment_id, post_slug, name, message, created_at)
VALUES (
  'cmt-008',
  'game-dan-kesehatan-mental',
  'Budi Santoso',
  'Artikel yang seimbang. Saya setuju game bisa positif asal dikelola dengan baik.',
  '2025-12-10'
) ON CONFLICT (comment_id) DO UPDATE SET
  name = EXCLUDED.name,
  message = EXCLUDED.message,
  created_at = EXCLUDED.created_at;

-- Komentar untuk artikel: "Esports: Peluang Karier di Balik Dunia Game Kompetitif" (esports-sebagai-karier)
INSERT INTO public.blog_comments (comment_id, post_slug, name, message, created_at)
VALUES (
  'cmt-009',
  'esports-sebagai-karier',
  'Rizky Gamers',
  'Inspiratif! Saya ingin jadi game analyst, artikel ini membuka wawasan.',
  '2025-12-23'
) ON CONFLICT (comment_id) DO UPDATE SET
  name = EXCLUDED.name,
  message = EXCLUDED.message,
  created_at = EXCLUDED.created_at;

-- Komentar untuk artikel: "Pendidikan Karakter: Fondasi Utama Membangun Generasi Berintegritas" (pentingnya-pendidikan-karakter)
INSERT INTO public.blog_comments (comment_id, post_slug, name, message, created_at)
VALUES (
  'cmt-010',
  'pentingnya-pendidikan-karakter',
  'Sri Wahyuni',
  'Setuju sekali! Sekarang banyak anak pintar tapi kurang sopan. Pendidikan karakter harus jadi prioritas.',
  '2026-01-02'
) ON CONFLICT (comment_id) DO UPDATE SET
  name = EXCLUDED.name,
  message = EXCLUDED.message,
  created_at = EXCLUDED.created_at;

-- Komentar untuk artikel: "Revolusi Pendidikan Digital: Transformasi Lengkap dari Sistem Tradisional ke Era 5.0" (revolusi-pendidikan-digital)
INSERT INTO public.blog_comments (comment_id, post_slug, name, message, created_at)
VALUES (
  'cmt-015-001',
  'revolusi-pendidikan-digital',
  'Prof. Dr. Aminuddin Siregar',
  'Artikel yang sangat komprehensif dan mendalam. Saya setuju bahwa revolusi digital dalam pendidikan harus dipandang sebagai perubahan paradigma, bukan sekadar adopsi teknologi. Analisis tentang Society 5.0 sangat relevan untuk perencanaan pendidikan nasional jangka panjang.',
  '2026-02-16'
) ON CONFLICT (comment_id) DO UPDATE SET
  name = EXCLUDED.name,
  message = EXCLUDED.message,
  created_at = EXCLUDED.created_at;
INSERT INTO public.blog_comments (comment_id, post_slug, name, message, created_at)
VALUES (
  'cmt-015-002',
  'revolusi-pendidikan-digital',
  'Linda Susanti, M.Pd',
  'Sebagai guru yang sudah mengajar 20 tahun, artikel ini membuka mata saya. Saya awalnya resisten terhadap teknologi, tetapi sekarang memahami bahwa peran saya justru lebih strategis sebagai fasilitator dan desainer pembelajaran. Terima kasih untuk perspektif yang seimbang.',
  '2026-02-17'
) ON CONFLICT (comment_id) DO UPDATE SET
  name = EXCLUDED.name,
  message = EXCLUDED.message,
  created_at = EXCLUDED.created_at;
INSERT INTO public.blog_comments (comment_id, post_slug, name, message, created_at)
VALUES (
  'cmt-015-003',
  'revolusi-pendidikan-digital',
  'Tech Edu Enthusiast',
  'Pembahasan tentang blockchain untuk sertifikasi sangat menarik! Apakah ada proyek pilot di Indonesia yang sudah menerapkan ini? Saya ingin tahu lebih detail tentang implementasinya.',
  '2026-02-18'
) ON CONFLICT (comment_id) DO UPDATE SET
  name = EXCLUDED.name,
  message = EXCLUDED.message,
  created_at = EXCLUDED.created_at;

-- Komentar untuk artikel: "Psikologi Game dan Pembelajaran: Memahami Mekanisme Motivasi, Engagement, dan Retensi Memori dalam Konteks Edukasi" (psikologi-game-dan-pembelajaran)
INSERT INTO public.blog_comments (comment_id, post_slug, name, message, created_at)
VALUES (
  'cmt-016-001',
  'psikologi-game-dan-pembelajaran',
  'Dr. Rina Puspitasari, Psikolog',
  'Analisis yang sangat komprehensif! Sebagai psikolog pendidikan, saya sangat menghargai bagaimana artikel ini menghubungkan teori psikologi klasik dengan aplikasi modern. Penjelasan tentang Self-Determination Theory dan penerapannya dalam game sangat tepat.',
  '2026-03-11'
) ON CONFLICT (comment_id) DO UPDATE SET
  name = EXCLUDED.name,
  message = EXCLUDED.message,
  created_at = EXCLUDED.created_at;
INSERT INTO public.blog_comments (comment_id, post_slug, name, message, created_at)
VALUES (
  'cmt-016-002',
  'psikologi-game-dan-pembelajaran',
  'Game Developer',
  'Artikel yang luar biasa mendalam. Saya sudah 10 tahun bekerja di industri game, dan ini adalah salah satu analisis terbaik yang saya baca tentang psikologi game dan aplikasi edukasinya. Bagian tentang etika sangat penting dan sering diabaikan.',
  '2026-03-12'
) ON CONFLICT (comment_id) DO UPDATE SET
  name = EXCLUDED.name,
  message = EXCLUDED.message,
  created_at = EXCLUDED.created_at;
INSERT INTO public.blog_comments (comment_id, post_slug, name, message, created_at)
VALUES (
  'cmt-016-003',
  'psikologi-game-dan-pembelajaran',
  'Mahasiswa Pendidikan',
  'Artikel ini seperti kuliah lengkap tentang psikologi game! Saya akan menggunakan ini sebagai referensi utama untuk skripsi saya tentang gamifikasi dalam pembelajaran matematika. Terima kasih!',
  '2026-03-13'
) ON CONFLICT (comment_id) DO UPDATE SET
  name = EXCLUDED.name,
  message = EXCLUDED.message,
  created_at = EXCLUDED.created_at;

-- Komentar untuk artikel: "Profesi Guru di Masa Depan: Evolusi Peran, Keterampilan Baru, dan Transformasi Identitas dalam Ekosistem Pendidikan Abad ke-21" (profesi-guru-masa-depan)
INSERT INTO public.blog_comments (comment_id, post_slug, name, message, created_at)
VALUES (
  'cmt-017-001',
  'profesi-guru-masa-depan',
  'Dr. Ahmad Syafii, Dekan Fakultas Keguruan',
  'Analisis yang sangat visioner dan mendalam. Artikel ini harus menjadi bacaan wajib bagi semua pengembang kurikulum pendidikan guru. Kami di fakultas kami sedang mempertimbangkan redesign kurikulum, dan artikel ini memberikan kerangka konseptual yang sangat berharga.',
  '2026-04-06'
) ON CONFLICT (comment_id) DO UPDATE SET
  name = EXCLUDED.name,
  message = EXCLUDED.message,
  created_at = EXCLUDED.created_at;
INSERT INTO public.blog_comments (comment_id, post_slug, name, message, created_at)
VALUES (
  'cmt-017-002',
  'profesi-guru-masa-depan',
  'Guru Senior dengan 30 Tahun Pengalaman',
  'Saya membaca artikel ini dengan perasaan campur aduk. Di satu sisi, saya khawatir tidak bisa mengikuti perubahan secepat ini. Di sisi lain, saya merasa tertantang untuk belajar hal baru. Bagian tentang guru sebagai penjaga kemanusiaan sangat menyentuh hati saya.',
  '2026-04-07'
) ON CONFLICT (comment_id) DO UPDATE SET
  name = EXCLUDED.name,
  message = EXCLUDED.message,
  created_at = EXCLUDED.created_at;
INSERT INTO public.blog_comments (comment_id, post_slug, name, message, created_at)
VALUES (
  'cmt-017-003',
  'profesi-guru-masa-depan',
  'Calon Guru',
  'Sebagai mahasiswa pendidikan yang akan lulus tahun depan, artikel ini membuka mata saya. Saya sadar bahwa saya perlu mengembangkan keterampilan yang jauh melampaui apa yang diajarkan di kampus. Apakah ada rekomendasi kursus online untuk mulai mengembangkan keterampilan analisis data untuk guru?',
  '2026-04-08'
) ON CONFLICT (comment_id) DO UPDATE SET
  name = EXCLUDED.name,
  message = EXCLUDED.message,
  created_at = EXCLUDED.created_at;

-- Komentar untuk artikel: "Pengembangan Game untuk Edukasi: Panduan Komprehensif dari Konsep hingga Implementasi di Kelas" (game-development-edukasi)
INSERT INTO public.blog_comments (comment_id, post_slug, name, message, created_at)
VALUES (
  'cmt-018-001',
  'game-development-edukasi',
  'Indra Game Developer',
  'Panduan terlengkap yang pernah saya baca tentang game edukasi! Saya sudah 5 tahun mengembangkan game komersial dan ingin beralih ke game edukasi. Bagian tentang ''chocolate-covered broccoli'' sangat membuka mata - saya sadar beberapa konsep awal saya jatuh ke jebakan itu.',
  '2026-05-21'
) ON CONFLICT (comment_id) DO UPDATE SET
  name = EXCLUDED.name,
  message = EXCLUDED.message,
  created_at = EXCLUDED.created_at;
INSERT INTO public.blog_comments (comment_id, post_slug, name, message, created_at)
VALUES (
  'cmt-018-002',
  'game-development-edukasi',
  'Dosen Teknologi Pendidikan',
  'Artikel ini layaknya textbook tentang pengembangan game edukasi. Saya akan merekomendasikan ini sebagai bacaan wajib untuk mahasiswa saya di mata kuliah Media Pembelajaran. Struktur fase pengembangan sangat jelas dan aplikatif.',
  '2026-05-22'
) ON CONFLICT (comment_id) DO UPDATE SET
  name = EXCLUDED.name,
  message = EXCLUDED.message,
  created_at = EXCLUDED.created_at;
INSERT INTO public.blog_comments (comment_id, post_slug, name, message, created_at)
VALUES (
  'cmt-018-003',
  'game-development-edukasi',
  'Guru yang Ingin Membuat Game',
  'Terima kasih untuk panduan yang sangat detail! Saya seorang guru matematika tanpa background programming, dan bagian tentang tools untuk non-programmer sangat membantu. Saya sudah mencoba Twine untuk membuat game cerita matematika dan siswa sangat antusias!',
  '2026-05-23'
) ON CONFLICT (comment_id) DO UPDATE SET
  name = EXCLUDED.name,
  message = EXCLUDED.message,
  created_at = EXCLUDED.created_at;

-- Komentar untuk artikel: "Redesain Kurikulum untuk Abad ke-21: Mengintegrasikan Keterampilan Masa Depan, Teknologi, dan Pendidikan Karakter dalam Sistem Pendidikan Modern" (kurikulum-abad-21)
INSERT INTO public.blog_comments (comment_id, post_slug, name, message, created_at)
VALUES (
  'cmt-019-001',
  'kurikulum-abad-21',
  'Prof. Dr. Hasan Basri, Pakar Kurikulum',
  'Analisis yang sangat komprehensif dan visioner. Saya setuju dengan pendekatan integratif yang diusulkan. Di Indonesia, kita perlu mempertimbangkan konteks lokal dalam mengadaptasi kerangka ini. Bagian tentang pendidikan karakter sangat relevan dengan penguatan profil pelajar Pancasila.',
  '2026-06-16'
) ON CONFLICT (comment_id) DO UPDATE SET
  name = EXCLUDED.name,
  message = EXCLUDED.message,
  created_at = EXCLUDED.created_at;
INSERT INTO public.blog_comments (comment_id, post_slug, name, message, created_at)
VALUES (
  'cmt-019-002',
  'kurikulum-abad-21',
  'Kepala Sekolah Inovatif',
  'Artikel ini seperti panduan lengkap untuk transformasi sekolah. Saya sudah mencoba beberapa elemen (seperti project-based learning), tetapi kerangka holistik ini menunjukkan bagaimana semua bagian harus terhubung. Roadmap implementasi sangat membantu untuk perencanaan.',
  '2026-06-17'
) ON CONFLICT (comment_id) DO UPDATE SET
  name = EXCLUDED.name,
  message = EXCLUDED.message,
  created_at = EXCLUDED.created_at;
INSERT INTO public.blog_comments (comment_id, post_slug, name, message, created_at)
VALUES (
  'cmt-019-003',
  'kurikulum-abad-21',
  'Orang Tua Milenial',
  'Sebagai orang tua yang bekerja di industri teknologi, saya melihat langsung kesenjangan antara sekolah dan dunia kerja. Saya ingin anak saya mengembangkan keterampilan yang disebutkan dalam artikel ini. Bagaimana saya bisa mendorong sekolah anak saya untuk mulai bergerak ke arah ini?',
  '2026-06-18'
) ON CONFLICT (comment_id) DO UPDATE SET
  name = EXCLUDED.name,
  message = EXCLUDED.message,
  created_at = EXCLUDED.created_at;

-- Komentar untuk artikel: "Etika dalam Teknologi Pendidikan: Menavigasi Tantangan Privasi, Bias Algoritma, dan Kesenjangan Digital dalam Era Pembelajaran yang Terhubung" (etika-teknologi-pendidikan)
INSERT INTO public.blog_comments (comment_id, post_slug, name, message, created_at)
VALUES (
  'cmt-020-001',
  'etika-teknologi-pendidikan',
  'Privacy Advocate',
  'Artikel yang sangat penting dan tepat waktu. Saya bekerja di organisasi yang fokus pada hak digital anak, dan kekhawatiran tentang data siswa sangat nyata. Bagian tentang ''privacy by design'' harus menjadi standar wajib untuk semua platform edtech.',
  '2026-07-11'
) ON CONFLICT (comment_id) DO UPDATE SET
  name = EXCLUDED.name,
  message = EXCLUDED.message,
  created_at = EXCLUDED.created_at;
INSERT INTO public.blog_comments (comment_id, post_slug, name, message, created_at)
VALUES (
  'cmt-020-002',
  'etika-teknologi-pendidikan',
  'Edtech Founder',
  'Sebagai pendiri startup edtech, artikel ini membuat saya merenung. Kami sering fokus pada fitur dan user experience tanpa mempertimbangkan implikasi etika secara mendalam. Checklist etika sangat praktis—saya akan menggunakannya dalam proses pengembangan kami.',
  '2026-07-12'
) ON CONFLICT (comment_id) DO UPDATE SET
  name = EXCLUDED.name,
  message = EXCLUDED.message,
  created_at = EXCLUDED.created_at;
INSERT INTO public.blog_comments (comment_id, post_slug, name, message, created_at)
VALUES (
  'cmt-020-003',
  'etika-teknologi-pendidikan',
  'Guru yang Khawatir',
  'Sekolah kami baru saja mengadopsi platform pembelajaran baru, dan saya khawatir tentang data siswa. Artikel ini memberikan bahasa dan kerangka untuk mengajukan pertanyaan yang tepat kepada administrator dan vendor. Terima kasih!',
  '2026-07-13'
) ON CONFLICT (comment_id) DO UPDATE SET
  name = EXCLUDED.name,
  message = EXCLUDED.message,
  created_at = EXCLUDED.created_at;

-- Komentar untuk artikel: "Neurosains Pembelajaran dan Game: Bagaimana Otak Merespons Gameplay dan Implikasinya untuk Desain Pembelajaran yang Optimal" (neurosains-pembelajaran-game)
INSERT INTO public.blog_comments (comment_id, post_slug, name, message, created_at)
VALUES (
  'cmt-021-001',
  'neurosains-pembelajaran-game',
  'Dr. Sarah Wijaya, Neurosains Kognitif',
  'Sebagai peneliti neurosains kognitif yang mempelajari game, saya sangat menghargai kedalaman dan akurasi artikel ini. Penjelasan tentang sistem dopamin dan penghargaan sangat tepat. Saya akan membagikan ini dengan mahasiswa saya.',
  '2026-08-06'
) ON CONFLICT (comment_id) DO UPDATE SET
  name = EXCLUDED.name,
  message = EXCLUDED.message,
  created_at = EXCLUDED.created_at;
INSERT INTO public.blog_comments (comment_id, post_slug, name, message, created_at)
VALUES (
  'cmt-021-002',
  'neurosains-pembelajaran-game',
  'Game Developer dengan Minat Pendidikan',
  'Artikel ini menghubungkan banyak titik antara teori dan praktik. Bagian tentang ''desirable difficulties'' mengubah cara saya berpikir tentang desain kesulitan game. Apakah ada tools atau framework khusus untuk menerapkan prinsip neurosains dalam desain game?',
  '2026-08-07'
) ON CONFLICT (comment_id) DO UPDATE SET
  name = EXCLUDED.name,
  message = EXCLUDED.message,
  created_at = EXCLUDED.created_at;
INSERT INTO public.blog_comments (comment_id, post_slug, name, message, created_at)
VALUES (
  'cmt-021-003',
  'neurosains-pembelajaran-game',
  'Guru Sains',
  'Saya selalu mencari cara untuk membuat sains lebih menarik. Memahami dasar neurosains dari mengapa game begitu menarik membantu saya merancang aktivitas kelas yang lebih engaging. Bisa kah prinsip-prinsip ini diterapkan tanpa teknologi canggih?',
  '2026-08-08'
) ON CONFLICT (comment_id) DO UPDATE SET
  name = EXCLUDED.name,
  message = EXCLUDED.message,
  created_at = EXCLUDED.created_at;

-- Komentar untuk artikel: "Inklusivitas dalam Pendidikan Digital: Strategi untuk Mengatasi Kesenjangan, Menjangkau Pembelajar Marginalized, dan Menciptakan Ekosistem Belajar yang Aksesibel untuk Semua" (inklusivitas-pendidikan-digital)
INSERT INTO public.blog_comments (comment_id, post_slug, name, message, created_at)
VALUES (
  'cmt-022-001',
  'inklusivitas-pendidikan-digital',
  'Disability Rights Advocate',
  'Artikel yang sangat komprehensif dan penting. Sebagai advokat hak disabilitas, saya sering melihat platform pendidikan digital yang tidak dapat diakses. Bagian tentang UDL dan standar aksesibilitas harus dibaca oleh semua pengembang edtech. ''Nothing about us without us''—melibatkan penyandang disabilitas dalam desain sangat penting.',
  '2026-09-11'
) ON CONFLICT (comment_id) DO UPDATE SET
  name = EXCLUDED.name,
  message = EXCLUDED.message,
  created_at = EXCLUDED.created_at;
INSERT INTO public.blog_comments (comment_id, post_slug, name, message, created_at)
VALUES (
  'cmt-022-002',
  'inklusivitas-pendidikan-digital',
  'Kepala Sekolah di Daerah Terpencil',
  'Kami berjuang dengan kesenjangan digital setiap hari. Strategi seperti offline-first design dan content delivery via SD card sangat praktis untuk konteks kami. Apakah ada contoh platform yang sudah mengimplementasikan ini dengan baik?',
  '2026-09-12'
) ON CONFLICT (comment_id) DO UPDATE SET
  name = EXCLUDED.name,
  message = EXCLUDED.message,
  created_at = EXCLUDED.created_at;
INSERT INTO public.blog_comments (comment_id, post_slug, name, message, created_at)
VALUES (
  'cmt-022-003',
  'inklusivitas-pendidikan-digital',
  'Desainer Platform Edtech',
  'Artikel ini mengubah perspektif saya tentang desain. Saya biasanya fokus pada pengalaman pengguna rata-rata, tanpa mempertimbangkan secara memadai kebutuhan pengguna yang berbeda. Checklist inklusivitas sangat berharga untuk proses desain kami.',
  '2026-09-13'
) ON CONFLICT (comment_id) DO UPDATE SET
  name = EXCLUDED.name,
  message = EXCLUDED.message,
  created_at = EXCLUDED.created_at;

-- Komentar untuk artikel: "Game sebagai Katalis Kreativitas: Bagaimana Bermain Game Dapat Mengembangkan Berpikir Kreatif, Inovasi, dan Kemampuan Pemecahan Masalah Kompleks" (game-dan-kreativitas)
INSERT INTO public.blog_comments (comment_id, post_slug, name, message, created_at)
VALUES (
  'cmt-023-001',
  'game-dan-kreativitas',
  'Game Designer Indie',
  'Artikel yang sangat menginspirasi! Saya membuat game puzzle yang mendorong pemikiran lateral, dan artikel ini memberikan kerangka konseptual untuk memahami mengapa pendekatan itu berhasil. Bagian tentang emergent gameplay sangat relevan dengan desain game saya.',
  '2026-10-06'
) ON CONFLICT (comment_id) DO UPDATE SET
  name = EXCLUDED.name,
  message = EXCLUDED.message,
  created_at = EXCLUDED.created_at;
INSERT INTO public.blog_comments (comment_id, post_slug, name, message, created_at)
VALUES (
  'cmt-023-002',
  'game-dan-kreativitas',
  'Guru Seni',
  'Saya selalu mencari cara baru untuk mengajarkan kreativitas. Saya terkejut mengetahui betapa banyaknya game yang bisa digunakan sebagai alat pendidikan seni. Apakah ada rekomendasi game khusus untuk mengajarkan prinsip desain visual?',
  '2026-10-07'
) ON CONFLICT (comment_id) DO UPDATE SET
  name = EXCLUDED.name,
  message = EXCLUDED.message,
  created_at = EXCLUDED.created_at;
INSERT INTO public.blog_comments (comment_id, post_slug, name, message, created_at)
VALUES (
  'cmt-023-003',
  'game-dan-kreativitas',
  'Orang Tua dari Anak Kreatif',
  'Anak saya menghabiskan banyak waktu bermain Minecraft dan membuat struktur yang rumit. Saya khawatir tentang waktu layarnya, tetapi setelah membaca artikel ini, saya melihat nilai kreatif dalam apa yang dilakukannya. Bagaimana saya bisa mendukung kreativitasnya melalui game tanpa berlebihan?',
  '2026-10-08'
) ON CONFLICT (comment_id) DO UPDATE SET
  name = EXCLUDED.name,
  message = EXCLUDED.message,
  created_at = EXCLUDED.created_at;

-- Komentar untuk artikel: "Assessment untuk Abad ke-21: Mengembangkan Sistem Penilaian yang Otentik, Berkelanjutan, dan Berpusat pada Pembelajar dalam Konteks Pendidikan Modern" (assessment-abad-21)
INSERT INTO public.blog_comments (comment_id, post_slug, name, message, created_at)
VALUES (
  'cmt-024-001',
  'assessment-abad-21',
  'Dr. Budi Assessment, Pakar Evaluasi Pendidikan',
  'Analisis yang sangat komprehensif dan tepat waktu. Saya setuju bahwa kita perlu bergeser dari assessment of learning ke assessment for dan as learning. Bagian tentang validitas dan reliabilitas dalam konteks assessment baru sangat penting—sering diabaikan dalam antusiasme untuk metode baru.',
  '2026-11-11'
) ON CONFLICT (comment_id) DO UPDATE SET
  name = EXCLUDED.name,
  message = EXCLUDED.message,
  created_at = EXCLUDED.created_at;
INSERT INTO public.blog_comments (comment_id, post_slug, name, message, created_at)
VALUES (
  'cmt-024-002',
  'assessment-abad-21',
  'Guru yang Frustrasi dengan Ujian Nasional',
  'Artikel ini menyuarakan apa yang telah saya rasakan selama bertahun-tahun. Ujian standar tidak mengukur apa yang benar-benar penting. Saya sudah mencoba assessment otentik di kelas kecil, tetapi tantangan waktu dan beban kerja nyata. Bagaimana mengelola assessment yang lebih kompleks dengan jumlah siswa yang besar?',
  '2026-11-12'
) ON CONFLICT (comment_id) DO UPDATE SET
  name = EXCLUDED.name,
  message = EXCLUDED.message,
  created_at = EXCLUDED.created_at;
INSERT INTO public.blog_comments (comment_id, post_slug, name, message, created_at)
VALUES (
  'cmt-024-003',
  'assessment-abad-21',
  'Developer Edtech',
  'Kami sedang mengembangkan platform pembelajaran, dan assessment adalah komponen kritis. Artikel ini memberikan roadmap yang jelas untuk fitur assessment yang seharusnya kami bangun. Bagian tentang learning analytics dan AI dalam assessment sangat menarik untuk eksplorasi teknis.',
  '2026-11-13'
) ON CONFLICT (comment_id) DO UPDATE SET
  name = EXCLUDED.name,
  message = EXCLUDED.message,
  created_at = EXCLUDED.created_at;

-- Komentar untuk artikel: "Filosofi Pendidikan dan Game: Mempertemukan Dunia Pembelajaran Formal dan Informal melalui Perspektif Filosofis tentang Makna, Tujuan, dan Hakikat Belajar" (filosofi-pendidikan-game)
INSERT INTO public.blog_comments (comment_id, post_slug, name, message, created_at)
VALUES (
  'cmt-025-001',
  'filosofi-pendidikan-game',
  'Dr. Filosofi Pendidikan',
  'Sebagai akademisi yang mempelajari filsafat pendidikan, saya sangat menghargai kedalaman dan nuansa artikel ini. Hubungan antara konsep ''magic circle'' Huizinga dan ruang kelas sebagai ruang terpisah untuk eksplorasi aman sangat menarik. Ini memberikan kerangka filosofis yang kuat untuk memahami potensi game dalam pendidikan.',
  '2026-12-06'
) ON CONFLICT (comment_id) DO UPDATE SET
  name = EXCLUDED.name,
  message = EXCLUDED.message,
  created_at = EXCLUDED.created_at;
INSERT INTO public.blog_comments (comment_id, post_slug, name, message, created_at)
VALUES (
  'cmt-025-002',
  'filosofi-pendidikan-game',
  'Game Studies Scholar',
  'Artikel yang luar biasa! Saya telah mempelajari game dari perspektif humaniora selama bertahun-tahun, dan ini adalah salah satu perawatan terbaik yang pernah saya lihat tentang hubungan filosofis antara game dan pendidikan. Bagian tentang ontologi game sebagai ''possible worlds'' sangat tepat.',
  '2026-12-07'
) ON CONFLICT (comment_id) DO UPDATE SET
  name = EXCLUDED.name,
  message = EXCLUDED.message,
  created_at = EXCLUDED.created_at;
INSERT INTO public.blog_comments (comment_id, post_slug, name, message, created_at)
VALUES (
  'cmt-025-003',
  'filosofi-pendidikan-game',
  'Guru yang Merenung',
  'Membaca artikel ini seperti minum dari air mata kebijaksanaan. Saya telah mengajar selama 15 tahun dan sering merasa ada yang hilang dalam pendidikan modern. Perspektif filosofis ini membantu saya memahami apa itu—rasa bermain, penemuan, dan makna. Saya ingin membuat kelas saya lebih seperti ''magic circle'' dan kurang seperti pabrik.',
  '2026-12-08'
) ON CONFLICT (comment_id) DO UPDATE SET
  name = EXCLUDED.name,
  message = EXCLUDED.message,
  created_at = EXCLUDED.created_at;

