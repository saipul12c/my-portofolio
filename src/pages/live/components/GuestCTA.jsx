import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const GuestCTA = () => {
  const navigate = useNavigate();

  return (
    <div 
      className="max-w-4xl mx-auto w-full p-4 sm:p-6 bg-[var(--theme-surface)]/50 backdrop-blur-3xl border border-[var(--theme-border)] rounded-[2.5rem] shadow-2xl overflow-hidden relative group transition-all hover:bg-[var(--theme-surface)]/80"
    >
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-[-50%] left-[-20%] w-full h-full bg-[var(--theme-accent)]/10 rounded-full blur-[80px]" />
        <div className="absolute bottom-[-50%] right-[-20%] w-full h-full bg-blue-600/10 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
        <div className="flex flex-col items-center sm:items-start space-y-0.5">
          <p className="text-[var(--theme-text)] font-black text-lg sm:text-xl italic uppercase tracking-tighter">Bergabung dalam diskusi</p>
          <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em] text-[var(--theme-text-muted)]">Ayo mulai percakapan hari ini!</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/Live-Discussion/login')}
            className="flex-1 sm:flex-none py-3.5 px-10 bg-[var(--theme-text)] text-[var(--theme-bg)] hover:opacity-90 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl"
          >
            Masuk
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/Live-Discussion/daftar')}
            className="flex-1 sm:flex-none py-3.5 px-10 bg-transparent text-[var(--theme-text)] border border-[var(--theme-border)] hover:bg-[var(--theme-surface-hover)] rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all backdrop-blur-xl"
          >
            Daftar
          </motion.button>
        </div>

        <div className="hidden lg:flex items-center gap-2 opacity-20 group-hover:opacity-40 transition-opacity">
          <Shield className="w-3 h-3 text-cyan-400" />
          <span className="text-[7px] font-black uppercase tracking-widest">Secured Node</span>
        </div>
      </div>
    </div>
  );
};

export default GuestCTA;
