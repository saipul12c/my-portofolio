import { motion, AnimatePresence } from "framer-motion";
import { 
  ThumbsUp, 
  ThumbsDown, 
  RefreshCw, 
  Flag, 
  Trash, 
  Copy, 
  Check, 
  Volume2, 
  VolumeX, 
  MessageSquare, 
  User, 
  ExternalLink,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Cpu,
  ShieldCheck
} from "lucide-react";
import ReportModal from "./ReportModal";
import { useState, useEffect } from "react";
import { MultiLoadingAnimation } from "./LoadingAnimations";
import { LIVE_CS_PATH } from "../../../config.js";

// escape potentially unsafe characters (extra safety, React already escapes by default)
function escapeHtml(unsafe) {
  if (unsafe === null || unsafe === undefined) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Helper untuk menguraikan transparansi & alur berpikir jawaban bot
function getTransparencyInfo(message) {
  const meta = message?._meta || {};
  const rawSource = meta.source || null;
  const rawConf = typeof meta.confidence === 'number' ? meta.confidence : null;
  const emotion = message?.emotion?.primary || message?.emotion || null;
  const character = message?.character?.character || message?.character || null;

  let sourceType = 'nlu';
  let sourceId = '';
  if (typeof rawSource === 'string') {
    sourceType = rawSource.toLowerCase();
  } else if (rawSource && typeof rawSource === 'object') {
    sourceType = (rawSource.type || rawSource.category || 'knowledge_base').toLowerCase();
    sourceId = rawSource.id || '';
  }

  let label = 'Knowledge Engine';
  let icon = '🧠';
  let description = 'Basis data pengetahuan lokal portofolio (JSON)';
  let method = 'Pencocokan Semantik NLU & Ekstraksi Entitas';
  let defaultConf = 0.85;

  switch (sourceType) {
    case 'faq':
      label = 'Database FAQ';
      icon = '❓';
      description = `Dokumentasi Tanya Jawab (FAQ)${sourceId ? ` [${sourceId}]` : ''}`;
      method = 'Pencarian Kesamaan Teks TF-IDF / Token Overlap';
      defaultConf = 0.92;
      break;
    case 'calculator':
      label = 'Kalkulator Matematis';
      icon = '🧮';
      description = 'Evaluator Ekspresi Matematika Lokal';
      method = 'Deterministik Math Parser (mathjs / custom evaluator)';
      defaultConf = 0.99;
      break;
    case 'conversion':
      label = 'Konversi Satuan';
      icon = '📐';
      description = 'Standar Konversi Satuan & Unit';
      method = 'Algoritma Rasio Konversi Metrik/Imperial';
      defaultConf = 0.99;
      break;
    case 'rag':
      label = 'Dokumen RAG';
      icon = '📚';
      description = 'Sintesis Multi-Dokumen Terpadu';
      method = 'Retrieval-Augmented Generation (Client-Side Vector/Keyword Retrieval)';
      defaultConf = 0.88;
      break;
    case 'data_integration':
    case 'knowledge_base':
      label = 'Knowledge Base';
      icon = '🧠';
      description = 'Basis Data Portofolio (Proyek, Skill, Sertifikasi, Edukasi)';
      method = 'Integrasi Graf Pengetahuan & Heuristik N-Gram Overlap';
      defaultConf = 0.87;
      break;
    case 'ai_identity':
    case 'ai_capabilities':
    case 'ai_creator':
      label = 'Profil SaipulAI';
      icon = '🤖';
      description = 'Manifest & Identitas Asisten Virtual SaipulAI';
      method = 'Rule-Based Self-Disclosure & Profiling System';
      defaultConf = 0.95;
      break;
    case 'time':
      label = 'Waktu Dunia';
      icon = '🕒';
      description = 'Resolusi Zona Waktu Global (Intl DateTime API)';
      method = 'Pemetaan Zona Waktu Sistem Browser';
      defaultConf = 0.98;
      break;
    case 'policy':
    case 'reported':
    case 'throttle':
      label = 'Filter Keamanan';
      icon = '🛡️';
      description = 'Kebijakan Moderasi Konten & Perlindungan Privasi PII';
      method = 'Pemeriksaan Aturan Keamanan & Pencegahan Fabrikasi';
      defaultConf = 0.95;
      break;
    case 'live_cs':
    case 'live_cs_referral':
    case 'live_cs_direct':
      label = 'Bantuan Langsung';
      icon = '🎧';
      description = 'Integrasi Layanan Customer Support / Room Diskusi';
      method = 'Deteksi Intent Bantuan Manusia';
      defaultConf = 0.95;
      break;
    default:
      label = 'Analisis NLU';
      icon = '💡';
      description = 'Pemrosesan Bahasa Alami Kueri Pengguna';
      method = 'Klasifikasi Intent & Ekstraksi Entitas Semantik';
      defaultConf = 0.82;
      break;
  }

  const confidence = rawConf !== null ? rawConf : defaultConf;
  const percent = Math.min(100, Math.max(10, Math.round(confidence * 100)));

  return {
    label,
    icon,
    description,
    method,
    percent,
    emotion: emotion ? String(emotion) : null,
    character: character ? String(character) : null,
    relatedConcepts: Array.isArray(meta.relatedConcepts) ? meta.relatedConcepts : []
  };
}

export function ChatMessage({ message, handleQuickAction, isAgentOnline }) {
  const isUser = message.from === "user";
  const transparency = !isUser ? getTransparencyInfo(message) : null;
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [reportCount, setReportCount] = useState(0);
  const [reportSeverity, setReportSeverity] = useState(null);
  const [reportCategories, setReportCategories] = useState([]);
  const [hiddenByReports, setHiddenByReports] = useState(false);
  const [isReportModalOpen, setReportModalOpen] = useState(false);
  const [typingText, setTypingText] = useState('');
  const [typingDots, setTypingDots] = useState('');
  const [loadingLabel, setLoadingLabel] = useState('');
  const [loadingAnimationType, setLoadingAnimationType] = useState('thinking');

  const openReportModal = () => setReportModalOpen(true);
  const closeReportModal = () => setReportModalOpen(false);

  // compute report summary for this message (best-effort match by messageId or snippet overlap)
  const computeReportSummary = () => {
    try {
      const reports = JSON.parse(localStorage.getItem('saipul_chat_reports') || '[]');
      if (!Array.isArray(reports) || reports.length === 0) {
        setReportCount(0); setReportSeverity(null); setReportCategories([]); return;
      }
      const byId = reports.filter(r => r.messageId && String(r.messageId) === String(message.id));
      let matched = byId;
      if (matched.length === 0) {
        // fallback: snippet overlap heuristic
        const snippet = (message && (message.text || '')).toLowerCase();
        const tokens = snippet.split(/\W+/).filter(w => w.length > 3);
        matched = reports.filter(r => {
          const rsn = (r.messageSnippet || r.messageText || '').toLowerCase();
          if (!rsn) return false;
          let matches = 0;
          for (const t of tokens) if (rsn.includes(t)) matches++;
          return matches >= 1;
        });
      }
      const count = matched.length;
      const cats = [...new Set(matched.map(m => m.category || m.reason || 'other'))];
      // highest severity mapping
      const order = { low: 1, medium: 2, high: 3 };
      let highest = null;
      for (const m of matched) {
        const s = String(m.severity || m.level || 'medium').toLowerCase();
        if (!highest || (order[s] || 2) > (order[highest] || 2)) highest = s;
      }
      setReportCount(count);
      setReportSeverity(highest);
      setReportCategories(cats);
      // hide automatically if many reports or high severity
      if (count >= 3 || highest === 'high') setHiddenByReports(true);
    } catch (e) {
      setReportCount(0); setReportSeverity(null); setReportCategories([]);
    }
  };

  useEffect(() => {
    computeReportSummary();
    const onStorage = (e) => {
      if (e && e.key === 'saipul_chat_reports') computeReportSummary();
    };
    const onCustom = (ev) => { try { computeReportSummary(); } catch (e) {} };
    window.addEventListener('storage', onStorage);
    window.addEventListener('saipul_chat_report', onCustom);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('saipul_chat_report', onCustom);
    };
  }, [message && message.id]);

  const renderInline = (text) => {
    if (!text) return null;
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, i) =>
      i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>
    );
  };

  // Typing animation: reveal expectedText gradually and show rotating loading labels
  useEffect(() => {
    if (!message || message.type !== 'typing' || !message._meta || !message._meta.expectedText) {
      setTypingText('');
      setTypingDots('');
      setLoadingLabel('');
      return;
    }

    const expected = String(message._meta.expectedText || '');
    const cps = Number(message._meta.cps || 30);
    const msPerChar = Math.max(20, Math.round(1000 / cps));
    let i = 0;
    setTypingText('');

    // Set animation type - could be from message metadata or random
    const animationType = message._meta?.loadingAnimation || 'random';
    if (animationType === 'random') {
      const animations = ['thinking', 'wave', 'photo', 'video', 'pulse', 'shimmer', 'orbit', 'bouncing', 'spotlight', 'dna'];
      setLoadingAnimationType(animations[Math.floor(Math.random() * animations.length)]);
    } else {
      setLoadingAnimationType(animationType);
    }

    const charInterval = setInterval(() => {
      i += 1;
      setTypingText(expected.slice(0, i));
      if (i >= expected.length) {
        clearInterval(charInterval);
      }
    }, msPerChar);

    // dots and loading label rotator
    const variants = Array.isArray(message._meta.loadingVariants) && message._meta.loadingVariants.length > 0 ? message._meta.loadingVariants : ['Memikirkan...'];
    let dotCount = 0;
    let labelIndex = 0;
    const dotsInterval = setInterval(() => {
      dotCount = (dotCount + 1) % 4;
      setTypingDots('.'.repeat(dotCount));
      if (dotCount === 0) {
        labelIndex = (labelIndex + 1) % variants.length;
        setLoadingLabel(variants[labelIndex]);
      }
    }, 400);

    return () => {
      clearInterval(charInterval);
      clearInterval(dotsInterval);
      setTypingText('');
      setTypingDots('');
      setLoadingLabel('');
    };
  }, [message?.id, message?.type, message?._meta?.expectedText]);

  const formatTextToElements = (txt) => {
    if (!txt) return null;
    // sanitize input text early
    const sanitized = escapeHtml(txt);
    // Normalize line endings
    const blocks = txt.split(/\n\n+/);
    return blocks.map((block, idx) => {
      const lines = block.split(/\n/).map((l) => l.trim()).filter(Boolean);

      // If all lines are list items (start with • or -)
      const isList = lines.every((l) => l.startsWith("•") || l.startsWith("-"));
      if (isList) {
        return (
          <ul key={idx} className="list-disc list-inside text-sm mb-2">
            {lines.map((l, i) => (
              <li key={i} className="leading-relaxed">{renderInline(l.replace(/^•\s?|-\s?/, ""))}</li>
            ))}
          </ul>
        );
      }

      // Header line like: 🧮 **MATEMATIKA & ANALISIS**
      const firstLine = lines[0] || "";
      const headerMatch = firstLine.match(/^(.*?)?\s*\*\*(.+?)\*\*/);
      if (headerMatch) {
        const emoji = headerMatch[1] ? headerMatch[1].trim() : "";
        const headerText = headerMatch[2];
        const rest = lines.slice(1).join("\n");
        return (
          <div key={idx} className="mb-2">
            <div className="text-sm font-semibold flex items-center gap-2">{emoji && <span>{emoji}</span>}<span>{headerText}</span></div>
            {rest && <p className="text-sm mt-1">{renderInline(rest)}</p>}
          </div>
        );
      }

      // Fallback paragraph
      return (
        <p key={idx} className="text-sm mb-2 leading-relaxed">
          {lines.map((ln, i) => (
            <span key={i}>{renderInline(ln)}{i < lines.length - 1 && <br />}</span>
          ))}
        </p>
      );
    });
  };

  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const handleCopy = async () => {
    try {
      const text = message?.text || "";
      await navigator.clipboard.writeText(text);
      setCopied(true);
      // Dispatch global event so parent window can show a toast
      try {
        window.dispatchEvent(new CustomEvent('saipul_copy', { detail: { text: 'Tersalin' } }));
      } catch (e) {
        // ignore
      }
      setTimeout(() => setCopied(false), 1600);
    } catch (e) {
      console.error('Copy failed', e);
    }
  };

  const handlePlayPause = () => {
    try {
      if (isPlaying) {
        window.dispatchEvent(new Event('saipul_pause_message'));
        setIsPlaying(false);
      } else {
        window.dispatchEvent(new CustomEvent('saipul_play_message', { detail: { id: message.id } }));
        setIsPlaying(true);
      }
    } catch (e) { console.error('playpause', e); }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} my-2`}
    >
      <div
        className={`saipul-chat-message px-4 py-2 rounded-lg max-w-[92%] sm:max-w-[80%] break-words shadow-md selection:bg-slate-200 selection:text-slate-900 ${isUser ? "rounded-br-none" : "rounded-bl-none"}`} style={{
          background: isUser ? 'var(--saipul-accent)' : 'var(--saipul-surface)',
          color: isUser ? 'var(--saipul-surface)' : 'var(--saipul-text)'
        }}>
        {/* intent indicator for user messages */}
        {isUser && message?.intent && (
          <div className="text-[10px] opacity-90 mb-1 flex justify-end">
            <span className="px-2 py-0.5 rounded-full" style={{ background: 'rgba(0,0,0,0.12)', color: 'var(--saipul-surface)' }}>
              {typeof message.intent === 'object' 
                ? (message.intent.type || message.intent.intent || 'MESSAGE').toUpperCase() 
                : String(message.intent).toUpperCase()}
              {message.intent && typeof message.intent === 'object' && message.intent.confidence !== undefined ? ` • ${Math.round((message.intent.confidence||0)*100)}%` : ''}
            </span>
          </div>
        )}

        {isUser && message?._meta?.progress > 0 && message?._meta?.progress < 100 && (
          <div className="text-[10px] opacity-70 mb-1 flex justify-end">
            <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
              Uploading: {Math.round(message._meta.progress)}%
            </span>
          </div>
        )}
        {message && message.type === 'typing' ? (
          <div className="text-sm mb-2 leading-relaxed">
            <div className="flex items-center gap-2 mb-2">
              <MultiLoadingAnimation type={loadingAnimationType} />
              <div className="text-sm text-gray-400">{loadingLabel}</div>
            </div>
            <div className="whitespace-pre-wrap mt-2">{renderInline(typingText || '…')}</div>
          </div>
        ) : (
          (hiddenByReports ? (
            <div className="p-3 bg-gray-800 rounded-md">
              <div className="text-sm text-yellow-300 font-semibold mb-2">⚠️ Pesan ini dibatasi karena dilaporkan</div>
              <div className="text-xs text-gray-300 mb-2">Laporan: {reportCount} • Severity: {reportSeverity || 'n/a'} • Kategori: {reportCategories.join(', ') || 'n/a'}</div>
              <div className="flex gap-2">
                <button onClick={() => setHiddenByReports(false)} className="px-2 py-1 rounded bg-gray-700 text-sm text-white">Tampilkan isi</button>
                <button onClick={() => handleQuickAction('report_view_context', message.id)} className="px-2 py-1 rounded bg-red-600 text-sm text-white">Laporkan lagi / Lihat</button>
              </div>
            </div>
          ) : (
            <>
              {/* TOP TRANSPARENCY BAR & COLLAPSIBLE THINKING PANEL FOR BOT MESSAGES */}
              {!isUser && transparency && (
                <div className="mb-2">
                  <div className="flex items-center justify-between gap-1.5 pb-1.5 border-b border-white/10 text-[11px]">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {/* Badge Sumber */}
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-medium">
                        <span>{transparency.icon}</span>
                        <span>{transparency.label}</span>
                      </span>

                      {/* Badge Keyakinan (Confidence) */}
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border font-medium ${
                        transparency.percent >= 75
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          : transparency.percent >= 50
                          ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                          : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                      }`}>
                        <span>🎯</span>
                        <span>{transparency.percent}% Yakin</span>
                      </span>
                    </div>

                    {/* Tombol Toggle Analisis */}
                    <button
                      type="button"
                      onClick={() => setShowAnalysis(!showAnalysis)}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition-all border border-white/10 active:scale-95 cursor-pointer ml-auto"
                      title="Lihat proses berpikir dan transparansi AI"
                      aria-label="Lihat proses berpikir AI"
                    >
                      <Sparkles size={11} className="text-cyan-400" />
                      <span className="hidden sm:inline font-medium">{showAnalysis ? "Tutup" : "Proses Analisis"}</span>
                      <span className="sm:hidden font-medium">{showAnalysis ? "Tutup" : "Analisis"}</span>
                      {showAnalysis ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                    </button>
                  </div>

                  {/* Collapsible Panel Analisis */}
                  <AnimatePresence>
                    {showAnalysis && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, y: -4 }}
                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -4 }}
                        transition={{ duration: 0.2 }}
                        className="mb-2.5 p-2.5 rounded-lg bg-black/40 border border-cyan-500/30 text-xs text-gray-200 space-y-2 overflow-hidden shadow-inner backdrop-blur-sm"
                      >
                        <div className="flex items-center justify-between font-semibold text-cyan-300 text-[11px] border-b border-white/10 pb-1.5">
                          <span className="flex items-center gap-1.5">
                            <Cpu size={12} className="text-cyan-400" />
                            <span>Transparansi & Logika Jawaban</span>
                          </span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/20">
                            Client-Side NLU
                          </span>
                        </div>

                        {/* 1. Sumber Data */}
                        <div className="space-y-0.5">
                          <div className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Sumber Data</div>
                          <div className="text-gray-200 text-[11px] leading-relaxed bg-white/5 p-1.5 rounded border border-white/5">
                            {transparency.description}
                          </div>
                        </div>

                        {/* 2. Metode Penalaran */}
                        <div className="space-y-0.5">
                          <div className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Metode Penalaran</div>
                          <div className="text-gray-200 text-[11px] leading-relaxed bg-white/5 p-1.5 rounded border border-white/5">
                            {transparency.method}
                          </div>
                        </div>

                        {/* 3. Skor Keyakinan Bar */}
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="text-gray-400 font-semibold uppercase tracking-wider">Tingkat Keyakinan (Confidence)</span>
                            <span className={`font-semibold ${
                              transparency.percent >= 75 ? 'text-emerald-400' : transparency.percent >= 50 ? 'text-amber-400' : 'text-rose-400'
                            }`}>
                              {transparency.percent}%
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-700/60 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                transparency.percent >= 75 ? 'bg-gradient-to-r from-emerald-500 to-cyan-400' : transparency.percent >= 50 ? 'bg-gradient-to-r from-amber-500 to-yellow-400' : 'bg-gradient-to-r from-rose-500 to-red-400'
                              }`}
                              style={{ width: `${transparency.percent}%` }}
                            />
                          </div>
                        </div>

                        {/* 4. Tone / Konsep Terkait */}
                        {(transparency.emotion || (transparency.relatedConcepts && transparency.relatedConcepts.length > 0)) && (
                          <div className="text-[10px] text-gray-300 pt-1 border-t border-white/10 flex flex-wrap gap-1.5">
                            {transparency.emotion && (
                              <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                🎭 Nada: {transparency.emotion}
                              </span>
                            )}
                            {transparency.character && (
                              <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                                💼 Karakter: {transparency.character}
                              </span>
                            )}
                            {transparency.relatedConcepts.slice(0, 3).map((concept, i) => (
                              <span key={i} className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                                🏷️ {concept}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* 5. Jaminan Privasi */}
                        <div className="pt-1 border-t border-white/5 flex items-center gap-1 text-[10px] text-emerald-400">
                          <ShieldCheck size={11} className="flex-shrink-0" />
                          <span>Privasi: Diproses 100% lokal di browser Anda (tanpa data dilempar ke cloud pihak ketiga)</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
              {formatTextToElements(message?.text)}
            </>
          ))
        )}
        <span className="block text-xs mt-1 text-right opacity-70">
                {message?.timestamp ? new Date(message.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }) : ""}
        </span>
        
        {/* Action Buttons for items like Live CS */}
        {message && message.action === 'suggest_live_cs' && (
          <div className="mt-4 pt-3 border-t border-white/10 flex flex-col gap-2">
            <button
              onClick={() => {
                // Gunakan event navigasi kustom agar tidak reload halaman (SPA Navigation)
                window.dispatchEvent(new CustomEvent('saipul_navigate', { 
                  detail: { path: LIVE_CS_PATH } 
                }));
              }}
              className={`w-full py-2.5 px-4 rounded-lg font-semibold text-sm transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 ${
                isAgentOnline 
                ? "bg-cyan-500 hover:bg-cyan-600 text-white shadow-cyan-500/20" 
                : "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20"
              }`}
            >
              {isAgentOnline ? (
                <><User size={16} /> Hubungi Agen Sekarang</>
              ) : (
                <><MessageSquare size={16} /> Tinggalkan Pesan di Room</>
              )}
            </button>
            <div className="flex items-center justify-between px-1">
              <p className="text-[9px] opacity-70 italic">Senin–Jumat: 09:00–17:00</p>
              <div className="flex items-center gap-1">
                <div className={`w-1.5 h-1.5 rounded-full ${isAgentOnline ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`} />
                <span className="text-[9px] font-medium opacity-80">{isAgentOnline ? 'Agen Online' : 'Agen Offline'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Actionable Quick Chips for Navigation */}
        {!isUser && message?.actionChips && message.actionChips.length > 0 && (
          <div className="mt-3 pt-2.5 border-t border-white/10 flex flex-wrap gap-1.5">
            {message.actionChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (chip.path) {
                    window.dispatchEvent(new CustomEvent('saipul_navigate', { detail: { path: chip.path } }));
                  } else if (chip.action && typeof handleQuickAction === 'function') {
                    handleQuickAction(chip.action, message.id, chip);
                  }
                }}
                className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 border border-cyan-400/30 text-xs font-medium transition-all flex items-center gap-1 active:scale-95 shadow-sm"
              >
                {chip.icon && <span>{chip.icon}</span>}
                <span>{chip.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex gap-2 mt-2">
          {/* Delete available for both user and bot messages */}
          <button
            onClick={() => handleQuickAction("delete", message.id)}
            className="saipul-action-btn p-1 rounded-full"
            title="Hapus"
            aria-label="Hapus pesan"
          >
            <Trash size={16} />
          </button>

          {!isUser && (
            <>
              <button
                onClick={handleCopy}
                className="saipul-action-btn p-1 rounded-full"
                title="Salin"
                aria-label="Salin teks pesan"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
              <button
                onClick={handlePlayPause}
                className="saipul-action-btn p-1 rounded-full"
                title={isPlaying ? 'Pause' : 'Play'}
                aria-label={isPlaying ? 'Pause audio pesan' : 'Play audio pesan'}
              >
                {isPlaying ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
              <button
                onClick={() => handleQuickAction("like", message.id)}
                className="saipul-action-btn p-1 rounded-full"
                title="Like"
              >
                <ThumbsUp size={16} />
              </button>
              <button
                onClick={() => handleQuickAction("dislike", message.id)}
                className="saipul-action-btn p-1 rounded-full"
                title="Dislike"
              >
                <ThumbsDown size={16} />
              </button>
              <button
                onClick={() => handleQuickAction("regenerate", message.id)}
                className="saipul-action-btn p-1 rounded-full"
                title="Regenerate"
              >
                <RefreshCw size={16} />
              </button>
              <button
                onClick={openReportModal}
                className="saipul-action-btn p-1 rounded-full"
                title="Report"
              >
                <Flag size={16} />
              </button>
              {message && message._meta && message._meta.altGroup && (
                <button
                  onClick={() => handleQuickAction('prefer_response', message.id, { altGroup: message._meta.altGroup })}
                  className="saipul-action-btn p-1 rounded-full"
                  title="Saya lebih suka ini"
                >
                  <Check size={16} />
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Report Modal */}
      <ReportModal
        open={isReportModalOpen}
        onClose={closeReportModal}
        onSubmit={(payload) => {
          try {
            // ensure messageId attached
            const p = { ...payload, messageId: message.id };
            window.dispatchEvent(new CustomEvent('saipul_chat_report', { detail: p }));
          } catch (e) { console.error('Failed to dispatch saipul_chat_report', e); }
          closeReportModal();
        }}
        messageId={message.id}
      />
    </motion.div>
  );
}