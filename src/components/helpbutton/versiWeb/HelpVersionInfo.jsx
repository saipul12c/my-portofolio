import { Info, Calendar, User } from "lucide-react";
import docsData from "../docs/data/docsSections.json";

export default function HelpVersionInfo() {
  // Ambil versi terbaru dari semua dokumen
  const latestSection = docsData?.[docsData.length - 1] || {};
  const versiWebsite = latestSection.version || "v1.0.0";
  const lastUpdated = latestSection.lastUpdated || "Belum ada data";
  const author = latestSection.author || "Tim Dokumentasi";

  return (
    <section
      className="relative overflow-hidden rounded-xl border border-gray-700/50 
                 bg-gradient-to-b from-gray-900/80 to-gray-800/40 p-6 
                 shadow-lg backdrop-blur-sm transition-all duration-300 
                 hover:border-gray-600/70 hover:shadow-xl"
    >
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.08),transparent_70%)] pointer-events-none" />

      {/* Header */}
      <header className="relative mb-5">
        <div className="flex items-center gap-2">
          <Info size={16} className="text-blue-400" />
          <h2 className="text-sm md:text-base font-semibold text-gray-100 tracking-wide">
            Informasi Versi Website
          </h2>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          Detail versi terbaru, pembaruan, dan pengelola dokumentasi.
        </p>
      </header>

      {/* Konten */}
      <div className="relative grid gap-3 text-sm font-mono">
        {/* Versi */}
        <div className="flex items-center justify-between border-b border-gray-700/40 pb-2">
          <span className="flex items-center gap-2 text-gray-400">
            <Info size={13} /> Versi Website
          </span>
          <span
            className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-300 
                       font-semibold border border-blue-500/20"
          >
            {versiWebsite}
          </span>
        </div>

        {/* Tanggal Pembaruan */}
        <div className="flex items-center justify-between border-b border-gray-700/40 pb-2">
          <span className="flex items-center gap-2 text-gray-400">
            <Calendar size={13} /> Terakhir Diperbarui
          </span>
          <span className="text-green-300">{lastUpdated}</span>
        </div>

        {/* Penulis */}
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-gray-400">
            <User size={13} /> Dikelola Oleh
          </span>
          <span className="text-purple-300 font-medium">{author}</span>
        </div>
      </div>

      {/* Footer / Meta */}
      <footer className="mt-5 pt-3 border-t border-gray-700/50 text-[10px] text-gray-500 text-right">
        © {new Date().getFullYear()} Sistem Dokumentasi Pagelaran — All rights reserved.
      </footer>
    </section>
  );
}
