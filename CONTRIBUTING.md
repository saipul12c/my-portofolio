# Panduan Kontribusi (`my-porto`)

Terima kasih sudah tertarik berkontribusi pada proyek **my-porto** (`https://github.com/saipul12c/my-portofolio`). Dokumen ini menjelaskan aturan main, setup lingkungan pengembangan, struktur proyek, dan alur Pull Request.

---

## 1. Kode Etik, Lisensi, & Batasan Aset

Sebelum berkontribusi, harap pahami aturan berikut:

- **Kode Etik:** Seluruh interaksi di repositori ini tunduk pada [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
- **Lisensi Kode Sumber:** Seluruh kontribusi kode sumber dirilis di bawah **GNU Affero General Public License v3.0 (`AGPL-3.0`)** sesuai [LICENSE.md](LICENSE.md).
- **Batasan Aset & Konten Pribadi:** Jangan memodifikasi, menyalin, atau menyalahgunakan data profil, foto pribadi, artikel blog, maupun identitas pemilik yang dilindungi oleh [COPYRIGHT.md](COPYRIGHT.md) kecuali untuk perbaikan teknis yang relevan (misalnya perbaikan struktur/bug).
- **Keamanan & Kredensial:** Jangan pernah menyertakan file `.env`, kunci API (Supabase, EmailJS, dll.), token, atau data pribadi ke dalam commit maupun Pull Request.

---

## 2. Prasyarat & Setup Pengembangan Lokal

- **Node.js** (v18 atau lebih baru disarankan) dan **npm**.

```bash
git clone https://github.com/saipul12c/my-portofolio.git
cd my-portofolio
npm install
```

### Perintah Utama (`package.json`)

| Perintah | Kegunaan |
|---|---|
| `npm run dev` | Menjalankan Vite dev server (termasuk middleware `/api/saipul` dari `vite.config.js`) |
| `npm run api:server` | Menjalankan server HTTP Node.js mandiri untuk SaipulAI API (`server/saipul-server.js`, port default `3001`) |
| `npm run cli` | Menjalankan SaipulAI CLI (`bin/saipul-cli.js`) |
| `npm run lint` | Menjalankan pemeriksaan ESLint sesuai `eslint.config.js` |
| `npm run build` | Membangun bundle produksi ke direktori `dist/` |
| `npm run preview` | Menjalankan preview hasil build produksi |
| `npm run test:nlu` | Menjalankan pengujian NLU (`test/testNaturalNLU.js`) |
| `npm run test:benchmark` | Menjalankan benchmark SaipulAI (`test/runBenchmark.js`) |

Skrip pengujian tambahan tersedia di direktori `test/` (antara lain `test/testSaipulApiSecurity.js`, `test/testSaipulApiHarmonization.js`, `test/testSaipulRegressions.js`, dan `test/testMultiLanguage.js`) yang dapat dijalankan menggunakan `node test/<nama-file>.js`.

---

## 3. Struktur Utama Repositori

- `src/pages/` — Halaman React (Home, Hub, Proyek, Blog, Galeri, Help/AI Docs, dll.)
- `src/components/` — Komponen UI bersama (`Navbar.jsx`, `Footer.jsx`, `HelpButton.jsx`, modul chat SaipulAI)
- `src/utils/` & `src/lib/` — Utilitas frontend, neural pipeline, dan klien integrasi
- `src/data/` — Data JSON halaman dan basis pengetahuan SaipulAI
- `api/saipul.js` — Handler REST API SaipulAI lintas-runtime (Vite middleware, Node HTTP, dan Netlify Functions)
- `server/saipul-server.js` — Standalone HTTP server untuk `api/saipul.js`
- `netlify/functions/` — Entrypoint serverless untuk deployment Netlify
- `bin/saipul-cli.js` — Antarmuka baris perintah (CLI) SaipulAI
- `test/` — Kumpulan skrip pengujian NLU, keamanan API, regresi, dan benchmark

---

## 4. Standar Kode & Aksesibilitas

1. **Linting:** Pastikan `npm run lint` lolos tanpa error (aturan mengacu pada `eslint.config.js`).
2. **Styling:** Gunakan utility classes **Tailwind CSS v4** dan design tokens di `src/index.css` — hindari menambah file CSS kustom terpisah yang tidak perlu.
3. **Aksesibilitas:** Patuhi panduan pada [ACCESSIBILITY.md](ACCESSIBILITY.md) untuk setiap perubahan UI (elemen semantik, navigasi keyboard, `aria-label`, dan kontras warna).
4. **Sinkronisasi Dual-Engine SaipulAI:** Jika mengubah logika NLU/Math/KB pada `src/components/helpbutton/chat/components/logic/` atau `src/utils/ai/`, pastikan tidak merusak handler publik di `api/saipul.js`.

---

## 5. Cara Melaporkan Issue & Mengajukan Pull Request

### Melaporkan Bug atau Mengusulkan Fitur
- Gunakan template yang tersedia di `.github/ISSUE_TEMPLATE/` saat membuka Issue baru di GitHub.
- Untuk celah keamanan, **jangan** membuat Issue publik — ikuti prosedur di [SECURITY.md](SECURITY.md).

### Mengajukan Pull Request (PR)
1. **Fork** repositori ini dan buat branch baru dari `main` dengan nama deskriptif (contoh: `fix/navbar-focus` atau `feat/saipul-nlu-intent`).
2. Lakukan perubahan secara terfokus (hindari mencampur banyak perbaikan tidak terkait dalam satu PR).
3. Verifikasi perubahan sebelum mengirim PR:
   ```bash
   npm run lint
   npm run build
   ```
   *(Jalankan juga `npm run test:nlu` atau skrip relevan di `test/` apabila perubahan menyentuh logika SaipulAI atau `/api/saipul`.)*
4. Buka Pull Request menuju branch `main` dengan menjelaskan:
   - Ringkasan perubahan dan alasannya
   - Referensi nomor Issue terkait (jika ada)
   - Screenshot atau cuplikan output pengujian bila menyangkut UI/API
