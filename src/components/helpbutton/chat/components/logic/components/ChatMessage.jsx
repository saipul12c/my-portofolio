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
  ShieldCheck,
  Globe
} from "lucide-react";
import ReportModal from "./ReportModal";
import { useState, useEffect, useCallback } from "react";
import { MultiLoadingAnimation } from "./LoadingAnimations";
import { LIVE_CS_PATH } from "../../../config.js";

// Helper untuk menguraikan alur berpikir & penalaran asisten AI yang alami dan ramah pengguna
function getTransparencyInfo(message, isEnglish = false) {
  const meta = message?._meta || {};
  const rawSource = meta.source || null;
  const rawConf = typeof meta.confidence === 'number' ? meta.confidence : null;

  let sourceType = 'nlu';
  if (typeof rawSource === 'string') {
    sourceType = rawSource.toLowerCase();
  } else if (rawSource && typeof rawSource === 'object') {
    sourceType = (rawSource.type || rawSource.category || 'knowledge_base').toLowerCase();
  }

  // Format emosi / nada bahasa yang aman (mencegah [object Object])
  let formattedEmotion = isEnglish ? 'Friendly & Helpful' : 'Ramah & Solutif';
  const rawEmotion = message?.emotion?.primary || message?.emotion || null;
  if (rawEmotion && typeof rawEmotion === 'object') {
    formattedEmotion = rawEmotion.primary || rawEmotion.name || (isEnglish ? 'Friendly & Helpful' : 'Ramah & Solutif');
  } else if (typeof rawEmotion === 'string' && rawEmotion.trim()) {
    formattedEmotion = rawEmotion.trim();
  }
  const emotionMap = isEnglish ? {
    'friendly': 'Friendly & Welcoming',
    'professional': 'Professional',
    'helpful': 'Helpful & Informative',
    'curious': 'Curious & Engaging',
    'polite': 'Polite & Courteous',
    'neutral': 'Informative',
    'empathetic': 'Empathetic & Caring'
  } : {
    'friendly': 'Ramah & Bersahabat',
    'professional': 'Profesional',
    'helpful': 'Solutif & Informatif',
    'curious': 'Antusias',
    'polite': 'Sopan & Santun',
    'neutral': 'Informatif',
    'empathetic': 'Empati & Peduli'
  };
  formattedEmotion = emotionMap[formattedEmotion.toLowerCase()] || formattedEmotion;

  let label = isEnglish ? 'Knowledge Base' : 'Basis Pengetahuan';
  let icon = '🧠';
  let defaultConf = 0.92;
  let stepUnderstand = isEnglish ? 'Analyzing user topic and query intent.' : 'Menganalisis topik dan maksud kueri pengguna.';
  let stepSearch = isEnglish ? 'Scanning the most relevant information from verified portfolio databases.' : 'Menelusuri informasi yang paling relevan dari basis data portofolio resmi.';
  let stepFormulate = isEnglish ? 'Structuring an accurate, informative, and clear response.' : 'Menyusun respon yang akurat, informatif, dan mudah dipahami.';

  switch (sourceType) {
    case 'faq':
      label = isEnglish ? 'Q&A (FAQ)' : 'Tanya Jawab (FAQ)';
      icon = '❓';
      stepUnderstand = isEnglish ? 'Recognizing questions regarding portfolio profile and professional commitments.' : 'Mengenali pertanyaan seputar profil, keahlian, dan komitmen profesional.';
      stepSearch = isEnglish ? 'Matching details against verified FAQ items and core dedication pillars.' : 'Mencocokkan informasi dari dokumentasi tanya jawab dan pilar komitmen resmi.';
      stepFormulate = isEnglish ? 'Displaying verified answers with clear references.' : 'Menampilkan jawaban terverifikasi dengan rujukan yang jelas.';
      defaultConf = 0.95;
      break;
    case 'calculator':
      label = isEnglish ? 'Smart Calculator' : 'Kalkulator Cerdas';
      icon = '🧮';
      stepUnderstand = isEnglish ? 'Detecting mathematical expressions and formulas.' : 'Mendeteksi ekspresi perhitungan dan rumus matematis.';
      stepSearch = isEnglish ? 'Verifying numerical parameters and rules of arithmetic.' : 'Memverifikasi parameter angka dan kaidah operasi perhitungan.';
      stepFormulate = isEnglish ? 'Executing precision calculations.' : 'Melakukan kalkulasi presisi dan menyajikan hasil perhitungan.';
      defaultConf = 0.99;
      break;
    case 'conversion':
      label = isEnglish ? 'Unit Converter' : 'Konversi Satuan';
      icon = '📐';
      stepUnderstand = isEnglish ? 'Identifying initial values and units.' : 'Mengidentifikasi besaran nilai dan unit satuan awal.';
      stepSearch = isEnglish ? 'Applying standard metric and conversion coefficients.' : 'Menyesuaikan faktor konversi satuan metrik & standar internasional.';
      stepFormulate = isEnglish ? 'Displaying accurate conversion results.' : 'Menghitung hasil konversi dan menyajikannya secara akurat.';
      defaultConf = 0.99;
      break;
    case 'rag':
    case 'uploaded_file':
      label = isEnglish ? 'Document Analysis' : 'Analisis Dokumen';
      icon = '📚';
      stepUnderstand = isEnglish ? 'Reading query context regarding attached documents or files.' : 'Membaca konteks pertanyaan terkait dokumen atau file yang dilampirkan.';
      stepSearch = isEnglish ? 'Scanning the most relevant document segments.' : 'Menelusuri bagian teks dokumen yang paling relevan dengan topik.';
      stepFormulate = isEnglish ? 'Summarizing findings into a clear response.' : 'Menyimpulkan isi dokumen ke dalam ringkasan jawaban.';
      defaultConf = 0.90;
      break;
    case 'project':
    case 'projects':
      label = isEnglish ? 'Project Showcase' : 'Portofolio Proyek';
      icon = '🚀';
      stepUnderstand = isEnglish ? 'Detecting queries about projects, software, and tech stack.' : 'Mendeteksi pertanyaan mengenai proyek, karya, dan teknologi.';
      stepSearch = isEnglish ? 'Accessing web engineering catalogs and project demos.' : 'Mengakses katalog rekayasa web, teknologi, dan showcase proyek.';
      stepFormulate = isEnglish ? 'Describing architecture, tech stack, and links.' : 'Menyajikan deskripsi proyek, teknologi yang digunakan, dan informasi terkait.';
      defaultConf = 0.92;
      break;
    case 'certificate':
    case 'certificates':
      label = isEnglish ? 'Official Certifications' : 'Sertifikasi Resmi';
      icon = '🏆';
      stepUnderstand = isEnglish ? 'Detecting queries about licenses and credentials.' : 'Mendeteksi kueri tentang sertifikasi, lisensi, dan piagam.';
      stepSearch = isEnglish ? 'Reviewing competency certificates and issuing institutions.' : 'Menelusuri arsip sertifikasi kompetensi dan lembaga penerbit resmi.';
      stepFormulate = isEnglish ? 'Detailing credential records and certifications.' : 'Menampilkan rincian kredensial dan bidang keahlian resmi.';
      defaultConf = 0.92;
      break;
    case 'skill':
    case 'softskill':
    case 'skills':
      label = isEnglish ? 'Skills & Competencies' : 'Keahlian & Skill';
      icon = '🌟';
      stepUnderstand = isEnglish ? 'Analyzing queries about technical and soft skills.' : 'Menganalisis pertanyaan terkait kompetensi dan soft skills.';
      stepSearch = isEnglish ? 'Retrieving interpersonal and full-stack engineering proficiency.' : 'Mengambil profil keahlian interpersonal dan penguasaan teknis.';
      stepFormulate = isEnglish ? 'Summarizing skill depth and real-world application.' : 'Merangkum tingkat keahlian dan implementasi praktisnya.';
      defaultConf = 0.90;
      break;
    case 'ai_identity':
    case 'ai_capabilities':
    case 'ai_creator':
      label = isEnglish ? 'SaipulAI Profile' : 'Profil SaipulAI';
      icon = '🤖';
      stepUnderstand = isEnglish ? 'Recognizing questions about SaipulAI identity and features.' : 'Mengenali pertanyaan seputar identitas dan kapabilitas SaipulAI.';
      stepSearch = isEnglish ? 'Loading system capabilities and guidelines.' : 'Memuat spesifikasi fungsi dan panduan asisten virtual.';
      stepFormulate = isEnglish ? 'Greeting user and describing assistive functions.' : 'Menyapa pengguna dan menjelaskan bantuan yang dapat diberikan.';
      defaultConf = 0.95;
      break;
    case 'time':
      label = isEnglish ? 'Global Time' : 'Waktu Global';
      icon = '🕒';
      stepUnderstand = isEnglish ? 'Detecting time or timezone requests.' : 'Mendeteksi permintaan waktu atau zona wilayah.';
      stepSearch = isEnglish ? 'Adjusting local system time references and standard time zones.' : 'Menyesuaikan referensi waktu sistem lokal dan standar zona waktu.';
      stepFormulate = isEnglish ? 'Displaying accurate date and time information.' : 'Menampilkan informasi tanggal dan jam secara akurat.';
      defaultConf = 0.98;
      break;
    case 'policy':
    case 'reported':
    case 'throttle':
      label = isEnglish ? 'Safety Guidelines' : 'Panduan Keamanan';
      icon = '🛡️';
      stepUnderstand = isEnglish ? 'Checking content compliance with ethics and privacy standards.' : 'Memeriksa kesesuaian konten dengan standar etika dan privasi.';
      stepSearch = isEnglish ? 'Applying sensitive data protection filters.' : 'Menerapkan filter perlindungan data sensitif.';
      stepFormulate = isEnglish ? 'Providing safe, policy-compliant guidance.' : 'Menyampaikan saran interaksi yang aman dan sesuai kebijakan.';
      defaultConf = 0.95;
      break;
    case 'live_cs':
    case 'live_cs_referral':
    case 'live_cs_direct':
      label = isEnglish ? 'Live Support' : 'Dukungan Langsung';
      icon = '🎧';
      stepUnderstand = isEnglish ? 'Detecting consultation or personal assistance needs.' : 'Mendeteksi kebutuhan konsultasi atau bantuan personal.';
      stepSearch = isEnglish ? 'Checking live discussion room status and agent availability.' : 'Memeriksa status ketersediaan ruang diskusi dan agen manusia.';
      stepFormulate = isEnglish ? 'Providing direct guidance to connect to live conversation.' : 'Menyediakan panduan langsung untuk terhubung ke sesi percakapan.';
      defaultConf = 0.95;
      break;
    default:
      label = isEnglish ? 'AI Reasoning' : 'Penalaran AI';
      icon = '💡';
      stepUnderstand = isEnglish ? 'Understanding query context and input keywords.' : 'Memahami konteks pertanyaan dan kata kunci yang Anda masukkan.';
      stepSearch = isEnglish ? 'Retrieving optimal references from portfolio knowledge base.' : 'Mencari referensi terbaik dari basis pengetahuan portofolio.';
      stepFormulate = isEnglish ? 'Structuring clear and relevant information.' : 'Menyusun informasi yang relevan dan siap dibaca.';
      defaultConf = 0.88;
      break;
  }

  const confidence = rawConf !== null ? rawConf : defaultConf;
  const percent = Math.min(100, Math.max(10, Math.round(confidence * 100)));

  return {
    label,
    icon,
    stepUnderstand,
    stepSearch,
    stepFormulate,
    percent,
    emotion: formattedEmotion
  };
}

