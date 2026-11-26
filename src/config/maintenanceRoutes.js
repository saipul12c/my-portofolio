/**
 * Katalog terpusat seluruh halaman & rute website untuk kontrol Maintenance
 * (Global maupun selektif per-halaman) serta daftar rute yang dikecualikan.
 * Setiap halaman memiliki informasi maintenance bawaan yang beragam dan dapat
 * dikustomisasi sepenuhnya melalui Dashboard Maintenance.
 */

export const MAINTENANCE_ADMIN_LOGIN_PATH = '/internal/ctrl-m9x/login';
export const MAINTENANCE_ADMIN_DASHBOARD_PATH = '/internal/ctrl-m9x/dashboard';

export const MAINTENANCE_BYPASS_PREFIXES = [
  '/internal/ctrl-m9x',
  '/blog-admin',
  '/blog/admin',
  '/blog/secret-login',
  '/Live-Discussion/login',
  '/Live-Discussion/dashboard',
  '/launching',
  '/401',
  '/403',
  '/404',
  '/408',
  '/500',
  '/502',
  '/503',
];

export const MAINTENANCE_PAGE_CATALOG = [
  // Utama
  {
    key: '/',
    label: 'Beranda (Home)',
    category: 'Utama',
    description: 'Halaman utama portofolio dan ringkasan seluruh karya.',
    matchPaths: ['/'],
    exactOnly: true,
    defaultMaintenance: {
      badge: 'Pembaruan Beranda',
      title: 'Halaman Utama Sedang Diperbarui',
      description:
        'Kami sedang menyegarkan tampilan beranda, statistik portofolio, dan sorotan karya terbaru agar pengalaman kunjungan lebih cepat dan nyaman.',
      footerNote: 'Tampilan utama segera kembali dengan pembaruan visual terbaru ✨',
      messages: [
        'Menyinkronkan sorotan proyek dan statistik portofolio...',
        'Mengoptimalkan animasi serta waktu muat halaman utama...',
        'Menyiapkan tampilan beranda yang lebih responsif...',
      ],
    },
  },
  {
    key: '/about',
    label: 'Tentang Saya (About)',
    category: 'Utama',
    description: 'Profil singkat, kolaborasi, ketertarikan, dan ringkasan kemampuan.',
    matchPaths: ['/about'],
    defaultMaintenance: {
      badge: 'Pembaruan Profil',
      title: 'Halaman Tentang Saya Sedang Diperbarui',
      description:
        'Kami sedang memperbarui informasi profil, daftar mitra kolaborasi, serta pencapaian terbaru di halaman Tentang Saya.',
      footerNote: 'Terima kasih telah mengunjungi profil kami 🙏',
      messages: [
        'Memperbarui ringkasan biografi dan pengalaman...',
        'Menyinkronkan data kolaborasi dan keahlian terbaru...',
        'Merapikan tata letak profil profesional...',
      ],
    },
  },
  {
    key: '/contact',
    label: 'Kontak (Contact)',
    category: 'Utama',
    description: 'Formulir kontak, email, dan tautan media sosial.',
    matchPaths: ['/contact'],
    defaultMaintenance: {
      badge: 'Peningkatan Layanan Pesan',
      title: 'Formulir & Halaman Kontak Dalam Perawatan',
      description:
        'Sistem pengiriman pesan, validasi anti-spam, dan integrasi email sedang ditingkatkan agar setiap pesan Anda masuk lebih cepat dan aman.',
      footerNote: 'Untuk keperluan mendesak, silakan gunakan email kontak yang tersedia 📩',
      messages: [
        'Memeriksa koneksi gateway email dan reCAPTCHA...',
        'Mengoptimalkan validasi formulir pesan pengunjung...',
        'Menyiapkan kanal komunikasi yang lebih andal...',
      ],
    },
  },
  {
    key: '/owner',
    label: 'Profil Owner',
    category: 'Utama',
    description: 'Halaman profil lengkap pemilik portofolio (/owner).',
    matchPaths: ['/owner'],
    defaultMaintenance: {
      badge: 'Sinkronisasi Data Owner',
      title: 'Halaman Profil Owner Sedang Dalam Perawatan',
      description:
        'Profil lengkap pemilik portofolio beserta ringkasan ekosistem akademik dan karya sedang disinkronkan ulang.',
      footerNote: 'Data profil owner segera aktif kembali dalam beberapa saat ⚡',
      messages: [
        'Menarik metrik terbaru dari blog, sertifikat, dan proyek...',
        'Memperbarui struktur informasi ekosistem owner...',
        'Memastikan akurasi seluruh tautan portofolio...',
      ],
    },
  },
  {
    key: '/portal',
    label: 'Portal Hub',
    category: 'Utama',
    description: 'Hub tautan cepat, statistik, dan preview ekosistem (/portal).',
    matchPaths: ['/portal'],
    defaultMaintenance: {
      badge: 'Kalibrasi Portal Hub',
      title: 'Portal Hub Sedang Dalam Pemeliharaan',
      description:
        'Tautan cepat platform, grafik statistik interaktif, dan modul preview di Portal Hub sedang kami kalibrasi.',
      footerNote: 'Portal akan segera hadir dengan navigasi yang lebih ringkas 🧭',
      messages: [
        'Memperbarui tautan dan kartu platform eksternal...',
        'Mengoptimalkan tampilan portal untuk desktop dan mobile...',
        'Menyegarkan pratinjau aktivitas terbaru...',
      ],
    },
  },
  {
    key: '/visi',
    label: 'Visi & Misi',
    category: 'Utama',
    description: 'Halaman visi, misi, dan arah pengembangan (/visi).',
    matchPaths: ['/visi'],
    defaultMaintenance: {
      badge: 'Pembaruan Roadmap Visi',
      title: 'Halaman Visi & Misi Sedang Diperbarui',
      description:
        'Kami sedang menata ulang peta jalan tujuan jangka panjang, nilai inti, serta rencana pengembangan karya ke depan.',
      footerNote: 'Visi baru sedang dirangkum dengan lebih jelas 🎯',
      messages: [
        'Menyusun pembaruan sasaran dan misi pengembangan...',
        'Menyelaraskan ilustrasi dan narasi halaman visi...',
        'Hampir selesai menata poin-poin strategis...',
      ],
    },
  },
  {
    key: '/cv-saya',
    label: 'CV Digital Interaktif',
    category: 'Utama',
    description: 'Curriculum vitae interaktif (/cv-saya).',
    matchPaths: ['/cv-saya'],
    defaultMaintenance: {
      badge: 'Pembaruan Curriculum Vitae',
      title: 'CV Digital Sedang Dalam Pembaruan',
      description:
        'Riwayat pengalaman kerja, keahlian teknis, sertifikasi, dan format cetak CV digital sedang diperbarui agar selalu mutakhir.',
      footerNote: 'Versi terbaru CV Digital segera tersedia kembali 📄',
      messages: [
        'Memperbarui riwayat proyek unggulan dan pengalaman...',
        'Menyesuaikan tata letak ringkasan profesional...',
        'Memvalidasi detail kontak dan sertifikasi pada CV...',
      ],
    },
  },

  // Portofolio
  {
    key: '/projects',
    label: 'Proyek & Detail Proyek',
    category: 'Portofolio',
    description: 'Katalog proyek (/projects) beserta halaman detail (/project-detail/:id).',
    matchPaths: ['/projects', '/project-detail'],
    defaultMaintenance: {
      badge: 'Update Katalog Proyek',
      title: 'Showcase Proyek Sedang Dalam Perawatan',
      description:
        'Kami sedang menambahkan proyek terbaru, memperbarui tautan demo langsung, serta menyempurnakan detail arsitektur aplikasi.',
      footerNote: 'Proyek-proyek terbaru akan segera siap dijelajahi 🚀',
      messages: [
        'Mengunggah detail dan screenshot proyek terbaru...',
        'Memeriksa tautan demo langsung dan repositori GitHub...',
        'Menyinkronkan filter kategori teknologi dan pencarian AI...',
      ],
    },
  },
  {
    key: '/certificates',
    label: 'Sertifikat & Lisensi',
    category: 'Portofolio',
    description: 'Daftar sertifikat dan pencapaian (/certificates).',
    matchPaths: ['/certificates'],
    defaultMaintenance: {
      badge: 'Verifikasi Sertifikat',
      title: 'Halaman Sertifikat Sedang Diperbarui',
      description:
        'Arsip sertifikat, kredensial pelatihan, dan tautan verifikasi resmi sedang ditata ulang dan diverifikasi.',
      footerNote: 'Seluruh arsip lisensi & sertifikat segera kembali normal 🏆',
      messages: [
        'Memverifikasi nomor kredensial dan penerbit sertifikat...',
        'Mengoptimalkan pratinjau gambar sertifikat resolusi tinggi...',
        'Menyusun kategori pencapaian terbaru...',
      ],
    },
  },
  {
    key: '/softskills',
    label: 'Soft Skills',
    category: 'Portofolio',
    description: 'Halaman kompetensi soft skills (/SoftSkills & /softskills).',
    matchPaths: ['/softskills'],
    defaultMaintenance: {
      badge: 'Pemetaan Kompetensi',
      title: 'Halaman Soft Skills Sedang Dalam Perawatan',
      description:
        'Daftar kompetensi interpersonal, studi kasus kepemimpinan, dan pencarian cerdas Soft Skills sedang kami perbarui.',
      footerNote: 'Detail kompetensi interpersonal segera aktif kembali 🧠',
      messages: [
        'Memperbarui matriks kompetensi dan deskripsi keahlian...',
        'Menyinkronkan rekomendasi AI pada daftar soft skills...',
        'Merapikan visualisasi kartu keahlian...',
      ],
    },
  },
  {
    key: '/education',
    label: 'Pendidikan',
    category: 'Portofolio',
    description: 'Riwayat pendidikan formal dan non-formal (/education).',
    matchPaths: ['/education'],
    defaultMaintenance: {
      badge: 'Pembaruan Riwayat Akademik',
      title: 'Halaman Pendidikan Sedang Diperbarui',
      description:
        'Data linimasa pendidikan formal, prestasi akademik, serta dokumentasi kegiatan kampus sedang diperbarui.',
      footerNote: 'Catatan perjalanan pendidikan segera kembali lengkap 🎓',
      messages: [
        'Memperbarui linimasa jenjang pendidikan...',
        'Menyinkronkan tautan dokumentasi akademik terkait...',
        'Memeriksa detail institusi dan periode studi...',
      ],
    },
  },
  {
    key: '/bahasa',
    label: 'Bahasa & Teknologi',
    category: 'Portofolio',
    description: 'Daftar bahasa pemrograman/bahasa dan detailnya (/bahasa).',
    matchPaths: ['/bahasa'],
    defaultMaintenance: {
      badge: 'Update Stack Teknologi',
      title: 'Halaman Bahasa & Teknologi Dalam Perawatan',
      description:
        'Katalog bahasa pemrograman, framework, tingkat penguasaan, dan keterkaitan proyeknya sedang diperbarui.',
      footerNote: 'Daftar tech stack terbaru akan segera tampil kembali 💻',
      messages: [
        'Memperbarui daftar framework dan bahasa pemrograman...',
        'Menghubungkan relasi teknologi dengan artikel & proyek...',
        'Mengoptimalkan filter pencarian skill...',
      ],
    },
  },
  {
    key: '/hobbies',
    label: 'Hobi & Minat',
    category: 'Portofolio',
    description: 'Daftar hobi dan halaman detail hobi (/hobbies).',
    matchPaths: ['/hobbies'],
    defaultMaintenance: {
      badge: 'Penyegaran Minat & Hobi',
      title: 'Halaman Hobi & Minat Sedang Dalam Perawatan',
      description:
        'Dokumentasi hobi kreatif, perlengkapan favorit, dan cerita di balik aktivitas personal sedang kami perbarui.',
      footerNote: 'Cerita dan koleksi hobi terbaru segera kembali 🎨',
      messages: [
        'Memperbarui galeri aktivitas dan detail hobi...',
        'Menyelaraskan statistik minat dan peralatan...',
        'Menyusun tata letak halaman detail hobi...',
      ],
    },
  },

  // Galeri & Media
  {
    key: '/photography',
    label: 'Fotografi',
    category: 'Galeri & Media',
    description: 'Showcase foto dan galeri fotografi (/photography).',
    matchPaths: ['/photography'],
    defaultMaintenance: {
      badge: 'Optimasi Media Fotografi',
      title: 'Galeri Fotografi Sedang Dalam Perawatan',
      description:
        'Kami sedang mengoptimalkan gambar resolusi tinggi, metadata EXIF/lokasi, dan filter kategori agar galeri fotografi tampil lebih tajam dan cepat.',
      footerNote: 'Lensa digital sedang dibersihkan sejenak 📸',
      messages: [
        'Mengompresi dan menyinkronkan foto ke format WebP...',
        'Memperbarui informasi lokasi dan kategori pemotretan...',
        'Menyiapkan lightbox resolusi tinggi untuk pengunjung...',
      ],
    },
  },
  {
    key: '/gallery',
    label: 'Galeri Kenangan & Album',
    category: 'Galeri & Media',
    description: 'Galeri utama beserta detail shorts, foto, video, dan album (/gallery/*).',
    matchPaths: ['/gallery'],
    defaultMaintenance: {
      badge: 'Sinkronisasi Album & Video',
      title: 'Galeri Kenangan & Album Sedang Diperbarui',
      description:
        'Koleksi foto, video dokumentasi, shorts, serta album kenangan sedang dalam proses penataan ulang dan optimasi pemutar media.',
      footerNote: 'Momen-momen terbaik segera dapat diputar kembali 🖼️',
      messages: [
        'Menyinkronkan indeks album, foto, dan video shorts...',
        'Menguji kelancaran pemutar media universal...',
        'Merapikan tagar dan rekomendasi konten terkait...',
      ],
    },
  },

  // Blog & Testimoni
  {
    key: '/blog',
    label: 'Blog & Artikel',
    category: 'Blog & Testimoni',
    description: 'Halaman blog, detail artikel, dan profil penulis (/blog/*).',
    matchPaths: ['/blog'],
    defaultMaintenance: {
      badge: 'Pemeliharaan Editorial Blog',
      title: 'Blog & Artikel Sedang Dalam Perawatan',
      description:
        'Sistem publikasi artikel, kolom komentar, rating pembaca, dan sinkronisasi database blog sedang kami perbarui.',
      footerNote: 'Artikel terbaru siap dibaca kembali sebentar lagi ✍️',
      messages: [
        'Menyinkronkan artikel dan metadata SEO dari Supabase...',
        'Memeriksa sistem komentar, bookmark, dan rating artikel...',
        'Mengoptimalkan ringkasan AI Overview untuk pencarian blog...',
      ],
    },
  },
  {
    key: '/testimoni',
    label: 'Testimoni & Mitra',
    category: 'Blog & Testimoni',
    description: 'Halaman testimoni, detail pengguna, dan perusahaan (/testimoni/*).',
    matchPaths: ['/testimoni'],
    defaultMaintenance: {
      badge: 'Kurasi Ulasan Mitra',
      title: 'Halaman Testimoni Sedang Dalam Perawatan',
      description:
        'Ulasan klien, profil pengguna, dan studi kasus dampak bisnis perusahaan mitra sedang dalam pembaruan.',
      footerNote: 'Kepercayaan dan testimoni mitra segera kembali tampil ⭐',
      messages: [
        'Memverifikasi data ulasan dan profil mitra...',
        'Memperbarui metrik dampak proyek perusahaan...',
        'Merapikan tampilan filter testimoni...',
      ],
    },
  },

  // Akademik
  {
    key: '/S1-PGMI',
    label: 'Akademik S1 PGMI',
    category: 'Akademik',
    description: 'Portal akademik S1 PGMI (/S1-PGMI).',
    matchPaths: ['/s1-pgmi'],
    defaultMaintenance: {
      badge: 'Pembaruan Arsip S1 PGMI',
      title: 'Portal Akademik S1 PGMI Dalam Perawatan',
      description:
        'Dokumentasi perjalanan perkuliahan S1 Pendidikan Guru Madrasah Ibtidaiyah sedang disusun ulang agar lebih informatif.',
      footerNote: 'Arsip perkuliahan S1 PGMI segera hadir kembali 📚',
      messages: [
        'Merapikan dokumen dan catatan mata kuliah...',
        'Menghubungkan tautan KKN, Sempro, Sidang, dan Wisuda...',
        'Menyegarkan tampilan portal akademik...',
      ],
    },
  },
  {
    key: '/kkn',
    label: 'Laporan KKN',
    category: 'Akademik',
    description: 'Dokumentasi KKN Desa Kundan (/kkn & /kkn-desa-kundan-haruyan-dayak).',
    matchPaths: ['/kkn', '/kkn-desa-kundan-haruyan-dayak'],
    defaultMaintenance: {
      badge: 'Arsip KKN Desa Kundan',
      title: 'Dokumentasi KKN Sedang Dalam Perawatan',
      description:
        'Laporan program kerja, galeri kegiatan lapangan, dan testimoni masyarakat KKN Desa Kundan sedang diperbarui.',
      footerNote: 'Jejak pengabdian Desa Kundan segera dapat diakses kembali 🏕️',
      messages: [
        'Mengoptimalkan galeri foto dan linimasa kegiatan KKN...',
        'Memperbarui daftar luaran program dan anggota tim...',
        'Menyiapkan modal detail dokumentasi lapangan...',
      ],
    },
  },
  {
    key: '/sempro-skripsi',
    label: 'Seminar Proposal Skripsi',
    category: 'Akademik',
    description: 'Dokumentasi Sempro Skripsi (/sempro-skripsi).',
    matchPaths: ['/sempro-skripsi'],
    defaultMaintenance: {
      badge: 'Dokumentasi Sempro',
      title: 'Halaman Seminar Proposal Dalam Perawatan',
      description:
        'Arsip dokumentasi, ringkasan proposal penelitian, dan catatan seminar proposal sedang diperbarui.',
      footerNote: 'Dokumentasi Sempro segera kembali tersedia 📝',
      messages: [
        'Memperbarui ringkasan latar belakang dan metode penelitian...',
        'Mengoptimalkan media dokumentasi seminar proposal...',
        'Memastikan kelengkapan informasi akademik...',
      ],
    },
  },
  {
    key: '/sidang-skripsi',
    label: 'Sidang Skripsi',
    category: 'Akademik',
    description: 'Dokumentasi Sidang Skripsi (/sidang-skripsi).',
    matchPaths: ['/sidang-skripsi'],
    defaultMaintenance: {
      badge: 'Dokumentasi Sidang',
      title: 'Halaman Sidang Skripsi Dalam Perawatan',
      description:
        'Catatan sidang munaqasyah, dokumentasi presentasi hasil penelitian, dan arsip skripsi sedang diperbarui.',
      footerNote: 'Dokumentasi Sidang Skripsi segera kembali normal 🎓',
      messages: [
        'Menyinkronkan galeri dan catatan sidang skripsi...',
        'Memperbarui informasi hasil penelitian dan penguji...',
        'Merapikan tampilan halaman dokumentasi...',
      ],
    },
  },
  {
    key: '/wisuda',
    label: 'Wisuda',
    category: 'Akademik',
    description: 'Dokumentasi momen Wisuda (/wisuda).',
    matchPaths: ['/wisuda'],
    defaultMaintenance: {
      badge: 'Galeri Kelulusan',
      title: 'Halaman Dokumentasi Wisuda Dalam Perawatan',
      description:
        'Momen bersejarah wisuda, foto kelulusan, dan pesan syukur sedang ditata ulang dengan kualitas tampilan lebih baik.',
      footerNote: 'Kenangan momen wisuda segera kembali tampil 🎓✨',
      messages: [
        'Mengoptimalkan foto-foto dokumentasi wisuda...',
        'Memperbarui detail acara dan catatan kelulusan...',
        'Menyempurnakan animasi galeri wisuda...',
      ],
    },
  },

  // Komunitas & Live
  {
    key: '/Live-Discussion',
    label: 'Live Discussion (Halaman Penuh)',
    category: 'Komunitas & Live',
    description: 'Menutup seluruh halaman /Live-Discussion, daftar, dan profil pengguna.',
    matchPaths: ['/live-discussion'],
    defaultMaintenance: {
      badge: 'Pemeliharaan Server Diskusi',
      title: 'Live Discussion Sedang Dalam Pemeliharaan',
      description:
        'Ruang diskusi real-time, sistem moderasi, polling, dan sinkronisasi pesan Supabase sedang menjalani pemeliharaan rutin.',
      footerNote: 'Ruang obrolan akan segera dibuka kembali untuk seluruh anggota 💬',
      messages: [
        'Memeriksa saluran Supabase Realtime dan status koneksi...',
        'Membersihkan cache pesan serta mengoptimalkan performa chat...',
        'Memastikan sistem keamanan dan anti-spam berjalan prima...',
      ],
    },
  },
  {
    key: '/streming',
    label: 'Streaming Video',
    category: 'Komunitas & Live',
    description: 'Platform streaming video (/streming).',
    matchPaths: ['/streming'],
    defaultMaintenance: {
      badge: 'Pemeliharaan Server Streaming',
      title: 'Layanan Streaming Video Dalam Perawatan',
      description:
        'Pemutar video, daftar putar shorts, komentar video, dan rekomendasi konten sedang kami tingkatkan performanya.',
      footerNote: 'Siaran dan koleksi video segera kembali lancar 🎬',
      messages: [
        'Mengoptimalkan pemutar video dan selector kualitas...',
        'Menyinkronkan daftar video serta komentar dari database...',
        'Menguji kestabilan buffering media...',
      ],
    },
  },
  {
    key: '/discord',
    label: 'Discord Community',
    category: 'Komunitas & Live',
    description: 'Halaman komunitas gaya Discord (/discord/*).',
    matchPaths: ['/discord'],
    defaultMaintenance: {
      badge: 'Upgrade Server Komunitas',
      title: 'Area Komunitas Discord Dalam Perawatan',
      description:
        'Channel diskusi, thread percakapan, dan fitur moderasi otomatis sedang menjalani pemeliharaan teknis.',
      footerNote: 'Seluruh channel akan segera kembali online ⚡',
      messages: [
        'Memeriksa sinkronisasi channel dan daftar anggota...',
        'Mengoptimalkan fitur polling dan thread balasan...',
        'Menyegarkan antarmuka ruang komunitas...',
      ],
    },
  },
  {
    key: '/komunitas',
    label: 'Direktori Komunitas',
    category: 'Komunitas & Live',
    description: 'Halaman direktori komunitas (/komunitas).',
    matchPaths: ['/komunitas'],
    defaultMaintenance: {
      badge: 'Sinkronisasi Direktori',
      title: 'Direktori Komunitas Sedang Dalam Perawatan',
      description:
        'Daftar komunitas developer & kreator beserta statistik keanggotaan sedang kami perbarui dan sinkronkan.',
      footerNote: 'Direktori komunitas segera kembali dapat diakses 🤝',
      messages: [
        'Memperbarui data komunitas dari database...',
        'Memeriksa filter kategori dan statistik anggota...',
        'Menyiapkan formulir pengajuan komunitas baru...',
      ],
    },
  },

  // Bantuan & AI
  {
    key: '/help',
    label: 'Pusat Bantuan, Docs & AI',
    category: 'Bantuan & AI',
    description: 'Versi web, Docs, AI Docs, FAQ, Komitmen, Chatbot Settings (/help/*).',
    matchPaths: ['/help'],
    defaultMaintenance: {
      badge: 'Pembaruan Dokumentasi & AI',
      title: 'Pusat Bantuan & Dokumentasi SaipulAI Dalam Perawatan',
      description:
        'Halaman dokumentasi teknis, riwayat versi, FAQ, dan pengaturan asisten cerdas SaipulAI sedang dalam tahap penyempurnaan.',
      footerNote: 'Dokumentasi dan panduan SaipulAI segera kembali lengkap 🤖',
      messages: [
        'Memperbarui basis pengetahuan dan dokumentasi versi terbaru...',
        'Menguji modul NLP dan pencarian pintar FAQ...',
        'Menyinkronkan panduan teknis dan komitmen layanan...',
      ],
    },
  },
  {
    key: '/live-cs',
    label: 'Panduan Keamanan & Privasi',
    category: 'Bantuan & AI',
    description: 'Halaman keamanan dan privasi (/live-cs/*, /privacy, /security).',
    matchPaths: ['/live-cs', '/privacy', '/security'],
    defaultMaintenance: {
      badge: 'Audit Kebijakan & Keamanan',
      title: 'Halaman Keamanan & Privasi Sedang Diperbarui',
      description:
        'Dokumen kebijakan privasi data, standar keamanan aplikasi, dan panduan perlindungan pengguna sedang diperbarui.',
      footerNote: 'Transparansi keamanan dan privasi selalu menjadi prioritas kami 🔒',
      messages: [
        'Menyesuaikan dokumentasi kebijakan privasi terkini...',
        'Memperbarui rincian lapisan proteksi autentikasi dan RLS...',
        'Menyusun panduan keamanan yang mudah dipahami...',
      ],
    },
  },

  // Aplikasi & Hiburan
  {
    key: '/apps',
    label: 'Daftar Aplikasi (Apps Hub)',
    category: 'Aplikasi & Hiburan',
    description: 'Katalog aplikasi (/apps, /daftar-aplikasi, /daftar-app, /daftarlistApp).',
    matchPaths: ['/apps', '/daftar-aplikasi', '/daftar-app', '/daftarlistapp'],
    defaultMaintenance: {
      badge: 'Update Direktori Apps',
      title: 'Apps Hub Sedang Dalam Perawatan',
      description:
        'Daftar aplikasi web interaktif, filter kategori, dan statistik penggunaan di Apps Hub sedang dalam proses pembaruan.',
      footerNote: 'Seluruh tools dan aplikasi mini segera siap digunakan 🛠️',
      messages: [
        'Memperbarui daftar aplikasi dan status ketersediaan...',
        'Memeriksa tautan peluncuran setiap mini-app...',
        'Mengoptimalkan pencarian dan modal detail aplikasi...',
      ],
    },
  },
  {
    key: '/qodam',
    label: 'Cek Qodam',
    category: 'Aplikasi & Hiburan',
    description: 'Aplikasi hiburan interaktif (/qodam).',
    matchPaths: ['/qodam'],
    defaultMaintenance: {
      badge: 'Pembaruan Mini-App Hiburan',
      title: 'Aplikasi Cek Qodam Sedang Istirahat Sejenak',
      description:
        'Kami sedang menambahkan variasi hasil kreatif dan menyempurnakan animasi interaktif pada halaman Cek Qodam.',
      footerNote: 'Tunggu sebentar ya, fitur hiburan ini segera kembali seru 🔮',
      messages: [
        'Menambahkan variasi deskripsi dan elemen unik...',
        'Menyempurnakan efek visual serta responsivitas mobile...',
        'Menguji pengacakan hasil agar makin menghibur...',
      ],
    },
  },
  {
    key: '/zodiak',
    label: 'Zodiak & Astrologi',
    category: 'Aplikasi & Hiburan',
    description: 'Aplikasi zodiak, numerologi, dan tarot (/zodiak).',
    matchPaths: ['/zodiak'],
    defaultMaintenance: {
      badge: 'Kalibrasi Astrologi & Tarot',
      title: 'Aplikasi Zodiak & Numerologi Dalam Perawatan',
      description:
        'Perhitungan kompatibilitas, tarot, shio, dan profil numerologi sedang kami kalibrasi agar lebih cepat dan akurat.',
      footerNote: 'Bintang dan kartu tarot segera siap dibaca kembali ✨',
      messages: [
        'Memperbarui tabel wawasan harian dan aspek horoskop...',
        'Menguji kalkulator numerologi dan pencocokan pasangan...',
        'Menyegarkan tampilan tab kartu tarot dan profil...',
      ],
    },
  },
  {
    key: '/buat-kamu',
    label: 'Buat Kamu',
    category: 'Aplikasi & Hiburan',
    description: 'Halaman interaktif spesial (/buat-kamu).',
    matchPaths: ['/buat-kamu'],
    defaultMaintenance: {
      badge: 'Sentuhan Spesial',
      title: 'Halaman Buat Kamu Sedang Dirapikan',
      description:
        'Kami sedang menyiapkan sentuhan animasi dan pesan interaktif baru pada halaman spesial Buat Kamu.',
      footerNote: 'Sebentar lagi siap dibuka kembali dengan kejutan baru 💝',
      messages: [
        'Menyesuaikan efek visual dan transisi animasi...',
        'Memastikan tampilan nyaman di semua ukuran layar...',
        'Memberikan sentuhan akhir pada interaksi halaman...',
      ],
    },
  },
  {
    key: '/year-end',
    label: 'Sambutan Tahun Baru',
    category: 'Aplikasi & Hiburan',
    description: 'Halaman perayaan akhir/awal tahun (/year-end).',
    matchPaths: ['/year-end'],
    defaultMaintenance: {
      badge: 'Pemeliharaan Halaman Musiman',
      title: 'Halaman Perayaan Tahun Baru Dalam Perawatan',
      description:
        'Efek perayaan, konfeti, dan pesan refleksi pergantian tahun sedang diperbarui untuk musim perayaan berikutnya.',
      footerNote: 'Halaman selebrasi segera kembali meriah 🎉',
      messages: [
        'Menyesuaikan efek kembang api dan animasi perayaan...',
        'Memperbarui jadwal aktif otomatis akhir tahun...',
        'Menguji performa partikel visual...',
      ],
    },
  },
  {
    key: '/coming-soon',
    label: 'Coming Soon',
    category: 'Aplikasi & Hiburan',
    description: 'Halaman fitur mendatang (/coming-soon/*).',
    matchPaths: ['/coming-soon'],
    defaultMaintenance: {
      badge: 'Pembaruan Roadmap',
      title: 'Halaman Fitur Mendatang Sedang Diperbarui',
      description:
        'Informasi roadmap fitur baru, hitung mundur peluncuran, dan status progres pengembangan sedang kami sinkronkan.',
      footerNote: 'Peta fitur mendatang segera kembali tampil 🚀',
      messages: [
        'Memperbarui persentase progres tiap fitur mendatang...',
        'Menyelaraskan jadwal rilis pada halaman Coming Soon...',
        'Menyiapkan pratinjau fitur baru...',
      ],
    },
  },

  // Akun
  {
    key: '/auth-pages',
    label: 'Login, Register & Profil Akun',
    category: 'Akun',
    description: 'Halaman akun umum (/login, /register, /profile).',
    matchPaths: ['/login', '/register', '/profile'],
    defaultMaintenance: {
      badge: 'Pemeliharaan Autentikasi Akun',
      title: 'Layanan Akun Pengguna Sedang Dalam Perawatan',
      description:
        'Halaman masuk, pendaftaran akun baru, dan pengelolaan profil pengguna sedang ditingkatkan keamanannya.',
      footerNote: 'Data akun Anda tetap aman; layanan autentikasi segera aktif kembali 🔐',
      messages: [
        'Memeriksa integrasi sesi autentikasi Supabase...',
        'Memperkuat validasi dan keamanan data profil...',
        'Menyiapkan kembali formulir login & registrasi...',
      ],
    },
  },
];

