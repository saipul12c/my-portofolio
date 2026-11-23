import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Share2, Check, ArrowLeft } from 'lucide-react';
import getIconComponent from '../../config/iconMapper';
import { playClick, playTabSwitch, isSoundEnabled, setSoundEnabled } from '../../utils/soundEffects';

const ConfigSelector = ({ configList, currentConfig, handleConfigChange, isSingleProject = false }) => {
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

  const CurrentBrandIcon = getIconComponent(currentConfig.brand.logo);
  const isCyan = currentConfig.themeColor === 'cyan';
  const isPurple = currentConfig.themeColor === 'purple';

  return (
    <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-3 w-full">
      {/* Project Switcher or Single Project Indicator */}
      {isSingleProject ? (
        <div className="bg-[#111c34]/80 backdrop-blur-xl rounded-2xl p-1.5 border border-blue-900/40 shadow-lg flex items-center gap-2 max-w-full overflow-x-auto no-scrollbar">
          <Link
            to="/"
            className="text-xs text-slate-300 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 transition-all font-medium border border-white/5"
            title="Kembali ke Beranda"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Beranda</span>
          </Link>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-2 px-2.5 py-1 text-xs font-semibold text-white">
            <CurrentBrandIcon className={`w-4 h-4 ${isCyan ? 'text-cyan-400' : isPurple ? 'text-purple-400' : 'text-orange-400'}`} />
            <span>{currentConfig.brand.name}</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/40 text-slate-300">
              {currentConfig.version || 'v1.0'}
            </span>
          </div>
        </div>
      ) : (
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
      )}

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
              <VolumeX className="w-4 h-4 text-slate-400" />
              <span className="font-mono text-slate-400 text-[11px]">AUDIO OFF</span>
            </>
          )}
        </button>

        {/* Share button */}
        <button
          onClick={handleShare}
          title="Salin Tautan Halaman"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#111c34]/80 hover:bg-[#132242] border border-blue-900/40 text-slate-300 hover:text-white transition-all text-xs shadow-sm cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400 text-[11px] font-semibold">TERSALIN!</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4 text-cyan-400" />
              <span className="text-[11px] font-medium hidden xs:inline">BAGIKAN</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ConfigSelector;
