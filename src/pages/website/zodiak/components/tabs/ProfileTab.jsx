import React from "react";
import { getChineseZodiac } from "../../utils/chineseZodiac";

export const ProfileTab = ({ zodiak, userData }) => {
  const birthDate = userData?.tanggalLahir || (zodiak.tanggalAnalisis ? new Date() : null);
  const shioData = getChineseZodiac(birthDate);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Kolom Profil Barat */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom 1 */}
        <div className="space-y-4">
          <div className="bg-white/10 p-4 rounded-xl border border-white/10">
            <h3 className="text-lg font-bold text-pink-300 mb-3 flex items-center gap-2">
              <span>📊</span> Profil Zodiak Barat
            </h3>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span className="font-semibold text-gray-300">Elemen:</span>
                <span className="text-white font-medium">{zodiak.elemen}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span className="font-semibold text-gray-300">Kualitas:</span>
                <span className="text-white font-medium">{zodiak.kualitas}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span className="font-semibold text-gray-300">Planet Penguasa:</span>
                <span className="text-white font-medium">
                  {Array.isArray(zodiak.planet_penguasa) ? zodiak.planet_penguasa.join(", ") : zodiak.planet_penguasa}
                </span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span className="font-semibold text-gray-300">Musim:</span>
                <span className="text-white font-medium">{zodiak.musim}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span className="font-semibold text-gray-300">Fase Bulan:</span>
                <span className="text-white font-medium">{zodiak.fase_bulan}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-300">Bagian Tubuh:</span>
                <span className="text-white font-medium">{zodiak.bagian_tubuh}</span>
              </div>
            </div>
          </div>

          <div className="bg-white/10 p-4 rounded-xl border border-white/10">
            <h3 className="text-lg font-bold text-pink-300 mb-3 flex items-center gap-2">
              <span>💎</span> Keberuntungan
            </h3>
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-gray-300 text-xs">Warna:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {zodiak.warna_keberuntungan?.map((warna, idx) => (
                    <span key={idx} className="text-xs bg-white/10 px-3 py-1 rounded-full">{warna}</span>
                  ))}
                </div>
              </div>
              <div>
                <span className="font-semibold text-gray-300 text-xs">Batu Permata:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {zodiak.batu_keberuntungan?.map((batu, idx) => (
                    <span key={idx} className="text-xs bg-white/10 px-3 py-1 rounded-full">{batu}</span>
                  ))}
                </div>
              </div>
              <div>
                <span className="font-semibold text-gray-300 text-xs">Angka:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {zodiak.angka_keberuntungan?.map((angka, idx) => (
                    <span key={idx} className="text-xs bg-white/10 px-3 py-1 rounded-full font-bold text-yellow-300">{angka}</span>
                  ))}
                </div>
              </div>
              <div>
                <span className="font-semibold text-gray-300 text-xs">Hari Terbaik:</span>
                <span className="ml-2 text-white font-medium text-xs">{zodiak.hari_keberuntungan}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom 2 */}
        <div className="space-y-4">
          <div className="bg-white/10 p-4 rounded-xl border border-white/10">
            <h3 className="text-lg font-bold text-pink-300 mb-3 flex items-center gap-2">
              <span>🌟</span> Karakteristik
            </h3>
            <div className="space-y-4">
              <div>
                <p className="font-semibold text-green-300 mb-2 text-xs uppercase tracking-wider">Kekuatan:</p>
                <div className="flex flex-wrap gap-2">
                  {zodiak.kekuatan?.map((k, idx) => (
                    <span key={idx} className="text-xs bg-green-500/20 text-green-200 border border-green-400/20 px-3 py-1.5 rounded-full">{k}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-semibold text-red-300 mb-2 text-xs uppercase tracking-wider">Kelemahan:</p>
                <div className="flex flex-wrap gap-2">
                  {zodiak.kelemahan?.map((k, idx) => (
                    <span key={idx} className="text-xs bg-red-500/20 text-red-200 border border-red-400/20 px-3 py-1.5 rounded-full">{k}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/10 p-4 rounded-xl border border-white/10">
            <h3 className="text-lg font-bold text-pink-300 mb-3 flex items-center gap-2">
              <span>❤️</span> Kecocokan Zodiak
            </h3>
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-gray-300 text-xs">Pasangan Terbaik:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {zodiak.kecocokan_terbaik?.map((k, idx) => (
                    <span key={idx} className="text-xs bg-purple-500/20 text-purple-200 px-3 py-1 rounded-full">{k}</span>
                  ))}
                </div>
              </div>
              <div>
                <span className="font-semibold text-gray-300 text-xs">Kecocokan Netral:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {zodiak.kecocokan_menengah?.map((k, idx) => (
                    <span key={idx} className="text-xs bg-blue-500/20 text-blue-200 px-3 py-1 rounded-full">{k}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom 3 */}
        <div className="space-y-4">
          <div className="bg-white/10 p-4 rounded-xl border border-white/10">
            <h3 className="text-lg font-bold text-pink-300 mb-3 flex items-center gap-2">
              <span>📖</span> Mitologi & Quote
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-semibold text-gray-300 text-xs">Mitologi Asal:</p>
                <p className="text-gray-200 mt-1 leading-relaxed">{zodiak.mitologi}</p>
              </div>
              <div className="pt-2 border-t border-white/10">
                <p className="font-semibold text-gray-300 text-xs">Motto Hidup:</p>
                <p className="italic text-pink-200 mt-1">"{zodiak.quote}"</p>
              </div>
              <div className="pt-2 border-t border-white/10">
                <p className="font-semibold text-gray-300 text-xs mb-1.5">Karakter Populer:</p>
                <div className="flex flex-wrap gap-1.5">
                  {zodiak.karakter_fiktif_terkenal?.map((k, idx) => (
                    <span key={idx} className="text-xs bg-pink-500/20 text-pink-200 px-2.5 py-1 rounded-full">{k}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bagian Harmoni Astrologi Timur (Shio & Elemen Wu Xing) */}
      {shioData && (
        <div className="bg-gradient-to-r from-red-950/40 via-amber-950/30 to-purple-950/40 p-5 rounded-2xl border border-amber-400/30 shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-amber-400/20 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{shioData.simbol}</span>
              <div>
                <h4 className="text-lg font-bold text-amber-300">
                  Astrologi Timur: Shio {shioData.kombinasi} ({shioData.tahun})
                </h4>
                <p className="text-xs text-gray-300">
                  Harmoni antara Horoskop Barat ({zodiak.nama}) dan Kalender Bulan Tionghoa
                </p>
              </div>
            </div>
            <div className="text-xs px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-200 font-semibold">
              Polaritas: {shioData.polaritas}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-black/30 p-3.5 rounded-xl border border-white/10">
              <div className="text-xs text-amber-300 font-semibold mb-1">Karakter Shio {shioData.shio}:</div>
              <p className="text-xs text-gray-200 leading-relaxed">{shioData.sifatShio}</p>
            </div>
            <div className="bg-black/30 p-3.5 rounded-xl border border-white/10">
              <div className="text-xs text-amber-300 font-semibold mb-1">
                Elemen Wu Xing ({shioData.elemenKelahiran} {shioData.simbolElemen}):
              </div>
              <p className="text-xs text-gray-200 leading-relaxed">{shioData.sifatElemen}</p>
            </div>
            <div className="bg-black/30 p-3.5 rounded-xl border border-white/10">
              <div className="text-xs text-amber-300 font-semibold mb-1">Sinergi Barat & Timur:</div>
              <p className="text-xs text-gray-200 leading-relaxed">
                Perpaduan elemen {zodiak.elemen} ({zodiak.nama}) dengan elemen {shioData.elemenKelahiran} ({shioData.shio}) menciptakan kepribadian yang tangguh dan kaya perspektif.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
