/**
 * 01_portfolio_factual.js
 * Situasi 1 - 25: Pertanyaan Faktual Seputar Portofolio, Identitas, Karir & Karya
 */

export const portfolioFactualSituations = [
  {
    id: 1,
    category: "Portfolio Factual",
    title: "Profil & Biografi Syaiful",
    query: "Siapa itu Muhammad Syaiful Mukmin?",
    expectedDomain: "profile",
    expectedKeywords: ["Syaiful", "Developer", "Software", "Web"],
    difficulty: "basic"
  },
  {
    id: 2,
    category: "Portfolio Factual",
    title: "Profil Penulis Blog",
    query: "Siapa profil penulis di blog ini?",
    expectedDomain: "author_profile",
    expectedKeywords: ["Penulis", "M. Syaiful Mukmin", "Bio", "Keahlian"],
    difficulty: "basic"
  },
  {
    id: 3,
    category: "Portfolio Factual",
    title: "Pengalaman Kerja & Karir",
    query: "Apa saja pengalaman kerja dan karir Syaiful?",
    expectedDomain: "experience",
    expectedKeywords: ["Full Stack", "Developer", "EduTech", "Freelance"],
    difficulty: "basic"
  },
  {
    id: 4,
    category: "Portfolio Factual",
    title: "Spesialisasi Frontend",
    query: "Apa spesialisasi frontend development Syaiful?",
    expectedDomain: "specialization",
    expectedKeywords: ["Frontend", "React", "Tailwind", "Vite"],
    difficulty: "basic"
  },
  {
    id: 5,
    category: "Portfolio Factual",
    title: "Spesialisasi Backend",
    query: "Jelaskan keahlian Syaiful di bidang backend",
    expectedDomain: "specialization",
    expectedKeywords: ["Backend", "Node", "Database", "API"],
    difficulty: "basic"
  },
  {
    id: 6,
    category: "Portfolio Factual",
    title: "Daftar Proyek Web Unggulan",
    query: "Sebutkan proyek-proyek web yang pernah dikembangkan",
    expectedDomain: "project",
    expectedKeywords: ["Projek", "Web", "Teknologi"],
    difficulty: "basic"
  },
  {
    id: 7,
    category: "Portfolio Factual",
    title: "Galeri Foto Pagelaran Seni",
    query: "Koleksi album foto apa saja yang ada di galeri pagelaran seni?",
    expectedDomain: "gallery",
    expectedKeywords: ["Pagelaran Seni", "Poster", "Angkatan 22", "UIN Antasari"],
    difficulty: "intermediate"
  },
  {
    id: 8,
    category: "Portfolio Factual",
    title: "Foto Studio Portrait 5R",
    query: "Apakah ada dokumentasi foto studio portrait 5R dan menggunakan kamera apa?",
    expectedDomain: "gallery",
    expectedKeywords: ["5R", "Canon", "Studio"],
    difficulty: "intermediate"
  },
  {
    id: 9,
    category: "Portfolio Factual",
    title: "Pengalaman KKN di Desa Kundan",
    query: "Ceritakan kegiatan KKN Syaiful di Desa Kundan Haruyan Dayak",
    expectedDomain: "academic",
    expectedKeywords: ["KKN", "Desa Kundan", "Haruyan Dayak", "UIN Antasari", "HARDAY FEST"],
    difficulty: "intermediate"
  },
  {
    id: 10,
    category: "Portfolio Factual",
    title: "Dosen Pembimbing Lapangan KKN",
    query: "Siapa nama DPL dan Kepala Desa saat KKN di Haruyan Dayak?",
    expectedDomain: "academic",
    expectedKeywords: ["Dr. Nuryadin", "Suhadi Anang"],
    difficulty: "intermediate"
  },
  {
    id: 11,
    category: "Portfolio Factual",
    title: "Program Studi & Fakultas",
    query: "Syaiful kuliah jurusan apa dan di universitas mana?",
    expectedDomain: "academic",
    expectedKeywords: ["PGMI", "UIN Antasari", "Tarbiyah"],
    difficulty: "basic"
  },
  {
    id: 12,
    category: "Portfolio Factual",
    title: "Visi Hidup & Profesional",
    query: "Apa visi hidup dan karir Syaiful?",
    expectedDomain: "visi_misi",
    expectedKeywords: ["Visi", "Pendidik", "Edukasi", "Inovasi"],
    difficulty: "basic"
  },
  {
    id: 13,
    category: "Portfolio Factual",
    title: "Misi Utama Syaiful",
    query: "Sebutkan misi utama yang diemban Syaiful",
    expectedDomain: "visi_misi",
    expectedKeywords: ["Misi", "Solusi", "Digital", "Kolaboratif"],
    difficulty: "basic"
  },
  {
    id: 14,
    category: "Portfolio Factual",
    title: "Timeline Perjalanan Karir",
    query: "Bagaimana timeline perjalanan karir Syaiful dari 2021 hingga 2025?",
    expectedDomain: "visi_misi",
    expectedKeywords: ["2021", "2022", "2023", "2025"],
    difficulty: "intermediate"
  },
  {
    id: 15,
    category: "Portfolio Factual",
    title: "Sertifikasi & Kredensial",
    query: "Apa saja sertifikat resmi yang dimiliki Syaiful?",
    expectedDomain: "certificate",
    expectedKeywords: ["Sertifikat", "Kompetensi", "Penerbit"],
    difficulty: "basic"
  },
  {
    id: 16,
    category: "Portfolio Factual",
    title: "Soft Skills Utama",
    query: "Apa saja soft skills dan kemampuan interpersonal Syaiful?",
    expectedDomain: "skill",
    expectedKeywords: ["Skill", "Komunikasi", "Kepemimpinan", "Kerja Tim"],
    difficulty: "basic"
  },
  {
    id: 17,
    category: "Portfolio Factual",
    title: "Komitmen Layanan Profesional",
    query: "Apa komitmen kerja dan kode etik yang dipegang Syaiful?",
    expectedDomain: "commitment",
    expectedKeywords: ["Komitmen", "Clean Code", "Kualitas", "Dedikasi"],
    difficulty: "basic"
  },
  {
    id: 18,
    category: "Portfolio Factual",
    title: "Akun Media Sosial & Kontak",
    query: "Bagaimana cara menghubungi Syaiful di Instagram dan LinkedIn?",
    expectedDomain: "portal_platforms",
    expectedKeywords: ["@saipul16_", "LinkedIn", "Instagram"],
    difficulty: "basic"
  },
  {
    id: 19,
    category: "Portfolio Factual",
    title: "Kemampuan Bahasa Asing & Daerah",
    query: "Bahasa apa saja yang dikuasai Syaiful?",
    expectedDomain: "languages",
    expectedKeywords: ["Indonesia", "Banjar", "Inggris", "Arab"],
    difficulty: "basic"
  },
  {
    id: 20,
    category: "Portfolio Factual",
    title: "Hobi dan Minat Personal",
    query: "Apa saja hobi dan minat di luar pekerjaan ngoding?",
    expectedDomain: "hobbies",
    expectedKeywords: ["Fotografi", "Membaca", "Riset"],
    difficulty: "basic"
  },
  {
    id: 21,
    category: "Portfolio Factual",
    title: "Testimoni & Klien",
    query: "Bagaimana tanggapan dan testimoni klien terhadap hasil kerja Syaiful?",
    expectedDomain: "testimonials",
    expectedKeywords: ["Testimoni", "Rating", "Puas", "Kolaborasi"],
    difficulty: "basic"
  },
  {
    id: 22,
    category: "Portfolio Factual",
    title: "Platform Masa Depan CreativeHub",
    query: "Apa itu platform CreativeHub di halaman coming soon?",
    expectedDomain: "coming_soon",
    expectedKeywords: ["CreativeHub", "Platform", "Komunitas", "Livestreaming"],
    difficulty: "intermediate"
  },
  {
    id: 23,
    category: "Portfolio Factual",
    title: "Status Maintenance Website",
    query: "Apakah saat ini website sedang dalam mode pemeliharaan (maintenance)?",
    expectedDomain: "maintenance",
    expectedKeywords: ["Sistem", "Server", "Stabil"],
    difficulty: "intermediate"
  },
  {
    id: 24,
    category: "Portfolio Factual",
    title: "Fitur Zodiak Aries",
    query: "Coba jelaskan karakteristik zodiak Aries menurut database kamu",
    expectedDomain: "zodiac",
    expectedKeywords: ["Aries", "Api", "Mars", "Berani"],
    difficulty: "basic"
  },
  {
    id: 25,
    category: "Portfolio Factual",
    title: "Fitur Qodam Harimau Putih",
    query: "Apa arti qodam Harimau Putih di website ini?",
    expectedDomain: "qodam",
    expectedKeywords: ["Harimau Putih", "Tanah", "Pemimpin", "Spiritual"],
    difficulty: "basic"
  }
];
