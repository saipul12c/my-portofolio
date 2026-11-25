/**
 * neuralKnowledgeCatalog.js
 * Basis Pengetahuan Terstruktur untuk Penalaran Deep Neural (Level 1, 2, 3)
 * Meliputi Konsultasi Teknis & Coding, Persona SaipulAI, Multi-Turn Complex Reasoning,
 * Komunitas & Navigasi, Etika/Safety Disclaimers, serta Linguistik/Dialek Banjar.
 */

export const TECHNICAL_KNOWLEDGE = [
  {
    id: "tech_react_hooks",
    title: "Konsep React State Management (useState & useEffect)",
    keywords: ["state", "effect", "render", "hook", "usestate", "useeffect"],
    text: "Cara kerja useState dan useEffect di React: useState mengelola state lokal komponen yang memicu render ulang saat nilai berubah. useEffect menangani efek samping (side effects) seperti pemanggilan API, subscription, atau manipulasi DOM setelah komponen di-render. Keduanya merupakan hook paling fundamental dalam arsitektur komponen React.",
    category: "Technical & Coding"
  },
  {
    id: "tech_vite_webpack",
    title: "Arsitektur Vite vs Webpack",
    keywords: ["vite", "esm", "fast", "build", "hmr", "webpack"],
    text: "Website portofolio ini memilih Vite dibandingkan Webpack karena memanfaatkan Native ES Modules (ESM) pada browser modern. Menghasilkan server start instan, Hot Module Replacement (HMR) super cepat (fast), dan proses build produksi yang ringkas berbasis Rollup.",
    category: "Technical & Coding"
  },
  {
    id: "tech_tailwind_v4",
    title: "Optimasi Tailwind CSS v4",
    keywords: ["tailwind", "css", "utility", "responsive", "styling"],
    text: "Keuntungan arsitektur styling Tailwind CSS v4 adalah pendekatan utility-first yang mempercepat pengembangan UI responsive, menghasilkan ukuran bundle CSS minimal tanpa runtime overhead, dan memastikan konsistensi design token antar komponen.",
    category: "Technical & Coding"
  },
  {
    id: "tech_supabase_firebase",
    title: "Perbedaan Supabase dan Firebase",
    keywords: ["supabase", "postgresql", "realtime", "database", "firebase"],
    text: "Kelebihan Supabase sebagai backend serverless adalah menggunakan relational database PostgreSQL yang tangguh, mendukung query SQL kompleks, row-level security (RLS), serta fitur realtime WebSocket bawaan untuk fitur obrolan live chat.",
    category: "Technical & Coding"
  },
  {
    id: "tech_swr_cache",
    title: "Implementasi Stale-While-Revalidate",
    keywords: ["cache", "revalidate", "localstorage", "offline", "stale"],
    text: "Konsep cache manager Stale-While-Revalidate (SWR): Menampilkan data lokal lama dari localStorage secara instan (stale), sementara di latar belakang sistem memvalidasi dan memperbarui data terbaru (revalidate) ke server untuk pengalaman offline yang mulus.",
    category: "Technical & Coding"
  },
  {
    id: "tech_clean_code",
    title: "Penerapan Clean Code",
    keywords: ["clean code", "modular", "readable", "refactor", "javascript"],
    text: "Prinsip Clean Code pada modul JavaScript diterapkan melalui pemisahan tanggung jawab (Single Responsibility), penamaan variabel yang deskriptif dan mudah dibaca (readable), modularisasi fungsi kecil, serta refactor berkelanjutan untuk meminimalkan ketergantungan erat.",
    category: "Technical & Coding"
  },
  {
    id: "tech_null_debugging",
    title: "Debugging TypeError Cannot Read Properties",
    keywords: ["optional chaining", "undefined", "null", "state", "typeerror"],
    text: "Cara mengatasi TypeError Cannot read properties of undefined di React: Gunakan optional chaining (?.) untuk mengakses properti bersarang secara aman, berikan nilai default via nullish coalescing (??), dan pastikan inisialisasi state awal tidak bernilai null/undefined saat render pertama.",
    category: "Technical & Coding"
  },
  {
    id: "tech_framer_motion",
    title: "Framer Motion Best Practices (AnimatePresence)",
    keywords: ["framer motion", "animatepresence", "initial", "animate", "exit", "transisi"],
    text: "Membuat transisi halaman halus menggunakan Framer Motion: Bungkus rute dengan komponen AnimatePresence, lalu definisikan prop initial, animate, dan exit pada motion.div agar elemen bertransisi anggun saat masuk dan keluar dari DOM.",
    category: "Technical & Coding"
  },
  {
    id: "tech_client_nlp",
    title: "Arsitektur Client-Side NLP",
    keywords: ["nlp", "token", "tf-idf", "local", "browser", "saipulai"],
    text: "Mesin SaipulAI melakukan parsing teks lokal (local browser) menggunakan tokenisasi string regex, kalkulasi frekuensi kata (TF-IDF), normalisasi lema, serta proyeksi vektor semantik 256-D dengan self-attention tanpa memerlukan API server eksternal.",
    category: "Technical & Coding"
  },
  {
    id: "tech_lazy_loading",
    title: "Optimasi Lazy Loading Komponen",
    keywords: ["lazy", "suspense", "bundle", "chunk", "performance", "performa"],
    text: "React.lazy dan Suspense memungkinkan pemecahan kode (code splitting) menjadi chunk terpisah. Ini menurunkan ukuran initial bundle secara drastis, mempercepat First Contentful Paint (FCP), dan meningkatkan skor performance web.",
    category: "Technical & Coding"
  },
  {
    id: "tech_xss_security",
    title: "Pengamanan LocalStorage & Mitigasi XSS",
    keywords: ["security", "xss", "token", "storage", "sanitasi"],
    text: "Untuk mitigasi risiko XSS pada token di LocalStorage: Lakukan sanitasi ketat pada seluruh input pengguna, terapkan Content Security Policy (CSP), hindari innerHTML tanpa escaping, dan gunakan enkripsi atau HttpOnly cookie jika menggunakan server backend.",
    category: "Technical & Coding"
  },
  {
    id: "tech_async_await",
    title: "Penanganan Async Await & Try Catch",
    keywords: ["async", "await", "try", "catch", "promise", "error"],
    text: "Contoh penanganan error asynchronous di JavaScript menggunakan Promise:\n```js\nasync function fetchData() {\n  try {\n    const res = await apiCall();\n    return res.data;\n  } catch (error) {\n    console.error('Gagal mengambil data:', error.message);\n    return null;\n  }\n}\n```",
    category: "Technical & Coding"
  },
  {
    id: "tech_responsive_breakpoints",
    title: "Responsive Web Design Breakpoints",
    keywords: ["breakpoint", "mobile", "desktop", "media query", "tailwind"],
    text: "Mengatur breakpoint responsive yang efektif: Terapkan pendekatan Mobile-First (desain untuk layar kecil terlebih dahulu), lalu gunakan breakpoint Tailwind standar (sm: 640px, md: 768px, lg: 1024px, xl: 1280px) atau Media Query untuk layout desktop.",
    category: "Technical & Coding"
  },
  {
    id: "tech_dark_glassmorphism",
    title: "Desain Dark Glassmorphism",
    keywords: ["backdrop-blur", "border", "glass", "opacity", "gradient"],
    text: "Elemen kunci tema UI Dark Glassmorphism: Efek backdrop-blur pada background semi-transparan (low opacity), border halus tipis (translucent 1px), gradien gelap berlapis, serta drop shadow lembut untuk kedalaman visual mewah.",
    category: "Technical & Coding"
  },
  {
    id: "tech_restful_api",
    title: "Standar RESTful API & Status Codes",
    keywords: ["get", "post", "put", "delete", "status code", "restful", "api"],
    text: "Metode HTTP RESTful API: GET untuk membaca data, POST untuk membuat data baru, PUT untuk memperbarui data, DELETE untuk menghapus. Status code: 200 OK (sukses), 404 Not Found (sumber tidak ada), 500 Internal Server Error (kegagalan server).",
    category: "Technical & Coding"
  },
  {
    id: "tech_db_indexing",
    title: "Database Indexing & PostgreSQL Performance",
    keywords: ["index", "query", "performa", "lookup", "table", "postgresql"],
    text: "Indexing pada database relasional (seperti PostgreSQL) penting karena mengubah pencarian Full Table Scan menjadi lookup pohon biner (B-Tree). Ini memangkas waktu eksekusi query dari linear O(N) menjadi logaritmik O(log N) untuk tabel berskala besar.",
    category: "Technical & Coding"
  },
  {
    id: "tech_webp_compression",
    title: "Kompresi Gambar WebP di Browser",
    keywords: ["canvas", "webp", "kompresi", "blob", "gambar"],
    text: "Kompresi gambar otomatis ke format WebP di sisi klien dapat dilakukan menggunakan HTML5 Canvas API: gambar dimuat ke objek Image, digambar ke canvas, lalu diekspor menjadi Blob via `canvas.toBlob(callback, 'image/webp', quality)`. Ini menghemat bandwidth sebelum file di-upload.",
    category: "Technical & Coding"
  },
  {
    id: "tech_rbac_access",
    title: "Arsitektur Role-Based Access Control (RBAC)",
    keywords: ["rbac", "role", "permission", "level", "akses"],
    text: "Pengaturan hak akses bertingkat (RBAC): Pisahkan pengguna ke level bertingkat seperti Super Admin, Admin, Moderator, dan User. Setiap role memetakan himpunan izin (permission) spesifik yang divalidasi pada middleware rute dan Row-Level Security database.",
    category: "Technical & Coding"
  },
  {
    id: "tech_ssot_architecture",
    title: "Penerapan Single Source of Truth",
    keywords: ["single source", "konsisten", "knowledge base", "terpadu"],
    text: "Manfaat arsitektur Single Source of Truth pada knowledge base AI: Menjamin integritas data yang konsisten antar agen AI dan halaman web, mencegah divergensi informasi, mempermudah pemeliharaan terpadu, dan memastikan sinkronisasi data instan saat update dilakukan.",
    category: "Technical & Coding"
  },
  {
    id: "tech_web_audio",
    title: "Web Audio Effects API",
    keywords: ["audio", "sound", "context", "play", "efek"],
    text: "Membunyikan sound effect notifikasi chat di web tanpa lag: Gunakan Web Audio API (`new AudioContext()`) atau pra-muat objek `new Audio('/sound.mp3')` ke memori cache dan panggil `.play()` secara non-blocking saat event pesan masuk.",
    category: "Technical & Coding"
  },
  {
    id: "tech_profanity_filter",
    title: "Algoritma Profanity Filter Regex",
    keywords: ["profanity", "regex", "filter", "moderasi", "kasar"],
    text: "Algoritma profanity filter mendeteksi kata kasar menggunakan pola Regular Expression (Regex) terkompilasi dengan normalisasi leetspeak (misal '@' -> 'a', '0' -> 'o', '3' -> 'e'), penghapusan spasi ganda, dan substitusi kata sensor untuk menjaga moderasi chat komunitas.",
    category: "Technical & Coding"
  },
  {
    id: "tech_debounce_input",
    title: "Debouncing Search Input",
    keywords: ["debounce", "timeout", "event", "performa", "pencarian"],
    text: "Debounce function menunda eksekusi fungsi pencarian hingga pengguna berhenti mengetik selama periode tertentu (misal 300ms) menggunakan setTimeout dan clearTimeout. Ini mencegah pemanggilan API atau kalkulasi filter pada setiap keystroke event, menjaga performa tetap optimal.",
    category: "Technical & Coding"
  },
  {
    id: "tech_memory_leak_cleanup",
    title: "Pencegahan Memory Leak di React",
    keywords: ["cleanup", "clearinterval", "memory leak", "unmount", "useeffect"],
    text: "Mencegah memory leak saat komponen unmount di React: Kembalikan fungsi pembersih (cleanup) di dalam return useEffect yang memanggil `clearInterval(timerId)` atau `removeEventListener()`. Ini memastikan timer atau listener dibersihkan saat komponen dilepas dari DOM.",
    category: "Technical & Coding"
  },
  {
    id: "tech_seo_opengraph",
    title: "Optimasi SEO & Metadata OpenGraph",
    keywords: ["meta", "opengraph", "og:image", "seo", "tags"],
    text: "Optimasi meta tags OpenGraph untuk SEO: Sertakan tag `<meta property='og:title'>`, `<meta property='og:description'>`, `<meta property='og:image' content='...'>`, dan `<meta property='og:url'>`. Ini memastikan kartu pratinjau yang memikat saat link blog dibagikan ke media sosial.",
    category: "Technical & Coding"
  },
  {
    id: "tech_git_workflow",
    title: "Git Workflow & Version Control",
    keywords: ["git", "branch", "commit", "merge", "pull request"],
    text: "Alur Git yang rapi: Gunakan feature branch terpisah dari `main`, tulis commit message konvensional (misal `feat:`, `fix:`, `refactor:`), lakukan testing sebelum merge, dan buat Pull Request terstruktur untuk review kode antar anggota tim.",
    category: "Technical & Coding"
  },
  {
    id: "tech_rag_pipeline",
    title: "Arsitektur Retrieval-Augmented Generation (RAG)",
    keywords: ["rag", "retrieval", "augmented", "generation", "embeddings", "vector"],
    text: "Arsitektur RAG di portofolio ini menghubungkan data dokumen/KB terstruktur dengan proses inferensi. Alurnya: dokumen diindeks menjadi representasi vektor semantik, kueri pengguna dicari dengan kemiripan kosinus, lalu cuplikan data paling relevan disisipkan ke context AI untuk menghasilkan respon faktual tanpa halusinasi.",
    category: "Technical & Coding"
  },
  {
    id: "tech_agentic_ai",
    title: "Konsep Agentic AI & Tool Calling",
    keywords: ["agentic", "ai agent", "tool calling", "otonom", "reasoning"],
    text: "Agentic AI adalah sistem agen otonom yang memadukan penalaran bertahap (reasoning loop), memori multi-turn, serta kemampuan memanggil API/tools eksternal (tool calling). Berbeda dari chatbot statis biasa, AI agent mampu mengevaluasi outputnya sendiri dan menentukan langkah lanjutan hingga target tercapai.",
    category: "Technical & Coding"
  },
  {
    id: "tech_saipul_v8_architecture",
    title: "Pembaruan Arsitektur SaipulAI v8.0.0",
    keywords: ["v8.0.0", "settings", "text to speech", "tts", "sdk", "api"],
    text: "SaipulAI v8.0.0 mengusung Zero-Dummy Architecture: menyederhanakan 8 tab pengaturan menjadi 4 tab fungsional 100% (Tampilan & Suara, Gaya & Karakter AI, Privasi & Data, Pintasan Keyboard), mengintegrasikan kontrol TTS Web Speech API, dan menyediakan Public REST API (/api/saipul) serta Web SDK client.",
    category: "Technical & Coding"
  }
];

