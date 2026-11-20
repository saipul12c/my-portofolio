import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Sparkles, Milestone, ArrowRight, ShieldCheck } from 'lucide-react';
import { containerVariants, itemVariants } from '../../utils/animations';

const RoadmapPage = ({ currentConfig }) => {
  const isCyan = currentConfig.themeColor === 'cyan';
  const roadmap = currentConfig.roadmap || [];

  const accentBorder = isCyan ? 'border-cyan-500/30' : 'border-orange-500/30';
  const accentText = isCyan ? 'text-cyan-400' : 'text-orange-400';

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
            <div className={`p-4 rounded-2xl ${isCyan ? 'bg-cyan-500/15' : 'bg-orange-500/15'} border border-white/10 shadow-lg`}>
              <Milestone className={`w-8 h-8 sm:w-10 sm:h-10 ${accentText}`} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-white/10 text-gray-300 border border-white/10">
                  DEVELOPMENT TIMELINE
                </span>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                  TAHAP 3 AKTIF
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                Roadmap Pengembangan & Rilis
              </h2>
              <p className="text-gray-400 text-xs sm:text-sm mt-1 max-w-xl">
                Transparansi penuh tahapan rekayasa sistem menuju peluncuran versi stabil ke seluruh dunia.
              </p>
            </div>
          </div>
        </div>

        {/* Timeline Progress Bar summary */}
        <div className="mt-6 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" /> 2 Fase Selesai
            </span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <Clock className="w-4 h-4" /> 1 Fase Sedang Berjalan
            </span>
            <span className="flex items-center gap-1.5 text-gray-400">
              <Sparkles className="w-4 h-4" /> 1 Fase Mendatang
            </span>
          </div>

          <div className="text-xs font-mono text-gray-300 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
            Current Build: <span className="text-white font-bold">{currentConfig.version || 'v2.6.0-BETA'}</span>
          </div>
        </div>
      </motion.div>

      {/* Interactive Vertical Timeline Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative border-l-2 border-white/10 ml-4 sm:ml-8 pl-6 sm:pl-10 space-y-8"
      >
        {roadmap.map((item, index) => {
          const isDone = item.status === 'completed';
          const isProgress = item.status === 'in_progress';

          return (
            <motion.div
              key={index}
              variants={itemVariants}
              className="relative group"
            >
              {/* Timeline marker node */}
              <div
                className={`absolute -left-[35px] sm:-left-[51px] top-4 w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                  isDone
                    ? 'bg-emerald-950 border-emerald-400 text-emerald-400'
                    : isProgress
                      ? `${isCyan ? 'bg-cyan-950 border-cyan-400 text-cyan-400' : 'bg-orange-950 border-orange-400 text-orange-400'} animate-pulse`
                      : 'bg-gray-900 border-white/20 text-gray-500'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : isProgress ? (
                  <Clock className="w-4 h-4" />
                ) : (
                  <span className="text-xs font-mono">{index + 1}</span>
                )}
              </div>

              {/* Roadmap Content Card */}
              <div
                className={`rounded-2xl p-6 sm:p-7 border backdrop-blur-xl transition-all shadow-xl ${
                  isProgress
                    ? `${isCyan ? 'border-cyan-500/50 bg-gradient-to-r from-cyan-950/30 to-[#0b1220]/80 shadow-cyan-500/10' : 'border-orange-500/50 bg-gradient-to-r from-orange-950/30 to-[#0b1220]/80 shadow-orange-500/10'}`
                    : 'border-blue-900/30 bg-[#0f172a]/75 hover:border-cyan-500/30'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400">
                      {item.phase}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border ${
                        isDone
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          : isProgress
                            ? `${isCyan ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' : 'bg-orange-500/20 text-orange-300 border-orange-500/40'}`
                            : 'bg-white/5 text-gray-400 border-white/10'
                      }`}
                    >
                      {isDone ? '✓ SELESAI' : isProgress ? '⚡ SEDANG BERJALAN' : 'TARGET MENDATANG'}
                    </span>
                  </div>

                  <span className="text-xs font-mono text-gray-400 bg-white/5 px-2.5 py-1 rounded-md">
                    {item.date}
                  </span>
                </div>

                <h4 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                  {item.title}
                </h4>

                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-2xl">
                  {item.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default RoadmapPage;
