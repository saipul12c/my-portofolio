import React from 'react';
import { Link } from 'react-router-dom';

export default function Help() {
  return (
    <div className="min-h-screen p-6 bg-[var(--color-gray-900)] text-white">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Pusat Bantuan Komuniti</h1>
        <p className="text-gray-300 mb-6">Temukan panduan singkat, FAQ, dan bantuan untuk menggunakan fitur Komuniti (discond).</p>

        <div className="grid gap-4">
          <Link to="/discord/help/channel-help" className="block p-4 bg-[#111216]/80 border border-white/10 rounded hover:bg-[#111216]/90">
            <h2 className="text-lg font-semibold">Bantuan Channel</h2>
            <p className="text-sm text-gray-400">Panduan tentang pembuatan channel, pengaturan, pin pesan, dan manajemen anggota.</p>
          </Link>

          <Link to="/help/docs/ai" className="block p-4 bg-[#111216]/80 border border-white/10 rounded hover:bg-[#111216]/90">
            <h2 className="text-lg font-semibold">Dokumentasi Teknis</h2>
            <p className="text-sm text-gray-400">Referensi API dan dokumentasi teknis terkait integrasi.</p>
          </Link>

          <Link to="/discord" className="block p-4 bg-[#111216]/80 border border-white/10 rounded hover:bg-[#111216]/90">
            <h2 className="text-lg font-semibold">Kembali ke Chat</h2>
            <p className="text-sm text-gray-400">Kembali ke tampilan utama Komuniti.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
