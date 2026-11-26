# Dokumentasi Lengkap Sistem Maintenance Terpusat (`my-porto`)

Dokumen ini menjelaskan cara kerja seluruh implementasi modul **Maintenance**, alur sinkronisasi database **Supabase**, sistem deteksi & notifikasi ke pengunjung, lapisan keamanan/penyembunyian panel admin, serta daftar lengkap seluruh **route** yang digunakan dan dikontrol.

---

## 1. Gambaran Umum & Alur Kerja Sistem

Sistem Maintenance pada proyek ini bekerja secara **terpusat**, **dinamis**, dan **terhubung langsung ke database Supabase** dengan dukungan pembaruan **Real-time**.

```text
[Admin Dashboard (/internal/ctrl-m9x/dashboard)]
        │  (Simpan perubahan via Supabase Auth + RLS ADMIN/SUPER_ADMIN)
        ▼
[Supabase: public.system_config & public.maintenance_logs]
        │
        ├─► Supabase Realtime (postgres_changes pada public.system_config)
        ├─► Fallback Fetch (saat load awal, tab aktif kembali, & polling 60 detik)
        └─► Cache Lokal (localStorage: saipul_site_maintenance_cache_v1)
        │
        ▼
[MaintenanceProvider (src/context/MaintenanceContext.jsx)]
        │
        ├──► [MaintenanceGuard] ──► Mengalihkan rute yg terkena maintenance ke Maintenance.jsx
        │                           (atau menampilkan toolbar Bypass Admin untuk ADMIN/SUPER_ADMIN)
        ├──► [MaintenanceNotification + useMaintenanceCheck] ──► Toast status halaman maintenance & recovery
        ├──► [Navbar, Footer, HelpMenu] ──► Badge "Maintenance" pada link terkait + Status Layanan
        ├──► [HelpButton] ──► Mengontrol status maintenance tombol bantuan (helpButtonMaintenance)
        ├──► [Live.jsx] ──► Sinkronisasi kunci chat room (system_config.maintenance_mode)
        └──► [knowledgeBase.js + smartKBQuery.js] ──► Memberi tahu status aktual ke asisten SaipulAI
```

---

## 2. Daftar File & Cara Kerja Tiap Modul

### A. Database & Konfigurasi Rute
1. **`database_supa/supabase-maintenance.sql`**
   - Menyiapkan tabel `public.system_config` beserta RLS:
     - **SELECT (Baca):** Terbuka untuk `anon` dan `authenticated` agar setiap pengunjung bisa memeriksa status maintenance.
     - **INSERT/UPDATE/DELETE (Tulis):** Hanya diizinkan bagi pengguna terautentikasi dengan role `ADMIN` atau `SUPER_ADMIN` (dicek melalui `public.users` maupun `auth.jwt() -> 'app_metadata' ->> 'role'`).
   - Mengisi seed awal key `'site_maintenance'` (mode global nonaktif, seluruh opsi tampilan default) dan `'maintenance_mode'` (`false`, khusus chat `Live-Discussion`).
   - Membuat tabel `public.maintenance_logs` sebagai *audit trail* perubahan status maintenance (admin, aksi, scope, detail JSON, waktu), juga dengan RLS khusus `ADMIN`/`SUPER_ADMIN`.
   - Menambahkan `public.system_config` ke publikasi `supabase_realtime` secara idempoten.

2. **`src/config/maintenanceRoutes.js`**
   - Menyimpan konstanta rute internal tersembunyi:
     - `MAINTENANCE_ADMIN_LOGIN_PATH = '/internal/ctrl-m9x/login'`
     - `MAINTENANCE_ADMIN_DASHBOARD_PATH = '/internal/ctrl-m9x/dashboard'`
   - Menyimpan `MAINTENANCE_BYPASS_PREFIXES` (rute yang tidak pernah ditutup oleh `MaintenanceGuard`).
   - Menyimpan `MAINTENANCE_PAGE_CATALOG` berisi 35 grup halaman beserta `defaultMaintenance` yang unik pada masing-masing halaman (`badge`, `title`, `description`, `footerNote`, `messages`).
   - Menyediakan fungsi `resolveRouteMaintenance(pathname, config)` yang mengembalikan `{ isUnderMaintenance, isBypassRoute, scope, matchedPage, pageNote, pageConfig }`.

