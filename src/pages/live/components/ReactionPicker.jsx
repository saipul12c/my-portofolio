import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smile } from 'lucide-react';

const COMMON_EMOJIS = ['👍', '❤️', '🔥', '😂', '😮', '😢', '🙏', '💯'];

export const ReactionPicker = ({ onSelect, isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-[60]" 
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="absolute bottom-full mb-2 left-0 z-[70] bg-[#1e293b] border border-white/10 rounded-2xl p-2 shadow-2xl flex items-center gap-1 backdrop-blur-xl"
          >
            {COMMON_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => {
                  onSelect(emoji);
                  onClose();
                }}
                className="w-10 h-10 flex items-center justify-center text-xl hover:bg-white/10 rounded-xl transition-all hover:scale-125"
              >
                {emoji}
              </button>
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export const MessageReactions = ({ reactions = [], onReact, currentUser }) => {
  if (!reactions || reactions.length === 0) return null;

  // Group reactions by emoji
  const grouped = reactions.reduce((acc, curr) => {
    acc[curr.emoji] = acc[curr.emoji] || [];
    acc[curr.emoji].push(curr.user_id);
    return acc;
  }, {});

  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {Object.entries(grouped).map(([emoji, userIds]) => {
        const isSelected = currentUser && userIds.includes(currentUser.id);
        return (
          <button
            key={emoji}
            onClick={() => onReact(emoji)}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-xs font-bold transition-all ${
              isSelected 
                ? 'bg-blue-500/20 border-blue-500/50 text-blue-300' 
                : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'
            }`}
          >
            <span>{emoji}</span>
            <span>{userIds.length}</span>
          </button>
        );
      })}
    </div>
  );
};