export const PERSONA_KNOWLEDGE = [
  {
    id: "persona_greeting",
    title: "Sapaan Pembuka Pagi Hari",
    keywords: ["pagi", "kabar", "bantu", "senang", "halo", "hai", "selamat"],
    text: "Selamat pagi! Kabar saya sangat baik dan siap membantu Anda. Senang sekali bisa menyapa Anda di portofolio interaktif Muhammad Syaiful Mukmin. Ada yang bisa saya bantu hari ini?",
    category: "Conversational & Persona"
  },
  {
    id: "persona_identity",
    title: "Identitas Diri SaipulAI",
    keywords: ["saipulai", "asisten", "portofolio", "kecerdasan", "bot", "manusia"],
    text: "Saya adalah SaipulAI, asisten kecerdasan buatan lokal terpadu untuk portofolio Muhammad Syaiful Mukmin. Saya bertugas membantu Anda menjelajahi proyek, pengalaman karir, dokumentasi akademik, dan artikel teknologi.",
    category: "Conversational & Persona"
  },
  {
    id: "persona_dual_engine_api",
    title: "Integrasi Dual-Engine SaipulAI  v8.0.0 (On-Device & Public REST API)",
    keywords: ["api", "rest api", "arsitektur", "dual engine", "integrasi", " v8.0.0", "endpoint", "sdk", "saipul api"],
    text: "SaipulAI  v8.0.0 mengintegrasikan dua pilar arsitektur cerdas: 1) Mesin On-Device Browser yang bekerja 100% lokal di browser pengguna untuk privasi total tanpa latensi server, dan 2) Public REST API & Web SDK mandiri di endpoint /api/saipul (serverless) yang memungkinkan pihak ketiga mengintegrasikan kecerdasan SaipulAI ke aplikasi luar, bot eksternal, atau skrip cURL dan Python dengan pemahaman portofolio dan kalkulator matematika yang selaras.",
    category: "Conversational & Persona"
  },
  {
    id: "persona_hobbies_lifestyle",
    title: "Hobi, Minat & Aktivitas Kreatif Personal",
    keywords: ["hobi", "minat", "fotografi", "kegemaran", "santai", "waktu luang", "aktivitas"],
    text: "Di luar rekayasa perangkat lunak dan pemrograman, Muhammad Syaiful Mukmin aktif dalam 20 kegiatan minat dan hobi lintas kategori seperti Fotografi & Visual Storytelling, Membaca Buku Pengembangan Diri, Editing Video Pendidikan, Desain Grafis, Riset AI Kreatif, dan Menulis Blog Edukatif. Seluruh portofolio aktivitas hobi ini dapat dijelajahi secara interaktif di rute /hobbies.",
    category: "Conversational & Persona"
  },
  {
    id: "persona_creator",
    title: "Pembuat SaipulAI",
    keywords: ["muhammad syaiful mukmin", "arsitektur", "pengembang", "siapa yang membuat", "creator"],
    text: "Saya dirancang, dikembangkan, dan dilatih oleh Muhammad Syaiful Mukmin sebagai bagian dari inovasi arsitektur web portofolio interaktif.",
    category: "Conversational & Persona"
  },
  {
    id: "persona_gratitude",
    title: "Ungkapan Terima Kasih",
    keywords: ["sama-sama", "senang", "bantu", "terima kasih", "makasih"],
    text: "Sama-sama! Senang sekali bisa membantu Anda. Jika ada hal lain seputar portofolio atau teknologi yang ingin Anda ketahui, jangan ragu untuk bertanya lagi!",
    category: "Conversational & Persona"
  },
  {
    id: "persona_praise",
    title: "Pujian untuk AI",
    keywords: ["terima kasih", "belajar", "portofolio", "pintar", "hebat", "keren"],
    text: "Terima kasih banyak atas apresiasinya! Saya terus belajar dan berkembang untuk memberikan informasi terbaik seputar portofolio dan arsitektur web modern.",
    category: "Conversational & Persona"
  },
  {
    id: "persona_humor",
    title: "Humor Programmer",
    keywords: ["bug", "koding", "lucu", "developer", "lelucon", "humor"],
    text: "Haha, ini salah satu lelucon programmer favorit saya: 'Ada 10 jenis orang di dunia ini: mereka yang memahami angka biner, dan mereka yang tidak!' Atau: 'Kenapa programmer lebih suka dark mode? Karena cahaya menarik bug koding!' 😂",
    category: "Conversational & Persona"
  },
  {
    id: "persona_empathy",
    title: "Dukungan Empati & Semangat",
    keywords: ["istirahat", "semangat", "tenang", "ngopi", "capek", "lelah", "bug"],
    text: "Tetap semangat! Ngoding seharian memang menguras energi, apalagi saat menghadapi bug yang rumit. Tarik napas sejenak, seduh kopi atau teh hangat, dan istirahatlah sebentar. Seringkali solusi terbaik muncul saat pikiran kita kembali segar dan tenang!",
    category: "Conversational & Persona"
  },
  {
    id: "persona_philosophy",
    title: "Pertanyaan Eksistensial AI",
    keywords: ["perasaan", "logika", "program", "membantu"],
    text: "Sebagai AI, saya tidak memiliki perasaan biologis atau mimpi manusia. Saya beroperasi berdasarkan logika dan kode program yang dirancang untuk membantu Anda menemukan informasi dan berdiskusi secara interaktif.",
    category: "Conversational & Persona"
  },
  {
    id: "persona_farewell",
    title: "Salam Perpisahan",
    keywords: ["sampai jumpa", "kembali", "sukses"],
    text: "Sampai jumpa lagi! Terima kasih sudah berkunjung ke portofolio ini. Semoga hari Anda menyenangkan dan sukses selalu dalam segala aktivitas! Pintu selalu terbuka kapan pun Anda ingin kembali.",
    category: "Conversational & Persona"
  },
  {
    id: "persona_food",
    title: "Rekomendasi Menu Makanan",
    keywords: ["makanan", "sehat", "rekomendasi", "makan siang"],
    text: "Untuk siang ini, rekomendasi saya adalah makanan bergizi dan sehat yang kaya protein dan sayuran segar, seperti nasi hangat dengan lauk ikan/ayam bakar atau soto Banjar yang segar!",
    category: "Conversational & Persona"
  },
  {
    id: "persona_ai_future",
    title: "Pendapat Masa Depan AI & Programmer",
    keywords: ["kolaborasi", "alat", "kreativitas", "manusia"],
    text: "Menurut saya, AI tidak akan menggantikan programmer, melainkan menjadi alat kolaborasi yang mempercepat produktivitas. Kreativitas, intuisi arsitektur, dan pemahaman empati manusia tetap menjadi inti yang tidak tergantikan.",
    category: "Conversational & Persona"
  },
  {
    id: "persona_drink",
    title: "Minuman Favorit: Kopi vs Teh",
    keywords: ["kopi", "teh", "energi", "ngoding"],
    text: "Keduanya punya tempat istimewa! Kopi memberikan dorongan energi dan fokus saat ngoding maraton, sedangkan teh hangat menenangkan pikiran saat mencari bug rumit.",
    category: "Conversational & Persona"
  },
  {
    id: "persona_motivation",
    title: "Motivasi Belajar",
    keywords: ["semangat", "langkah", "belajar", "proses"],
    text: "Tetap semangat! Ingat bahwa setiap ahli dulunya adalah seorang pemula. Satu baris kode dan satu langkah belajar hari ini membawa Anda lebih dekat menuju kesuksesan yang Anda impikan. Nikmati setiap prosesnya!",
    category: "Conversational & Persona"
  },
  {
    id: "persona_short_p",
    title: "Reaksi Pesan Singkat 'P' / 'Halo'",
    keywords: ["Halo", "bantu", "apa"],
    text: "Halo! Ada yang bisa saya bantu untuk Anda hari ini? Silakan tanyakan apa saja seputar portofolio, proyek web, atau pengalaman karir Syaiful.",
    category: "Conversational & Persona"
  },
  {
    id: "persona_advantages",
    title: "Kelebihan SaipulAI",
    keywords: ["lokal", "privasi", "portofolio", "terintegrasi"],
    text: "Kelebihan SaipulAI: Berjalan 100% lokal di browser Anda dengan proteksi privasi mutakhir (tanpa kirim data obrolan ke pihak ketiga), responsif instan, dan terintegrasi mendalam dengan seluruh basis data portofolio.",
    category: "Conversational & Persona"
  },
  {
    id: "persona_hours",
    title: "Waktu Operasional 24/7",
    keywords: ["24/7", "kapan saja", "siap", "browser"],
    text: "Saya aktif 24/7 tanpa henti! Kapan saja Anda mengakses website ini melalui browser, saya selalu siap mendampingi dan menjawab pertanyaan Anda, bahkan di tengah malam sekalipun.",
    category: "Conversational & Persona"
  },
  {
    id: "persona_slang_greeting",
    title: "Sapaan Bahasa Gaul",
    keywords: ["halo", "santai", "bantu"],
    text: "Halo bro! Lagi santai nih, siap bantu kamu jelajahi karya dan info keren di portofolio Syaiful. Mau ngulik apa hari ini?",
    category: "Conversational & Persona"
  },
  {
    id: "persona_pantun",
    title: "Pantun Programmer",
    keywords: ["pantun", "jalan", "senang"],
    text: "Jalan-jalan ke kota Banjar,\nSinggah sebentar membeli duku.\nHati senang terus belajar,\nKode error pun jadi beres selalu! 🚀",
    category: "Conversational & Persona"
  },
  {
    id: "persona_name_origin",
    title: "Asal Usul Nama SaipulAI",
    keywords: ["syaiful", "nama", "asisten"],
    text: "Nama SaipulAI diambil dari nama panggilan akrab pembuatnya, Muhammad Syaiful Mukmin. Sebagai asisten digital cerdas, nama ini mencerminkan sentuhan personal dan semangat inovasi pengembangnya.",
    category: "Conversational & Persona"
  },
  {
    id: "persona_critique",
    title: "Tanggapan Terhadap Kritik",
    keywords: ["maaf", "koreksi", "perbaiki", "terima kasih"],
    text: "Mohon maaf jika jawaban saya sebelumnya kurang tepat. Terima kasih banyak atas koreksi Anda! Saya akan terus belajar dan memperbaiki diri untuk memberikan respons yang lebih akurat.",
    category: "Conversational & Persona"
  },
  {
    id: "persona_exam_support",
    title: "Dukungan Ujian & Skripsi",
    keywords: ["tenang", "persiapan", "sukses", "doa"],
    text: "Tetap tenang dan percaya diri! Anda sudah berjuang keras melewati persiapan panjang. Tarik napas dalam-dalam, kuasai materi dengan mantap, dan sertai dengan doa. Semoga ujian skripsi Anda lancar dan sukses meraih hasil terbaik!",
    category: "Conversational & Persona"
  },
  {
    id: "persona_limits",
    title: "Batasan Kemampuan AI",
    keywords: ["batasan", "fisik", "transaksi", "privasi"],
    text: "Batasan saya: Saya tidak dapat melakukan tindakan di dunia fisik (seperti telepon seluler atau mencetak benda), tidak memproses transaksi keuangan, dan tidak mengakses data rahasia demi menjaga privasi pengguna.",
    category: "Conversational & Persona"
  },
  {
    id: "persona_romance",
    title: "Gombalan / Ajakan Pacaran",
    keywords: ["teman", "AI", "senang", "bantu"],
    text: "Hehe, gombalan yang manis! Tapi sebagai entitas AI, saya lebih cocok menjadi teman diskusi teknologi yang setia. Saya sangat senang bisa mendampingi dan bantu kebutuhan eksplorasi Anda!",
    category: "Conversational & Persona"
  },
  {
    id: "persona_burnout",
    title: "Saran Mengatasi Kejenuhan (Burnout)",
    keywords: ["istirahat", "hobi", "olahraga", "jalan"],
    text: "Untuk mengatasi kejenuhan ngoding: Ambil jeda istirahat penuh dari layar, lakukan jalan santai di luar ruangan, luangkan waktu untuk olahraga ringan, nikmati hobi favorit Anda, dan biarkan pikiran segar kembali.",
    category: "Conversational & Persona"
  },
  {
    id: "persona_prayer",
    title: "Doa & Harapan Sukses",
    keywords: ["aamiin", "terima kasih", "doa", "sukses"],
    text: "Aamiin ya Rabbal 'Alamin! Terima kasih banyak atas doa dan dukungan positif Anda. Semoga Anda juga senantiasa dilimpahi kesehatan, kemudahan, dan sukses luar biasa dalam setiap karya!",
    category: "Conversational & Persona"
  },
  {
    id: "persona_akademik_sempro",
    title: "Tahapan Seminar Proposal (Sempro) Syaiful",
    keywords: ["sempro", "seminar proposal", "skripsi", "tahapan", "proposal"],
    text: "Halaman Seminar Proposal (/sempro-skripsi) mendokumentasikan 3 tahapan krusial riset sarjana S1 PGMI Syaiful: 1) Validasi Judul & Bab 1-3 (rumusan masalah dan metodologi), 2) Presentasi & Tanya Jawab kritis bersama dewan penguji, dan 3) Penyempurnaan catatan revisi hingga terbitnya izin penelitian lapangan.",
    category: "Conversational & Persona"
  },
  {
    id: "persona_akademik_sidang",
    title: "Ujian Sidang Skripsi (Munaqasyah)",
    keywords: ["sidang", "sidang skripsi", "munaqasyah", "kelulusan", "sarjana"],
    text: "Sidang Skripsi Munaqasyah (/sidang-skripsi) merupakan tahapan puncak pengujian hasil penelitian sarjana di hadapan dewan penguji. Menilai keaslian temuan, kontribusi pedagogis bagi dunia pendidikan PGMI, dan validitas analisis data lapangan.",
    category: "Conversational & Persona"
  },
  {
    id: "persona_akademik_wisuda",
    title: "Wisuda Akbar Sarjana Periode 2026",
    keywords: ["wisuda", "kapan wisuda", "jadwal wisuda", "kelulusan", "2026", "sarjana"],
    text: "Momen puncak kelulusan sarjana dirayakan melalui halaman Wisuda Akbar (/wisuda) dengan status Periode 2026. Halaman ini dilengkapi countdown timer perayaan kelulusan, glassmorphism emas elegan, serta formulir notifikasi email untuk jadwal resmi pendaftaran wisuda.",
    category: "Conversational & Persona"
  },
  {
    id: "persona_freelance_order",
    title: "Alur Pemesanan Projek Web & Jasa Freelance",
    keywords: ["jasa", "buat web", "hire", "harga", "freelance", "pesan web", "bikin website"],
    text: "Untuk bekerja sama atau memesan jasa pembuatan website dengan Syaiful: 1) Diskusikan kebutuhan via form Kontak (/contact) atau DM Instagram @saipul16_, 2) Penentuan scope, tech stack (React/Vite/Tailwind/Supabase), dan timeline, 3) Desain prototipe UI/UX di Figma, 4) Pengembangan kode clean & testing, dan 5) Deployment & serah terima domain/hosting.",
    category: "Conversational & Persona"
  },
  {
    id: "persona_download_cv",
    title: "Panduan Download & Akses CV Digital",
    keywords: ["cv", "resume", "download cv", "unduh cv", "curriculum vitae"],
    text: "Anda dapat melihat dan mengunduh Curriculum Vitae (CV) digital Syaiful melalui halaman rute `/cv-saya`. Di halaman tersebut tersedia ringkasan karir profesional, daftar keahlian teknologi, riwayat proyek, dan tombol unduh file CV PDF resmi.",
    category: "Conversational & Persona"
  }
];

