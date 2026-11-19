// Import langsung data proyek dari projects.json (Single Source of Truth)
import projectsData from "../../../data/projects.json";

// ━━━ HELPER UNTUK PROYEK DINAMIS DARI projects.json ━━━
const getEmojiForCategory = (cat = "") => {
  const lower = cat.toLowerCase();
  if (lower.includes("ai")) return "🤖";
  if (lower.includes("3d") || lower.includes("design")) return "🎨";
  if (lower.includes("edtech") || lower.includes("education")) return "🎓";
  if (lower.includes("health")) return "❤️";
  if (lower.includes("iot")) return "⚡";
  if (lower.includes("fintech")) return "💰";
  if (lower.includes("environment")) return "🌱";
  if (lower.includes("writing") || lower.includes("creative")) return "✍️";
  if (lower.includes("data")) return "📊";
  if (lower.includes("civic")) return "🏛️";
  if (lower.includes("lifestyle")) return "🍕";
  return "💻";
};

const getGradientForCategory = (cat = "") => {
  const lower = cat.toLowerCase();
  if (lower.includes("ai")) return "from-purple-600 via-indigo-600 to-pink-700";
  if (lower.includes("3d") || lower.includes("design")) return "from-pink-600 via-rose-600 to-amber-700";
  if (lower.includes("edtech") || lower.includes("education")) return "from-blue-600 via-cyan-600 to-teal-700";
  if (lower.includes("health")) return "from-rose-600 via-red-600 to-orange-700";
  if (lower.includes("iot")) return "from-amber-600 via-orange-600 to-yellow-700";
  if (lower.includes("fintech")) return "from-emerald-600 via-teal-600 to-cyan-700";
  if (lower.includes("environment")) return "from-green-600 via-emerald-600 to-teal-700";
  return "from-cyan-600 via-blue-600 to-indigo-700";
};

const getBadgeColorForLabel = (label = "") => {
  const lower = (label || "").toLowerCase();
  if (lower.includes("hot")) return "bg-red-500/20 text-red-300 border-red-500/30";
  if (lower.includes("rekomendasi")) return "bg-amber-500/20 text-amber-300 border-amber-500/30";
  if (lower.includes("unggulan")) return "bg-cyan-500/20 text-cyan-300 border-cyan-500/30";
  if (lower.includes("terbaru")) return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
  return "bg-blue-500/20 text-blue-300 border-blue-500/30";
};

// ━━━ KONVERSI OTOMATIS SELURUH PROYEK DARI projects.json ━━━
export const DYNAMIC_PROJECTS = (projectsData?.projects || []).map((p) => ({
  id: `project-${p.id}`,
  projectId: p.id,
  title: p.title,
  subtitle: p.subtitle || p.category,
  description: p.overview || p.description,
  category: "projects",
  categoryLabel: p.category || "Proyek Aplikasi",
  path: `/project-detail/${p.id}`,
  projectPath: `/projects/${p.id}`,
  isInternal: true,
  icon: "FolderGit2",
  emoji: getEmojiForCategory(p.category),
  themeGradient: getGradientForCategory(p.category),
  glowColor: "rgba(6, 182, 212, 0.4)",
  badge: p.label || "Proyek",
  badgeColor: getBadgeColorForLabel(p.label),
  status: p.status || "Selesai",
  rating: p.rating || 4.8,
  releaseYear: p.date ? p.date.substring(0, 4) : "2024",
  techStack: p.tech || [],
  keyFeatures: p.features || [],
  highlights: p.results || p.impact || p.goals,
  image: p.image,
  externalLink: p.link && p.link !== "#" ? p.link : null,
  repoLink: p.repo
}));

