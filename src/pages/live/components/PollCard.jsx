import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, CheckCircle2, Users, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export const PollCard = ({ poll, onVote, currentUser, alignRight = false }) => {
  const [voting, setVoting] = useState(false);

  if (!poll || !poll.question || !Array.isArray(poll.options)) return null;

  const currentUserId = currentUser?.id || currentUser?.username;
  const userVotedOptionId = poll.votedUsers && currentUserId ? poll.votedUsers[currentUserId] : null;
  const hasVoted = Boolean(userVotedOptionId);

  const totalVotes = poll.options.reduce((sum, opt) => sum + (opt.votes || 0), 0);

  const handleOptionClick = async (optionId) => {
    if (!currentUser) return;
    if (voting) return;

    setVoting(true);
    try {
      await onVote(poll.id, optionId);
      // Fire small celebratory confetti
      confetti({
        particleCount: 25,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch (err) {
      console.error('Failed to vote:', err);
    } finally {
      setVoting(false);
    }
  };

  return (
    <div className={`my-3 p-4 rounded-2xl border transition-all ${
      alignRight
        ? 'bg-black/20 border-white/20 text-white'
        : 'bg-[var(--theme-surface)]/95 border-[var(--theme-border)] text-[var(--theme-text)] shadow-lg'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
            <BarChart3 className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-black uppercase tracking-wider text-cyan-400">
            Jajak Pendapat
          </span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-[var(--theme-text-muted)] font-bold">
          <Users className="w-3.5 h-3.5" />
          <span>{totalVotes} suara</span>
        </div>
      </div>

      {/* Question */}
      <h4 className="text-sm font-bold mb-3 leading-snug">
        {poll.question}
      </h4>

      {/* Options */}
      <div className="space-y-2">
        {poll.options.map((opt) => {
          const votes = opt.votes || 0;
          const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
          const isSelected = userVotedOptionId === opt.id;

          return (
            <motion.button
              key={opt.id}
              whileTap={{ scale: 0.98 }}
              disabled={voting || !currentUser}
              onClick={() => handleOptionClick(opt.id)}
              className={`w-full relative overflow-hidden text-left p-3 rounded-xl border text-xs font-semibold transition-all ${
                isSelected
                  ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-400/40'
                  : 'border-[var(--theme-border)] hover:border-cyan-500/40 bg-[var(--theme-surface)]'
              }`}
            >
              {/* Progress bar background */}
              {hasVoted && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className={`absolute inset-y-0 left-0 opacity-25 ${
                    isSelected ? 'bg-cyan-400' : 'bg-gray-400'
                  }`}
                />
              )}

              {/* Option text & vote count */}
              <div className="relative z-10 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />}
                  <span>{opt.text}</span>
                </div>
                {hasVoted && (
                  <span className="text-[11px] font-mono font-bold shrink-0 opacity-80">
                    {percentage}% ({votes})
                  </span>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {!currentUser && (
        <p className="mt-2 text-[10px] italic text-[var(--theme-text-muted)] text-center">
          Masuk untuk memberikan suara pada polling ini.
        </p>
      )}
    </div>
  );
};
