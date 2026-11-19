import React from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { ProgressBar } from "../ProgressBar";

export const PersonalityTab = ({ zodiak }) => {
  if (!zodiak.kepribadian) return null;

  const chartData = [
    { subject: "Intelektual", value: zodiak.kepribadian.intelektual, fullMark: 100 },
    { subject: "Emosional", value: zodiak.kepribadian.emosional, fullMark: 100 },
    { subject: "Spiritual", value: zodiak.kepribadian.spiritual, fullMark: 100 },
    { subject: "Sosial", value: zodiak.kepribadian.sosial, fullMark: 100 },
    { subject: "Fisik", value: zodiak.kepribadian.fisik, fullMark: 100 }
  ];

  return (
    <div className="bg-white/10 p-6 rounded-xl animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-2">
        <div>
          <h3 className="text-xl font-bold text-pink-300">
            🧠 Analisis Kepribadian & Dimensi Psikologis
          </h3>
          <p className="text-xs text-gray-300 mt-1">
            Visualisasi 5 pilar energi psikologis untuk {zodiak.namaUser || zodiak.nama}
          </p>
        </div>
        <div className="text-xs bg-purple-500/20 border border-purple-400/30 px-3 py-1 rounded-full text-purple-200">
          Model Analisis 5-Dimensi
        </div>
      </div>

      {/* Radar Chart Section */}
      <div className="bg-black/30 p-4 md:p-6 rounded-2xl border border-white/10 mb-8">
        <h4 className="font-semibold text-sm text-center text-gray-200 mb-2">
          🕸️ Radar Potensi Diri
        </h4>
        <div className="w-full h-72 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
              <PolarGrid stroke="#ffffff25" />
              <PolarAngleAxis dataKey="subject" stroke="#f472b6" tick={{ fill: "#e2e8f0", fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#ffffff30" tick={{ fill: "#94a3b8", fontSize: 10 }} />
              <Radar
                name="Potensi"
                dataKey="value"
                stroke="#ec4899"
                fill="#ec4899"
                fillOpacity={0.45}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-center text-gray-400 mt-2">
          {zodiak.kepribadian.deskripsi}
        </p>
      </div>

      {/* Progress Bars Breakdown */}
      <div className="mb-8">
        <h4 className="font-bold mb-4 text-base text-gray-200">Rincian Persentase Energi</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <ProgressBar value={zodiak.kepribadian.intelektual} label="Kecerdasan & Logika" color="bg-gradient-to-r from-blue-500 to-cyan-500" />
            <ProgressBar value={zodiak.kepribadian.emosional} label="Kestabilan Emosional" color="bg-gradient-to-r from-purple-500 to-pink-500" />
            <ProgressBar value={zodiak.kepribadian.spiritual} label="Spiritualitas & Intuisi" color="bg-gradient-to-r from-indigo-500 to-violet-500" />
          </div>
          <div>
            <ProgressBar value={zodiak.kepribadian.sosial} label="Keterampilan Sosial" color="bg-gradient-to-r from-green-500 to-emerald-500" />
            <ProgressBar value={zodiak.kepribadian.fisik} label="Energi & Vitalitas Fisik" color="bg-gradient-to-r from-red-500 to-orange-500" />
          </div>
        </div>
      </div>

      {/* Career & Self Development */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 p-4 rounded-xl border border-blue-400/20">
          <h4 className="font-bold mb-3 text-sm md:text-base flex items-center gap-2">
            <span>🎯</span> Bidang Karir Terbaik
          </h4>
          <ul className="text-sm space-y-2">
            {zodiak.karir_terbaik.slice(0, 5).map((karir, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="text-blue-400 font-bold">•</span> {karir}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-4 rounded-xl border border-purple-400/20">
          <h4 className="font-bold mb-3 text-sm md:text-base flex items-center gap-2">
            <span>💡</span> Tips Pengembangan Karakter
          </h4>
          <ul className="text-sm space-y-2">
            {zodiak.kelemahan.slice(0, 3).map((kelemahan, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-pink-400 mt-0.5">⚠️</span>
                <span>Waspadai: <span className="font-medium text-pink-200">{kelemahan}</span></span>
              </li>
            ))}
            <li className="flex items-start gap-2 mt-3 pt-2 border-t border-white/10">
              <span className="text-green-400 mt-0.5">🌟</span>
              <span>Maksimalkan: <span className="font-semibold text-green-300">{zodiak.kekuatan[0]}</span></span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
