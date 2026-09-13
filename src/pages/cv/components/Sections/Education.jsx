import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Sparkles, ArrowRight, Play, GraduationCap } from 'lucide-react';
import SectionWrapper from '../UI/SectionWrapper';
import fallbackEducationData from '../../../../data/pendidikan/data.json';

const VISIBLE_COUNT = 2;
const ROTATE_INTERVAL = 2000; // 2 detik sekali

const Education = ({ data }) => {
  const activeData = data || fallbackEducationData;
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'formal' | 'courses'
  const [startIndex, setStartIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Proses data pendidikan formal dan kursus dari data.json
  const { allList, formalList, coursesList } = useMemo(() => {
    const rawEducation = activeData?.education || [];
    const rawCourses = activeData?.courses || [];

    const formal = rawEducation.map((item, idx) => ({
      id: `edu-formal-${item.degree}-${idx}`,
      title: item.degree,
      institution: item.institution,
      period: item.year,
      type: 'Pendidikan',
      typeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      gpa: item.gpa,
      status: item.status,
      logo: item.logo || '🎓',
      description: item.description,
      highlight: item.achievements?.[0] || item.skills?.[0]
    }));

    const courses = rawCourses.map((item, idx) => ({
      id: `edu-course-${item.title}-${idx}`,
      title: item.title,
      institution: item.provider,
      period: item.year,
      type: 'Kursus',
      typeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      duration: item.duration,
      logo: item.logo || '📜',
      description: item.description,
      highlight: item.skills_learned?.[0]
    }));

    return {
      allList: [...formal, ...courses],
      formalList: formal,
      coursesList: courses
    };
  }, [activeData]);

  // Tentukan daftar aktif sesuai tab filter
  const currentList = useMemo(() => {
    if (activeTab === 'formal') return formalList;
    if (activeTab === 'courses') return coursesList;
    return allList;
  }, [activeTab, allList, formalList, coursesList]);

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

  // Ambil window 2 item yang sedang aktif
  const visibleEducation = useMemo(() => {
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
                Education
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
              to="/education"
              className="text-cyan-400 hover:text-cyan-300 text-sm font-medium inline-flex items-center gap-1 transition-colors group"
            >
              Details 
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Tab Filter Mini (Semua, Pendidikan, Kursus) */}
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
            onClick={() => handleTabChange('formal')}
            className={`flex-1 text-xs py-1 px-2 rounded-lg font-medium transition-all ${
              activeTab === 'formal'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Pendidikan ({formalList.length})
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('courses')}
            className={`flex-1 text-xs py-1 px-2 rounded-lg font-medium transition-all ${
              activeTab === 'courses'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Kursus ({coursesList.length})
          </button>
        </div>

        {/* Dynamic Education List */}
        <div className="space-y-3 relative overflow-hidden min-h-[220px]">
          <AnimatePresence initial={false} mode="popLayout">
            {visibleEducation.map((item) => (
              <motion.div
                key={item.id || item.title}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="group p-3.5 rounded-xl bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/40 hover:border-cyan-500/40 transition-all duration-300"
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl p-2 rounded-lg bg-slate-900/60 border border-slate-700/50 flex-shrink-0">
                    {item.logo}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-white text-sm truncate group-hover:text-cyan-300 transition-colors">
                        {item.title}
                      </h3>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full border ${item.typeColor} font-medium flex-shrink-0`}>
                        {item.type}
                      </span>
                    </div>

                    <p className="text-cyan-400 text-xs font-medium truncate mb-2">
                      {item.institution}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="text-gray-400 flex items-center gap-1 text-[11px]">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {item.period}
                      </span>

                      <div className="flex items-center gap-1.5">
                        {item.gpa && (
                          <span className="text-cyan-300 text-[11px] font-semibold bg-cyan-950/70 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                            IPK: {item.gpa}
                          </span>
                        )}
                        {item.status && (
                          <span className="text-amber-300 text-[10px] font-semibold bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded-full">
                            {item.status}
                          </span>
                        )}
                        {item.duration && (
                          <span className="text-blue-300 text-[10px] font-medium bg-blue-950/60 border border-blue-500/30 px-2 py-0.5 rounded-full">
                            {item.duration}
                          </span>
                        )}
                      </div>
                    </div>

                    {item.highlight && (
                      <p className="text-gray-400/80 text-[11px] mt-2 pt-2 border-t border-slate-700/40 line-clamp-1 italic">
                        ⭐ {item.highlight}
                      </p>
                    )}
                  </div>
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

export default Education;