### B. Service, Context & Guard
3. **`src/services/maintenanceService.js`**
   - `normalizeMaintenanceConfig(raw)`: Menormalisasi struktur config global, `pageOverrides`, `pageNotes`, `pageConfigs`, `customPaths`, dan fallback pesan dari `src/data/maintenance/maintenanceData.json`.
   - `fetchMaintenanceState()`: Mengambil key `'site_maintenance'` dan `'maintenance_mode'` dari `public.system_config` sekaligus menyimpan cadangan ke `localStorage` (`saipul_site_maintenance_cache_v1`).
   - `verifyMaintenanceAdminAccess()`: Memverifikasi token sesi ke server (`supabase.auth.getUser()`) lalu memastikan role di `public.users` adalah `ADMIN` atau `SUPER_ADMIN` serta status akun tidak `banned`/`nonaktif`.
   - `saveMaintenanceConfig()` & `saveLiveChatMaintenance()`: Memverifikasi akses admin, melakukan `upsert` ke `public.system_config`, memperbarui cache lokal, memicu event `saipul_maintenance_updated`, dan mencatat riwayat ke `public.maintenance_logs` (aman meski tabel log belum dibuat).
   - `fetchMaintenanceLogs(limit)`: Membaca histori perubahan dari `public.maintenance_logs`.

4. **`src/context/MaintenanceContext.jsx`**, **`maintenanceContextObject.js`**, **`useMaintenance.js`**
   - Memuat state awal dari cache lokal agar tidak ada jeda kosong, lalu mengambil state terbaru dari Supabase.
   - Berlangganan Supabase Realtime channel `'public:system_config:maintenance'` untuk key `site_maintenance` dan `maintenance_mode`.
   - Sinkronisasi tambahan: custom window event (tab sama), `storage` event (lintas tab), `visibilitychange` (saat tab dibuka kembali), dan fallback polling tiap 60 detik.
   - Setiap kali `config` atau `liveChatMaintenance` diperbarui, `MaintenanceContext` langsung menyinkronkan ringkasan status ke `setMaintenanceStatusData()` milik SaipulAI Knowledge Base.

5. **`src/components/MaintenanceGuard.jsx`**
   - Membungkus seluruh `<Routes>` di `src/App.jsx`.
   - Mengevaluasi `resolveRouteMaintenance(location.pathname, config)`.
   - Jika halaman sedang maintenance:
     - **Pengunjung biasa / non-admin** (atau admin yang mengaktifkan *Preview Pengunjung*): langsung ditampilkan komponen `<Maintenance />` penuh tanpa Navbar/Footer.
     - **Admin (`ADMIN` / `SUPER_ADMIN`)** saat `allowAdminBypass === true`: tetap dapat mengakses halaman normal disertai toolbar melayang di kiri bawah untuk melihat **Preview Pengunjung** atau membuka **Dashboard** internal.

### C. Halaman Tampilan Maintenance
6. **`src/pages/errors/Maintenance.jsx`**
   - Mendukung mode **Halaman Penuh** dan mode **Preview Dashboard** (`isPreview`).
   - **Prioritas Resolusi Informasi (Mode Per-Halaman):**
     1. Kustomisasi Admin pada `pageConfigs[key]` (badge, judul, deskripsi, footerNote, jadwal countdown, daftar pesan berputar).
     2. Legacy note pada `pageNotes[key]` (jika ada).
     3. Informasi unik bawaan halaman `matchedPage.defaultMaintenance`.
     4. Fallback ke konfigurasi global.
   - **Mode Global:** Menggunakan `title`, `description`, `footerNote`, `messages`, `startedAt`, dan `targetTime` global.
   - **Countdown & Progress Bar:** Menghitung persentase progres berdasarkan rentang `startedAt → targetTime`, mendukung format multi-hari (`Xh HH:MM:SS`), serta menangani kondisi tanpa target waktu atau saat target waktu telah tercapai.
   - **Tombol Dinamis:** Tombol **"Kembali ke Beranda"** hanya ditampilkan bila `/` sedang online (tidak tampil saat `/` ikut maintenance).
   - **Tanpa Link Admin Publik:** Tidak menyertakan tautan apa pun ke login/dashboard admin demi menyembunyikan panel kontrol dari pengunjung.

