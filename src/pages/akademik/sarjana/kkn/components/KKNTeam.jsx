import React from "react";
import { motion } from "framer-motion";
import { Users, Quote, CheckCircle2, Award, Sparkles } from "lucide-react";

export default function KKNTeam({ team = [] }) {
  return (
    <section id="tim" className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-16">
        <span className="text-xs uppercase tracking-widest font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3.5 py-1 rounded-full inline-block mb-3">
          Solidaritas & Kolaborasi
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white flex items-center justify-center gap-3">
          <Users className="w-8 h-8 text-cyan-400" />
          Struktur Tim Pengabdian KKN
        </h2>
        <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto mt-2">
          Anggota kelompok mahasiswa lintas program studi yang saling melengkapi dalam dedikasi pengabdian masyarakat.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {team.map((member, index) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.07 }}
            whileHover={{ y: -6 }}
            className="rounded-2xl bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 hover:border-cyan-400/50 p-6 flex flex-col justify-between shadow-xl transition-all duration-300 relative group overflow-hidden"
          >
            {/* Top decorative glow */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all pointer-events-none" />

            <div>
              {/* Avatar & Badge */}
              <div className="flex items-center gap-4 mb-4">
                <div className="relative">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-cyan-400/40 group-hover:border-cyan-400 transition-colors shadow-md"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-cyan-500 text-white flex items-center justify-center text-[10px]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-white text-sm sm:text-base leading-tight group-hover:text-cyan-300 transition-colors">
                    {member.name}
                  </h3>
                  <span className="text-xs font-semibold text-cyan-400 mt-0.5 block">
                    {member.role}
                  </span>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {member.prodi}
                  </p>
                </div>
              </div>

              {/* Responsibilities */}
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 mb-4 text-xs text-gray-300 leading-relaxed">
                <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                  Peran & Tanggung Jawab:
                </span>
                {member.responsibilities}
              </div>
            </div>

            {/* Quote */}
            <div className="pt-3 border-t border-white/10 flex items-start gap-2 text-xs italic text-gray-400">
              <Quote className="w-4 h-4 text-cyan-400/60 shrink-0 mt-0.5" />
              <span>"{member.quote}"</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