// ━━━ APLIKASI WEB INTERAKTIF & TOOLS INTERNAL WEBSITE (DARI App.jsx) ━━━
export const INTERNAL_TOOLS = [
  {
    id: "zodiak-calculator",
    title: "Zodiak & Horoskop Explorer",
    subtitle: "Astrology Hub & Interactive Insights",
    description: "Aplikasi interaktif lengkap untuk mengeksplorasi zodiak, horoskop harian, kecocokan pasangan (compatibility), ramalan kartu Tarot harian, numerologi nama, dan analisis kepribadian kosmik.",
    category: "tools",
    categoryLabel: "Tools Interaktif",
    path: "/zodiak",
    isInternal: true,
    icon: "Sparkles",
    emoji: "♈",
    themeGradient: "from-blue-600 via-indigo-600 to-purple-700",
    glowColor: "rgba(99, 102, 241, 0.4)",
    badge: "Populer 🔥",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    status: "Aktif",
    rating: 4.9,
    releaseYear: "2024 - 2026",
    techStack: ["React", "Tailwind CSS", "Framer Motion", "Lucide Icons"],
    keyFeatures: [
      "12 Horoskop Zodiak Barat & Shio Tionghoa",
      "Kalkulator Kecocokan Pasangan & Skor Cinta",
      "Tarot Reading Harian dengan Interpretasi Kartu",
      "Kalkulator Numerologi Nama & Tanggal Lahir",
      "Pelacak Mood Harian & Bagikan Hasil ke Medsos"
    ],
    highlights: "Multi-tab interaktif dengan efek visual kosmik modern",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "cek-qodam",
    title: "Cek Qodam Online",
    subtitle: "Spiritual Persona & Element Generator",
    description: "Aplikasi hiburan interaktif untuk mengungkap khodam atau entitas spiritual berdasarkan nama pengguna, dilengkapi visualisasi elemen (Api, Air, Angin, Tanah), efek suara, dan filosofi khodam.",
    category: "tools",
    categoryLabel: "Tools Interaktif",
    path: "/qodam",
    isInternal: true,
    icon: "Flame",
    emoji: "🔮",
    themeGradient: "from-red-600 via-orange-600 to-amber-700",
    glowColor: "rgba(239, 68, 68, 0.4)",
    badge: "Viral ⚡",
    badgeColor: "bg-red-500/20 text-red-300 border-red-500/30",
    status: "Aktif",
    rating: 4.9,
    releaseYear: "2024 - 2026",
    techStack: ["React", "Canvas Confetti", "Tailwind CSS", "Framer Motion"],
    keyFeatures: [
      "Algoritma penentuan khodam unik berbasis nama",
      "Visualisasi tema 4 elemen kosmik dinamis",
      "Statistik kekuatan, aura, dan filosofi mistis",
      "Fitur salin kartu & bagikan ke media sosial",
      "Riwayat pencarian nama pengguna sebelumnya"
    ],
    highlights: "Efek animasi partikel konfeti dan aura elemen dinamis",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "pesan-buat-kamu",
    title: "Pesan Spesial & Mini Game",
    subtitle: "Interactive Love Letter & Memory Game",
    description: "Aplikasi web interaktif romantis berisi surat digital terenkripsi, mini-game Tic-Tac-Toe romantis, pemutar musik latar, album kenangan foto, dan ledakan konfeti perayaan hati.",
    category: "tools",
    categoryLabel: "Tools Interaktif",
    path: "/buat-kamu",
    isInternal: true,
    icon: "Heart",
    emoji: "💖",
    themeGradient: "from-pink-600 via-rose-600 to-red-600",
    glowColor: "rgba(244, 63, 94, 0.4)",
    badge: "Spesial ❤️",
    badgeColor: "bg-pink-500/20 text-pink-300 border-pink-500/30",
    status: "Aktif",
    rating: 5.0,
    releaseYear: "2026",
    techStack: ["React", "Framer Motion", "Canvas Confetti", "Lucide Icons"],
    keyFeatures: [
      "Alur bertahap (Mode Cinta → Tic-Tac-Toe → Surat)",
      "Mini game Tic-Tac-Toe vs AI dengan reaksi gemas",
      "Pemutar musik audio latar & kontrol volume",
      "Galeri foto kenangan dengan lightbox slider",
      "Efek partikel floating hearts & konfeti interaktif"
    ],
    highlights: "Pengalaman web storytelling yang imersif dan emosional",
    image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "tahun-baru-celebration",
    title: "Happy New Year Celebration",
    subtitle: "Virtual Fireworks & Wishboard",
    description: "Aplikasi perayaan akhir tahun dengan simulasi kembang api visual di canvas, countdown pergantian tahun presisi tinggi, generator kartu ucapan, dan papan harapan interaktif.",
    category: "media",
    categoryLabel: "Media & Hiburan",
    path: "/year-end",
    isInternal: true,
    icon: "PartyPopper",
    emoji: "🎆",
    themeGradient: "from-yellow-500 via-amber-600 to-orange-700",
    glowColor: "rgba(245, 158, 11, 0.4)",
    badge: "Event 🎉",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    status: "Aktif",
    rating: 4.8,
    releaseYear: "2025 - 2026",
    techStack: ["React", "HTML5 Canvas", "Framer Motion", "Tailwind CSS"],
    keyFeatures: [
      "Simulasi kembang api fisika nyata pada Canvas 2D",
      "Countdown waktu riil menuju pergantian tahun",
      "Pengiriman & tampilan kartu harapan (Wish Wall)",
      "Audio efek ledakan dan musik perayaan",
      "Mode sambutan otomatis saat momen tahun baru tiba"
    ],
    highlights: "Animasi kembang api realistis dengan performa 60 FPS",
    image: "https://images.unsplash.com/photo-1498931299472-f7a63a5a1cfa?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "live-discussion",
    title: "Live Discussion Room",
    subtitle: "Realtime Streaming & Collaborative Chat",
    description: "Ruang diskusi siaran langsung dan interaksi waktu nyata (real-time chat) untuk menyelenggarakan sesi tanya jawab, webinar portofolio, dan interaksi pengunjung.",
    category: "community",
    categoryLabel: "Komunitas & Chat",
    path: "/Live-Discussion",
    isInternal: true,
    icon: "Radio",
    emoji: "🎙️",
    themeGradient: "from-violet-600 via-purple-700 to-indigo-800",
    glowColor: "rgba(139, 92, 246, 0.4)",
    badge: "Live 🔴",
    badgeColor: "bg-red-500/20 text-red-300 border-red-500/30",
    status: "Aktif",
    rating: 4.7,
    releaseYear: "2026",
    techStack: ["React", "Socket.io", "Tailwind CSS", "Framer Motion"],
    keyFeatures: [
      "Room diskusi publik dan terproteksi",
      "Dashboard percakapan dan moderasi langsung",
      "Profil pengguna interaktif dengan avatar",
      "Pemberitahuan pesan instan waktu nyata"
    ],
    highlights: "Integrasi socket dua arah untuk streaming percakapan",
    image: "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "discord-komoniti",
    title: "Komoniti Discord Hub",
    subtitle: "Community Workspace & Channels",
    description: "Platform komunitas web modern yang terinspirasi dari Discord, menyajikan sistem channel obrolan teks, kanal diskusi topik terarah, emoji reaksi, dan manajemen profil komunitas.",
    category: "community",
    categoryLabel: "Komunitas & Chat",
    path: "/discord",
    isInternal: true,
    icon: "MessageSquare",
    emoji: "💬",
    themeGradient: "from-indigo-600 via-blue-600 to-sky-700",
    glowColor: "rgba(59, 130, 246, 0.4)",
    badge: "Komunitas 👥",
    badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
    status: "Beta",
    rating: 4.6,
    releaseYear: "2026",
    techStack: ["React", "Supabase", "Tailwind CSS", "Emoji Picker"],
    keyFeatures: [
      "Struktur server channel (General, Info, Projek)",
      "Autentikasi akun & profil anggota",
      "Kirim pesan dan media gambar",
      "Dukungan emoji picker dan reaksi pesan"
    ],
    highlights: "Tampilan dark mode ala platform gamer modern",
    image: "https://images.unsplash.com/photo-1614680376593-902f749f7ffc?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "streming-tubs",
    title: "Streaming Media Tubs",
    subtitle: "Video & Entertainment Hub",
    description: "Aplikasi pemutar streaming video terpadu yang menampilkan antarmuka ramah pengguna, pengelompokan konten video edukasi & hiburan, dan pengalaman menonton responsif.",
    category: "media",
    categoryLabel: "Media & Hiburan",
    path: "/streming",
    isInternal: true,
    icon: "Tv",
    emoji: "🎬",
    themeGradient: "from-cyan-600 via-teal-600 to-emerald-700",
    glowColor: "rgba(6, 182, 212, 0.4)",
    badge: "Streaming 🍿",
    badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    status: "Beta",
    rating: 4.5,
    releaseYear: "2025 - 2026",
    techStack: ["React", "HTML5 Video", "Tailwind CSS"],
    keyFeatures: [
      "Katalog video terorganisir berdasarkan tema",
      "Player responsif dengan kontrol playback lengkap",
      "Fitur proteksi akses pengguna terdaftar",
      "Desain antarmuka imersif tanpa gangguan"
    ],
    highlights: "Pengalaman pemutaran mulus di desktop maupun smartphone",
    image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "blog-cms",
    title: "Blog & CMS Article Hub",
    subtitle: "Knowledge Base & Content Management",
    description: "Platform blogging dan sistem manajemen konten (CMS) berfitur lengkap dengan pencarian artikel instan (Fuzzy Search), kategori dinamis, pembaca Markdown, dan dashboard admin terproteksi.",
    category: "portfolio",
    categoryLabel: "Portofolio & CMS",
    path: "/blog",
    isInternal: true,
    icon: "BookOpen",
    emoji: "📰",
    themeGradient: "from-emerald-600 via-teal-600 to-cyan-700",
    glowColor: "rgba(16, 185, 129, 0.4)",
    badge: "CMS 📝",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    status: "Aktif",
    rating: 4.9,
    releaseYear: "2025 - 2026",
    techStack: ["React", "Remark GFM", "Fuse.js", "Tailwind CSS"],
    keyFeatures: [
      "Pencarian cerdas teks & tag menggunakan Fuse.js",
      "Rendering artikel Markdown & syntax highlight kode",
      "Sistem komentar dan reaksi pembaca",
      "Halaman rahasia admin untuk manajemen artikel",
      "Profil penulis dan estimasi waktu membaca"
    ],
    highlights: "Performa pencarian super cepat di sisi klien",
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "gallery-shorts",
    title: "Media Gallery & Memory Capsule",
    subtitle: "Visual Diary, Shorts & Album",
    description: "Eksplorasi visual multimedia terpadu yang memadukan tayangan video berformat Shorts, foto resolusi tinggi, album dokumentasi acara, dan kapsul kenangan digital berlinimasa.",
    category: "media",
    categoryLabel: "Media & Hiburan",
    path: "/gallery",
    isInternal: true,
    icon: "Image",
    emoji: "📸",
    themeGradient: "from-amber-600 via-orange-600 to-rose-700",
    glowColor: "rgba(245, 158, 11, 0.4)",
    badge: "Galeri 🖼️",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    status: "Aktif",
    rating: 4.8,
    releaseYear: "2025 - 2026",
    techStack: ["React", "Tailwind CSS", "Intersection Observer"],
    keyFeatures: [
      "Feed video Shorts vertikal dengan pemutaran otomatis",
      "Grid album foto dengan modal zoom lightbox",
      "Penyaring berdasarkan kategori & momen penting",
      "Performa render teroptimasi lazy loading"
    ],
    highlights: "Tampilan galeri modern bergaya platform sosial kekinian",
    image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "photography-portfolio",
    title: "Photography Showcase",
    subtitle: "Visual Arts & Lens Portfolio",
    description: "Ruang pamer fotografi profesional yang menyajikan tangkapan lensa lanskap, potret, dan arsitektur, lengkap dengan data teknis kamera (EXIF ISO/shutter speed/aperture).",
    category: "media",
    categoryLabel: "Media & Hiburan",
    path: "/photography",
    isInternal: true,
    icon: "Camera",
    emoji: "📷",
    themeGradient: "from-slate-700 via-gray-800 to-zinc-900",
    glowColor: "rgba(148, 163, 184, 0.4)",
    badge: "Foto 🎨",
    badgeColor: "bg-slate-500/20 text-slate-300 border-slate-500/30",
    status: "Aktif",
    rating: 4.9,
    releaseYear: "2024 - 2026",
    techStack: ["React", "Tailwind CSS", "Framer Motion"],
    keyFeatures: [
      "Tata letak grid masonry dinamis dan estetis",
      "Penampil gambar layar penuh resolusi ultra-tajam",
      "Informasi teknis peralatan kamera dan lensa",
      "Penyaring tema visual fotografi"
    ],
    highlights: "Estetika minimalis dengan penekanan pada kekuatan visual foto",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "portal-biolink",
    title: "Social Portal & Bio Link",
    subtitle: "Central Connection & Profile Gateway",
    description: "Gerbang utama profil digital (Link-in-bio) dengan tata letak adaptif khusus desktop dan smartphone, tombol salin kontak instan, rekap sertifikat, dan kartu tautan jejaring sosial.",
    category: "portfolio",
    categoryLabel: "Portofolio & CMS",
    path: "/portal",
    isInternal: true,
    icon: "Share2",
    emoji: "🔗",
    themeGradient: "from-sky-600 via-blue-700 to-indigo-800",
    glowColor: "rgba(14, 165, 233, 0.4)",
    badge: "Bio Link 🌐",
    badgeColor: "bg-sky-500/20 text-sky-300 border-sky-500/30",
    status: "Aktif",
    rating: 4.9,
    releaseYear: "2026",
    techStack: ["React", "Framer Motion", "Tailwind CSS"],
    keyFeatures: [
      "Tata letak pintar: Switch otomatis mode desktop/mobile",
      "Salin alamat email dan nomor telepon 1-klik",
      "Integrasi cepat ke GitHub, LinkedIn, Instagram, dsb.",
      "Cuplikan proyek & sertifikasi terpopuler"
    ],
    highlights: "Desain kartu interaktif modern pengganti Linktree konvensional",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "cv-digital",
    title: "Interactive CV & Resume",
    subtitle: "Professional Career Timeline",
    description: "Curriculum Vitae interaktif digital yang merangkum riwayat karier, pengalaman organisasi, penguasaan teknologi, dan pendidikan dalam format yang siap unduh serta ramah cetak PDF.",
    category: "portfolio",
    categoryLabel: "Portofolio & CMS",
    path: "/cv-saya",
    isInternal: true,
    icon: "FileText",
    emoji: "📄",
    themeGradient: "from-teal-600 via-cyan-700 to-blue-800",
    glowColor: "rgba(20, 184, 166, 0.4)",
    badge: "Resume 💼",
    badgeColor: "bg-teal-500/20 text-teal-300 border-teal-500/30",
    status: "Aktif",
    rating: 4.8,
    releaseYear: "2025 - 2026",
    techStack: ["React", "Tailwind CSS", "Print Styles"],
    keyFeatures: [
      "Linimasa karier kronologis interaktif",
      "Pemisahan bagian keahlian teknis & non-teknis",
      "Tombol unduh dan cetak CV ramah format A4",
      "Desain profesional berstandar industri modern"
    ],
    highlights: "Format bersih yang mudah dibaca oleh perekrut dan sistem ATS",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "softskills-radar",
    title: "Soft Skills Competency Hub",
    subtitle: "Radar Visualization & Leadership Skills",
    description: "Eksplorasi visual kompetensi soft skill dengan grafik radar interaktif, tingkat kemahiran, studi kasus penerapan nyata di lapangan, serta matriks evaluasi diri.",
    category: "portfolio",
    categoryLabel: "Portofolio & CMS",
    path: "/softskills",
    isInternal: true,
    icon: "Brain",
    emoji: "🧠",
    themeGradient: "from-purple-600 via-fuchsia-600 to-pink-700",
    glowColor: "rgba(168, 85, 247, 0.4)",
    badge: "Skills ⚡",
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    status: "Aktif",
    rating: 4.8,
    releaseYear: "2026",
    techStack: ["React", "Recharts", "Tailwind CSS", "Framer Motion"],
    keyFeatures: [
      "Visualisasi radar polygon interaktif",
      "Detail studi kasus pemecahan masalah nyata",
      "Tingkat keahlian (Komunikasi, Problem Solving, dll.)",
      "Testimoni rekan tim dan kolaborator"
    ],
    highlights: "Pemetaan kompetensi holistik berbasis visualisasi data",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "portal-akademik",
    title: "Portal Akademik S1-PGMI",
    subtitle: "University Journey & Thesis Defense",
    description: "Sistem dokumentasi perjalanan perkuliahan sarjana, merangkum kegiatan Kuliah Kerja Nyata (KKN Desa Kundan), Seminar Proposal (Sempro), Sidang Skripsi, hingga seremoni Wisuda.",
    category: "academic",
    categoryLabel: "Akademik & Edukasi",
    path: "/S1-PGMI",
    isInternal: true,
    icon: "GraduationCap",
    emoji: "🎓",
    themeGradient: "from-blue-700 via-indigo-700 to-cyan-800",
    glowColor: "rgba(37, 99, 235, 0.4)",
    badge: "Akademik 📜",
    badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    status: "Aktif",
    rating: 5.0,
    releaseYear: "2024 - 2026",
    techStack: ["React", "Tailwind CSS", "Framer Motion"],
    keyFeatures: [
      "Linimasa tahapan kelulusan S1 PGMI",
      "Galeri dokumentasi program pengabdian KKN",
      "Ringkasan skripsi dan berkas hasil sidang",
      "Dokumentasi seremoni wisuda sarjana"
    ],
    highlights: "Arsip perjalanan pendidikan tinggi yang rapi dan terstruktur",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "certificates-explorer",
    title: "Certificates & Credentials Explorer",
    subtitle: "Verified Badges & Accreditations",
    description: "Pusat kredensial dan sertifikasi resmi dari berbagai lembaga pelatihan teknologi dan institusi akademik, dilengkapi nomor identifikasi verifikasi dan pratinjau dokumen sertifikat.",
    category: "academic",
    categoryLabel: "Akademik & Edukasi",
    path: "/certificates",
    isInternal: true,
    icon: "Award",
    emoji: "🏆",
    themeGradient: "from-amber-600 via-yellow-600 to-orange-700",
    glowColor: "rgba(234, 179, 8, 0.4)",
    badge: "Kredensial 🎖️",
    badgeColor: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    status: "Aktif",
    rating: 4.9,
    releaseYear: "2024 - 2026",
    techStack: ["React", "Tailwind CSS", "Modal Engine"],
    keyFeatures: [
      "Filter sertifikat berdasarkan penerbit dan keahlian",
      "Pemeriksaan nomor credential ID resmi",
      "Modal inspeksi resolusi tinggi untuk setiap sertifikat",
      "Penilaian bintang & relevansi industri"
    ],
    highlights: "Bukti kompetensi terverifikasi dengan pratinjau instan",
    image: "https://images.unsplash.com/photo-1589330694653-dad6ef49cf6f?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "ai-docs-assistant",
    title: "AI Docs & Knowledge Center",
    subtitle: "Interactive Documentation & Chatbot",
    description: "Pusat bantuan cerdas berbasis kecerdasan buatan (AI) yang mencakup dokumentasi interaktif website, panduan keamanan dan privasi, riwayat FAQ, serta konfigurasi asisten virtual.",
    category: "tools",
    categoryLabel: "Tools Interaktif",
    path: "/help/docs/ai",
    isInternal: true,
    icon: "Bot",
    emoji: "🤖",
    themeGradient: "from-cyan-600 via-blue-600 to-indigo-700",
    glowColor: "rgba(6, 182, 212, 0.4)",
    badge: "AI Powered 🧠",
    badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    status: "Aktif",
    rating: 4.9,
    releaseYear: "2026",
    techStack: ["React", "Sentiment Analysis", "Tailwind CSS"],
    keyFeatures: [
      "Dokumentasi navigasi otomatis untuk semua fitur situs",
      "Asisten AI tanya-jawab seputar portofolio dan pembuat",
      "Panel pengaturan preferensi chatbot",
      "Panduan transparansi keamanan & privasi data"
    ],
    highlights: "Membantu pengunjung menemukan informasi secara instan lewat percakapan",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "bahasa-explorer",
    title: "Bahasa & Multilingual Hub",
    subtitle: "Linguistic Journey & Vocabulary",
    description: "Eksplorasi wawasan multibahasa (Bahasa Indonesia, Bahasa Inggris, Bahasa Arab, dan daerah) dengan kartu kosa kata, level kefasihan berbicara, dan catatan linguistik.",
    category: "academic",
    categoryLabel: "Akademik & Edukasi",
    path: "/bahasa",
    isInternal: true,
    icon: "Languages",
    emoji: "🌐",
    themeGradient: "from-emerald-700 via-teal-700 to-cyan-800",
    glowColor: "rgba(16, 185, 129, 0.4)",
    badge: "Linguistik 📚",
    badgeColor: "bg-teal-500/20 text-teal-300 border-teal-500/30",
    status: "Aktif",
    rating: 4.7,
    releaseYear: "2025 - 2026",
    techStack: ["React", "Tailwind CSS", "Framer Motion"],
    keyFeatures: [
      "Kartu interaktif kosakata dan tata bahasa",
      "Indikator tingkat kefasihan (CEFR Scale)",
      "Audio pengucapan kata dan contoh kalimat kontekstual",
      "Pencarian kata kunci dan istilah penting"
    ],
    highlights: "Mendukung eksplorasi komunikasi lintas budaya",
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=900&q=80"
  }
];