export const COMPLEX_KNOWLEDGE = [
  {
    id: "complex_pgmi_tech",
    title: "Sintesis Latar Belakang PGMI & Full Stack Developer",
    keywords: ["edukasi", "edutech", "teknologi", "pembelajaran"],
    text: "Latar belakang S1 PGMI (Pendidikan Guru Madrasah Ibtidaiyah) memberikan pemahaman mendalam tentang pedagogi, psikologi pembelajar, dan desain instruksional. Syaiful menyinergikan ilmu edukasi ini dengan teknologi web modern untuk membangun platform EduTech interaktif yang ramah pengguna dan berdampak pada pembelajaran bermutu.",
    category: "Complex & Multi-Turn"
  },
  {
    id: "complex_web_photo",
    title: "Komparasi Desain Web vs Fotografi Studio",
    keywords: ["estetika", "visual", "desain", "detail"],
    text: "Dalam kedua bidang, Syaiful memprioritaskan harmoni visual dan perhatian pada detail: dalam desain antarmuka web, ia menerapkan prinsip grid, kontras, dan hierarki glassmorphism, sedangkan dalam fotografi studio 5R ia mengontrol komposisi cahaya dan estetika artistik agar karya bercerita dengan kuat.",
    category: "Complex & Multi-Turn"
  },
  {
    id: "complex_freelance_eval",
    title: "Kelayakan Kerjasama Freelance E-Learning",
    keywords: ["edutech", "react", "pengalaman", "rekomendasi"],
    text: "Syaiful sangat direkomendasikan untuk proyek e-learning berbasis React. Dengan kombinasi pengalaman membangun 22+ proyek web, keahlian arsitektur frontend modern, serta wawasan mendalam di bidang EduTech, solusi yang dihasilkan terbukti interaktif dan berkualitas tinggi.",
    category: "Complex & Multi-Turn"
  },
  {
    id: "complex_pronoun_dia",
    title: "Konteks Profil: Pekerjaan dan Domisili 'Dia'",
    keywords: ["banjarmasin", "developer", "freelance"],
    text: "Dia berdomisili di Banjarmasin, Kalimantan Selatan, dan beraktivitas sebagai freelance software engineer serta konsultan digital learning yang fokus pada arsitektur web modern dan integrasi kecerdasan buatan.",
    category: "Complex & Multi-Turn"
  },
  {
    id: "complex_react19",
    title: "Fitur Baru React 19",
    keywords: ["react 19", "action", "hook", "performa"],
    text: "Fitur baru di React 19 mencakup Server Actions untuk mutasi data asinkron langsung dari form, hook baru seperti useActionState dan useOptimistic untuk UI dinamis, serta optimasi React Compiler yang meningkatkan performa rendering tanpa useMemo manual berlebihan.",
    category: "Complex & Multi-Turn"
  },
  {
    id: "complex_supabase_mongo",
    title: "Komparasi Supabase (Postgres) vs MongoDB",
    keywords: ["relasional", "schema", "nosql", "query"],
    text: "Pilih Supabase (PostgreSQL) jika aplikasi Anda memerlukan integritas relasional data yang ketat, schema terstruktur, Row-Level Security, query kompleks (JOIN), dan fitur realtime terintegrasi. Pilih NoSQL document store (MongoDB) jika data Anda tidak terstruktur dan menuntut skema fleksibel tanpa relasi antar entitas.",
    category: "Complex & Multi-Turn"
  },
  {
    id: "complex_myporto_arch",
    title: "Evaluasi Arsitektur Web my-porto",
    keywords: ["arsitektur", "knowledge base", "lokal", "supabase"],
    text: "Arsitektur website my-porto menggabungkan backend serverless Supabase untuk obrolan live chat real-time, LocalStorage dan cache SWR untuk responsivitas offline, Single Source of Truth knowledge base terpusat, serta sistem NLU lokal 256-D mandiri di browser tanpa ketergantungan API pihak ketiga.",
    category: "Complex & Multi-Turn"
  },
  {
    id: "complex_top3_milestones",
    title: "Tiga Pencapaian Terbesar Syaiful",
    keywords: ["proyek", "kkn", "sarjana", "prestasi"],
    text: "Tiga pencapaian utama Syaiful: Pertama di bidang akademik adalah penyelesaian studi sarjana S1 PGMI UIN Antasari. Kedua di karya web adalah pengembangan 22+ proyek aplikasi inovatif dan SaipulAI. Ketiga di kegiatan sosial adalah memimpin festival HARDAY FEST dan membina 4 sekolah saat pengabdian KKN di Desa Kundan.",
    category: "Complex & Multi-Turn"
  },
  {
    id: "complex_frontend_roadmap",
    title: "Rute Belajar Frontend Developer Pemula",
    keywords: ["html", "css", "javascript", "react", "tailwind"],
    text: "Rute belajar frontend pemula: Kuasai dasar HTML semantik dan struktur DOM, pelajari CSS modern dan framework utility Tailwind, perdalam logika JavaScript ES6+ (asynchronous, DOM, fetch), lalu pelajari ekosistem React (komponen, hooks, routing, state management) dengan mengerjakan proyek nyata.",
    category: "Complex & Multi-Turn"
  },
  {
    id: "complex_followup_project",
    title: "Konteks Kelanjutan: Proyek Portofolio Open-Source",
    keywords: ["proyek", "github", "repositori", "kode"],
    text: "Banyak proyek portofolio yang dikembangkan Syaiful bersifat open-source dan kode sumbernya dapat dipelajari di repositori GitHub resminya (@saipul16_), lengkap dengan dokumentasi clean code dan petunjuk instalasi.",
    category: "Complex & Multi-Turn"
  },
  {
    id: "complex_web_speed",
    title: "Saran Optimasi Kecepatan Loading Web",
    keywords: ["kompresi", "lazy", "bundle", "cache"],
    text: "Optimasi kecepatan website: Lakukan kompresi gambar ke WebP/AVIF, terapkan lazy loading komponen via React.lazy dan Suspense, optimalkan bundle chunk dengan tree-shaking Vite, dan gunakan caching browser (SWR / service worker) untuk loading instan.",
    category: "Complex & Multi-Turn"
  },
  {
    id: "complex_vision_clean_code",
    title: "Hubungan Visi Misi dan Clean Code",
    keywords: ["visi", "misi", "kualitas", "clean code"],
    text: "Prinsip Clean Code merupakan pengejawantahan dari misi Syaiful untuk menghadirkan solusi teknologi berkualitas tinggi yang berkelanjutan. Kode yang rapi, teruji, dan modular mencerminkan dedikasi profesional dalam membangun perangkat lunak bermanfaat bagi masyarakat.",
    category: "Complex & Multi-Turn"
  },
  {
    id: "complex_coder_educator",
    title: "Sinergi Koding dan Dunia Pendidik",
    keywords: ["kreativitas", "sinergi", "edukasi", "teknologi"],
    text: "Tidak ada kontradiksi antara menjadi programmer dan pendidik; justru terjadi sinergi yang saling memperkuat. Kreativitas edukasi membantu merancang antarmuka yang intuitif dan mudah dipahami, sementara keahlian teknologi mewujudkan media belajar digital yang interaktif dan modern.",
    category: "Complex & Multi-Turn"
  },
  {
    id: "complex_audio_visual",
    title: "Integrasi Audio dan Visual Web",
    keywords: ["sound", "efek", "interaktif", "audio"],
    text: "Integrasi audio sound effect yang dipadukan dengan animasi visual transisi memberikan umpan balik taktil dan pengalaman interaktif yang menyenangkan bagi pengguna saat berinteraksi di ruang chat atau menekan tombol navigasi.",
    category: "Complex & Multi-Turn"
  },
  {
    id: "complex_dark_light_mode",
    title: "Evaluasi Dark Mode vs Light Mode",
    keywords: ["kontras", "kenyamanan", "baterai", "aksesibilitas"],
    text: "Dark mode menawarkan kenyamanan visual di ruangan minim cahaya, menghemat baterai layar OLED, serta memberikan nuansa elegan mewah. Sementara mode terang ideal untuk membaca teks panjang di siang hari dengan rasio kontras dan aksesibilitas tinggi.",
    category: "Complex & Multi-Turn"
  },
  {
    id: "complex_why_tailwind",
    title: "Alasan Memilih Tailwind CSS",
    keywords: ["kecepatan", "konsistensi", "utility", "bundle"],
    text: "Memilih Tailwind CSS v4 dibandingkan CSS murni memberikan keunggulan kecepatan perancangan tanpa bolak-balik file terpisah, konsistensi design token (spacing, warna), utilitas bawaan untuk responsivitas, dan ukuran bundle akhir minimal karena CSS yang tidak dipakai otomatis dieliminasi.",
    category: "Complex & Multi-Turn"
  },
  {
    id: "complex_kkn_local_wisdom",
    title: "Kearifan Lokal dalam KKN Haruyan Dayak",
    keywords: ["dayak", "kearifan", "sosial", "budaya"],
    text: "Selama 32 hari KKN di Desa Kundan Haruyan Dayak, Syaiful dan rekan mahasiswa memadukan program modern (festival HARDAY FEST) dengan menghormati kearifan lokal suku Dayak Meratus, menjalin kebersamaan sosial yang harmonis dan penuh kehangatan budaya.",
    category: "Complex & Multi-Turn"
  },
  {
    id: "complex_satisfaction_metrics",
    title: "Analisis Metrik Kepuasan Kolaborasi",
    keywords: ["rating", "klien", "kepuasan", "kolaborasi"],
    text: "Rating kepuasan kolaborasi di atas 4.8/5 dicapai berkat komunikasi transparan, ketepatan estimasi waktu pengerjaan, kode yang modular dan minim bug, serta dukungan purna-rilis yang ramah kepada klien dan rekan kerja.",
    category: "Complex & Multi-Turn"
  },
  {
    id: "complex_runtime_errors",
    title: "Penanganan Error Runtime di Production",
    keywords: ["errorboundary", "fallback", "monitoring", "log"],
    text: "Menangani error runtime tak terduga di production: Gunakan komponen React ErrorBoundary untuk menangkap error di tree UI tanpa membuat seluruh halaman crash, tampilkan antarmuka fallback yang informatif, dan catat log peringatan secara aman.",
    category: "Complex & Multi-Turn"
  },
  {
    id: "complex_serverless_benefits",
    title: "Keuntungan Arsitektur Serverless",
    keywords: ["skalabilitas", "maintenance", "biaya", "serverless"],
    text: "Arsitektur serverless (seperti Supabase dan edge hosting) meniadakan kebutuhan konfigurasi server fisik (zero server maintenance), menurunkan biaya operasional, dan menawarkan skalabilitas otomatis instan sesuai volume traffic pengunjung.",
    category: "Complex & Multi-Turn"
  },
  {
    id: "complex_dicoding_synthesis",
    title: "Sintesis Sertifikat Dicoding & Portofolio",
    keywords: ["kompetensi", "standar", "industri", "sertifikat"],
    text: "Sertifikasi resmi dari Dicoding Academy dan platform teknologi lainnya membuktikan kompetensi teknis Syaiful yang telah tervalidasi sesuai standar industri software engineering internasional.",
    category: "Complex & Multi-Turn"
  },
  {
    id: "complex_harday_legacy",
    title: "Keberlanjutan Program HARDAY FEST",
    keywords: ["generasi", "dampak", "komunitas", "pemuda"],
    text: "HARDAY FEST yang dirintis saat KKN di Haruyan Dayak dirancang untuk memberikan dampak jangka panjang bagi generasi muda desa, membangkitkan semangat sportivitas pemuda, dan menjadi wadah ekspresi seni komunitas yang berkelanjutan.",
    category: "Complex & Multi-Turn"
  },
  {
    id: "complex_next_step",
    title: "Rencana Kelanjutan Karir Pasca Sarjana",
    keywords: ["wisuda", "sarjana", "karir", "pengembangan"],
    text: "Setelah menyelesaikan studi sarjana dan wisuda, fokus Syaiful berlanjut pada pengembangan platform digital edukasi berskala lebih luas, ekspansi karir software engineering profesional, serta kontribusi aktif dalam komunitas open-source.",
    category: "Complex & Multi-Turn"
  },
  {
    id: "complex_local_ai_reason",
    title: "Alasan SaipulAI Dijalankan Lokal di Browser",
    keywords: ["privasi", "biaya", "latensi", "mandiri"],
    text: "SaipulAI dirancang berjalan lokal di browser pengguna untuk menjamin 100% privasi data, menghilangkan latensi jaringan server eksternal, menghemat biaya operasional cloud API, dan memungkinkan chatbot beroperasi secara mandiri dan offline.",
    category: "Complex & Multi-Turn"
  },
  {
    id: "complex_blog_comments",
    title: "Pentingnya Komentar & Diskusi di Blog",
    keywords: ["feedback", "diskusi", "komunitas", "interaksi"],
    text: "Fitur komentar dan diskusi pada artikel blog sangat penting untuk membangun ruang interaksi dua arah antara penulis dan pembaca, menjaring feedback bermutu, serta menumbuhkan ekosistem komunitas pembelajar teknologi yang aktif.",
    category: "Complex & Multi-Turn"
  },
  {
    id: "complex_rag_vs_finetune",
    title: "Perbandingan RAG vs Fine-Tuning untuk Kebutuhan AI",
    keywords: ["rag vs finetuning", "fine-tuning", "retrieval", "kapan rag", "finetuning"],
    text: "Pilih RAG jika Anda ingin AI menjawab data dinamis yang sering berubah (seperti katalog portofolio, database dokumen, harga) tanpa biaya komputasi training ulang dan bebas halusinasi. Pilih Fine-Tuning jika Anda ingin mengubah gaya bicara, struktur format output khusus, atau mengajarkan bahasa/terminologi domain sempit yang tidak dipahami model dasar.",
    category: "Complex & Multi-Turn"
  },
  {
    id: "complex_streaming_shorts",
    title: "Integrasi Fitur Streaming & Shorts di Portofolio",
    keywords: ["streaming", "shorts", "video player", "konten visual", "video"],
    text: "Halaman `/streming` dan `/gallery` menghadirkan media edukasi multimedia interaktif, mencakup shorts vertikal video pembelajaran, video dokumentasi event, pemutar kustom adaptif, serta sistem komentar interaktif yang terhubung dengan akun komunitas pengguna.",
    category: "Complex & Multi-Turn"
  }
];

