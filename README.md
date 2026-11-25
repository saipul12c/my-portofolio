# 🌐 Syaiful Mukmin — Portfolio Website & SaipulAI

[![Version](https://img.shields.io/badge/version-1.20.0-06b6d4?style=flat-square)](CHANGELOG.md)
[![License: AGPL v3](https://img.shields.io/badge/License-AGPLv3-blue.svg?style=flat-square)](LICENSE.md)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-syaiful--mukmin.netlify.app-10b981?style=flat-square&logo=netlify&logoColor=white)](https://syaiful-mukmin.netlify.app/)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg?style=flat-square)](CODE_OF_CONDUCT.md)
[![Security Policy](https://img.shields.io/badge/Security-Policy-ef4444?style=flat-square)](SECURITY.md)

**Website portofolio resmi & ekosistem AI interaktif oleh M. Syaiful Mukmin** — menampilkan katalog proyek, keahlian, pengalaman profesional, blog teknis, galeri fotografi 3D/visual, dokumentasi akademik, ruang diskusi real-time, serta asisten cerdas **SaipulAI v8.0.0** (Dual-Engine: inferensi lokal di browser + Public REST API `/api/saipul`).

> 🔗 **Tautan Cepat:** [Website Live](https://syaiful-mukmin.netlify.app/) · [API Publik `/api/saipul`](#-api-publik-terbuka-third-party-access) · [Panduan Kontribusi](CONTRIBUTING.md) · [Keamanan](SECURITY.md) · [Aksesibilitas](ACCESSIBILITY.md) · [Hak Cipta Aset](COPYRIGHT.md)

---

## 📋 Tentang Proyek

Website portfolio ini dibangun dengan **React 19 + Vite 7 + Tailwind CSS v4** di sisi antarmuka modern, dipadukan dengan **Supabase** (database & autentikasi dengan Row Level Security), **Netlify Functions / Node.js HTTP** untuk endpoint publik **SaipulAI (`/api/saipul`)**, serta antarmuka CLI (`saipul-cli`). Platform ini dirancang untuk memperkenalkan profil profesional secara interaktif, mendokumentasikan karya kreatif, sekaligus menyediakan layanan tanya-jawab cerdas yang aman dan responsif.

**Tech Stack:**
- **Frontend & 3D:** React 19, Vite 7, Tailwind CSS v4 (`@tailwindcss/vite`), React Router v7, Framer Motion, Three.js (`@react-three/fiber`, `@react-three/drei`, `@react-three/rapier`)
- **AI & NLP Engine (SaipulAI v8.0.0):** On-Device NLU (`compromise`, `fuse.js`, `sentiment`), Symbolic & Numerical Math (`mathjs`), Deep Neural Pipeline, Web SDK (`public/saipul-sdk.js`), & CLI (`bin/saipul-cli.js`)
- **Backend, Data & Serverless:** Supabase (`@supabase/supabase-js`), Node.js HTTP / Netlify Functions (`/api/saipul`), Socket.IO Client
- **Styling Architecture:** 100% Pure Tailwind CSS v4 (Zero legacy custom CSS files, `@theme` design tokens)
- **Tools & Visualisasi:** EmailJS, Recharts, React Markdown (`remark-gfm`), Lucide React, React Icons, React Window (virtualization)
- **Features & Protection:** Dark/Light Theme Tokens, SEO & JSON-LD, Error Boundary, Rate Limiting, Filter PII, & Responsive Design

---

## 🗺️ Struktur Halaman Website

### 📍 **Halaman Utama & Navigasi**

| Halaman | Path | Deskripsi |
|---------|------|-----------|
| **🏠 Home (Launching Page)** | `/` | Halaman selamat datang dengan informasi singkat |
| **📍 Dashboard/Hub** | `/hub` | Pusat navigasi utama ke semua halaman |
| **❓ Help & FAQ** | `/help/*` | Dokumentasi, FAQ, versi website, komitmen |

---

### 👨‍💻 **Halaman Profil & Informasi**

| Halaman | Path | Deskripsi |
|---------|------|-----------|
| **👤 Tentang Saya** | `/tentang` | Biodata, background, keterampilan teknis, soft skills, pendidikan & sertifikasi |
| **🛠️ Keterampilan** | `/skills` | Daftar skills dengan progress bar, kategorisasi per bahasa/framework |
| **📧 Kontak** | `/admin/contact` | Form kontak dengan validasi, social media links, integrasi email |
| **📝 Sertifikasi** | `/sertif` | Sertifikat & penghargaan yang telah diperoleh |

---

### 💼 **Portfolio & Proyek**

| Halaman | Path | Deskripsi |
|---------|------|-----------|
| **💻 Proyek (Projects)** | `/projek` | Galeri proyek dengan grid layout, filter kategori, detail proyek, link GitHub/demo |
| **🔍 Detail Proyek** | `/projek/detail/:id` | Halaman detail proyek dengan teknologi, screenshot, deskripsi lengkap |
| **🔎 Pencarian Proyek** | `/projek/pencarian` | Fitur pencarian & filter proyek |

---

### 📚 **Blog & Konten**

| Halaman | Path | Deskripsi |
|---------|------|-----------|
| **📖 Blog** | `/blog` | Daftar artikel, posting, dan tulisan teknis |
| **📄 Detail Blog** | `/blog/detail/:id` | Halaman artikel lengkap dengan markdown support |
| **👥 User Blog** | `/blog/users` | Profil penulis & artikel mereka |

---

### 📸 **Galeri & Multimedia**

| Halaman | Path | Deskripsi |
|---------|------|-----------|
| **📷 Fotografi** | `/foto` | Galeri foto dengan kategori, lightbox viewer |
| **🎓 Sekolah/Pendidikan** | `/sekolah` | Foto & dokumentasi pendidikan |
| **🏢 Kantor/Kerja** | `/bahasa` | Dokumentasi lingkungan kerja |

---

### 🎯 **Halaman Khusus**

| Halaman | Path | Deskripsi |
|---------|------|-----------|
| **💭 Kenangan** | `/kenangan` | Koleksi momen & kenangan pribadi |
| **👁️ Visi & Misi** | `/visi` | Visi, misi, dan tujuan profesional |
| **🌐 Zodiak** | `/website/zodiak` | Mini website/tool: zodiak calculator |
| **🚀 Qodam** | `/website/qodam` | Mini website/tool: Qodam |
| **⚠️ Error Page** | `/error` | Halaman error yang protected dan terstruktur |
| **🛡️ Admin** | `/admin/*` | Halaman admin (kontak, pengaturan) |

---

## ✨ Fitur Utama

### 🎨 **UI/UX & Visual 3D**
- ✅ **100% Pure Tailwind CSS v4 & Design Tokens** - Styling berbasis `@theme` tokens di `src/index.css` dengan opsi switch tema (`default` / `dark` / `light`) pada modul Live Discussion
- ✅ **3D Interactive Graphics** - Elemen visual 3D interaktif menggunakan `Three.js` (`@react-three/fiber`, `@react-three/drei`, `@react-three/rapier`)
- ✅ **Responsive Design** - Optimal di semua ukuran perangkat (mobile, tablet, desktop)
- ✅ **Animasi & Transisi Halus** - Animasi komponen dengan `Framer Motion` dan halaman loading transisi
- ✅ **Global Error Boundary & Protected Error Pages** - Penanganan error terstruktur (`GlobalErrorBoundary`, `ProtectedErrorPage` untuk `/401`, `/403`, `/408`, `/500`, `/502`, `/503`) serta `LaunchGuard`
- ✅ **Aksesibilitas (ARIA)** - Pelabelan `aria-label` pada kontrol navigasi, bantuan, notifikasi, dan chat (lihat [ACCESSIBILITY.md](ACCESSIBILITY.md))

### 🤖 **Ekosistem SaipulAI v8.0.0**
- ✅ **Dual-Engine Architecture** - Inferensi *on-device* langsung di browser yang selaras dengan Public REST API (`/api/saipul`) dan CLI (`bin/saipul-cli.js`)
- ✅ **Bilingual NLU & Explainable AI (XAI)** - Pemahaman bahasa Indonesia/Inggris, deteksi sarkasme/sentimen/emosi, *confidence score*, dan inspeksi alur berpikir AI
- ✅ **Math & Analytics Engine** - Kalkulator simbolik/numerik (`mathjs`: linear, kuadrat, integral, turunan) serta analitik statistik deterministik
- ✅ **Multi-Turn Context & SSE Streaming** - Memori percakapan hingga 10 putaran dan dukungan *Server-Sent Events* (SSE)
- ✅ **Kontrol Suara & 4 Tab Pengaturan Fungsional** - Dukungan Text-to-Speech & *speech recognition* Web Speech API, mode privasi, serta pintasan keyboard (`/help/chatbot/settings`)

### 🚀 **Performa & Optimasi**
- ✅ **List Virtualization** - Performa optimal untuk daftar panjang dengan `react-window` dan `@tanstack/react-virtual`
- ✅ **Code Splitting & Lazy Loading** - Pemisahan *chunk* manual di `vite.config.js` (`vendor`, `three`, `motion`, `charts`, `nlp`, `supabase`, dll.) serta `React.lazy` & `Suspense`
- ✅ **Asset Compression** - Kompresi otomatis `gzip` dan `brotli` (`.br`) pada build produksi via `vite-plugin-compression`
- ✅ **SEO & Version Tracking** - Meta tags Open Graph/Twitter, JSON-LD *Structured Data*, `sitemap.xml`, `robots.txt`, dan deteksi pembaruan otomatis via `public/version.json` (`UpdateNotification`)

### 💻 **Developer, API, & Keamanan**
- ✅ **Public REST API (`/api/saipul`) & Web SDK (`public/saipul-sdk.js`)** - Endpoint publik tanpa kredensial sensitif untuk integrasi eksternal, dilengkapi allowlist endpoint ketat (`404` untuk `/api/*` non-publik, `405` untuk metode selain `GET`/`POST`/`OPTIONS`)
- ✅ **Proteksi API Lintas-Runtime** - Rate limiting (`30` req/menit/IP), batas payload `64 KB`, batas query `2500` karakter, sanitasi riwayat dialog, filter PII, serta header keamanan HTTP/CORS (berjalan di Vite middleware, Node HTTP `server/saipul-server.js`, dan Netlify Functions)
- ✅ **Supabase Integration** - Autentikasi dan pengelolaan data dinamis (`@supabase/supabase-js`) dengan skema SQL & *Row Level Security* (`database_supa/`)
- ✅ **ESLint & Automated Test Suites** - Konfigurasi ESLint (`eslint.config.js`) dan pengujian NLU, keamanan API, harmonisasi, CLI, serta benchmark (`test/`)
- ✅ **Email Integration** - Pengiriman pesan form kontak melalui `EmailJS`

### 📱 **Elemen Interaktif & Komunitas**
- ✅ **Help System & Interactive AI Docs (`/help/*`)** - Dokumentasi SaipulAI dengan *Live API Playground* (`ApiDocs.jsx`), FAQ, riwayat versi, komitmen, serta halaman Keamanan & Privasi (`/live-cs/security`, `/live-cs/privacy`)
- ✅ **Live Discussion Room & Blog Admin** - Ruang diskusi real-time (`/Live-Discussion`) dan dashboard manajemen blog terproteksi (`/blog-admin/*`)
- ✅ **Pencarian, Filter, & Visualisasi** - Pencarian konten (`fuse.js`), grafik statistik (`recharts`), markdown rendering (`react-markdown`, `remark-gfm`), modal interaktif, dan notifikasi toast (`react-toastify`)

---

## 📁 Struktur Folder

```
my-porto/
├── src/                              # Frontend (React + Vite)
│   ├── pages/
│   │   ├── Home.jsx                 # Halaman beranda
│   │   ├── LaunchingPage.jsx        # Halaman launching
│   │   ├── tentang/                 # Halaman about/tentang
│   │   ├── admin/                   # Halaman admin (contact)
│   │   ├── foto/                    # Galeri fotografi
│   │   ├── projek/                  # Halaman proyek
│   │   │   ├── Projects.jsx
│   │   │   ├── detail/              # Detail proyek
│   │   │   └── pencarian/           # Pencarian proyek
│   │   ├── blog/                    # Blog & artikel
│   │   │   ├── Blog.jsx
│   │   │   ├── detail/              # Detail artikel
│   │   │   └── users/               # User blog
│   │   ├── skills/                  # Halaman skills
│   │   ├── sertif/                  # Halaman sertifikasi
│   │   ├── sekolah/                 # Halaman pendidikan
│   │   ├── kenangan/                # Halaman kenangan
│   │   ├── visi/                    # Halaman visi & misi
│   │   ├── bahasa/                  # Halaman bahasa/kerja
│   │   ├── hub/                     # Halaman hub
│   │   ├── website/                 # Mini websites
│   │   │   ├── zodiak/
│   │   │   └── qodam/
│   │   └── errors/                  # Error pages
│   ├── components/
│   │   ├── Navbar.jsx               # Navigation bar
│   │   ├── Footer.jsx               # Footer
│   │   ├── HelpButton.jsx           # Tombol bantuan
│   │   ├── LaunchGuard.jsx          # Launch protection
│   │   ├── ProtectedErrorPage.jsx   # Error page protection
│   │   ├── helpbutton/              # Komponen help (docs, FAQ, dll)
│   │   └── ...
│   ├── context/
│   │   ├── ErrorContext.jsx         # Error state management
│   │   └── ...
│   ├── App.jsx                      # Root component & routing
│   ├── main.jsx                     # Entry point
│   └── ...
├── api/                              # Public REST API Handler (SaipulAI)
│   └── saipul.js                     # Endpoint publik /api/saipul (GET, POST, OPTIONS)
├── server/                           # Standalone Node HTTP Server
│   └── saipul-server.js              # Server mandiri port 3001 untuk /api/saipul
├── netlify/functions/                # Netlify Serverless Functions
│   └── saipul.js                     # Wrapper serverless untuk /api/saipul
├── bin/                              # CLI Tools
│   └── saipul-cli.js                 # SaipulAI CLI
├── database_supa/                    # Skema SQL & RLS Supabase
├── public/                           # Static files
│   ├── saipul-sdk.js                 # Web SDK klien untuk /api/saipul
│   ├── _redirects                    # Aturan routing Netlify (/api/saipul -> function)
│   └── ...
├── package.json                      # Project dependencies & scripts
├── vite.config.js                    # Vite configuration & dev/preview API middleware
└── README.md                         # This file
```

---

## 🚀 Cara Menjalankan

### Prerequisites
- Node.js v18+ 
- npm

### Installation

**1. Clone repository:**
```bash
git clone https://github.com/saipul12c/my-portofolio.git
cd my-portofolio
```

**2. Install dependencies:**
```bash
npm install
```

### Development

**1. Jalankan Vite dev server (frontend + middleware `/api/saipul`):**
```bash
npm run dev
```
Website akan terbuka di `http://localhost:5173`

**2. Jalankan standalone API server (opsional, untuk menguji `/api/saipul` secara terpisah):**
```bash
npm run api:server
```
Server SaipulAI API berjalan di `http://localhost:3001/api/saipul`

### Build

**Production build:**
```bash
npm run build
```

**Preview production build:**
```bash
npm run preview
```

---

## 🔧 Fitur & Konfigurasi

### Environment Variables
Buat `.env` file di root (tidak di-commit ke Git) apabila mengaktifkan integrasi Supabase atau EmailJS:
```
VITE_SUPABASE_URL=<your-supabase-project-url>
VITE_SUPABASE_PUBLISHABLE_KEY=<your-supabase-publishable-key>
VITE_EMAIL_SERVICE_ID=<your-emailjs-id>
```

---

## 📊 API Publik Terbuka (Third-Party Access)

Satu-satunya endpoint REST API yang dibuka untuk integrasi pihak ketiga adalah **`/api/saipul`** (tanpa kredensial sensitif, dilindungi rate limit `30` req/menit/IP, batas payload `64 KB`, batas query `2500` karakter, serta filter PII):

| Endpoint | Metode | Kegunaan |
|---|---|---|
| `/api/saipul` | `GET` | Health check & metadata kapabilitas SaipulAI API |
| `/api/saipul?q=<pertanyaan>` | `GET` | Quick query (opsional `&stream=true` untuk SSE) |
| `/api/saipul` | `POST` | Chat, kalkulasi matematika, analitik statistik, & multi-turn context (`{ message, style, history, stream }`) |
| `/api/saipul` | `OPTIONS` | CORS preflight untuk integrasi Web SDK (`public/saipul-sdk.js`) |

> **Endpoint Lain Tertutup (`404` / `405`):** Route internal atau legacy seperti `/api/posts`, `/api/projects`, `/api/gallery`, `/api/auth/*`, maupun metode `PUT`/`DELETE` **tidak dibuka** untuk pihak ketiga. Pengelolaan data dinamis portofolio dilakukan secara internal melalui Supabase (dengan Row Level Security) dan bundel data frontend.

---

## 🎯 Fitur Spesial

### Help System
Tombol help di pojok layar yang memberikan akses ke:
- 📖 **Dokumentasi** - Panduan lengkap
- ❓ **FAQ** - Pertanyaan yang sering diajukan
- ℹ️ **Versi Website** - Informasi versi
- 🤝 **Komitmen** - Komitmen & nilai-nilai

### Error Handling
- Global error boundary dengan fallback UI
- Protected error page untuk user experience lebih baik
- Custom error messages

### Mini Websites
Konten khusus yang integrated ke dalam portfolio:
- **Zodiak** - Zodiac calculator
- **Qodam** - Additional tool/feature

---

## 📱 Responsiveness

Website fully responsive dengan breakpoints:
- **Mobile** - < 640px (Tailwind: sm)
- **Tablet** - 640px - 1024px (Tailwind: md, lg)
- **Desktop** - > 1024px (Tailwind: xl, 2xl)

---

## 🎨 Tema & Styling (100% Full Tailwind CSS)

Project ini telah sepenuhnya dimigrasi dan distandardisasi menggunakan **Tailwind CSS v4** murni:
- **Zero Legacy CSS Files**: Seluruh file CSS kustom terpisah (`App.css`, `discond-theme.css`, dll.) telah dihapus dan digantikan langsung oleh utility classes Tailwind.
- **Modern Vite Integration**: Menggunakan plugin resmi `@tailwindcss/vite` untuk build super cepat dan tree-shaking optimal.
- **Design Tokens `@theme`**: Pengaturan variabel warna tema (`--theme-bg`, `--theme-surface`, `--theme-accent`, dll.) didefinisikan secara deklaratif di `src/index.css`.
- **Komunitas / Discord Module**: Seluruh styling sidebar, chat bubble, input, dan navigasi status telah menggunakan utility classes Tailwind tanpa dependensi stylesheet eksternal.
- **Scrollbar & Responsive**: Styling scrollbar global dan layout responsif multi-device (`sm`, `md`, `lg`, `xl`) didukung penuh.

---

## 📚 Dependencies Utama

### Frontend
- `react` - UI library
- `react-router-dom` - Client-side routing
- `tailwindcss` - Utility-first CSS
- `framer-motion` - Animation library
- `react-icons` - Icon library
- `lucide-react` - Modern icons
- `react-markdown` - Markdown rendering
- `react-toastify` - Toast notifications
- `emailjs-com` - Email service

### Backend & Serverless
- `@supabase/supabase-js` - Klien database & autentikasi (dilindungi RLS)
- Node.js HTTP / Netlify Functions - Runtime untuk public API `/api/saipul` (`api/saipul.js`, `server/saipul-server.js`, `netlify/functions/saipul.js`)

---

## 🤝 Contributing

Untuk berkontribusi:
1. Fork repository
2. Buat branch feature (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

Baca panduan lengkap di [CONTRIBUTING.md](CONTRIBUTING.md), [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md), [SECURITY.md](SECURITY.md), dan [ACCESSIBILITY.md](ACCESSIBILITY.md).

---

## 📝 Lisensi

Kode sumber proyek ini dilisensikan di bawah [GNU AGPLv3](LICENSE.md). Konten, data pribadi, dan aset media memiliki pembatasan hak cipta tersendiri — lihat [COPYRIGHT.md](COPYRIGHT.md) untuk informasi lebih lanjut.

---

## 📞 Kontak

Hubungi melalui: `uju355@gmail.com`
 
---

## 🛠️ Quick Dev: Jalankan Frontend & SaipulAI API

Untuk development lokal:

```powershell
# Jalankan frontend + middleware /api/saipul sekaligus:
npm run dev

# (Opsional) Jalankan server SaipulAI API mandiri di port 3001:
npm run api:server
```

- **Form Kontak** - Di halaman `/admin/contact`
- **Email** - Gunakan form kontak atau EmailJS
- **Social Media** - Links tersedia di footer & halaman kontak

---

## 📊 Statistik Project

- **Total Pages:** 25+
- **Components:** 30+
- **Public API Endpoint:** 1 (`/api/saipul` — `GET`, `POST`, `OPTIONS`)
- **Features:** 15+
- **Responsive Breakpoints:** 6+

---

## ✅ Version History

Latest version: **v1.20.0** (2026-11-15 — pembaruan keamanan, lisensi, & dokumentasi hingga 2026-11-25)
- **Full Tailwind CSS v4 Migration**: Penghapusan total stylesheet lawas (`App.css`, `discond-theme.css`), eliminasi >180 baris CSS usang di `src/index.css`, dan refaktor penuh ke utility classes Tailwind CSS murni.
- **SaipulAI v8.0.0 Dual-Engine & CLI**: Penyelarasan mesin On-Device browser dengan Public REST API (`/api/saipul`), Web SDK (`public/saipul-sdk.js`), standalone server (`server/saipul-server.js`), Netlify Functions (`netlify/functions/saipul.js`), serta CLI (`bin/saipul-cli.js`) lengkap dengan NLU, *Math Engine* (`mathjs`), analitik statistik, multi-turn context, dan streaming SSE.
- **Hardening & Pembatasan API Publik**: Pembatasan allowlist ketat agar hanya `/api/saipul` (`GET`, `POST`, `OPTIONS`) yang terbuka untuk pihak ketiga (`404`/`405` untuk endpoint dan metode lain), disertai rate limiting (`30` req/menit/IP), batas payload `64 KB`, filter PII, dan header keamanan HTTP.
- **Sentralisasi Data & Modul Akademik**: Konsolidasi data JSON ke `src/data/` dan penataan modul akademik sarjana di `src/pages/akademik/sarjana/`.
- **Lisensi, Hak Cipta, & Standar Komunitas GitHub**: Penerapan [LICENSE.md](LICENSE.md) (`AGPL-3.0`) untuk kode sumber, [COPYRIGHT.md](COPYRIGHT.md) (*All Rights Reserved*) untuk konten/aset pribadi, serta [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md), [CONTRIBUTING.md](CONTRIBUTING.md), [SECURITY.md](SECURITY.md), [ACCESSIBILITY.md](ACCESSIBILITY.md), dan `.github/ISSUE_TEMPLATE/`.

Lihat [CHANGELOG.md](CHANGELOG.md) untuk riwayat lengkap rilis sebelumnya.

---

## 🙏 Credits

Terima kasih kepada seluruh pengembang dan kontributor pustaka open-source yang digunakan pada proyek ini (React, Vite, Tailwind CSS, Framer Motion, Three.js, Supabase, mathjs, Lucide, dan ekosistem pendukung lainnya). Penggunaan ulang kode sumber tunduk pada [LICENSE.md](LICENSE.md), sementara aset serta konten pribadi dilindungi oleh [COPYRIGHT.md](COPYRIGHT.md).

**Happy browsing! 🚀**

## 🛠 Teknologi yang Digunakan

- **Frontend**: React 19, JavaScript (ES6+), HTML5
- **Build Tool**: Vite 7 dengan `@tailwindcss/vite`
- **Styling**: Tailwind CSS v4 (100% Utility Classes, Zero Custom CSS Files)
- **Icons**: Lucide React & React Icons
- **Animation**: Framer Motion
- **Database & Real-time**: Supabase Client & Socket.IO
- **Tools**: Git, npm, ESLint
- **Deployment**: Netlify

## 🚀 Instalasi dan Menjalankan Lokal

Ikuti langkah-langkah berikut untuk menjalankan proyek ini di lingkungan lokal:

### Prasyarat
- Node.js (versi 14 atau lebih tinggi)
- npm atau yarn

### Langkah-langkah

1. **Clone repository**
   ```bash
   git clone https://github.com/saipul12c/my-portofolio.git
   cd portfolio-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   # atau
   yarn install
   ```

3. **Jalankan development server**
   ```bash
   npm run dev
   # atau
   yarn dev
   ```

4. **Buka browser**
   - Buka http://localhost:3000 (atau port yang ditentukan)
   - Website siap dilihat dan dikembangkan

### Build untuk Production

```bash
npm run build
# atau
yarn build
```

## 🎨 Customization

Untuk mengustomisasi website ini dengan informasi pribadi Anda:

1. **Ganti informasi personal** - Update data di file konfigurasi atau komponen
2. **Tambah proyek portfolio** - Modifikasi data proyek di file projects data
3. **Ubah warna dan tema** - Sesuaikan variabel CSS atau konfigurasi theme
4. **Update social links** - Ganti dengan profil media sosial Anda
5. **Modifikasi konten** - Sesuaikan teks, gambar, dan konten lainnya

## 📧 Kontak

Jika Anda memiliki pertanyaan atau ingin berkolaborasi, silakan hubungi saya melalui:

- **Email**: uju@gmail.com
- **LinkedIn**: [Your LinkedIn Profile](https://linkedin.com/in/saipul12c)
- **GitHub**: [Your GitHub Profile](https://github.com/saipul12c)

## 📄 Lisensi

Kode sumber proyek ini dilisensikan di bawah [GNU Affero General Public License v3.0 (AGPL-3.0)](LICENSE.md), sedangkan konten dan aset pribadi dilindungi ketentuan penggunaan terbatas di [COPYRIGHT.md](COPYRIGHT.md).

## 🙏 Acknowledgments

- Icons oleh [FontAwesome](https://fontawesome.com)
- Illustrations oleh [unDraw](https://undraw.co)
- Font oleh [Google Fonts](https://fonts.google.com)
- Inspiration dari [ berbagai design portfolio ]

---

⭐ Jangan lupa untuk memberikan bintang jika Anda menyukai proyek ini!