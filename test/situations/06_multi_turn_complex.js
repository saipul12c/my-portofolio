/**
 * 06_multi_turn_complex.js
 * Situasi 126 - 150: Penalaran Kompleks, Komparasi Lintas Entitas & Konteks Berkelanjutan
 */

export const multiTurnComplexSituations = [
  {
    id: 126,
    category: "Complex & Multi-Turn",
    title: "Sintesis Pengalaman Mengajar dan Koding",
    query: "Bagaimana hubungan antara latar belakang pendidikan S1-PGMI dengan keahliannya sebagai full-stack developer?",
    expectedDomain: "synthesis",
    expectedKeywords: ["edukasi", "EduTech", "teknologi", "pembelajaran"],
    difficulty: "advanced"
  },
  {
    id: 127,
    category: "Complex & Multi-Turn",
    title: "Komparasi Proyek Web vs Fotografi",
    query: "Bandingkan pendekatan Syaiful dalam merancang antarmuka web dan dalam mengomposisi foto studio",
    expectedDomain: "comparison",
    expectedKeywords: ["estetika", "visual", "desain", "detail"],
    difficulty: "advanced"
  },
  {
    id: 128,
    category: "Complex & Multi-Turn",
    title: "Penalaran Kelayakan Kerjasama Freelance",
    query: "Jika saya punya proyek pembuatan sistem e-learning interaktif berbasis React, apakah Syaiful orang yang tepat?",
    expectedDomain: "recommendation",
    expectedKeywords: ["EduTech", "React", "pengalaman", "rekomendasi"],
    difficulty: "intermediate"
  },
  {
    id: 129,
    category: "Complex & Multi-Turn",
    title: "Pertanyaan Konteks Kata Ganti 'Dia'",
    query: "Dia tinggal di mana dan apa pekerjaan utamanya saat ini?",
    expectedDomain: "profile",
    expectedKeywords: ["Banjarmasin", "Developer", "Freelance"],
    difficulty: "intermediate"
  },
  {
    id: 130,
    category: "Complex & Multi-Turn",
    title: "Analisis Stack: React 19 vs Versi Lama",
    query: "Apa saja fitur baru React 19 seperti Server Actions dan useActionState yang relevan untuk proyek modern?",
    expectedDomain: "technical_deep",
    expectedKeywords: ["React 19", "Action", "Hook", "Performa"],
    difficulty: "advanced"
  },
  {
    id: 131,
    category: "Complex & Multi-Turn",
    title: "Perbandingan Database: Supabase vs MongoDB",
    query: "Kapan sebaiknya menggunakan relational Supabase (Postgres) dan kapan NoSQL Document store?",
    expectedDomain: "architecture",
    expectedKeywords: ["relasional", "schema", "NoSQL", "query"],
    difficulty: "intermediate"
  },
  {
    id: 132,
    category: "Complex & Multi-Turn",
    title: "Evaluasi Arsitektur Web Portofolio",
    query: "Bagaimana arsitektur website my-porto ini mengintegrasikan Supabase, LocalStorage, dan NLU lokal?",
    expectedDomain: "architecture",
    expectedKeywords: ["arsitektur", "knowledge base", "lokal", "Supabase"],
    difficulty: "advanced"
  },
  {
    id: 133,
    category: "Complex & Multi-Turn",
    title: "Rangkuman Pencapaian Terbesar",
    query: "Apa tiga pencapaian terbesar Syaiful di bidang akademik, karya web, dan kegiatan sosial?",
    expectedDomain: "milestones",
    expectedKeywords: ["proyek", "KKN", "sarjana", "prestasi"],
    difficulty: "intermediate"
  },
  {
    id: 134,
    category: "Complex & Multi-Turn",
    title: "Rekomendasi Rute Belajar Web Developer",
    query: "Kalau saya pemula mau jadi frontend developer handal seperti Syaiful, rute belajarnya bagaimana?",
    expectedDomain: "education_advice",
    expectedKeywords: ["HTML", "CSS", "JavaScript", "React", "Tailwind"],
    difficulty: "intermediate"
  },
  {
    id: 135,
    category: "Complex & Multi-Turn",
    title: "Pertanyaan Kelanjutan Konteks: 'Yang Tadi'",
    query: "Lalu bagaimana dengan proyek yang tadi kamu sebutkan, apakah open-source?",
    expectedDomain: "contextual",
    expectedKeywords: ["proyek", "GitHub", "repositori", "kode"],
    difficulty: "intermediate"
  },
  {
    id: 136,
    category: "Complex & Multi-Turn",
    title: "Saran Optimasi Kecepatan Loading Web",
    query: "Website saya lambat di HP, apa 3 hal pertama yang harus saya audit?",
    expectedDomain: "performance",
    expectedKeywords: ["gambar", "bundle", "cache", "Lighthouse"],
    difficulty: "intermediate"
  },
  {
    id: 137,
    category: "Complex & Multi-Turn",
    title: "Pertanyaan Integrasi Dua Halaman: Blog dan Penulis",
    query: "Apakah artikel di halaman /blog terhubung langsung ke profil penulis di /blog/authors?",
    expectedDomain: "navigation_flow",
    expectedKeywords: ["penulis", "blog", "terhubung", "profil"],
    difficulty: "intermediate"
  },
  {
    id: 138,
    category: "Complex & Multi-Turn",
    title: "Analisis Nilai Tambah Penggunaan Tailwind CSS 4",
    query: "Mengapa Tailwind v4 menggunakan CSS variables modern dan apa pengaruhnya terhadap ukuran build?",
    expectedDomain: "technical_deep",
    expectedKeywords: ["Tailwind", "CSS variables", "build", "ringan"],
    difficulty: "advanced"
  },
  {
    id: 139,
    category: "Complex & Multi-Turn",
    title: "Strategi Pengorganisasian State Chatbot",
    query: "Bagaimana cara chatbot SaipulAI menyimpan riwayat chat agar tidak hilang saat refresh?",
    expectedDomain: "chatbot_internals",
    expectedKeywords: ["LocalStorage", "state", "riwayat", "sesi"],
    difficulty: "intermediate"
  },
  {
    id: 140,
    category: "Complex & Multi-Turn",
    title: "Penilaian UI/UX Portofolio",
    query: "Bagaimana konsistensi palet warna Dark Glassmorphism diterapkan di seluruh halaman?",
    expectedDomain: "design_system",
    expectedKeywords: ["cyan", "glassmorphism", "konsistensi", "desain"],
    difficulty: "intermediate"
  },
  {
    id: 141,
    category: "Complex & Multi-Turn",
    title: "Pertanyaan Lanjutan: 'Berapa Harganya?'",
    query: "Berapa estimasi biaya jasa pembuatan website seperti ini?",
    expectedDomain: "business",
    expectedKeywords: ["kolaborasi", "diskusi", "kontak", "kebutuhan"],
    difficulty: "intermediate"
  },
  {
    id: 142,
    category: "Complex & Multi-Turn",
    title: "Korelasi KKN Haruyan Dayak dengan Pengembangan Masyarakat",
    query: "Bagaimana program KKN di Haruyan Dayak memberikan dampak berkelanjutan bagi desa?",
    expectedDomain: "impact",
    expectedKeywords: ["pendidikan", "sekolah", "masyarakat", "berkelanjutan"],
    difficulty: "intermediate"
  },
  {
    id: 143,
    category: "Complex & Multi-Turn",
    title: "Perbandingan CSR vs SSR di Aplikasi Web",
    query: "Kapan sebaiknya memilih Client-Side Rendering dan kapan Server-Side Rendering?",
    expectedDomain: "architecture",
    expectedKeywords: ["CSR", "SSR", "SEO", "performa", "server"],
    difficulty: "intermediate"
  },
  {
    id: 144,
    category: "Complex & Multi-Turn",
    title: "Peran Dokumentasi Teknis di Halaman /help/docs",
    query: "Apa tujuan dibuatnya halaman /help/docs dan dokumen AI di website portofolio ini?",
    expectedDomain: "docs",
    expectedKeywords: ["panduan", "arsitektur", "transparansi", "fitur"],
    difficulty: "basic"
  },
  {
    id: 145,
    category: "Complex & Multi-Turn",
    title: "Korelasi Sertifikasi Dicoding dengan Keahlian Nyata",
    query: "Bagaimana sertifikasi pemrograman yang diambil membuktikan kompetensi teknis Syaiful?",
    expectedDomain: "competency",
    expectedKeywords: ["sertifikat", "standar", "kompetensi", "proyek"],
    difficulty: "intermediate"
  },
  {
    id: 146,
    category: "Complex & Multi-Turn",
    title: "Studi Kasus Bug Fix Parsing Pesan Chatbot",
    query: "Bagaimana perbaikan bug parsing header ganda dan token leaked diselesaikan di ChatMessage?",
    expectedDomain: "debugging",
    expectedKeywords: ["regex", "parsing", "header", "format"],
    difficulty: "advanced"
  },
  {
    id: 147,
    category: "Complex & Multi-Turn",
    title: "Pandangan Tentang AI Open-Source vs Proprietary",
    query: "Apa keuntungan arsitektur AI lokal on-device dibanding bergantung pada API cloud berbayar?",
    expectedDomain: "ai_ethics",
    expectedKeywords: ["privasi", "biaya", "latensi", "mandiri"],
    difficulty: "intermediate"
  },
  {
    id: 148,
    category: "Complex & Multi-Turn",
    title: "Pertanyaan Bersyarat: 'Kalau Mau Kerja Sama'",
    query: "Kalau saya ingin menawarkan proyek magang atau kontrak full-time, ke mana dokumen harus dikirim?",
    expectedDomain: "contact_flow",
    expectedKeywords: ["email", "LinkedIn", "/contact", "syaifulmukmin.dev@gmail.com"],
    difficulty: "basic"
  },
  {
    id: 149,
    category: "Complex & Multi-Turn",
    title: "Pentingnya Komentar & Ulasan di Blog",
    query: "Mengapa fitur komentar penting untuk interaksi penulis dan pembaca di dashboard blog?",
    expectedDomain: "engagement",
    expectedKeywords: ["feedback", "diskusi", "komunitas", "interaksi"],
    difficulty: "basic"
  },
  {
    id: 150,
    category: "Complex & Multi-Turn",
    title: "Sintesis Menyeluruh Identitas Portofolio",
    query: "Jika kamu harus merangkum seluruh website portofolio ini dalam 3 kata kunci, apa kata kunci tersebut?",
    expectedDomain: "summary",
    expectedKeywords: ["Inovasi", "Kreativitas", "Edukasi", "Teknologi"],
    difficulty: "intermediate"
  }
];