// ━━━ GABUNGAN DATA APLIKASI LENGKAP ━━━
export const APPS_DATA = [
  ...INTERNAL_TOOLS,
  ...DYNAMIC_PROJECTS
];

// ━━━ KATEGORI FILTER DENGAN JUMLAH DINAMIS ━━━
export const APP_CATEGORIES = [
  { id: "all", label: "Semua Aplikasi & Proyek", icon: "LayoutGrid", count: APPS_DATA.length },
  { id: "projects", label: "Portofolio Proyek (projects.json)", icon: "FolderCode", count: DYNAMIC_PROJECTS.length },
  { id: "tools", label: "Web Tools & Interaktif", icon: "Sparkles", count: APPS_DATA.filter((a) => a.category === "tools").length },
  { id: "community", label: "Komunitas & Chat", icon: "Users", count: APPS_DATA.filter((a) => a.category === "community").length },
  { id: "media", label: "Media & Hiburan", icon: "PlaySquare", count: APPS_DATA.filter((a) => a.category === "media").length },
  { id: "portfolio", label: "Portofolio & CMS", icon: "Briefcase", count: APPS_DATA.filter((a) => a.category === "portfolio").length },
  { id: "academic", label: "Akademik & Edukasi", icon: "GraduationCap", count: APPS_DATA.filter((a) => a.category === "academic").length }
];
