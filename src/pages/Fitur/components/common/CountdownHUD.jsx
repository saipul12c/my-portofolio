import React from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';

const CountdownHUD = ({
  currentConfig,
  years,
  days,
  hours,
  minutes,
  seconds
}) => {
  const isCyan = currentConfig.themeColor === 'cyan';
  const isPurple = currentConfig.themeColor === 'purple';
  const accentBorder = isCyan ? 'border-cyan-500/30' : isPurple ? 'border-purple-500/30' : 'border-amber-500/30';
  const accentGlow = isCyan ? 'shadow-cyan-500/10' : isPurple ? 'shadow-purple-500/10' : 'shadow-amber-500/10';
  const textGradient = isCyan
    ? 'from-cyan-400 via-teal-300 to-blue-500'
    : isPurple
    ? 'from-purple-400 via-indigo-300 to-blue-500'
    : 'from-amber-400 via-orange-400 to-rose-500';

  const timeUnits = [
    ...(years > 0 ? [{ label: currentConfig.countdownLabels?.years || 'Tahun', value: years }] : []),
    { label: currentConfig.countdownLabels?.days || 'Hari', value: days },
    { label: currentConfig.countdownLabels?.hours || 'Jam', value: hours },
    { label: currentConfig.countdownLabels?.minutes || 'Menit', value: minutes },
    { label: currentConfig.countdownLabels?.seconds || 'Detik', value: seconds }
  ];

  const formattedDate = new Date(currentConfig.launchDate).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className={`relative bg-[#111c34]/70 backdrop-blur-xl rounded-3xl p-5 sm:p-7 border ${accentBorder} shadow-xl ${accentGlow} overflow-hidden`}>
      {/* Ambient Inner Glow */}
      <div 
        className={`absolute -top-20 -right-20 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-20 ${
          isCyan ? 'bg-cyan-500' : isPurple ? 'bg-purple-500' : 'bg-orange-500'
        }`} 
      />

      {/* Top Header inside HUD */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isCyan ? 'bg-cyan-400' : 'bg-amber-400'}`}></span>
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isCyan ? 'bg-cyan-500' : 'bg-amber-500'}`}></span>
          </span>
          <span className="text-[11px] sm:text-xs font-mono font-semibold uppercase tracking-wider text-slate-300">
            LAUNCH PROTOCOL STATUS: <span className={isCyan ? 'text-cyan-400' : 'text-amber-400'}>ACTIVE COUNTDOWN</span>
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>Target: <strong className="text-slate-200">{formattedDate}</strong></span>
        </div>
      </div>

      {/* Main Countdown Units Grid */}
      <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6 flex-wrap">
        {timeUnits.map((unit, index) => (
          <React.Fragment key={unit.label}>
            <motion.div
              whileHover={{ y: -3, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className={`relative flex flex-col items-center justify-center min-w-[70px] sm:min-w-[95px] md:min-w-[115px] py-4 sm:py-5 px-3 rounded-2xl bg-[#0f172a]/70 border border-blue-900/30 backdrop-blur-xl shadow-md group transition-all`}
            >
              {/* Top Accent Pill in card */}
              <div 
                className={`w-6 h-1 rounded-full mb-2 opacity-50 group-hover:opacity-100 transition-opacity ${
                  isCyan ? 'bg-cyan-400' : isPurple ? 'bg-purple-400' : 'bg-amber-400'
                }`} 
              />

              {/* Number display */}
              <span className={`font-mono text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-b ${textGradient} bg-clip-text text-transparent drop-shadow-sm tabular-nums`}>
                {String(unit.value).padStart(2, '0')}
              </span>

              {/* Unit Label */}
              <span className="text-[10px] sm:text-xs uppercase font-medium tracking-wider text-slate-400 mt-1 sm:mt-2 group-hover:text-slate-200 transition-colors">
                {unit.label}
              </span>

              {/* Corner decorative notch */}
              <div className="absolute top-1 right-1 w-1.5 h-1.5 border-t border-r border-white/20 rounded-tr" />
            </motion.div>

            {/* Pulsing Colon divider between units (hidden on mobile if wrapped) */}
            {index < timeUnits.length - 1 && (
              <span className={`hidden sm:inline-block font-mono text-2xl md:text-3xl font-bold animate-pulse ${isCyan ? 'text-cyan-400/60' : 'text-amber-400/60'}`}>
                :
              </span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default CountdownHUD;
