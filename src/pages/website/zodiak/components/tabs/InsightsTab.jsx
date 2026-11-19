import React from "react";
import { getElementColorLight } from "../../utils/elementColors";
import { getHoroscopeAspects } from "../../data/horoscopeAspects";

export const InsightsTab = ({ zodiak }) => {
  const aspects = getHoroscopeAspects(zodiak.nama, zodiak.elemen);

  return (
    <div className="bg-white/10 p-6 rounded-xl animate-fadeIn space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b border-white/10 pb-4">
        <div>
          <h3 className="text-xl font-bold text-pink-300">
            💡 Insights & Ramalan 3 Aspek Kehidupan
          </h3>
          <p className="text-xs text-gray-300 mt-1">
            Panduan harian energi kosmis untuk {zodiak.namaUser || zodiak.nama}
          </p>
        </div>
        <div className="text-xs bg-pink-500/20 text-pink-200 border border-pink-400/30 px-3 py-1 rounded-full font-semibold">
          Update Frekuensi Kosmis Harian
        </div>
      </div>

      {/* 3 Aspek Horoskop Utama */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Asmara */}
        <div className="p-4 bg-gradient-to-br from-pink-950/40 to-black/40 rounded-2xl border border-pink-400/30 shadow-lg">
          <div className="flex justify-between items-center mb-3">
            <span className="text-2xl">❤️</span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-400/30">
              Skor: {aspects.asmara.skor}%
            </span>
          </div>
          <h4 className="font-bold text-white text-base mb-1">Asmara & Relasi</h4>
          <p className="text-xs font-semibold text-pink-300 mb-2">{aspects.asmara.status}</p>
          <p className="text-xs text-gray-200 leading-relaxed mb-3">{aspects.asmara.prediksi}</p>
          <div className="pt-2 border-t border-white/10 text-[11px] text-pink-200/90 italic">
            💡 Tips: {aspects.asmara.tips}
          </div>
        </div>

        {/* Karir & Keuangan */}
        <div className="p-4 bg-gradient-to-br from-amber-950/40 to-black/40 rounded-2xl border border-amber-400/30 shadow-lg">
          <div className="flex justify-between items-center mb-3">
            <span className="text-2xl">💼</span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
              Skor: {aspects.karir.skor}%
            </span>
          </div>
          <h4 className="font-bold text-white text-base mb-1">Karir & Keuangan</h4>
          <p className="text-xs font-semibold text-amber-300 mb-2">{aspects.karir.status}</p>
          <p className="text-xs text-gray-200 leading-relaxed mb-3">{aspects.karir.prediksi}</p>
          <div className="pt-2 border-t border-white/10 text-[11px] text-amber-200/90 italic">
            💡 Tips: {aspects.karir.tips}
          </div>
        </div>

        {/* Kesehatan */}
        <div className="p-4 bg-gradient-to-br from-emerald-950/40 to-black/40 rounded-2xl border border-emerald-400/30 shadow-lg">
          <div className="flex justify-between items-center mb-3">
            <span className="text-2xl">🧘</span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              Skor: {aspects.kesehatan.skor}%
            </span>
          </div>
          <h4 className="font-bold text-white text-base mb-1">Kesehatan & Jiwa</h4>
          <p className="text-xs font-semibold text-emerald-300 mb-2">{aspects.kesehatan.status}</p>
          <p className="text-xs text-gray-200 leading-relaxed mb-3">{aspects.kesehatan.prediksi}</p>
          <div className="pt-2 border-t border-white/10 text-[11px] text-emerald-200/90 italic">
            💡 Tips: {aspects.kesehatan.tips}
          </div>
        </div>
      </div>

      {/* Mood & Waktu Terbaik */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        <div className="space-y-4">
          <div className={`${getElementColorLight(zodiak.elemen)} p-4 rounded-xl border border-white/10`}>
            <h4 className="font-bold mb-2 flex items-center gap-2">
              <span>🌙</span> Mood Hari Ini
            </h4>
            <div className={`${zodiak.moodWarna} p-3 rounded-lg mb-2 text-white shadow`}>
              <p className="text-base font-semibold">{zodiak.mood}</p>
            </div>
            <p className="text-xs text-gray-300">
              Tingkat Energi Kosmis: <span className="font-bold text-white">{zodiak.moodEnergi}</span>
            </p>
          </div>

          <div className="bg-gradient-to-r from-yellow-500/10 to-amber-500/10 p-4 rounded-xl border border-yellow-400/20">
            <h4 className="font-bold mb-2 flex items-center gap-2 text-yellow-300">
              <span>⭐</span> Aktivitas yang Direkomendasikan
            </h4>
            <ul className="text-xs space-y-1.5 text-gray-200">
              {zodiak.skorKosmis?.nilai >= 80 && (
                <>
                  <li>• Ambil risiko terukur dan inisiatif baru</li>
                  <li>• Mulai proyek besar yang sempat tertunda</li>
                  <li>• Bangun networking dan sampaikan ide brilian</li>
                </>
              )}
              {zodiak.skorKosmis?.nilai >= 60 && zodiak.skorKosmis?.nilai < 80 && (
                <>
                  <li>• Fokus menyelesaikan pekerjaan rutin dengan rapi</li>
                  <li>• Evaluasi rencana mingguan dan kelola waktu</li>
                  <li>• Kolaborasi suportif dengan rekan atau tim</li>
                </>
              )}
              {zodiak.skorKosmis?.nilai < 60 && (
                <>
                  <li>• Istirahat sejenak dan dengarkan tubuhmu</li>
                  <li>• Lakukan aktivitas relaksasi dan hobi ringan</li>
                  <li>• Meditasi atau journaling refleksi diri</li>
                </>
              )}
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-4 rounded-xl border border-green-400/20">
            <h4 className="font-bold mb-2 flex items-center gap-2 text-green-300">
              <span>📈</span> Waktu & Elemen Terbaik
            </h4>
            <ul className="text-xs space-y-2 text-gray-200">
              <li><span className="font-semibold text-gray-300">Hari Terbaik:</span> {zodiak.hari_keberuntungan}</li>
              <li><span className="font-semibold text-gray-300">Musim Penyelaras:</span> {zodiak.musim}</li>
              <li><span className="font-semibold text-gray-300">Fase Bulan:</span> {zodiak.fase_bulan}</li>
              {zodiak.angka_keberuntungan?.length > 0 && (
                <li><span className="font-semibold text-gray-300">Angka Keberuntungan:</span> {zodiak.angka_keberuntungan.join(", ")}</li>
              )}
            </ul>
          </div>

          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-4 rounded-xl border border-purple-400/20">
            <h4 className="font-bold mb-2 flex items-center gap-2 text-purple-300">
              <span>🎭</span> Sifat Dominan
            </h4>
            <div className="flex flex-wrap gap-2">
              {zodiak.kekuatan?.slice(0, 4).map((k, idx) => (
                <span key={idx} className="text-xs bg-purple-500/20 border border-purple-400/30 px-3 py-1 rounded-full text-purple-200">
                  {k}
                </span>
              ))}
            </div>
            <p className="text-xs mt-3 text-gray-300">
              Fokus pengembangan utama: <span className="font-semibold text-pink-300">{zodiak.kekuatan?.[0]}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
