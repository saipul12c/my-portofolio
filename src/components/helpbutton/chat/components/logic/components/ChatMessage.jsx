import { motion } from "framer-motion";
import { ThumbsUp, ThumbsDown, RefreshCw, Flag, Trash, Copy, Check, Volume2, VolumeX } from "lucide-react";
import ReportModal from "./ReportModal";
import { useState, useEffect } from "react";
import { MultiLoadingAnimation } from "./LoadingAnimations";

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

export function ChatMessage({ message, handleQuickAction }) {
  const isUser = message.from === "user";
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
  }, [message]);

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
              {typeof message.intent === 'object' && message.intent.type ? message.intent.type : String(message.intent)}
              {message.intent && typeof message.intent === 'object' && message.intent.confidence !== undefined ? ` • ${Math.round((message.intent.confidence||0)*100)}%` : ''}
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
          ) : formatTextToElements(message?.text))
        )}
        <span className="block text-xs mt-1 text-right opacity-70">
                {message?.timestamp ? new Date(message.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }) : ""}
        </span>

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