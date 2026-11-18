import React from "react";
import { motion } from "framer-motion";
import { BookMarked, FileText, Video, Award, Download, ExternalLink, Sparkles } from "lucide-react";

const outputIcons = {
  BookMarked: BookMarked,
  FileText: FileText,
  Video: Video,
  Award: Award,
};

export default function KKNOutputs({ outputs = [] }) {
  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-16">
        <span className="text-xs uppercase tracking-widest font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1 rounded-full inline-block mb-3">
          Artefak & Hasil Pengabdian
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white flex items-center justify-center gap-3">
          <BookMarked className="w-8 h-8 text-emerald-400" />
          Luaran & Produk Nyata KKN
        </h2>
        <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto mt-2">
          Karya akademik dan publikasi aplikatif yang dihibahkan untuk mendukung tata kelola dan kemajuan desa.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {outputs.map((item, index) => {
          const IconComponent = outputIcons[item.icon] || FileText;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              whileHover={{ y: -6 }}
              className="rounded-2xl bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 hover:border-emerald-500/40 p-6 flex flex-col justify-between shadow-xl transition-all duration-300"
            >
              <div>
                {/* Header Icon & Badge */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    {item.badge}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-1.5 leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs font-medium text-emerald-400 mb-3">
                  {item.format}
                </p>
                <p className="text-xs text-gray-300 leading-relaxed mb-6">
                  {item.desc}
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-white/10">
                <button
                  onClick={() => alert(`Dokumen "${item.title}" diarsipkan dalam laporan resmi KKN.`)}
                  className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-500/40 text-xs font-semibold text-gray-200 hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  Akses Dokumen
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
