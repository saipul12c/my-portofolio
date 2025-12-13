import React from 'react';
import { useParams, Link } from 'react-router-dom';

export default function ChannelHelp() {
  const { channelId } = useParams();

  return (
    <div className="min-h-screen p-6 bg-[var(--color-gray-900)] text-white">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Bantuan Channel</h1>
        {channelId ? (
          <>
            <p className="text-gray-300 mb-4">Panduan khusus untuk channel: <strong>{channelId}</strong></p>
            <div className="bg-[#111216] border border-white/6 rounded p-4">
              <h3 className="font-semibold">Topik yang dibahas</h3>
              <ul className="list-disc list-inside mt-2 text-gray-300">
                <li>Membuat / mengubah nama channel</li>
                <li>Pengaturan channel (privasi, mute)</li>
                <li>Pin pesan penting</li>
                <li>Manajemen anggota dan peran</li>
              </ul>
              <p className="text-sm text-gray-400 mt-3">Gunakan tombol "Buka di Chat" di banner komunitas untuk langsung beralih ke channel tersebut.</p>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-300 mb-4">Panduan umum untuk channel. Pilih channel di sidebar lalu buka halaman bantuan channel untuk petunjuk khusus.</p>
            <Link to="/discord" className="inline-block mt-3 px-4 py-2 bg-cyan-600 rounded">Buka Komunitas</Link>
          </>
        )}
      </div>
    </div>
  );
}
