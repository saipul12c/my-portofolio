import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Medal, Award, X, Sparkles, Flame } from 'lucide-react';
import { supabase } from '../../../lib/supabaseClient';

export const LeaderboardModal = ({ isOpen, onClose, currentUserId }) => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('users')
          .select('id, nama, role, message_count, status')
          .neq('status', 'banned')
          .order('message_count', { ascending: false })
          .limit(10);

        if (!error && data) {
          setLeaders(data);
        }
      } catch (err) {
        console.error('Failed to fetch leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [isOpen]);

  if (!isOpen) return null;

  const top3 = leaders.slice(0, 3);
  const remaining = leaders.slice(3);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-lg bg-[var(--theme-surface)] border border-[var(--theme-border)] rounded-3xl p-6 shadow-2xl relative max-h-[85vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--theme-border)] mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/20">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--theme-text)]">Papan Peringkat Sinyal</h3>
              <p className="text-xs text-[var(--theme-text-muted)]">Kontributor paling aktif di Live Discussion</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[var(--theme-surface-hover)] text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Podium for Top 3 */}
        {top3.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mb-4 pt-2">
            {/* Rank 2 */}
            {top3[1] && (
              <div className="flex flex-col items-center justify-end p-3 rounded-2xl bg-[var(--theme-surface-hover)] border border-slate-400/20 text-center order-1">
                <div className="w-8 h-8 rounded-full bg-slate-300/20 text-slate-300 border border-slate-300/40 flex items-center justify-center font-black text-xs mb-1">
                  2
                </div>
                <span className="text-xs font-bold truncate max-w-[80px] text-[var(--theme-text)]">
                  {top3[1].nama}
                </span>
                <span className="text-[10px] text-[var(--theme-text-muted)] font-mono font-bold">
                  {top3[1].message_count} sinyal
                </span>
              </div>
            )}

            {/* Rank 1 (Crown / Gold) */}
            {top3[0] && (
              <div className="flex flex-col items-center justify-end p-3 rounded-2xl bg-gradient-to-b from-amber-500/20 to-amber-500/5 border border-amber-400/40 text-center shadow-lg shadow-amber-500/10 order-2">
                <div className="w-10 h-10 rounded-full bg-amber-400/30 text-amber-300 border-2 border-amber-400 flex items-center justify-center font-black text-sm mb-1 ring-4 ring-amber-400/20">
                  👑
                </div>
                <span className="text-xs font-black truncate max-w-[90px] text-amber-300">
                  {top3[0].nama}
                </span>
                <span className="text-[10px] text-amber-200/80 font-mono font-bold">
                  {top3[0].message_count} sinyal
                </span>
              </div>
            )}

            {/* Rank 3 */}
            {top3[2] && (
              <div className="flex flex-col items-center justify-end p-3 rounded-2xl bg-[var(--theme-surface-hover)] border border-amber-700/20 text-center order-3">
                <div className="w-8 h-8 rounded-full bg-amber-600/20 text-amber-600 border border-amber-600/40 flex items-center justify-center font-black text-xs mb-1">
                  3
                </div>
                <span className="text-xs font-bold truncate max-w-[80px] text-[var(--theme-text)]">
                  {top3[2].nama}
                </span>
                <span className="text-[10px] text-[var(--theme-text-muted)] font-mono font-bold">
                  {top3[2].message_count} sinyal
                </span>
              </div>
            )}
          </div>
        )}

        {/* List of remaining */}
        <div className="overflow-y-auto flex-1 space-y-2 pr-1 custom-scrollbar">
          {loading ? (
            <div className="py-8 text-center text-xs text-[var(--theme-text-muted)]">
              Memuat data kontributor...
            </div>
          ) : remaining.length === 0 && top3.length === 0 ? (
            <div className="py-8 text-center text-xs text-[var(--theme-text-muted)]">
              Belum ada data aktivitas.
            </div>
          ) : (
            remaining.map((user, idx) => {
              const rank = idx + 4;
              const isCurrentUser = currentUserId === user.id;

              return (
                <div
                  key={user.id}
                  className={`flex items-center justify-between p-3 rounded-xl border text-xs transition-colors ${
                    isCurrentUser
                      ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300'
                      : 'bg-[var(--theme-surface-hover)]/60 border-[var(--theme-border)] text-[var(--theme-text)]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-center font-mono font-black text-[var(--theme-text-muted)]">
                      #{rank}
                    </span>
                    <span className="font-bold truncate max-w-[150px]">
                      {user.nama}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 font-mono font-bold text-[var(--theme-text-muted)]">
                    <Flame className="w-3.5 h-3.5 text-orange-400" />
                    <span>{user.message_count}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </motion.div>
    </div>
  );
};
