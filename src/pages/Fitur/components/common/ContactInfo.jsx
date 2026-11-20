import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Headphones, Copy, Check } from 'lucide-react';
import { playClick } from '../../utils/soundEffects';

const ContactInfo = ({ currentConfig }) => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const isCyan = currentConfig.themeColor === 'cyan';

  if (!currentConfig.contact) return null;

  const handleCopyEmail = () => {
    playClick();
    if (currentConfig.contact.email?.address) {
      navigator.clipboard?.writeText(currentConfig.contact.email.address);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mt-12 bg-[#111c34]/70 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-blue-900/40 shadow-xl"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Headphones className={`w-4 h-4 ${isCyan ? 'text-cyan-400' : 'text-amber-400'}`} />
            Hubungi Saluran Resmi & Tim Pengembang
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Pertanyaan kemitraan, media, atau laporan teknis</p>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>Helpdesk Aktif 24/7</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Email */}
        <div className="bg-[#0f172a]/60 rounded-2xl p-4 border border-blue-900/30 hover:border-cyan-500/30 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono text-slate-400">EMAIL SUPPORT</span>
            <button
              onClick={handleCopyEmail}
              title="Salin Email"
              className="p-1 hover:text-white text-slate-400 transition-colors cursor-pointer"
            >
              {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <a
            href={`mailto:${currentConfig.contact.email?.address}`}
            onClick={() => playClick()}
            className="text-xs sm:text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors truncate"
          >
            {currentConfig.contact.email?.address}
          </a>
        </div>

        {/* Phone */}
        <div className="bg-[#0f172a]/60 rounded-2xl p-4 border border-blue-900/30 hover:border-emerald-500/30 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono text-slate-400">HOTLINE RESMI</span>
            <Phone className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <a
            href={`tel:${currentConfig.contact.phone?.number}`}
            onClick={() => playClick()}
            className="text-xs sm:text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors truncate"
          >
            {currentConfig.contact.phone?.number}
          </a>
        </div>

        {/* Service Hours */}
        <div className="bg-[#0f172a]/60 rounded-2xl p-4 border border-blue-900/30 hover:border-amber-500/30 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono text-slate-400">JAM OPERASIONAL</span>
            <Headphones className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <span className="text-xs sm:text-sm font-semibold text-amber-300 truncate">
            {currentConfig.contact.support?.hours || '24 Jam Non-stop'}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ContactInfo;
