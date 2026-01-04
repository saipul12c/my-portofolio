import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useSettings } from '../../settings/hooks/useSettings';

export default function ReportModal({ open, onClose, onSubmit, messageId, message, messageText, conversationId, messageTimestamp }) {
  const [reason, setReason] = useState('Lainnya');
  const [customReason, setCustomReason] = useState('');
  const [step, setStep] = useState(1);
  const [details, setDetails] = useState([]);
  const [currentDetail, setCurrentDetail] = useState('');
  const [severity, setSeverity] = useState('medium');
  const [category, setCategory] = useState('other');
  const [containsPersonalData, setContainsPersonalData] = useState(false);
  const [allowContact, setAllowContact] = useState(false);
  const [contactInfo, setContactInfo] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const modalRef = useRef(null);
  const { settings } = useSettings();

  useEffect(() => {
    if (!open) {
      // reset modal state when closed
      setReason('Lainnya');
      setCustomReason('');
      setStep(1);
      setDetails([]);
      setCurrentDetail('');
      setAttachments([]);
      setSending(false);
    }
  }, [open]);

  // accessibility: focus trap and Escape close
  useEffect(() => {
    if (!open) return;
    const el = modalRef.current;
    const focusable = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const nodes = el ? Array.from(el.querySelectorAll(focusable)) : [];
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose && onClose();
      }
      if (e.key === 'Tab') {
        if (nodes.length === 0) return;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', handleKey);
    try { first && first.focus(); } catch (e) {}
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

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
    if (customReason && customReason.trim().length > 0 && customReason.trim().length < 6) {
      setError('Alasan terlalu singkat (minimal 6 karakter).');
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
  const handleFinalSubmit = async () => {
    setError('');
    if (sending) return;
    const finalReason = reason === 'Lainnya' ? customReason.trim() : reason;
    if (!finalReason) {
      setError('Alasan laporan tidak boleh kosong.');
      return;
    }
    if (finalReason.length < 6) {
      setError('Alasan terlalu singkat (minimal 6 karakter).');
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
      // message metadata (best-effort, backward-compatible)
      messageId,
      conversationId: conversationId || (message && message.conversationId) || null,
      messageTimestamp: messageTimestamp || (message && message.timestamp) || new Date().toISOString(),
      messageSnippet: messageText || (message && (message.text || message.content)) || '',
      reason: finalReason,
      category,
      severity,
      containsPersonalData,
      allowContact,
      contactInfo: allowContact ? contactInfo.trim() : '',
      details,
      attachments: attachments.map(a => ({ name: a.name, size: a.size, type: a.type })),
      timestamp: new Date().toISOString()
    };

    // client-side duplicate / rate-limit protection (60s)
    try {
      const key = 'saipul_last_report';
      const hash = btoa(unescape(encodeURIComponent(JSON.stringify({ messageId: payload.messageId, reason: payload.reason, details: payload.details }))));
      const last = JSON.parse(localStorage.getItem(key) || '{}');
      const now = Date.now();
      if (last.hash === hash && now - (last.ts || 0) < 60000) {
        setError('Anda baru saja mengirim laporan serupa. Mohon tunggu sebentar.');
        return;
      }
      localStorage.setItem(key, JSON.stringify({ hash, ts: now }));
    } catch (e) {
      // ignore localStorage errors
    }

    // redact PII automatically from details & contactInfo and messageSnippet
    const redactPII = (text = '') => {
      if (!text) return text;
      // mask emails
      let out = text.replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[redacted_email]');
      // mask phone numbers (simple)
      out = out.replace(/(\+?\d[\d\s()\-]{5,}\d)/g, '[redacted_phone]');
      // mask ID-like numbers (e.g., long digit sequences)
      out = out.replace(/\b\d{9,}\b/g, '[redacted_id]');
      return out;
    };

    const safePayload = { ...payload, details: payload.details.map(d => redactPII(d)), contactInfo: redactPII(payload.contactInfo), messageSnippet: redactPII(payload.messageSnippet) };

    // telemetry: basic event if analytics enabled in settings
    try {
      if (settings?.enableAnalytics && window?.saipul_analytics?.trackEvent) {
        window.saipul_analytics.trackEvent('report_submit_attempt', { category: payload.category, severity: payload.severity });
      }
    } catch (e) {}

    setSending(true);
    if (onSubmit) {
      try {
        // pass safePayload and raw attachments (if any) to the handler
        const result = onSubmit(safePayload, { attachmentsRaw: attachments.map(a => a.file) });
        // support async handlers
        if (result && typeof result.then === 'function') {
          await result;
        }
      } catch (e) {
        console.error('onSubmit handler failed', e);
        setError('Gagal mengirim laporan. Silakan coba lagi.');
        setSending(false);
        try { if (settings?.enableAnalytics && window?.saipul_analytics?.trackEvent) window.saipul_analytics.trackEvent('report_submit_failure'); } catch (e) {}
        return;
      }
    }

    // persist report locally (best-effort) so response generator can use it
    try {
      const keyReports = 'saipul_chat_reports';
      const existing = JSON.parse(localStorage.getItem(keyReports) || '[]');
      const toStore = { ...safePayload, storedAt: new Date().toISOString() };
      existing.push(toStore);
      // keep only recent 200 reports to bound size
      const trimmed = existing.slice(-200);
      try { localStorage.setItem(keyReports, JSON.stringify(trimmed)); } catch (e) { /* ignore storage errors */ }
    } catch (e) { /* ignore */ }

    // show success screen then allow user to close
    setSubmitted(true);
    setSending(false);
    try { if (settings?.enableAnalytics && window?.saipul_analytics?.trackEvent) window.saipul_analytics.trackEvent('report_submit_success'); } catch (e) {}
  };

  // file upload helpers
  const onFiles = async (files) => {
    const arr = Array.from(files || []);
    const maxSizeMb = (settings?.maxFileSize || 10) * 1024 * 1024;
    const allowed = (settings?.allowedFileTypes || []).map(a => (String(a || '').replace(/^\./, '').toLowerCase()));
    for (const f of arr) {
      if (f.size > maxSizeMb) {
        setError(`File ${f.name} melebihi batas ukuran ${(settings?.maxFileSize || 10)} MB`);
        continue;
      }
      const ext = f.name.split('.').pop().toLowerCase();
      if (allowed.length && !allowed.includes(ext)) {
        setError(`Tipe file .${ext} tidak diizinkan`);
        continue;
      }
      const data = await new Promise((res) => {
        const r = new FileReader();
        r.onload = () => res(r.result);
        r.readAsDataURL(f);
      });
      setAttachments(prev => [...prev, { file: f, data, name: f.name, size: f.size, type: f.type }]);
    }
  };

  const removeAttachment = (i) => setAttachments(prev => prev.filter((_, idx) => idx !== i));


  return (
    <div className="fixed inset-0 z-[11000] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div ref={modalRef} role="dialog" aria-modal="true" aria-label="Laporkan pesan" className="relative bg-gray-900 border border-gray-700 rounded-2xl p-4 w-[420px] text-white shadow-lg">
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
              <div className="mt-3">
                <label className="text-xs text-gray-400">Kategori</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full mt-1 bg-gray-800 border border-gray-700 rounded-md px-2 py-2 text-sm text-white">
                  <option value="other">Lainnya</option>
                  <option value="misinformation">Misinformasi</option>
                  <option value="abusive">Pelecehan / Abusive</option>
                  <option value="privacy">Privasi / PII</option>
                  <option value="spam">Spam / Penipuan</option>
                </select>
              </div>
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

            {/* message preview + attachments */}
            <div className="mb-3 border-t border-gray-800 pt-3">
              <div className="text-xs text-gray-400 mb-2">Preview pesan (untuk konteks reviewer)</div>
              <div className="p-2 bg-gray-800 rounded-md text-sm text-gray-200 max-h-24 overflow-y-auto">{messageText || (message && (message.text || message.content)) || 'Tidak ada pratinjau tersedia.'}</div>
              <div className="mt-2">
                <label className="text-xs text-gray-400">Lampiran (opsional)</label>
                <input type="file" multiple onChange={(e) => onFiles(e.target.files)} className="mt-1 text-sm text-gray-300" />
                {attachments.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {attachments.map((a, i) => (
                      <div key={i} className="flex items-center justify-between bg-gray-800 p-2 rounded-md text-sm">
                        <div className="truncate mr-3">{a.name} • {Math.round(a.size / 1024)} KB</div>
                        <button onClick={() => removeAttachment(i)} className="text-xs text-amber-300">Hapus</button>
                      </div>
                    ))}
                  </div>
                )}
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
              <button onClick={onClose} disabled={sending} className="px-3 py-1 rounded-md bg-gray-800 text-sm text-gray-300" aria-disabled={sending}>Batal</button>
              <button onClick={handleFinalSubmit} disabled={sending} className="px-3 py-1 rounded-md bg-red-600 text-sm text-white flex items-center gap-2" aria-disabled={sending}>
                {sending ? 'Mengirim...' : 'Kirim Laporan'}
              </button>
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