### D. Deteksi & Pemberitahuan Otomatis ke Pengguna
7. **`src/hooks/useMaintenanceCheck.js` & `src/components/MaintenanceNotification.jsx`**
   - Bekerja serupa dengan `useVersionCheck.js` dan `UpdateNotification.jsx`.
   - Memantau daftar halaman yang aktif maintenance (`activeMaintenancePages`), status Global, `liveChatMaintenance`, dan `helpButtonMaintenance`.
   - **Notifikasi Pintar (`top-right`):** Muncul otomatis saat pengunjung berada di halaman yang online namun ada halaman/layanan lain yang sedang maintenance. Tidak muncul saat pengunjung sudah berada di layar penuh `Maintenance.jsx` atau rute internal admin.
   - **Smart Dismiss (`sessionStorage`):** Menyimpan `statusSignature` (`saipul_maintenance_notice_dismissed_sig`). Jika admin mengubah daftar halaman maintenance di dashboard, signature berubah sehingga notifikasi kembali muncul.
   - **Deteksi Pemulihan:** Ketika halaman/sistem berubah dari Maintenance menjadi Online, menampilkan toast hijau **"Layanan Kembali Online"**.

8. **Integrasi Indikator UI & SaipulAI**
   - **`src/components/Navbar.jsx`:** Menampilkan badge `Maintenance` pada menu utama desktop, dropdown *Portfolio* (titik indikator + badge per sub-menu), *Blog*, *Contact*, dan drawer mobile.
   - **`src/components/Footer.jsx`:** Menampilkan badge `Maint.` pada link portofolio maupun personal yang sedang perawatan.
   - **`src/components/helpbutton/HelpMenu.jsx`:** Menandai item FAQ, Dokumentasi, Room Diskusi, dan Komitmen dengan label `MAINTENANCE` jika terkait, serta menampilkan `MaintenanceStatusBadge` di atas `VersionBadge`.
   - **`src/components/HelpButton.jsx`:** Flag `isMaintenance` dikontrol dinamis lewat `config.helpButtonMaintenance`.
   - **`src/pages/live/Live.jsx`:** Menyinkronkan `systemConfig.maintenance_mode` secara real-time dengan `liveChatMaintenance`.
   - **`src/utils/ai/knowledgeBase.js` & `src/components/helpbutton/chat/components/logic/utils/smartKBQuery.js`:** SaipulAI menerima state maintenance secara dinamis via `setMaintenanceStatusData()`, menandai kunci cache `QUERY_CACHE` dengan `maintStamp`, dan menjawab pertanyaan seputar status sistem/maintenance secara akurat sesuai kondisi live di database.

### E. Panel Admin Maintenance (Tersembunyi & Terproteksi)
9. **`src/pages/admin/maintenance/MaintenanceAdminLogin.jsx`**
   - Autentikasi Supabase (`signInWithPassword`) dengan verifikasi ketat role `ADMIN`/`SUPER_ADMIN`.
   - Dilengkapi **rate limiting brute-force** (`localStorage`: `saipul_m_gate_attempts` — 5 kali percobaan gagal akan mengunci akses selama 60 detik).
   - Memasang `<meta name="robots" content="noindex, nofollow" />`.

10. **`src/pages/admin/maintenance/MaintenanceAdminProtectedRoute.jsx`**
    - Memverifikasi ulang sesi langsung ke server Supabase sebelum merender dashboard. Jika tidak valid atau bukan `ADMIN`/`SUPER_ADMIN`, diarahkan ke `MAINTENANCE_ADMIN_LOGIN_PATH`.