export const MAINTENANCE_CATEGORIES = [
  'Semua',
  ...Array.from(new Set(MAINTENANCE_PAGE_CATALOG.map((item) => item.category))),
];

export function normalizeRoutePath(pathname = '/') {
  if (!pathname) return '/';
  const cleaned = String(pathname).trim().split('?')[0].split('#')[0].toLowerCase();
  if (cleaned.length > 1 && cleaned.endsWith('/')) {
    return cleaned.slice(0, -1);
  }
  return cleaned || '/';
}

export function isBypassMaintenancePath(pathname = '/') {
  const normalized = normalizeRoutePath(pathname);
  return MAINTENANCE_BYPASS_PREFIXES.some((prefix) => {
    const p = prefix.toLowerCase();
    return normalized === p || normalized.startsWith(`${p}/`);
  });
}

function matchesEntry(normalizedPath, entry) {
  const targets = entry.matchPaths || [entry.key];
  return targets.some((rawTarget) => {
    const target = normalizeRoutePath(rawTarget);
    if (entry.exactOnly || target === '/') {
      return normalizedPath === target;
    }
    return normalizedPath === target || normalizedPath.startsWith(`${target}/`);
  });
}

/**
 * Mencocokkan pathname saat ini dengan konfigurasi Maintenance.
 */
