import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function ReportModal({ open, onClose, onSubmit, messageId }) {
  const [reason, setReason] = useState('Lainnya');
  const [customReason, setCustomReason] = useState('');
  const [step, setStep] = useState(1);
  const [details, setDetails] = useState([]);
  const [currentDetail, setCurrentDetail] = useState('');
  const [severity, setSeverity] = useState('medium');
  const [containsPersonalData, setContainsPersonalData] = useState(false);
  const [allowContact, setAllowContact] = useState(false);
  const [contactInfo, setContactInfo] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

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
    setError('');
    if (reason === 'Lainnya' && customReason.trim() === '') {
      setError('Mohon isi alasan laporan terlebih dahulu.');
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
    setError('');
    const finalReason = reason === 'Lainnya' ? customReason.trim() : reason;
    if (!finalReason) {
      setError('Alasan laporan tidak boleh kosong.');
      return;
    }
    if (allowContact && contactInfo.trim()) {
      // rudimentary email/phone check
      const v = contactInfo.trim();
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      const isPhone = /^[+\d][\d\s()-]{5,}$/.test(v);
      if (!isEmail && !isPhone) {
        setError('Isikan email atau nomor telepon yang valid untuk dihubungi, atau kosongkan.');
        return;
      }
    }

    const payload = {
      messageId,
      reason: finalReason,
      severity,
      containsPersonalData,
      allowContact,
      contactInfo: allowContact ? contactInfo.trim() : '',
      details,
      timestamp: new Date().toISOString()
    };

    try {
      window.dispatchEvent(new CustomEvent('saipul_chat_report', { detail: payload }));
    } catch (e) {
      // non-fatal
      console.warn('saipul_chat_report event failed', e);
    }

    if (onSubmit) {
      try {
        onSubmit(payload);
      } catch (e) {
        console.error('onSubmit handler failed', e);
      }
    }

    // show success screen then allow user to close
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-[11000] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-gray-900 border border-gray-700 rounded-2xl p-4 w-[420px] text-white shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-semibold">Laporkan pesan</div>
          <button onClick={onClose} aria-label="Tutup" className="text-gray-400"><X size={16} /></button>
        </div>

        {step === 1 && !submitted && (
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
              {/** severity selector and personal data question */}
              <div className="mt-3 border-t border-gray-800 pt-3">
                <div className="text-xs text-gray-400 mb-2">Seberapa serius masalah ini?</div>
                <div className="flex gap-2 mb-2">
                  <label className="text-sm"><input type="radio" name="sev" checked={severity==='low'} onChange={()=>setSeverity('low')} /> <span className="ml-2">Rendah</span></label>
                  <label className="text-sm"><input type="radio" name="sev" checked={severity==='medium'} onChange={()=>setSeverity('medium')} /> <span className="ml-2">Sedang</span></label>
                  <label className="text-sm"><input type="radio" name="sev" checked={severity==='high'} onChange={()=>setSeverity('high')} /> <span className="ml-2">Tinggi</span></label>
                </div>

                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={containsPersonalData} onChange={(e)=>setContainsPersonalData(e.target.checked)} /> <span className="text-gray-200">Mengandung data pribadi (mis. nomor identitas, alamat)</span></label>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button onClick={onClose} className="px-3 py-1 rounded-md bg-gray-800 text-sm text-gray-300">Batal</button>
              <button onClick={handleNext} className="px-3 py-1 rounded-md bg-red-600 text-sm text-white">Berikutnya</button>
            </div>
          </>
        )}

        {step === 2 && !submitted && (
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

            <div className="mb-3 border-t border-gray-800 pt-3">
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={allowContact} onChange={(e)=>setAllowContact(e.target.checked)} /> <span className="text-gray-200">Izinkan kami menghubungi Anda untuk tindak lanjut</span></label>
              {allowContact && (
                <input
                  type="text"
                  value={contactInfo}
                  onChange={(e)=>setContactInfo(e.target.value)}
                  placeholder="Email atau nomor telepon (opsional)"
                  className="w-full mt-2 bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm text-white placeholder-gray-400"
                />
              )}
            </div>

            {error && <div className="text-xs text-yellow-300 mb-2">{error}</div>}

            <div className="flex justify-end gap-2">
              <button onClick={onClose} className="px-3 py-1 rounded-md bg-gray-800 text-sm text-gray-300">Batal</button>
              <button onClick={handleFinalSubmit} className="px-3 py-1 rounded-md bg-red-600 text-sm text-white">Kirim Laporan</button>
            </div>
          </>
        )}

        {submitted && (
          <div className="text-center">
            <div className="text-lg font-semibold mb-2">Terima kasih — Laporan diterima</div>
            <div className="text-sm text-gray-300 mb-4">Tim kami akan meninjau laporan ini. Jika Anda memberi izin, kami mungkin menghubungi Anda untuk informasi tambahan.</div>
            <div className="flex justify-center gap-2">
              <button onClick={() => { setSubmitted(false); setStep(1); setDetails([]); setCustomReason(''); setContactInfo(''); setAllowContact(false); setContainsPersonalData(false); }} className="px-3 py-1 rounded-md bg-gray-800 text-sm text-gray-300">Laporkan lagi</button>
              <button onClick={onClose} className="px-3 py-1 rounded-md bg-red-600 text-sm text-white">Tutup</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
