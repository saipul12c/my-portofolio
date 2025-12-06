import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function ReportModal({ open, onClose, onSubmit, messageId }) {
  const [reason, setReason] = useState('Lainnya');
  const [customReason, setCustomReason] = useState('');
  const [step, setStep] = useState(1);
  const [details, setDetails] = useState([]);
  const [currentDetail, setCurrentDetail] = useState('');

  useEffect(() => {
    if (!open) {
      // reset modal state when closed
      setReason('Lainnya');
      setCustomReason('');
      setStep(1);
      setDetails([]);
      setCurrentDetail('');
    }
  }, [open]);

  if (!open) return null;

  const reasons = [
    'Kekerasan & menyakiti diri sendiri',
    'Eksploitasi & pelecehan seksual',
    'Eksploitasi anak',
    'Perundungan & pelecehan',
    'Spam, penipuan & penyesatan',
    'Pelanggaran privasi',
    'Kekayaan intelektual',
    'Konten yang tidak sesuai untuk usia tertentu',
    'Lainnya'
  ];
  const handleNext = () => {
    // if user selected 'Lainnya' and provided custom reason, use it
    if (reason === 'Lainnya' && customReason.trim() === '') {
      // prompt user to provide custom reason before moving forward
      return;
    }
    setStep(2);
  };

  const addDetail = () => {
    const t = currentDetail.trim();
    if (!t) return;
    setDetails(prev => [...prev, t]);
    setCurrentDetail('');
  };

  const handleFinalSubmit = () => {
    const finalReason = reason === 'Lainnya' ? customReason.trim() : reason;
    const payload = {
      messageId,
      reason: finalReason,
      details,
      timestamp: new Date().toISOString()
    };

    window.dispatchEvent(new CustomEvent('saipul_chat_report', { detail: payload }));
    if (onSubmit) onSubmit(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[11000] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-gray-900 border border-gray-700 rounded-2xl p-4 w-[420px] text-white shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-semibold">Laporkan pesan</div>
          <button onClick={onClose} aria-label="Tutup" className="text-gray-400"><X size={16} /></button>
        </div>

        {step === 1 && (
          <>
            <div className="text-sm text-gray-300 mb-3">Mengapa Anda melaporkan pesan ini?</div>

            <div className="space-y-2 max-h-64 overflow-y-auto mb-3">
              {reasons.map((r) => (
                <label key={r} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="report-reason"
                    value={r}
                    checked={reason === r}
                    onChange={() => setReason(r)}
                    className="form-radio"
                  />
                  <span className="text-gray-200">{r}</span>
                </label>
              ))}

              {reason === 'Lainnya' && (
                <div className="mt-2">
                  <input
                    type="text"
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    placeholder="Masukkan alasan Anda..."
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm text-white placeholder-gray-400"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <button onClick={onClose} className="px-3 py-1 rounded-md bg-gray-800 text-sm text-gray-300">Batal</button>
              <button onClick={handleNext} className="px-3 py-1 rounded-md bg-red-600 text-sm text-white">Berikutnya</button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="text-sm text-gray-300 mb-3">Tambahkan detail (opsional, Anda bisa menambahkan beberapa kali)</div>

            <div className="mb-3">
              <textarea
                value={currentDetail}
                onChange={(e) => setCurrentDetail(e.target.value)}
                placeholder="Jelaskan lebih rinci (mis. bagian mana yang bermasalah, konteks, dll)..."
                rows={4}
                className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm text-white placeholder-gray-400 resize-none"
              />
              <div className="flex gap-2 mt-2">
                <button onClick={addDetail} className="px-3 py-1 rounded-md bg-cyan-600 text-sm text-white">Tambah detail</button>
                <button onClick={() => { setCurrentDetail(''); setDetails([]); setStep(1); }} className="px-3 py-1 rounded-md bg-gray-800 text-sm text-gray-300">Kembali</button>
              </div>
            </div>

            {details.length > 0 && (
              <div className="mb-3 space-y-2 max-h-40 overflow-y-auto">
                {details.map((d, i) => (
                  <div key={i} className="p-2 bg-gray-800 rounded-md text-sm text-gray-200">{d}</div>
                ))}
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button onClick={onClose} className="px-3 py-1 rounded-md bg-gray-800 text-sm text-gray-300">Batal</button>
              <button onClick={handleFinalSubmit} className="px-3 py-1 rounded-md bg-red-600 text-sm text-white">Kirim Laporan</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
