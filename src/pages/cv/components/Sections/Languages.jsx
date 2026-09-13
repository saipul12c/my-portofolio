import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Play } from 'lucide-react';
import SectionWrapper from '../UI/SectionWrapper';
import fallbackDataBahasa from '../../../../data/bahasa/data.json';

const VISIBLE_COUNT = 3;
const ROTATE_INTERVAL = 2000; // 2 detik sekali

const Languages = ({ data }) => {
  const activeData = data || fallbackDataBahasa;
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'sehariHari' | 'pemrograman'
  const [startIndex, setStartIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Proses data bahasa sehari-hari dan bahasa pemrograman dari data.json
  const { allList, sehariHariList, pemrogramanList } = useMemo(() => {
    const rawSehariHari = activeData?.bahasaSehariHari || [];
    const rawPemrograman = activeData?.bahasaPemrograman || [];

    const sehariHari = rawSehariHari.map((item, idx) => ({
      id: `lang-sh-${item.nama || idx}`,
      name: item.nama,
      type: 'Sehari-hari',
      typeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      proficiency: item.tingkat,
      level: item.level || 75,
      icon: item.icon || '🌐',
      color: item.warna || '#10B981'
    }));

    const pemrograman = rawPemrograman.map((item, idx) => ({
      id: `lang-prog-${item.nama || idx}`,
      name: item.nama,
      type: 'Teknologi',
      typeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      proficiency: item.tingkat,
      level: item.level || 80,
      icon: item.icon || '⚡',
      color: item.warna || '#3B82F6'
    }));

    return {
      allList: [...sehariHari, ...pemrograman],
      sehariHariList: sehariHari,
      pemrogramanList: pemrograman
    };
  }, [activeData]);

  // Tentukan daftar aktif sesuai tab filter
  const currentList = useMemo(() => {
    if (activeTab === 'sehariHari') return sehariHariList;
    if (activeTab === 'pemrograman') return pemrogramanList;
    return allList;
  }, [activeTab, allList, sehariHariList, pemrogramanList]);

  // Reset index saat filter tab berubah
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setStartIndex(0);
  };

  // Rotasi dinamis setiap 2 detik
  useEffect(() => {
    if (!currentList || currentList.length <= VISIBLE_COUNT || isPaused) return;

    const timer = setInterval(() => {
      setStartIndex((prev) => (prev + 1) % currentList.length);
    }, ROTATE_INTERVAL);

    return () => clearInterval(timer);
  }, [currentList, isPaused]);

  // Ambil window 3 item yang sedang aktif
  const visibleLanguages = useMemo(() => {
    if (!currentList || currentList.length === 0) return [];
    if (currentList.length <= VISIBLE_COUNT) return currentList;

    const items = [];
    for (let i = 0; i < VISIBLE_COUNT; i++) {
      const idx = (startIndex + i) % currentList.length;
      items.push(currentList[idx]);
    }
    return items;
  }, [currentList, startIndex]);

  return (
    <SectionWrapper>
      <div 
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="relative"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full"></div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                Languages
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {currentList.length > VISIBLE_COUNT && (
              <button
                type="button"
                onClick={() => setIsPaused((prev) => !prev)}
                className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-medium text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/30 px-2.5 py-1 rounded-full transition-colors cursor-pointer"
                title={isPaused ? "Lanjutkan rotasi otomatis" : "Jeda rotasi otomatis"}
              >
                {isPaused ? (
                  <>
                    <Play className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-amber-300">Paused</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span>Live 2s</span>
                  </>
                )}
              </button>
            )}

            <Link 
              to="/bahasa"
              className="text-cyan-400 hover:text-cyan-300 text-sm font-medium inline-flex items-center gap-1 transition-colors group"
            >
              Details 
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Tab Filter Mini (Semua, Sehari-hari, Teknologi) */}
        <div className="flex items-center gap-1.5 mb-4 bg-slate-900/60 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => handleTabChange('all')}
            className={`flex-1 text-xs py-1 px-2 rounded-lg font-medium transition-all ${
              activeTab === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Semua ({allList.length})
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('sehariHari')}
            className={`flex-1 text-xs py-1 px-2 rounded-lg font-medium transition-all ${
              activeTab === 'sehariHari'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Sehari-hari ({sehariHariList.length})
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('pemrograman')}
            className={`flex-1 text-xs py-1 px-2 rounded-lg font-medium transition-all ${
              activeTab === 'pemrograman'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Teknologi ({pemrogramanList.length})
          </button>
        </div>

        {/* Dynamic Languages List */}
        <div className="space-y-3 relative overflow-hidden min-h-[220px]">
          <AnimatePresence initial={false} mode="popLayout">
            {visibleLanguages.map((item) => (
              <motion.div
                key={item.id || item.name}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="group p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/40 hover:border-cyan-500/40 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xl flex-shrink-0">{item.icon}</span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white text-sm truncate group-hover:text-cyan-300 transition-colors">
                          {item.name}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full border ${item.typeColor} font-medium`}>
                          {item.type}
                        </span>
                      </div>
                      <div className="text-gray-400 text-xs truncate max-w-[180px]">
                        {item.proficiency}
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0 ml-2">
                    <span className="text-xs font-semibold text-cyan-300 bg-cyan-950/70 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                      {item.level}%
                    </span>
                  </div>
                </div>

                <div className="w-full bg-slate-700/50 rounded-full h-1.5 overflow-hidden">
                  <motion.div 
                    className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 h-1.5 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${item.level}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Footer info rotasi */}
        {currentList.length > VISIBLE_COUNT && (
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex justify-between items-center text-[11px] text-gray-400">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              Berganti tiap 2 detik ({((startIndex) % currentList.length) + 1}/{currentList.length})
            </span>
            <span className="text-gray-500 text-[10px]">
              {isPaused ? "Klik untuk lanjut" : "Hover untuk jeda"}
            </span>
          </div>
        )}
      </div>
    </SectionWrapper>
  );
};

export default Languages;