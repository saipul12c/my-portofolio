import React, { useState } from "react";
import { getElementColor } from "../utils/elementColors";
import { getChineseZodiac } from "../utils/chineseZodiac";
import { TabNavigation } from "./TabNavigation";
import { ProfileTab } from "./tabs/ProfileTab";
import { NumerologyTab } from "./tabs/NumerologyTab";
import { CompatibilityTab } from "./tabs/CompatibilityTab";
import { PersonalityTab } from "./tabs/PersonalityTab";
import { InsightsTab } from "./tabs/InsightsTab";
import { TarotTab } from "./tabs/TarotTab";
import { CoupleMatcherTab } from "./tabs/CoupleMatcherTab";
import { ShareModal } from "./ShareModal";

export const DetailView = ({ zodiak, userData, sessionId, activeTab, onTabChange, onBack }) => {
  const [isShareOpen, setIsShareOpen] = useState(false);

  if (!zodiak) return null;

  if (zodiak.error) {
    return (
      <div className="z-10 mt-8 p-6 bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-300/30 rounded-2xl shadow-xl max-w-md mx-auto">
        <div className="text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-red-200 mb-2">Oops!</h3>
          <p className="text-red-200 mb-4">{zodiak.message}</p>
          <button
            onClick={onBack}
            className="mt-4 px-6 py-2 bg-gradient-to-r from-gray-600 to-gray-800 rounded-lg font-semibold hover:opacity-90 transition-all"
          >
            Kembali ke Daftar
          </button>
        </div>
      </div>
    );
  }

  const birthDate = userData?.tanggalLahir || (zodiak.tanggalAnalisis ? new Date() : null);
  const shioData = getChineseZodiac(birthDate);

  return (
    <div className="z-10 mt-8 w-full max-w-6xl mx-auto animate-fadeIn">
      {/* Top Action Bar */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 border border-white/10 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 hover:scale-105 active:scale-95 shadow-md"
        >
          ← Kembali ke Daftar Zodiak
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsShareOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 rounded-xl font-semibold text-xs md:text-sm transition-all flex items-center gap-1.5 shadow-lg hover:scale-105 active:scale-95 border border-pink-400/30"
          >
            <span>✨</span> <span>Bagikan Hasil Profil</span>
          </button>
          {userData && (
            <div className="hidden md:block text-xs text-gray-400 bg-black/30 px-3 py-2 rounded-xl border border-white/10">
              Sesi: <span className="text-pink-300 font-mono">{sessionId?.substring(0, 8)}...</span>
            </div>
          )}
        </div>
      </div>

      {userData && (
        <div
          className={`mb-6 p-4 rounded-xl ${
            zodiak.isUserZodiak
              ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-300/30"
              : "bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-300/30"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`text-2xl ${zodiak.isUserZodiak ? "text-green-400" : "text-yellow-400"}`}>
              {zodiak.isUserZodiak ? "✅" : "🔍"}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm md:text-base">
                {zodiak.isUserZodiak
                  ? `Ini adalah zodiak Anda (${zodiak.nama})`
                  : `Anda sedang melihat zodiak ${zodiak.nama}`}
              </p>
              <p className="text-xs md:text-sm mt-1 opacity-90 text-gray-200">
                {zodiak.isUserZodiak
                  ? `Sesuai dengan data input: ${userData.nama} (lahir ${new Date(userData.tanggalLahir).toLocaleDateString("id-ID")})`
                  : `Zodiak Anda berdasarkan tanggal lahir adalah ${userData.zodiak}. Ini adalah analisis komparatif.`}
              </p>
              {!zodiak.isUserZodiak && zodiak.analisisHubungan && (
                <p className="text-xs md:text-sm mt-2 italic border-t border-white/10 pt-2 text-yellow-200">
                  💡 {zodiak.analisisHubungan}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Card View */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
        <div className={`${getElementColor(zodiak.elemen)} p-6 text-center relative overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          <div className="relative z-10">
            <div className="text-7xl mb-2 animate-pulse">{zodiak.simbol}</div>
            <h2 className="text-4xl md:text-5xl font-bold text-white drop-shadow-md mb-2">{zodiak.nama}</h2>
            <p className="text-lg text-white/90 mb-1">{zodiak.nama_latin}</p>
            <p className="text-sm text-white/80 mb-4">{zodiak.tanggal}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
              <div className="bg-black/30 p-3 rounded-xl border border-white/10">
                <div className="text-xl font-bold">{zodiak.skorKosmis?.nilai || 0}/100</div>
                <div className="text-xs text-gray-300">Skor Kosmis</div>
              </div>
              <div className="bg-black/30 p-3 rounded-xl border border-white/10">
                <div className="text-xl font-bold">{zodiak.elemen}</div>
                <div className="text-xs text-gray-300">Elemen</div>
              </div>
              <div className="bg-black/30 p-3 rounded-xl border border-white/10">
                <div className="text-xl font-bold">{zodiak.kualitas}</div>
                <div className="text-xs text-gray-300">Kualitas</div>
              </div>
              <div className="bg-black/30 p-3 rounded-xl border border-white/10">
                <div className="text-xl font-bold">{zodiak.moodEnergi}</div>
                <div className="text-xs text-gray-300">Energi Hari Ini</div>
              </div>
            </div>

            <div
              className={`mt-4 inline-block px-4 py-2 rounded-full ${
                zodiak.skorKosmis?.warna || "from-gray-500 to-gray-700"
              } bg-gradient-to-r shadow`}
            >
              <div className="text-sm font-semibold">{zodiak.skorKosmis?.deskripsi}</div>
              <div className="text-xs mt-0.5">{zodiak.skorKosmis?.emoji}</div>
            </div>
          </div>
        </div>

        <div className="p-4 md:p-6">
          <TabNavigation activeTab={activeTab} onTabChange={onTabChange} />

          {activeTab === "profile" && <ProfileTab zodiak={zodiak} userData={userData} />}
          {activeTab === "numerology" && zodiak.numerology && <NumerologyTab zodiak={zodiak} />}
          {activeTab === "personality" && zodiak.kepribadian && <PersonalityTab zodiak={zodiak} />}
          {activeTab === "tarot" && <TarotTab zodiak={zodiak} />}
          {activeTab === "couple" && <CoupleMatcherTab zodiak={zodiak} userData={userData} />}
          {activeTab === "compatibility" && zodiak.kompatibilitasList && <CompatibilityTab zodiak={zodiak} />}
          {activeTab === "insights" && <InsightsTab zodiak={zodiak} />}

          <div className="mt-8 pt-6 border-t border-white/10 text-center text-sm text-gray-300">
            <p>
              💡 Analisis untuk:{" "}
              <span className="font-semibold text-white">
                {zodiak.namaUser ? `${zodiak.namaUser} (${zodiak.nama})` : `Profil ${zodiak.nama}`}
              </span>
            </p>
            <p className="mt-1.5 text-xs text-gray-300">
              Tanggal analisis: <span className="font-semibold text-gray-200">{zodiak.tanggalAnalisis}</span>
            </p>
            {zodiak.isUserZodiak !== undefined && (
              <p className="mt-1.5 text-xs">
                Status:{" "}
                <span className={`font-semibold ${zodiak.isUserZodiak ? "text-green-400" : "text-yellow-400"}`}>
                  {zodiak.isUserZodiak ? "✅ Zodiak Anda" : "🔍 Analisis Komparatif"}
                </span>
              </p>
            )}
            <p className="mt-3 text-xs text-gray-400">
              Data disimpan secara lokal di browser Anda • Sesi: {sessionId?.substring(0, 12)}...
            </p>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        zodiak={zodiak}
        userData={userData}
        shioData={shioData}
      />
    </div>
  );
};
