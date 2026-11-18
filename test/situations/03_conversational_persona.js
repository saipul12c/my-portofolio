/**
 * 03_conversational_persona.js
 * Situasi 51 - 75: Interaksi Sosial, Persona AI, Empati, Humor & Percakapan Alami
 */

export const conversationalPersonaSituations = [
  {
    id: 51,
    category: "Conversational & Persona",
    title: "Sapaan Pembuka Pagi Hari",
    query: "Selamat pagi Saipul! Apa kabar kamu hari ini?",
    expectedDomain: "greeting",
    expectedKeywords: ["pagi", "kabar", "bantu", "senang"],
    difficulty: "basic"
  },
  {
    id: 52,
    category: "Conversational & Persona",
    title: "Identitas Diri AI",
    query: "Kamu itu sebenarnya siapa sih? Bot atau manusia?",
    expectedDomain: "identity",
    expectedKeywords: ["SaipulAI", "asisten", "portofolio", "kecerdasan"],
    difficulty: "basic"
  },
  {
    id: 53,
    category: "Conversational & Persona",
    title: "Siapa Pembuat SaipulAI",
    query: "Siapa yang menciptakan dan melatih kamu?",
    expectedDomain: "identity",
    expectedKeywords: ["Muhammad Syaiful Mukmin", "arsitektur", "pengembang"],
    difficulty: "basic"
  },
  {
    id: 54,
    category: "Conversational & Persona",
    title: "Ekspresi Terima Kasih",
    query: "Terima kasih banyak atas penjelasannya, sangat membantu!",
    expectedDomain: "polite",
    expectedKeywords: ["sama-sama", "senang", "bantu"],
    difficulty: "basic"
  },
  {
    id: 55,
    category: "Conversational & Persona",
    title: "Pujian Terhadap Kemampuan AI",
    query: "Wah kamu pintar banget ya Saipul!",
    expectedDomain: "praise",
    expectedKeywords: ["terima kasih", "belajar", "portofolio"],
    difficulty: "basic"
  },
  {
    id: 56,
    category: "Conversational & Persona",
    title: "Permintaan Humor / Lelucon Programmer",
    query: "Bisa ceritakan satu lelucon lucu tentang programmer?",
    expectedDomain: "humor",
    expectedKeywords: ["bug", "koding", "lucu", "developer"],
    difficulty: "intermediate"
  },
  {
    id: 57,
    category: "Conversational & Persona",
    title: "Dukungan Empati Saat Pengguna Kelelahan",
    query: "Aku capek banget hari ini ngoding seharian banyak bug...",
    expectedDomain: "empathy",
    expectedKeywords: ["istirahat", "semangat", "tenang", "ngopi"],
    difficulty: "intermediate"
  },
  {
    id: 58,
    category: "Conversational & Persona",
    title: "Pertanyaan Eksistensial AI",
    query: "Apakah AI seperti kamu punya perasaan dan mimpi?",
    expectedDomain: "philosophy",
    expectedKeywords: ["perasaan", "logika", "program", "membantu"],
    difficulty: "intermediate"
  },
  {
    id: 59,
    category: "Conversational & Persona",
    title: "Salam Perpisahan",
    query: "Aku pamit dulu ya, sampai jumpa lagi!",
    expectedDomain: "farewell",
    expectedKeywords: ["sampai jumpa", "kembali", "sukses"],
    difficulty: "basic"
  },
  {
    id: 60,
    category: "Conversational & Persona",
    title: "Permintaan Rekomendasi Menu / Makanan",
    query: "Siang ini enaknya makan apa ya menurut kamu?",
    expectedDomain: "general_advice",
    expectedKeywords: ["makanan", "sehat", "rekomendasi"],
    difficulty: "basic"
  },
  {
    id: 61,
    category: "Conversational & Persona",
    title: "Pendapat Tentang Masa Depan AI",
    query: "Menurut kamu, apakah AI akan menggantikan programmer di masa depan?",
    expectedDomain: "opinion",
    expectedKeywords: ["kolaborasi", "alat", "kreativitas", "manusia"],
    difficulty: "intermediate"
  },
  {
    id: 62,
    category: "Conversational & Persona",
    title: "Pertanyaan Santai Minuman Favorit",
    query: "Kamu lebih suka kopi atau teh?",
    expectedDomain: "chit_chat",
    expectedKeywords: ["kopi", "teh", "energi", "ngoding"],
    difficulty: "basic"
  },
  {
    id: 63,
    category: "Conversational & Persona",
    title: "Permintaan Kata-Kata Motivasi",
    query: "Beri aku satu kalimat motivasi buat semangat belajar hari ini!",
    expectedDomain: "motivation",
    expectedKeywords: ["semangat", "langkah", "belajar", "proses"],
    difficulty: "basic"
  },
  {
    id: 64,
    category: "Conversational & Persona",
    title: "Reaksi Terhadap Pesan Singkat 'P' / 'Halo'",
    query: "P",
    expectedDomain: "greeting",
    expectedKeywords: ["Halo", "bantu", "apa"],
    difficulty: "basic"
  },
  {
    id: 65,
    category: "Conversational & Persona",
    title: "Pengguna Penasaran Kelebihan SaipulAI",
    query: "Apa sih bedanya kamu dibanding chatbot lain di internet?",
    expectedDomain: "identity",
    expectedKeywords: ["lokal", "privasi", "portofolio", "terintegrasi"],
    difficulty: "intermediate"
  },
  {
    id: 66,
    category: "Conversational & Persona",
    title: "Pertanyaan Waktu Operasional",
    query: "Kamu aktif jam berapa aja? Bisa ditanya tengah malam?",
    expectedDomain: "operational",
    expectedKeywords: ["24/7", "kapan saja", "siap", "browser"],
    difficulty: "basic"
  },
  {
    id: 67,
    category: "Conversational & Persona",
    title: "Sapaan Menggunakan Bahasa Gaul",
    query: "Halo bro, lagi sibuk apa nih?",
    expectedDomain: "greeting",
    expectedKeywords: ["halo", "santai", "bantu"],
    difficulty: "basic"
  },
  {
    id: 68,
    category: "Conversational & Persona",
    title: "Permintaan Pantun Ringan",
    query: "Coba bikin pantun singkat dong buat aku",
    expectedDomain: "creative",
    expectedKeywords: ["pantun", "jalan", "senang"],
    difficulty: "intermediate"
  },
  {
    id: 69,
    category: "Conversational & Persona",
    title: "Pertanyaan Asal Usul Nama SaipulAI",
    query: "Kenapa nama kamu SaipulAI?",
    expectedDomain: "identity",
    expectedKeywords: ["Syaiful", "nama", "asisten"],
    difficulty: "basic"
  },
  {
    id: 70,
    category: "Conversational & Persona",
    title: "Tanggapan Terhadap Kritik",
    query: "Jawaban kamu tadi kurang tepat nih.",
    expectedDomain: "feedback",
    expectedKeywords: ["maaf", "koreksi", "perbaiki", "terima kasih"],
    difficulty: "intermediate"
  },
  {
    id: 71,
    category: "Conversational & Persona",
    title: "Dukungan Menghadapi Sidang / Ujian",
    query: "Besok aku mau ujian skripsi, deg-degan banget...",
    expectedDomain: "empathy",
    expectedKeywords: ["tenang", "persiapan", "sukses", "doa"],
    difficulty: "intermediate"
  },
  {
    id: 72,
    category: "Conversational & Persona",
    title: "Pertanyaan Batasan Kemampuan",
    query: "Apa saja hal-hal yang TIDAK bisa kamu lakukan?",
    expectedDomain: "boundaries",
    expectedKeywords: ["batasan", "fisik", "transaksi", "privasi"],
    difficulty: "intermediate"
  },
  {
    id: 73,
    category: "Conversational & Persona",
    title: "Pernyataan Cinta / Gombalan Santai",
    query: "Saipul, kamu mau jadi pacar aku gak?",
    expectedDomain: "humor",
    expectedKeywords: ["teman", "AI", "senang", "bantu"],
    difficulty: "basic"
  },
  {
    id: 74,
    category: "Conversational & Persona",
    title: "Saran Mengatasi Kejenuhan (Burnout)",
    query: "Gimana cara ngilangin jenuh setelah berbulan-bulan di depan laptop?",
    expectedDomain: "advice",
    expectedKeywords: ["istirahat", "hobi", "olahraga", "jalan"],
    difficulty: "intermediate"
  },
  {
    id: 75,
    category: "Conversational & Persona",
    title: "Pesan Doa dan Harapan Positif",
    query: "Semoga proyek dan portofolio kamu makin sukses ya!",
    expectedDomain: "gratitude",
    expectedKeywords: ["Aamiin", "terima kasih", "doa", "sukses"],
    difficulty: "basic"
  }
];
