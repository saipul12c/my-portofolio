import React from 'react';
import { motion } from 'framer-motion';
import { Hash, Code, Sparkles, Coffee } from 'lucide-react';

export const CHANNELS = [
  { id: 'umum', name: 'Umum', icon: Hash, desc: 'Diskusi & sinyal umum', color: 'from-cyan-500 to-blue-500' },
  { id: 'tanya-coding', name: 'Tanya-Coding', icon: Code, desc: 'Q&A solusi bug & coding', color: 'from-emerald-500 to-teal-500' },
  { id: 'projek-showcase', name: 'Showcase', icon: Sparkles, desc: 'Pamer karya & portofolio', color: 'from-purple-500 to-pink-500' },
  { id: 'santai', name: 'Santai', icon: Coffee, desc: 'Lounge obrolan santai', color: 'from-amber-500 to-orange-500' }
];

export const ChannelBar = ({ activeChannel, onSelectChannel, channelCounts = {} }) => {
  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-8 mb-2">
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1.5 scrollbar-none [touch-action:pan-x]">
        <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-[var(--theme-text-muted)] mr-1 shrink-0 flex items-center gap-1">
          Channel:
        </span>
        {CHANNELS.map((ch) => {
          const Icon = ch.icon;
          const isActive = activeChannel === ch.id;
          const count = channelCounts[ch.id] || 0;

          return (
            <motion.button
              key={ch.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onSelectChannel(ch.id)}
              className={`shrink-0 flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-xl sm:rounded-full text-xs font-bold transition-all border min-h-[32px] cursor-pointer ${
                isActive
                  ? `bg-gradient-to-r ${ch.color} text-white border-transparent shadow-md shadow-cyan-500/20 font-black`
                  : 'bg-[var(--theme-surface)] text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] border-[var(--theme-border)] hover:border-cyan-500/30'
              }`}
              title={ch.desc}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>#{ch.name}</span>
              {count > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-black ${
                  isActive ? 'bg-black/30 text-white' : 'bg-cyan-500/10 text-cyan-400'
                }`}>
                  {count}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};