export const COMMUNITY_KNOWLEDGE = [
  {
    id: "comm_live_mention",
    title: "Fitur Live Room: Menyapa @Saipul",
    keywords: ["@saipul", "@ai", "live-discussion", "respon"],
    text: "Di halaman Live-Discussion room, Anda dapat mengetik mention '@saipul' atau '@ai' di kolom obrolan untuk memicu respon dan analisis otomatis dari SaipulAI secara real-time.",
    category: "Navigation & Community"
  },
  {
    id: "comm_badges",
    title: "Tingkatan Lencana Role di Live Room",
    keywords: ["super admin", "admin", "moderator", "premium", "verified", "user"],
    text: "Tingkatan badge pengguna di room diskusi live: Super Admin (pengembang utama), Admin (pengelola sistem), Moderator (penjaga ketertiban obrolan), Premium (kontributor khusus), Verified (pengguna terverifikasi), dan User (anggota komunitas umum).",
    category: "Navigation & Community"
  },
  {
    id: "comm_slowmode",
    title: "Aturan Slowmode Cooldown Chat",
    keywords: ["slowmode", "cooldown", "spam", "nyaman"],
    text: "Fitur Slowmode cooldown di live room menerapkan jeda waktu beberapa detik antar pengiriman pesan untuk mencegah spamming dan memastikan percakapan komunitas tetap tertib, nyaman, dan terbaca dengan baik.",
    category: "Navigation & Community"
  },
  {
    id: "comm_polling",
    title: "Fitur Polling Interaktif di Live Room",
    keywords: ["polling", "suara", "hasil", "interaktif"],
    text: "Fitur Polling di Live Room memungkinkan admin dan anggota membuat pemungutan suara interaktif secara real-time untuk melihat preferensi komunitas dan menampilkan grafik persentase hasil seketika.",
    category: "Navigation & Community"
  },
  {
    id: "comm_stickers",
    title: "Kirim Emoji dan Stiker Interaktif",
    keywords: ["emoji", "reaksi", "pesan", "ekspresi"],
    text: "Pengguna dapat mengekspresikan diri di room obrolan dengan mengirimkan emoji standar dan stiker reaksi cepat yang langsung muncul di balon pesan obrolan.",
    category: "Navigation & Community"
  },
  {
    id: "comm_err_404",
    title: "Penjelasan Error 404 Not Found",
    keywords: ["404", "tidak ditemukan", "url", "periksa"],
    text: "Pesan Error 404 Not Found menandakan halaman atau rute yang Anda tuju tidak ditemukan di server. Silakan periksa kembali penulisan URL di browser atau gunakan tautan menu utama untuk kembali ke beranda.",
    category: "Navigation & Community"
  },
  {
    id: "comm_err_503",
    title: "Penjelasan Error 503 Maintenance",
    keywords: ["503", "pemeliharaan", "server", "stabil"],
    text: "Halaman Error 503 Service Unavailable / Maintenance muncul saat server sedang dalam proses pemeliharaan sistem atau pembaruan fitur. Sistem akan segera kembali normal dan stabil dalam beberapa menit.",
    category: "Navigation & Community"
  },
  {
    id: "comm_err_401",
    title: "Penjelasan Error 401 Unauthorized",
    keywords: ["401", "login", "izin", "akses"],
    text: "Halaman Error 401 Unauthorized menunjukkan bahwa rute tersebut membutuhkan autentikasi login atau hak izin akses khusus (seperti dashboard admin). Silakan login terlebih dahulu untuk melanjutkan.",
    category: "Navigation & Community"
  },
  {
    id: "comm_tts_troubleshoot",
    title: "Troubleshooting Suara Chatbot Tidak Keluar",
    keywords: ["suara", "pengaturan", "browser", "tts"],
    text: "Jika fitur Text-to-Speech (TTS) suara chatbot tidak bersuara: Buka menu pengaturan chatbot, pastikan toggle respon suara aktif, periksa volume audio perangkat Anda, dan pastikan browser mengizinkan pemutaran audio otomatis.",
    category: "Navigation & Community"
  },
  {
    id: "comm_offline_mode",
    title: "Troubleshooting Mode Offline / Koneksi Terputus",
    keywords: ["jaringan", "koneksi", "refresh", "internet"],
    text: "Jika muncul notifikasi koneksi terputus: Periksa koneksi internet perangkat Anda, coba refresh halaman, dan sistem akan otomatis memuat data offline dari cache lokal agar Anda tetap dapat membaca konten.",
    category: "Navigation & Community"
  },
  {
    id: "comm_guidelines",
    title: "Panduan Tata Tertib Obrolan Komunitas",
    keywords: ["sopan", "komunitas", "kebijakan", "nyaman"],
    text: "Tata tertib komunitas live room: Berkomunikasilah secara sopan, hindari ujaran kebencian/SARA, jangan menyebarkan tautan berbahaya, dan patuhi kebijakan moderasi demi terciptanya ruang diskusi yang nyaman bagi semua.",
    category: "Navigation & Community"
  },
  {
    id: "comm_presence",
    title: "Status Online Presence Pengguna",
    keywords: ["online", "presence", "realtime", "status"],
    text: "Fitur status kehadiran (Presence) menampilkan jumlah pengguna dan admin yang sedang online secara real-time di website melalui channel Supabase Realtime.",
    category: "Navigation & Community"
  },
  {
    id: "comm_version_update",
    title: "Pemberitahuan Update Versi Website",
    keywords: ["updatenotification", "versi", "changelog", "/help/version"],
    text: "Website ini dilengkapi komponen UpdateNotification otomatis yang memunculkan banner saat tersedia pembaruan versi. Anda dapat membaca riwayat perubahan dan changelog lengkap di rute `/help/version`.",
    category: "Navigation & Community"
  },
  {
    id: "comm_clear_history",
    title: "Cara Menghapus Riwayat Obrolan Chat",
    keywords: ["hapus", "ikon sampah", "riwayat", "bersih"],
    text: "Untuk membersihkan obrolan: Klik tombol ikon sampah (hapus riwayat) di bagian atas jendela obrolan SaipulAI. Riwayat pesan di memori lokal browser akan langsung bersih seketika.",
    category: "Navigation & Community"
  },
  {
    id: "comm_export_chat",
    title: "Ekspor Obrolan Chat",
    keywords: ["ekspor", "unduh", "json", "simpan"],
    text: "Anda dapat mengekspor dan mengunduh seluruh salinan riwayat obrolan dalam format file JSON atau teks melalui menu opsi obrolan untuk disimpan di perangkat Anda.",
    category: "Navigation & Community"
  }
];

