# Kebijakan Keamanan (Security Policy)

Keamanan aplikasi portofolio **my-porto** dan layanan **SaipulAI** (`https://github.com/saipul12c/my-portofolio`) sangat kami prioritaskan. Dokumen ini menjelaskan versi yang didukung, kontrol keamanan yang diterapkan, serta prosedur pelaporan kerentanan secara bertanggung jawab.

---

## Versi yang Didukung

Pembaruan dan perbaikan keamanan hanya diberikan pada versi aktif terbaru dari branch `main`:

| Versi | Didukung |
|---|---|
| `1.20.x` (`main`) | :white_check_mark: Didukung |
| `< 1.20.0` | :x: Tidak didukung |

---

## Gambaran Kontrol Keamanan di Proyek

- **Frontend & Kredensial:** Aplikasi frontend dibangun dengan React + Vite. Variabel sensitif dan konfigurasi lokal dikelola melalui environment variables (`.env` dikecualikan dari Git melalui `.gitignore`) dan tidak disimpan di repositori publik.
- **SaipulAI REST API (`api/saipul.js`, `server/saipul-server.js`, `netlify/functions/saipul.js`):**
  - Tidak memerlukan kunci API sensitif pada endpoint publik (*Zero Sensitive Keys Required*).
  - **Rate Limiting:** Pembatasan permintaan per IP di memori (`30` permintaan/menit) dengan pembersihan berkala dan batas `5000` entri untuk mencegah kebocoran memori (*OOM*).
  - **Validasi Input & Payload:** Batas ukuran payload `64 KB`, batas panjang query `2500` karakter, dan sanitasi riwayat percakapan maksimal `10` item (`sanitizeHistory`).
  - **Penyaringan PII:** Deteksi pola data sensitif (*Personally Identifiable Information*) pada input untuk mencegah pemrosesan kredensial atau nomor sensitif (`PII_PATTERNS`).
  - **Security Headers & CORS:** Penerapan header keamanan HTTP dan konfigurasi CORS pada handler API.
- **Halaman Informasi In-App:** Dokumentasi keamanan dan privasi bagi pengguna juga tersedia pada rute `/live-cs/security` dan `/live-cs/privacy`.

---

## Cara Melaporkan Kerentanan

**Harap JANGAN melaporkan celah keamanan melalui GitHub Issues publik, Pull Request publik, atau kolom diskusi terbuka.**

Jika Anda menemukan potensi kerentanan keamanan, laporkan secara privat melalui salah satu jalur berikut:

1. **GitHub Private Vulnerability Reporting (Disarankan):**
   Buka tab **Security** di repositori `saipul12c/my-portofolio` -> pilih **Advisories** -> **Report a vulnerability**.
2. **Email Privat:**
   Kirim laporan ke **`uju355@gmail.com`** dengan subjek:
   `[SECURITY] Laporan Kerentanan - my-porto`

### Informasi yang Perlu Disertakan
Agar kami dapat menyelidiki dan menindaklanjuti laporan dengan cepat, mohon sertakan:
- Jenis dan deskripsi ringkas kerentanan (misalnya XSS, kebocoran data, bypass rate limit, injeksi, dll.).
- Lokasi komponen, rute, atau file terdampak (misalnya `api/saipul.js` atau rute halaman tertentu).
- Langkah reproduksi (*steps to reproduce*) atau *Proof of Concept* (PoC) yang aman.
- Dampak potensial serta saran mitigasi (opsional).

---

## Proses Penanganan & Ekspektasi Waktu

- **Konfirmasi Penerimaan:** Maksimal dalam **3 hari kerja** setelah laporan diterima.
- **Evaluasi & Perbaikan:** Laporan akan diverifikasi tingkat keparahannya (*severity*) dan diprioritaskan untuk perbaikan pada branch `main`.
- **Pengungkapan Terkoordinasi (*Coordinated Disclosure*):** Kami meminta pelapor menjaga kerahasiaan detail teknis hingga perbaikan dirilis atau disepakati waktu publikasinya bersama pengelola (`M. Syaiful Mukmin`).

---

## Di Luar Cakupan (*Out of Scope*)

Hal-hal berikut umumnya berada di luar cakupan pelaporan kerentanan repositori ini:
- Serangan *Denial of Service* (DoS/DDoS) atau *automated stress-testing* terhadap situs produksi (`syaiful-mukmin.netlify.app`).
- Temuan dari pemindai otomatis tanpa bukti dampak nyata atau PoC yang valid.
- Kerentanan infrastruktur penyedia layanan pihak ketiga (Netlify, Supabase, EmailJS) — silakan laporkan langsung ke penyedia terkait.
