import React, { useState } from "react";
import confetti from "canvas-confetti";
import zodiakData from "../../data/zodiakData";
import { extractDate, getZodiakByDate } from "../../utils/dateUtils";
import { analisisKompatibilitas, analisisHubunganElemen } from "../../utils/compatibility";
import { ProgressBar } from "../ProgressBar";

export const CoupleMatcherTab = ({ zodiak, userData }) => {
  const [partnerInput, setPartnerInput] = useState("");
  const [partnerZodiac, setPartnerZodiac] = useState(zodiakData[0].nama);
  const [partnerName, setPartnerName] = useState("");
  const [result, setResult] = useState(null);
  const [inputMode, setInputMode] = useState("select"); // 'select' or 'text'

  const userZodiacName = zodiak.nama;
  const currentUserName = userData?.nama || zodiak.namaUser || "Anda";

  const handleCalculateMatch = (targetZodiac, name) => {
    const dataPasangan = zodiakData.find((z) => z.nama === targetZodiac);
    if (!dataPasangan) return;

    const baseAnalisis = analisisKompatibilitas(userZodiacName, targetZodiac);
    const hubunganElemen = analisisHubunganElemen(zodiak.elemen, dataPasangan.elemen);

    // Hitung sub-skor
    const loveScore = Math.min(100, Math.max(30, baseAnalisis.skor + (baseAnalisis.elemenMatch ? 10 : -5)));
    const commScore = Math.min(100, Math.max(35, Math.round((baseAnalisis.skor * 0.9) + (zodiak.elemen === dataPasangan.elemen ? 15 : 5))));
    const commitScore = Math.min(100, Math.max(40, Math.round(baseAnalisis.skor * 0.95 + 5)));

    const namaPasanganFinal = name.trim() || targetZodiac;

    const res = {
      namaPasangan: namaPasanganFinal,
      zodiakPasangan: dataPasangan,
      skorTotal: baseAnalisis.skor,
      loveScore,
      commScore,
      commitScore,
      level: baseAnalisis.level,
      levelColor: baseAnalisis.levelColor,
      hubunganElemen,
      kekuatan: baseAnalisis.kekuatan,
      kelemahan: baseAnalisis.kelemahan,
      tips: baseAnalisis.tips
    };

    setResult(res);

    if (baseAnalisis.skor >= 75) {
      try {
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#ec4899", "#f43f5e", "#a855f7"]
        });
      } catch {
        // ignore
      }
    }
  };

  const handleParseText = () => {
    if (!partnerInput.trim()) return;

    const date = extractDate(partnerInput);
    let detectedZodiac = null;
    let name = "";

    const words = partnerInput.trim().split(" ");
    for (const w of words) {
      const clean = w.toLowerCase().replace(/[^a-z]/g, "");
      if (clean && !["namaku", "nama", "pasangan", "dia", "lahir", "tanggal"].includes(clean) && !/\d/.test(w)) {
        name = w;
        break;
      }
    }

    if (date) {
      detectedZodiac = getZodiakByDate(date);
    } else {
      // Coba cari nama zodiak langsung di teks
      const found = zodiakData.find((z) => partnerInput.toLowerCase().includes(z.nama.toLowerCase()));
      if (found) detectedZodiac = found.nama;
    }

    if (detectedZodiac) {
      handleCalculateMatch(detectedZodiac, name || "Pasangan");
    } else {
      alert("Format tanggal tidak dikenali. Silakan gunakan format tanggal (cth: 'Siti lahir 20 Agustus 2002') atau gunakan opsi Pilih Zodiak.");
    }
  };

  return (
    <div className="bg-white/10 p-6 rounded-xl animate-fadeIn">
      <div className="text-center mb-6">
        <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-pink-400 via-rose-300 to-purple-400 bg-clip-text text-transparent mb-2">
          💖 Kalkulator Kecocokan Pasangan & Hubungan
        </h3>
        <p className="text-sm text-gray-300">
          Cari tahu harmoni asmara, komunikasi, dan komitmen antara <strong>{currentUserName} ({userZodiacName})</strong> dengan orang spesialmu.
        </p>
      </div>

      {/* Input Mode Selector */}
      <div className="max-w-xl mx-auto mb-6 bg-black/30 p-4 rounded-2xl border border-white/10">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setInputMode("select")}
            className={`flex-1 py-2 text-xs md:text-sm font-semibold rounded-lg transition-all ${
              inputMode === "select"
                ? "bg-pink-500 text-white shadow-lg"
                : "bg-white/5 text-gray-300 hover:bg-white/10"
            }`}
          >
            Pilih Langsung Zodiak Pasangan
          </button>
          <button
            onClick={() => setInputMode("text")}
            className={`flex-1 py-2 text-xs md:text-sm font-semibold rounded-lg transition-all ${
              inputMode === "text"
                ? "bg-pink-500 text-white shadow-lg"
                : "bg-white/5 text-gray-300 hover:bg-white/10"
            }`}
          >
            Input Teks & Tanggal Lahir
          </button>
        </div>

        {inputMode === "select" ? (
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-300 block mb-1">Nama Pasangan / Gebetan (Opsional):</label>
              <input
                type="text"
                placeholder="Contoh: Rian, Alya, dsb."
                value={partnerName}
                onChange={(e) => setPartnerName(e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>
            <div>
              <label className="text-xs text-gray-300 block mb-1">Pilih Zodiak Pasangan:</label>
              <select
                value={partnerZodiac}
                onChange={(e) => setPartnerZodiac(e.target.value)}
                className="w-full px-3 py-2 bg-gray-900 border border-white/20 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
              >
                {zodiakData.map((item) => (
                  <option key={item.id} value={item.nama}>
                    {item.simbol} {item.nama} ({item.tanggal}) - Elemen {item.elemen}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => handleCalculateMatch(partnerZodiac, partnerName)}
              className="w-full mt-2 py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 font-semibold text-sm rounded-xl transition-all shadow-lg hover:scale-[1.02] active:scale-95"
            >
              💘 Analisis Kecocokan Cinta
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-300 block mb-1">Ketik Nama & Tanggal Lahir Pasangan:</label>
              <input
                type="text"
                placeholder="Contoh: 'Siti lahir 14 Februari 2002' atau 'Rian 23/10/2000'..."
                value={partnerInput}
                onChange={(e) => setPartnerInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleParseText()}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>
            <button
              onClick={handleParseText}
              className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 font-semibold text-sm rounded-xl transition-all shadow-lg hover:scale-[1.02] active:scale-95"
            >
              💘 Analisis Kecocokan Cinta
            </button>
          </div>
        )}
      </div>

      {/* Match Result Display */}
      {result && (
        <div className="max-w-3xl mx-auto mt-6 animate-fadeIn space-y-6">
          <div className="p-6 bg-gradient-to-br from-pink-900/30 via-purple-900/30 to-black/40 rounded-2xl border-2 border-pink-400/40 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-around gap-6 text-center border-b border-white/10 pb-6">
              <div>
                <div className="text-5xl mb-2">{zodiak.simbol}</div>
                <h4 className="font-bold text-lg text-white">{currentUserName}</h4>
                <p className="text-xs text-pink-300">{zodiak.nama} ({zodiak.elemen})</p>
              </div>

              <div className="flex flex-col items-center">
                <span className="text-3xl animate-bounce">💞</span>
                <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-rose-300 to-yellow-300 mt-1">
                  {result.skorTotal}%
                </div>
                <span className={`text-xs font-bold uppercase tracking-wider px-3 py-0.5 rounded-full mt-1 ${result.levelColor} bg-black/40 border border-white/10`}>
                  {result.level}
                </span>
              </div>

              <div>
                <div className="text-5xl mb-2">{result.zodiakPasangan.simbol}</div>
                <h4 className="font-bold text-lg text-white">{result.namaPasangan}</h4>
                <p className="text-xs text-purple-300">{result.zodiakPasangan.nama} ({result.zodiakPasangan.elemen})</p>
              </div>
            </div>

            {/* 3 Pillars of Match */}
            <div className="my-6 space-y-3 max-w-xl mx-auto">
              <h5 className="font-bold text-sm text-pink-300 mb-3 text-center">3 Pilar Kecocokan Hubungan</h5>
              <ProgressBar value={result.loveScore} label="❤️ Asmara & Chemistry" color="bg-gradient-to-r from-rose-500 to-pink-500" />
              <ProgressBar value={result.commScore} label="💬 Komunikasi & Saling Mengerti" color="bg-gradient-to-r from-blue-400 to-cyan-400" />
              <ProgressBar value={result.commitScore} label="💍 Visi & Komitmen Jangka Panjang" color="bg-gradient-to-r from-purple-500 to-emerald-400" />
            </div>

            {/* Element Chemistry */}
            <div className="p-4 bg-black/30 rounded-xl border border-white/10 text-xs md:text-sm text-gray-200">
              <p className="font-semibold text-yellow-300 mb-1">⚡ Dinamika Elemen ({zodiak.elemen} + {result.zodiakPasangan.elemen}):</p>
              <p className="italic">{result.hubunganElemen}</p>
            </div>

            {/* Strengths & Tips */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="p-4 bg-green-500/10 rounded-xl border border-green-400/20">
                <h5 className="font-bold text-xs uppercase text-green-300 mb-2">🌟 Kekuatan Pasangan Ini</h5>
                <ul className="text-xs space-y-1.5 text-gray-200">
                  {result.kekuatan.map((k, idx) => (
                    <li key={idx} className="flex items-start gap-1">
                      <span>✓</span> <span>{k}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-400/20">
                <h5 className="font-bold text-xs uppercase text-blue-300 mb-2">💡 Tips Menjaga Hubungan</h5>
                <ul className="text-xs space-y-1.5 text-gray-200">
                  {result.tips.map((t, idx) => (
                    <li key={idx} className="flex items-start gap-1">
                      <span>•</span> <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
