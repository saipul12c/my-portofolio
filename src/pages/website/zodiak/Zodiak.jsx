import React, { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";

import { karakterNama } from "./data/karakterNama";
import { moodHarian } from "./data/moodHarian";
import zodiakData from "./data/zodiakData";

import { useSessionId } from "./hooks/useSessionId";
import { useIsMobile } from "./hooks/useIsMobile";
import { useUserData } from "./hooks/useUserData";
import { useSavedProfiles } from "./hooks/useSavedProfiles";

import { extractDate, getZodiakByDate } from "./utils/dateUtils";
import { hitungNumerologi } from "./utils/numerology";
import { analisisKompatibilitas, analisisHubunganElemen } from "./utils/compatibility";
import { hitungSkorKosmis } from "./utils/cosmic";
import { analisisKepribadian } from "./utils/personality";

import { GridView } from "./components/GridView";
import { DetailView } from "./components/DetailView";

export default function Zodiak() {
  const [input, setInput] = useState("");
  const [warning, setWarning] = useState("");
  const [zodiak, setZodiak] = useState(null);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [activeTab, setActiveTab] = useState("profile");
  const inputRef = useRef(null);

  const sessionId = useSessionId();
  const isMobile = useIsMobile();
  const [userData, setUserData] = useUserData(sessionId);
  const { profiles, saveProfile, deleteProfile } = useSavedProfiles();

  // Fokus ke input saat kembali ke grid
  useEffect(() => {
    if (viewMode === "grid" && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [viewMode]);

  const runAnalysis = (nama, tanggalLahir) => {
    setLoading(true);
    setZodiak(null);
    setViewMode("detail");
    setActiveTab("profile");

    setTimeout(() => {
      try {
        const namaZodiak = getZodiakByDate(tanggalLahir);
        const data = zodiakData.find((z) => z.nama === namaZodiak);

        if (!data) {
          setZodiak({
            error: true,
            message: "⚠️ Tidak dapat menemukan zodiak untuk tanggal tersebut. Pastikan tanggal lahir valid."
          });
          setLoading(false);
          return;
        }

        const hurufAwal = nama.trim().charAt(0).toUpperCase();
        const namaAnalisis = karakterNama[hurufAwal] || {
          sifat: "Unik dan penuh misteri",
          angka: 5,
          elemen: "Netral",
          simbol: "🌌",
          deskripsi: "Kepribadian yang menarik dan penuh kejutan"
        };

        const mood = moodHarian[new Date().getDay()];
        const numerology = hitungNumerologi(nama, tanggalLahir);
        const skorKosmis = hitungSkorKosmis(data, numerology);
        const kepribadian = analisisKepribadian(data, numerology);

        const kompatibilitasList = zodiakData
          .filter((z) => z.nama !== namaZodiak)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map((z) => ({
            zodiak: z.nama,
            simbol: z.simbol,
            elemen: z.elemen,
            ...analisisKompatibilitas(namaZodiak, z.nama)
          }));

        const userDataObj = {
          nama,
          tanggalLahir: tanggalLahir.toISOString(),
          zodiak: namaZodiak,
          dataLengkap: data,
          sessionId,
          lastUpdated: new Date().toISOString()
        };
        setUserData(userDataObj);
        localStorage.setItem(`zodiakUserData_${sessionId}`, JSON.stringify(userDataObj));

        // Simpan ke daftar multi-profil
        saveProfile({
          nama,
          tanggalLahir: tanggalLahir.toISOString(),
          zodiak: namaZodiak,
          simbol: data.simbol,
          elemen: data.elemen
        });

        // Trigger confetti jika skor kosmis bagus
        if (skorKosmis?.nilai >= 70) {
          try {
            confetti({
              particleCount: 75,
              spread: 70,
              origin: { y: 0.6 },
              colors: ["#ec4899", "#8b5cf6", "#3b82f6", "#10b981", "#f59e0b"]
            });
          } catch {
            // ignore
          }
        }

        setZodiak({
          ...data,
          namaUser: nama,
          hurufAwal,
          sifatNama: `${namaAnalisis.sifat} ${namaAnalisis.simbol}`,
          deskripsiNama: namaAnalisis.deskripsi,
          mood: `${mood.mood} ${mood.simbol}`,
          moodEnergi: mood.energi,
          moodWarna: mood.warna,
          numerology,
          skorKosmis,
          kepribadian,
          kompatibilitasList,
          tanggalAnalisis: new Date().toLocaleDateString("id-ID", {
            weekday: "long", year: "numeric", month: "long", day: "numeric"
          }),
          isUserZodiak: true,
          userZodiak: namaZodiak,
          inputMethod: "text"
        });
      } catch (error) {
        console.error("Error in runAnalysis:", error);
        setZodiak({ error: true, message: "⚠️ Terjadi kesalahan dalam menganalisis data. Silakan coba lagi." });
      }
      setLoading(false);
    }, 1200);
  };

  const handleCek = () => {
    if (!input.trim()) {
      alert("Silakan masukkan nama dan tanggal lahir Anda!");
      return;
    }

    const words = input.trim().split(" ");
    const fillerWords = ["namaku", "nama", "saya", "aku", "lahir", "lahirnya", "tanggal", "tgl", "born", "birth"];

    let nama = "";
    for (let word of words) {
      const cleanWord = word.toLowerCase().replace(/[^a-z]/g, "");
      if (cleanWord && !fillerWords.includes(cleanWord) && !/\d/.test(word)) {
        nama = word;
        break;
      }
    }
    if (!nama && words.length > 0) nama = words[0];

    const tanggalLahir = extractDate(input);

    if (!tanggalLahir) {
      setZodiak({
        error: true,
        message: "⚠️ Tidak dapat mengenali tanggal lahir. Contoh format: 'Namaku Rina lahir 17 Mei 2001' atau '17/05/2001'"
      });
      setViewMode("detail");
      return;
    }

    runAnalysis(nama, tanggalLahir);
  };

  const handleQuickSelectProfile = (prof) => {
    if (!prof) return;
    setInput(`${prof.nama} lahir ${new Date(prof.tanggalLahir).toLocaleDateString("id-ID")}`);
    runAnalysis(prof.nama, new Date(prof.tanggalLahir));
  };

  const handleSelectZodiak = (data) => {
    if (!data) return;
    if (!input.trim() && !userData) {
      setWarning("Masukkan data Anda terlebih dahulu sebelum memilih zodiak.");
      setTimeout(() => setWarning(""), 3000);
      return;
    }

    setLoading(true);
    setViewMode("detail");
    setActiveTab("profile");

    setTimeout(() => {
      try {
        const mood = moodHarian[new Date().getDay()];
        let nama = "Pengunjung";
        let tanggalLahir = new Date();
        let numerology = hitungNumerologi("", new Date());

        if (userData) {
          nama = userData.nama;
          try {
            tanggalLahir = new Date(userData.tanggalLahir);
            if (isNaN(tanggalLahir.getTime())) tanggalLahir = new Date();
          } catch {
            tanggalLahir = new Date();
          }
          numerology = hitungNumerologi(nama, tanggalLahir);
        }

        const isUserZodiak = userData && userData.zodiak === data.nama;
        const skorKosmis = hitungSkorKosmis(data, numerology);
        const kepribadian = analisisKepribadian(data, numerology);

        const kompatibilitasList = zodiakData
          .filter((z) => z.nama !== data.nama)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map((z) => ({
            zodiak: z.nama,
            simbol: z.simbol,
            elemen: z.elemen,
            ...analisisKompatibilitas(data.nama, z.nama)
          }));

        let analisisHubungan = "";
        if (userData && userData.dataLengkap) {
          analisisHubungan = analisisHubunganElemen(userData.dataLengkap.elemen, data.elemen);
        }

        const hurufAwal = nama.charAt(0).toUpperCase();
        const namaAnalisis = karakterNama[hurufAwal] || {
          sifat: "Unik dan penuh misteri",
          simbol: "🌌",
          deskripsi: "Kepribadian yang menarik"
        };

        setZodiak({
          ...data,
          namaUser: nama,
          hurufAwal,
          sifatNama: userData ? `${namaAnalisis.sifat} ${namaAnalisis.simbol}` : "Pilih zodiak untuk analisis lengkap",
          deskripsiNama: namaAnalisis.deskripsi,
          mood: `${mood.mood} ${mood.simbol}`,
          moodEnergi: mood.energi,
          moodWarna: mood.warna,
          numerology,
          skorKosmis,
          kepribadian,
          kompatibilitasList,
          analisisHubungan,
          tanggalAnalisis: new Date().toLocaleDateString("id-ID", {
            weekday: "long", year: "numeric", month: "long", day: "numeric"
          }),
          isUserZodiak,
          userZodiak: userData?.zodiak || "Belum diatur",
          inputMethod: "grid",
          perbandinganDenganUser: userData
            ? {
              zodiakUser: userData.zodiak,
              zodiakDipilih: data.nama,
              sama: isUserZodiak,
              deskripsi: isUserZodiak
                ? `Ini adalah zodiak Anda (${data.nama}) berdasarkan tanggal lahir.`
                : `Anda sedang menganalisis zodiak ${data.nama}, sementara zodiak Anda berdasarkan tanggal lahir adalah ${userData.zodiak}.`
            }
            : null
        });
      } catch (error) {
        console.error("Error in handleSelectZodiak:", error);
        setZodiak({ error: true, message: "⚠️ Terjadi kesalahan dalam memuat data zodiak." });
      }
      setLoading(false);
    }, 600);
  };

  const handleBackToGrid = () => {
    setViewMode("grid");
    setZodiak(null);
  };

  const handleClearUserData = () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data pribadi Anda?")) {
      setUserData(null);
      localStorage.removeItem(`zodiakUserData_${sessionId}`);
      setInput("");
      alert("Data pribadi telah dihapus.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d051f] via-[#2a0b43] to-[#4a1b6a] flex flex-col items-center justify-start text-white p-4 md:p-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_#ffffff15,_transparent_50%)] opacity-30 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-br from-transparent via-purple-900/5 to-transparent pointer-events-none"></div>

      {/* Header */}
      <div className="z-10 text-center w-full max-w-5xl mx-auto mt-4 md:mt-8">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-3 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent drop-shadow-lg">
          ✨ Zodiak Intelligence Pro
        </h1>
        <p className="text-sm md:text-base text-gray-300 mb-6 px-4">
          Analisis zodiak lengkap dengan radar kepribadian, tarot harian, kecocokan pasangan, numerologi, dan shio
        </p>
      </div>

      {/* Search Box */}
      <div className="z-10 w-full max-w-2xl mx-auto">
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg p-4 md:p-6 rounded-2xl shadow-2xl border border-white/20">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                placeholder="Contoh: 'Namaku Rina lahir 17 Mei 2001' atau '17/05/2001'..."
                className="w-full p-4 rounded-xl text-center md:text-left bg-white/15 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm md:text-base border border-white/10 focus:border-pink-400/50 transition-all"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCek()}
              />
              {userData && (
                <div className="text-[11px] text-gray-300 text-center md:text-left mt-1.5">
                  👤 Profil aktif: <span className="font-semibold text-pink-300">{userData.nama}</span> ({userData.zodiak})
                </div>
              )}
              {warning && (
                <div className="text-xs text-red-400 text-center mt-1 animate-pulse">
                  {warning}
                </div>
              )}
            </div>
            <button
              onClick={handleCek}
              disabled={loading}
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-purple-600 hover:to-pink-600 px-6 py-4 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base transform hover:scale-[1.02] active:scale-95"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⟳</span> Menganalisis...
                </span>
              ) : (
                "🔮 Cek Zodiak Saya"
              )}
            </button>
          </div>

          {/* Quick-Access Saved Profiles */}
          {profiles && profiles.length > 0 && (
            <div className="mt-4 pt-3 border-t border-white/10">
              <div className="flex items-center justify-between text-xs text-gray-300 mb-2">
                <span>👥 Profil Tersimpan:</span>
                <span className="text-[11px] text-gray-400">Klik untuk langsung analisis</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {profiles.map((p) => (
                  <div
                    key={p.id}
                    className="group flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/15 px-3 py-1.5 rounded-full text-xs cursor-pointer transition-all hover:scale-105 active:scale-95"
                  >
                    <span onClick={() => handleQuickSelectProfile(p)} className="flex items-center gap-1">
                      <span>{p.simbol}</span>
                      <span className="font-semibold text-white">{p.nama}</span>
                      <span className="text-pink-300 text-[11px]">({p.zodiak})</span>
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteProfile(p.id);
                      }}
                      className="ml-1 text-gray-400 hover:text-red-400 text-xs rounded-full p-0.5"
                      title="Hapus profil"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="text-xs text-gray-300 mt-4 text-center">
            Atau pilih langsung dari daftar zodiak di bawah ↓
          </p>
        </div>
      </div>

      {/* Loading Indicator */}
      {loading && viewMode === "detail" && (
        <div className="z-10 mt-8 flex flex-col items-center gap-4 animate-pulse">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-t-transparent border-pink-400 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl animate-pulse">✨</span>
            </div>
          </div>
          <p className="text-sm italic text-gray-200">
            Menganalisis data zodiak, numerologi, dan kepribadian...
          </p>
          <div className="flex gap-2">
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="z-10 w-full max-w-7xl mx-auto mt-8">
        {viewMode === "grid" ? (
          <GridView
            userData={userData}
            isMobile={isMobile}
            onSelectZodiak={handleSelectZodiak}
            onClearUserData={handleClearUserData}
          />
        ) : (
          <DetailView
            zodiak={zodiak}
            userData={userData}
            sessionId={sessionId}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onBack={handleBackToGrid}
          />
        )}
      </div>

      {/* Footer */}
      <div className="z-10 mt-8 md:mt-12 text-center text-xs text-gray-400 pb-6 px-4">
        <p className="mb-2">
          Sistem sinkronisasi data • Analisis numerologi • Radar kepribadian • Tarot kosmis • Cek kecocokan cinta • Shio Timur
        </p>
        <p>✨ Data disimpan secara lokal di browser Anda • Hanya untuk tujuan hiburan dan pengembangan diri</p>
      </div>
    </div>
  );
}
