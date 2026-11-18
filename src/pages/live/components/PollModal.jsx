import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BarChart3, Plus, Trash2, Send } from 'lucide-react';

export const PollModal = ({ isOpen, onClose, onCreatePoll }) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleAddOption = () => {
    if (options.length < 5) {
      setOptions([...options, '']);
    }
  };

  const handleRemoveOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (text, index) => {
    const updated = [...options];
    updated[index] = text;
    setOptions(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!question.trim()) {
      setError('Pertanyaan tidak boleh kosong.');
      return;
    }

    const validOptions = options.map(o => o.trim()).filter(Boolean);
    if (validOptions.length < 2) {
      setError('Minimal sertakan 2 opsi jawaban.');
      return;
    }

    const pollData = {
      id: `poll-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      question: question.trim(),
      options: validOptions.map((text, idx) => ({
        id: `opt-${idx + 1}`,
        text,
        votes: 0
      })),
      votedUsers: {},
      totalVotes: 0,
      createdAt: Date.now()
    };

    onCreatePoll(pollData);
    setQuestion('');
    setOptions(['', '']);
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-lg bg-[var(--theme-surface)] border border-[var(--theme-border)] rounded-3xl p-5 sm:p-6 shadow-2xl relative max-h-[85vh] overflow-y-auto custom-scrollbar"
      >
        <div className="flex items-center justify-between pb-4 border-b border-[var(--theme-border)] mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--theme-text)]">Buat Jajak Pendapat (Polling)</h3>
              <p className="text-xs text-[var(--theme-text-muted)]">Tanyakan pendapat komunitas di room ini</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[var(--theme-surface-hover)] text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--theme-text-muted)] mb-1.5">
              Pertanyaan Polling
            </label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Contoh: Apa library state management favorit kalian?"
              className="w-full px-4 py-2.5 bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-xl text-sm text-[var(--theme-text)] focus:outline-none focus:border-cyan-500"
              maxLength={150}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--theme-text-muted)] mb-1.5">
              Opsi Jawaban (2 - 5 Opsi)
            </label>
            <div className="space-y-2">
              {options.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-xs font-mono text-[var(--theme-text-muted)] w-5 text-right">
                    {idx + 1}.
                  </span>
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => handleOptionChange(e.target.value, idx)}
                    placeholder={`Opsi ${idx + 1}`}
                    className="flex-1 px-4 py-2 bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-xl text-xs text-[var(--theme-text)] focus:outline-none focus:border-cyan-500"
                    maxLength={80}
                  />
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(idx)}
                      className="p-2 text-red-400/60 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {options.length < 5 && (
              <button
                type="button"
                onClick={handleAddOption}
                className="mt-3 flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Tambah Opsi
              </button>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--theme-border)]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[var(--theme-text-muted)] hover:bg-[var(--theme-surface-hover)] transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 hover:scale-105 active:scale-95 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              Bagikan Polling
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
