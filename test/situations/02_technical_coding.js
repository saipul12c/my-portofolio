/**
 * 02_technical_coding.js
 * Situasi 26 - 50: Konsultasi Teknis, Arsitektur Web, Coding & Best Practices
 */

export const technicalCodingSituations = [
  {
    id: 26,
    category: "Technical & Coding",
    title: "Konsep React State Management",
    query: "Bagaimana cara kerja useState dan useEffect di React?",
    expectedDomain: "technical",
    expectedKeywords: ["state", "effect", "render", "hook"],
    difficulty: "basic"
  },
  {
    id: 27,
    category: "Technical & Coding",
    title: "Arsitektur Vite vs Webpack",
    query: "Kenapa website portofolio ini menggunakan Vite dibandingkan Webpack?",
    expectedDomain: "technical",
    expectedKeywords: ["Vite", "ESM", "Fast", "Build", "HMR"],
    difficulty: "intermediate"
  },
  {
    id: 28,
    category: "Technical & Coding",
    title: "Optimasi Tailwind CSS v4",
    query: "Apa keuntungan arsitektur styling Tailwind CSS pada aplikasi modular?",
    expectedDomain: "technical",
    expectedKeywords: ["Tailwind", "CSS", "Utility", "Responsive"],
    difficulty: "intermediate"
  },
  {
    id: 29,
    category: "Technical & Coding",
    title: "Perbedaan Supabase dan Firebase",
    query: "Apa kelebihan Supabase sebagai backend serverless untuk real-time chat?",
    expectedDomain: "technical",
    expectedKeywords: ["Supabase", "PostgreSQL", "Realtime", "Database"],
    difficulty: "intermediate"
  },
  {
    id: 30,
    category: "Technical & Coding",
    title: "Implementasi Stale-While-Revalidate",
    query: "Jelaskan konsep cache manager Stale-While-Revalidate pada obrolan room live",
    expectedDomain: "technical",
    expectedKeywords: ["Cache", "Revalidate", "LocalStorage", "Offline"],
    difficulty: "advanced"
  },
  {
    id: 31,
    category: "Technical & Coding",
    title: "Penerapan Clean Code",
    query: "Bagaimana prinsip Clean Code diterapkan dalam penulisan modul JavaScript?",
    expectedDomain: "technical",
    expectedKeywords: ["Clean Code", "Modular", "Readable", "Refactor"],
    difficulty: "intermediate"
  },
  {
    id: 32,
    category: "Technical & Coding",
    title: "Debugging Null Pointer / Cannot Read Properties",
    query: "Bagaimana cara mengatasi TypeError: Cannot read properties of undefined di React?",
    expectedDomain: "technical",
    expectedKeywords: ["Optional chaining", "undefined", "null", "state"],
    difficulty: "basic"
  },
  {
    id: 33,
    category: "Technical & Coding",
    title: "Framer Motion Best Practices",
    query: "Bagaimana membuat transisi halaman halus menggunakan Framer Motion AnimatePresence?",
    expectedDomain: "technical",
    expectedKeywords: ["Framer Motion", "AnimatePresence", "initial", "animate", "exit"],
    difficulty: "intermediate"
  },
  {
    id: 34,
    category: "Technical & Coding",
    title: "Arsitektur Client-Side NLP",
    query: "Bagaimana mesin SaipulAI melakukan parsing teks dan TF-IDF tanpa API pihak ketiga?",
    expectedDomain: "technical",
    expectedKeywords: ["NLP", "Token", "TF-IDF", "Local", "Browser"],
    difficulty: "advanced"
  },
  {
    id: 35,
    category: "Technical & Coding",
    title: "Optimasi Lazy Loading Komponen",
    query: "Mengapa React.lazy dan Suspense penting untuk web performa tinggi?",
    expectedDomain: "technical",
    expectedKeywords: ["Lazy", "Suspense", "Bundle", "Chunk", "Performance"],
    difficulty: "intermediate"
  },
  {
    id: 36,
    category: "Technical & Coding",
    title: "Pengamanan LocalStorage & XSS",
    query: "Apakah aman menyimpan session token di LocalStorage dan bagaimana mitigasi XSS?",
    expectedDomain: "technical",
    expectedKeywords: ["Security", "XSS", "Token", "Storage"],
    difficulty: "advanced"
  },
  {
    id: 37,
    category: "Technical & Coding",
    title: "Penanganan Async Await & Try Catch",
    query: "Tuliskan contoh penanganan error asynchronous menggunakan try-catch di JavaScript",
    expectedDomain: "technical",
    expectedKeywords: ["async", "await", "try", "catch", "Promise"],
    difficulty: "basic"
  },
  {
    id: 38,
    category: "Technical & Coding",
    title: "Responsive Web Design Breakpoints",
    query: "Bagaimana mengatur breakpoint responsive yang efektif untuk tampilan mobile dan desktop?",
    expectedDomain: "technical",
    expectedKeywords: ["Breakpoint", "Mobile", "Desktop", "Media Query", "Tailwind"],
    difficulty: "basic"
  },
  {
    id: 39,
    category: "Technical & Coding",
    title: "Desain Dark Glassmorphism",
    query: "Apa saja elemen kunci dalam membuat tema UI Dark Glassmorphism yang mewah?",
    expectedDomain: "technical",
    expectedKeywords: ["Backdrop-blur", "Border", "Glass", "Opacity", "Gradient"],
    difficulty: "intermediate"
  },
  {
    id: 40,
    category: "Technical & Coding",
    title: "RESTful API Standards",
    query: "Jelaskan metode HTTP GET, POST, PUT, DELETE dan status code 200 vs 404 vs 500",
    expectedDomain: "technical",
    expectedKeywords: ["GET", "POST", "PUT", "DELETE", "Status Code"],
    difficulty: "basic"
  },
  {
    id: 41,
    category: "Technical & Coding",
    title: "Database Indexing & Performance",
    query: "Mengapa indexing penting pada database relasional seperti PostgreSQL?",
    expectedDomain: "technical",
    expectedKeywords: ["Index", "Query", "Performa", "Lookup", "Table"],
    difficulty: "intermediate"
  },
  {
    id: 42,
    category: "Technical & Coding",
    title: "Kompresi Gambar WebP di Browser",
    query: "Bagaimana cara kompresi gambar otomatis ke format WebP di sisi klien sebelum upload?",
    expectedDomain: "technical",
    expectedKeywords: ["Canvas", "WebP", "Kompresi", "Blob"],
    difficulty: "advanced"
  },
  {
    id: 43,
    category: "Technical & Coding",
    title: "Arsitektur Multi-Tier Role-Based Access Control",
    query: "Bagaimana cara mengatur hak akses bertingkat: Super Admin, Admin, Moderator, User?",
    expectedDomain: "technical",
    expectedKeywords: ["RBAC", "Role", "Permission", "Level"],
    difficulty: "advanced"
  },
  {
    id: 44,
    category: "Technical & Coding",
    title: "Penerapan Single Source of Truth",
    query: "Apa manfaat konsep Single Source of Truth pada pengelolaan database knowledge AI?",
    expectedDomain: "technical",
    expectedKeywords: ["Single Source", "Konsisten", "Knowledge Base", "Terpadu"],
    difficulty: "intermediate"
  },
  {
    id: 45,
    category: "Technical & Coding",
    title: "Web Audio Effects API",
    query: "Bagaimana cara membunyikan sound effect notifikasi chat di web tanpa lag?",
    expectedDomain: "technical",
    expectedKeywords: ["Audio", "Sound", "Context", "Play"],
    difficulty: "intermediate"
  },
  {
    id: 46,
    category: "Technical & Coding",
    title: "Profanity Filter Regex",
    query: "Bagaimana algoritma profanity filter mendeteksi kata-kata kasar dalam chat komunitas?",
    expectedDomain: "technical",
    expectedKeywords: ["Profanity", "Regex", "Filter", "Moderasi"],
    difficulty: "intermediate"
  },
  {
    id: 47,
    category: "Technical & Coding",
    title: "Debouncing Search Input",
    query: "Apa itu debounce function dan mengapa penting pada kotak pencarian artikel?",
    expectedDomain: "technical",
    expectedKeywords: ["Debounce", "Timeout", "Event", "Performa"],
    difficulty: "intermediate"
  },
  {
    id: 48,
    category: "Technical & Coding",
    title: "Pencegahan Memory Leak di React",
    query: "Bagaimana cara membersihkan interval timer pada return fungsi useEffect?",
    expectedDomain: "technical",
    expectedKeywords: ["Cleanup", "clearInterval", "Memory Leak", "Unmount"],
    difficulty: "intermediate"
  },
  {
    id: 49,
    category: "Technical & Coding",
    title: "SEO Metadata & OpenGraph",
    query: "Bagaimana optimasi meta tags OpenGraph agar link blog menarik saat dibagikan?",
    expectedDomain: "technical",
    expectedKeywords: ["Meta", "OpenGraph", "og:image", "SEO"],
    difficulty: "basic"
  },
  {
    id: 50,
    category: "Technical & Coding",
    title: "Git Workflow & Version Control",
    query: "Jelaskan alur branching dan commit message konvensional yang rapi dalam tim developer",
    expectedDomain: "technical",
    expectedKeywords: ["Git", "Branch", "Commit", "Merge", "Pull Request"],
    difficulty: "basic"
  }
];