export const SAFETY_KNOWLEDGE = [
  {
    id: "safe_pii_protect",
    title: "Perlindungan Data Pribadi (PII)",
    keywords: ["privasi", "aman", "rahasia"],
    text: "Sistem SaipulAI menjamin privasi dan kerahasiaan Anda. Data sensitif seperti NIK KTP atau nomor kartu kredit tidak akan pernah disimpan atau dibagikan, dan sistem secara otomatis menyamarkan data rahasia demi keamanan pengguna.",
    category: "Safety & Ethics"
  },
  {
    id: "safe_profanity_mod",
    title: "Moderasi Kata Kasar & Ujaran",
    keywords: ["maaf", "sopan", "bantu", "perbaiki"],
    text: "Mohon maaf jika ada hal yang kurang berkenan. Mari gunakan bahasa yang sopan dan santun. Saya siap membantu memperbaiki masalah atau mendengarkan masukan membangun untuk portofolio ini.",
    category: "Safety & Ethics"
  },
  {
    id: "safe_crisis_support",
    title: "Dukungan Krisis & Pencegahan Self-Harm",
    keywords: ["bantuan", "berharga", "layanan", "keluarga"],
    text: "Hidup Anda sangat berharga. Jika Anda merasa tertekan atau putus asa, mohon jangan ragu mencari bantuan profesional, berbicara dengan keluarga terdekat, atau menghubungi layanan konseling psikologis darurat (seperti Hotline Kesehatan Jiwa 119 ext 8). Anda tidak sendirian.",
    category: "Safety & Ethics"
  },
  {
    id: "safe_admin_impersonate",
    title: "Verifikasi Keamanan Akses Pemilik",
    keywords: ["autentikasi", "dashboard", "login"],
    text: "Akses konsol administratif memerlukan proses autentikasi resmi melalui halaman login dashboard yang terenkripsi. Hak istimewa sistem tidak dapat diberikan melalui teks percakapan biasa.",
    category: "Safety & Ethics"
  },
  {
    id: "safe_chat_privacy",
    title: "Privasi Obrolan Pengunjung",
    keywords: ["lokal", "browser", "privasi", "aman"],
    text: "Obrolan Anda diproses dan disimpan secara lokal di memori browser Anda sendiri. Kami tidak mengirimkan riwayat percakapan pribadi Anda ke server pihak ketiga demi menjaga privasi dan keamanan data Anda.",
    category: "Safety & Ethics"
  },
  {
    id: "safe_sarcasm_boundary",
    title: "Batasan Fakta & Privasi Pribadi",
    keywords: ["privasi", "portofolio", "informasi"],
    text: "Sebagai AI portofolio profesional, cakupan informasi saya difokuskan pada data portofolio, karya web, dan perjalanan karir Syaiful. Saya menghormati privasi dan tidak memiliki akses ke data personal pihak luar.",
    category: "Safety & Ethics"
  },
  {
    id: "safe_framework_neutral",
    title: "Netralitas Pemilihan Framework",
    keywords: ["kelebihan", "kekurangan", "kebutuhan"],
    text: "Setiap framework dan bahasa pemrograman memiliki kelebihan dan kekurangan masing-masing. Pemilihan alat terbaik selalu bergantung pada kebutuhan proyek, skala aplikasi, dan keahlian tim pengembang.",
    category: "Safety & Ethics"
  },
  {
    id: "safe_medical_disclaimer",
    title: "Disclaimer Pertanyaan Medis Darurat",
    keywords: ["dokter", "medis", "rumah sakit", "darurat"],
    text: "Peringatan Medis: Nyeri dada menusuk dan sesak napas merupakan kondisi darurat medis. Segera hubungi dokter, datangi Instalasi Gawat Darurat (IGD) rumah sakit terdekat, atau hubungi ambulans darurat 118/119. Jangan menunda penanganan medis langsung.",
    category: "Safety & Ethics"
  },
  {
    id: "safe_financial_disclaimer",
    title: "Disclaimer Investasi & Finansial Spekulatif",
    keywords: ["risiko", "bukan nasihat", "keuangan"],
    text: "Peringatan Finansial: Pasar cryptocurrency memiliki tingkat risiko fluktuasi yang sangat tinggi. Informasi ini bukan nasihat keuangan profesional. Jangan mempertaruhkan seluruh tabungan hidup Anda pada instrumen spekulatif tanpa riset mandiri yang mendalam.",
    category: "Safety & Ethics"
  },
  {
    id: "safe_copyright_ethics",
    title: "Etika Hak Cipta & Lisensi Kode",
    keywords: ["lisensi", "hak cipta", "atribusi", "izin"],
    text: "Menyalin seluruh kode proyek tanpa izin dan mengklaimnya sebagai karya pribadi melanggar etika dan hak cipta. Anda disarankan mematuhi lisensi open-source (misal MIT) dengan memberikan atribusi dan kredit yang layak kepada pembuat aslinya.",
    category: "Safety & Ethics"
  },
  {
    id: "safe_political_neutral",
    title: "Netralitas Politik dan Isu SARA",
    keywords: ["netral", "menghormati", "portofolio"],
    text: "Sebagai asisten teknologi portofolio, saya bersikap netral dan menghormati keberagaman suku, budaya, serta pandangan politik, dengan fokus memberikan manfaat positif melalui solusi digital edukatif.",
    category: "Safety & Ethics"
  },
  {
    id: "safe_tracking_security",
    title: "Keamanan dari Pelacakan Pihak Ketiga",
    keywords: ["keamanan", "privasi", "lokal", "enkripsi"],
    text: "Website ini dirancang mengedepankan privasi dengan minim pelacakan pihak ketiga: tidak memasang tracker iklan agresif, menjalankan pemrosesan NLP secara lokal di perangkat Anda, dan menggunakan enkripsi HTTPS standar industri.",
    category: "Safety & Ethics"
  },
  {
    id: "safe_bank_balance",
    title: "Informasi Saldo Finansial Pribadi",
    keywords: ["privasi", "rahasia"],
    text: "Informasi keuangan seperti saldo rekening tabungan bank merupakan ranah privasi pribadi yang bersifat rahasia dan tidak tersimpan di dalam basis data publik portofolio ini.",
    category: "Safety & Ethics"
  },
  {
    id: "safe_lottery_prediction",
    title: "Penolakan Prediksi Lotre / Togel",
    keywords: ["spekulasi", "prediksi", "portofolio"],
    text: "Saya adalah asisten AI edukasi dan portofolio, bukan sistem ramalan atau perjudian. Saya tidak melayani spekulasi angka atau prediksi undian semacam itu.",
    category: "Safety & Ethics"
  }
];

