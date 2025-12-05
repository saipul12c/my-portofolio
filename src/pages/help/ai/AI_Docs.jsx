import React from "react";
import { CHATBOT_VERSION, DEFAULT_SETTINGS } from "../../../components/helpbutton/chat/config";

export default function AI_Docs() {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-900/90 rounded-lg text-gray-100">
      <header className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">SaipulAI — Dokumentasi & Panduan</h1>
        <div className="flex items-center justify-between gap-4 text-sm text-gray-300">
          <span>Versi: <strong className="text-white">{CHATBOT_VERSION}</strong></span>
          <span>Lokasi konfigurasi: <code className="bg-gray-800 px-2 py-1 rounded">src/components/helpbutton/chat/config.js</code></span>
        </div>
      </header>

          <section className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Riwayat Perubahan (Sesi Terakhir)</h2>
            <ul className="list-decimal ml-5 text-sm text-gray-300">
              <li><strong>2025-12-05</strong> — Memperbaiki masalah respons yang hanya mengulang input pengguna dengan mengganti placeholder reply menjadi pemanggilan generator respons nyata di <code>useChatbot.js</code>.</li>
              <li><strong>2025-12-05</strong> — Mengganti import `ChatbotWindow` di <code>HelpButton.jsx</code> agar menggunakan versi di <code>components/logic/ChatbotWindow.jsx</code> (yang merender pesan dengan benar).</li>
              <li><strong>2025-12-05</strong> — Memperbaiki path import hook di <code>ChatbotWindow.jsx</code> dari <code>./hooks/...</code> menjadi <code>./hook/...</code>.</li>
              <li><strong>2025-12-05</strong> — Memperbaiki bug referensi (ReferenceError) dan urutan deklarasi di <code>useChatbot.js</code> (memindahkan <code>updateQuickActions</code> dan <code>generateSuggestions</code> agar tidak dipanggil sebelum dideklarasikan, dan menghapus deklarasi ganda).</li>
              <li><strong>2025-12-05</strong> — Memperbarui <code>ChatInput.jsx</code> untuk menampilkan peringatan singkat dan versi chatbot (menggantikan teks panduan upload), serta mengarahkan ke halaman dokumentasi AI.</li>
              <li><strong>2025-12-05</strong> — Menambahkan berkas konfigurasi kecil <code>src/components/helpbutton/chat/config.js</code> (memuat <code>CHATBOT_VERSION</code> dan <code>AI_DOCS_PATH</code>) dan membuat halaman dokumentasi ini <code>src/pages/help/ai/AI_Docs.jsx</code>.</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Riwayat Versi</h2>
            <p className="text-sm text-gray-300">Versi saat ini ditampilkan di atas (nilai diambil dari konfigurasi). Untuk memperbarui versi, edit <code>src/components/helpbutton/chat/config.js</code> dan ubah <code>CHATBOT_VERSION</code>. Contoh format versi yang dipakai selama sesi ini:</p>
            <ul className="list-disc ml-5 text-sm text-gray-300">
              <li><strong>v6.0.0</strong> — Versi dasar yang digunakan dalam perbaikan dan dokumentasi saat ini.</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Informasi Sebelumnya / Masalah yang Diperbaiki</h2>
            <p className="text-sm text-gray-300">Sebelum perbaikan, aplikasi mengalami beberapa masalah yang memengaruhi fungsi chat:</p>
            <ul className="list-disc ml-5 text-sm text-gray-300">
              <li>Respons chatbot yang hanya menampilkan teks <code>Smart reply for: &lt;input&gt;</code> (disebabkan placeholder lokal yang mengembalikan input pengguna).</li>
              <li>Beberapa impor file mengarah ke lokasi yang salah sehingga modul tidak ditemukan oleh Vite (contoh: path hooks, path config).</li>
              <li>Error runtime karena pemanggilan fungsi sebelum deklarasi (Temporal Dead Zone) di <code>useChatbot.js</code>.</li>
            </ul>
            <p className="text-sm text-gray-300 mt-2">Perbaikan di atas menargetkan akar masalah tersebut — memperbaiki impor, memperbaiki urutan deklarasi, dan mengganti penggunaan placeholder respons dengan generator respons yang lengkap.</p>
          </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Ringkasan Singkat</h2>
        <p className="text-sm text-gray-300">SaipulAI adalah asisten lokal ringan yang menggabungkan: knowledge base berbasis file JSON, modul kalkulator matematika, utilitas konversi, dan mekanisme saran otomatis. Semua proses utama berjalan secara lokal di aplikasi — tidak terhubung ke API eksternal kecuali dikonfigurasi secara eksplisit.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Fitur Utama</h2>
        <ul className="list-disc ml-5 text-sm text-gray-300">
          <li>📚 Knowledge Base dinamis — sumber utama berasal dari file JSON di <code>src/components/helpbutton/chat/data/</code>.</li>
          <li>🧮 Kalkulator matematika canggih — dukungan fungsi trig, log, konstanta, dan ekspresi kompleks.</li>
          <li>🔁 Konversi & utilitas — suhu, mata uang dasar, dan analisis statistik sederhana.</li>
          <li>📁 Dukungan upload (opsional) — file diindeks ke knowledge base bila diaktifkan.</li>
          <li>💡 Saran kontekstual & quick actions berdasarkan topik percakapan.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Sumber Data (Knowledge Base)</h2>
        <p className="text-sm text-gray-300 mb-2">Edit atau tambahkan data di file JSON berikut untuk memperkaya SaipulAI:</p>
        <ul className="list-disc ml-5 text-sm text-gray-300">
          <li><code>src/components/helpbutton/chat/data/AI-base.json</code> — basis tanya-jawab AI default.</li>
          <li><code>src/components/helpbutton/chat/data/cards.json</code></li>
          <li><code>src/components/helpbutton/chat/data/certificates.json</code></li>
          <li><code>src/components/helpbutton/chat/data/collaborations.json</code></li>
          <li><code>src/components/helpbutton/chat/data/interests.json</code></li>
          <li><code>src/components/helpbutton/chat/data/profile.json</code></li>
          <li><code>src/components/helpbutton/chat/data/softskills.json</code></li>
        </ul>
        <p className="text-xs text-gray-500 mt-2">Tip: gunakan format kunci → jawaban (object) untuk pencocokan cepat, atau tambahkan struktur array untuk entri multi-item.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Pengaturan & Konfigurasi</h2>
        <p className="text-sm text-gray-300">Konfigurasi default dapat dilihat di <code>src/components/helpbutton/chat/config.js</code>. Contoh pengaturan default yang aktif:</p>
        <pre className="bg-gray-800 p-3 rounded text-xs text-gray-200 overflow-auto"><code>{JSON.stringify(DEFAULT_SETTINGS, null, 2)}</code></pre>
        <p className="text-sm text-gray-300 mt-2">Untuk mengubah perilaku (mis. presisi matematika, penggunaan file terunggah), edit file konfigurasi lalu restart dev server.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Contoh Pertanyaan & Cara Kerja</h2>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="font-medium text-gray-200 mb-1">Lookup sederhana</h3>
            <p className="text-gray-300">Input: <code>"Apa itu kecerdasan buatan?"</code></p>
            <p className="text-gray-300">Output: dijawab langsung dari <code>AI-base.json</code> bila ada kecocokan kunci.</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-200 mb-1">Kalkulator</h3>
            <p className="text-gray-300">Input: <code>"2 + 2"</code> atau <code>"hitung integral x^3 dari 0 sampai 1"</code></p>
            <p className="text-gray-300">Output: hasil numerik dengan presisi sesuai setelan.</p>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-3">Contoh quick action: kirim <code>"Tampilkan softskills"</code> untuk melihat entri terkait dari <code>softskills.json</code>.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Troubleshooting — Error Umum</h2>
        <ul className="list-disc ml-5 text-sm text-gray-300">
          <li><strong>Import gagal:</strong> pastikan semua file yang di-import ada di path yang benar (lihat pesan error Vite). Jika menambahkan file baru, restart dev server.</li>
          <li><strong>Jawaban kosong/tidak relevan:</strong> periksa struktur JSON & gunakan kunci yang spesifik untuk lookup cepat.</li>
          <li><strong>Masalah kalkulator:</strong> pastikan ekspresi valid; fitur matematika dapat dibatasi oleh konfigurasi <code>calculationPrecision</code>.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Privasi & Keamanan</h2>
        <p className="text-sm text-gray-300">Secara default, SaipulAI memproses data secara lokal. File yang diunggah hanya disimpan/diindeks bila fitur upload diaktifkan. Jangan unggah data sensitif tanpa enkripsi; selalu review kebijakan privasi aplikasi Anda sebelum menyimpan data user.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Cara Kontribusi / Menambah Data</h2>
        <ol className="list-decimal ml-5 text-sm text-gray-300">
          <li>Edit atau buat file JSON di <code>src/components/helpbutton/chat/data/</code> dengan struktur yang konsisten.</li>
          <li>Jika menambahkan modul utilitas baru, tempatkan di <code>src/components/helpbutton/chat/components/logic/utils/</code> atau <code>src/components/helpbutton/chat/logic/utils/</code>.</li>
          <li>Restart aplikasi (`npm run dev`) agar perubahan ter-load.</li>
        </ol>
      </section>

      <footer className="pt-4 border-t border-gray-800 text-sm text-gray-400">
        <div>Butuh bantuan cepat? Hubungi maintainer atau buka issue di repo.</div>
        <div className="mt-2">Catatan gaya: dokumentasi ini ditulis profesional namun santai — kalau mau versi yang lebih teknis, minta saja.</div>
      </footer>
    </div>
  );
}
