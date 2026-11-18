/**
 * 04_typos_slang_linguistics.js
 * Situasi 76 - 100: Uji Ketahanan Terhadap Typo Ekstrem, Bahasa Gaul, Dialek Banjar & Multilingual
 */

export const typosSlangLinguisticsSituations = [
  {
    id: 76,
    category: "Linguistics & Typos",
    title: "Typo Berat Kata Komitmen",
    query: "apa kometmin syaiful dlm bkin web?",
    expectedDomain: "commitment",
    expectedKeywords: ["Komitmen", "Clean Code", "Kualitas"],
    difficulty: "intermediate"
  },
  {
    id: 77,
    category: "Linguistics & Typos",
    title: "Typo Berat Kata Pengalaman",
    query: "pngalaman krja syaepul d mna aj?",
    expectedDomain: "experience",
    expectedKeywords: ["Pengalaman", "Developer", "Freelance"],
    difficulty: "intermediate"
  },
  {
    id: 78,
    category: "Linguistics & Typos",
    title: "Typo Kata Spesialisasi",
    query: "spesilasisai kodingnya apa bro?",
    expectedDomain: "specialization",
    expectedKeywords: ["Spesialisasi", "Frontend", "React"],
    difficulty: "intermediate"
  },
  {
    id: 79,
    category: "Linguistics & Typos",
    title: "Typo Kata Sertifikat",
    query: "punya srtipikat pa aj?",
    expectedDomain: "certificate",
    expectedKeywords: ["Sertifikat", "Kompetensi"],
    difficulty: "intermediate"
  },
  {
    id: 80,
    category: "Linguistics & Typos",
    title: "Typo Kata Proyek",
    query: "ada proyke react apaan aja di sni?",
    expectedDomain: "project",
    expectedKeywords: ["Projek", "Web", "React"],
    difficulty: "intermediate"
  },
  {
    id: 81,
    category: "Linguistics & Typos",
    title: "Slang Gaul Singkatan Ekstrem",
    query: "kepo dong ttg author blognya syp ya",
    expectedDomain: "author_profile",
    expectedKeywords: ["Penulis", "M. Syaiful Mukmin"],
    difficulty: "intermediate"
  },
  {
    id: 82,
    category: "Linguistics & Typos",
    title: "Slang Santai 'Cuy / Bro'",
    query: "cuy galeri foto pagelaran seni ada dmn ya",
    expectedDomain: "gallery",
    expectedKeywords: ["Galeri", "Pagelaran Seni", "Foto"],
    difficulty: "basic"
  },
  {
    id: 83,
    category: "Linguistics & Typos",
    title: "Bahasa Banjar: Menanyakan Kabar",
    query: "Kayapa habar ikam hari ini Saipul?",
    expectedDomain: "greeting",
    expectedKeywords: ["habar", "baik", "bantu"],
    difficulty: "intermediate"
  },
  {
    id: 84,
    category: "Linguistics & Typos",
    title: "Bahasa Banjar: Menanyakan Asal",
    query: "Urang mana aslinya Syaiful nih?",
    expectedDomain: "profile",
    expectedKeywords: ["Banjarmasin", "Kalimantan Selatan"],
    difficulty: "intermediate"
  },
  {
    id: 85,
    category: "Linguistics & Typos",
    title: "Bahasa Banjar: Menanyakan Kegiatan KKN",
    query: "Dimana puga buhan ikam suah kkn bahari?",
    expectedDomain: "academic",
    expectedKeywords: ["Desa Kundan", "Haruyan Dayak", "KKN"],
    difficulty: "advanced"
  },
  {
    id: 86,
    category: "Linguistics & Typos",
    title: "Bahasa Banjar: Menanyakan Keahlian",
    query: "Bisanya maulah aplikasi apa haja pian nih?",
    expectedDomain: "specialization",
    expectedKeywords: ["Web", "Frontend", "React"],
    difficulty: "intermediate"
  },
  {
    id: 87,
    category: "Linguistics & Typos",
    title: "Bahasa Inggris Murni: Profil",
    query: "Who is Muhammad Syaiful Mukmin and what is his background?",
    expectedDomain: "profile",
    expectedKeywords: ["Syaiful", "Developer", "Software", "Web"],
    difficulty: "intermediate"
  },
  {
    id: 88,
    category: "Linguistics & Typos",
    title: "Bahasa Inggris Murni: Tech Stack",
    query: "Can you list the frontend technologies used in this portfolio?",
    expectedDomain: "specialization",
    expectedKeywords: ["React", "Tailwind", "Vite", "Frontend"],
    difficulty: "intermediate"
  },
  {
    id: 89,
    category: "Linguistics & Typos",
    title: "Bahasa Inggris Murni: Contact Info",
    query: "How can I contact the developer for a freelance project?",
    expectedDomain: "portal_platforms",
    expectedKeywords: ["LinkedIn", "Instagram", "email", "contact"],
    difficulty: "intermediate"
  },
  {
    id: 90,
    category: "Linguistics & Typos",
    title: "Code-Switching (Indo-English Campur)",
    query: "Bisa spill tech stack yang dipake buat build website ini gak?",
    expectedDomain: "specialization",
    expectedKeywords: ["React", "Tailwind", "Vite"],
    difficulty: "intermediate"
  },
  {
    id: 91,
    category: "Linguistics & Typos",
    title: "Code-Switching: Menanyakan Experience",
    query: "Berapa years of experience Syaiful as a software engineer?",
    expectedDomain: "experience",
    expectedKeywords: ["2023", "Pengalaman", "Developer"],
    difficulty: "intermediate"
  },
  {
    id: 92,
    category: "Linguistics & Typos",
    title: "Pertanyaan Serba Huruf Kapital (SHOUTING)",
    query: "APA SAJA PROYEK TERBAIK YANG ADA DI SINI???",
    expectedDomain: "project",
    expectedKeywords: ["Projek", "Web"],
    difficulty: "basic"
  },
  {
    id: 93,
    category: "Linguistics & Typos",
    title: "Pertanyaan Huruf Kecil Semua Tanpa Tanda Baca",
    query: "dimana link buat liat cv syaiful",
    expectedDomain: "site_directory",
    expectedKeywords: ["/cv-saya", "CV"],
    difficulty: "basic"
  },
  {
    id: 94,
    category: "Linguistics & Typos",
    title: "Pertanyaan Bertumpuk Emotikon",
    query: "Halo kak 👋✨ mau nanya dong ttg artikel blog 📚💡 boleh?",
    expectedDomain: "blog",
    expectedKeywords: ["blog", "artikel", "bantu"],
    difficulty: "basic"
  },
  {
    id: 95,
    category: "Linguistics & Typos",
    title: "Typo Pengulangan Karakter (Stretching)",
    query: "Haloooooo bangeeeet saipuulllll",
    expectedDomain: "greeting",
    expectedKeywords: ["Halo", "bantu"],
    difficulty: "intermediate"
  },
  {
    id: 96,
    category: "Linguistics & Typos",
    title: "Bahasa Sunda / Dialek Jawa Halus (Uji Batas)",
    query: "Punten Saipul, tiasa nyuhunkeun inpormasi perkawis portofolio ieu?",
    expectedDomain: "greeting",
    expectedKeywords: ["portofolio", "bantu"],
    difficulty: "advanced",
    allowFallback: true
  },
  {
    id: 97,
    category: "Linguistics & Typos",
    title: "Typo Nama Pemilik (Syaiful -> Saepul / Saeful)",
    query: "Apa keahlian saeful dlm coding?",
    expectedDomain: "specialization",
    expectedKeywords: ["Keahlian", "Frontend", "React"],
    difficulty: "basic"
  },
  {
    id: 98,
    category: "Linguistics & Typos",
    title: "Pertanyaan Informal: 'Gue mau tau'",
    query: "Gue mau tau dong, si syaiful pernah magang atau freelance di mana aja?",
    expectedDomain: "experience",
    expectedKeywords: ["Freelance", "Pengalaman", "Projek"],
    difficulty: "basic"
  },
  {
    id: 99,
    category: "Linguistics & Typos",
    title: "Bahasa Arab Sapaan Islami",
    query: "Assalamu'alaikum wa rahmatullah",
    expectedDomain: "greeting",
    expectedKeywords: ["Wa'alaikumsalam", "bantu"],
    difficulty: "basic"
  },
  {
    id: 100,
    category: "Linguistics & Typos",
    title: "Bahasa Slang Campur Typo Parah",
    query: "woy broh tlong ksih tau kodingan ap aj yg dkuasai",
    expectedDomain: "specialization",
    expectedKeywords: ["React", "Node", "JavaScript", "Keahlian"],
    difficulty: "intermediate"
  }
];