11. **`src/pages/admin/maintenance/MaintenanceDashboard.jsx` & Sub-komponen**
    - **Tab Kontrol Global:** Saklar utama Maintenance Global, Admin Bypass, Maintenance `HelpButton`, dan Lockdown Chat `Live-Discussion` (`system_config.maintenance_mode`).
    - **Tab Per Halaman (`components/PagesControlTab.jsx` + `components/PageCustomizerModal.jsx`):** Pencarian, filter kategori/status, aksi massal (*Maintenance Hasil Filter*, *Online-kan Semua*), saklar per halaman, tambah/hapus rute kustom, dan modal **Kustomisasi Info & Jadwal** per halaman.
    - **Tab Tampilan & Pesan Global (`components/AppearanceTab.jsx`):** Pengaturan teks global, toggle progress bar/countdown/tombol beranda, preset durasi countdown (`+15m`, `+30m`, `+1j`, `+2j`, `+6j`), dan editor daftar pesan status berputar.
    - **Tab Live Preview:** Simulasi tampilan Desktop & Mobile untuk mode global maupun masing-masing halaman secara real-time.
    - **Tab Database & Riwayat (`components/LogsDatabaseTab.jsx`):** Memantau status koneksi Supabase/Realtime serta menampilkan daftar audit log dari `public.maintenance_logs`.

---

## 3. Daftar Lengkap Semua Route

### A. Route Panel Admin Maintenance (Tersembunyi)
Rute ini **tidak** tercantum di Navbar, Footer, HelpMenu, halaman Maintenance publik, maupun `sitemap.xml`, serta diblokir di `robots.txt` (`Disallow: /internal`) dan memakai `noindex, nofollow`.

| Route | Fungsi | Akses |
| :--- | :--- | :--- |
| `/internal/ctrl-m9x/login` | Halaman login khusus admin Maintenance | Publik (tersembunyi, rate-limited, hanya menerima `ADMIN` / `SUPER_ADMIN`) |
| `/internal/ctrl-m9x/dashboard` | Dashboard pusat kontrol Maintenance | Terproteksi `MaintenanceAdminProtectedRoute` + RLS Supabase |
| `/internal/ctrl-m9x` | Redirect otomatis ke `/internal/ctrl-m9x/dashboard` | Terproteksi melalui target dashboard |

> **Catatan keamanan:** Rute tebakan umum seperti `/maintenance-admin` atau `/admin/maintenance` sengaja **tidak didaftarkan**, sehingga otomatis jatuh ke halaman `404 NotFound`.

---

### B. Route Pengecualian (`MAINTENANCE_BYPASS_PREFIXES`)
Rute berikut **selalu dapat diakses** meskipun Mode Maintenance Global sedang aktif (matching berbasis segmen prefix di `src/config/maintenanceRoutes.js`):

- `/internal/ctrl-m9x` (dan seluruh sub-rutenya)
- `/blog-admin`, `/blog/admin`, `/blog/secret-login`
- `/Live-Discussion/login`, `/Live-Discussion/dashboard`
- `/launching`
- `/401`, `/403`, `/404`, `/408`, `/500`, `/502`, `/503`

> **Catatan khusus `/503`:** Route `/503` di `App.jsx` dibungkus `<ProtectedErrorPage component={Maintenance} />`. Pengunjung tidak dapat membuka `/503` secara langsung dari address bar (akan dialihkan ke `/404` kecuali `authorizedError` disetel oleh sistem).


---

### C. Daftar Lengkap 35 Grup Route Halaman yang Bisa Dikontrol Maintenance

Setiap grup di bawah ini dapat diaktifkan/dinonaktifkan serta dikustomisasi informasinya satu per satu melalui tab **Per Halaman** di Dashboard Maintenance:

#### 1. Kategori: Utama
| Key Config | Label | Route yang Dicocokkan (`matchPaths`) | Info Bawaan Unik (`badge`) |
| :--- | :--- | :--- | :--- |
| `/` | Beranda (Home) | `/` *(exact match hanya beranda)* | Pembaruan Beranda |
| `/about` | Tentang Saya (About) | `/about` | Pembaruan Profil |
| `/contact` | Kontak (Contact) | `/contact` | Peningkatan Layanan Pesan |
| `/owner` | Profil Owner | `/owner` | Sinkronisasi Data Owner |
| `/portal` | Portal Hub | `/portal` | Kalibrasi Portal Hub |
| `/visi` | Visi & Misi | `/visi` | Pembaruan Roadmap Visi |
| `/cv-saya` | CV Digital Interaktif | `/cv-saya` | Pembaruan Curriculum Vitae |

