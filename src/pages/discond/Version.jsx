import React, { useEffect, useState } from 'react';
import api from './lib/api';

export default function Version() {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const s = await api.siteStats().catch(() => null);
        if (!mounted) return;
        setInfo(s || null);
      } catch (e) {
        // ignore
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="min-h-screen p-6 bg-[var(--color-gray-900)] text-white">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Versi Komunitas</h1>
        {loading ? (
          <div className="text-gray-300">Memuat informasi versi...</div>
        ) : (
            <div className="bg-[#111216] border border-white/6 rounded p-4">
            <div className="text-sm text-gray-400 mb-2">Informasi rilis dan versi untuk Komuniti (discond)</div>
            <div className="space-y-2">
              <div><strong>Versi:</strong> <span className="ml-2 text-gray-200">{info?.version || info?.app_version || '0.0.0'}</span></div>
              <div><strong>Build:</strong> <span className="ml-2 text-gray-200">{info?.build || info?.commit || '-'}</span></div>
              <div><strong>Tanggal rilis:</strong> <span className="ml-2 text-gray-200">{info?.released_at ? new Date(info.released_at).toLocaleString() : '-'}</span></div>
              <div className="pt-3"><strong>Catatan rilis:</strong>
                <div className="mt-2 text-sm text-gray-300 bg-[#0f1112] p-3 rounded">{info?.notes || 'Tidak ada catatan rilis.'}</div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6">
          <a href="/discord" className="inline-block px-4 py-2 bg-cyan-600 rounded">Kembali</a>
        </div>
      </div>
    </div>
  );
}
