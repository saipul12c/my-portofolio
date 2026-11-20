import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Users, BookOpen, MessageCircle, Lightbulb } from 'lucide-react';
import { summarizeMessages } from '../utils/saipulRoomIntegration';

export const AISummarizerModal = ({ isOpen, onClose, messages = [], activeChannel = 'umum' }) => {
  const summaryData = React.useMemo(() => {
    if (!isOpen) return null;
    return summarizeMessages(messages);
  }, [isOpen, messages]);

  if (!isOpen || !summaryData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-xl bg-[var(--theme-surface)] border border-[var(--theme-border)] rounded-3xl p-5 sm:p-6 shadow-2xl relative max-h-[85vh] overflow-y-auto custom-scrollbar"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--theme-border)] mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/20">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[var(--theme-text)]">Rangkuman AI Saipul</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300">
                  #{activeChannel}
                </span>
              </div>
              <p className="text-xs text-[var(--theme-text-muted)]">Ringkasan cepat isi diskusi terkini</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[var(--theme-surface-hover)] text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {/* Main Topic Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-transparent border border-purple-500/20">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400 mb-1">
              <Lightbulb className="w-4 h-4" />
              <span>Fokus Topik Utama</span>
            </div>
            <p className="text-sm font-semibold text-[var(--theme-text)]">
              {summaryData.topic}
            </p>
          </div>

          {/* Key Points */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--theme-text-muted)] mb-2 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              Poin Penting Diskusi
            </h4>
            <div className="space-y-2">
              {summaryData.points.map((pt, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-[var(--theme-surface-hover)]/60 border border-[var(--theme-border)] text-xs text-[var(--theme-text)]"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Active Participants */}
          {summaryData.activeUsers.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--theme-text-muted)] mb-2 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                Partisipan Paling Aktif
              </h4>
              <div className="flex flex-wrap gap-2">
                {summaryData.activeUsers.map((u, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20"
                  >
                    👤 {u}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Executive Summary */}
          <div className="pt-2">
            <p className="text-xs italic text-[var(--theme-text-muted)] bg-black/20 p-3 rounded-xl border border-white/5">
              "{summaryData.summary}"
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-[var(--theme-border)] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/20 hover:scale-105 active:scale-95 transition-all"
          >
            Mengerti, Terima Kasih
          </button>
        </div>
      </motion.div>
    </div>
  );
};
