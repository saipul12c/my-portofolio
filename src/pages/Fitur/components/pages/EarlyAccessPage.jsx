import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Crown, Gift, CheckCircle2, Copy, Check, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import getIconComponent from '../../config/iconMapper';
import { containerVariants, itemVariants } from '../../utils/animations';
import { playClick, playSuccess } from '../../utils/soundEffects';

const EarlyAccessPage = ({ currentConfig }) => {
  const [emailInput, setEmailInput] = useState('');
  const [userPass, setUserPass] = useState(null);
  const [copied, setCopied] = useState(false);

  const isCyan = currentConfig.themeColor === 'cyan';
  const perks = currentConfig.perks || [];

  const accentBorder = isCyan ? 'border-cyan-500/30' : 'border-amber-500/30';
  const accentText = isCyan ? 'text-cyan-400' : 'text-amber-400';
  const btnGradient = isCyan ? 'from-cyan-500 via-teal-500 to-blue-600' : 'from-amber-500 via-orange-500 to-rose-600';

  useEffect(() => {
    const saved = localStorage.getItem(`vip_pass_${currentConfig.id}`);
    if (saved) {
      try {
        setUserPass(JSON.parse(saved));
      } catch {
        // silent
      }
    } else {
      setUserPass(null);
    }
  }, [currentConfig.id]);

  const handleClaim = (e) => {
    e.preventDefault();
    if (!emailInput) return;

    playSuccess();

    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // silent
    }

    const pass = {
      email: emailInput,
      passId: `VIP-${Math.floor(100000 + Math.random() * 900000)}`,
      brand: currentConfig.brand.name,
      joinedAt: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    };

    setUserPass(pass);
    localStorage.setItem(`vip_pass_${currentConfig.id}`, JSON.stringify(pass));
    setEmailInput('');
  };

  const copyTicket = () => {
    playClick();
    if (userPass?.passId) {
      navigator.clipboard?.writeText(userPass.passId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-gradient-to-br from-[#111c34]/90 via-[#0e172e]/85 to-[#0b1325]/90 border border-blue-900/40 backdrop-blur-xl rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl relative overflow-hidden`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-2xl ${isCyan ? 'bg-cyan-500/15' : 'bg-amber-500/15'} border border-white/10 shadow-lg`}>
              <Crown className={`w-8 h-8 sm:w-10 sm:h-10 ${accentText}`} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  VIP SUPPORTER PRIVILEGES
                </span>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  TERBATAS
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                Keuntungan Eksklusif Early Supporter
              </h2>
              <p className="text-gray-400 text-xs sm:text-sm mt-1 max-w-xl">
                Privilege khusus untuk para pengguna perdana yang percaya pada visi kami sejak tahap awal.
              </p>
            </div>
          </div>
        </div>

        {/* Claim Bar or Pass inside header */}
        <div className="mt-6 pt-6 border-t border-white/10">
          {!userPass ? (
            <form onSubmit={handleClaim} className="flex flex-col sm:flex-row gap-3 max-w-xl">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Masukkan email untuk klaim tiket..."
                className="flex-1 px-4 py-3 rounded-xl bg-black/40 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 text-sm"
                required
              />
              <button
                type="submit"
                className={`px-6 py-3 rounded-xl bg-gradient-to-r ${btnGradient} text-white font-semibold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer whitespace-nowrap`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Klaim Tiket VIP Gratis</span>
              </button>
            </form>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
              <div className="flex items-center gap-2.5 text-xs text-gray-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Tiket Anda Aktif: <strong className="text-white font-mono">{userPass.passId}</strong> ({userPass.email})</span>
              </div>
              <button
                type="button"
                onClick={copyTicket}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Tersalin' : 'Salin ID'}</span>
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Perks Cards Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        {perks.map((perk, idx) => {
          const PerkIcon = getIconComponent(perk.icon);
          return (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -3 }}
              className="bg-[#0f172a]/75 rounded-2xl p-6 border border-blue-900/30 hover:border-amber-500/30 transition-all shadow-md flex items-start gap-4 group"
            >
              <div className={`p-3.5 rounded-2xl ${isCyan ? 'bg-cyan-500/15 text-cyan-400' : 'bg-amber-500/15 text-amber-400'} border border-white/10 shrink-0 group-hover:scale-105 transition-transform`}>
                <PerkIcon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base sm:text-lg mb-1.5 group-hover:text-amber-300 transition-colors">
                  {perk.title}
                </h4>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                  {perk.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* FAQ Accordion Section */}
      <div className="bg-[#111c34]/70 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-blue-900/40 shadow-xl space-y-4">
        <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-gray-400" />
          Pertanyaan Umum (FAQ)
        </h3>

        <div className="space-y-3">
          {[
            {
              q: "Apakah pendaftaran VIP Early Access ini berbayar?",
              a: "Tidak! Pendaftaran 100% gratis selama masa pra-rilis untuk 1.000 pendaftar pertama."
            },
            {
              q: "Kapan undangan beta test akan dikirimkan ke email?",
              a: "Undangan beta tertutup akan dikirim secara bertahap dalam gelombang (batches) langsung ke inbox email terdaftar Anda."
            },
            {
              q: "Bagaimana cara menukarkan ID Tiket VIP?",
              a: "Saat platform rilis resmi, masukkan ID tiket unik Anda pada menu aktivasi untuk klaim badge dan bonus akun pro secara instan."
            }
          ].map((faq, i) => (
            <div key={i} className="bg-black/30 rounded-xl p-4 border border-white/5">
              <h5 className="font-semibold text-white text-xs sm:text-sm mb-1">{faq.q}</h5>
              <p className="text-gray-400 text-xs leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EarlyAccessPage;
