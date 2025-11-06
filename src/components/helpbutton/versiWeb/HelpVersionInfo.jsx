import { Info } from "lucide-react";
import docsData from "../docs/data/docsSections.json";

export default function HelpVersionInfo() {
  // Ambil versi terbaru dari semua dokumen (misalnya dari item terakhir atau versi tertinggi)
  const latestSection = docsData[docsData.length - 1];
  const versiWebsite = latestSection?.version || "v1.0.0";
  const lastUpdated = latestSection?.lastUpdated || "Tidak tersedia";
  const author = latestSection?.author || "Tim Dokumentasi";

  return (
    <div className="p-3 bg-gray-800/40 rounded-lg border border-gray-700/50 text-xs text-gray-300 font-mono space-y-2">
      {/* Versi */}
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1 text-gray-400">
          <Info size={12} /> Versi Website
        </span>
        <span className="text-white">{versiWebsite}</span>
      </div>

      {/* Tanggal pembaruan */}
      <div className="flex items-center justify-between">
        <span className="text-gray-400">Terakhir Diperbarui</span>
        <span className="text-gray-200">{lastUpdated}</span>
      </div>

      {/* Penulis */}
      <div className="flex items-center justify-between">
        <span className="text-gray-400">Dikelola Oleh</span>
        <span className="text-purple-300">{author}</span>
      </div>
    </div>
  );
}
