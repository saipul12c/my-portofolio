# 🌐 My Portfolio Website

**Selamat datang di repositori website portfolio pribadi!** Website ini menampilkan proyek-proyek, keterampilan, pengalaman profesional, galeri fotografi, blog, dan berbagai konten lainnya.

---

## 📋 Tentang Proyek

Website portfolio ini adalah platform lengkap yang dibangun dengan **React + Vite + Tailwind CSS** di frontend dan **Node.js + Express** di backend. Dirancang untuk memperkenalkan diri secara profesional sambil menampilkan karya-karya terbaik dan konten multimedia.

**Tech Stack:**
- **Frontend:** React 19, Vite 7, Tailwind CSS v4 (`@tailwindcss/vite`), React Router v7, Framer Motion
- **Backend & Data:** Supabase Client, Node.js, Express.js, Socket.IO
- **Styling Architecture:** 100% Pure Tailwind CSS v4 (Zero legacy custom CSS files)
- **Tools:** EmailJS, Lucide React, React Icons, React Window (virtualization)
- **Features:** Dark/Light Theme Tokens, SEO Optimization, Error Boundary, Full Responsive Design

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

### 🎨 **UI/UX Features**
- ✅ **Dark/Light Mode Toggle** - Switch tema gelap & terang
- ✅ **Responsive Design** - Optimal di semua ukuran device (mobile, tablet, desktop)
- ✅ **Smooth Scrolling Navigation** - Navigasi halus antar section
- ✅ **Loading Animations** - Animasi smooth saat konten dimuat
- ✅ **Hover Effects** - Efek interaktif yang menarik
- ✅ **Error Boundary** - Error handling yang elegant
- ✅ **Protected Error Page** - Halaman error yang aman & terstruktur

### 🚀 **Performance & Optimization**
- ✅ **React Window Virtualization** - Performa optimal untuk list panjang
- ✅ **Lazy Loading** - Loading komponen & gambar secara dinamis
- ✅ **SEO Optimization** - Meta tags, structured data, React Helmet
- ✅ **Code Splitting** - Bundle size optimization dengan Vite

### 💻 **Developer Features**
- ✅ **ESLint Configuration** - Code quality & consistency
- ✅ **Modular Architecture** - Folder structure yang terorganisir
- ✅ **Context API** - State management untuk error handling
- ✅ **API Integration** - Backend routes untuk blog posts, projects
- ✅ **Email Integration** - EmailJS untuk form kontak

### 📱 **Interaktif Elements**
- ✅ **Help Button** - Bantuan & dokumentasi in-app
- ✅ **Typing Animation** - Efek typing text dinamis
- ✅ **Modal Popups** - Detail view dengan modal interaktif
- ✅ **Form Validation** - Validasi input form
- ✅ **Search & Filter** - Fitur pencarian & filtering konten
- ✅ **Toast Notifications** - Notifikasi user feedback

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
├── backend/                          # Backend (Node.js + Express)
│   ├── server.js                    # Express server setup
│   ├── routes/
│   │   ├── api.js                   # API routes
│   │   ├── postsRoutes.js           # Blog posts API
│   │   ├── dataRoutes.js            # Data API
│   │   ├── galleryData.js           # Gallery API
│   │   ├── projects.js              # Projects API
│   │   └── ...
│   ├── controllers/
│   │   ├── postsController.js       # Blog posts controller
│   │   ├── dataController.js        # Data controller
│   │   └── ...
│   ├── models/
│   │   └── ...
│   ├── middlewares/
│   │   ├── validatePost.js
│   │   └── ...
│   ├── utils/
│   │   ├── errorHandler.js
│   │   ├── customErrors.js
│   │   ├── controllerFactory.js
│   │   └── fileHandler.js
│   ├── data/                        # Data storage
│   │   ├── projects.json
│   │   ├── galleryData.json
│   │   └── ...
│   └── package.json
├── public/                           # Static files
│   ├── index.html
│   ├── css/
│   ├── JS/
│   └── ...
├── package.json                      # Frontend dependencies
├── vite.config.js                   # Vite configuration
└── README.md                        # This file
```

---

## 🚀 Cara Menjalankan

### Prerequisites
- Node.js v18+ 
- npm atau yarn

### Installation

**1. Clone repository:**
```bash
git clone <repository-url>
cd my-porto
```

**2. Install frontend dependencies:**
```bash
npm install
```

**3. Install backend dependencies:**
```bash
cd backend
npm install
cd ..
```

### Development

**1. Jalankan Vite dev server (frontend):**
```bash
npm run dev
```
Website akan terbuka di `http://localhost:5173`

