# Panduan & Komitmen Aksesibilitas (Accessibility)

Proyek **my-porto** berkomitmen untuk menghadirkan antarmuka website portofolio dan asisten interaktif **SaipulAI** yang inklusif serta mudah digunakan oleh sebanyak mungkin pengguna, termasuk pengguna dengan perangkat bantu (*assistive technology*), navigasi keyboard, maupun preferensi visual tertentu.

Target standar acuan proyek ini adalah **Web Content Accessibility Guidelines (WCAG) 2.1 Level AA**.

---

## 1. Implementasi yang Sudah Diterapkan

- **Deklarasi Bahasa Dokumen:** `index.html` mendeklarasikan atribut bahasa utama (`lang="id"`), sementara fitur bantuan dan SaipulAI mendukung respons dwibahasa (Bahasa Indonesia & Bahasa Inggris).
- **Label Aksesibel (`ARIA`):** Kontrol interaktif utama dan tombol berbasis ikon menggunakan atribut `aria-label` yang deskriptif, antara lain pada:
  - Navigasi utama & tautan sosial media (`src/components/Navbar.jsx`)
  - Tombol & menu bantuan (`src/components/HelpButton.jsx`, `src/components/helpbutton/HelpMenu.jsx`)
  - Notifikasi pembaruan versi (`src/components/UpdateNotification.jsx`)
  - Kontrol chat SaipulAI dan sesi riwayat (`src/components/helpbutton/chat/components/ChatbotWindow.jsx`, `ChatHeader.jsx`, `ChatMessage.jsx`)
- **Tema & Keterbacaan:** Token warna tema terpusat di `src/index.css` mendukung keterbacaan teks pada antarmuka gelap maupun terang serta tata letak responsif di berbagai ukuran layar (`sm`, `md`, `lg`, `xl`, `2xl`).
- **Pemulihan Kesalahan yang Jelas:** Penanganan error global (`src/context/ErrorContext.jsx` dan `ProtectedErrorPage`) mencegah pengguna terjebak pada layar kosong ketika terjadi kegagalan render.

---

## 2. Pedoman Aksesibilitas untuk Kontributor

Setiap Pull Request yang menyentuh UI/UX (`src/pages/`, `src/components/`) diharapkan memperhatikan poin berikut:

1. **HTML Semantik:** Gunakan elemen HTML semantik (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`, `<button>`, `<a>`, `<label>`) daripada elemen `<div>` atau `<span>` dengan event `onClick`.
2. **Navigasi Keyboard & Fokus:**
   - Pastikan seluruh menu, tombol, form, dan dialog modal dapat diakses penuh dengan keyboard (`Tab`, `Shift+Tab`, `Enter`, `Space`, `Escape`).
   - Pertahankan indikator fokus (`focus-visible`) agar posisi fokus keyboard selalu terlihat jelas.
3. **Alternatif Teks & ARIA:**
   - Wajib menyertakan atribut `alt` yang informatif pada elemen `<img>` (atau `alt=""` untuk gambar murni dekoratif).
   - Tombol yang hanya menampilkan ikon harus memiliki `aria-label` yang jelas.
4. **Kontras & Tipografi:** Pastikan teks normal maupun teks bergradien tetap memiliki rasio kontras yang mudah dibaca di atas latar belakangnya.
5. **Animasi & Konten 3D:** Komponen yang memakai `framer-motion` atau `three` (`@react-three/fiber`) perlu menghindari kedipan cepat dan disarankan menghormati preferensi `prefers-reduced-motion`.

---

## 3. Melaporkan Kendala Aksesibilitas

Jika Anda mengalami kesulitan mengakses bagian tertentu dari website (`syaiful-mukmin.netlify.app`) atau menemukan hambatan aksesibilitas pada komponen kode:

- **Buat Issue Aksesibilitas:** Gunakan template **Laporan Aksesibilitas** pada `.github/ISSUE_TEMPLATE/accessibility_issue.yml` saat membuka GitHub Issue.
- **Email Langsung:** Hubungi **`uju355@gmail.com`** dengan menyebutkan halaman/URL terkait, jenis kendala, serta browser atau alat bantu (*screen reader*, keyboard-only, pembesar layar) yang digunakan.