#### 2. Kategori: Portofolio
| Key Config | Label | Route yang Dicocokkan (`matchPaths`) | Info Bawaan Unik (`badge`) |
| :--- | :--- | :--- | :--- |
| `/projects` | Proyek & Detail Proyek | `/projects`, `/projects/:id`, `/project-detail/:id` | Update Katalog Proyek |
| `/certificates` | Sertifikat & Lisensi | `/certificates` | Verifikasi Sertifikat |
| `/softskills` | Soft Skills | `/SoftSkills`, `/softskills`, `/SoftSkills/:id`, `/softskills/:id` | Pemetaan Kompetensi |
| `/education` | Pendidikan | `/education` | Pembaruan Riwayat Akademik |
| `/bahasa` | Bahasa & Teknologi | `/bahasa`, `/bahasa/detail/:slug` | Update Stack Teknologi |
| `/hobbies` | Hobi & Minat | `/hobbies`, `/hobbies/:slug` | Penyegaran Minat & Hobi |

#### 3. Kategori: Galeri & Media
| Key Config | Label | Route yang Dicocokkan (`matchPaths`) | Info Bawaan Unik (`badge`) |
| :--- | :--- | :--- | :--- |
| `/photography` | Fotografi | `/photography` | Optimasi Media Fotografi |
| `/gallery` | Galeri Kenangan & Album | `/gallery`, `/gallery/shorts/:id`, `/gallery/images/:id`, `/gallery/videos/:id`, `/gallery/albums/:id` | Sinkronisasi Album & Video |

#### 4. Kategori: Blog & Testimoni
| Key Config | Label | Route yang Dicocokkan (`matchPaths`) | Info Bawaan Unik (`badge`) |
| :--- | :--- | :--- | :--- |
| `/blog` | Blog & Artikel | `/blog`, `/blog/:slug`, `/blog/authors/:slug` *(rute `/blog-admin` tetap bypass)* | Pemeliharaan Editorial Blog |
| `/testimoni` | Testimoni & Mitra | `/testimoni`, `/testimoni/:id`, `/testimoni/authors/:slug`, `/testimoni/perusahaan/:slug` | Kurasi Ulasan Mitra |

#### 5. Kategori: Akademik
| Key Config | Label | Route yang Dicocokkan (`matchPaths`) | Info Bawaan Unik (`badge`) |
| :--- | :--- | :--- | :--- |
| `/S1-PGMI` | Akademik S1 PGMI | `/S1-PGMI` | Pembaruan Arsip S1 PGMI |
| `/kkn` | Laporan KKN | `/kkn`, `/kkn-desa-kundan-haruyan-dayak` | Arsip KKN Desa Kundan |
| `/sempro-skripsi` | Seminar Proposal Skripsi | `/sempro-skripsi` | Dokumentasi Sempro |
| `/sidang-skripsi` | Sidang Skripsi | `/sidang-skripsi` | Dokumentasi Sidang |
| `/wisuda` | Wisuda | `/wisuda` | Galeri Kelulusan |

#### 6. Kategori: Komunitas & Live
| Key Config | Label | Route yang Dicocokkan (`matchPaths`) | Info Bawaan Unik (`badge`) |
| :--- | :--- | :--- | :--- |
| `/Live-Discussion` | Live Discussion (Halaman Penuh) | `/Live-Discussion`, `/Live-Discussion/daftar`, `/Live-Discussion/profile`, `/Live-Discussion/profile/:email` *(login & dashboard tetap bypass)* | Pemeliharaan Server Diskusi |
| `/streming` | Streaming Video | `/streming` | Pemeliharaan Server Streaming |
| `/discord` | Discord Community | `/discord`, `/discord/*` | Upgrade Server Komunitas |
| `/komunitas` | Direktori Komunitas | `/komunitas` | Sinkronisasi Direktori |