**2. Jalankan backend server (di terminal lain):**
```bash
cd backend
npm start
# atau: node server.js
```
Backend berjalan di `http://localhost:3000`

### Using the local JSON Backend (recommended for development)

This project includes a small JSON-based backend server in `backend/` that exposes REST endpoints and Socket.IO for chat. To make the frontend use this local backend instead of a remote backend, enable the backend proxy in the environment.

1. Ensure the backend is running:

```powershell
cd backend; npm install; npm start
```

2. In project root, set the environment flag (this repository already sets it in `.env`):

```bash
VITE_USE_BACKEND_PROXY=true
```

3. Start the frontend dev server (in a separate terminal):

```powershell
npm run dev
```

When `VITE_USE_BACKEND_PROXY=true`, the frontend will call the local endpoints under `/api/*` (for example `/api/communities`, `/api/messages`, `/api/auth/*`) and receive data from the JSON files in `backend/data/`.

If you'd rather use a remote backend instead of the local JSON server, set `VITE_USE_BACKEND_PROXY=false` in `.env` and provide your remote API configuration.

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
Buat `.env` file di root jika perlu konfigurasi API:
```
VITE_API_URL=http://localhost:3000/api
VITE_EMAIL_SERVICE_ID=<your-emailjs-id>
```

### Backend Configuration
Edit `backend/server.js` untuk konfigurasi:
- PORT default: 3000
- CORS settings
- Static files directory

---

## 📊 API Routes

### Blog Posts
- `GET /api/posts` - Ambil semua posts
- `GET /api/posts/:id` - Ambil post detail
- `POST /api/posts` - Create post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post

### Projects
- `GET /api/projects` - Ambil semua proyek
- `GET /api/projects/:id` - Ambil detail proyek

### Gallery
- `GET /api/gallery` - Ambil data galeri
- `GET /api/gallery/:category` - Ambil galeri per kategori

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

### Backend
- `express` - Web framework
- `cors` - Cross-origin resource sharing
- `body-parser` - Request parsing

---

## 🤝 Contributing

Untuk berkontribusi:
1. Fork repository
2. Buat branch feature (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

---

## 📝 Lisensi

Project ini dapat digunakan sesuai kebutuhan. Hubungi untuk informasi lisensi lebih lanjut.

---

## 📞 Kontak

Hubungi melalui:
 
---

## 🛠️ Quick Dev: Jalankan Frontend + Backend

Untuk development jalankan frontend (Vite) dan backend (Express) di dua terminal terpisah. Backend di project ini secara default berjalan di port `8080`.

```powershell
# Terminal A: backend
cd backend
npm install
copy .env.example .env
npm run dev

# Terminal B: frontend (project root)
cd ..
npm install
npm run dev
```

Vite sudah dikonfigurasi untuk mem-proxy request `/api`, `/socket.io`, dan `/avatar` ke `http://localhost:8080` (lihat `vite.config.js`), sehingga `fetch('/api/...')` di frontend akan diarahkan ke backend tanpa perubahan tambahan.

- **Form Kontak** - Di halaman `/admin/contact`
- **Email** - Gunakan form kontak atau EmailJS
- **Social Media** - Links tersedia di footer & halaman kontak

---

## 📊 Statistik Project

- **Total Pages:** 20+
- **Components:** 30+
- **API Routes:** 15+
- **Features:** 15+
- **Responsive Breakpoints:** 6+

---

## ✅ Version History

Latest version: **v1.20.0** (2026-11-15)
- **Full Tailwind CSS Migration**: Penghapusan total file CSS lawas (`App.css`, `discond-theme.css`) dan refaktor seluruh modul ke utility classes Tailwind CSS murni.
- **Index.css Streamlined**: Eliminasi lebih dari 180 baris CSS usang/mati untuk efisiensi bundle size maksimal.
- **Modern Tech Architecture**: Pembaruan dependensi Vite + Tailwind v4 dan penyempurnaan integrasi real-time.

Lihat `CHANGELOG.md` untuk history lengkap seluruh perubahan.

---

## 🙏 Credits

Terima kasih kepada semua open-source libraries dan tools yang digunakan dalam project ini.

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

Proyek ini dilisensikan di bawah [MIT License](LICENSE).

## 🙏 Acknowledgments

- Icons oleh [FontAwesome](https://fontawesome.com)
- Illustrations oleh [unDraw](https://undraw.co)
- Font oleh [Google Fonts](https://fonts.google.com)
- Inspiration dari [ berbagai design portfolio ]

---

⭐ Jangan lupa untuk memberikan bintang jika Anda menyukai proyek ini!