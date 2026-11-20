import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Radio, Upload, Play, Volume2, ShieldAlert, Sparkles, MessageSquare, DollarSign, Award, ArrowRight } from 'lucide-react';
import getIconComponent from '../../config/iconMapper';
import { containerVariants, itemVariants } from '../../utils/animations';
import { playClick } from '../../utils/soundEffects';

const LivestreamPage = ({ currentConfig }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const isCyan = currentConfig.themeColor === 'cyan';
  const liveData = currentConfig.pages?.livestream;
  const mockStream = currentConfig.streamMock;

  if (!liveData) return null;

  const PageIcon = getIconComponent(liveData.icon);
  const accentBorder = isCyan ? 'border-cyan-500/30' : 'border-rose-500/30';
  const accentText = isCyan ? 'text-cyan-400' : 'text-rose-400';
  const accentBg = isCyan ? 'bg-cyan-500/15' : 'bg-rose-500/15';

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-gradient-to-br from-[#111c34]/90 via-[#0e172e]/85 to-[#0b1325]/90 border border-blue-900/40 backdrop-blur-xl rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl relative overflow-hidden`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-2xl ${accentBg} border border-white/10 shadow-lg`}>
              <PageIcon className={`w-8 h-8 sm:w-10 sm:h-10 ${accentText}`} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  STUDIO ENGINE 4.0
                </span>
                <span className="text-[11px] font-mono text-gray-300 bg-white/10 border border-white/10 px-2 py-0.5 rounded-full">
                  ULTRA LOW LATENCY
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                {liveData.title}
              </h2>
              <p className="text-gray-400 text-xs sm:text-sm mt-1 max-w-xl">
                {liveData.description}
              </p>
            </div>
          </div>
          {currentConfig.liveUrl && (
            <Link
              to={currentConfig.liveUrl}
              className={`shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r ${isCyan ? 'from-cyan-500 to-blue-600' : 'from-rose-500 to-purple-600'} hover:opacity-90 shadow-xl transition-all transform hover:scale-105 active:scale-95`}
            >
              <span>Buka Live Room (Beta)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {/* Mock Live Studio Player Preview */}
        {mockStream && (
          <div className="mt-4 rounded-2xl bg-black/60 border border-white/15 overflow-hidden shadow-2xl">
            {/* Player Viewport */}
            <div className="relative aspect-video sm:aspect-[21/9] bg-gradient-to-br from-slate-900 via-indigo-950 to-black flex items-center justify-center p-6 overflow-hidden group">
              {/* Animated audio visualizer waveform lines */}
              <div className="absolute inset-0 flex items-center justify-center gap-1 opacity-25 pointer-events-none">
                {[40, 65, 30, 80, 50, 95, 35, 70, 85, 45, 60, 90, 75, 40, 60, 80, 50].map((h, i) => (
                  <div
                    key={i}
                    className="w-1.5 sm:w-2 bg-gradient-to-t from-cyan-500 to-rose-500 rounded-full animate-pulse"
                    style={{
                      height: `${h}%`,
                      animationDuration: `${0.8 + (i % 5) * 0.2}s`,
                      animationDelay: `${i * 0.08}s`
                    }}
                  />
                ))}
              </div>

              {/* Player Top Overlay */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-xs z-10">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-rose-600 text-white font-mono font-bold text-[11px] flex items-center gap-1.5 shadow-md">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    LIVE DEMO RUN
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-gray-300 font-mono text-[11px] border border-white/10">
                    {mockStream.tag}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-md text-gray-300 font-mono text-[11px] border border-white/10">
                  <span>👥 {mockStream.viewers.toLocaleString('id-ID')} Penonton</span>
                </div>
              </div>

              {/* Center Play / Pause trigger */}
              <button
                type="button"
                onClick={() => {
                  playClick();
                  setIsPlaying(!isPlaying);
                }}
                className="z-10 p-5 rounded-full bg-white/10 hover:bg-white/20 border border-white/30 backdrop-blur-md text-white shadow-2xl transition-all transform hover:scale-110 cursor-pointer flex items-center justify-center"
              >
                <Play className="w-8 h-8 fill-current translate-x-0.5 text-white" />
              </button>

              {/* Player Bottom Control Strip */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-gray-300 bg-black/70 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                <div className="flex items-center gap-3">
                  <Volume2 className="w-4 h-4 text-gray-400" />
                  <span className="font-semibold text-white truncate max-w-xs">{mockStream.title}</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[11px] text-emerald-400">
                  <span>● 4K 60FPS HDR</span>
                  <span className="hidden sm:inline">• LATENCY: 180ms</span>
                </div>
              </div>
            </div>

            {/* Chat ticker simulation */}
            <div className="bg-[#0b101c] p-3 sm:p-4 border-t border-white/10 flex items-center gap-2 overflow-x-auto no-scrollbar">
              <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider flex items-center gap-1.5 shrink-0 px-2">
                <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                Live Chat Simulation:
              </span>
              <div className="flex items-center gap-3">
                {mockStream.messages?.map((msg, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs bg-white/5 border border-white/10 px-3 py-1 rounded-full shrink-0">
                    <span className="font-bold text-cyan-300">{msg.user}:</span>
                    <span className="text-gray-300">{msg.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Technical Specifications Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
      >
        {/* Upload Limits */}
        <motion.div variants={itemVariants} className="bg-[#0b1220]/75 rounded-2xl p-5 border border-white/10 shadow-lg">
          <div className="flex items-center gap-2 text-rose-400 mb-3">
            <Upload className="w-5 h-5" />
            <h4 className="font-bold text-white text-sm">Ukuran Upload</h4>
          </div>
          <div className="text-2xl font-mono font-black text-white mb-2">
            {liveData.features?.videoUpload?.maxSize || '5GB'}
          </div>
          <div className="flex flex-wrap gap-1">
            {liveData.features?.videoUpload?.allowedFormats?.map((f, i) => (
              <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gray-300">
                {f}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Max Duration */}
        <motion.div variants={itemVariants} className="bg-[#0b1220]/75 rounded-2xl p-5 border border-white/10 shadow-lg">
          <div className="flex items-center gap-2 text-rose-400 mb-3">
            <Radio className="w-5 h-5" />
            <h4 className="font-bold text-white text-sm">Durasi Streaming</h4>
          </div>
          <div className="text-2xl font-mono font-black text-white mb-2">
            {liveData.features?.livestream?.maxDuration || '12 Jam'}
          </div>
          <div className="flex flex-wrap gap-1">
            {liveData.features?.livestream?.qualityOptions?.map((q, i) => (
              <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gray-300">
                {q}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Interaction Features */}
        <motion.div variants={itemVariants} className="bg-[#0b1220]/75 rounded-2xl p-5 border border-white/10 shadow-lg">
          <div className="flex items-center gap-2 text-emerald-400 mb-3">
            <Sparkles className="w-5 h-5" />
            <h4 className="font-bold text-white text-sm">Fitur Audiens</h4>
          </div>
          <div className="space-y-1.5 text-xs text-gray-300">
            <div className="flex items-center justify-between">
              <span>Live Chat Instan</span>
              <span className="text-emerald-400 font-bold">✓ Aktif</span>
            </div>
            <div className="flex items-center justify-between">
              <span>SuperChat & Tip</span>
              <span className="text-emerald-400 font-bold">✓ Aktif</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Polling Real-time</span>
              <span className="text-emerald-400 font-bold">✓ Aktif</span>
            </div>
          </div>
        </motion.div>

        {/* Monetization */}
        <motion.div variants={itemVariants} className="bg-[#0b1220]/75 rounded-2xl p-5 border border-white/10 shadow-lg">
          <div className="flex items-center gap-2 text-amber-400 mb-3">
            <DollarSign className="w-5 h-5" />
            <h4 className="font-bold text-white text-sm">Monetisasi Kreator</h4>
          </div>
          <div className="space-y-1.5 text-xs text-gray-300">
            <div className="flex items-center justify-between">
              <span>Subscription Channel</span>
              <span className="text-emerald-400 font-bold">✓ 90% Revenue</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Tipping & Donasi</span>
              <span className="text-emerald-400 font-bold">✓ 0% Fee</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Merchandise Terintegrasi</span>
              <span className="text-emerald-400 font-bold">✓ Otomatis</span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Content Categories */}
      {liveData.contentCategories && (
        <div className="space-y-4">
          <h3 className="text-lg sm:text-2xl font-bold text-white">
            Kategori Konten & Streaming
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {liveData.contentCategories.map((cat, idx) => {
              const CatIcon = getIconComponent(cat.icon);
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -3 }}
                  className="bg-[#0a0f1d]/80 rounded-2xl p-5 border border-white/10 hover:border-white/20 transition-all shadow-md"
                >
                  <div className="flex items-center gap-2.5 mb-3">
                    <CatIcon className={`w-5 h-5 ${accentText}`} />
                    <h4 className="font-bold text-white text-sm sm:text-base">{cat.name}</h4>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.subcategories?.map((sub, sIdx) => (
                      <span key={sIdx} className="text-xs px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-gray-300">
                        {sub}
                      </span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default LivestreamPage;
