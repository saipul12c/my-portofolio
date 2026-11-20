import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, CheckCircle2, Copy, Shield, ArrowRight, Zap, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import getIconComponent from '../../config/iconMapper';
import CountdownHUD from '../common/CountdownHUD';
import { containerVariants, itemVariants } from '../../utils/animations';
import { playClick, playSuccess } from '../../utils/soundEffects';

const MainContent = ({ 
  currentConfig, 
  years,
  days, 
  hours, 
  minutes, 
  seconds, 
  email, 
  setEmail, 
  handleNewsletterSubmit 
}) => {
  const [submittedPass, setSubmittedPass] = useState(null);
  const [copiedPass, setCopiedPass] = useState(false);

  const isCyan = currentConfig.themeColor === 'cyan';
  const isPurple = currentConfig.themeColor === 'purple';
  const BrandIcon = getIconComponent(currentConfig.brand.logo);

  const accentColor = isCyan ? 'cyan' : isPurple ? 'purple' : 'orange';
  const borderHover = isCyan 
    ? 'hover:border-cyan-500/50' 
    : isPurple 
    ? 'hover:border-purple-500/50' 
    : 'hover:border-orange-500/50';
  const tagBg = isCyan 
    ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' 
    : isPurple
    ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
    : 'bg-orange-500/15 text-orange-300 border-orange-500/30';
  const btnGradient = isCyan 
    ? 'from-cyan-500 via-teal-500 to-blue-600' 
    : isPurple
    ? 'from-indigo-500 via-purple-500 to-pink-600'
    : 'from-orange-500 via-rose-500 to-purple-600';

  useEffect(() => {
    // Check if user already registered for this config
    const saved = localStorage.getItem(`vip_pass_${currentConfig.id}`);
    if (saved) {
      try {
        setSubmittedPass(JSON.parse(saved));
      } catch {
        // silent
      }
    } else {
      setSubmittedPass(null);
    }
  }, [currentConfig.id]);

  const onFormSubmit = (e) => {
    e.preventDefault();
    if (!email) return;

    playSuccess();

    // Trigger multi-angle celebration confetti!
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 }
      });
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });
      }, 250);
    } catch {
      // safe fallback
    }

    const passData = {
      email,
      passId: `VIP-${Math.floor(100000 + Math.random() * 900000)}`,
      brand: currentConfig.brand.name,
      joinedAt: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    };

    setSubmittedPass(passData);
    localStorage.setItem(`vip_pass_${currentConfig.id}`, JSON.stringify(passData));

    if (handleNewsletterSubmit) {
      handleNewsletterSubmit(e);
    }
  };

  const copyTicket = () => {
    playClick();
    if (submittedPass?.passId) {
      navigator.clipboard?.writeText(submittedPass.passId);
      setCopiedPass(true);
      setTimeout(() => setCopiedPass(false), 2000);
    }
  };

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`relative bg-gradient-to-b from-[#111c34]/90 to-[#0e172e]/95 border border-blue-900/40 backdrop-blur-xl rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl overflow-hidden group hover:border-${accentColor}-500/40 transition-colors`}
      >
        {/* Dynamic decorative backdrop light */}
        <div 
          className={`absolute -top-32 -left-32 w-64 h-64 rounded-full blur-3xl opacity-25 group-hover:opacity-40 transition-opacity pointer-events-none ${
            isCyan ? 'bg-cyan-500' : 'bg-orange-500'
          }`} 
        />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 pb-6 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-2xl bg-gradient-to-br ${isCyan ? 'from-cyan-500/25 to-blue-500/10' : 'from-orange-500/25 to-rose-500/10'} border border-white/20 shadow-lg group-hover:scale-105 transition-transform`}>
              <BrandIcon className={`w-8 h-8 sm:w-10 sm:h-10 ${isCyan ? 'text-cyan-400' : 'text-orange-400'}`} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className={`text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full border ${tagBg}`}>
                  {currentConfig.version || 'ALPHA 2.0'}
                </span>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  SISTEM AKTIF
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                {currentConfig.content.title}
              </h2>
              <p className={`text-xs sm:text-sm font-medium mt-1 ${isCyan ? 'text-cyan-300' : 'text-orange-300'}`}>
                {currentConfig.brand.slogan}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end gap-1.5">
            <span className="text-xs text-gray-400">Status Tahapan Rilis</span>
            <span className="text-xs sm:text-sm font-semibold text-white px-3 py-1 rounded-full bg-white/10 border border-white/15">
              {currentConfig.status || '🚀 Q4 2030 (Beta Tahap Akhir)'}
            </span>
            {currentConfig.liveUrl && (
              <Link
                to={currentConfig.liveUrl}
                className={`mt-1 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r ${btnGradient} hover:opacity-95 shadow-md transition-all transform hover:scale-105 active:scale-95`}
              >
                <span>Buka Halaman (Beta)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>

        {/* Narrative Description */}
        <p className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed max-w-3xl mb-8">
          {currentConfig.content.description}
        </p>

        {/* Features Matrix Grid */}
        <div className="mb-2">
          <h3 className="text-xs sm:text-sm font-mono uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2">
            <Sparkles className={`w-4 h-4 ${isCyan ? 'text-cyan-400' : 'text-orange-400'}`} />
            Fitur Utama Generasi Berikutnya
          </h3>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {currentConfig.content.features?.map((feature, index) => {
              const IconComp = getIconComponent(feature.icon);
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -3, scale: 1.01 }}
                  className={`bg-[#0f172a]/75 rounded-2xl p-5 border border-blue-900/30 ${borderHover} transition-all shadow-md group/card`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2.5 rounded-xl ${isCyan ? 'bg-cyan-500/15 text-cyan-400' : 'bg-orange-500/15 text-orange-400'} border border-white/10`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                    {feature.badge && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-300">
                        {feature.badge}
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-white text-base mb-1.5 group-hover/card:text-white transition-colors">
                    {feature.title}
                  </h4>
                  <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.div>

      {/* Countdown HUD Section */}
      <CountdownHUD
        currentConfig={currentConfig}
        years={years}
        days={days}
        hours={hours}
        minutes={minutes}
        seconds={seconds}
      />

      {/* VIP Whitelist / Newsletter Signup Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative bg-gradient-to-br from-[#111c34]/90 via-[#0e172e]/85 to-[#131f3b]/90 rounded-3xl p-6 sm:p-8 md:p-10 border border-blue-900/40 shadow-xl overflow-hidden`}
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-cyan-500/10 via-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        {!submittedPass ? (
          <div>
            <div className="max-w-2xl mb-6">
              <span className={`inline-flex items-center gap-1.5 text-xs font-mono font-semibold px-3 py-1 rounded-full border mb-3 ${tagBg}`}>
                <Shield className="w-3.5 h-3.5" />
                VIP EARLY ACCESS WHITELIST
              </span>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                {currentConfig.newsletter?.title || 'Dapatkan Notifikasi Peluncuran!'}
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm mt-2 leading-relaxed">
                {currentConfig.newsletter?.subtitle || 'Daftar sekarang untuk menerima undangan beta tertutup, update roadmap berkala, dan penawaran eksklusif hari pertama.'}
              </p>
            </div>

            <form onSubmit={onFormSubmit} className="flex flex-col sm:flex-row gap-3 max-w-xl">
              <div className="relative flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={currentConfig.newsletter?.placeholder || 'Masukkan alamat email Anda...'}
                  className="w-full px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl bg-black/40 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 text-sm backdrop-blur-md transition-all shadow-inner"
                  required
                />
              </div>

              <button
                type="submit"
                className={`px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl bg-gradient-to-r ${btnGradient} text-white font-semibold text-sm hover:opacity-95 transition-all shadow-lg hover:shadow-cyan-500/25 flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer whitespace-nowrap`}
              >
                <span>{currentConfig.newsletter?.buttonText || 'Klaim VIP Pass'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="flex items-center gap-4 text-xs text-gray-500 mt-4">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Tanpa spam, unsubscribe kapan saja
              </span>
              <span className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Slot VIP Terbatas
              </span>
            </div>
          </div>
        ) : (
          /* Digital Hologram VIP Pass Generated */
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col md:flex-row items-center justify-between gap-6 p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-cyan-950/30 to-black/60 border border-emerald-500/40 shadow-xl"
          >
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
                <Check className="w-3.5 h-3.5" />
                VIP PASS AKTIF • TERDAFTAR DI WHITELIST
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-white">
                Selamat! Tiket VIP Anda Telah Dibuat 🎉
              </h4>
              <p className="text-gray-300 text-xs sm:text-sm">
                Email terdaftar: <strong className="text-white">{submittedPass.email}</strong> • Terdaftar pada: {submittedPass.joinedAt}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              {currentConfig.liveUrl && (
                <Link
                  to={currentConfig.liveUrl}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 hover:opacity-90 transition-opacity shadow-md"
                >
                  <span>Mulai Buka Halaman (Beta)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
              <div className="px-4 py-2.5 rounded-xl bg-black/60 border border-emerald-500/30 font-mono text-emerald-400 font-bold tracking-wider text-sm flex items-center gap-2">
                <span>{submittedPass.passId}</span>
                <button
                  type="button"
                  onClick={copyTicket}
                  title="Salin ID Tiket"
                  className="p-1 hover:text-white transition-colors"
                >
                  {copiedPass ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSubmittedPass(null);
                  localStorage.removeItem(`vip_pass_${currentConfig.id}`);
                }}
                className="text-xs text-gray-400 hover:text-gray-200 underline"
              >
                Ganti Email
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Technology Stack Grid */}
      {currentConfig.technology && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0c1220]/75 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 mb-6 pb-4 border-b border-white/10">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${isCyan ? 'bg-cyan-400' : 'bg-orange-400'}`} />
                Modern Architectural Tech Stack
              </h3>
              <p className="text-gray-400 text-xs mt-1">Infrastruktur skalabilitas tinggi dan toleransi latensi nol</p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1 rounded-full">
              Enterprise Grade
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Backend */}
            <div className="bg-black/30 rounded-2xl p-5 border border-white/10 hover:border-white/20 transition-all">
              <h4 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                {React.createElement(getIconComponent(currentConfig.technology.backend.icons.backend), { className: `w-4 h-4 ${isCyan ? 'text-cyan-400' : 'text-orange-400'}` })}
                Core Backend & Engine
              </h4>
              <div className="space-y-2">
                <div className="text-xs font-mono text-gray-300 bg-white/5 px-3 py-2 rounded-xl border border-white/5">
                  <span className="text-gray-400">Framework:</span> {currentConfig.technology.backend.framework}
                </div>
                <div className="text-xs font-mono text-gray-300 bg-white/5 px-3 py-2 rounded-xl border border-white/5">
                  <span className="text-gray-400">Database:</span> {currentConfig.technology.backend.database}
                </div>
                <div className="text-xs font-mono text-gray-300 bg-white/5 px-3 py-2 rounded-xl border border-white/5">
                  <span className="text-gray-400">Caching:</span> {currentConfig.technology.backend.cache}
                </div>
              </div>
            </div>

            {/* Frontend */}
            <div className="bg-black/30 rounded-2xl p-5 border border-white/10 hover:border-white/20 transition-all">
              <h4 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                {React.createElement(getIconComponent(currentConfig.technology.frontend.icons.frontend), { className: `w-4 h-4 ${isCyan ? 'text-cyan-400' : 'text-orange-400'}` })}
                Frontend & User Interface
              </h4>
              <div className="space-y-2">
                <div className="text-xs font-mono text-gray-300 bg-white/5 px-3 py-2 rounded-xl border border-white/5">
                  <span className="text-gray-400">Framework:</span> {currentConfig.technology.frontend.framework}
                </div>
                <div className="text-xs font-mono text-gray-300 bg-white/5 px-3 py-2 rounded-xl border border-white/5">
                  <span className="text-gray-400">Styling:</span> {currentConfig.technology.frontend.styling}
                </div>
                <div className="text-xs font-mono text-gray-300 bg-white/5 px-3 py-2 rounded-xl border border-white/5">
                  <span className="text-gray-400">Motion:</span> {currentConfig.technology.frontend.animation}
                </div>
              </div>
            </div>

            {/* Infrastructure */}
            <div className="bg-black/30 rounded-2xl p-5 border border-white/10 hover:border-white/20 transition-all">
              <h4 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                {React.createElement(getIconComponent(currentConfig.technology.infrastructure.icons.hosting), { className: `w-4 h-4 ${isCyan ? 'text-cyan-400' : 'text-orange-400'}` })}
                Cloud & Edge CDN
              </h4>
              <div className="space-y-2">
                <div className="text-xs font-mono text-gray-300 bg-white/5 px-3 py-2 rounded-xl border border-white/5">
                  <span className="text-gray-400">Hosting:</span> {currentConfig.technology.infrastructure.hosting}
                </div>
                <div className="text-xs font-mono text-gray-300 bg-white/5 px-3 py-2 rounded-xl border border-white/5">
                  <span className="text-gray-400">CDN:</span> {currentConfig.technology.infrastructure.cdn}
                </div>
                <div className="text-xs font-mono text-gray-300 bg-white/5 px-3 py-2 rounded-xl border border-white/5">
                  <span className="text-gray-400">Storage:</span> {currentConfig.technology.infrastructure.storage || 'Cloud Storage'}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default MainContent;