export function resolveRouteMaintenance(pathname, config) {
  const normalizedPath = normalizeRoutePath(pathname);

  if (isBypassMaintenancePath(normalizedPath)) {
    return {
      isUnderMaintenance: false,
      isBypassRoute: true,
      scope: 'bypass',
      matchedPage: null,
      pageNote: '',
      pageConfig: null,
    };
  }

  const matchedCatalog = MAINTENANCE_PAGE_CATALOG.find((entry) =>
    matchesEntry(normalizedPath, entry)
  );
  const pageOverrides = config?.pageOverrides || {};
  const pageNotes = config?.pageNotes || {};
  const pageConfigs = config?.pageConfigs || {};

  if (config?.globalEnabled) {
    const key = matchedCatalog?.key || normalizedPath;
    return {
      isUnderMaintenance: true,
      isBypassRoute: false,
      scope: 'global',
      matchedPage: matchedCatalog || {
        key: normalizedPath,
        label: normalizedPath === '/' ? 'Beranda' : normalizedPath,
      },
      pageNote: pageNotes[key] || '',
      pageConfig: pageConfigs[key] || null,
    };
  }

  if (matchedCatalog && pageOverrides[matchedCatalog.key] === true) {
    return {
      isUnderMaintenance: true,
      isBypassRoute: false,
      scope: 'page',
      matchedPage: matchedCatalog,
      pageNote: pageNotes[matchedCatalog.key] || '',
      pageConfig: pageConfigs[matchedCatalog.key] || null,
    };
  }

  // Cek custom paths yang ditambahkan admin secara manual
  const customPaths = Array.isArray(config?.customPaths) ? config.customPaths : [];
  for (const rawCustom of customPaths) {
    const customKey = normalizeRoutePath(rawCustom);
    if (!customKey || customKey === '/') continue;
    const isMatch =
      normalizedPath === customKey || normalizedPath.startsWith(`${customKey}/`);
    if (isMatch && pageOverrides[rawCustom] === true) {
      return {
        isUnderMaintenance: true,
        isBypassRoute: false,
        scope: 'page',
        matchedPage: {
          key: rawCustom,
          label: rawCustom,
          category: 'Kustom',
          defaultMaintenance: {
            badge: `Pemeliharaan ${rawCustom}`,
            title: `Halaman ${rawCustom} Sedang Dalam Perawatan`,
            description: `Halaman ${rawCustom} sedang dalam pemeliharaan terjadwal. Silakan kembali lagi sebentar lagi.`,
            footerNote: 'Terima kasih atas kesabaran Anda 🙏',
            messages: [
              `Memeriksa modul dan layanan untuk ${rawCustom}...`,
              'Menjalankan pembaruan konfigurasi halaman...',
            ],
          },
        },
        pageNote: pageNotes[rawCustom] || '',
        pageConfig: pageConfigs[rawCustom] || null,
      };
    }
  }

  return {
    isUnderMaintenance: false,
    isBypassRoute: false,
    scope: 'online',
    matchedPage: matchedCatalog || null,
    pageNote: '',
    pageConfig: null,
  };
}
