import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Pause, Play } from 'lucide-react';
import SectionWrapper from '../UI/SectionWrapper';

const VISIBLE_COUNT = 5;
const ROTATE_INTERVAL = 2000; // 2 detik sekali

const TechnicalSkills = ({ skills = [] }) => {
  const [startIndex, setStartIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Interval rotasi dinamis setiap 2 detik
  useEffect(() => {
    if (!skills || skills.length <= VISIBLE_COUNT || isPaused) return;

    const timer = setInterval(() => {
      setStartIndex((prev) => (prev + 1) % skills.length);
    }, ROTATE_INTERVAL);

    return () => clearInterval(timer);
  }, [skills, isPaused]);

  // Ambil window 5 skill yang sedang aktif
  const visibleSkills = useMemo(() => {
    if (!skills || skills.length === 0) return [];
    if (skills.length <= VISIBLE_COUNT) return skills;

    const items = [];
    for (let i = 0; i < VISIBLE_COUNT; i++) {
      const idx = (startIndex + i) % skills.length;
      items.push(skills[idx]);
    }
    return items;
  }, [skills, startIndex]);

  return (
    <SectionWrapper>
      <div 
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="relative"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full"></div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                Technical Skills
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {skills.length > VISIBLE_COUNT && (
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
              to="/SoftSkills"
              className="text-cyan-400 hover:text-cyan-300 text-sm font-medium inline-flex items-center gap-1 transition-colors group"
            >
              Details 
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Dynamic Skills List */}
        <div className="space-y-3 relative overflow-hidden min-h-[300px]">
          <AnimatePresence initial={false} mode="popLayout">
            {visibleSkills.map((skill) => (
              <motion.div
                key={skill.id || skill.name}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="group p-2.5 rounded-xl bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/40 hover:border-cyan-500/40 transition-all duration-300"
              >
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-gray-200 text-sm font-medium flex items-center gap-2">
                    <span className="text-cyan-400 text-base">{skill.icon || '⚡'}</span>
                    <span className="truncate max-w-[190px] group-hover:text-white transition-colors">
                      {skill.name}
                    </span>
                  </span>
                  <span className="text-xs font-semibold text-cyan-300 bg-cyan-950/70 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                    {skill.level}%
                  </span>
                </div>
                <div className="w-full bg-slate-700/50 rounded-full h-1.5 overflow-hidden">
                  <motion.div 
                    className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 h-1.5 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.level}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Footer info rotasi */}
        {skills.length > VISIBLE_COUNT && (
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex justify-between items-center text-[11px] text-gray-400">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              Berganti tiap 2 detik ({((startIndex) % skills.length) + 1}/{skills.length})
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

export default TechnicalSkills;