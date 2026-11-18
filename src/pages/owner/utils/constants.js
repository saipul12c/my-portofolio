// Constants for Profile_admin (/owner) page
// Updated to match accurate personal facts and portfolio links

export const OWNER_FACTS = {
  name: "Muhammad Syaiful Mukmin",
  role: "Pendidik Digital & Web Developer",
  tagline: "EduTech Specialist • Calon Pendidik MI • Frontend Developer",
  academicStatus: "Mahasiswa S1 Pendidikan Guru Madrasah Ibtidaiyah (PGMI)",
  statusAvailability: "Tersedia untuk Kolaborasi Proyek & EduTech",
  email: "uju355@gmail.com",
  phone: "+62 812-3456-7890",
  location: "Jakarta, Indonesia",
  githubUrl: "https://github.com/saipul12c",
  instagramUrl: "https://instagram.com/saipul12c",
  whatsappUrl: "https://wa.me/6281234567890",
  threadsUrl: "https://www.threads.net/@saipul12c",
  tiktokUrl: "https://www.tiktok.com/@saipul12c"
};

export const CONTACT_INFO = {
  email: OWNER_FACTS.email,
  phone: OWNER_FACTS.phone,
  location: OWNER_FACTS.location,
  github: OWNER_FACTS.githubUrl,
  instagram: OWNER_FACTS.instagramUrl,
  whatsapp: OWNER_FACTS.whatsappUrl
};

export const DEFAULT_DESCRIPTION =
  "Saya adalah Muhammad Syaiful Mukmin, calon pendidik (S1 PGMI) yang berkomitmen menggabungkan teknologi modern, kreativitas, dan pedagogi untuk menciptakan media pembelajaran interaktif yang inspiratif, efektif, dan berdaya guna bagi generasi digital.";

export const VISION_MISSION = {
  vision:
    "Mewujudkan ekosistem pembelajaran digital yang transformatif melalui perpaduan pedagogi berpusat pada siswa, rekayasa web modern, dan desain interaktif yang inklusif.",
  mission:
    "Fokus mengembangkan media pembelajaran interaktif berbasis web, mengintegrasikan teknologi ke dalam kurikulum dasar, serta membagikan wawasan EduTech yang mudah dipahami.",
  values: [
    "Pendidikan Inklusif",
    "Teknologi Adaptif",
    "Desain Berpusat Pengguna",
    "Pedagogi Bermakna",
    "Inovasi Berkelanjutan"
  ]
};

export const SLICE_LIMITS = {
  recentProjects: 4,
  recentTestimonials: 3,
  topSoftSkills: 8,
  recentBlogs: 4,
  recentCertificates: 4,
  topHobbies: 6,
  commitments: 4,
  pendidikan: 4
};

export const LABEL_COLORS = {
  'Rekomendasi': 'bg-purple-500/20 text-purple-300 border border-purple-500/40',
  'Baru': 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40',
  'Hot': 'bg-red-500/20 text-red-300 border border-red-500/40',
  'default': 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
};

// Navigasi terhubung ke seluruh ekosistem halaman aplikasi
export const CONNECTED_PAGES = [
  {
    category: "Profil & Pribadi",
    description: "Kenali latar belakang, filosofi, dan perjalanan pribadi",
    links: [
      { to: "/about", label: "Tentang Saya", desc: "Profil lengkap & personalia", icon: "User", color: "from-cyan-500 to-blue-600" },
      { to: "/cv-saya", label: "Curriculum Vitae", desc: "CV digital & rekap profesional", icon: "FileText", color: "from-blue-500 to-indigo-600" },
      { to: "/visi", label: "Visi & Misi", desc: "Arah & tujuan profesional", icon: "Target", color: "from-purple-500 to-pink-600" },
      { to: "/hobbies", label: "Hobi & Minat", desc: "Aktivitas kreatif di luar kerja", icon: "Heart", color: "from-rose-500 to-orange-500" },
      { to: "/bahasa", label: "Kemampuan Bahasa", desc: "Penguasaan bahasa komunikasi", icon: "Globe", color: "from-emerald-500 to-teal-600" }
    ]
  },
  {
    category: "Akademik & Perguruan Tinggi",
    description: "Jejak studi S1 PGMI dan tahapan kelulusan",
    links: [
      { to: "/S1-PGMI", label: "S1 PGMI", desc: "Pendidikan Guru Madrasah Ibtidaiyah", icon: "GraduationCap", color: "from-amber-500 to-yellow-600" },
      { to: "/education", label: "Riwayat Pendidikan", desc: "Seluruh jenjang pendidikan & lisensi", icon: "BookOpen", color: "from-teal-500 to-cyan-600" },
      { to: "/kkn", label: "Kuliah Kerja Nyata (KKN)", desc: "Pengabdian masyarakat Desa Kundan", icon: "Users", color: "from-lime-500 to-emerald-600" },
      { to: "/sempro-skripsi", label: "Sempro Skripsi", desc: "Seminar proposal penelitian", icon: "FileCheck", color: "from-indigo-500 to-blue-600" },
      { to: "/sidang-skripsi", label: "Sidang Skripsi", desc: "Ujian komprehensif kelulusan", icon: "Award", color: "from-violet-500 to-purple-600" },
      { to: "/wisuda", label: "Wisuda Sarjana", desc: "Pelepasan & momen kelulusan", icon: "Sparkles", color: "from-pink-500 to-rose-600" }
    ]
  },
  {
    category: "Karya & Portofolio",
    description: "Hasil karya nyata, pengakuan, dan artikel publikasi",
    links: [
      { to: "/projects", label: "Katalog Proyek", desc: "Eksplorasi seluruh karya web & edutech", icon: "Briefcase", color: "from-cyan-500 to-teal-500" },
      { to: "/certificates", label: "Sertifikat & Lisensi", desc: "Bukti kompetensi tersertifikasi", icon: "Award", color: "from-amber-500 to-orange-500" },
      { to: "/SoftSkills", label: "Soft Skills", desc: "Keahlian interpersonal & leadership", icon: "Zap", color: "from-yellow-500 to-amber-600" },
      { to: "/blog", label: "Blog & Wawasan", desc: "Artikel edukasi dan teknologi", icon: "BookOpen", color: "from-blue-500 to-cyan-600" },
      { to: "/testimoni", label: "Testimoni & Mitra", desc: "Ulasan klien dan kolaborator", icon: "MessageSquare", color: "from-emerald-500 to-green-600" },
      { to: "/gallery", label: "Galeri & Kenangan", desc: "Arsip visual momen berharga", icon: "Image", color: "from-purple-500 to-violet-600" },
      { to: "/photography", label: "Fotografi Digital", desc: "Karya visual lensa kamera", icon: "Camera", color: "from-sky-500 to-blue-600" }
    ]
  },
  {
    category: "Layanan & Hubungi",
    description: "Jalur komunikasi dan pusat informasi sistem",
    links: [
      { to: "/contact", label: "Hubungi Langsung", desc: "Kirim pesan & kolaborasi", icon: "Mail", color: "from-cyan-500 to-blue-500" },
      { to: "/help/commitment", label: "Nilai & Komitmen", desc: "Standar mutu dan integritas", icon: "Shield", color: "from-emerald-500 to-teal-600" },
      { to: "/portal", label: "Portal Interaktif", desc: "Pusat akses cepat terpadu", icon: "Compass", color: "from-indigo-500 to-purple-600" },
      { to: "/help/faq", label: "Pusat Bantuan & FAQ", desc: "Pertanyaan yang sering diajukan", icon: "HelpCircle", color: "from-slate-600 to-slate-800" }
    ]
  }
];