export function ChatMessage({ message, handleQuickAction, isAgentOnline }) {
  const isUser = message?.from === "user";
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showAlt, setShowAlt] = useState(false);

  // Resolusi data multi-bahasa & teks alternatif (terjemahan)
  const altData = message?.alternatives || message?._meta?.alternatives;
  const messageLang = message?.language || message?._meta?.language || 'id';
  const altText = altData ? (messageLang === 'en' ? (altData.indonesian || altData.id) : (altData.english || altData.en)) : null;
  const displayedText = (showAlt && altText) ? altText : (message?.text || '');
  const activeLangNow = showAlt ? (messageLang === 'en' ? 'id' : 'en') : messageLang;
  const isEnglish = activeLangNow === 'en';
  const transparency = !isUser ? getTransparencyInfo(message, isEnglish) : null;

  const [reportCount, setReportCount] = useState(0);
  const [reportSeverity, setReportSeverity] = useState(null);
  const [reportCategories, setReportCategories] = useState([]);
  const [hiddenByReports, setHiddenByReports] = useState(false);
  const [isReportModalOpen, setReportModalOpen] = useState(false);
  const [typingText, setTypingText] = useState('');
  const [loadingLabel, setLoadingLabel] = useState('');
  const [loadingAnimationType, setLoadingAnimationType] = useState('thinking');

  const openReportModal = () => setReportModalOpen(true);
  const closeReportModal = () => setReportModalOpen(false);

  // compute report summary for this message (best-effort match by messageId or snippet overlap)
  const computeReportSummary = useCallback(() => {
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
    } catch {
      setReportCount(0); setReportSeverity(null); setReportCategories([]);
    }
  }, [message]);

  useEffect(() => {
    computeReportSummary();
    const onStorage = (e) => {
      if (e && e.key === 'saipul_chat_reports') computeReportSummary();
    };
    const onCustom = () => { try { computeReportSummary(); } catch { /* ignore */ } };
    window.addEventListener('storage', onStorage);
    window.addEventListener('saipul_chat_report', onCustom);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('saipul_chat_report', onCustom);
    };
  }, [computeReportSummary]);

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

    // loading label rotator
    const variants = Array.isArray(message._meta.loadingVariants) && message._meta.loadingVariants.length > 0 ? message._meta.loadingVariants : ['Memikirkan...'];
    let dotCount = 0;
    let labelIndex = 0;
    const dotsInterval = setInterval(() => {
      dotCount = (dotCount + 1) % 4;
      if (dotCount === 0) {
        labelIndex = (labelIndex + 1) % variants.length;
        setLoadingLabel(variants[labelIndex]);
      }
    }, 400);

    return () => {
      clearInterval(charInterval);
      clearInterval(dotsInterval);
      setTypingText('');
      setLoadingLabel('');
    };
  }, [message]);

  const formatTextToElements = (txt) => {
    if (!txt) return null;
    // Normalize Windows/Unix line endings
    const normalized = String(txt).replace(/\r\n/g, '\n');
    const blocks = normalized.split(/\n\n+/);
    return blocks.map((block, idx) => {
      const lines = block.split(/\n/).map((l) => l.trim()).filter(Boolean);
      if (lines.length === 0) return null;

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

      // Header line like: 🧮 **MATEMATIKA & ANALISIS** or **Judul:** Isi berikutnya
      const firstLine = lines[0] || "";
      const headerMatch = firstLine.match(/^(.*?)?\s*\*\*(.+?)\*\*(.*)/s);
      if (headerMatch) {
        const emoji = headerMatch[1] ? headerMatch[1].trim() : "";
        const headerText = headerMatch[2];
        const restOfFirstLine = (headerMatch[3] || "").trim();
        const otherLines = lines.slice(1);
        const allRestLines = [restOfFirstLine, ...otherLines].filter(Boolean);

        return (
          <div key={idx} className="mb-2.5">
            <div className="text-sm font-semibold flex items-center gap-2 text-white">
              {emoji && <span>{emoji}</span>}
              <span>{headerText}</span>
            </div>
            {allRestLines.length > 0 && (
              <div className="text-sm mt-1 leading-relaxed opacity-95">
                {allRestLines.map((ln, i) => (
                  <span key={i}>
                    {renderInline(ln)}
                    {i < allRestLines.length - 1 && <br />}
                  </span>
                ))}
              </div>
            )}
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
      const text = displayedText || message?.text || "";
      await navigator.clipboard.writeText(text);
      setCopied(true);
      // Dispatch global event so parent window can show a toast
      try {
        window.dispatchEvent(new CustomEvent('saipul_copy', { detail: { text: activeLangNow === 'en' ? 'Copied' : 'Tersalin' } }));
      } catch {
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
        window.dispatchEvent(new CustomEvent('saipul_play_message', { 
          detail: { 
            id: message.id, 
            text: displayedText || message.text, 
            lang: activeLangNow 
          } 
        }));
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
        className={`saipul-chat-message px-4 py-2.5 rounded-2xl max-w-[92%] sm:max-w-[80%] break-words shadow-md selection:bg-slate-200 selection:text-slate-900 ${isUser ? "rounded-br-sm" : "rounded-bl-sm"}`} style={{
          background: isUser ? 'var(--saipul-accent)' : 'var(--saipul-surface)',
          color: isUser ? 'var(--saipul-surface)' : 'var(--saipul-text)'
        }}>

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
                <button onClick={openReportModal} className="px-2 py-1 rounded bg-red-600 text-sm text-white">Laporkan lagi / Lihat</button>
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
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-medium">
                        <span>{transparency.icon}</span>
                        <span>{transparency.label}</span>
                      </span>

                      {/* Badge Keyakinan (Confidence) */}
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border font-medium ${
                        transparency.percent >= 75
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          : transparency.percent >= 50
                          ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                          : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                      }`}>
                        <span>🎯</span>
                        <span>{transparency.percent >= 80 ? 'Sangat Relevan' : `${transparency.percent}% Relevan`}</span>
                      </span>

                      {/* Badge Bahasa Aktif */}
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-medium text-[10px]">
                        <span>🌐</span>
                        <span>{activeLangNow === 'en' ? 'EN' : 'ID'}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 ml-auto">
                      {/* Tombol Terjemahan Bilingual jika tersedia */}
                      {altText && (
                        <button
                          type="button"
                          onClick={() => setShowAlt(!showAlt)}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 border border-blue-400/30 transition-all active:scale-95 cursor-pointer font-medium"
                          title={showAlt ? (isEnglish ? "Back to original text" : "Kembali ke teks asli") : (messageLang === 'en' ? "Terjemahkan ke Bahasa Indonesia" : "Translate to English")}
                        >
                          <Globe size={11} className="text-blue-300" />
                          <span>{showAlt ? (messageLang === 'en' ? 'Original (EN)' : 'Asli (ID)') : (messageLang === 'en' ? '🇮🇩 Terjemahan' : '🇬🇧 English')}</span>
                        </button>
                      )}

                      {/* Tombol Toggle Alur Berpikir */}
                      <button
                        type="button"
                        onClick={() => setShowAnalysis(!showAnalysis)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition-all border border-white/10 active:scale-95 cursor-pointer"
                        title={isEnglish ? "View AI reasoning and thinking flow" : "Lihat alur berpikir dan penalaran AI"}
                        aria-label={isEnglish ? "View AI reasoning" : "Lihat alur berpikir AI"}
                      >
                        <Sparkles size={11} className="text-cyan-400" />
                        <span className="font-medium">{showAnalysis ? (isEnglish ? "Close" : "Tutup") : (isEnglish ? "Reasoning Flow" : "Alur Berpikir")}</span>
                        {showAnalysis ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                      </button>
                    </div>
                  </div>

                  {/* Collapsible Panel Alur Berpikir Cerdas */}
                  <AnimatePresence>
                    {showAnalysis && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, y: -4 }}
                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -4 }}
                        transition={{ duration: 0.2 }}
                        className="mb-3 p-3 rounded-xl bg-slate-950/85 border border-cyan-500/30 text-xs text-slate-200 space-y-2.5 overflow-hidden shadow-xl backdrop-blur-md"
                      >
                        <div className="flex items-center justify-between font-semibold text-cyan-300 text-xs border-b border-white/10 pb-2">
                          <span className="flex items-center gap-1.5">
                            <Sparkles size={13} className="text-cyan-400" />
                            <span>{isEnglish ? "AI Reasoning Process" : "Proses Penalaran AI"}</span>
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-medium">
                            {isEnglish ? "Smart Processing" : "Pemrosesan Cerdas"}
                          </span>
                        </div>

                        {/* 3 Langkah Penalaran Manusiawi */}
                        <div className="space-y-1.5 pt-0.5">
                          <div className="flex items-start gap-2.5 bg-white/5 p-2 rounded-xl border border-white/5">
                            <span className="text-sm select-none">💭</span>
                            <div>
                              <div className="font-semibold text-white text-[11px]">{isEnglish ? "1. Understanding Context" : "1. Memahami Konteks"}</div>
                              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                                {transparency.stepUnderstand}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-2.5 bg-white/5 p-2 rounded-xl border border-white/5">
                            <span className="text-sm select-none">🔍</span>
                            <div>
                              <div className="font-semibold text-white text-[11px]">{isEnglish ? "2. Searching Relevant Data" : "2. Menelusuri Data Relevan"}</div>
                              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                                {transparency.stepSearch}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-2.5 bg-white/5 p-2 rounded-xl border border-white/5">
                            <span className="text-sm select-none">✨</span>
                            <div>
                              <div className="font-semibold text-white text-[11px]">{isEnglish ? "3. Formulating Response" : "3. Menyusun Respon"}</div>
                              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                                {transparency.stepFormulate}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Status Kesesuaian & Gaya Bahasa */}
                        <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400">{isEnglish ? "Relevance:" : "Tingkat Kesesuaian:"}</span>
                            <span className="font-semibold text-cyan-300">
                              {transparency.percent >= 80 ? (isEnglish ? 'Highly Relevant' : 'Sangat Relevan') : `${transparency.percent}%`}
                            </span>
                          </div>
                          {transparency.emotion && (
                            <div className="flex items-center gap-1.5 text-slate-400">
                              <span>{isEnglish ? "Tone & Style:" : "Gaya Bahasa:"}</span>
                              <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-[10px] font-medium">
                                {transparency.emotion}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Jaminan Privasi */}
                        <div className="pt-1.5 border-t border-white/5 flex items-center gap-1.5 text-[10px] text-emerald-400">
                          <ShieldCheck size={12} className="flex-shrink-0" />
                          <span>{isEnglish ? "Privacy: Securely and privately processed in your browser." : "Privasi: Diproses secara aman & privat langsung di peramban Anda."}</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
              {/* TOP BAR UNTUK PESAN TANPA TRANSPARENCY TAPI MEMILIKI TERJEMAHAN */}
              {!isUser && !transparency && altText && (
                <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-white/10 text-[11px]">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-medium text-[10px]">
                    <span>🌐</span>
                    <span>{activeLangNow === 'en' ? 'EN' : 'ID'}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowAlt(!showAlt)}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 border border-blue-400/30 transition-all active:scale-95 cursor-pointer font-medium ml-auto"
                    title={showAlt ? "Kembali ke teks asli" : (messageLang === 'en' ? "Terjemahkan ke Bahasa Indonesia" : "Translate to English")}
                  >
                    <Globe size={11} className="text-blue-300" />
                    <span>{showAlt ? (messageLang === 'en' ? 'Asli (EN)' : 'Asli (ID)') : (messageLang === 'en' ? '🇮🇩 Terjemahan' : '🇬🇧 English')}</span>
                  </button>
                </div>
              )}
              {formatTextToElements(displayedText)}
              {message?.isStreaming && (
                <span 
                  aria-hidden="true" 
                  className="inline-block w-1.5 h-3.5 ml-1 bg-cyan-400 animate-pulse rounded-xs align-middle shadow-[0_0_8px_rgba(34,211,238,0.8)]" 
                />
              )}
            </>
          ))
        )}
        <span className="block text-xs mt-1 text-right opacity-70">
                {message?.isStreaming 
                  ? (activeLangNow === 'en' ? "Typing..." : "Sedang mengetik...") 
                  : (message?.timestamp ? new Date(message.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    }) : "")}
        </span>
        
        {/* Action Buttons for items like Live CS */}
        {!message?.isStreaming && message && message.action === 'suggest_live_cs' && (
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
        {!isUser && !message?.isStreaming && message?.actionChips && message.actionChips.length > 0 && (
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
        {!message?.isStreaming && (
        <div className="flex gap-2 mt-2">
          {/* Delete available for both user and bot messages */}
          <button
            onClick={() => handleQuickAction("delete", message.id)}
            className="saipul-action-btn p-1 rounded-full"
            title={activeLangNow === 'en' ? "Delete" : "Hapus"}
            aria-label={activeLangNow === 'en' ? "Delete message" : "Hapus pesan"}
          >
            <Trash size={16} />
          </button>

          {!isUser && (
            <>
              <button
                onClick={handleCopy}
                className="saipul-action-btn p-1 rounded-full"
                title={activeLangNow === 'en' ? "Copy" : "Salin"}
                aria-label={activeLangNow === 'en' ? "Copy message text" : "Salin teks pesan"}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
              <button
                onClick={handlePlayPause}
                className="saipul-action-btn p-1 rounded-full"
                title={isPlaying ? 'Pause' : (activeLangNow === 'en' ? 'Play audio' : 'Putar suara')}
                aria-label={isPlaying ? 'Pause audio pesan' : 'Play audio pesan'}
              >
                {isPlaying ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
              <button
                onClick={() => handleQuickAction("like", message.id)}
                className="saipul-action-btn p-1 rounded-full"
                title={activeLangNow === 'en' ? "Like" : "Suka"}
              >
                <ThumbsUp size={16} />
              </button>
              <button
                onClick={() => handleQuickAction("dislike", message.id)}
                className="saipul-action-btn p-1 rounded-full"
                title={activeLangNow === 'en' ? "Dislike" : "Tidak Suka"}
              >
                <ThumbsDown size={16} />
              </button>
              <button
                onClick={() => handleQuickAction("regenerate", message.id)}
                className="saipul-action-btn p-1 rounded-full"
                title={activeLangNow === 'en' ? "Regenerate" : "Buat Ulang"}
              >
                <RefreshCw size={16} />
              </button>
              <button
                onClick={openReportModal}
                className="saipul-action-btn p-1 rounded-full"
                title={activeLangNow === 'en' ? "Report" : "Laporkan"}
              >
                <Flag size={16} />
              </button>
              {message && message._meta && message._meta.altGroup && (
                <button
                  onClick={() => handleQuickAction('prefer_response', message.id, { altGroup: message._meta.altGroup })}
                  className="saipul-action-btn p-1 rounded-full"
                  title={activeLangNow === 'en' ? "I prefer this response" : "Saya lebih suka ini"}
                >
                  <Check size={16} />
                </button>
              )}
            </>
          )}
        </div>
        )}
      </div>

      {/* Report Modal */}
      {isReportModalOpen && (
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
      )}
    </motion.div>
  );
}