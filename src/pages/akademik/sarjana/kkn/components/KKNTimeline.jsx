import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, Clock, CheckCircle2, Search, Filter, 
  Sparkles, Layers, ListFilter, Users, MapPin, ChevronDown, ChevronUp 
} from "lucide-react";
import { kknDailyLogs, kknPhases } from "../data/kknData";

export default function KKNTimeline() {
  const [viewMode, setViewMode] = useState("daily"); // 'daily' | 'phases'
  const [selectedWeek, setSelectedWeek] = useState("all"); // 'all' | 1 | 2 | 3 | 4 | 5
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedDays, setExpandedDays] = useState({});

  // Kategori unik dari log harian
  const categories = useMemo(() => {
    return [
      "all",
      "Pendidikan",
      "Keagamaan",
      "Festival",
      "Lingkungan",
      "Kesehatan",
      "Silaturahmi",
      "Infrastruktur"
    ];
  }, []);

  // Filter Log Harian
  const filteredDailyLogs = useMemo(() => {
    return kknDailyLogs.filter((log) => {
      // Filter Pekan
      if (selectedWeek !== "all" && log.weekNumber !== Number(selectedWeek)) {
        return false;
      }

      // Filter Kategori
      if (selectedCategory !== "all") {
        const catLower = selectedCategory.toLowerCase();
        const matchesCategory =
          (log.category && log.category.toLowerCase().includes(catLower)) ||
          (log.highlight && log.highlight.toLowerCase().includes(catLower));
        if (!matchesCategory) return false;
      }

      // Filter Pencarian
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchTitle = log.highlight.toLowerCase().includes(term);
        const matchDate = `${log.dayName} ${log.date}`.toLowerCase().includes(term);
        const matchActivities = log.activities.some((act) => act.toLowerCase().includes(term));
        const matchCategory = log.category.toLowerCase().includes(term);
        return matchTitle || matchDate || matchActivities || matchCategory;
      }

      return true;
    });
  }, [selectedWeek, selectedCategory, searchTerm]);

  // Toggle expand card
  const toggleExpand = (dayNumber) => {
    setExpandedDays((prev) => ({
      ...prev,
      [dayNumber]: !prev[dayNumber],
    }));
  };

  const expandAll = () => {
    const all = {};
    filteredDailyLogs.forEach((l) => (all[l.dayNumber] = true));
    setExpandedDays(all);
  };

  const collapseAll = () => {
    setExpandedDays({});
  };

  return (
    <section id="linimasa" className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      {/* Header Section */}
      <div className="text-center mb-12">
        <span className="text-xs uppercase tracking-widest font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3.5 py-1 rounded-full inline-block mb-3">
          Laporan Resmi Harian
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white flex items-center justify-center gap-3">
          <Clock className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-400" />
          Timeline & Log Kegiatan Harian
        </h2>
        <p className="text-gray-400 text-sm sm:text-base max-w-3xl mx-auto mt-3 leading-relaxed">
          Catatan rinci dan terverifikasi selama <strong className="text-cyan-300">32 hari pengabdian penuh</strong> (03 Oktober - 03 November 2026) mahasiswa KKN UIN Antasari di Desa Kundan, Haruyan Dayak.
        </p>

        {/* Mode Toggle Switch */}
        <div className="mt-8 inline-flex items-center p-1.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
          <button
            onClick={() => setViewMode("daily")}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
              viewMode === "daily"
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Calendar className="w-4 h-4" />
            Log Harian Lengkap ({kknDailyLogs.length} Hari)
          </button>
          <button
            onClick={() => setViewMode("phases")}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
              viewMode === "phases"
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Layers className="w-4 h-4" />
            Ikhtisar 5 Fase Perjalanan
          </button>
        </div>
      </div>

      {viewMode === "daily" ? (
        /* ========================================================
           TAMPILAN 1: LOG HARIAN LENGKAP (32 HARI)
        ======================================================== */
        <div>
          {/* Controls: Search & Filters */}
          <div className="bg-[#0f172a]/90 border border-white/10 rounded-3xl p-5 sm:p-6 mb-10 backdrop-blur-xl shadow-2xl space-y-5">
            {/* Search Input Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari kegiatan (futsal, habsyi, posyandu, ayam buluh, guru busu...)"
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-xs sm:text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white cursor-pointer"
                  >
                    Hapus
                  </button>
                )}
              </div>

              {/* Action Buttons: Expand/Collapse All */}
              <div className="flex items-center gap-2 text-xs font-semibold self-end md:self-auto">
                <button
                  onClick={expandAll}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 transition-colors cursor-pointer"
                >
                  Buka Semua Detail
                </button>
                <button
                  onClick={collapseAll}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 transition-colors cursor-pointer"
                >
                  Tutup Semua Detail
                </button>
              </div>
            </div>

            {/* Filter Pekan (Week Pills) */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center gap-3">
              <span className="text-xs font-bold text-gray-400 shrink-0 flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-cyan-400" />
                Pilih Pekan:
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "all", label: "Semua Pekan (32 Hari)" },
                  { id: 1, label: "Pekan 1 (Hari 1-7)" },
                  { id: 2, label: "Pekan 2 (Hari 8-14)" },
                  { id: 3, label: "Pekan 3 (Hari 15-21)" },
                  { id: 4, label: "Pekan 4 (Hari 22-29)" },
                  { id: 5, label: "Pekan 5 (Hari 30-32)" },
                ].map((w) => (
                  <button
                    key={w.id}
                    onClick={() => setSelectedWeek(w.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      selectedWeek === w.id
                        ? "bg-cyan-500 text-white shadow-md shadow-cyan-500/20"
                        : "bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/5"
                    }`}
                  >
                    {w.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Kategori Tag */}
            <div className="pt-3 border-t border-white/5 flex flex-col sm:flex-row sm:items-center gap-3">
              <span className="text-xs font-bold text-gray-400 shrink-0 flex items-center gap-1.5">
                <ListFilter className="w-3.5 h-3.5 text-purple-400" />
                Kategori:
              </span>
              <div className="flex flex-wrap gap-2">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedCategory(c)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer capitalize ${
                      selectedCategory === c
                        ? "bg-purple-500 text-white shadow-md shadow-purple-500/20"
                        : "bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
                    }`}
                  >
                    {c === "all" ? "Semua Kategori" : c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Result Count Info */}
          <div className="flex items-center justify-between text-xs text-gray-400 mb-6 px-2">
            <span>
              Menampilkan <strong className="text-cyan-400">{filteredDailyLogs.length}</strong> dari 32 hari kegiatan
            </span>
            {(selectedWeek !== "all" || selectedCategory !== "all" || searchTerm) && (
              <button
                onClick={() => {
                  setSelectedWeek("all");
                  setSelectedCategory("all");
                  setSearchTerm("");
                }}
                className="text-cyan-400 hover:underline cursor-pointer"
              >
                Reset Semua Filter
              </button>
            )}
          </div>

          {/* Empty State */}
          {filteredDailyLogs.length === 0 && (
            <div className="text-center py-16 bg-white/5 rounded-3xl border border-white/10 p-8">
              <Calendar className="w-12 h-12 text-cyan-400 mx-auto mb-3 opacity-60" />
              <h3 className="text-lg font-bold text-white mb-1">Tidak Ada Kegiatan yang Cocok</h3>
              <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto">
                Coba gunakan kata kunci pencarian lain atau pilih filter "Semua Pekan".
              </p>
            </div>
          )}

          {/* Daily Cards Grid / List */}
          <div className="space-y-4">
            {filteredDailyLogs.map((item, index) => {
              const isExpanded = expandedDays[item.dayNumber] !== false; // default expanded

              return (
                <motion.div
                  key={item.dayNumber}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: (index % 10) * 0.04 }}
                  className="rounded-2xl bg-[#0f172a]/85 border border-white/10 hover:border-cyan-400/40 backdrop-blur-xl overflow-hidden shadow-xl transition-all duration-300"
                >
                  {/* Card Header Bar (Clickable) */}
                  <div
                    onClick={() => toggleExpand(item.dayNumber)}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-white/5 transition-colors border-b border-white/5"
                  >
                    <div className="flex items-center gap-3">
                      {/* Day Number Badge */}
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-extrabold flex flex-col items-center justify-center shadow-lg shadow-cyan-500/20 shrink-0">
                        <span className="text-[10px] uppercase font-semibold leading-none text-cyan-200">HARI</span>
                        <span className="text-lg sm:text-xl leading-none mt-0.5">{item.dayNumber}</span>
                      </div>

                      <div>
                        {/* Day & Date */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs sm:text-sm font-bold text-cyan-300">
                            {item.dayName}, {item.date}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-gray-300 border border-white/10 flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5 text-cyan-400" />
                            {item.time}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/20 font-medium">
                            Pekan {item.weekNumber}
                          </span>
                        </div>

                        {/* Title Highlight */}
                        <h3 className="text-sm sm:text-base font-bold text-white mt-1 group-hover:text-cyan-300 transition-colors">
                          {item.highlight}
                        </h3>
                      </div>
                    </div>

                    {/* Right Chips & Toggle Icon */}
                    <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                      <span className="text-[11px] px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-semibold hidden md:inline-block">
                        {item.category}
                      </span>
                      <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  {/* Card Body (Activities Details) */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="p-4 sm:p-5 bg-black/20 space-y-3"
                      >
                        <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                          Rincian Uraian Kegiatan:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {item.activities.map((act, aIdx) => (
                            <div
                              key={aIdx}
                              className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-start gap-2.5 text-xs text-gray-200"
                            >
                              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                              <span className="leading-relaxed">{act}</span>
                            </div>
                          ))}
                        </div>

                        {/* Footer Info */}
                        <div className="pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-gray-400">
                          <div className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Peran & Keterlibatan: <strong className="text-white">{item.role}</strong></span>
                          </div>
                          <div className="flex items-center gap-1 text-cyan-400">
                            <MapPin className="w-3 h-3 text-pink-400" />
                            <span>Desa Kundan, Haruyan Dayak</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      ) : (
        /* ========================================================
           TAMPILAN 2: IKHTISAR 5 FASE PERJALANAN KKN
        ======================================================== */
        <div className="space-y-6 max-w-5xl mx-auto">
          {kknPhases.map((phase, pIdx) => (
            <motion.div
              key={phase.phaseNumber}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: pIdx * 0.1 }}
              className={`rounded-3xl bg-[#0f172a]/90 backdrop-blur-xl border ${phase.borderColor} p-6 sm:p-8 shadow-2xl relative overflow-hidden`}
            >
              {/* Top Accent Line */}
              <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${phase.color}`} />

              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-cyan-300 border border-white/10">
                      {phase.badge}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                      {phase.dates}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    {phase.title}
                  </h3>
                </div>

                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${phase.color} text-white font-extrabold flex items-center justify-center text-lg shadow-lg shrink-0 self-start`}>
                  #{phase.phaseNumber}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-6">
                {phase.desc}
              </p>

              {/* Key Points */}
              <div className="space-y-2.5 pt-4 border-t border-white/10">
                <h4 className="text-[11px] uppercase tracking-wider font-bold text-gray-400">
                  Sorotan Capaian Fase Ini:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {phase.keyPoints.map((pt, kIdx) => (
                    <div
                      key={kIdx}
                      className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-start gap-2.5 text-xs text-gray-200"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