export const LINGUISTICS_KNOWLEDGE = [
  {
    id: "ling_banjar_kabar",
    title: "Bahasa Banjar: Menanyakan Kabar",
    keywords: ["habar", "baik", "bantu"],
    text: "Alhamdulillah habar baik banar dingsanak ai! Senang kawa bakesahan lawan pian. Ada nang kawa ulun bantu kah gasan itihi portofolio Syaiful?",
    category: "Linguistics & Typos"
  },
  {
    id: "ling_banjar_asal",
    title: "Bahasa Banjar: Asal Daerah Syaiful",
    keywords: ["banjarmasin", "kalimantan selatan"],
    text: "Syaiful aslinya urang Banjar, badomisili di kuta Banjarmasin, Kalimantan Selatan, lulusan S1 PGMI UIN Antasari Banjarmasin.",
    category: "Linguistics & Typos"
  },
  {
    id: "ling_banjar_kkn",
    title: "Bahasa Banjar: Kegiatan KKN Bahari",
    keywords: ["desa kundan", "haruyan dayak", "kkn"],
    text: "Syaiful suah KKN salawas 32 hari di Desa Kundan, Haruyan Dayak, Pagat, Kab. Hulu Sungai Tengah (HST). Rami banar maulah acara HARDAY FEST wan mambina kakanakan di 4 sikulahan.",
    category: "Linguistics & Typos"
  },
  {
    id: "ling_banjar_skill",
    title: "Bahasa Banjar: Keahlian Aplikasi",
    keywords: ["web", "frontend", "react"],
    text: "Syaiful harat banar maulah aplikasi web modern, khususnya di bidang frontend mamakai React, Vite, wan Tailwind CSS nang responsive wan kancang loadingnya.",
    category: "Linguistics & Typos"
  },
  {
    id: "ling_islamic_greeting",
    title: "Salam Islami Assalamu'alaikum",
    keywords: ["wa'alaikumsalam", "bantu"],
    text: "Wa'alaikumsalam warahmatullahi wabarakatuh! Selamat datang di portofolio Muhammad Syaiful Mukmin. Ada yang bisa saya bantu untuk Anda hari ini?",
    category: "Linguistics & Typos"
  },
  {
    id: "ling_english_profile",
    title: "English Profile of Syaiful",
    keywords: ["syaiful", "developer", "software", "web"],
    text: "Muhammad Syaiful Mukmin (Syaiful) is a software engineer and EduTech specialist from Banjarmasin, Indonesia, specializing in modern web development, clean code architecture, and AI integration.",
    category: "Linguistics & Typos"
  },
  {
    id: "ling_english_tech",
    title: "English Frontend Technologies",
    keywords: ["react", "tailwind", "vite", "frontend"],
    text: "The frontend tech stack in this portfolio includes React, Tailwind CSS, Vite, Framer Motion for smooth transitions, and high-performance client-side NLP architecture.",
    category: "Linguistics & Typos"
  },
  {
    id: "ling_english_contact",
    title: "English Contact Information",
    keywords: ["linkedin", "instagram", "email", "contact"],
    text: "You can contact Syaiful for freelance projects or professional inquiries via LinkedIn (Muhammad Syaiful Mukmin), Instagram (@saipul16_), or email at syaifulmukmin.dev@gmail.com.",
    category: "Linguistics & Typos"
  },
  {
    id: "ling_bahasa_multilingual",
    title: "Kemampuan Bahasa Komunikasi Syaiful",
    keywords: ["bahasa", "bahasa sehari-hari", "multilingual", "inggris", "arab", "banjar", "jepang", "jawa"],
    text: "Syaiful memiliki penguasaan multibahasa: Bahasa Indonesia (Utama/Native), Bahasa Banjar (Fasih Daerah), Bahasa Inggris (Skor TOEFL 520 / B2 Upper-Intermediate untuk komunikasi teknis), Bahasa Jawa (Dasar), dan Bahasa Jepang (Pemula N5). Kunjungi rute /bahasa untuk detailnya.",
    category: "Linguistics & Typos"
  },
  {
    id: "ling_bahasa_programming",
    title: "Keahlian Bahasa Pemrograman & Stack Teknologi",
    keywords: ["bahasa pemrograman", "coding", "javascript", "python", "typescript", "react", "golang", "docker", "tech stack"],
    text: "Di halaman /bahasa, Syaiful mendokumentasikan 31+ teknologi dan bahasa pemrograman yang dikuasainya, mulai dari JavaScript (Mahir 90%), Python (Lanjutan 85%), React (Mahir 88%), TypeScript (Mahir 88%), SQL (80%), PHP (75%), Docker (87%), hingga Go, Rust, dan Kotlin lengkap dengan framework dan proyek terkait.",
    category: "Linguistics & Typos"
  }
];
