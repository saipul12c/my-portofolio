import { useState, useRef, useEffect, memo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Sparkles,
  Bot,
  RefreshCcw,
  ArrowRight,
  TrendingUp,
  Zap
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useSoftSkillsAI } from "./hooks/useSoftSkillsAI";

const SoftSkillsAI = memo(({ isOpen, onClose, skills = [], initialQuery = "" }) => {
  const navigate = useNavigate();
  const {
    messages,
    isTyping,
    sendMessage,
    clearChat,
    suggestions
  } = useSoftSkillsAI(skills);

  const [inputQuery, setInputQuery] = useState("");
  const containerRef = useRef(null);
  const lastSentQueryRef = useRef("");

  const handleSend = (e) => {
    e?.preventDefault();
    if (!inputQuery.trim() || isTyping) return;
    sendMessage(inputQuery.trim());
    setInputQuery("");
  };

  // Trigger search if initialQuery is provided, but only once per unique query
  useEffect(() => {
    if (isOpen && initialQuery && initialQuery !== lastSentQueryRef.current) {
      sendMessage(initialQuery);
      lastSentQueryRef.current = initialQuery;
    }

    // Reset tracker if closed
    if (!isOpen) {
      lastSentQueryRef.current = "";
    }
  }, [isOpen, initialQuery, sendMessage]);

  // Scroll to results when opened
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        containerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const lastBotMessage = messages.filter((m) => m.from === "bot").pop();
  const lastUserMessage = messages.filter((m) => m.from === "user").pop();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, height: 0, marginBottom: 0 }}
          animate={{ opacity: 1, height: "auto", marginBottom: 48 }}
          exit={{ opacity: 0, height: 0, marginBottom: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="w-full max-w-5xl overflow-hidden"
        >
          <div className="w-full flex flex-col bg-[#061e18] border border-emerald-500/20 rounded-[2.5rem] shadow-[0_0_80px_rgba(16,185,129,0.1)] overflow-hidden">
            {/* Top Header Section */}
            <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-white/5 bg-[#082a22]">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-2.5 sm:p-3 rounded-2xl bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                  <Bot className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="flex flex-col">
                  <h2 className="text-lg sm:text-xl font-bold text-emerald-400">Asisten Cerdas Soft Skill</h2>
                  <span className="text-[11px] sm:text-xs text-emerald-500/60 font-medium italic">Didukung SaipulAI NLP Core</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Accuracy: High</span>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-all cursor-pointer"
                  aria-label="Tutup Asisten AI"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
            </div>

            {/* Chat Content */}
            <div className="px-6 sm:px-10 py-6 sm:py-8 space-y-8">
              {messages.length > 1 ? (
                <div className="space-y-8">
                  {/* Question Section */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-xs sm:text-sm font-bold text-emerald-500/70 uppercase tracking-widest">Input Anda:</span>
                    </div>
                    <div className="bg-[#082a22]/50 border border-white/5 rounded-2xl p-4 sm:p-6">
                      <p className="text-base sm:text-xl font-semibold text-white italic">
                        "{lastUserMessage?.text || messages[messages.length - 1]?.text}"
                      </p>
                    </div>
                  </div>

                  {/* Answer Section */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-xs sm:text-sm font-bold text-emerald-500/70 uppercase tracking-widest">Analisis AI:</span>
                    </div>
                    <div className="bg-[#082a22] border border-emerald-500/10 rounded-3xl p-6 sm:p-8 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                        <Sparkles className="w-32 h-32 text-emerald-400" />
                      </div>

                      {isTyping ? (
                        <div className="flex items-center gap-4 py-4">
                          <div className="flex gap-1.5">
                            <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1 }} className="w-2 h-2 bg-emerald-500 rounded-full" />
                            <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-2 h-2 bg-emerald-500 rounded-full" />
                            <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-2 h-2 bg-emerald-500 rounded-full" />
                          </div>
                          <p className="text-emerald-500 font-bold uppercase tracking-[0.3em] text-xs">Menganalisis Konteks...</p>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          <div className="text-gray-300 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              components={{
                                p: ({ children, className }) => <p className={`mb-4 last:mb-0 ${className || ''}`}>{children}</p>,
                                strong: ({ children, className }) => <strong className={`text-emerald-400 font-bold ${className || ''}`}>{children}</strong>,
                                ul: ({ children, className }) => <ul className={`list-disc pl-6 mb-4 space-y-1.5 ${className || ''}`}>{children}</ul>,
                                ol: ({ children, className }) => <ol className={`list-decimal pl-6 mb-4 space-y-1.5 ${className || ''}`}>{children}</ol>,
                                li: ({ children, className }) => <li className={`pl-1 ${className || ''}`}>{children}</li>,
                                blockquote: ({ children, className }) => <blockquote className={`border-l-4 border-emerald-500/30 pl-4 py-1 italic bg-emerald-500/5 rounded-r-lg ${className || ''}`}>{children}</blockquote>,
                              }}
                            >
                              {lastBotMessage?.text}
                            </ReactMarkdown>
                          </div>

                          {/* Actionable Quick Chips */}
                          {lastBotMessage?.relatedEntities && (
                            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/20 space-y-2">
                              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                                <Sparkles className="w-3.5 h-3.5" /> Eksplorasi Terkait Skill Ini:
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {lastBotMessage.relatedEntities.projects?.length > 0 && (
                                  <button
                                    onClick={() => navigate('/projects')}
                                    className="px-3 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                                  >
                                    💻 Proyek Terkait ({lastBotMessage.relatedEntities.projects.length})
                                  </button>
                                )}
                                {lastBotMessage.relatedEntities.blogs?.length > 0 && (
                                  <button
                                    onClick={() => navigate('/blog')}
                                    className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                                  >
                                    📚 Artikel Blog ({lastBotMessage.relatedEntities.blogs.length})
                                  </button>
                                )}
                                {lastBotMessage.relatedEntities.certificates?.length > 0 && (
                                  <button
                                    onClick={() => navigate('/sertifikat')}
                                    className="px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-400/30 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                                  >
                                    🎓 Sertifikasi ({lastBotMessage.relatedEntities.certificates.length})
                                  </button>
                                )}
                                {lastBotMessage.relatedEntities.testimonials?.length > 0 && (
                                  <button
                                    onClick={() => navigate('/testimoni')}
                                    className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                                  >
                                    ⭐ Testimoni ({lastBotMessage.relatedEntities.testimonials.length})
                                  </button>
                                )}
                                <button
                                  onClick={() => navigate('/Live-Discussion')}
                                  className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                                >
                                  💬 Diskusi di Live Chat
                                </button>
                              </div>
                            </div>
                          )}

                          <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-emerald-500/50 text-xs italic font-medium">
                              <Zap className="w-3 h-3" />
                              <span>Jawaban dihasilkan secara real-time berdasarkan NLP Core</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Dynamic Suggestions */}
                  {!isTyping && suggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-3"
                    >
                      <span className="text-[10px] font-bold text-emerald-500/40 uppercase tracking-widest pl-2">Lanjutkan Percakapan:</span>
                      <div className="flex flex-wrap gap-2.5">
                        {suggestions.map((suggestion, idx) => (
                          <button
                            key={idx}
                            onClick={() => sendMessage(suggestion)}
                            className="px-4 py-2 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 text-emerald-400 text-xs font-medium hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all flex items-center gap-2 group cursor-pointer"
                          >
                            {suggestion}
                            <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="w-14 h-14 rounded-3xl bg-emerald-500/10 flex items-center justify-center mb-4 relative">
                    <Bot className="w-7 h-7 text-emerald-500" />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute inset-0 bg-emerald-500/20 rounded-3xl"
                    />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1.5">Siap Menganalisis</h3>
                  <p className="text-emerald-500/60 max-w-sm text-xs leading-relaxed mb-5">
                    Tanyakan apapun tentang soft skill, tips pengembangan diri, atau rekomendasi kemampuan.
                  </p>

                  {suggestions.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-2 max-w-xl">
                      {suggestions.map((s, idx) => (
                        <button
                          key={idx}
                          onClick={() => sendMessage(s)}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs font-medium border border-emerald-500/20 transition-all hover:scale-105 cursor-pointer"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Interactive Input Form */}
              <form onSubmit={handleSend} className="relative flex items-center w-full pt-2">
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder="Ketik pertanyaan atau diskusikan skill lebih lanjut..."
                  disabled={isTyping}
                  className="w-full bg-[#082a22] border border-emerald-500/20 rounded-2xl pl-5 pr-12 py-3 text-xs sm:text-sm text-white placeholder-emerald-500/40 focus:border-emerald-400 focus:outline-none transition-all disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!inputQuery.trim() || isTyping}
                  className="absolute right-2 p-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white disabled:opacity-30 disabled:hover:bg-emerald-500 transition-all shadow-md cursor-pointer"
                  aria-label="Kirim pertanyaan"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Footer Bar */}
            <div className="px-6 sm:px-10 py-4 bg-[#041511] border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <p className="text-[10px] text-emerald-500/50 font-black uppercase tracking-widest">
                  SAIPULAI NLP v2.0 • CONTEXT-AWARE ENGINE
                </p>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={clearChat}
                  className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-500/40 hover:text-emerald-400 transition-colors uppercase tracking-[0.2em] cursor-pointer"
                >
                  <RefreshCcw className="w-3 h-3" />
                  Reset Sesi
                </button>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/5 border border-white/10">
                  <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] text-emerald-500/80 font-mono">CORE_ID: SP-SKILLS-01</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

SoftSkillsAI.displayName = "SoftSkillsAI";
export default SoftSkillsAI;
