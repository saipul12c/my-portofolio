import { motion } from "framer-motion";
import { ThumbsUp, ThumbsDown, RefreshCw, Flag, Trash, Copy, Check } from "lucide-react";
import ReportModal from "./ReportModal";
import { useState } from "react";

export function ChatMessage({ message, handleQuickAction }) {
  const isUser = message.from === "user";
  const [isReportModalOpen, setReportModalOpen] = useState(false);

  const openReportModal = () => setReportModalOpen(true);
  const closeReportModal = () => setReportModalOpen(false);

  const renderInline = (text) => {
    if (!text) return null;
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, i) =>
      i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>
    );
  };

  const formatTextToElements = (txt) => {
    if (!txt) return null;
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} my-2`}
    >
      <div
        className={`saipul-chat-message px-4 py-2 rounded-lg max-w-[80%] sm:max-w-md break-words shadow-md selection:bg-slate-200 selection:text-slate-900 ${isUser ? "rounded-br-none" : "rounded-bl-none"}`} style={{
          background: isUser ? 'var(--saipul-accent)' : 'var(--saipul-surface)',
          color: isUser ? 'var(--saipul-surface)' : 'var(--saipul-text)'
        }}>
        {formatTextToElements(message?.text)}
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
          >
            <Trash size={16} />
          </button>

          {!isUser && (
            <>
              <button
                onClick={handleCopy}
                className="saipul-action-btn p-1 rounded-full"
                title="Salin"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
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
            </>
          )}
        </div>
      </div>

      {/* Report Modal */}
      <ReportModal
        open={isReportModalOpen}
        onClose={closeReportModal}
        onSubmit={(reason) => handleQuickAction("report", message.id, reason)}
        messageId={message.id}
      />
    </motion.div>
  );
}