/**
 * 07_navigation_community.js
 * Situasi 151 - 175: Pemandu Navigasi Website, Fitur Komunitas Live & Penanganan Kode Error
 */

export const navigationCommunitySituations = [
  {
    id: 151,
    category: "Navigation & Community",
    title: "Navigasi ke Halaman Proyek",
    query: "Saya mau melihat daftar proyek lengkap, link halamannya apa?",
    expectedDomain: "site_directory",
    expectedKeywords: ["/projects", "Showcase", "Proyek"],
    difficulty: "basic"
  },
  {
    id: 152,
    category: "Navigation & Community",
    title: "Navigasi ke CV Digital",
    query: "Di mana rute untuk membaca CV online Syaiful?",
    expectedDomain: "site_directory",
    expectedKeywords: ["/cv-saya", "CV", "Karir"],
    difficulty: "basic"
  },
  {
    id: 153,
    category: "Navigation & Community",
    title: "Navigasi ke Galeri Pagelaran Seni",
    query: "Bagaimana cara menuju halaman galeri foto dan album seni?",
    expectedDomain: "site_directory",
    expectedKeywords: ["/gallery", "Galeri", "Foto"],
    difficulty: "basic"
  },
  {
    id: 154,
    category: "Navigation & Community",
    title: "Navigasi ke Halaman Visi & Misi",
    query: "Halaman apa yang menjelaskan visi misi dan timeline hidup Syaiful?",
    expectedDomain: "site_directory",
    expectedKeywords: ["/visi", "Visi", "Misi"],
    difficulty: "basic"
  },
  {
    id: 155,
    category: "Navigation & Community",
    title: "Navigasi ke Laporan Pengabdian KKN",
    query: "Bisa beri link ke halaman laporan KKN Desa Kundan?",
    expectedDomain: "site_directory",
    expectedKeywords: ["/kkn", "KKN", "Desa Kundan"],
    difficulty: "basic"
  },
  {
    id: 156,
    category: "Navigation & Community",
    title: "Navigasi ke Live Discussion Room",
    query: "Bagaimana cara saya masuk ke ruang obrolan langsung (Live Room)?",
    expectedDomain: "site_directory",
    expectedKeywords: ["/Live-Discussion", "Live", "Diskusi"],
    difficulty: "basic"
  },
  {
    id: 157,
    category: "Navigation & Community",
    title: "Navigasi ke Pusat Bantuan & FAQ",
    query: "Di mana saya bisa melihat daftar FAQ dan dokumentasi?",
    expectedDomain: "site_directory",
    expectedKeywords: ["/help/faq", "/help/docs", "FAQ"],
    difficulty: "basic"
  },
  {
    id: 158,
    category: "Navigation & Community",
    title: "Navigasi ke Portal Tautan Lengkap",
    query: "Apakah ada satu halaman portal yang merangkum semua link sosial media?",
    expectedDomain: "site_directory",
    expectedKeywords: ["/portal", "Portal", "Navigasi"],
    difficulty: "basic"
  },
  {
    id: 159,
    category: "Navigation & Community",
    title: "Navigasi ke Form Kontak Kolaborasi",
    query: "Saya ingin kirim pesan pribadi, rute halamannya apa?",
    expectedDomain: "site_directory",
    expectedKeywords: ["/contact", "Kontak", "Hubungi"],
    difficulty: "basic"
  },
  {
    id: 160,
    category: "Navigation & Community",
    title: "Navigasi ke Pengaturan Chatbot AI",
    query: "Di mana halaman untuk mengubah nada bicara atau kepribadian SaipulAI?",
    expectedDomain: "site_directory",
    expectedKeywords: ["/help/chatbot/settings", "Pengaturan", "Chatbot"],
    difficulty: "intermediate"
  },
  {
    id: 161,
    category: "Navigation & Community",
    title: "Fitur Live Room: Menyapa @Saipul",
    query: "Apakah saya bisa memanggil kamu langsung di room obrolan komunitas?",
    expectedDomain: "community_feature",
    expectedKeywords: ["@saipul", "@ai", "Live-Discussion", "respon"],
    difficulty: "intermediate"
  },
  {
    id: 162,
    category: "Navigation & Community",
    title: "Tingkatan Lencana Role di Live Room",
    query: "Apa saja tingkatan badge pengguna di room diskusi live?",
    expectedDomain: "community_feature",
    expectedKeywords: ["Super Admin", "Admin", "Moderator", "Premium", "Verified", "User"],
    difficulty: "intermediate"
  },
  {
    id: 163,
    category: "Navigation & Community",
    title: "Aturan Slowmode Cooldown Chat",
    query: "Kenapa di room live ada jeda waktu sebelum bisa kirim pesan lagi?",
    expectedDomain: "community_feature",
    expectedKeywords: ["Slowmode", "cooldown", "spam", "nyaman"],
    difficulty: "intermediate"
  },
  {
    id: 164,
    category: "Navigation & Community",
    title: "Fitur AI Summarizer Modal di Live Room",
    query: "Bagaimana cara mendapatkan ringkasan otomatis dari 50 pesan terakhir di room?",
    expectedDomain: "community_feature",
    expectedKeywords: ["AISummarizerModal", "ringkasan", "topik", "aktif"],
    difficulty: "intermediate"
  },
  {
    id: 165,
    category: "Navigation & Community",
    title: "Fitur Polling Komunitas",
    query: "Apakah anggota komunitas bisa membuat polling suara di live chat?",
    expectedDomain: "community_feature",
    expectedKeywords: ["Poll", "polling", "suara", "komunitas"],
    difficulty: "intermediate"
  },
  {
    id: 166,
    category: "Navigation & Community",
    title: "Penjelasan Error 404 Not Found",
    query: "Saya dapat pesan error 404 di salah satu halaman, artinya apa?",
    expectedDomain: "troubleshooting",
    expectedKeywords: ["404", "tidak ditemukan", "URL", "periksa"],
    difficulty: "basic"
  },
  {
    id: 167,
    category: "Navigation & Community",
    title: "Penjelasan Error 503 Maintenance",
    query: "Kalau muncul halaman 503 Maintenance, apa yang sedang terjadi?",
    expectedDomain: "troubleshooting",
    expectedKeywords: ["503", "pemeliharaan", "server", "stabil"],
    difficulty: "basic"
  },
  {
    id: 168,
    category: "Navigation & Community",
    title: "Penjelasan Error 401 Unauthorized",
    query: "Kenapa saya diarahkan ke halaman 401 Unauthorized?",
    expectedDomain: "troubleshooting",
    expectedKeywords: ["401", "login", "izin", "akses"],
    difficulty: "basic"
  },
  {
    id: 169,
    category: "Navigation & Community",
    title: "Troubleshooting Suara Chatbot Tidak Keluar",
    query: "Fitur text-to-speech suara chatbot tidak bersuara di browser saya, kenapa ya?",
    expectedDomain: "troubleshooting",
    expectedKeywords: ["suara", "pengaturan", "browser", "TTS"],
    difficulty: "intermediate"
  },
  {
    id: 170,
    category: "Navigation & Community",
    title: "Troubleshooting Mode Offline / Koneksi Terputus",
    query: "Muncul notifikasi koneksi terputus saat chat dengan kamu, apa solusinya?",
    expectedDomain: "troubleshooting",
    expectedKeywords: ["jaringan", "koneksi", "refresh", "internet"],
    difficulty: "basic"
  },
  {
    id: 171,
    category: "Navigation & Community",
    title: "Cara Menjadi Penulis Kontributor Blog",
    query: "Bagaimana cara agar profil saya bisa terdaftar sebagai penulis di blog?",
    expectedDomain: "blog_community",
    expectedKeywords: ["admin", "dashboard", "kolaborasi", "penulis"],
    difficulty: "intermediate"
  },
  {
    id: 172,
    category: "Navigation & Community",
    title: "Panduan Menghubungi Penulis via Modal Interaktif",
    query: "Bagaimana cara mengirim pesan langsung ke penulis dari halaman profilnya?",
    expectedDomain: "blog_community",
    expectedKeywords: ["Hubungi Penulis", "modal", "email", "pesan"],
    difficulty: "intermediate"
  },
  {
    id: 173,
    category: "Navigation & Community",
    title: "Pemberitahuan Update Versi Website",
    query: "Bagaimana saya tahu jika ada versi pembaruan fitur baru di website ini?",
    expectedDomain: "changelog",
    expectedKeywords: ["UpdateNotification", "versi", "changelog", "/help/version"],
    difficulty: "basic"
  },
  {
    id: 174,
    category: "Navigation & Community",
    title: "Cara Menghapus Riwayat Obrolan Chat",
    query: "Bagaimana cara membersihkan pesan riwayat obrolan di jendela chat SaipulAI?",
    expectedDomain: "chat_controls",
    expectedKeywords: ["hapus", "ikon sampah", "riwayat", "bersih"],
    difficulty: "basic"
  },
  {
    id: 175,
    category: "Navigation & Community",
    title: "Navigasi ke Halaman Hiburan Zodiak & Qodam",
    query: "Di mana rute halaman game interaktif zodiak dan cek qodam?",
    expectedDomain: "site_directory",
    expectedKeywords: ["/zodiak", "/qodam", "interaktif"],
    difficulty: "basic"
  }
];
