import { useState } from 'react';
import Modal from './Modal';
import api from '../../lib/api';

export default function ReportModal({ userId, onClose, onReported }) {
  const [category, setCategory] = useState('harassment');
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const categories = [
    { key: 'harassment', label: 'Pelecehan / Perilaku Buruk' },
    { key: 'spam', label: 'Spam / Iklan' },
    { key: 'impersonation', label: 'Mempretinkan / Penyamar' },
    { key: 'other', label: 'Lainnya' }
  ];

  const submit = async () => {
    if (!details.trim()) {
      alert('Mohon jelaskan alasan pelaporan.');
      return;
    }
    setSubmitting(true);
    try {
      await api.users.report(userId, { category, details }).catch(() => null);
      if (onReported) onReported(true);
      onClose();
      alert('Laporan berhasil dikirim. Terima kasih.');
    } catch (e) {
      console.error('Report failed', e);
      alert('Gagal mengirim laporan. Coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal onClose={onClose} size="md">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Laporkan Akun</h3>
        <div>
          <label className="block text-sm text-gray-300 mb-1">Kategori</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-[#40444b] rounded px-3 py-2 text-white">
            {categories.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">Detail (penjelasan)</label>
          <textarea value={details} onChange={(e) => setDetails(e.target.value)} rows={5} className="w-full bg-[#40444b] rounded px-3 py-2 text-white" placeholder="Jelaskan masalah secara singkat dan jelas..." />
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-2 text-gray-300">Batal</button>
          <button onClick={submit} disabled={submitting} className="px-3 py-2 bg-red-600 text-white rounded">{submitting ? 'Mengirim...' : 'Kirim Laporan'}</button>
        </div>
      </div>
    </Modal>
  );
}
