import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Share2, Check } from 'lucide-react';
import getIconComponent from '../../config/iconMapper';
import { playClick, playTabSwitch, isSoundEnabled, setSoundEnabled } from '../../utils/soundEffects';

const ConfigSelector = ({ configList, currentConfig, handleConfigChange }) => {
  const [soundOn, setSoundOn] = useState(() => isSoundEnabled());
  const [copied, setCopied] = useState(false);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    if (next) playClick();
  };

  const handleShare = async () => {
    playClick();
    try {
      if (navigator?.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  return (
    <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-3 w-full">
      {/* Project Switcher Pills */}
      <div className="bg-[#111c34]/80 backdrop-blur-xl rounded-2xl p-1.5 border border-blue-900/40 shadow-lg flex items-center gap-1 max-w-full overflow-x-auto no-scrollbar">
        <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider px-2.5 hidden sm:inline-block font-semibold">
          PROYEK:
        </span>
        {configList.map((item) => {
          const isSelected = currentConfig.id === item.id;
          const BrandIcon = getIconComponent(item.brand.logo);
          const itemIsCyan = item.themeColor === 'cyan';
          const itemIsPurple = item.themeColor === 'purple';

          return (
            <button
              key={item.id}
              onClick={() => {
                if (!isSelected) {
                  playTabSwitch();
                  handleConfigChange(item.id);
                }
              }}
              className={`relative px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center gap-2 shrink-0 ${
                isSelected
                  ? 'text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {/* Active pill background */}
              {isSelected && (
                <motion.div
                  layoutId="activeConfigPill"
                  className={`absolute inset-0 rounded-xl bg-gradient-to-r ${
                    itemIsCyan
                      ? 'from-cyan-600 to-blue-600 shadow-cyan-500/25'
                      : itemIsPurple
                      ? 'from-purple-600 via-indigo-600 to-blue-600 shadow-purple-500/25'
                      : 'from-amber-500 to-rose-600 shadow-amber-500/25'
                  } shadow-md -z-10`}
                  transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                />
              )}
              <BrandIcon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
              <span>{item.brand.name}</span>
              {isSelected && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/30 text-white/90 hidden md:inline-block">
                  {item.version || 'v2.0'}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Action buttons (Sound & Share) */}
      <div className="flex items-center gap-2 self-end sm:self-auto">
        {/* Sound toggle button */}
        <button
          onClick={toggleSound}
          title={soundOn ? 'Suara Aktif' : 'Suara Dibisukan'}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#111c34]/80 hover:bg-[#132242] border border-blue-900/40 text-slate-300 hover:text-white transition-all text-xs shadow-sm cursor-pointer"
        >
          {soundOn ? (
            <>
              <Volume2 className="w-4 h-4 text-emerald-400" />
              <span className="font-mono text-emerald-400 text-[11px]">AUDIO ON</span>
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4 text-slate-500" />
              <span className="font-mono text-slate-400 text-[11px]">MUTED</span>
            </>
          )}
        </button>

        {/* Share button */}
        <button
          onClick={handleShare}
          title="Bagikan Halaman"
          className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#111c34]/80 hover:bg-[#132242] border border-blue-900/40 text-slate-300 hover:text-white transition-all text-xs shadow-sm group cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400 font-semibold text-[11px]">Tersalin!</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4 group-hover:text-cyan-400 transition-colors" />
              <span className="text-[11px]">Bagikan</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ConfigSelector;