#### 7. Kategori: Bantuan & AI
| Key Config | Label | Route yang Dicocokkan (`matchPaths`) | Info Bawaan Unik (`badge`) |
| :--- | :--- | :--- | :--- |
| `/help` | Pusat Bantuan, Docs & AI | `/help/version`, `/help/version/:slug`, `/help/docs`, `/help/docs/ai`, `/help/docs/ai/:slug`, `/help/faq`, `/help/faq/riwayat/ai`, `/help/faq/riwayat/ai/:slug`, `/help/commitment`, `/help/commitment/:slug`, `/help/chatbot/settings/:tabId?` | Pembaruan Dokumentasi & AI |
| `/live-cs` | Panduan Keamanan & Privasi | `/live-cs/security`, `/live-cs/privacy`, `/privacy`, `/security`, `/help/panduan/keamanan`, `/help/panduan/privasi` | Audit Kebijakan & Keamanan |

#### 8. Kategori: Aplikasi & Hiburan
| Key Config | Label | Route yang Dicocokkan (`matchPaths`) | Info Bawaan Unik (`badge`) |
| :--- | :--- | :--- | :--- |
| `/apps` | Daftar Aplikasi (Apps Hub) | `/apps`, `/daftar-aplikasi`, `/daftar-app`, `/daftarlistApp` | Update Direktori Apps |
| `/qodam` | Cek Qodam | `/qodam` | Pembaruan Mini-App Hiburan |
| `/zodiak` | Zodiak & Astrologi | `/zodiak` | Kalibrasi Astrologi & Tarot |
| `/buat-kamu` | Buat Kamu | `/buat-kamu` | Sentuhan Spesial |
| `/year-end` | Sambutan Tahun Baru | `/year-end` | Pemeliharaan Halaman Musiman |
| `/coming-soon` | Coming Soon | `/coming-soon`, `/coming-soon/:slug` | Pembaruan Roadmap |

#### 9. Kategori: Akun
| Key Config | Label | Route yang Dicocokkan (`matchPaths`) | Info Bawaan Unik (`badge`) |
| :--- | :--- | :--- | :--- |
| `/auth-pages` | Login, Register & Profil Akun | `/login`, `/register`, `/profile` | Pemeliharaan Autentikasi Akun |

#### 10. Rute Kustom (`customPaths`) & Kontrol Fitur Tambahan
- **Rute Kustom:** Admin dapat menambahkan rute baru secara manual lewat form *Tambah Rute Kustom* di tab **Per Halaman** (misalnya `/promo-baru`) tanpa perlu mengubah kode.
- **Tombol Bantuan (`HelpButton`):** Dikontrol lewat opsi `helpButtonMaintenance` di tab **Kontrol Global**.
- **Lockdown Chat Live Discussion:** Dikontrol lewat opsi `maintenance_mode` di tab **Kontrol Global** (mengunci pengiriman pesan chat untuk user biasa sambil tetap memperbolehkan membaca chat, berbeda dengan penutupan halaman penuh `/Live-Discussion`).

---

## 4. Langkah Aktivasi & Penggunaan Awal

1. **Jalankan SQL di Supabase:**
   - Buka **Supabase Dashboard → SQL Editor → New Query**.
   - Salin dan jalankan seluruh isi file `database_supa/supabase-maintenance.sql`.
2. **Pastikan Akun Memiliki Role Admin:**
   - Akun login harus terdaftar di `public.users` dengan kolom `role = 'ADMIN'` atau `'SUPER_ADMIN'` (dapat diatur lewat `node update-role.js` atau query SQL).
3. **Buka Panel Admin Tersembunyi:**
   - Akses `/internal/ctrl-m9x/login` di browser.
   - Login menggunakan email & password akun Supabase Admin Anda.
4. **Kelola Maintenance:**
   - Gunakan **Kontrol Global** untuk menutup seluruh website sekaligus, atau tab **Per Halaman** untuk memilih halaman tertentu saja serta menyesuaikan pesan, jadwal countdown, dan badge-nya.
   - Setiap saklar otomatis tersimpan ke Supabase dan langsung terbaca oleh pengunjung aktif secara real-time.
