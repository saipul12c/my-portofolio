import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Search,
  Sparkles,
  Bot,
  RefreshCcw,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  MessageCircle,
  Zap
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useSoftSkillsAI } from "./hooks/useSoftSkillsAI";

export default function SoftSkillsAI({ isOpen, onClose, skills = [], initialQuery = "" }) {
  const {
    messages,
    isTyping,
    sendMessage,
    clearChat,
    suggestions
  } = useSoftSkillsAI(skills);

  const containerRef = useRef(null);
  const lastSentQueryRef = useRef("");

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
      setTimeout(() => {
        containerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 500);
    }
  }, [isOpen]);

  const lastBotMessage = messages.filter(m => m.from === 'bot').pop();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, height: 0, marginBottom: 0 }}
          animate={{ opacity: 1, height: "auto", marginBottom: 48 }}
          exit={{ opacity: 0, height: 0, marginBottom: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="w-full max-w-5xl overflow-hidden"
        >
          <div className="w-full flex flex-col bg-[#061e18] border border-emerald-500/20 rounded-[2.5rem] shadow-[0_0_80px_rgba(16,185,129,0.1)] overflow-hidden">
            {/* Top Header Section */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-white/5 bg-[#082a22]">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                  <Bot className="w-6 h-6" />
                </div>
                <div className="flex flex-col">
                  <h2 className="text-xl font-bold text-emerald-400">Asisten Cerdas Soft Skill</h2>
                  <span className="text-xs text-emerald-500/60 font-medium italic">Didukung SaipulAI NLP Core</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Accuracy: High</span>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Chat Content */}
            <div className="px-10 py-8 space-y-10">
              {messages.length > 1 ? (
                <div className="space-y-10">
                  {/* Question Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-sm font-bold text-emerald-500/70 uppercase tracking-widest">Input Anda:</span>
                    </div>
                    <div className="bg-[#082a22]/50 border border-white/5 rounded-2xl p-6">
                      <p className="text-xl font-semibold text-white italic">
                        "{messages[messages.length - 2]?.text}"
                      </p>
                    </div>
                  </div>

                  {/* Answer Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-sm font-bold text-emerald-500/70 uppercase tracking-widest">Analisis AI:</span>
                    </div>
                    <div className="bg-[#082a22] border border-emerald-500/10 rounded-3xl p-8 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
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
                          <div className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">
                            <ReactMarkdown 
                              remarkPlugins={[remarkGfm]}
                              components={{
                                p: ({node, ...props}) => <p className="mb-4 last:mb-0" {...props} />,
                                strong: ({node, ...props}) => <strong className="text-emerald-400 font-bold" {...props} />,
                                ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4 space-y-2" {...props} />,
                                ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4 space-y-2" {...props} />,
                                li: ({node, ...props}) => <li className="pl-1" {...props} />,
                                blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-emerald-500/30 pl-4 py-1 italic bg-emerald-500/5 rounded-r-lg" {...props} />,
                              }}
                            >
                              {lastBotMessage?.text}
                            </ReactMarkdown>
                          </div>
                          <div className="pt-4 border-t border-white/5 flex items-center justify-between">
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
                      className="space-y-4"
                    >
                      <span className="text-[10px] font-bold text-emerald-500/40 uppercase tracking-widest pl-2">Lanjutkan Percakapan:</span>
                      <div className="flex flex-wrap gap-3">
                        {suggestions.map((suggestion, idx) => (
                          <button
                            key={idx}
                            onClick={() => sendMessage(suggestion)}
                            className="px-5 py-2.5 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 text-emerald-400 text-sm font-medium hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all flex items-center gap-2 group"
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
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 flex items-center justify-center mb-6 relative">
                    <Bot className="w-10 h-10 text-emerald-500" />
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute inset-0 bg-emerald-500/20 rounded-3xl"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Siap Menganalisis</h3>
                  <p className="text-emerald-500/60 max-w-sm text-sm">Tanyakan apapun tentang soft skill, tips pengembangan diri, atau rekomendasi kemampuan.</p>
                </div>
              )}
            </div>

            {/* Footer Bar */}
            <div className="px-10 py-6 bg-[#041511] border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <p className="text-[10px] text-emerald-500/50 font-black uppercase tracking-widest">
                  SAIPULAI NLP v2.0 • CONTEXT-AWARE ENGINE
                </p>
              </div>

              <div className="flex items-center gap-6">
                <button
                  onClick={clearChat}
                  className="flex items-center gap-2 text-[10px] font-bold text-emerald-500/40 hover:text-emerald-400 transition-colors uppercase tracking-[0.2em]"
                >
                  <RefreshCcw className="w-3 h-3" />
                  Reset Sesi
                </button>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/5 border border-white/10">
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
}

