import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  GraduationCap, Store, HeartPulse, Handshake, 
  CheckCircle2, ArrowRight, Sparkles, Layers 
} from "lucide-react";

const pillarIcons = {
  GraduationCap: GraduationCap,
  Store: Store,
  HeartPulse: HeartPulse,
  Handshake: Handshake,
};

export default function KKNPillars({ pillars = [], onSelectPillar }) {
  const [activeTab, setActiveTab] = useState("all");

  const filteredPillars = activeTab === "all" 
    ? pillars 
    : pillars.filter(p => p.id === activeTab);

  return (
    <section id="proker" className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-white/10">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3.5 py-1 rounded-full inline-block mb-3">
            Program Kerja Terpadu
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white flex items-center gap-3">
            <Layers className="w-8 h-8 text-cyan-400" />
            4 Pilar Pengabdian Masyarakat
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mt-2">
            Implementasi Tri Dharma Perguruan Tinggi yang menyentuh sektor esensial desa demi kemandirian dan keberlanjutan.
          </p>
        </div>

        {/* Tab Filter Pills */}
        <div className="flex flex-wrap gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md self-start md:self-auto">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "all"
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Semua Pilar ({pillars.length})
          </button>
          {pillars.map((pil) => (
            <button
              key={pil.id}
              onClick={() => setActiveTab(pil.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === pil.id
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {pil.category}
            </button>
          ))}
        </div>
      </div>

      {/* Pillars Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredPillars.map((pillar, index) => {
          const IconComponent = pillarIcons[pillar.icon] || GraduationCap;

          return (
            <motion.div
              key={pillar.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className={`rounded-3xl bg-[#0f172a]/90 backdrop-blur-xl border ${pillar.border} p-6 sm:p-8 flex flex-col justify-between shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 relative overflow-hidden group`}
            >
              {/* Gradient light on top */}
              <div
                className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${pillar.accent}`}
              />

              <div>
                {/* Header card */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${pillar.accent} flex items-center justify-center text-white shadow-lg shrink-0 group-hover:scale-105 transition-transform`}
                  >
                    <IconComponent className="w-7 h-7" />
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${pillar.badgeBg}`}
                  >
                    {pillar.category}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-cyan-400/90 text-xs sm:text-sm font-medium mb-3">
                  {pillar.tagline}
                </p>
                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-6">
                  {pillar.description}
                </p>

                {/* Sub-Programs List */}
                <div className="space-y-3 mb-6">
                  <h4 className="text-[11px] uppercase tracking-wider font-bold text-gray-400">
                    Program Terlaksana:
                  </h4>
                  <div className="grid grid-cols-1 gap-2.5">
                    {pillar.programs.map((pro, pIdx) => (
                      <div
                        key={pIdx}
                        className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/15 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                      >
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                          <span className="font-semibold text-gray-200">{pro.name}</span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0 self-start sm:self-auto">
                          <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-medium border border-blue-500/20">
                            {pro.target}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-medium border border-emerald-500/20">
                            {pro.metric}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Action */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  {pillar.programs.length} Program Kerja
                </span>
                <button
                  onClick={() => onSelectPillar(pillar)}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer group/btn"
                >
                  Detail Kegiatan
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
